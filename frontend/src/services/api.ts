import { apiUrl } from '../config'
import type { Dog, Testimonial } from '../types/dog-shelter'

const API_BASE = apiUrl('/api')

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface Adoption {
  id: number
  name: string
  email: string
  phone?: string
  message?: string
  dogId?: number
  dog?: Dog
  status: string
  createdAt: string
  updatedAt: string
}

export interface Volunteer {
  id: number
  name: string
  email: string
  phone?: string
  availability: string
  experience?: string
  message?: string
  status: string
  createdAt: string
}

export interface Newsletter {
  id: number
  email: string
  createdAt: string
}

export interface User {
  id: number
  email: string
  name: string
  role: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface ContentSection {
  id: number
  section: string
  data: Record<string, unknown>
}

export const api = {
  dogs: {
    list: (params?: { size?: string; status?: string }) => {
      const query = new URLSearchParams(params).toString()
      return request<Dog[]>(`/dogs${query ? `?${query}` : ''}`)
    },
    get: (id: number) => request<Dog>(`/dogs/${id}`),
    create: (data: Partial<Dog>) =>
      request<Dog>('/dogs', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Dog>) =>
      request<Dog>(`/dogs/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ message: string }>(`/dogs/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      }),
  },

  testimonials: {
    list: () => request<Testimonial[]>('/testimonials'),
    create: (data: Partial<Testimonial>) =>
      request<Testimonial>('/testimonials', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Testimonial>) =>
      request<Testimonial>(`/testimonials/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ message: string }>(`/testimonials/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      }),
  },

  adoptions: {
    list: () =>
      request<Adoption[]>('/adoptions', {
        headers: authHeaders(),
      }),
    create: (data: { name: string; email: string; phone?: string; message?: string; dogId?: number }) =>
      request<Adoption>('/adoptions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: { status: string }) =>
      request<Adoption>(`/adoptions/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),
  },

  volunteers: {
    list: () =>
      request<Volunteer[]>('/volunteers', {
        headers: authHeaders(),
      }),
    create: (data: { name: string; email: string; phone?: string; availability: string; experience?: string; message?: string }) =>
      request<Volunteer>('/volunteers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: { status: string }) =>
      request<Volunteer>(`/volunteers/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),
  },

  newsletter: {
    subscribe: (email: string) =>
      request<{ message: string; id: number }>('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    list: () =>
      request<Newsletter[]>('/newsletter', {
        headers: authHeaders(),
      }),
    unsubscribe: (email: string) =>
      request<{ message: string }>(`/newsletter/${encodeURIComponent(email)}`, {
        method: 'DELETE',
      }),
  },

  auth: {
    login: (email: string, password: string) =>
      request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () =>
      request<User>('/auth/me', {
        headers: authHeaders(),
      }),
  },

  content: {
    list: () => request<ContentSection[]>('/content'),
    get: (section: string) => request<ContentSection>(`/content/${section}`),
    update: (section: string, data: Record<string, unknown>) =>
      request<ContentSection>(`/content/${section}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ data }),
      }),
  },

  health: () => request<{ status: string; timestamp: string }>('/health'),
}
