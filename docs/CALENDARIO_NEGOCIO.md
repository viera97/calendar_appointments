# 🏢 Calendario del Negocio - Integración con Google Calendar

## 📋 Descripción

Esta implementación permite que **todas las citas de todos los usuarios** se agreguen automáticamente a una cuenta de Google Calendar específica del negocio, sin requerir que cada usuario se autentique con su propia cuenta de Google.

## 🎯 Beneficios

- ✅ **Centralizado**: Todas las citas en un solo calendario del negocio
- ✅ **Sin autenticación de usuario**: Los clientes no necesitan cuenta de Google
- ✅ **Automático**: Las citas se sincronizan automáticamente
- ✅ **Acceso del personal**: El equipo puede ver todas las citas desde Google Calendar
- ✅ **Seguro**: Usa Service Account para acceso controlado

## 🔧 Configuración

### Paso 1: Crear Service Account en Google Cloud

1. **Acceder a Google Cloud Console**
   - Ve a [console.cloud.google.com](https://console.cloud.google.com/)
   - Crea un proyecto nuevo o selecciona uno existente

2. **Habilitar Google Calendar API**
   - Ve a **APIs & Services > Library**
   - Busca "Google Calendar API"
   - Haz clic en **Enable**

3. **Crear Service Account**
   - Ve a **APIs & Services > Credentials**
   - Haz clic en **+ CREATE CREDENTIALS**
   - Selecciona **Service Account**
   - Llena la información:
     - **Name**: "Calendar Appointments Service"
     - **ID**: "calendar-appointments"
     - **Description**: "Service account for appointment calendar integration"

4. **Crear y Descargar Key**
   - En la página del Service Account creado
   - Ve a la pestaña **Keys**
   - Haz clic en **Add Key > Create New Key**
   - Selecciona **JSON**
   - Descarga el archivo (guárdalo seguro)

### Paso 2: Configurar Google Calendar

1. **Abrir Google Calendar**
   - Ve a [calendar.google.com](https://calendar.google.com/)
   - Usa la cuenta donde quieres recibir las citas

2. **Compartir el Calendario**
   - En la sidebar, encuentra tu calendario principal
   - Haz clic en los 3 puntos → **Settings and sharing**
   - En **Share with specific people**, haz clic en **+ Add people**
   - Agrega el email del Service Account (está en el JSON descargado)
   - Permissions: **Make changes to events**

3. **Obtener Calendar ID** (opcional)
   - En **Settings and sharing** del calendario
   - Busca **Calendar ID** (usualmente es tu email)
   - Cópialo para usarlo en la configuración

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en tu proyecto con:

```env
# Service Account Email (del archivo JSON)
VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL=calendar-appointments@tu-proyecto.iam.gserviceaccount.com

# Private Key (del archivo JSON, mantén los \\n)
VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nTU_CLAVE_PRIVADA_AQUI\\n-----END PRIVATE KEY-----\\n"

# ID del calendario (tu email o 'primary')
VITE_GOOGLE_CALENDAR_ID=tu-email@gmail.com

# Supabase (si usas)
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### Paso 4: Configurar Backend (Requerido)

⚠️ **IMPORTANTE**: Por seguridad, las credenciales del Service Account deben manejarse en el backend, no en el frontend.

#### Opción 1: API Endpoints Simples

Crea estos endpoints en tu backend:

```javascript
// POST /api/calendar/events
// Agregar cita al calendario
app.post('/api/calendar/events', async (req, res) => {
  try {
    const { appointment, calendarEvent, calendarId } = req.body;
    
    // Usar Google Calendar API con Service Account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    
    const calendar = google.calendar({ version: 'v3', auth });
    
    const result = await calendar.events.insert({
      calendarId: calendarId || 'primary',
      resource: calendarEvent,
    });
    
    res.json({ success: true, eventId: result.data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/calendar/events/:eventId
// Actualizar cita en el calendario
app.put('/api/calendar/events/:eventId', async (req, res) => {
  // Similar implementation for updating
});

// DELETE /api/calendar/events/:eventId  
// Eliminar cita del calendario
app.delete('/api/calendar/events/:eventId', async (req, res) => {
  // Similar implementation for deleting
});
```

#### Opción 2: Usar Serverless Functions

Si usas Vercel, Netlify u otro servicio, crea funciones serverless:

**`/api/calendar/events.js`** (Vercel):
```javascript
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Implementación para crear evento
  }
  // Otros métodos...
}
```

## 🚀 Uso

### En Desarrollo

1. **Verificar Configuración**
   - La aplicación mostrará el estado de configuración
   - Verifica que todas las variables estén configuradas

2. **Probar Funcionalidad**
   - Crea una cita en la aplicación
   - Verifica que aparezca en Google Calendar

### En Producción

1. **Variables de Entorno**
   - Configura las variables en tu plataforma de hosting
   - **NUNCA** subas las credenciales al repositorio

2. **Backend API**
   - Asegúrate de que los endpoints estén funcionando
   - Implementa autenticación y validación adecuada

## 🔍 Verificación

### Checklist de Configuración

- [ ] Service Account creado en Google Cloud
- [ ] Google Calendar API habilitada
- [ ] Archivo JSON de credenciales descargado
- [ ] Calendar compartido con Service Account email
- [ ] Variables de entorno configuradas
- [ ] Backend API implementado y funcionando
- [ ] Prueba exitosa de creación de cita

### Solución de Problemas

1. **"Service Account credentials not configured"**
   - Verifica que las variables de entorno estén correctas
   - Asegúrate de que el private key mantenga los `\\n`

2. **"Calendar not found"**
   - Verifica que el calendario esté compartido con el Service Account
   - Confirma que el Calendar ID sea correcto

3. **"Insufficient permissions"**
   - El Service Account necesita permisos de "Make changes to events"
   - Verifica que Google Calendar API esté habilitada

## 📊 Formato de Eventos

Los eventos creados en Google Calendar incluyen:

```
Título: [Nombre del Servicio] - [Nombre del Cliente]

Descripción:
📋 DETALLES DE LA CITA

Cliente: Juan Pérez
Teléfono: +57 300 123 4567
Servicio: Corte de Cabello
Estado: scheduled

🏢 Cita programada desde el sistema de reservas
ID: apt_123456789
Creada: 15/10/2024, 14:30:25
```

## 🔐 Seguridad

- ✅ Las credenciales se manejan solo en el backend
- ✅ Service Account tiene acceso limitado solo al calendario específico
- ✅ No se exponen credenciales en el frontend
- ✅ Comunicación encriptada (HTTPS)

## 💡 Próximas Mejoras

- [ ] Sync bidireccional (importar eventos existentes)
- [ ] Múltiples calendarios por tipo de servicio
- [ ] Recordatorios automáticos
- [ ] Integración con Google Meet para citas virtuales
- [ ] Webhook para actualizaciones en tiempo real