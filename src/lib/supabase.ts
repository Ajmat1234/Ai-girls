import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Upload image function
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>M</mi><mi>a</mi><mi>t</mi><mi>h</mi><mi mathvariant="normal">.</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mi>o</mi><mi>m</mi><mo stretchy="false">(</mo><mo stretchy="false">)</mo></mrow><mi mathvariant="normal">.</mi></mrow><annotation encoding="application/x-tex">{Math.random()}.</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.10903em;">M</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">h</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mord mathnormal">o</span><span class="mord mathnormal">m</span><span class="mopen">(</span><span class="mclose">)</span></span><span class="mord">.</span></span></span></span>{fileExt}`
    const filePath = `chat-images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('chat-images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('chat-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Upload video function
export const uploadVideo = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>M</mi><mi>a</mi><mi>t</mi><mi>h</mi><mi mathvariant="normal">.</mi><mi>r</mi><mi>a</mi><mi>n</mi><mi>d</mi><mi>o</mi><mi>m</mi><mo stretchy="false">(</mo><mo stretchy="false">)</mo></mrow><mi mathvariant="normal">.</mi></mrow><annotation encoding="application/x-tex">{Math.random()}.</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.10903em;">M</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">h</span><span class="mord">.</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mord mathnormal">o</span><span class="mord mathnormal">m</span><span class="mopen">(</span><span class="mclose">)</span></span><span class="mord">.</span></span></span></span>{fileExt}`
    const filePath = `chat-videos/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('chat-videos')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('chat-videos')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Error uploading video:', error)
    throw error
  }
}
