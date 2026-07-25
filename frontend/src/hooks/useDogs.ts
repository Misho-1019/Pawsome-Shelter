import { useState, useEffect } from 'react'
import { api, type Dog } from '../services/api'

export function useDogs(params?: { size?: string; status?: string }) {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.dogs.list(params)
      setDogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDogs()
  }, [params?.size, params?.status])

  return { dogs, loading, error, refetch: fetchDogs }
}
