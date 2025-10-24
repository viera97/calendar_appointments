# Calendar Appointments - Sistema de Agendamiento de Citas

Un sistema profesional de agendamiento de citas desarrollado con React, TypeScript y Vite. Permite a los usuarios seleccionar fechas y horarios de forma fácil e intuitiva.

## 🚀 Características

- **Interfaz intuitiva**: Diseño moderno y fácil de usar
- **Selección de fechas**: Calendario interactivo para elegir fechas disponibles
- **Gestión de horarios**: Sistema de slots de tiempo disponibles
- **Responsive**: Adaptado para dispositivos móviles y escritorio
- **Componentes reutilizables**: Arquitectura modular con shadcn/ui

## 🛠️ Tecnologías

Este proyecto está construido con:

- **[Vite](https://vitejs.dev/)** - Build tool y dev server ultra rápido
- **[React 18](https://reactjs.org/)** - Biblioteca de interfaz de usuario
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI reutilizables
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[date-fns](https://date-fns.org/)** - Utilidades para manejo de fechas

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (incluido con Node.js)

## 🔧 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd calendar_sync
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador** y visita `http://localhost:8080`

## 📝 Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run build:dev` - Construye en modo desarrollo
- `npm run preview` - Preview de la build de producción
- `npm run lint` - Ejecuta el linter ESLint

## 📁 Estructura del proyecto

```
calendar_sync/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes de shadcn/ui
│   │   └── AppointmentWizard.tsx
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilidades y configuración
│   ├── pages/              # Páginas principales
│   └── main.tsx            # Punto de entrada
├── public/                 # Archivos estáticos
├── package.json           # Dependencias y scripts
└── README.md              # Este archivo
```

## 🎨 Personalización

### Temas y colores
El proyecto utiliza Tailwind CSS con variables CSS personalizadas. Puedes modificar los colores en:
- `src/index.css` - Variables CSS globales
- `tailwind.config.ts` - Configuración de Tailwind

### Componentes
Los componentes de UI están basados en shadcn/ui y se encuentran en `src/components/ui/`. Puedes personalizarlos según tus necesidades.

## 🚀 Despliegue

### Build de producción
```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

### Despliegue en Vercel
1. Conecta tu repositorio con Vercel
2. El framework se detectará automáticamente como Vite
3. El comando de build será `npm run build`
4. El directorio de salida será `dist`

### Despliegue en Netlify
1. Conecta tu repositorio con Netlify
2. Configura:
   - Build command: `npm run build`
   - Publish directory: `dist`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda, puedes:
- Abrir un issue en GitHub
- Contactar al equipo de desarrollo

---

**Calendar Sync** - Sistema profesional de agendamiento de citas 📅
