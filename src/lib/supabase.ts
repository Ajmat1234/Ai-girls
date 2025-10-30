import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY')
}

// Create Supabase client with error handling
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

// Database operations with error handling
export const dbOperations = {
  // Insert chat data
  async insertChat(user: string, girlName: string, chat: string) {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    try {
      const { data, error } = await supabase
        .from('Table')
        .insert([
          {
            'User': user,
            'Girl name': girlName,
            'Chat': chat
          }
        ])
        .select()

      if (error) {
        console.error('Error inserting chat:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Database insert error:', error)
      throw error
    }
  },

  // Get chat history
  async getChatHistory(user?: string, girlName?: string) {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    try {
      let query = supabase.from('Table').select('*')

      if (user) {
        query = query.eq('User', user)
      }

      if (girlName) {
        query = query.eq('Girl name', girlName)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching chat history:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Database fetch error:', error)
      throw error
    }
  },

  // Test database connection
  async testConnection() {
    if (!supabase) {
      return { success: false, error: 'Supabase client not initialized' }
    }

    try {
      const { data, error } = await supabase
        .from('Table')
        .select('count', { count: 'exact', head: true })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }
}

// Export for backward compatibility
export default supabase
