import type { Business } from '../types';

// Datos del negocio
export const businessInfo: Business = {
  name: "Belleza & Bienestar Spa",
  logo: "🌸", // Por ahora usamos un emoji, luego se puede cambiar por una imagen
  phone: "+57 300 123 4567",
  address: "Calle Principal 123, Bogotá",
  workingHours: {
    start: "09:00",
    end: "18:00"
  }
};

export default businessInfo;