#!/usr/bin/env bash
# Compila SafeGo sin Gradle ni Android Studio:
#   - SafeGo.apk  → para instalar directo en el teléfono
#   - SafeGo.aab  → para subir a Google Play (Android App Bundle)
#   - SafeGo-sin-SMS.aab → plan B para Google Play si rechazan el permiso de SMS (los avisos abren WhatsApp/SMS con un toque)
# Requiere: JDK 17+, Node 18+, aapt2, dalvik-exchange (dx), zipalign, apksigner, jarsigner (paquetes de Ubuntu).
# Descarga android.jar (API 34) y bundletool si faltan.
#
# Firma: la llave NO vive en este repositorio. Indica dónde está y su contraseña:
#   KS_FILE=/ruta/transporteseguro.jks KS_PASS='...' bash build.sh
# Para un APK de prueba sin la llave del equipo: bash build.sh --nueva-llave
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
APP="$ROOT/app"
OUT="$ROOT/build"
SDK_JAR="${ANDROID_JAR:-$ROOT/sdk/android-34.jar}"
BUNDLETOOL="${BUNDLETOOL:-$ROOT/sdk/bundletool-1.18.1.jar}"
APP_ID="ec.safego.app"          # identificador en Google Play (no se puede cambiar después de publicar)
JAVA_PKG="ec.transporteseguro.app"  # paquete del código Java
KS_FILE="${KS_FILE:-}"
KS_PASS="${KS_PASS:-}"
KS_ALIAS="${KS_ALIAS:-transporteseguro}"

if [ "${1:-}" = "--nueva-llave" ]; then
  KS_FILE="$OUT-llave/llave-temporal.jks"; KS_PASS="temporal-$(date +%s)"; NEW_KEY=1
else
  NEW_KEY=0
  if [ -z "$KS_FILE" ] || [ ! -f "$KS_FILE" ] || [ -z "$KS_PASS" ]; then
    echo "Falta la llave de firma. Usa: KS_FILE=/ruta/transporteseguro.jks KS_PASS='...' bash build.sh" >&2
    echo "(o bash build.sh --nueva-llave para un APK de prueba)" >&2
    exit 2
  fi
fi

if [ ! -f "$SDK_JAR" ]; then
  mkdir -p "$(dirname "$SDK_JAR")"
  curl -fsSL -o "$SDK_JAR" https://raw.githubusercontent.com/Sable/android-platforms/master/android-34/android.jar
fi
if [ ! -f "$BUNDLETOOL" ]; then
  mkdir -p "$(dirname "$BUNDLETOOL")"
  curl -fsSL -o "$BUNDLETOOL" https://github.com/google/bundletool/releases/download/1.18.1/bundletool-all-1.18.1.jar
fi
rm -rf "$OUT"; mkdir -p "$OUT/gen" "$OUT/classes" "$OUT/module"

