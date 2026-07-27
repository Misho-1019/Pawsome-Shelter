import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

interface UseContentResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Generic hook to fetch CMS content from /api/v1/content/:section.
// Returns the data field of the section (typed by caller).
export function useContent<T = Record<string, unknown>>(sectionName: string): UseContentResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.content.get<T>(sectionName)
      if (!signal?.aborted) {
        setData(response.data)
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to load content')
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [sectionName])

  useEffect(() => {
    const controller = new AbortController()
    fetchContent(controller.signal)
    return () => controller.abort()
  }, [fetchContent])

  return { data, loading, error, refetch: () => fetchContent() }
}

// Typed wrappers for known sections
export type HeroContent = {
  headline: string
  subtext: string
  ctaText: string
  secondaryText: string
}

export type AboutContent = {
  title: string
  description: string
  stats: { label: string; value: string }[]
}

export type ContactContent = {
  address: string
  phone: string
  hours: string
  social?: {
    facebook: string
    instagram: string
    twitter: string
    tiktok: string
  }
}

export function useHeroContent() {
  return useContent<HeroContent>('hero')
}

export function useAboutContent() {
  return useContent<AboutContent>('about')
}

export function useContactContent() {
  return useContent<ContactContent>('contact')
}
