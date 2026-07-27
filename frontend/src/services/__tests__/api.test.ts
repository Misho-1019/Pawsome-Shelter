import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '../api'

// Mock fetch for testing
const mockFetch = (data: unknown) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  }))
}

describe('API Client', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('dogs', () => {
    it('list() should fetch paginated dogs', async () => {
      const mockResponse = {
        data: [
          { id: 1, name: 'Buddy', breed: 'Golden Retriever' },
          { id: 2, name: 'Luna', breed: 'Labrador' },
        ],
        meta: { total: 2, page: 1, pageSize: 20, totalPages: 1 },
      }
      mockFetch(mockResponse)

      const result = await api.dogs.list()
      expect(result.data).toEqual(mockResponse.data)
      expect(result.meta.total).toBe(2)
    })

    it('get() should fetch a single dog', async () => {
      const mockDog = { id: 1, name: 'Buddy', breed: 'Golden Retriever' }
      mockFetch(mockDog)

      const result = await api.dogs.get(1)
      expect(result).toEqual(mockDog)
    })
  })

  describe('testimonials', () => {
    it('list() should fetch paginated testimonials', async () => {
      const mockResponse = {
        data: [{ id: 1, name: 'The Millers', quote: 'Great experience!' }],
        meta: { total: 1, page: 1, pageSize: 100, totalPages: 1 },
      }
      mockFetch(mockResponse)

      const result = await api.testimonials.list()
      expect(result.data).toEqual(mockResponse.data)
    })
  })

  describe('auth', () => {
    it('login() should post credentials and return token', async () => {
      const mockResponse = { token: 'abc123', user: { id: 1, email: 'test@test.com' } }
      mockFetch(mockResponse)

      const result = await api.auth.login('test@test.com', 'password')
      expect(result).toEqual(mockResponse)
    })
  })
})
