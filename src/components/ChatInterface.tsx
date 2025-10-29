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

interface ChatInterfaceProps {
  girl: Girl
}

export default function ChatInterface({ girl }: ChatInterfaceProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { messages, isLoading, isTyping, sendMessage } = useChat(girl.name, user?.username)
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <Card className="rounded-none border-b shadow-sm bg-white/80 backdrop-blur-sm">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-pink-100"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <Avatar className="w-10 h-10 border-2 border-pink-200">
                <AvatarImage src={girl.image} alt={girl.name} />
                <AvatarFallback className="bg-pink-100 text-pink-600">
                  {girl.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="font-semibold text-gray-800">{girl.name}</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(girl.status)}`}></div>
                  <span className="text-xs text-gray-500 capitalize">{girl.status}</span>
                  {isTyping && (
                    <span className="text-xs text-pink-500 animate-pulse">typing...</span>
                  )}
                </div>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" className="hover:bg-pink-100">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`p-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white ml-4'
                    : 'bg-white shadow-sm border mr-4'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
              <p className={`text-xs text-gray-400 mt-1 ${
                message.sender === 'user' ? 'text-right mr-4' : 'text-left ml-4'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border p-3 rounded-2xl mr-4">
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

      {/* Input */}
      <Card className="rounded-none border-t bg-white/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="hover:bg-pink-100"
            >
              <Image className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="hover:bg-pink-100"
            >
              <Video className="w-4 h-4" />
            </Button>
            
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${girl.name} को message भेजें...`}
              className="flex-1 border-pink-200 focus:border-pink-400"
              disabled={isLoading}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              // Handle file upload
              console.log('File selected:', e.target.files?.[0])
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
