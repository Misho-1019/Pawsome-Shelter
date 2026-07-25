import { useState, useEffect } from 'react'
import { api, type Testimonial } from '../services/api'

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.testimonials.list()
      setTestimonials(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  return { testimonials, loading, error, refetch: fetchTestimonials }
}
