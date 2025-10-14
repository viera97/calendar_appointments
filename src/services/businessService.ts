import type { Business } from '../types';
import { supabase } from '../lib/supabase';

/**
 * Business Service Module
 * 
 * Handles business information retrieval from Supabase database with
 * fallback to default values. Provides business profile data including
 * contact information, hours, and branding elements.
 */

// Default business information as fallback
const defaultBusinessInfo: Business = {
  name: "Belleza & Bienestar Spa",
  logo: "🌸", // Emoji placeholder, can be replaced with image URL
  phone: "+57 300 123 4567",
  address: "Calle Principal 123, Bogotá",
  workingHours: {
    start: "09:00",
    end: "18:00"
  }
};

// Cache for business information to avoid repeated API calls
let cachedBusinessInfo: Business | null = null;

/**
 * Fetch business information from Supabase database
 * 
 * Retrieves business data from the 'info' table with fallback to default values.
 * Implements caching to avoid repeated database calls and provides error handling
 * with graceful degradation to default information.
 * 
 * @returns Promise<Business> - Business information object
 */
export const fetchBusinessInfo = async (): Promise<Business> => {
  // Return cached data if available
  if (cachedBusinessInfo) {
    return cachedBusinessInfo;
  }

  try {
    console.log('📋 Cargando información del negocio desde Supabase...');
    
    // Query business info table (assuming single record)
    const { data, error } = await supabase
      .from('info')
      .select('name, phone, address:adress')  // Map 'adress' column to 'address'
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error al cargar información del negocio desde Supabase:', error);
      console.log('🔄 Usando información por defecto como respaldo');
      cachedBusinessInfo = defaultBusinessInfo;
      return defaultBusinessInfo;
    }
    
    if (!data) {
      console.log('⚠️ No se encontró información del negocio en Supabase, usando datos por defecto');
      cachedBusinessInfo = defaultBusinessInfo;
      return defaultBusinessInfo;
    }
    
    // Transform Supabase data to Business format
    const businessInfo: Business = {
      name: data.name || defaultBusinessInfo.name,
      logo: defaultBusinessInfo.logo, // Keep default logo/emoji
      phone: data.phone || defaultBusinessInfo.phone,
      address: data.address || defaultBusinessInfo.address,
      workingHours: defaultBusinessInfo.workingHours // Keep default hours
    };
    
    console.log(`✅ Información del negocio cargada desde Supabase: ${businessInfo.name}`);
    
    // Cache the result
    cachedBusinessInfo = businessInfo;
    return businessInfo;
    
  } catch (error) {
    console.error('Error de conexión al cargar información del negocio:', error);
    console.log('🔄 Usando información por defecto como respaldo');
    cachedBusinessInfo = defaultBusinessInfo;
    return defaultBusinessInfo;
  }
};

/**
 * Get business information (synchronous access to cached data)
 * 
 * Returns cached business information or default values if not yet loaded.
 * Use fetchBusinessInfo() for initial loading with database access.
 * 
 * @returns Business information object
 */
export const getBusinessInfo = (): Business => {
  return cachedBusinessInfo || defaultBusinessInfo;
};

/**
 * Clear cached business information
 * 
 * Forces next call to fetchBusinessInfo() to reload from database.
 * Useful for refreshing data or testing scenarios.
 */
export const clearBusinessInfoCache = (): void => {
  cachedBusinessInfo = null;
};

// For backward compatibility - use getBusinessInfo() for synchronous access
export const businessInfo = getBusinessInfo();

// Export functions and default business info
export default { fetchBusinessInfo, getBusinessInfo, clearBusinessInfoCache, businessInfo: defaultBusinessInfo };