import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Image, Video, ArrowLeft, MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Girl } from '@/data/girls'
import { useChat } from '@/hooks/useChat'
import { useAuth } from '@/hooks/useAuth'
import { uploadImage } from '@/lib/supabase'

interface ChatInterfaceProps {
  girl: Girl
}

export default function ChatInterface({ girl }: ChatInterfaceProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { messages, isLoading, isTyping, sendMessage, sendImageMessage } = useChat(girl.name, user?.username)
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      await sendMessage(inputMessage)
      setInputMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.username) return

    setIsUploading(true)
    try {
      const imageUrl = await uploadImage(file, user.username)
      if (imageUrl && sendImageMessage) {
        await sendImageMessage(imageUrl)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-b shadow-sm">
        <div className="px-2 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-pink-100 p-1 sm:p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-pink-200 flex-shrink-0">
                <AvatarImage src={girl.image} alt={girl.name} />
                <AvatarFallback className="bg-pink-100 text-pink-600">
                  {girl.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{girl.name}</h2>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusColor(girl.status)}`}></div>
                  <span className="text-xs text-gray-500 capitalize">{girl.status}</span>
                  {isTyping && (
                    <span className="text-xs text-pink-500 animate-pulse">typing...</span>
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="hover:bg-pink-100 p-1 sm:p-2 flex-shrink-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container - Scrollable */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 space-y-2 sm:space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] sm:max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              {message.type === 'image' ? (
                <div className={`rounded-2xl overflow-hidden ${
                  message.sender === 'user' ? 'ml-2 sm:ml-4' : 'mr-2 sm:mr-4'
                }`}>
                  <img 
                    src={message.text} 
                    alt="Shared image" 
                    className="max-w-full h-auto rounded-2xl shadow-sm"
                  />
                </div>
              ) : (
                <div
                  className={`p-2 sm:p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white ml-2 sm:ml-4'
                      : 'bg-white shadow-sm border mr-2 sm:mr-4'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                </div>
              )}
              <p className={`text-xs text-gray-400 mt-1 px-1 ${
                message.sender === 'user' ? 'text-right mr-2 sm:mr-4' : 'text-left ml-2 sm:ml-4'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border p-2 sm:p-3 rounded-2xl mr-2 sm:mr-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed at bottom */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm border-t">
        <div className="p-2 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="hover:bg-pink-100 p-1 sm:p-2 flex-shrink-0"
              disabled={isUploading}
            >
              <Image className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="hover:bg-pink-100 p-1 sm:p-2 flex-shrink-0"
              disabled={isUploading}
            >
              <Video className="w-4 h-4" />
            </Button>
            
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${girl.name} को message भेजें...`}
              className="flex-1 border-pink-200 focus:border-pink-400 text-sm"
              disabled={isLoading || isUploading}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isUploading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-2 sm:p-3 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  )
          }
