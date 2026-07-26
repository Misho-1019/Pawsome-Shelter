import type { Dog, Testimonial, AdoptionStep, ShelterStats } from '../types/dog-shelter'

export const dogs: Dog[] = [
  {
    id: 1,
    name: 'Buddy',
    breed: 'Golden Retriever Mix',
    age: '2 Years',
    gender: 'Male',
    size: 'Large',
    image: '/images/dog-buddy.jpg',
    tags: ['Active', 'Good with kids'],
    status: 'Available',
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Labrador Puppy',
    age: '4 Months',
    gender: 'Female',
    size: 'Small',
    image: '/images/dog-luna.jpg',
    tags: ['Playful', 'Training'],
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Max',
    breed: 'German Shepherd',
    age: '8 Years',
    gender: 'Male',
    size: 'Large',
    image: '/images/dog-max.jpg',
    tags: ['Gentle', 'House Trained'],
    status: 'Available',
  },
  {
    id: 4,
    name: 'Daisy',
    breed: 'Beagle',
    age: '3 Years',
    gender: 'Female',
    size: 'Medium',
    image: '/images/dog-daisy.jpg',
    tags: ['Curious', 'Loyal'],
    status: 'Available',
  },
  {
    id: 5,
    name: 'Charlie',
    breed: 'Poodle Mix',
    age: '1 Year',
    gender: 'Male',
    size: 'Medium',
    image: '/images/dog-charlie.jpg',
    tags: ['Hypoallergenic', 'Smart'],
    status: 'Available',
  },
  {
    id: 6,
    name: 'Bella',
    breed: 'Doberman',
    age: '4 Years',
    gender: 'Female',
    size: 'Large',
    image: '/images/dog-bella.jpg',
    tags: ['Protective', 'Calm'],
    status: 'Available',
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'The Millers & Cooper',
    dogName: 'Cooper',
    quote: 'Adopting Cooper was the best decision our family ever made. Pawsome Shelter made the process so professional yet incredibly personal.',
    image: '/images/testimonial-1.jpg',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Jenkins & Pip',
    dogName: 'Pip',
    quote: 'As a first-time dog owner, I was nervous. The team here supported me through every step. My apartment finally feels like a home now.',
    image: '/images/testimonial-2.jpg',
    rating: 5,
  },
  {
    id: 3,
    name: 'David Chen & Gus',
    dogName: 'Gus',
    quote: 'We found our senior dog, Gus, here. Pawsome Shelter really cares about finding the right home for every animal, regardless of age.',
    image: '/images/testimonial-3.jpg',
    rating: 5,
  },
]

export const adoptionSteps: AdoptionStep[] = [
  {
    step: 1,
    title: 'Browse',
    description: 'Explore our online gallery or visit us in person to find the dog that speaks to your heart.',
    icon: 'search',
  },
  {
    step: 2,
    title: 'Apply',
    description: 'Fill out our thoughtful application so we can ensure a perfect match for both you and your new pet.',
    icon: 'assignment',
  },
  {
    step: 3,
    title: 'Welcome Home',
    description: "After a meet-and-greet and home visit, you're ready to start your life-long journey together.",
    icon: 'home',
  },
]

export const shelterStats: ShelterStats[] = [
  { label: 'Rescued', value: '500+' },
  { label: 'Happy Families', value: '350+' },
  { label: 'Years Active', value: '10' },
  { label: 'Volunteers', value: '50+' },
]
