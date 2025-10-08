# 📅 Sistema de Citas - Belleza & Bienestar Spa

Una aplicación web moderna para la gestión de citas de un negocio de belleza y bienestar, desarrollada con React, TypeScript y Vite.

## ✨ Características

- **📋 Catálogo de Servicios**: Visualización de todos los servicios disponibles con precios y duración
- **🕐 Selección de Horarios**: Sistema inteligente que muestra solo horarios disponibles según el servicio seleccionado
- **👤 Formulario de Citas**: Captura información del cliente (nombre, teléfono) y detalles de la cita
- **💾 Persistencia Local**: Las citas se guardan en localStorage para persistir entre sesiones
- **📱 Diseño Responsivo**: Funciona perfectamente en dispositivos móviles y desktop
- **🎨 Interfaz Moderna**: Diseño atractivo y profesional con gradientes y animaciones

## 🛠️ Tecnologías Utilizadas

- **React 19** con Hooks
- **TypeScript** para type safety
- **Vite** como build tool
- **CSS3** con Flexbox y Grid
- **LocalStorage** para persistencia de datos

## 🚀 Instalación y Uso

1. **Clonar el repositorio** (si aplica)
2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**: `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── BusinessHeader.tsx
│   ├── ServiceList.tsx
│   ├── AppointmentForm.tsx
│   ├── TimeSlotSelector.tsx
│   └── AppointmentList.tsx
├── services/            # Lógica de negocio
│   ├── mockApi.ts       # API simulada con datos de prueba
│   └── appointmentStorage.ts  # Gestión de localStorage
├── types/               # Definiciones de TypeScript
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