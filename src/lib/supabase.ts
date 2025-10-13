import { createClient } from '@supabase/supabase-js'

// Obtener variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required in environment variables')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required in environment variables')
}

// Crear y exportar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Opcional: Función helper para verificar la conexión
export const testConnection = async () => {
  try {
    const { error } = await supabase.from('_supabase_migrations').select('version').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist, which is ok
      console.error('Supabase connection error:', error)
      return false
    }
    console.log('Supabase connection successful')
    return true
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
}

export default supabase