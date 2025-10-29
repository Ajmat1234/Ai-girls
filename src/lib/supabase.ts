import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wxsdvjohphpwdxbeioki.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4c2R2am9ocGhwd2R4YmVpb2tpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDIxODksImV4cCI6MjA2MzkxODE4OX0.89p7DcWynu-96wfOagF_DE5Hbsff_cVc34JHMcd95J0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ChatRecord {
  id: string
  username: string
  girl_name: string
  chat: string
  access_key: string
  created_at: string
}

export const saveChatHistory = async (username: string, girlName: string, chatHistory: any[]) => {
  try {
    const { data, error } = await supabase
      .from('Table')
      .upsert({
        username,
        girl_name: girlName,
        chat: JSON.stringify(chatHistory)
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
      .eq('username', username)
      .eq('girl_name', girlName)
      .single()
    
    if (error) throw error
    return data ? JSON.parse(data.chat) : []
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
        username,
        girl_name: '',
        chat: '[]'
      })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}