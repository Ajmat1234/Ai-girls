import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, User, LogOut } from 'lucide-react'
import { girls } from '@/data/girls'
import { useAuth } from '@/hooks/useAuth'

export default function Index() {
  const navigate = useNavigate()
  const { user, logout, isLoggedIn } = useAuth()
  const [selectedGirl, setSelectedGirl] = useState<string | null>(null)

  const handleGirlSelect = (girlId: string) => {
    setSelectedGirl(girlId)
    navigate(`/chat/${girlId}`)
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  AI Girls
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Choose your perfect companion</p>
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
                    className="hover:bg-pink-100 p-1 sm:p-2"
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
            </div>
          </div>
        </div>
      </div>

      {/* Girls Grid */}
      <div className="max-w-4xl mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {girls.map((girl) => (
            <Card 
              key={girl.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 bg-white/80 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => handleGirlSelect(girl.id)}
            >
              <CardContent className="p-2 sm:p-3">
                <div className="relative">
                  <Avatar className="w-full aspect-[3/4] rounded-lg">  {/* Fixed: aspect-[3/4] w-full, height auto */}
                    <AvatarImage 
                      src={girl.image} 
                      alt={girl.name}
                      className="object-cover"  {/* Full image without crop */}
                    />
                    <AvatarFallback className="bg-pink-100 text-pink-600 text-lg rounded-lg">
                      {girl.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Status Indicator */}
                  <div className={`absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(girl.status)}`}></div>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-800 truncate">{girl.name}</h3>
                    <span className="text-xs text-gray-500">{girl.age}</span>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-pink-100 text-pink-700 hover:bg-pink-200 w-full justify-center py-0.5"
                  >
                    {girl.personality}
                  </Badge>
                  
                  <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                    {girl.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(girl.status)}`}></div>
                      <span className="capitalize">{girl.status}</span>
                    </div>
                    <MessageCircle className="w-4 h-4 text-pink-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {!isLoggedIn && (
          <Card className="mt-4 bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200">
            <CardContent className="p-3 sm:p-4 text-center">
              <h3 className="font-semibold text-pink-800 mb-1">Guest Mode</h3>
              <p className="text-sm text-pink-700 mb-2">
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
    </div>
  )
}
