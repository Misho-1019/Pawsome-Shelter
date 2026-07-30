import type { AdoptionStep } from '../types/dog-shelter'

// Static data used by HowToAdopt (fetched via CMS for AboutSection).

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
