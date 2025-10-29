import { useState, useEffect } from 'react'
import { getAIResponse } from '@/lib/aiService'
import { saveChatHistory, getChatHistory } from '@/lib/supabase'

interface Message {
  id: string
  text: string
  sender: 'user' | 'girl'
  timestamp: Date
  isTyping?: boolean
}

export const useChat = (girlName: string, username?: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (username && username.startsWith('guest_')) {
        // For guest users, just send welcome message
        sendWelcomeMessage()
      } else if (username) {
        try {
          const history = await getChatHistory(username, girlName)
          if (history && history.length > 0) {
            setMessages(history.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })))
          } else {
            sendWelcomeMessage()
          }
        } catch (error) {
          console.error('Error loading chat history:', error)
          sendWelcomeMessage()
        }
      } else {
        sendWelcomeMessage()
      }
    }

    loadChatHistory()
  }, [girlName, username])

  const sendWelcomeMessage = () => {
    const welcomeMessages: Record<string, string> = {
      'Priya': 'Hi... 😊 main Priya hun... tumse milke khushi hui... thoda nervous feel kr rhi hun but tumse baat krna chahti hun ☺️',
      'Ananya': 'Hey handsome 💕 main Ananya hun... romantic mood me hun aaj... tumhare saath time spend krna chahti hun 😘',
      'Kavya': 'Heyy! 😄 main Kavya hun... bohot excited hun tumse milne ke liye... kuch fun krte hai na! 🎉',
      'Riya': 'Hello, main Riya hun... 🤓 tumse intelligent conversations krna chahti hun... books pasand hai tumhe?',
      'Sneha': 'Hey baby 😘 main Sneha hun... confident aur flirty hun... tumhe impress krna chahti hun 💋',
      'Pooja': 'Hi sweetheart 🥰 main Pooja hun... tumhara care krna chahti hun... khana khaya tumne?',
      'Ishika': 'Yo! 🔥 main Ishika hun... adventure lover hun... koi exciting plan hai tumhara?',
      'Meera': 'Hey... 🎨 main Meera hun... artistic soul hun... tumhare saath kuch creative krna chahti hun 💕'
    }

    const welcomeMsg: Message = {
      id: Date.now().toString(),
      text: welcomeMessages[girlName] || welcomeMessages['Priya'],
      sender: 'girl',
      timestamp: new Date()
    }

    setMessages([welcomeMsg])
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user', 
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setIsTyping(true)

    try {
      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      const response = await getAIResponse(girlName, text, messages)
      
      const girlMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'girl',
        timestamp: new Date()
      }

      const newMessages = [...messages, userMessage, girlMessage]
      setMessages(newMessages)

      // Save to Supabase only if user is logged in (not guest)
      if (username && !username.startsWith('guest_')) {
        await saveChatHistory(username, girlName, newMessages)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry yaar, kuch problem aa gayi... thodi der baad try kro na 😅',
        sender: 'girl',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    sendWelcomeMessage()
  }

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    clearChat
  }
}
