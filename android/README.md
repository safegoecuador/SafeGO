# SafeGo · app Android (v2.0.0)

**Llegó bien. Sin llamadas.** App para estudiantes que viajan solos en el transporte público de Quito: planifica la ruta con Metro, Trolebús, Ecovía, Metrobús y buses (línea y dirección), y **avisa a la familia por SMS en los momentos que importan**: cuando sube, cuando hace transbordo, cuando está por bajar o cerca del destino, cuando llega y si se retrasa. Al iniciar el viaje, la familia recibe el enlace para seguirlo en vivo.

## Instalar
1. Copia `SafeGo.apk` al teléfono (Android 8.0 o superior).
2. Ábrelo y acepta «Instalar apps de origen desconocido» si Android lo pide.
3. La app explica cada permiso (ubicación, notificaciones, SMS) y muestra un tutorial corto al inicio.

> v2.0.0 cambia el identificador a `ec.safego.app`: se instala como una app nueva junto a TransporteSeguro 1.x. Puedes desinstalar la anterior.

## Novedades de la v2.0.0 (según la retroalimentación del 11 de noviembre)
- **Nombre SafeGo** en toda la app, los SMS, las notificaciones y la página de seguimiento.
- **Seguimiento en vivo automático**: al iniciar cada viaje, la familia recibe por SMS el enlace para seguirlo en el mapa (o el código para pegar en la app si la página aún no está publicada), y también un SMS cuando el estudiante está por bajar o cerca del destino. Se puede apagar en Familia.
- **Metro bajo tierra**: si se pierde el GPS cerca de una estación del Metro del viaje, la app lo marca «En el Metro, sin señal», mantiene la hora estimada, se lo indica a la familia en el mapa en vivo y retoma el seguimiento al salir.
- **Demostración** (Inicio o Más): simula Casa → Colegio y, si escribes un celular de prueba, le llegan por SMS los avisos de «subió», «hizo transbordo» y «llegó». El número no se guarda.
- **Pruebas reales** (Más › Pruebas reales): por cada viaje guarda si la llegada se detectó sola, cuántos avisos salieron, si llegó a tiempo, cuánta batería gastó y si pasó por el Metro sin GPS. «Compartir resultados» exporta un resumen y una tabla.
- **Privacidad de menores (LOPDP)**: pantalla «Privacidad y datos», consentimiento que pide la autorización del representante si el estudiante es menor de 18 años, historial que se borra solo (30 días por defecto), botón para borrar todo y copia de seguridad de Android desactivada. Política pública en `privacidad/index.html`.
- **Lista para Google Play**: apunta a Android 16 (targetSdk 36), con diseño de borde a borde y gesto «atrás» predictivo. Además del APK se genera `SafeGo.aab` (Android App Bundle) firmado con la llave de subida. Ver `GOOGLE_PLAY.md`.
- La página del mapa en vivo pasa al repositorio del equipo: `https://juanfercaicedo.github.io/SafeGO/vivo/`.

## Qué hace
- **Planificador sin conexión** con 40 líneas: Metro, Trolebús (51 paradas, circuitos C1–C6), Ecovía (Río Coca – Marín – Guamaní, circuitos E1, E1-M, E2, E3), Metrobús / Corredor Central Norte, Corredor Sur Occidental, alimentadores (LB, RE, MV, MG) y buses urbanos e interparroquiales que conectan con el Metro, los valles (Cumbayá, Tumbaco, Los Chillos, Conocoto) y el aeropuerto.
- **Cada paso dice qué tomar**: línea o circuito, dirección (el letrero del bus), dónde subir, dónde bajar, paradas en medio y avenida por donde va. Si ningún circuito cubre todo el tramo, indica dónde cambiar de circuito en la misma estación.
- **Seguimiento en vivo (automático al iniciar el viaje)**: durante el viaje, la familia ve en su app cómo avanza el estudiante en el mapa (cada 15–60 s, también con la pantalla apagada), la hora del último punto, el destino, la llegada estimada, y un aviso de SOS o de llegada. Si no hay señal (por ejemplo, dentro del Metro) lo indica. **Hay dos formas de verlo**: dentro de la app (Inicio › Ver en vivo) o con un **enlace de WhatsApp** que se abre en el navegador sin instalar nada. El estudiante envía un solo enlace por WhatsApp; la familia lo toca (navegador) o lo pega en su app. La familia también puede reenviarlo a otro familiar.
- **Mapa OpenStreetMap** (Leaflet) con caché, búsqueda de direcciones (Nominatim) y rutas a pie (OSRM/FOSSGIS). Sin claves ni pagos.
- **Viaje en curso** en segundo plano: vibra antes de cada estación donde bajas, avisa a la familia al subir y al cambiar de transporte, detecta la llegada y envía el SMS solo.
- **Retraso, SOS, modo familia** (código de configuración), historial, modo discreto y tema oscuro.
- **Consentimiento**: el estudiante ve qué se comparte y lo acepta (con su representante si es menor de edad); puede apagar los avisos y el mapa en vivo cuando quiera.

