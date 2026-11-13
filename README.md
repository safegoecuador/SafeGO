# SafeGo

**Llegó bien. Sin llamadas.** SafeGo es un prototipo para ayudar a estudiantes y sus familias a planificar y acompañar viajes en transporte público en Quito.

> **Versión:** 2.0.0
> **Estado:** prototipo en desarrollo; revisa las limitaciones antes de usarlo en un viaje real.

## Probar y descargar

- [Abrir el sitio de SafeGo](https://juanfercaicedo.github.io/TransporteSeguro/)
- [Probar la demo web](https://juanfercaicedo.github.io/TransporteSeguro/src/html/app-index.html)
- [Descargar el APK para Android](https://juanfercaicedo.github.io/TransporteSeguro/apkApp/SafeGo.apk)
- [Consultar la política de privacidad](https://juanfercaicedo.github.io/TransporteSeguro/privacidad/)
- [Ver notas de la versión 2.0.0](docs/RELEASE_NOTES_v2.0.0.md)
- [Ver la guía de la aplicación Android](android/README.md)

La aplicación Android requiere Android 8.0 o posterior. Instala el APK manualmente y permite la instalación desde esa fuente cuando Android lo solicite. La descarga directa no equivale a una publicación en Google Play.

## Funcionalidades

- Planificador local de viajes en transporte público de Quito, con alternativas multimodales e indicaciones de líneas, direcciones y transbordos.
- Mapa basado en OpenStreetMap con búsqueda de lugares, rutas a pie y paradas.
- Seguimiento de viajes y ubicación compartida cifrada durante un viaje iniciado por el estudiante.
- Avisos a la familia por SMS, además de alertas de llegada, retraso y SOS.
- Consentimiento, controles para detener el seguimiento y herramientas para borrar los datos locales.
- Demo web para explorar la experiencia sin instalar la aplicación.

La versión Android integra la experiencia principal. La demo web y el APK son prototipos: sus datos de rutas, tiempos y ubicaciones no deben considerarse información oficial ni garantía de seguridad.

## Compilar y probar Android

La compilación documentada utiliza Ubuntu y herramientas como OpenJDK 21, `aapt2`, `zipalign`, `apksigner`, Node.js y `bundletool`; no requiere Gradle ni Android Studio. Desde la carpeta `android/`:

```bash
bash build.sh
```

Para compilar una versión firmada, configura `KS_FILE` y `KS_PASS` con una llave de subida que guardes fuera del repositorio. `bash build.sh --nueva-llave` genera una llave temporal solo para pruebas; no la uses para publicar actualizaciones.

Las pruebas del planificador se ejecutan durante la compilación. También pueden lanzarse desde la raíz con:

```bash
node --test android/tests/planner.test.js
```

Consulta [android/README.md](android/README.md) para los requisitos detallados, la instalación y la guía de compilación. Para publicar en Google Play, revisa [android/GOOGLE_PLAY.md](android/GOOGLE_PLAY.md), en particular las restricciones aplicables al permiso de SMS.

## Privacidad y limitaciones

- No hay cuentas ni servidor propio que sincronice perfiles; parte de la información se conserva localmente en el teléfono.
- El seguimiento en vivo transmite puntos cifrados mediante el servicio público ntfy.sh. Comparte el enlace o código únicamente con personas de confianza; quien lo obtenga puede ver la ubicación mientras el canal siga activo.
- La app necesita permisos de ubicación, notificaciones o SMS para las funciones correspondientes. El estudiante puede detener el uso compartido.
- Las coordenadas de las paradas son aproximadas y los recorridos y tiempos pueden cambiar. Confirma la línea y el destino con fuentes oficiales antes de viajar.
- La app aún requiere pruebas en teléfonos reales y en condiciones de viaje. No debe usarse como sustituto de la supervisión, los servicios de emergencia ni la información oficial de transporte.
- Google Play restringe el permiso `SEND_SMS`; su aprobación no está garantizada. Revisa la guía de publicación antes de distribuir la app.

Lee la [política de privacidad](privacidad/index.html) y la sección de limitaciones de [android/README.md](android/README.md) antes de probar el seguimiento.

## Tecnologías y datos

- Java y WebView para la aplicación Android; HTML, CSS y JavaScript para las interfaces.
- OpenStreetMap y Leaflet para mapas; Nominatim para búsqueda y OSRM/FOSSGIS para rutas peatonales.
- Datos de transporte compilados en `android/app/assets/www/data.js`; el propio archivo documenta las fuentes. Los puntos de parada se basan en OpenStreetMap.
- GitHub Pages y GitHub Actions para publicar el sitio.

Los mapas y servicios externos conservan sus propios términos y licencias. Para los créditos y las fuentes de transporte, consulta [android/README.md](android/README.md).

## Estructura del repositorio

```text
android/       Aplicación Android, código web integrado, compilación y pruebas
apkApp/        APK disponible para descarga
docs/          Notas de versión y documentación de prompts de IA
privacidad/    Política de privacidad pública
src/           Sitio, demo web y código de la versión web
vivo/          Visor web de seguimiento en vivo
.github/       Flujo de publicación de GitHub Pages
LICENSE        Licencia MIT
USO_IA.md      Declaración del uso de herramientas de IA
```

## Equipo

Proyecto SafeGo, anteriormente TransporteSeguro. Responsable del repositorio: **Juan Fernando Caicedo Escobar**. Equipo: **Juan Esteban Caicedo, Esteban García y Anthony Rosero**.

## Uso de inteligencia artificial

El equipo indicó que se utilizó IA en el proyecto. El alcance y las herramientas de etapas anteriores deben completarse con la información del equipo. Esta actualización de documentación registra el uso de Copilot SDK en VS Code; consulta [USO_IA.md](USO_IA.md) y el prompt guardado en [docs/prompts/documentacion-y-release.md](docs/prompts/documentacion-y-release.md).

## Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE). Las bibliotecas, mapas y servicios de terceros mantienen sus propias licencias y condiciones.
