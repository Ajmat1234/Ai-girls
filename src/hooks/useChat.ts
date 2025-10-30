import { useState, useCallback } from 'react'

export interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  imageUrl?: string
  videoUrl?: string
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `AI response to: ${content}`,
          sender: 'ai',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
    }
  }, [])

  const sendImageMessage = useCallback(async (imageUrl: string, caption?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: caption || 'Image sent',
      sender: 'user',
      timestamp: new Date(),
      imageUrl
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Simulate AI response to image
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'I can see your image! That looks interesting.',
          sender: 'ai',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error('Error sending image message:', error)
      setIsLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    sendImageMessage,
    clearMessages
  }
}
