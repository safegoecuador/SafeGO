# Uso de inteligencia artificial en SafeGo (antes TransporteSeguro)

Herramienta: **Claude (Anthropic)**, usada como asistente de programación y de redacción dentro de un proyecto de la plataforma Claude. Las decisiones de producto las tomó el equipo; el equipo revisa y asume la responsabilidad por todo el código y el texto.

## Registro de uso

| Fecha | Herramienta y modelo | Para qué se usó | Qué se aceptó tal cual | Qué se modificó | Quién revisó |
|---|---|---|---|---|---|
| 12/10/2026 | Claude | App Android nativa (Java) con interfaz HTML/JS y mapa Leaflet; compilación sin Gradle; avisos por SMS y SOS (v1.0) | Estructura de la app y del compilador `build.sh` | Textos, pantallas y reglas de aviso según lo pedido por el equipo | Equipo |
| 12/10/2026 | Claude | Auditoría de errores, tutorial inicial, 40 líneas de transporte de Quito con circuitos y direcciones, seguimiento en vivo cifrado (v1.1 y v1.2) | Corrección de errores de la auditoría | Datos de estaciones (aproximados, hechos a mano a partir de fuentes públicas) | Equipo |
| 13/10/2026 | Claude | Visor web del mapa en vivo para GitHub Pages (v1.2.1) | Código del visor | Nombre del repositorio y del enlace | Equipo |
| 30/10/2026 | Claude | Incorporar 2.382 paradas reales de bus de OpenStreetMap tomadas de `busStop.json` (v1.3.0) | Capa de paradas, búsqueda y nombre «Cerca de la parada» | Se eliminaron 66 paradas | Equipo |
| 10/11/2026 | Claude | Lienzo de propuesta de valor | Estructura | Contenido actualizado a la app actual | Equipo |
| 12/11/2026 | Claude | Borrador del documento técnico v1.0 y de este registro | Estructura y redacción base | Los datos que solo conoce el equipo (testers, fechas, pruebas con usuarios) los completa el equipo; lo que aún no se hace queda como «Pendiente» | Equipo |
| 12/11/2026 | Claude | SafeGo 2.0.0: nuevo nombre y logo, enlace de seguimiento automático, aviso al estar cerca, Metro sin GPS, privacidad, Demostración, AAB para Google Play; landing con problemática, pagadores y propuesta de valor | Estructura del código y de la landing | Textos, reglas de aviso y precios según lo pedido por el equipo | Equipo |
| 12/11/2026 | Claude | Revisión de la entrega final contra las indicaciones de Moodle; sección de equipo y pie con privacidad en la landing; README, USO_IA.md y docs/prompts | Estructura de la sección de equipo y del README | Revisión de cada texto por el equipo | Anthony Rosero |

## Verificación

- Pruebas automáticas del planificador de rutas: 19 pruebas (`tests/planner.test.js`).
- Pruebas manuales en navegador (Playwright) con el teléfono simulado.
- Revisión de cada cambio por un integrante del equipo.
- Pendiente: pruebas en celulares Android reales.

## Porcentaje aproximado del código asistido por IA

Poco más de la mitad del código fue generada con Claude y revisada, probada y corregida por el equipo; el porcentaje exacto no se midió.

## Datos y licencias

- Los datos de estaciones y paradas vienen de fuentes públicas (noticias, Wikipedia y OpenStreetMap, licencia ODbL). Las coordenadas de las líneas son aproximadas.
- No se enviaron datos personales de estudiantes a ninguna herramienta de IA.
- Dependencias principales: Leaflet 1.9.4 (BSD-2-Clause), Bootstrap 5.3.7 (MIT).

## Registro de prompts

Se guardan los pedidos que definieron la arquitectura y las funciones centrales. Resumen de la respuesta en cada caso.

1. **Auditoría, tutorial e investigación de líneas** (12/10/2026). Pedido: corregir los hallazgos de la auditoría, agregar pantallas de introducción e investigar a fondo las líneas de bus de Quito. Respuesta: correcciones, tutorial inicial y 40 líneas con circuitos y direcciones.
2. **Seguimiento en vivo cifrado y visor web** (12–13/10/2026). Pedido: que la familia vea el viaje en vivo, en la app o con un enlace de WhatsApp. Respuesta: puntos cifrados con AES-GCM publicados en ntfy.sh y un visor estático para GitHub Pages; la clave va en el fragmento de la URL.
3. **Paradas reales de bus** (30/10/2026). Pedido: incorporar las rutas del repositorio del equipo. Respuesta: el repositorio solo traía paradas (GeoJSON), no líneas; se incorporaron 2.382 paradas como capa del mapa, en el buscador y en el nombre del lugar.
4. **SafeGo 2.0.0** (12/11/2026). Pedido: mejorar la app según la retroalimentación de la docente, con nombre SafeGo, enlace de seguimiento automático al iniciar el viaje, aviso al estar cerca, Metro sin GPS, pantalla de privacidad, modo Demostración y paquete AAB para Google Play. Respuesta: versión 2.0.0 (código 6), APK y AAB firmados, y plan B sin permiso de SMS.
5. **Landing y documentos finales** (12/11/2026). Pedido: renombrar a SafeGo y agregar problemática, quién paga y propuesta de valor; completar el documento técnico. Respuesta: landing publicada y borrador del documento técnico.

## Datos pendientes

En el documento técnico, lo que el equipo aún no ha realizado (prueba cerrada en Google Play, pruebas con 5 usuarios del segmento, medición en celular real) aparece como «Pendiente». No se usan datos inventados.
