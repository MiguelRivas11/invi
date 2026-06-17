# Universo de Van Gogh PWA

Invitación móvil lista para Vercel con envío de correo automático.

## Qué hace

- Pantalla romántica estilo Van Gogh.
- Botón `No` evasivo.
- Selección de fecha.
- Envío de un correo cuando se elige la fecha.

## Requisitos

- Una cuenta en Vercel.
- Una cuenta de Resend para enviar correos.

## Arquitectura

- `index.html` contiene la invitación pública.
- `api/rsvp.js` envía un correo cuando se elige una fecha.
- `sw.js` solo ayuda con caché/offline.

## Variables de entorno

Configura estas variables en Vercel:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_TO`

El archivo [`.env.example`](.env.example) muestra el formato esperado.

## Paso 1: importar el repo a Vercel

1. Entra a Vercel.
2. Pulsa `Add New` y luego `Project`.
3. Conecta tu cuenta de GitHub si todavía no lo hiciste.
4. Selecciona el repositorio del proyecto.
5. Deja que Vercel detecte el proyecto como Node/Serverless.
6. Antes de desplegar, prepara las variables de entorno.

## Paso 2: crear la cuenta en Resend

1. Entra a [Resend](https://resend.com/).
2. Crea tu cuenta.
3. Verifica tu correo.
4. En el panel de Resend crea una API Key.
5. Guarda esa clave para Vercel.

Si todavía no quieres usar tu propio dominio, puedes empezar con el remitente de prueba de Resend:

- `Universo de Van Gogh <onboarding@resend.dev>`

## Paso 3: configurar variables de entorno en Vercel

En `Project Settings` -> `Environment Variables` agrega:

- `RESEND_API_KEY` = tu API key de Resend
- `EMAIL_FROM` = un remitente válido, por ejemplo `Universo de Van Gogh <onboarding@resend.dev>`
- `EMAIL_TO` = tu correo personal, el que debe recibir el aviso

Hazlo para `Production` y, si quieres probar antes, también para `Preview`.

## Paso 4: desplegar

1. Vuelve a la pantalla principal del proyecto en Vercel.
2. Pulsa `Deploy`.
3. Espera a que termine.
4. Abre la URL pública que te dé Vercel.

## Paso 5: probar el flujo

1. Abre la URL pública normal.
2. Toca `Sí`.
3. Elige una fecha.
4. Revisa tu correo.

Ejemplo:

```text
https://tu-proyecto.vercel.app/
```

## Paso 6: enviar la invitación

1. Copia la URL pública normal.
2. Envíasela a ella.
3. Ella abre el enlace.
4. Toca `Sí`.
5. Elige una fecha.
6. El backend manda un correo a la dirección configurada en `EMAIL_TO`.

## Paso 7: probar que todo funciona

1. Abre la invitación.
2. Elige una fecha.
3. Confirma que el correo llega a tu bandeja.
4. Si no llega, revisa los logs de `api/rsvp` en Vercel.

## Problemas típicos

- Si no llega el correo, revisa `RESEND_API_KEY`, `EMAIL_FROM` y `EMAIL_TO`.
- Si Resend marca error, revisa que el remitente esté verificado o usa `onboarding@resend.dev`.
- Si el sitio abre pero falla el envío, revisa los logs de `api/rsvp` en Vercel.

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