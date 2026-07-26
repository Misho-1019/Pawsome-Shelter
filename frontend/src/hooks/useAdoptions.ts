import { useState } from 'react'
import { api } from '../services/api'

interface AdoptionData {
  name: string
  email: string
  phone?: string
  message?: string
  dogId?: number
}

export function useAdoptions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submitAdoption = async (data: AdoptionData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      await api.adoptions.create(data)
      setSuccess(true)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit inquiry')
      return false
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setError(null)
    setSuccess(false)
  }

  return { submitAdoption, loading, error, success, reset }
}
