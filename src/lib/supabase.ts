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

// Variable para evitar múltiples pruebas de conexión
let connectionTested = false

// Función para contar registros en la tabla customers
export const getCustomersCount = async () => {
  try {
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

// Opcional: Función helper para verificar la conexión
export const testConnection = async () => {
  // Evitar múltiples pruebas de conexión
  if (connectionTested) {
    return true
  }

  try {
    console.log('🔗 Probando conexión a Supabase...')
    connectionTested = true
    
    // Probar conexión con una consulta simple sin mostrar datos
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

export default supabase