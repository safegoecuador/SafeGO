# Página de seguimiento en vivo (SafeGo)

Página estática que la familia abre desde un enlace de WhatsApp para ver el mapa en vivo, sin instalar la app.

- Todo corre en el navegador. No hay servidor propio ni cuentas.
- La clave de cifrado viaja en la parte del enlace después del `#`, que el navegador **nunca envía** al servidor.
- Lee los puntos cifrados desde ntfy.sh y los descifra aquí mismo (AES-GCM).
- `ok.json` lo usa la app para comprobar que la página está publicada antes de ofrecer el enlace.

## Publicación
Se publica en el repositorio del equipo `safegoecuador/SafeGO`, carpeta `vivo/`, con el mismo flujo de GitHub Pages de la landing:
`https://safegoecuador.github.io/SafeGO/vivo/`

Si cambia la dirección, hay que cambiar `TS_VIEWER_URL` en `app/web-src/00-base.js` y el dominio en `ALLOWED_HOSTS` de `MainActivity.java`, y recompilar.

Créditos: Leaflet (BSD-2), mapa © colaboradores de OpenStreetMap (ODbL).
