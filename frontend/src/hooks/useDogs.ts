import { useState, useEffect, useCallback } from 'react'
import { api, type DogListParams } from '../services/api'
import type { Dog } from '../types/dog-shelter'

export function useDogs(params?: DogListParams) {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchDogs = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.dogs.list(params)
      if (!signal?.aborted) {
        setDogs(response.data)
        setTotal(response.meta.total)
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
  }, [
    params?.size,
    params?.status,
    params?.gender,
    params?.breed,
    params?.ageMin,
    params?.ageMax,
    params?.q,
    params?.page,
    params?.pageSize,
  ])

  useEffect(() => {
    const controller = new AbortController()
    fetchDogs(controller.signal)
    return () => controller.abort()
  }, [fetchDogs])

  return { dogs, loading, error, total, refetch: () => fetchDogs() }
}
