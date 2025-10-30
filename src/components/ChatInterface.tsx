import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
  status?: 'sent' | 'delivered' | 'read'
}

export default function ChatInterface({ girl }: ChatInterfaceProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { messages, isLoading, isTyping, sendMessage, sendImageMessage } = useChat(girl.name, user?.username)
  const [inputMessage, setInputMessage] = useState('')
  const [isDark, setIsDark] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)

  useEffect(() => {
    scrollToBottom()
    document.documentElement.classList.toggle('dark', isDark)
  }, [messages, isTyping, isDark])

  // Refined Keyboard Detection (better for Android)
  useEffect(() => {
    let initialHeight = window.innerHeight
    const handleResize = () => {
      const newHeight = window.innerHeight
      const newViewportHeight = window.visualViewport ? window.visualViewport.height : newHeight
      const diff = initialHeight - newViewportHeight
      setKeyboardHeight(diff > 50 ? diff : 0)  // Threshold to avoid false positives
      setViewportHeight(newViewportHeight)
      if (diff > 50) {
        scrollToBottom()  // Auto-scroll on keyboard open
      }
    }

    window.addEventListener('resize', handleResize)
    window.visualViewport?.addEventListener('resize', handleResize)
    initialHeight = window.innerHeight

    return () => {
      window.removeEventListener('resize', handleResize)
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
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
      ? 'bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white shadow-xl rounded-2xl rounded-br-md'
      : isDark ? 'bg-gray-700 text-gray-100 shadow-xl rounded-2xl rounded-bl-md' : 'bg-white text-gray-900 shadow-lg border border-gray-200 rounded-2xl rounded-bl-md'
  }

  // Markdown renderer
  const renderMessageText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/\n/g, '<br />')
  }

  const insertEmoji = (emoji: string) => {
    setInputMessage(prev => prev + emoji)
    setShowEmoji(false)
  }

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isDark ? 'dark bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50'}`}>
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b dark:border-gray-700 shadow-lg z-50">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2 -ml-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <Avatar className="w-10 h-[13.33] aspect-[3/4] border-2 border-pink-200 dark:border-purple-200 flex-shrink-0">
                <AvatarImage src={girl.image} alt={girl.name} className="object-cover" />
                <AvatarFallback className={`bg-pink-100 dark:bg-purple-100 text-pink-600 dark:text-purple-600 font-bold`}>
                  {girl.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="min-w-0 flex-1">
                <h2 className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} text-base truncate`}>{girl.name}</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(girl.status)}`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{girl.status}</span>
                  {isTyping && (
                    <span className="text-xs text-pink-500 dark:text-pink-400 animate-pulse">typing...</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsDark(!isDark)}
                className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Messages - Dynamic padding for keyboard */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pt-2 dark:bg-gray-900" 
        style={{ 
          paddingBottom: `${keyboardHeight + 20}px`,  // Reserve space for input + keyboard
          height: `calc(100vh - 80px - ${keyboardHeight}px)`  // Adjust height dynamically
        }}
      >
        {messages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
          >
            <div className={`max-w-[80%] flex gap-2 items-end ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* AI Avatar only */}
              {message.sender === 'ai' && (
                <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                  <AvatarImage src={girl.image} className="object-cover" />
                  <AvatarFallback className="bg-pink-100 text-pink-600 font-bold">{girl.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              
              {/* No user avatar - removed "U" */}
              
              <div className={`p-4 rounded-2xl ${getBubbleClass(message.sender, isDark)} max-w-full break-words shadow-2xl relative max-w-xs lg:max-w-md`}>
                {message.type === 'image' ? (
                  <img 
                    src={message.text} 
                    alt="Shared image" 
                    className="max-w-full h-auto rounded-xl w-full" 
                    loading="lazy"
                  />
                ) : (
                  <div 
                    className={`text-sm leading-relaxed ${message.sender === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}
                    dangerouslySetInnerHTML={{ __html: renderMessageText(message.text) }}
                  />
                )}
                <div className="flex items-center justify-between mt-2 pt-1">
                  <span className={`text-xs opacity-70 ${message.sender === 'user' ? 'text-pink-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formatTime(message.timestamp)}
                  </span>
                  {message.sender === 'user' && message.status && (
                    <span className="text-xs opacity-70 ml-2">
                      {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                    </span>
                  )}
                  {message.sender === 'ai' && <span className="text-xs text-blue-500 ml-2">Seen</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-fade-in-up">
            <div className={`p-4 rounded-2xl ${getBubbleClass('ai', isDark)} max-w-xs shadow-2xl`}>
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input - Moves up with keyboard */}
      <div 
        className="flex-shrink-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t dark:border-gray-700 z-40 transition-all duration-300 ease-in-out"
        style={{ 
          transform: `translateY(calc(-100% + ${viewportHeight - keyboardHeight}px))`,  // Precise shift
          bottom: `${keyboardHeight}px`  // Position above keyboard
        }}
      >
        <div className="p-3 relative z-10">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmoji(!showEmoji)}
              className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2 rounded-full"
            >
              <Smile className="w-5 h-5" />
            </Button>
            
            {showEmoji && (
              <div className="absolute -bottom-20 left-4 bg-white dark:bg-gray-800 border rounded-xl p-3 shadow-xl z-50 flex flex-wrap gap-2 max-w-xs">
                {['😊', '😂', '❤️', '👍', '🔥', '😘', '🤔'].map(emoji => (
                  <button key={emoji} onClick={() => insertEmoji(emoji)} className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg transition-colors">
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2 rounded-full"
              disabled={isUploading}
            >
              <Image className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2 rounded-full"
              disabled={isUploading}
            >
              <Video className="w-5 h-5" />
            </Button>
            
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Message to ${girl.name}...`}
              className="flex-1 min-h-[44px] max-h-24 resize-none border-2 border-pink-200 dark:border-purple-200 focus:border-pink-500 dark:focus:border-purple-500 text-sm rounded-xl px-4 py-3 shadow-inner"
              disabled={isLoading || isUploading}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isUploading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-3 rounded-full shadow-lg flex-shrink-0"
            >
              <Send className="w-5 h-5" />
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
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 px-2">Uploading...</p>
          )}
        </div>
      </div>
    </div>
  )
              }
