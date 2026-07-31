// =============================================================================
// Domain types matching the backend schema (Prisma).
// Keep in sync with backend/prisma/schema.prisma.
// =============================================================================

export type Gender = 'Male' | 'Female'
export type Size = 'Small' | 'Medium' | 'Large'
export type DogStatus = 'Available' | 'Pending' | 'Adopted'
export type EnergyLevel = 'Low' | 'Medium' | 'High'
export type AdoptionStatus = 'Pending' | 'InReview' | 'MeetGreet' | 'Approved' | 'Rejected' | 'Completed'
export type VolunteerStatus = 'Pending' | 'Approved' | 'Rejected'
export type DonationStatus = 'Pending' | 'Succeeded' | 'Failed' | 'Refunded'
export type DonationInterval = 'one_time' | 'monthly' | 'annual'

export interface Dog {
  id: number
  name: string
  breed: string
  ageMonths: number
  gender: Gender
  size: Size
  status: DogStatus
  image: string
  tags: string[]
  description?: string | null
  isNeutered: boolean
  isVaccinated: boolean
  goodWithKids: boolean
  goodWithDogs: boolean
  goodWithCats: boolean
  energyLevel?: EnergyLevel | null
  arrivalDate?: string | null
  adoptionFee?: number | null
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
  updatedAt?: string
}

export interface Adoption {
  id: number
  name: string
  email: string
  phone?: string | null
  message?: string | null
  dogId?: number | null
  dog?: Dog | null
  status: AdoptionStatus
  householdType?: string | null
  hasYard?: boolean | null
  otherPets?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface Volunteer {
  id: number
  name: string
  email: string
  phone?: string | null
  availability: string
  experience?: string | null
  message?: string | null
  status: VolunteerStatus
  notes?: string | null
  createdAt: string
  updatedAt?: string
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

export interface ContentSection<T = Record<string, unknown>> {
  id: number
  section: string
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface Donation {
  id: number
  amount: number             // in cents
  currency: string
  status: DonationStatus
  interval: DonationInterval
  paymentProvider: string
  donorEmail: string | null
  donorName: string | null
  message: string | null
  stripeSessionId: string | null
  stripePaymentId: string | null
  stripeSubscriptionId: string | null
  stripeCustomerId: string | null
  paypalOrderId: string | null
  paypalPaymentId: string | null
  createdAt: string
  updatedAt: string
}

export interface CheckoutSession {
  url: string
  sessionId: string
}

export interface DonationStats {
  totalRaisedCents: number
  totalDonations: number
  uniqueDonors: number
}

// Static content types (used by HardcodedSection fallbacks)
export interface AdoptionStep {
  step: number
  title: string
  description: string
  icon: string
}
