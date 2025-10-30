import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ChatRecord {
  id: string
  user: string
  girl_name: string
  chat: string
  access_key: string
  created_at: string
}

// Save chat history to Supabase
export const saveChatHistory = async (user: string, girlName: string, chatHistory: any[]) => {
  try {
    const { data, error } = await supabase
      .from('Table')
      .upsert({
        user,
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

// Get chat history from Supabase
export const getChatHistory = async (user: string, girlName: string) => {
  try {
    const { data, error } = await supabase
      .from('Table')
      .select('*')
      .eq('user', user)
      .eq('girl_name', girlName)
      .single()
    
    if (error) throw error
    return data ? JSON.parse(data.chat) : []
  } catch (error) {
    console.error('Error getting chat:', error)
    return []
  }
}

// Create new user in Supabase
export const createUser = async (user: string) => {
  try {
    const { data, error } = await supabase
      .from('Table')
      .insert({
        user,
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

// Upload image to Supabase storage
export const uploadImage = async (file: File, username?: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>u</mi><mi>s</mi><mi>e</mi><mi>r</mi><mi>n</mi><mi>a</mi><mi>m</mi><mi>e</mi><mi mathvariant="normal">∣</mi><msup><mi mathvariant="normal">∣</mi><mo mathvariant="normal" lspace="0em" rspace="0em">′</mo></msup><mi>a</mi><mi>n</mi><mi>o</mi><mi>n</mi><mi>y</mi><mi>m</mi><mi>o</mi><mi>u</mi><msup><mi>s</mi><mo mathvariant="normal" lspace="0em" rspace="0em">′</mo></msup></mrow><mi mathvariant="normal">/</mi></mrow><annotation encoding="application/x-tex">{username || &#x27;anonymous&#x27;}/</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.0019em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal">u</span><span class="mord mathnormal" style="margin-right:0.02778em;">ser</span><span class="mord mathnormal">nam</span><span class="mord mathnormal">e</span><span class="mord">∣</span><span class="mord"><span class="mord">∣</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mord mathnormal">an</span><span class="mord mathnormal">o</span><span class="mord mathnormal">n</span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mord mathnormal">m</span><span class="mord mathnormal">o</span><span class="mord mathnormal">u</span><span class="mord"><span class="mord mathnormal">s</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span></span><span class="mord">/</span></span></span></span>{Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('chat-images')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat-images')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

// Upload video to Supabase storage
export const uploadVideo = async (file: File, username?: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>u</mi><mi>s</mi><mi>e</mi><mi>r</mi><mi>n</mi><mi>a</mi><mi>m</mi><mi>e</mi><mi mathvariant="normal">∣</mi><msup><mi mathvariant="normal">∣</mi><mo mathvariant="normal" lspace="0em" rspace="0em">′</mo></msup><mi>a</mi><mi>n</mi><mi>o</mi><mi>n</mi><mi>y</mi><mi>m</mi><mi>o</mi><mi>u</mi><msup><mi>s</mi><mo mathvariant="normal" lspace="0em" rspace="0em">′</mo></msup></mrow><mi mathvariant="normal">/</mi></mrow><annotation encoding="application/x-tex">{username || &#x27;anonymous&#x27;}/</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.0019em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal">u</span><span class="mord mathnormal" style="margin-right:0.02778em;">ser</span><span class="mord mathnormal">nam</span><span class="mord mathnormal">e</span><span class="mord">∣</span><span class="mord"><span class="mord">∣</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mord mathnormal">an</span><span class="mord mathnormal">o</span><span class="mord mathnormal">n</span><span class="mord mathnormal" style="margin-right:0.03588em;">y</span><span class="mord mathnormal">m</span><span class="mord mathnormal">o</span><span class="mord mathnormal">u</span><span class="mord"><span class="mord mathnormal">s</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span></span><span class="mord">/</span></span></span></span>{Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('chat-videos')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading video:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat-videos')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Error uploading video:', error)
    return null
  }
}
