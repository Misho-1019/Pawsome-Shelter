import { describe, it, expect } from 'vitest'

// Integration test: Full flow from frontend to backend
// This test requires both frontend and backend to be running

const API_BASE = 'http://localhost:3001'
const FRONTEND_BASE = 'http://localhost:5173'

describe('Full Stack Integration', () => {
  describe('Backend API', () => {
    it('should be healthy', async () => {
      const response = await fetch(`${API_BASE}/api/health`)
      const data = await response.json()
      expect(data.status).toBe('ok')
    })

    it('should return dogs from database', async () => {
      const response = await fetch(`${API_BASE}/api/dogs`)
      const dogs = await response.json()
      expect(Array.isArray(dogs)).toBe(true)
      expect(dogs.length).toBe(6)
      expect(dogs[0]).toHaveProperty('name')
      expect(dogs[0]).toHaveProperty('breed')
    })

    it('should authenticate admin user', async () => {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@pawsomeshelter.com',
          password: 'admin123',
        }),
      })
      const data = await response.json()
      expect(data).toHaveProperty('token')
      expect(data.user).toHaveProperty('email', 'admin@pawsomeshelter.com')
    })

    it('should create an adoption inquiry', async () => {
      const response = await fetch(`${API_BASE}/api/adoptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Integration Test',
          email: 'integration@test.com',
          message: 'Testing the full flow!',
          dogId: 1,
        }),
      })
      const data = await response.json()
      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('status', 'Pending')
    })

    it('should return testimonials', async () => {
      const response = await fetch(`${API_BASE}/api/testimonials`)
      const testimonials = await response.json()
      expect(Array.isArray(testimonials)).toBe(true)
      expect(testimonials.length).toBe(3)
    })
  })

  describe('Frontend', () => {
    it('should be accessible', async () => {
      const response = await fetch(FRONTEND_BASE)
      expect(response.status).toBe(200)
    })

    it('should contain the app root', async () => {
      const response = await fetch(FRONTEND_BASE)
      const html = await response.text()
      expect(html).toContain('id="root"')
    })
  })

  describe('Data Flow', () => {
    it('frontend should be able to fetch dogs from backend', async () => {
      // This simulates what the frontend useDogs hook does
      const response = await fetch(`${API_BASE}/api/dogs`)
      const dogs = await response.json()

      // Verify the data structure matches what the frontend expects
      dogs.forEach((dog: any) => {
        expect(dog).toHaveProperty('id')
        expect(dog).toHaveProperty('name')
        expect(dog).toHaveProperty('breed')
        expect(dog).toHaveProperty('age')
        expect(dog).toHaveProperty('gender')
        expect(dog).toHaveProperty('size')
        expect(dog).toHaveProperty('image')
        expect(dog).toHaveProperty('tags')
        expect(dog).toHaveProperty('status')
      })
    })

    it('frontend should be able to submit adoption inquiry', async () => {
      // This simulates what the frontend adoption form does
      const response = await fetch(`${API_BASE}/api/adoptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Flow Test User',
          email: 'flow@test.com',
          phone: '555-9999',
          message: 'Testing the complete adoption flow',
          dogId: 2,
        }),
      })

      expect(response.ok).toBe(true)
      const adoption = await response.json()
      expect(adoption).toHaveProperty('id')
      expect(adoption).toHaveProperty('name', 'Flow Test User')
      expect(adoption).toHaveProperty('status', 'Pending')
    })
  })
})
