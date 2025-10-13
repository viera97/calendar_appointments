import type { Service } from '../types';
import { supabase } from '../lib/supabase';

// Tipo para los datos de servicios desde Supabase
interface SupabaseService {
  id: number;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  price: number | null;
  category: string | null;
}

// Servicios de respaldo (mock data)
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

// Función para cargar servicios desde Supabase
export const fetchServices = async (): Promise<Service[]> => {
  try {
    console.log('📋 Cargando servicios desde Supabase...');
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error al cargar servicios desde Supabase:', error);
      console.log('🔄 Usando servicios mock como respaldo');
      return mockServices;
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ No se encontraron servicios en Supabase, usando servicios mock');
      return mockServices;
    }
    
    // Mapear los datos de Supabase al formato de la aplicación
    const services: Service[] = data.map((service: SupabaseService) => ({
      id: service.id.toString(),
      name: service.name,
      description: service.description || '',
      duration: service.duration_minutes || 60,
      price: service.price || 0
    }));
    
    console.log(`✅ Cargados ${services.length} servicios desde Supabase`);
    return services;
    
  } catch (error) {
    console.error('Error de conexión al cargar servicios:', error);
    console.log('🔄 Usando servicios mock como respaldo');
    return mockServices;
  }
};

export default { fetchServices, mockServices };