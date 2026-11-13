# Publicar SafeGo en Google Play

Archivos que salen de `build.sh`:

| Archivo | Para qué |
|---|---|
| `SafeGo.aab` | El que se sube a Google Play. Incluye el envío automático de SMS. |
| `SafeGo-sin-SMS.aab` | Plan B si Google rechaza el permiso de SMS (ver el punto 5). |
| `SafeGo.apk` | Para instalar directo en un teléfono y en pruebas. |

Datos técnicos: identificador `ec.safego.app` (no se puede cambiar después de publicar), versión 2.0.0 (código 6), Android 8.0 o superior y targetSdk 36 (Android 16). Los dos AAB están firmados con la llave del equipo (`transporteseguro.jks`), que en Play funciona como **llave de subida**: guárdenla, porque cada actualización debe firmarse con ella.

## 1. Antes de empezar
- **Tipo de cuenta.** Si la cuenta de desarrollador es *personal* y se creó después de noviembre de 2023, Google exige una **prueba cerrada con al menos 12 personas durante 14 días seguidos** antes de publicar en producción. Una cuenta de *organización* no tiene ese requisito, pero pide un número D-U-N-S.
- **Prueben en un teléfono real** con Android 15 o 16: instalen `SafeGo.apk` y hagan un viaje corto. Revisen que la barra de arriba no tape la app y que el botón «atrás» funcione.

## 2. Crear la app en Play Console
1. *Crear app* → nombre **SafeGo**, idioma Español (Latinoamérica), tipo App, gratis.
2. *Prueba › Prueba cerrada* → crear versión → subir `SafeGo.aab`. Acepten **Firma de apps de Play** cuando lo pida (Google guarda la llave de firma final y ustedes conservan la de subida).
3. Agreguen a los 12 probadores (lista de correos de Gmail) y compártanles el enlace de suscripción.

## 3. Ficha de la tienda (textos listos)
- **Descripción breve (80 caracteres):** `Avisa a tu familia cuando subes, haces transbordo y llegas. Sin llamadas.`
- **Descripción completa:**

  > SafeGo es para estudiantes que viajan solos en el transporte público de Quito y para sus familias.
  >
  > Planifica tu viaje combinando Metro, Trolebús, Ecovía, Metrobús y buses: te dice qué línea tomar, en qué dirección, dónde subir y dónde bajar, y vibra antes de tu parada.
  >
  > Tu familia recibe un SMS en los momentos que importan: cuando subes, cuando haces un transbordo y cuando llegas. Si te retrasas, también se entera. Sin llamadas en plena reunión.
  >
  > Al iniciar tu viaje, tu familia recibe por SMS un enlace para seguirte en vivo en el mapa, y también se entera cuando estás por bajar o cerca de tu destino. Solo funciona durante el viaje que tú inicias, y puedes apagarlo.
  >
  > Funciona bajo tierra en el Metro: si no hay GPS, mantiene tu hora estimada y retoma al salir.
  >
  > Tus datos se quedan en tu teléfono: no hay cuentas ni servidores. Botón SOS con tu ubicación y llamada al 911.
  >
  > Mapas de OpenStreetMap. Proyecto estudiantil de la PUCE.

- **Capturas:** al menos 2 del teléfono (Inicio, Rutas, Viaje en curso, Demostración). Ícono de 512 × 512 y gráfico destacado de 1024 × 500.
- **Categoría:** Mapas y navegación. **Correo de contacto:** el del equipo.

## 4. Contenido de la app (formularios obligatorios)
- **Política de privacidad:** `https://juanfercaicedo.github.io/SafeGO/privacidad/` (está en la carpeta `privacidad/`; se publica con la landing).
- **Público objetivo:** marquen 13 a 15, 16 a 17 y 18 o más. Si marcan menores de 13, se aplica la política de Familias, que es mucho más estricta.
- **Seguridad de los datos:** declaren *Ubicación precisa* y *Ubicación aproximada* (funcionalidad de la app, se comparte con la familia durante el viaje, cifrada en tránsito, el usuario puede apagarla y borrarla) y *Contactos: nombre y teléfono* (los escribe el usuario, se guardan en el teléfono). No hay publicidad ni datos vendidos.
- **Servicio en primer plano:** declaren el tipo *location*: «Sigue el viaje que el estudiante inicia para avisar a su familia al subir, al hacer transbordo y al llegar». Google suele pedir un video corto (30 s) que lo muestre: usen la Demostración y un viaje real.
- **Clasificación de contenido:** cuestionario IARC; sin violencia ni compras, con ubicación compartida.
- **Anuncios:** no contiene anuncios.

## 5. El permiso de SMS (riesgo principal)
Google Play solo permite `SEND_SMS` a las apps de SMS predeterminadas y a unos pocos casos aprobados por una **Declaración de permisos** (Contenido de la app › Permisos confidenciales). Puede tardar días y puede ser rechazada.

- **Plan A:** suban `SafeGo.aab` y llenen la declaración explicando que el SMS automático es la función principal (aviso de llegada y SOS para la familia de estudiantes menores de edad), con el video de la demostración.
- **Plan B:** si la rechazan, suban `SafeGo-sin-SMS.aab` con el mismo código de versión o uno mayor. En esa versión, cada aviso aparece como notificación y abre WhatsApp o SMS con el mensaje listo para enviarlo con un toque. El `SafeGo.apk` del sitio web sigue con el SMS automático.

## 6. Después de los 14 días
*Producción* → *Crear versión* → promover la versión de la prueba cerrada. Google revisa en 1 a 7 días.

Para cada actualización: suban `versionCode` y `versionName` en `app/AndroidManifest.xml` y `VERSION` en `app/web-src/00-base.js`, vuelvan a correr `build.sh` con la misma llave y suban el AAB nuevo.
