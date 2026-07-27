import { useQuery } from '@tanstack/react-query'
import { api, type DogListParams } from '../services/api'

const STALE_TIME = 1000 * 60 * 5 // 5 minutes

export function useDogs(params?: DogListParams) {
  const query = useQuery({
    queryKey: ['dogs', params],
    queryFn: () => api.dogs.list(params),
    staleTime: STALE_TIME,
  })

  return {
    dogs: query.data?.data ?? [],
    total: query.data?.meta.total ?? 0,
    loading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : 'Failed to fetch dogs') : null,
    refetch: query.refetch,
  }
}
