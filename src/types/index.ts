// Tipos para la aplicación de citas

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // duración en minutos
  price: number;
}

export interface TimeSlot {
  id: string;
  time: string; // formato HH:MM
  available: boolean;
  serviceId: string;
  date: string; // formato YYYY-MM-DD
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  date: string; // formato YYYY-MM-DD
  time: string; // formato HH:MM
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string; // timestamp
}

export interface Business {
  name: string;
  logo: string;
  phone: string;
  address: string;
  workingHours: {
    start: string;
    end: string;
  };
}

export interface AppointmentFormData {
  clientName: string;
  clientPhone: string;
  serviceId: string;
  date: string;
  time: string;
}