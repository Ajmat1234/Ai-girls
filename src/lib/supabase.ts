import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ChatRecord {
  id: string
  "User": string
  "Girl name": string
  "Chat": string
  created_at: string
}

export const saveChatHistory = async (username: string, girlName: string, chatHistory: any[]) => {
  try {
    const { data, error } = await supabase
      .from('Table')
      .upsert({
        "User": username,
        "Girl name": girlName,
        "Chat": JSON.stringify(chatHistory)
      })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving chat:', error)
    return null
  }
}

export const getChatHistory = async (username: string, girlName: string) => {
  try {
    const { data, error } = await supabase
      .from('Table')
      .select('*')
      .eq('User', username)
      .eq('Girl name', girlName)
      .single()
    
    if (error) throw error
    return data ? JSON.parse(data["Chat"]) : []
  } catch (error) {
    console.error('Error getting chat:', error)
    return []
  }
}

export const createUser = async (username: string) => {
  try {
    const { data, error } = await supabase
      .from('Table')
      .insert({
        "User": username,
        "Girl name": '',
        "Chat": '[]'
      })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

// Image upload function for Supabase Storage
export const uploadImage = async (file: File, username: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${username}_${Date.now()}.${fileExt}`
    const filePath = `chat-images/${fileName}`

    const { data, error } = await supabase.storage
      .from('chat-files')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('chat-files')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}
