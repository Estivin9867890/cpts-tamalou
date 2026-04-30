'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { Utilisateur } from '@/types'
import { mockUtilisateurs } from '@/data/mockData'

interface AuthContextValue {
  user: Utilisateur | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'cpts_user_id'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Utilisateur | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const found = mockUtilisateurs.find(u => u.id === stored)
      if (found) setUser(found)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 700))
    if (password !== 'demo123') {
      setIsLoading(false)
      throw new Error('Identifiants incorrects.')
    }
    const found = mockUtilisateurs.find(u => u.email === email)
    if (!found) {
      setIsLoading(false)
      throw new Error('Identifiants incorrects.')
    }
    setUser(found)
    localStorage.setItem(STORAGE_KEY, found.id)
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
