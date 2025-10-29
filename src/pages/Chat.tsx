import { useParams, useNavigate } from 'react-router-dom'
import { girls } from '@/data/girls'
import ChatInterface from '@/components/ChatInterface'
import { useAuth } from '@/hooks/useAuth'

export default function Chat() {
  const { girlId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const girl = girls.find(g => g.id === girlId)

  if (!girl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Girl not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  return <ChatInterface girl={girl} />
}