import { useState, useEffect } from 'react'
import { createUser } from '@/lib/supabase'

interface User {
  username: string
  isLoggedIn: boolean
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      const guestUser = { username: `guest_${Date.now()}`, isLoggedIn: false }
      setUser(guestUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string) => {
    try {
      const userData = { username, isLoggedIn: true }
      
      await createUser(username)
      
      localStorage.setItem('chatUser', JSON.stringify(userData))
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('chatUser')
    const guestUser = { username: `guest_${Date.now()}`, isLoggedIn: false }
    setUser(guestUser)
  }

  const loginAsGuest = () => {
    const guestUser = { username: `guest_${Date.now()}`, isLoggedIn: false }
    setUser(guestUser)
    return guestUser
  }

  return {
    user,
    isLoading,
    login,
    logout,
    loginAsGuest,
    isLoggedIn: user?.isLoggedIn || false
  }
}