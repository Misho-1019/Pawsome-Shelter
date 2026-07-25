import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDogs } from '../useDogs'
import { api } from '../../services/api'

// Mock the API module
vi.mock('../../services/api', () => ({
  api: {
    dogs: {
      list: vi.fn(),
    },
  },
}))

describe('useDogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return loading state initially', () => {
    vi.mocked(api.dogs.list).mockResolvedValue([])

    const { result } = renderHook(() => useDogs())

    expect(result.current.loading).toBe(true)
    expect(result.current.dogs).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should return dogs after loading', async () => {
    const mockDogs = [
      { id: 1, name: 'Buddy', breed: 'Golden Retriever' },
      { id: 2, name: 'Luna', breed: 'Labrador' },
    ]
    vi.mocked(api.dogs.list).mockResolvedValue(mockDogs as any)

    const { result } = renderHook(() => useDogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.dogs).toEqual(mockDogs)
    expect(result.current.error).toBeNull()
  })

  it('should handle errors', async () => {
    vi.mocked(api.dogs.list).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useDogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.dogs).toEqual([])
  })
})
