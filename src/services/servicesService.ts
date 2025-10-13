import type { Service } from '../types';
import { supabase } from '../lib/supabase';

/**
 * Services Service Module
 * 
 * Handles service data retrieval from Supabase database with proper error
 * handling and data transformation. Provides a clean interface for service
 * operations throughout the application.
 */

// Type definition for service data structure from Supabase
interface SupabaseService {
  id: number;                    // Primary key from database
  name: string;                  // Service name
  description: string | null;    // Optional service description
  duration_minutes: number | null; // Service duration in minutes
  price: number | null;          // Service price
  category: string | null;       // Optional service category
}

/**
 * Fetch services from Supabase database
 * 
 * Retrieves all available services from the database, ordered by name.
 * Transforms database records to application format and handles various
 * error scenarios with appropriate fallbacks.
 * 
 * @returns Promise<Service[]> - Array of formatted service objects
 */
export const fetchServices = async (): Promise<Service[]> => {
  try {
    console.log('📋 Cargando servicios desde Supabase...');
    
    // Query services table with name ordering
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error al cargar servicios desde Supabase:', error);
      console.log('❌ No se pudieron cargar los servicios');
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ No se encontraron servicios en Supabase');
      return [];
    }
    
    // Transform Supabase data to application format
    const services: Service[] = data.map((service: SupabaseService) => ({
      id: service.id.toString(),                    // Convert ID to string
      name: service.name,                          // Service name
      description: service.description || '',      // Description with fallback
      duration: service.duration_minutes || 60,    // Duration with default
      price: service.price || 0                    // Price with fallback
    }));
    
    console.log(`✅ Cargados ${services.length} servicios desde Supabase`);
    return services;
    
  } catch (error) {
    console.error('Error de conexión al cargar servicios:', error);
    console.log('❌ Error de conexión con la base de datos');
    return [];
  }
};

// Export only the fetchServices function
export default { fetchServices };