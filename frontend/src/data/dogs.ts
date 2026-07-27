import type { AdoptionStep, ShelterStats } from '../types/dog-shelter'

// Static data used by HowToAdopt and AboutSection (not dogs/testimonials —
// those are fetched from the API via hooks).
// Kept as a fallback for the sections that haven't been wired to CMS yet.

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
  { label: 'Rescued', value: '500+', numericValue: 500 },
  { label: 'Happy Families', value: '350+', numericValue: 350 },
  { label: 'Years Active', value: '10', numericValue: 10 },
  { label: 'Volunteers', value: '50+', numericValue: 50 },
]
