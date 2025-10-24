# Calendar Appointments - Professional Appointment Booking System

A professional appointment booking system built with React, TypeScript, and Vite. It allows users to select dates and times in an easy and intuitive way, with seamless Google Calendar integration.

## 🚀 Features

- **Intuitive Interface**: Modern and user-friendly design
- **Bilingual Support**: Spanish and English language options
- **Dark/Light Theme**: Toggle between dark and light modes
- **Date Selection**: Interactive calendar for choosing available dates
- **Time Management**: Available time slot system
- **Google Calendar Integration**: Automatic appointment scheduling via API
- **Form Validation**: Comprehensive client-side validation
- **WhatsApp Integration**: Direct contact functionality
- **Responsive Design**: Optimized for mobile and desktop devices
- **Reusable Components**: Modular architecture with shadcn/ui
- **Loading States**: Comprehensive UI feedback during API calls

## 🔗 API Integration

This application integrates with a Google Calendar API for automatic appointment scheduling:

- **Calendar Sync API**: [https://github.com/viera97/calendar_sync](https://github.com/viera97/calendar_sync)
- **Functionality**: Automatically creates Google Calendar events when appointments are booked
- **Real-time Sync**: Appointments are immediately available in Google Calendar
- **Error Handling**: Robust error handling with user feedback

## 🛠️ Technologies

This project is built with:

- **[Vite](https://vitejs.dev/)** - Ultra-fast build tool and dev server
- **[React 18](https://reactjs.org/)** - User interface library
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing for JavaScript
- **[shadcn/ui](https://ui.shadcn.com/)** - Reusable UI components
- **[Lucide React](https://lucide.dev/)** - Modern icons
- **[date-fns](https://date-fns.org/)** - Date manipulation utilities
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

## 📋 Prerequisites

Before starting, make sure you have:

- **Node.js** (version 18 or higher)
- **npm**
- Access to the Calendar Sync API (see repository above)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/viera97/calendar_appointments
   cd calendar_appointments
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_NAME=Your Company Name
   VITE_ADDRESS=Your Business Address
   VITE_PHONE=Your Phone Number
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the Calendar Sync API**
   Make sure the [Calendar Sync API](https://github.com/viera97/calendar_sync) is running on the specified URL.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser** and visit `http://localhost:5173`

## 📝 Available Scripts

- `bun run dev` / `npm run dev` - Start the development server
- `bun run build` / `npm run build` - Build the application for production
- `bun run build:dev` / `npm run build:dev` - Build in development mode
- `bun run preview` / `npm run preview` - Preview the production build
- `bun run lint` / `npm run lint` - Run ESLint

## 📁 Project Structure

```
calendar_appointments/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # shadcn/ui components
│   │   └── AppointmentWizard.tsx
│   ├── hooks/              # Custom hooks
│   ├── i18n/               # Internationalization
│   ├── lib/                # Utilities and configuration
│   ├── pages/              # Main pages
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   └── main.tsx            # Entry point
├── public/                 # Static files
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🎨 Customization

### Environment Configuration
Configure your application by setting these environment variables:

- `VITE_NAME` - Your company or service name
- `VITE_ADDRESS` - Your business address
- `VITE_PHONE` - Your contact phone number
- `VITE_API_URL` - Calendar Sync API endpoint

### Themes and Colors
The project uses Tailwind CSS with custom CSS variables. You can modify colors in:
- `src/index.css` - Global CSS variables
- `tailwind.config.ts` - Tailwind configuration

### Components
UI components are based on shadcn/ui and located in `src/components/ui/`. You can customize them according to your needs.

### Languages
Add or modify translations in `src/i18n/translations.ts`. Currently supports Spanish and English.

## 🔌 API Integration

### Calendar Sync API
This application requires the Calendar Sync API to function properly:

- **Repository**: [https://github.com/viera97/calendar_sync](https://github.com/viera97/calendar_sync)
- **Default Port**: 8000
- **Endpoint**: `/appointments` (POST)
- **Function**: Creates Google Calendar events automatically

### API Request Format
```typescript
{
  client_name: string;
  phone_number: string;
  service_type: string;
  start_time: string; // ISO format
  end_time: string;   // ISO format
  additional_notes: string;
  timezone: string;
}
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

Optimized files will be generated in the `dist/` folder.

### Deploy to Vercel
1. Connect your repository with Vercel
2. Framework will be automatically detected as Vite
3. Build command will be `npm run build`
4. Output directory will be `dist`

### Deploy to Netlify
1. Connect your repository with Netlify
2. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

---

**Calendar Appointments** - Professional appointment booking system with Google Calendar integration 📅
