# Universo de Van Gogh PWA

Invitación móvil lista para Vercel con push notifications.

## Qué hace

- Pantalla romántica estilo Van Gogh.
- Botón `No` evasivo.
- Selección de fecha.
- Push notification al Samsung cuando se elige la fecha.

## Requisitos

- Una cuenta en Vercel.
- Un navegador compatible en Android, idealmente Chrome.
- Un storage de Vercel KV o Redis conectado al proyecto.

## Variables de entorno

Configura estas variables en Vercel:

- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

El archivo [`.env.example`](.env.example) muestra el formato esperado.

## Despliegue en Vercel

1. Sube este proyecto a GitHub o conéctalo directo desde Vercel.
2. Importa el repositorio en Vercel.
3. Agrega las variables de entorno.
4. Despliega.
5. Abre la URL pública del proyecto.

Si quieres probar localmente:

```bash
npm install
npx vercel dev
```

## Cómo activar la notificación en tu Samsung

1. Abre una vez esta URL en tu Samsung con `?setup=1` al final.
2. Acepta permisos de notificación en Chrome.
3. Después abre la invitación normal sin `?setup=1` y compártela con ella.
4. Ese Samsung quedará suscrito y recibirá la push cuando ella elija la fecha.

## Flujo de prueba

1. En tu Samsung, entra a la URL de setup.
2. Abre luego la invitación pública.
3. Elige una fecha desde la invitación.
4. Verifica que llegue la notificación al Samsung.

## Notas

- Si las notificaciones no llegan, revisa permisos del sistema y de Chrome.
- En iPhone el soporte push de PWA es más limitado; para tu caso Android es la ruta más fiable.