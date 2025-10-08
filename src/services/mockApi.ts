import type { Business, Service, TimeSlot } from '../types';

// Datos del negocio de prueba
export const businessInfo: Business = {
  name: "Belleza & Bienestar Spa",
  logo: "🌸", // Por ahora usamos un emoji, luego se puede cambiar por una imagen
  phone: "+1 (555) 123-4567",
  address: "Calle Principal 123, Ciudad",
  workingHours: {
    start: "09:00",
    end: "18:00"
  }
};

// Servicios disponibles de prueba
export const mockServices: Service[] = [
  {
    id: "1",
    name: "Corte de Cabello",
    description: "Corte profesional con lavado y secado",
    duration: 60,
    price: 25000
  },
  {
    id: "2",
    name: "Manicure Completa",
    description: "Manicure con esmaltado y decoración",
    duration: 45,
    price: 18000
  },
  {
    id: "3",
    name: "Facial Hidratante",
    description: "Tratamiento facial completo con masaje",
    duration: 90,
    price: 35000
  },
  {
    id: "4",
    name: "Masaje Relajante",
    description: "Masaje corporal de 60 minutos",
    duration: 60,
    price: 40000
  },
  {
    id: "5",
    name: "Depilación Cejas",
    description: "Perfilado y depilación de cejas",
    duration: 30,
    price: 12000
  }
];

// Función para generar horarios disponibles para un servicio en una fecha específica
export const generateTimeSlots = (serviceId: string, date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const service = mockServices.find(s => s.id === serviceId);
  
  if (!service) return slots;

  // Horarios base (de 9:00 AM a 6:00 PM)
  const workingHours = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  // Simulamos algunos horarios ocupados aleatoriamente
  const occupiedSlots = ["10:30", "13:00", "15:30", "17:00"];

  workingHours.forEach((time) => {
    // Solo crear slots que permitan completar el servicio antes del cierre
    const slotTime = new Date(`${date}T${time}`);
    const serviceEndTime = new Date(slotTime.getTime() + service.duration * 60000);
    const closeTime = new Date(`${date}T18:00`);

    if (serviceEndTime <= closeTime) {
      slots.push({
        id: `${serviceId}-${date}-${time}`,
        time,
        available: !occupiedSlots.includes(time),
        serviceId,
        date
      });
    }
  });

  return slots;
};

// Función mock para simular llamada a API
export const fetchAvailableSlots = async (serviceId: string, date: string): Promise<TimeSlot[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateTimeSlots(serviceId, date);
};

// Función para obtener todos los servicios
export const fetchServices = async (): Promise<Service[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockServices;
};

// Función para formatear precios
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

// Función para formatear tiempo
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours);
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};