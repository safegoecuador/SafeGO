# SafeGo (antes TransporteSeguro)

Aplicación Android que avisa a la familia cuando un estudiante sube, hace un transbordo y llega a clases en bus, Trolebús o Metro de Quito, sin que tenga que sacar el celular en la calle.

Proyecto de Emprendimiento Tecnológico · PUCE · NRC 2667 · 2026.

## Enlaces

| Qué | Dónde |
|---|---|
| Landing page | https://juanfercaicedo.github.io/TransporteSeguro/ |
| Descargar la app (APK) | https://juanfercaicedo.github.io/TransporteSeguro/apkApp/SafeGo.apk |
| Mapa en vivo para la familia | https://juanfercaicedo.github.io/TransporteSeguro/vivo/ |
| Política de privacidad | https://juanfercaicedo.github.io/TransporteSeguro/privacidad/ |
| Video demo | https://www.youtube.com/watch?v=MHkGWIvAxtw |
| Release final | https://github.com/juanfercaicedo/TransporteSeguro/releases/tag/v1.0.0 |

## Equipo y roles Scrum

| Integrante | Rol |
|---|---|
| Juan Fernando Caicedo | Product Owner |
| Esteban García | Scrum Master (rol rotativo), desarrollo y QA |
| Juan Esteban Caicedo | Desarrollo (frontend) |
| Anthony Rosero | Desarrollo y documentación |

## Qué hace la app (SafeGo 2.0.0)

- Planifica el viaje casa-colegio con línea, dirección y transbordos sobre 40 líneas de Quito y 2.382 paradas de OpenStreetMap.
- Al iniciar el viaje envía por SMS a la familia el enlace para seguirlo en vivo; avisa al estar cerca del destino y al llegar.
- Mapa en vivo opcional, cifrado con AES-GCM, autorizado por el representante.
- Botón SOS, aviso de retraso y manejo del Metro sin GPS (mantiene la hora estimada).
- Pantalla de privacidad con consentimiento del representante (LOPDP) y borrado del historial a los 30 días.
- Modo Demostración de 1 minuto.

## Estructura del repositorio

| Carpeta | Contenido |
|---|---|
| `android/` | Código de la app Android (Java + HTML/JS), `build.sh`, pruebas del planificador y guía `GOOGLE_PLAY.md` |
| `apkApp/` | `SafeGo.apk` firmado |
| `src/` | Landing y prototipo web (HTML, CSS, JS, paradas en GeoJSON) |
| `vivo/` | Visor web del mapa en vivo |
| `privacidad/` | Política de privacidad |
| `docs/prompts/` | Registro de prompts de IA |
| `USO_IA.md` | Declaración y registro de uso de IA |

## Compilar

Ver `android/README.md`. `build.sh` corre las 19 pruebas del planificador y genera el APK y el AAB. La llave de firma no está en el repositorio.

## Licencia

MIT. Ver `LICENSE`. Datos de paradas © colaboradores de OpenStreetMap (ODbL).
