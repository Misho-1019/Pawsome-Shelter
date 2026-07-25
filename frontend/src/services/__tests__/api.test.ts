import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '../api'

// Mock fetch for testing
const mockFetch = (data: any) => {
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
    it('list() should fetch all dogs', async () => {
      const mockDogs = [
        { id: 1, name: 'Buddy', breed: 'Golden Retriever' },
        { id: 2, name: 'Luna', breed: 'Labrador' },
      ]
      mockFetch(mockDogs)

      const result = await api.dogs.list()
      expect(result).toEqual(mockDogs)
    })

    it('get() should fetch a single dog', async () => {
      const mockDog = { id: 1, name: 'Buddy', breed: 'Golden Retriever' }
      mockFetch(mockDog)

      const result = await api.dogs.get(1)
      expect(result).toEqual(mockDog)
    })
  })

  describe('testimonials', () => {
    it('list() should fetch all testimonials', async () => {
      const mockTestimonials = [
        { id: 1, name: 'The Millers', quote: 'Great experience!' },
      ]
      mockFetch(mockTestimonials)

      const result = await api.testimonials.list()
      expect(result).toEqual(mockTestimonials)
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
