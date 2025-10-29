import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageCircle, Heart } from 'lucide-react'
import { Girl } from '@/data/girls'
import { useNavigate } from 'react-router-dom'

interface GirlCardProps {
  girl: Girl
}

export default function GirlCard({ girl }: GirlCardProps) {
  const navigate = useNavigate()

  const handleChatClick = () => {
    navigate(`/chat/${girl.id}`)
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
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 overflow-hidden">
      <div className="relative">
        <div className="aspect-[3/4] overflow-hidden">
          <img 
            src={girl.image}
            alt={girl.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(girl.status)} animate-pulse`}></div>
          <Badge variant="secondary" className="text-xs bg-white/80 backdrop-blur-sm">
            {girl.status}
          </Badge>
        </div>

        <div className="absolute top-3 left-3">
          <Badge className="bg-pink-500 text-white text-xs">
            {girl.age} years
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-800">{girl.name}</h3>
            <Heart className="w-5 h-5 text-pink-400 hover:text-pink-600 cursor-pointer hover:scale-110 transition-all" />
          </div>
          
          <p className="text-sm font-medium text-purple-600">{girl.personality}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{girl.description}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {girl.traits.slice(0, 3).map((trait, index) => (
            <Badge key={index} variant="outline" className="text-xs border-pink-300 text-pink-600">
              {trait}
            </Badge>
          ))}
        </div>

        <Button 
          onClick={handleChatClick}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat करें
        </Button>
      </CardContent>
    </Card>
  )
}