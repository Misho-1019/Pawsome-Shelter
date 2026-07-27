import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useTestimonials() {
  const query = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => api.testimonials.list(1, 100),
    staleTime: 1000 * 60 * 10, // 10 minutes - testimonials rarely change
  })

  return {
    testimonials: query.data?.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : 'Failed to fetch testimonials') : null,
    refetch: query.refetch,
  }
}
