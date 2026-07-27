import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDogs } from '../useDogs'
import { api } from '../../services/api'
import type { Dog, PaginatedResponse } from '../../types/dog-shelter'

// Mock the API module
vi.mock('../../services/api', () => ({
  api: {
    dogs: {
      list: vi.fn(),
    },
  },
}))

const mockDog: Dog = {
  id: 1,
  name: 'Buddy',
  breed: 'Golden Retriever',
  ageMonths: 24,
  gender: 'Male',
  size: 'Large',
  status: 'Available',
  image: '/images/dog-buddy.jpg',
  tags: [],
  isNeutered: true,
  isVaccinated: true,
  goodWithKids: true,
  goodWithDogs: true,
  goodWithCats: false,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

describe('useDogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return loading state initially', () => {
    vi.mocked(api.dogs.list).mockResolvedValue({
      data: [],
      meta: { total: 0, page: 1, pageSize: 20, totalPages: 0 },
    })

    const { result } = renderHook(() => useDogs())

    expect(result.current.loading).toBe(true)
    expect(result.current.dogs).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should return dogs after loading', async () => {
    const mockResponse: PaginatedResponse<Dog> = {
      data: [mockDog],
      meta: { total: 1, page: 1, pageSize: 20, totalPages: 1 },
    }
    vi.mocked(api.dogs.list).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useDogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.dogs).toEqual([mockDog])
    expect(result.current.total).toBe(1)
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
