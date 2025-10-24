export const COMPANY_NAME = import.meta.env.VITE_NAME;
export const EXAMPLE_ADDRESS = import.meta.env.VITE_ADDRESS;
export const COMPANY_PHONE = import.meta.env.VITE_PHONE;

export const generateWhatsAppLink = (phone: string, message?: string): string => {
  // Limpiar el número de teléfono (quitar espacios, guiones, etc.)
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Generar la URL de WhatsApp
  return `https://wa.me/${cleanPhone}`;
};

export const generateRandomTimeSlots = (): string[] => {
  const slots = [];
  const hours = [9, 10, 11, 14, 15, 16, 17];
  const usedSlots = new Set<string>();
  
  while (slots.length < 6 && usedSlots.size < hours.length) {
    const hour = hours[Math.floor(Math.random() * hours.length)];
    const minute = Math.random() < 0.5 ? "00" : "30";
    const timeSlot = `${hour.toString().padStart(2, "0")}:${minute}`;
    
    if (!usedSlots.has(timeSlot)) {
      usedSlots.add(timeSlot);
      slots.push(timeSlot);
    }
  }
  
  return slots.sort();
};