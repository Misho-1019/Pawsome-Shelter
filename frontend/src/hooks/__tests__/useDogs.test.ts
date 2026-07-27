import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useDogs } from '../useDogs'
import { api } from '../../services/api'
import type { Dog, PaginatedResponse } from '../../types/dog-shelter'
import { createElement, type ReactNode } from 'react'

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

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useDogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns loading state initially', () => {
    vi.mocked(api.dogs.list).mockReturnValue(new Promise(() => {})) // never resolves

    const { result } = renderHook(() => useDogs(), { wrapper: createWrapper() })

    expect(result.current.loading).toBe(true)
    expect(result.current.dogs).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('returns dogs after loading', async () => {
    const mockResponse: PaginatedResponse<Dog> = {
      data: [mockDog],
      meta: { total: 1, page: 1, pageSize: 20, totalPages: 1 },
    }
    vi.mocked(api.dogs.list).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useDogs(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.dogs).toEqual([mockDog])
    expect(result.current.total).toBe(1)
    expect(result.current.error).toBeNull()
  })

  it('handles errors', async () => {
    vi.mocked(api.dogs.list).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useDogs(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.dogs).toEqual([])
  })
})
