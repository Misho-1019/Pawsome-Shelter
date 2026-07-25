const API_BASE = 'http://localhost:3001/api'

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

// Add auth token if available
function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface Dog {
  id: number
  name: string
  breed: string
  age: string
  gender: string
  size: string
  image: string
  tags: string[]
  status: string
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: number
  name: string
  dogName: string
  quote: string
  image: string
  rating: number
  createdAt: string
}

export interface Adoption {
  id: number
  name: string
  email: string
  phone?: string
  message?: string
  dogId?: number
  status: string
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
    list: () => request<{ id: number; section: string; data: any }[]>('/content'),
    get: (section: string) => request<{ id: number; section: string; data: any }>(`/content/${section}`),
    update: (section: string, data: any) =>
      request<{ id: number; section: string; data: any }>(`/content/${section}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ data }),
      }),
  },

  health: () => request<{ status: string; timestamp: string }>('/health'),
}
