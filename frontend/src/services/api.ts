import { apiUrl } from '../config'
import type { Dog, Testimonial, PaginatedResponse, Adoption, Volunteer, Newsletter, User, LoginResponse, ContentSection, Donation, CheckoutSession, DonationStats } from '../types/dog-shelter'

const API_BASE = apiUrl('')

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]+)/)
  return match ? match[1] : ''
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  }

  // Include CSRF token for state-changing methods
  const method = (options?.method || 'GET').toUpperCase()
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const csrfToken = getCsrfToken()
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken
    }
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

const TOKEN_KEY = 'pawsome-admin-token'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface AdoptionCreateInput {
  name: string
  email: string
  phone?: string
  message?: string
  dogId?: number
  householdType?: string
  hasYard?: boolean
  otherPets?: string
}

export interface VolunteerCreateInput {
  name: string
  email: string
  phone?: string
  availability: string
  experience?: string
  message?: string
}

export interface DonationCreateInput {
  amount: number              // in dollars (e.g., 25 = $25.00)
  donorEmail?: string
  donorName?: string
  message?: string
}

export interface DogListParams {
  size?: 'Small' | 'Medium' | 'Large'
  status?: 'Available' | 'Pending' | 'Adopted'
  gender?: 'Male' | 'Female'
  breed?: string
  ageMin?: number
  ageMax?: number
  q?: string
  page?: number
  pageSize?: number
}

export const api = {
  dogs: {
    list: (params?: DogListParams) => {
      const filtered: Record<string, string> = {}
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null && value !== '') {
            filtered[key] = String(value)
          }
        }
      }
      const query = new URLSearchParams(filtered).toString()
      return request<PaginatedResponse<Dog>>(`/dogs${query ? `?${query}` : ''}`)
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
    list: (page = 1, pageSize = 50) =>
      request<PaginatedResponse<Testimonial>>(`/testimonials?page=${page}&pageSize=${pageSize}`),
    get: (id: number) => request<Testimonial>(`/testimonials/${id}`),
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
    list: (params?: { page?: number; pageSize?: number; status?: string }) => {
      const query = params
        ? new URLSearchParams(
            Object.entries(params)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)])
          ).toString()
        : ''
      return request<PaginatedResponse<Adoption>>(
        `/adoptions${query ? `?${query}` : ''}`,
        { headers: authHeaders() }
      )
    },
    create: (data: AdoptionCreateInput) =>
      request<Adoption>('/adoptions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    get: (id: number) =>
      request<Adoption>(`/adoptions/${id}`, {
        headers: authHeaders(),
      }),
    update: (id: number, data: { status?: string; notes?: string }) =>
      request<Adoption>(`/adoptions/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ message: string }>(`/adoptions/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      }),
  },

  volunteers: {
    list: (params?: { page?: number; pageSize?: number; status?: string }) => {
      const query = params
        ? new URLSearchParams(
            Object.entries(params)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)])
          ).toString()
        : ''
      return request<PaginatedResponse<Volunteer>>(
        `/volunteers${query ? `?${query}` : ''}`,
        { headers: authHeaders() }
      )
    },
    create: (data: VolunteerCreateInput) =>
      request<Volunteer>('/volunteers', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    get: (id: number) =>
      request<Volunteer>(`/volunteers/${id}`, {
        headers: authHeaders(),
      }),
    update: (id: number, data: { status?: string; notes?: string }) =>
      request<Volunteer>(`/volunteers/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ message: string }>(`/volunteers/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      }),
  },

  newsletter: {
    subscribe: (email: string) =>
      request<{ message: string; id: number }>('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    list: (params?: { page?: number; pageSize?: number; q?: string }) => {
      const query = params
        ? new URLSearchParams(
            Object.entries(params)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)])
          ).toString()
        : ''
      return request<PaginatedResponse<Newsletter>>(
        `/newsletter${query ? `?${query}` : ''}`,
        { headers: authHeaders() }
      )
    },
    unsubscribe: (email: string) =>
      request<{ message: string }>(`/newsletter/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: authHeaders(),
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
    get: <T = Record<string, unknown>>(section: string) => request<ContentSection<T>>(`/content/${section}`),
    update: (section: string, data: Record<string, unknown>) =>
      request<ContentSection>(`/content/${section}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ data }),
      }),
  },

  health: () => request<{ status: string; timestamp: string; database: string }>('/health'),

  donations: {
    createCheckout: (data: DonationCreateInput) =>
      request<CheckoutSession>('/donations/create-checkout', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    list: (params?: { page?: number; pageSize?: number; status?: string }) => {
      const query = params
        ? new URLSearchParams(
            Object.entries(params)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)])
          ).toString()
        : ''
      return request<PaginatedResponse<Donation>>(
        `/donations${query ? `?${query}` : ''}`,
        { headers: authHeaders() }
      )
    },
    get: (id: number) =>
      request<Donation>(`/donations/${id}`, {
        headers: authHeaders(),
      }),
    stats: () =>
      request<DonationStats>('/donations/stats', {
        headers: authHeaders(),
      }),
  },
}
