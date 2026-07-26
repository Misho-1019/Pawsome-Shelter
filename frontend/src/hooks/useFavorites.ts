import { useState, useEffect, useCallback } from 'react'

const FAVORITES_KEY = 'pawsome-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch {
        setFavorites([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = useCallback((dogId: number) => {
    setFavorites((prev) =>
      prev.includes(dogId)
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId]
    )
  }, [])

  const isFavorite = useCallback((dogId: number) => {
    return favorites.includes(dogId)
  }, [favorites])

  const favoritesCount = favorites.length

  return { favorites, toggleFavorite, isFavorite, favoritesCount }
}
