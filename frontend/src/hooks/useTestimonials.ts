import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'
import type { Testimonial } from '../types/dog-shelter'

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestimonials = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.testimonials.list(1, 100)
      if (!signal?.aborted) {
        setTestimonials(response.data)
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to fetch testimonials')
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchTestimonials(controller.signal)
    return () => controller.abort()
  }, [fetchTestimonials])

  return { testimonials, loading, error, refetch: () => fetchTestimonials() }
}
