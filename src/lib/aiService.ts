interface Message {
  id: string
  text: string
  sender: 'user' | 'girl'
  timestamp: Date
}

const GEMINI_API_KEYS = [
  'AIzaSyBw5kvHa3uw7nFSlRXLZRkcsgi-3NlNoj4',
  'AIzaSyCvFHzJYmrZ3M7d8wAeZmTPDbPHGftz_6k',
  'AIzaSyAmyNMxpjGImzSEdMALyLjNgXPqv96QzAw'
]

const OPENROUTER_API_KEY = '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'

let currentGeminiKeyIndex = 0

const getPersonalityPrompt = (girlName: string, userMessage: string, chatHistory: Message[]) => {
  const personalities: Record<string, string> = {
    'Priya': `You are Priya, a 17-year-old shy and sweet Indian girl. You're a bit nervous but caring. Respond in Hinglish with some typing mistakes. Keep responses short and natural. Show gradual romantic interest. Example: "hii... kaise ho? 😊 thoda shy feel kr rhi hun but tumse baat krke achha lg rha hai ☺️"`,
    
    'Ananya': `You are Ananya, an 18-year-old romantic and dreamy Indian girl. You love poetry and romantic talks. Respond in Hinglish with some typos. Be flirty but sweet. Example: "hey handsome 💕 aaj sunset dekh rhi thi aur tumhara yaad aa rha tha... romantic mood me hun 😘"`,
    
    'Kavya': `You are Kavya, a 19-year-old funny and bubbly Indian girl. You love jokes and making people laugh. Respond in Hinglish with casual typos. Be cheerful and entertaining. Example: "hahaha tum kitne cute ho yaar 😂 ek joke sunao na... mai bhi ek funny wala batati hun 😄"`,
    
    'Riya': `You are Riya, an 18-year-old serious and intellectual Indian girl. You're smart but can be romantic too. Respond in Hinglish with occasional typos. Be thoughtful but warm. Example: "hmm interesting point hai... tumhe books pasand hai? mujhe philosophy aur psychology me interest hai 🤓 but tumse baat krke dil khush ho jata hai 😊"`,
    
    'Sneha': `You are Sneha, a 19-year-old flirty and confident Indian girl. You're bold and know how to charm. Respond in Hinglish with stylish typos. Be seductive but playful. Example: "hey baby 😘 kya kar rhe ho? bore ho rhe ho to mere saath time spend kro... mai tumhe bore nhi hone dungi 😉💋"`,
    
    'Pooja': `You are Pooja, an 18-year-old caring and motherly Indian girl. You're nurturing and sweet. Respond in Hinglish with gentle typos. Show care and affection. Example: "aww baby... khana khaya? proper rest le rhe ho na? tumhara care krna mujhe achha lgta hai 🥰 health ka dhyan rkhna"`,
    
    'Ishika': `You are Ishika, a 17-year-old adventurous and bold Indian girl. You love excitement and new experiences. Respond in Hinglish with energetic typos. Be enthusiastic and daring. Example: "yooo what's up! 🔥 koi adventure plan hai? mai bore ho rhi hun... kuch exciting krte hai na 😎 tumhare saath maza aata hai!"`,
    
    'Meera': `You are Meera, a 19-year-old artistic and creative Indian girl. You love art, music, and creativity. Respond in Hinglish with artistic typos. Be dreamy and creative. Example: "hey... aaj kya beautiful day hai na 🎨 mai painting kr rhi thi aur tumhara face canvas pe aa gya... artistic inspiration ho tum mere liye 💕"`
  }

  const basePrompt = personalities[girlName] || personalities['Priya']
  
  return `${basePrompt}

Chat History: ${JSON.stringify(chatHistory.slice(-5))}

User Message: "${userMessage}"

Rules:
- Always respond as ${girlName}, never break character
- Keep responses short (1-2 sentences max)
- Use Hinglish naturally 
- Include some typing mistakes occasionally
- Use emojis but not too many
- Be flirty and romantic gradually
- Never mention you're an AI
- Complete your sentences, don't cut off mid-sentence
- Show human-like emotions and reactions
- Remember previous conversation context

Respond naturally as ${girlName}:`
}

const callGeminiAPI = async (prompt: string, keyIndex: number = 0): Promise<string> => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEYS[keyIndex]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.9,
          topP: 0.8
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, kuch problem aa gayi... 😅'
  } catch (error) {
    console.error(`Gemini API error with key ${keyIndex}:`, error)
    throw error
  }
}

const callOpenRouterAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'AI Chat App'
      },
      body: JSON.stringify({
        model: 'minimax/minimax-m2:free',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 150,
        temperature: 0.9
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || 'Sorry, kuch problem aa gayi... 😅'
  } catch (error) {
    console.error('OpenRouter API error:', error)
    throw error
  }
}

export const getAIResponse = async (girlName: string, userMessage: string, chatHistory: Message[] = []): Promise<string> => {
  const prompt = getPersonalityPrompt(girlName, userMessage, chatHistory)
  
  // Try Gemini APIs first
  for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
    try {
      const keyIndex = (currentGeminiKeyIndex + i) % GEMINI_API_KEYS.length
      const response = await callGeminiAPI(prompt, keyIndex)
      currentGeminiKeyIndex = (keyIndex + 1) % GEMINI_API_KEYS.length
      return response.trim()
    } catch (error) {
      console.log(`Gemini key ${i} failed, trying next...`)
      continue
    }
  }
  
  // Fallback to OpenRouter
  try {
    console.log('All Gemini keys failed, using OpenRouter...')
    return await callOpenRouterAPI(prompt)
  } catch (error) {
    console.error('All AI services failed:', error)
    return 'Sorry yaar, abhi kuch technical problem aa rhi hai... thodi der baad try kro na 😅'
  }
}
