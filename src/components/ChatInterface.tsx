import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'  // <-- ये अलग import
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Image, Video, ArrowLeft, MoreVertical, Smile, Moon, Sun } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Girl } from '@/data/girls'
import { useChat } from '@/hooks/useChat'
import { useAuth } from '@/hooks/useAuth'
import { uploadImage } from '@/lib/supabase'

interface ChatInterfaceProps {
  girl: Girl
}

interface Message {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: Date
  type: 'text' | 'image'
  status?: 'sent' | 'delivered' | 'read'  // New: message status
}

export default function ChatInterface({ girl }: ChatInterfaceProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { messages, isLoading, isTyping, sendMessage, sendImageMessage } = useChat(girl.name, user?.username)
  const [inputMessage, setInputMessage] = useState('')
  const [isDark, setIsDark] = useState(false)  // New: Dark mode
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)  // New: Emoji picker (simple)

  useEffect(() => {
    scrollToBottom()
    // Dark mode apply
    document.documentElement.classList.toggle('dark', isDark)
  }, [messages, isTyping, isDark])

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
      case 'online': return isDark ? 'bg-green-400' : 'bg-green-500'
      case 'away': return isDark ? 'bg-yellow-400' : 'bg-yellow-500'
      case 'busy': return isDark ? 'bg-red-400' : 'bg-red-500'
      default: return isDark ? 'bg-gray-600' : 'bg-gray-500'
    }
  }

  const getBubbleClass = (sender: 'user' | 'ai', isDark: boolean) => {
    return sender === 'user'
      ? `bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg`
      : isDark ? 'bg-gray-700 text-white shadow-lg' : 'bg-white shadow-sm border'
  }

  // Simple emoji insert (expand if want full picker)
  const insertEmoji = (emoji: string) => {
    setInputMessage(prev => prev + emoji)
    setShowEmoji(false)
  }

  return (
    <div className={`flex flex-col h-[100dvh] overflow-hidden ${isDark ? 'dark bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50'}`}>
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b dark:border-gray-700 shadow-sm z-50">
        <div className="px-2 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-pink-100 dark:hover:bg-gray-700 p-1 sm:p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <Avatar className="w-10 h-[13.33] aspect-[3/4] border-2 border-pink-200 dark:border-purple-200 flex-shrink-0">  {/* 3:4 ratio fixed */}
                <AvatarImage src={girl.image} alt={girl.name} className="object-cover" />
                <AvatarFallback className={`bg-pink-100 dark:bg-purple-100 text-pink-600 dark:text-purple-600`}>
                  {girl.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="min-w-0 flex-1">
                <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'} text-sm sm:text-base truncate`}>{girl.name}</h2>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusColor(girl.status)}`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{girl.status}</span>
                  {isTyping && (
                    <span className="text-xs text-pink-500 dark:text-pink-400 animate-pulse">typing...</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsDark(!isDark)}
                className="hover:bg-pink-100 dark:hover:bg-gray-700 p-1"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-pink-100 dark:hover:bg-gray-700 p-1 sm:p-2 flex-shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 space-y-3 pt-2 dark:bg-gray-900">
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`max-w-[85%] sm:max-w-[75%] flex gap-2 items-end ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar for AI messages */}
              {message.sender === 'ai' && (
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage src={girl.image} className="object-cover" />
                  <AvatarFallback>{girl.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              
              <div className={`p-3 rounded-2xl ${getBubbleClass(message.sender, isDark)} max-w-full break-words shadow-md`}>
                {message.type === 'image' ? (
                  <img 
                    src={message.text} 
                    alt="Shared image" 
                    className="max-w-full h-auto rounded-2xl w-full" 
                    loading="lazy"  // Performance
                  />
                ) : (
                  <p className={`text-sm whitespace-pre-wrap ${message.sender === 'user' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {message.text}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs opacity-75 ${message.sender === 'user' ? 'text-pink-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                  {message.sender === 'user' && message.status && (
                    <span className="text-xs opacity-75 ml-2">
                      {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                    </span>
                  )}
                  {message.sender === 'ai' && <span className="text-xs text-blue-500 ml-2">Read</span>}  {/* Read receipt */}
                </div>
              </div>
              
              {/* Small avatar for user messages */}
              {message.sender === 'user' && (
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
            <div className={`p-3 rounded-2xl ${getBubbleClass('ai', isDark)} max-w-[75%] shadow-md`}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input */}
      <div className="flex-shrink-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-t dark:border-gray-700 z-40 pb-[env(safe-area-inset-bottom)]">  {/* Safe area */}
        <div className="p-2 sm:p-4">
          <div className="flex items-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmoji(!showEmoji)}
              className="hover:bg-pink-100 dark:hover:bg-gray-700 p-1"
            >
              <Smile className="w-4 h-4" />
            </Button>
            
            {showEmoji && (
              <div className="absolute bottom-16 left-4 bg-white dark:bg-gray-800 border rounded-lg p-2 shadow-lg z-50 flex flex-wrap gap-1 max-w-xs">  {/* Simple emoji grid */}
                {['😊', '😂', '❤️', '👍', '🔥'].map(emoji => (
                  <button key={emoji} onClick={() => insertEmoji(emoji)} className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded">
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="hover:bg-pink-100 dark:hover:bg-gray-700 p-1"
              disabled={isUploading}
            >
              <Image className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="hover:bg-pink-100 dark:hover:bg-gray-700 p-1"
              disabled={isUploading}
            >
              <Video className="w-4 h-4" />
            </Button>
            
            <Textarea  // Changed to Textarea for auto-resize
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Message to ${girl.name}...`}
              className="flex-1 min-h-[44px] max-h-32 resize-none border-pink-200 dark:border-purple-200 focus:border-pink-400 dark:focus:border-purple-400 text-sm"
              disabled={isLoading || isUploading}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isUploading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-2 sm:p-3 flex-shrink-0 shadow-lg"
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
          
          {isUploading && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">Uploading...</p>
          )}
        </div>
      </div>
    </div>
  )
            }
