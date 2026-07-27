import { useState, useEffect, useCallback } from 'react'
import { api, type Dog } from '../services/api'

export function useDogs(params?: { size?: string; status?: string }) {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDogs = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.dogs.list(params)
      if (!signal?.aborted) {
        setDogs(data)
      }
    } catch (err) {
      if (!signal?.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dogs')
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [params?.size, params?.status])

  useEffect(() => {
    const controller = new AbortController()
    fetchDogs(controller.signal)
    return () => controller.abort()
  }, [fetchDogs])

  return { dogs, loading, error, refetch: () => fetchDogs() }
}
