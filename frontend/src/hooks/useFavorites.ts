import { useState, useEffect, useCallback, useRef } from 'react'

const FAVORITES_KEY = 'pawsome-favorites'

function readFavorites(): number[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(FAVORITES_KEY)
  if (!stored) return []
  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>(readFavorites)
  const isInitialMount = useRef(true)

  // Persist to localStorage on changes (skip initial mount to avoid redundant write)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch {
      // localStorage may be full or disabled (private browsing) — silently ignore
    }
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
