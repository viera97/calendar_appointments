// Funciones de utilidad para formateo

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

export default { formatPrice, formatTime };