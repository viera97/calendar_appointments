# 🧪 Prueba Automática de Google Calendar

## ¿Qué hace esta funcionalidad?

Cuando entres a la vista de **"Mis Citas"**, la aplicación automáticamente:

1. ✅ **Crea una cita de prueba** para mañana a las 2:00 PM
2. 📅 **La sincroniza con Google Calendar** (si estás autenticado)
3. 🎯 **Muestra una notificación** del resultado

## 📋 Detalles de la Cita de Prueba

- **Cliente**: Cliente de Prueba - Google Calendar
- **Teléfono**: +57 300 123 4567
- **Servicio**: Prueba de Integración Google Calendar
- **Fecha**: Mañana (fecha automática)
- **Hora**: 14:00 (2:00 PM)
- **Estado**: Programada

## 🚀 Cómo Probar

### Paso 1: Configurar Client ID (si no lo has hecho)
```env
# En tu archivo .env
VITE_CLIENT_ID=tu_google_client_id_aqui.apps.googleusercontent.com
```

### Paso 2: Iniciar la aplicación
```bash
npm run dev
```

### Paso 3: Navegar a "Mis Citas"
1. Abre la aplicación en `http://localhost:5173`
2. Haz clic en **"Mis Citas"** en la navegación inferior
3. 🎉 ¡La cita de prueba se creará automáticamente!

## 📱 Escenarios de Prueba

### Escenario 1: Sin autenticación con Google
- ✅ Cita se crea localmente
- 📝 Mensaje: "Cita de prueba creada para mañana. Conéctate a Google Calendar para sincronizar."

### Escenario 2: Con autenticación con Google
- ✅ Cita se crea localmente
- 📅 Cita se sincroniza con Google Calendar
- 📝 Mensaje: "Cita de prueba creada para mañana y sincronizada con Google Calendar!"

### Escenario 3: Error de sincronización
- ✅ Cita se crea localmente
- ❌ Error al sincronizar
- 📝 Mensaje: "Cita de prueba creada para mañana, pero no se pudo sincronizar con Google Calendar."

## 🔍 Verificación

### En la aplicación:
- Ve a **"Mis Citas"**
- Busca la cita: **"Prueba de Integración Google Calendar"**
- Verifica que aparezca para mañana a las 2:00 PM

### En Google Calendar (si estás autenticado):
1. Abre [Google Calendar](https://calendar.google.com)
2. Busca el evento para mañana
3. Título: **"Prueba de Integración Google Calendar - Cliente de Prueba - Google Calendar"**
4. Descripción debe incluir todos los detalles del cliente

## 🛠️ Características Técnicas

### Prevención de Duplicados
- La función verifica si ya existe una cita de prueba
- Solo crea una cita si no hay una existente con el mismo nombre

### Manejo de Errores
- Captura errores de creación local
- Captura errores de sincronización con Google Calendar
- Muestra mensajes informativos apropiados

### Integración con Hooks
- Usa `useGoogleCalendar` para la sincronización
- Integrado con el sistema de notificaciones existente
- Mantiene la arquitectura modular de la aplicación

## 🔧 Personalización

Si quieres modificar la cita de prueba, edita el archivo:
`src/hooks/useAppointmentActions.ts`

```typescript
const testAppointment: Appointment = {
  // Modificar estos valores según necesites
  clientName: 'Tu Cliente de Prueba',
  clientPhone: '+57 XXX XXX XXXX',
  serviceName: 'Tu Servicio de Prueba',
  time: '15:00', // Cambiar hora
  // ...resto de campos
};
```

## 🎯 Objetivo

Esta funcionalidad te permite probar rápidamente:
- ✅ Creación automática de citas
- ✅ Integración con Google Calendar
- ✅ Sistema de notificaciones
- ✅ Almacenamiento local
- ✅ Sincronización de datos

¡Simplemente ve a "Mis Citas" y todo se probará automáticamente! 🚀