import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { Testimonial } from '../types/dog-shelter'

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestimonials = async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.testimonials.list()
      if (!signal?.aborted) {
        setTestimonials(data)
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
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchTestimonials(controller.signal)
    return () => controller.abort()
  }, [])

  return { testimonials, loading, error, refetch: () => fetchTestimonials() }
}
