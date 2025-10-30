import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, User, LogOut, Settings, Phone, Camera, HeartPulse, Lightbulb, MessageSquare, Sun, Moon } from 'lucide-react'
import { girls } from '@/data/girls'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'  // For dummy feature toasts

export default function Index() {
  const navigate = useNavigate()
  const { user, logout, isLoggedIn } = useAuth()
  const [selectedGirl, setSelectedGirl] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const handleGirlSelect = (girlId: string) => {
    setSelectedGirl(girlId)
    navigate(`/chat/${girlId}`)
  }

  const handleFeatureClick = (feature: string) => {
    toast.info(`${feature} - Coming Soon!`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const highlights = [
    { icon: Heart, text: '8 Unique Personalities', desc: 'From shy to bold, find your match' },
    { icon: MessageCircle, text: '24/7 Available', desc: 'Always there when you need' },
    { icon: User, text: 'Private & Safe', desc: 'Your conversations stay yours' },
    { icon: Phone, text: 'Voice & Video', desc: 'Feel closer with real-time calls' },
  ]

  const features = [
    { icon: MessageSquare, title: 'Private Chats', desc: 'Endless conversations, just for you', color: 'from-blue-500 to-indigo-600' },
    { icon: Camera, title: 'Photo Sharing', desc: 'Share moments and memories', color: 'from-pink-500 to-rose-600' },
    { icon: HeartPulse, title: 'Mood Tracker', desc: 'Understand her feelings better', color: 'from-green-500 to-emerald-600' },
    { icon: Phone, title: 'Voice Messages', desc: 'Hear her voice, feel the emotion', color: 'from-purple-500 to-violet-600' },
    { icon: Lightbulb, title: 'Daily Tips', desc: 'Advice to keep the spark alive', color: 'from-yellow-500 to-amber-600' },
    { icon: MessageCircle, title: 'Unlimited Messages', desc: 'No limits, no interruptions', color: 'from-orange-500 to-red-600' },
  ]

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${isDark ? 'dark:bg-gray-800/90 bg-gray-100/90' : 'bg-white/90'} backdrop-blur-sm border-b shadow-sm sticky top-0 z-10`}>
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Heart to Heart
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Connect with real companions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user?.username}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="hover:bg-pink-100 dark:hover:bg-gray-700 p-1 sm:p-2"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm px-3 py-1"
                >
                  Login
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleDarkMode}
                className="hover:bg-pink-100 dark:hover:bg-gray-700 p-1 sm:p-2"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-pink-100 dark:hover:bg-gray-700 p-1 sm:p-2"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
              <highlight.icon className="w-6 h-6 text-pink-500" />
              <div>
                <h3 className="font-semibold text-sm">{highlight.text}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{highlight.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Girls Grid */}
      <div className="max-w-4xl mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {girls.map((girl) => (
            <Card 
              key={girl.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] min-h-[250px]"
              onClick={() => handleGirlSelect(girl.id)}
            >
              <CardContent className="p-2 sm:p-3 flex flex-col h-full">
                <div className="relative flex-1">
                  <Avatar className="w-full aspect-[3/4] rounded-lg h-full">
                    <AvatarImage 
                      src={girl.image} 
                      alt={girl.name}
                      className="object-contain"
                    />
                    <AvatarFallback className="bg-pink-100 dark:bg-purple-100 text-pink-600 dark:text-purple-600 text-lg rounded-lg flex items-center justify-center">
                      {girl.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(girl.status)}`}></div>
                </div>
                
                <div className="mt-2 space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-white truncate">{girl.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{girl.age}</span>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-pink-100 dark:bg-purple-100 text-pink-700 dark:text-purple-700 hover:bg-pink-200 dark:hover:bg-purple-200 w-full justify-center py-0.5"
                  >
                    {girl.personality}
                  </Badge>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-tight">
                    {girl.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(girl.status)}`}></div>
                      <span className="capitalize">{girl.status}</span>
                    </div>
                    <MessageCircle className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {!isLoggedIn && (
          <Card className="mt-6 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 border-pink-200 dark:border-purple-200">
            <CardContent className="p-3 sm:p-4 text-center">
              <h3 className="font-semibold text-pink-800 dark:text-purple-200 mb-1">Guest Mode</h3>
              <p className="text-sm text-pink-700 dark:text-purple-300 mb-2">
                You're browsing as guest. Login to save your conversations!
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm"
              >
                Login Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Why Choose Heart to Heart?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => handleFeatureClick(feature.title)}>
              <feature.icon className={`w-12 h-12 mx-auto mb-4 text-${feature.color.split('-')[0]}-500`} />
              <h3 className="font-bold text-lg mb-2 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
                           }
