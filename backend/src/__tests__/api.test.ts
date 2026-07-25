import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import cors from 'cors'

// We'll test the API endpoints by making HTTP requests
const API_BASE = 'http://localhost:3001'

describe('Dogs API', () => {
  it('GET /api/dogs - should return all dogs', async () => {
    const response = await request(`${API_BASE}`)
      .get('/api/dogs')
      .expect(200)

    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThanOrEqual(1)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('name')
    expect(response.body[0]).toHaveProperty('breed')
  })

  it('GET /api/dogs/:id - should return a single dog', async () => {
    const response = await request(`${API_BASE}`)
      .get('/api/dogs/1')
      .expect(200)

    expect(response.body).toHaveProperty('id', 1)
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('breed')
  })

  it('GET /api/dogs/:id - should return 404 for non-existent dog', async () => {
    const response = await request(`${API_BASE}`)
      .get('/api/dogs/999')
      .expect(404)

    expect(response.body).toHaveProperty('error')
  })
})

describe('Testimonials API', () => {
  it('GET /api/testimonials - should return all testimonials', async () => {
    const response = await request(`${API_BASE}`)
      .get('/api/testimonials')
      .expect(200)

    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThanOrEqual(1)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('name')
    expect(response.body[0]).toHaveProperty('quote')
  })
})

describe('Auth API', () => {
  it('POST /api/auth/login - should return token for valid credentials', async () => {
    const response = await request(`${API_BASE}`)
      .post('/api/auth/login')
      .send({ email: 'admin@pawsomeshelter.com', password: 'admin123' })
      .expect(200)

    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('user')
    expect(response.body.user).toHaveProperty('email', 'admin@pawsomeshelter.com')
  })

  it('POST /api/auth/login - should return 401 for invalid credentials', async () => {
    const response = await request(`${API_BASE}`)
      .post('/api/auth/login')
      .send({ email: 'wrong@email.com', password: 'wrongpassword' })
      .expect(401)

    expect(response.body).toHaveProperty('error')
  })
})

describe('Adoptions API', () => {
  it('POST /api/adoptions - should create adoption inquiry', async () => {
    const response = await request(`${API_BASE}`)
      .post('/api/adoptions')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-1234',
        message: 'I want to adopt!',
        dogId: 1
      })
      .expect(201)

    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name', 'Test User')
    expect(response.body).toHaveProperty('status', 'Pending')
  })
})

describe('Health API', () => {
  it('GET /api/health - should return status ok', async () => {
    const response = await request(`${API_BASE}`)
      .get('/api/health')
      .expect(200)

    expect(response.body).toHaveProperty('status', 'ok')
    expect(response.body).toHaveProperty('timestamp')
  })
})