echo "1/9 Uniendo la interfaz (app/web-src → assets/www/app.js)"
{
  echo "/* ARCHIVO GENERADO por build.sh a partir de app/web-src/. No lo edites aquí. */"
  cat "$APP"/web-src/*.js
} > "$APP/assets/www/app.js"
node -e "new Function(require('fs').readFileSync('$APP/assets/www/app.js','utf8'))"

echo "2/9 Pruebas del planificador"
node "$ROOT/tests/planner.test.js" >/dev/null || { node "$ROOT/tests/planner.test.js"; exit 1; }

echo "3/9 Recursos (aapt2)"
aapt2 compile --dir "$APP/res" -o "$OUT/res.zip"
LINK_ARGS=(-I "$SDK_JAR" --manifest "$APP/AndroidManifest.xml" -A "$APP/assets"
  --rename-manifest-package "$APP_ID" --custom-package "$JAVA_PKG" "$OUT/res.zip")
aapt2 link -o "$OUT/base.apk" --java "$OUT/gen" "${LINK_ARGS[@]}"
aapt2 link --proto-format -o "$OUT/proto.apk" "${LINK_ARGS[@]}"

echo "4/9 Compilando Java"
javac -nowarn -Xlint:-options -encoding UTF-8 -source 8 -target 8 -bootclasspath "$SDK_JAR" -d "$OUT/classes" \
  $(find "$APP/java" "$OUT/gen" -name '*.java')

echo "5/9 Dex"
dalvik-exchange --dex --min-sdk-version=26 --output="$OUT/classes.dex" "$OUT/classes"

echo "6/9 APK"
cp "$OUT/base.apk" "$OUT/unsigned.apk"
(cd "$OUT" && zip -q -j unsigned.apk classes.dex)
zipalign -f -p 4 "$OUT/unsigned.apk" "$OUT/aligned.apk"

echo "7/9 Firmando el APK"
if [ "$NEW_KEY" = "1" ]; then
  mkdir -p "$(dirname "$KS_FILE")"
  keytool -genkeypair -keystore "$KS_FILE" -storepass "$KS_PASS" -keypass "$KS_PASS" -alias "$KS_ALIAS" \
    -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=SafeGo prueba" >/dev/null 2>&1
fi
export KS_PASS
apksigner sign --ks "$KS_FILE" --ks-pass "env:KS_PASS" --key-pass "env:KS_PASS" --ks-key-alias "$KS_ALIAS" \
  --v4-signing-enabled false --out "$ROOT/SafeGo.apk" "$OUT/aligned.apk"
apksigner verify "$ROOT/SafeGo.apk"

echo "8/9 Android App Bundle (Google Play)"
(cd "$OUT/module" && unzip -q ../proto.apk && mkdir -p manifest dex && mv AndroidManifest.xml manifest/ && cp ../classes.dex dex/ \
  && zip -q -r ../base-module.zip .)
rm -f "$ROOT/SafeGo.aab"
java -jar "$BUNDLETOOL" build-bundle --modules="$OUT/base-module.zip" --output="$OUT/unsigned.aab"
cp "$OUT/unsigned.aab" "$ROOT/SafeGo.aab"

echo "9/9 Firmando el AAB (llave de subida)"
jarsigner -keystore "$KS_FILE" -storepass:env KS_PASS -keypass:env KS_PASS -sigalg SHA256withRSA -digestalg SHA-256 \
  "$ROOT/SafeGo.aab" "$KS_ALIAS" >/dev/null
jarsigner -verify "$ROOT/SafeGo.aab" >/dev/null && echo "AAB firmado"

echo "Extra: AAB sin permiso de SMS (plan B si Google Play rechaza SEND_SMS)"
grep -v 'android.permission.SEND_SMS' "$APP/AndroidManifest.xml" > "$OUT/AndroidManifest-sin-sms.xml"
mkdir -p "$OUT/module-sin-sms"
aapt2 link --proto-format -o "$OUT/proto-sin-sms.apk" -I "$SDK_JAR" --manifest "$OUT/AndroidManifest-sin-sms.xml" -A "$APP/assets" \
  --rename-manifest-package "$APP_ID" --custom-package "$JAVA_PKG" "$OUT/res.zip"
(cd "$OUT/module-sin-sms" && unzip -q ../proto-sin-sms.apk && mkdir -p manifest dex && mv AndroidManifest.xml manifest/ && cp ../classes.dex dex/ \
  && zip -q -r ../base-module-sin-sms.zip .)
rm -f "$ROOT/SafeGo-sin-SMS.aab"
java -jar "$BUNDLETOOL" build-bundle --modules="$OUT/base-module-sin-sms.zip" --output="$ROOT/SafeGo-sin-SMS.aab"
jarsigner -keystore "$KS_FILE" -storepass:env KS_PASS -keypass:env KS_PASS -sigalg SHA256withRSA -digestalg SHA-256 \
  "$ROOT/SafeGo-sin-SMS.aab" "$KS_ALIAS" >/dev/null
echo "Listo:"
echo "  $ROOT/SafeGo.apk ($(du -h "$ROOT/SafeGo.apk" | cut -f1))"
echo "  $ROOT/SafeGo.aab ($(du -h "$ROOT/SafeGo.aab" | cut -f1))"
echo "  $ROOT/SafeGo-sin-SMS.aab (plan B para Google Play)"
