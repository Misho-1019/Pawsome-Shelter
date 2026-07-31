export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'AnimalShelter',
    name: 'Pawsome Shelter',
    description: 'Find your new best friend. Browse adoptable dogs, submit adoption inquiries, and support our mission.',
    url: 'https://pawsomeshelter.com',
    logo: 'https://pawsomeshelter.com/favicon.svg',
    image: 'https://pawsomeshelter.com/images/hero-bg.jpg',
    sameAs: [
      'https://facebook.com/pawsomeshelter',
      'https://instagram.com/pawsomeshelter',
      'https://twitter.com/pawsomeshelter',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '(555) 729-7663',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Rescue Lane',
      addressLocality: 'Houndview Heights',
      addressRegion: 'PC',
      postalCode: '56789',
      addressCountry: 'US',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '11:00',
        closes: '16:00',
      },
    ],
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: 'Houndview Heights',
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I adopt a dog from Pawsome Shelter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Browse our available dogs, submit an adoption inquiry, and our team will review your application within 24-48 hours. Then schedule a meet-and-greet with your potential new family member.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does it cost to adopt a dog?',
        adoptedAnswer: {
          '@type': 'Answer',
          text: 'Adoption fees vary by dog and cover vaccinations, spaying/neutering, and microchipping. Check individual dog listings for specific fees.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I volunteer at Pawsome Shelter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We welcome volunteers. Apply through our website and our volunteer coordinator will contact you within 3-5 business days.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I donate to Pawsome Shelter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can make one-time or recurring donations through our website. We accept credit cards via Stripe and PayPal. All donations are tax-deductible.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
