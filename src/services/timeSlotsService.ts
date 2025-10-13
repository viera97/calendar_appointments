import type { TimeSlot, Service } from '../types';
import { mockServices } from './servicesService';

// Función para generar horarios disponibles para un servicio en una fecha específica
export const generateTimeSlots = (serviceId: string, date: string, services: Service[] = mockServices): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const service = services.find(s => s.id === serviceId);
  
  if (!service) return slots;

  // Horario de trabajo (9:00 AM - 6:00 PM)
  const startHour = 9;
  const endHour = 18;
  const slotDuration = 30; // minutos por slot

  // Generar slots cada 30 minutos
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Verificar si hay suficiente tiempo para el servicio antes del cierre
      const slotTime = new Date(`${date} ${time}`);
      const serviceEndTime = new Date(slotTime.getTime() + service.duration * 60000);
      const closingTime = new Date(`${date} ${endHour}:00`);
      
      if (serviceEndTime <= closingTime) {
        slots.push({
          id: `${serviceId}-${date}-${time}`,
          time,
          available: Math.random() > 0.3, // 70% de probabilidad de estar disponible
          serviceId,
          date
        });
      }
    }
  }

  return slots;
};

// Función para obtener horarios disponibles (simulación de API)
export const fetchAvailableSlots = async (serviceId: string, date: string, services?: Service[]): Promise<TimeSlot[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateTimeSlots(serviceId, date, services);
};

export default { generateTimeSlots, fetchAvailableSlots };