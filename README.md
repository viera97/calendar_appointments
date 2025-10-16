# 📅 Sistema de Citas - Belleza & Bienestar Spa

Una aplicación web moderna para la gestión de citas de un negocio de belleza y bienestar, desarrollada con React, TypeScript, Vite y integración con Google Calendar.

## ✨ Características

- **📋 Catálogo de Servicios**: Visualización de todos los servicios disponibles con precios y duración
- **🕐 Selección de Horarios**: Sistema inteligente que muestra solo horarios disponibles según el servicio seleccionado
- **👤 Formulario de Citas**: Captura información del cliente (nombre, teléfono) y detalles de la cita
- **💾 Base de Datos**: Integración con Supabase para persistencia de datos
- **📅 Google Calendar**: Sincronización automática de citas con Google Calendar
- **📱 Diseño Responsivo**: Funciona perfectamente en dispositivos móviles y desktop
- **🎨 Interfaz Moderna**: Diseño atractivo y profesional con gradientes y animaciones
- **🌙 Modo Oscuro**: Tema oscuro/claro con persistencia de preferencias

## 🛠️ Tecnologías Utilizadas

- **React 19** con Hooks y TypeScript
- **Vite** como build tool y desarrollo
- **Supabase** para base de datos y backend
- **Google Calendar API** para sincronización de citas
- **CSS3** con variables personalizadas y diseño responsivo
- **Modular Architecture** con hooks personalizados y servicios separados

## 🚀 Instalación y Configuración

### 1. Clonar e instalar dependencias
```bash
git clone [repository-url]
cd calendar_appointments
npm install
```

### 2. Configuración de variables de entorno
Crear archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Configurar las siguientes variables:

#### Supabase Configuration
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Google Calendar API Configuration
```env
VITE_CLIENT_ID=your_google_oauth_client_id
```

### 3. Configuración de Google Calendar API

1. **Google Cloud Console**:
   - Ir a [Google Cloud Console](https://console.cloud.google.com/)
   - Crear un proyecto nuevo o seleccionar uno existente
   - Habilitar la **Google Calendar API**

2. **Credenciales OAuth 2.0**:
   - Ir a **APIs y servicios > Credenciales**
   - Crear **ID de cliente OAuth 2.0**
   - Tipo: **Aplicación web**
   - Agregar tu dominio a **Orígenes autorizados de JavaScript**
   - Copiar el **Client ID** a tu archivo `.env`

3. **Configuración del proyecto**:
   - En **Pantalla de consentimiento OAuth**, configurar la información básica
   - Agregar scopes necesarios: `https://www.googleapis.com/auth/calendar`

### 4. Configuración de Supabase

1. **Crear proyecto en Supabase**:
   - Ir a [Supabase](https://supabase.com/)
   - Crear nuevo proyecto
   - Obtener URL del proyecto y clave anónima

2. **Crear tablas necesarias**:
   ```sql
   -- Tabla de servicios
   CREATE TABLE services (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     duration INTEGER NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Tabla de citas
   CREATE TABLE appointments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     client_name TEXT NOT NULL,
     client_phone TEXT NOT NULL,
     service_id UUID REFERENCES services(id),
     service_name TEXT NOT NULL,
     date TEXT NOT NULL,
     time TEXT NOT NULL,
     status TEXT DEFAULT 'scheduled',
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Tabla de información del negocio
   CREATE TABLE business_info (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     logo TEXT,
     phone TEXT NOT NULL,
     address TEXT NOT NULL,
     working_hours_start TEXT NOT NULL,
     working_hours_end TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

### 5. Iniciar la aplicación
```bash
npm run dev
```

Abrir en el navegador: `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes de UI modularizados
│   ├── business/        # Componentes relacionados con el negocio
│   ├── navigation/      # Componentes de navegación
│   └── shared/          # Componentes reutilizables
├── hooks/               # Custom hooks para lógica de estado
│   ├── useAppData.ts    # Hook principal para datos de la app
│   ├── useGoogleCalendar.ts  # Hook para integración con Google Calendar
│   ├── useNotifications.ts   # Hook para notificaciones
│   └── ...
├── services/            # Servicios y lógica de negocio
│   ├── supabase.ts      # Configuración de Supabase
│   ├── googleCalendarService.ts  # Servicio de Google Calendar
│   ├── businessService.ts        # Servicio de información del negocio
│   └── ...
├── types/               # Definiciones de TypeScript
│   ├── index.ts         # Tipos principales de la aplicación
│   └── googleCalendar.ts # Tipos específicos de Google Calendar
└── utils/               # Utilidades y helpers
```

## 🔧 Funcionalidades Avanzadas

### Google Calendar Integration
- **Autenticación OAuth 2.0**: Login seguro con Google
- **Sincronización automática**: Las citas se crean automáticamente en Google Calendar
- **Gestión de eventos**: Crear, actualizar y eliminar eventos
- **Información detallada**: Los eventos incluyen información completa del cliente y servicio

### Arquitectura Modular
- **Custom Hooks**: Separación de lógica de estado y UI
- **Servicios independientes**: Cada API tiene su propio servicio
- **Tipado estricto**: TypeScript en toda la aplicación
- **Gestión de errores**: Manejo robusto de errores y estados de carga

## 🧪 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción  
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```
│   └── index.ts
├── App.tsx             # Componente principal
├── App.css             # Estilos principales
└── main.tsx            # Punto de entrada
```

## 🎯 Funcionalidades Principales

### 1. **Selección de Servicios**
- Lista visual de servicios disponibles
- Información de precios y duración
- Interfaz intuitiva con cards interactivas

### 2. **Agendamiento de Citas**
- Formulario validado para datos del cliente
- Selector de fechas (hasta 30 días en adelante)
- Horarios disponibles dinámicos según el servicio
- Validación de campos obligatorios

### 3. **Gestión de Citas**
- Visualización de citas programadas
- Opción para cancelar citas
- Historial de citas completadas/canceladas
- Persistencia de datos en localStorage

## 🎨 Servicios de Ejemplo

El sistema incluye 5 servicios de prueba:
- **Corte de Cabello** (60 min - $25,000)
- **Manicure Completa** (45 min - $18,000)
- **Facial Hidratante** (90 min - $35,000)
- **Masaje Relajante** (60 min - $40,000)
- **Depilación Cejas** (30 min - $12,000)

## 🔧 Configuración

### Datos del Negocio
Para personalizar la información del negocio, edita el archivo `src/services/mockApi.ts`:

```typescript
export const businessInfo: Business = {
  name: "Tu Negocio",
  logo: "🌸", // Cambia por una imagen URL
  phone: "Tu teléfono",
  address: "Tu dirección",
  workingHours: {
    start: "09:00",
    end: "18:00"
  }
};
```

### Servicios
Modifica el array `mockServices` en el mismo archivo para agregar/editar servicios.

## 📱 Diseño Responsivo

La aplicación está optimizada para:
- **Desktop**: Layout completo con navegación horizontal
- **Tablet**: Adaptación automática del grid
- **Móvil**: Navegación vertical y botones táctiles

## 🔮 Próximas Mejoras

- [ ] Integración con API backend real
- [ ] Sistema de notificaciones por email/SMS
- [ ] Calendario visual interactivo
- [ ] Panel de administración para el negocio
- [ ] Sistema de pagos online
- [ ] Recordatorios automáticos

## 📄 Licencia

Este proyecto es de uso libre para fines educativos y comerciales.

---

**Desarrollado con ❤️ para modernizar la gestión de citas de tu negocio**