## Ubicación en vivo: cómo funciona
- El teléfono del estudiante cifra cada punto (AES-GCM de 256 bits) y lo publica en un canal de [ntfy.sh](https://ntfy.sh), servicio libre y de código abierto que solo reenvía mensajes y los borra a las pocas horas.
- La clave viaja solo dentro del enlace o código que comparte el estudiante (código de configuración `TS1:` de la familia o seguimiento `TSV1:`). ntfy.sh no puede leer la ubicación.
- Solo se publica durante un viaje iniciado por el estudiante (y un punto al enviar SOS).
- «Cambiar código» en Familia genera una clave nueva: quien tenía la anterior deja de ver la ubicación.
- **Enlace de WhatsApp**: apunta a la página de la carpeta `viewer/` publicada en GitHub Pages (`https://juanfercaicedo.github.io/SafeGO/vivo/#TSV1:…`). La clave va después del `#`, que el navegador nunca envía al servidor. La app solo ofrece el enlace si comprueba que la página está publicada (pide `ok.json`); si no, comparte el código para pegar en la app.
- La familia necesita la app (rol Familia) abierta en «Ver en vivo» para recibir las notificaciones de llegada y SOS en su teléfono. En el navegador ve el mapa mientras tenga la pestaña abierta. Con la app cerrada, la familia sigue recibiendo los SMS.
- Quien reciba el enlace puede verte: si lo reenvían a alguien que no debe, usa «Cambiar código».

## Fuentes de las líneas (octubre de 2026)
Wikipedia «Trolebús de Quito» (paradas y circuitos); Extra.ec (circuitos de la Ecovía); Teleamazonas, El Comercio y El Diario (paradas del Corredor Sur Oriental, rutas al Metro, ruta al aeropuerto); Primicias (Corredor Central Norte, rutas que conectan con el Metro); guía de transporte de la USFQ. El detalle está en el encabezado de `app/assets/www/data.js`.

## Limitaciones conocidas
- **Ubicaciones aproximadas**: los nombres y el orden de las paradas vienen de las fuentes, pero las coordenadas se ubicaron a mano sobre las avenidas (Quito no publica datos GTFS abiertos). Tiempos y horarios son estimados.
- Las rutas de bus cambian con frecuencia; la app pide confirmar el letrero del bus.
- No se ha probado todavía en un teléfono real; se probó en el navegador (Chromium) y el paquete se validó con bundletool. Prueben en al menos un teléfono con Android 15 o 16 antes de subirla.
- WhatsApp no permite envío automático sin la API de pago; los avisos automáticos van por SMS. **Google Play restringe el permiso SEND_SMS**: hay que llenar la declaración de permisos y puede ser rechazada (detalles y plan B en `GOOGLE_PLAY.md`).
- ntfy.sh público tiene límites de uso por día; con el ritmo de la app alcanza para varios viajes diarios. Para un despliegue grande conviene un servidor ntfy propio (solo cambia `LiveShare.HOST`).
- Algunos teléfonos (Xiaomi, Huawei, Samsung) detienen apps en segundo plano: en Ajustes hay un botón para quitarla del ahorro de batería.

## Compilar
Sin Gradle ni Android Studio, con herramientas libres de Ubuntu:
```
sudo apt install openjdk-21-jdk-headless aapt aapt2 dalvik-exchange zipalign apksigner nodejs zip unzip
export KS_FILE=/ruta/a/transporteseguro.jks
export KS_PASS='la contraseña'
bash build.sh              # o: bash build.sh --nueva-llave (llave temporal, solo pruebas)
```
`build.sh` une la interfaz (`app/web-src/*.js` → `app/assets/www/app.js`), corre las pruebas del planificador, compila los recursos con aapt2 y el Java 8 contra `android.jar` (API 34; se descarga si falta), genera el dex y produce **`SafeGo.apk`** (firmado con apksigner) y **`SafeGo.aab`** (bundletool 1.18.1, firmado con jarsigner). El identificador de la app es `ec.safego.app` y el código Java sigue en el paquete `ec.transporteseguro.app`. La llave de firma **no está en el código**: se entrega aparte y hay que guardarla, porque las actualizaciones deben firmarse con la misma llave.

## Estructura
```
app/AndroidManifest.xml
app/java/ec/transporteseguro/app/
  MainActivity.java   WebView, puente JS↔Android, permisos
  TripService.java    seguimiento GPS en primer plano, avisos, llegada, retraso, SOS, publicación en vivo
  LiveShare.java      canal en vivo cifrado (ntfy.sh)
  TripStore.java      estado del viaje persistente
  TileCache.java      caché de mosaicos OSM con User-Agent propio
  Util.java           SMS, notificaciones, vibración, WhatsApp
app/web-src/          interfaz por módulos (se unen en app.js al compilar)
app/assets/www/
  index.html, app.css, app.js (generado), img/ (logo), stops-osm.js (2.382 paradas)
  planner.js          planificador multimodal (Dijkstra) con circuitos y direcciones
  data.js             red de transporte (40 líneas, fuentes en el encabezado)
  lib/                Leaflet 1.9.4
tests/planner.test.js 19 pruebas del planificador y de los datos
viewer/               página del mapa en vivo (se publica como vivo/ en GitHub Pages)
privacidad/           política de privacidad pública (Google Play la pide)
GOOGLE_PLAY.md        pasos y textos para publicar
```

Créditos: mapas © colaboradores de OpenStreetMap (ODbL), Leaflet (BSD-2), Nominatim, OSRM/FOSSGIS, ntfy (Apache-2.0/GPL-2.0).

## Paradas de bus (v1.3.0)
`app/assets/www/stops-osm.js` trae 2.382 paradas reales de bus de Quito (OpenStreetMap, ODbL) tomadas de `src/json/busStop.json` del repositorio juanfercaicedo/SafeGO (duplicados de plataforma y posición eliminados). Se ven al activar la capa de red en el mapa de Rutas (desde el zoom 15), salen en el buscador de lugares y dan el nombre «Cerca de la parada…» al tocar el mapa. Ese archivo solo trae puntos, sin líneas ni recorridos: los recorridos siguen siendo los de `data.js`.
