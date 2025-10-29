import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Search, User, LogOut, Settings } from 'lucide-react'
import { girls } from '@/data/girls'
import GirlCard from '@/components/GirlCard'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const navigate = useNavigate()
  const { user, logout, isLoggedIn } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null)

  const personalities = ['Shy', 'Romantic', 'Funny', 'Smart', 'Flirty', 'Caring', 'Adventurous', 'Artistic']

  const filteredGirls = girls.filter(girl => {
    const matchesSearch = girl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         girl.personality.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPersonality = !selectedPersonality || 
                              girl.traits.some(trait => trait.toLowerCase().includes(selectedPersonality.toLowerCase()))
    return matchesSearch && matchesPersonality
  })

  const handleLogout = () => {
    logout()
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ChatMate
                </h1>
                <p className="text-sm text-gray-600">Find your perfect chat partner</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn && (
                <div className="flex items-center gap-2 px-3 py-1 bg-pink-100 rounded-full">
                  <User className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-medium text-pink-700">{user.username}</span>
                </div>
              )}
              
              {!isLoggedIn && (
                <Button 
                  onClick={() => navigate('/auth')}
                  size="sm" 
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Login करें
                </Button>
              )}
              
              <Button variant="ghost" size="sm" className="hover:bg-pink-100">
                <Settings className="w-4 h-4" />
              </Button>
              
              {isLoggedIn && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="hover:bg-pink-100"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isLoggedIn ? `Welcome back, ${user.username}!` : 'Welcome, Guest!'}
          </h2>
          <p className="text-gray-600 mb-6">
            Choose your favorite chat partner and start an amazing conversation
          </p>
          
          {!isLoggedIn && (
            <Card className="max-w-md mx-auto bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-yellow-700 mb-2">
                  आप guest mode में हैं - chat history save नहीं होगी
                </p>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/auth')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Login करें
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or personality..."
              className="pl-10 border-pink-200 focus:border-pink-400"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedPersonality === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPersonality(null)}
              className={selectedPersonality === null ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200 hover:bg-pink-50"}
            >
              All
            </Button>
            {personalities.map((personality) => (
              <Button
                key={personality}
                variant={selectedPersonality === personality ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPersonality(personality)}
                className={selectedPersonality === personality ? "bg-pink-500 hover:bg-pink-600" : "border-pink-200 hover:bg-pink-50"}
              >
                {personality}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {filteredGirls.map((girl) => (
            <GirlCard key={girl.id} girl={girl} />
          ))}
        </div>

        {filteredGirls.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No girls found matching your search</p>
            <Button 
              onClick={() => {
                setSearchQuery('')
                setSelectedPersonality(null)
              }}
              className="mt-4 bg-pink-500 hover:bg-pink-600 text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-pink-200">
            <div className="text-2xl font-bold text-pink-600">{girls.length}</div>
            <div className="text-sm text-gray-600">Available Girls</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-pink-200">
            <div className="text-2xl font-bold text-green-600">{girls.filter(g => g.status === 'online').length}</div>
            <div className="text-sm text-gray-600">Online Now</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-pink-200">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-pink-200">
            <div className="text-2xl font-bold text-blue-600">∞</div>
            <div className="text-sm text-gray-600">Free Chats</div>
          </div>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-pink-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">
            Made with <Heart className="w-4 h-4 inline text-pink-500" /> for amazing conversations
          </p>
        </div>
      </footer>
    </div>
  )
}