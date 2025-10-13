import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Client Configuration
 * 
 * Centralizes Supabase database connection setup and provides utility functions
 * for connection testing and data validation. Handles environment variable
 * validation and provides a single source of truth for database operations.
 */

// Get environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that required environment variables are configured
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required in environment variables')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required in environment variables')
}

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Flag to prevent multiple connection tests during app lifecycle
let connectionTested = false

/**
 * Get the total count of records in the customers table
 * 
 * Performs a count query on the customers table to retrieve the total
 * number of records. Used for debugging and data validation purposes.
 * 
 * @returns Promise<number | null> - Count of customers or null if error occurs
 */
export const getCustomersCount = async () => {
  try {
    // Execute count query with exact count and head-only response
    const { count, error } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('Error al obtener cantidad de customers:', error)
      return null
    }
    
    console.log(`📊 Cantidad de registros en la tabla 'customers': ${count}`)
    return count
  } catch (error) {
    console.error('Error al conectar con la tabla customers:', error)
    return null
  }
}

/**
 * Test database connection with Supabase
 * 
 * Performs a lightweight connection test to verify that the Supabase
 * client can successfully communicate with the database. Uses a simple
 * query with minimal data transfer to validate connectivity.
 * 
 * @returns Promise<boolean> - True if connection successful, false otherwise
 */
export const testConnection = async () => {
  // Prevent multiple connection tests during app lifecycle
  if (connectionTested) {
    return true
  }

  try {
    console.log('🔗 Probando conexión a Supabase...')
    connectionTested = true
    
    // Test connection with a simple query without displaying data
    const { error } = await supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .limit(1)
    
    if (error) {
      console.error('❌ Error al conectar con Supabase')
      return false
    }
    
    console.log('✅ Conexión a Supabase establecida correctamente')
    return true
  } catch {
    console.error('❌ Error al conectar con Supabase')
    return false
  }
}

// Default export for backward compatibility
export default supabase