'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface FavoritesContextType {
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  favoriteIds: string[]
}

const FavoritesContext = createContext<FavoritesContextType>({
  isFavorite: () => false,
  toggleFavorite: () => {},
  favoriteIds: [],
})

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cpts_favorites')
    if (stored) {
      try { setFavoriteIds(JSON.parse(stored)) } catch {}
    }
  }, [])

  function toggleFavorite(id: string) {
    setFavoriteIds(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem('cpts_favorites', JSON.stringify(next))
      return next
    })
  }

  function isFavorite(id: string) {
    return favoriteIds.includes(id)
  }

  return (
    <FavoritesContext.Provider value={{ isFavorite, toggleFavorite, favoriteIds }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
