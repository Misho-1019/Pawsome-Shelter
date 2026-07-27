export interface Dog {
  id: number
  name: string
  breed: string
  age: string
  gender: 'Male' | 'Female'
  size: 'Small' | 'Medium' | 'Large'
  image: string
  tags: string[]
  status: 'Available' | 'Pending'
}

export interface Testimonial {
  id: number
  name: string
  dogName: string
  quote: string
  image: string
  rating: number
}

export interface AdoptionStep {
  step: number
  title: string
  description: string
  icon: string
}

export interface ShelterStats {
  label: string
  value: string
  numericValue: number
}
