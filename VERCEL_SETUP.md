# Configuración de Variables de Entorno en Vercel

## Pasos para configurar en Vercel:

1. Accede a tu dashboard en [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona el proyecto **cleanpoints**
3. Ve a **Settings** (engranaje en la parte superior)
4. En el menú lateral, haz clic en **Environment Variables**
5. Añade una nueva variable con estos datos:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://residuos-2mr5.onrender.com/api/`
   - **Environments:** Selecciona "Production"
6. Haz clic en "Save"
7. Regresa a **Deployments** y haz clic en "Redeploy" en el último despliegue

## Variables de Entorno Necesarias

| Variable | Desarrollo | Producción |
|----------|-----------|-----------|
| `VITE_API_URL` | http://localhost:3000/api/ | https://residuos-2mr5.onrender.com/api/ |

## Archivos de Configuración

- `.env.local` - Usado en desarrollo local
- `.env.production` - Usado en compilación para producción (no sincroniza con Vercel)
- Variables en Vercel Dashboard - Lo que realmente controla la producción en Vercel

**Nota:** Los archivos `.env*` no se suben a Vercel. Debes configurar las variables en el dashboard de Vercel.
