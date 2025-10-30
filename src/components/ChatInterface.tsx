import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Image, Video, ArrowLeft, MoreVertical, Smile, Moon, Sun, Share2 } from 'lucide-react'
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const dark = savedTheme === 'dark'
    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
    scrollToBottom()
  }, [messages, isTyping])

  const toggleDarkMode = () => {
    const newDark = !isDark
    setIsDark(newDark)
    document.documentElement.classList.toggle('dark', newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
  }

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Chat with ${girl.name}`,
          text: messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n'),
        })
      } catch (error) {
        console.error('Share failed', error)
      }
    } else {
      navigator.clipboard.writeText(`Chat with ${girl.name}\n${messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n')}`)
        .then(() => alert('Chat copied to clipboard!'))
        .catch(() => alert('Share not supported'))
    }
  }

  const handleMessageTap = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Message copied!'))
      .catch(() => alert('Copy failed!'))
  }

  const handleTriggerBurn = (id: string) => {
    console.log('Message burned:', id)
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
      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg rounded-3xl rounded-br-md'
      : isDark ? 'bg-gray-700 text-white shadow-lg rounded-3xl rounded-bl-md' : 'bg-white shadow-sm border rounded-3xl rounded-bl-md'
  }

  const renderMessageText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br />')
  }

  const insertEmoji = (emoji: string) => {
    setInputMessage(prev => prev + emoji)
    setShowEmoji(false)
  }

  // Aura Glow for Typing (conditional on isTyping)
  const getTypingAura = () => {
    if (!isTyping) return ''
    return isDark 
      ? 'shadow-[0_0_20px_6px_rgba(255,105,180,0.6)] animate-pulseGlow' 
      : 'shadow-[0_0_20px_6px_rgba(255,105,180,0.8)] animate-pulseGlow'
  }

  return (
    <div className={`flex flex-col h-[100dvh] ${isDark ? 'dark bg-gray-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50'}`}>
      {/* Fixed Header with Typing Glow */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b dark:border-gray-700 shadow-sm z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              {/* Aura Glow Wrapper - Only on Typing */}
              <div className={`relative p-1 rounded-full transition-all duration-500 ${getTypingAura()}`}>
                <Avatar className="w-12 h-16 border-2 border-pink-200 dark:border-purple-200 flex-shrink-0">
                  <AvatarImage src={girl.image} alt={girl.name} className="object-cover" />
                  <AvatarFallback className="bg-pink-100 dark:bg-purple-100 text-pink-600 dark:text-purple-600 font-bold">
                    {girl.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="min-w-0 flex-1">
                <h2 className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} text-base truncate`}>{girl.name}</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(girl.status)}`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{girl.status}</span>
                  {isTyping && <span className="text-xs text-pink-500 dark:text-pink-400 animate-pulse">typing...</span>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleDarkMode}
                className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pt-20 dark:bg-gray-900 pb-24 min-h-0">
        {/* Animated Gradient */}
        <AnimatedGradient />

        {messages.map((message: Message) => (
          <MessageBubble
            key={message.id}
            id={message.id}
            sender={message.sender}
            text={message.text}
            timestamp={message.timestamp}
            onTriggerBurn={handleTriggerBurn}
            onCopy={handleMessageTap}
          />
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-3xl ${getBubbleClass('ai', isDark)} max-w-[75%] shadow-md`}>
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
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t dark:border-gray-700 z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="p-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmoji(!showEmoji)}
              className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2"
            >
              <Smile className="w-5 h-5" />
            </Button>
            
            {showEmoji && (
              <div className="absolute bottom-20 left-4 bg-white dark:bg-gray-800 border rounded-lg p-2 shadow-lg z-30 flex flex-wrap gap-1 max-w-xs">
                {['😊', '😂', '❤️', '👍', '🔥', '😘', '💃', '❤️‍🔥', '😠'].map(emoji => (
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
              className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2"
              disabled={isUploading}
            >
              <Image className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="hover:bg-pink-100 dark:hover:bg-gray-700 p-2"
              disabled={isUploading}
            >
              <Video className="w-5 h-5" />
            </Button>
            
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Message to ${girl.name}...`}
              className="flex-1 min-h-[44px] max-h-24 resize-none border border-gray-300 dark:border-gray-600 focus:border-pink-500 dark:focus:border-purple-500 text-sm px-4 py-3 rounded-lg"
              disabled={isLoading || isUploading}
            />
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || isTyping}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-3 rounded-lg flex-shrink-0"
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
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">Uploading...</p>
          )}
        </div>
      </footer>
    </div>
  )
                            }
