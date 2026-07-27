import { PrismaClient, Gender, Size, DogStatus, EnergyLevel } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Convert human-readable age strings like "2 Years" or "4 Months" to months.
function parseAgeToMonths(age: string): number {
  const trimmed = age.trim()
  const yearMatch = trimmed.match(/(\d+)\s*year/i)
  const monthMatch = trimmed.match(/(\d+)\s*month/i)
  const years = yearMatch ? parseInt(yearMatch[1], 10) : 0
  const months = monthMatch ? parseInt(monthMatch[1], 10) : 0
  return years * 12 + months
}

async function main() {
  console.log('Seeding database...')

  // Require admin credentials from environment
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@pawsomeshelter.com'
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    throw new Error(
      'ADMIN_PASSWORD environment variable must be set. Generate one with: ' +
      "node -e \"console.log(require('crypto').randomBytes(16).toString('base64url'))\""
    )
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  })
  console.log(`Admin user created: ${adminEmail}`)

  // Create dogs
  const dogsData = [
    {
      name: 'Buddy',
      breed: 'Golden Retriever Mix',
      age: '2 Years',
      gender: 'Male' as Gender,
      size: 'Large' as Size,
      image: '/images/dog-buddy.jpg',
      tags: ['Active', 'Good with kids'],
      status: 'Available' as DogStatus,
      description: 'Buddy is a gentle giant who loves long walks and belly rubs. He gets along wonderfully with children and other dogs.',
      isNeutered: true,
      isVaccinated: true,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      energyLevel: 'High' as EnergyLevel,
      arrivalDate: new Date('2025-08-15'),
      adoptionFee: 15000,
    },
    {
      name: 'Luna',
      breed: 'Labrador Puppy',
      age: '4 Months',
      gender: 'Female' as Gender,
      size: 'Small' as Size,
      image: '/images/dog-luna.jpg',
      tags: ['Playful', 'Training'],
      status: 'Pending' as DogStatus,
      description: 'Luna is a curious pup who is currently in basic obedience training. She will be ready for adoption soon.',
      isNeutered: false,
      isVaccinated: true,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true,
      energyLevel: 'High' as EnergyLevel,
      arrivalDate: new Date('2025-11-20'),
      adoptionFee: 20000,
    },
    {
      name: 'Max',
      breed: 'German Shepherd',
      age: '8 Years',
      gender: 'Male' as Gender,
      size: 'Large' as Size,
      image: '/images/dog-max.jpg',
      tags: ['Gentle', 'House Trained'],
      status: 'Available' as DogStatus,
      description: 'Max is a calm, senior gentleman looking for a quiet retirement home. He knows basic commands and loves gentle walks.',
      isNeutered: true,
      isVaccinated: true,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      energyLevel: 'Low' as EnergyLevel,
      arrivalDate: new Date('2024-12-01'),
      adoptionFee: 10000,
    },
    {
      name: 'Daisy',
      breed: 'Beagle',
      age: '3 Years',
      gender: 'Female' as Gender,
      size: 'Medium' as Size,
      image: '/images/dog-daisy.jpg',
      tags: ['Curious', 'Loyal'],
      status: 'Available' as DogStatus,
      description: 'Daisy is a curious explorer with a nose for adventure. She loves sniffing trails and curling up beside you at the end of the day.',
      isNeutered: true,
      isVaccinated: true,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: false,
      energyLevel: 'Medium' as EnergyLevel,
      arrivalDate: new Date('2025-05-10'),
      adoptionFee: 12500,
    },
    {
      name: 'Charlie',
      breed: 'Poodle Mix',
      age: '1 Year',
      gender: 'Male' as Gender,
      size: 'Medium' as Size,
      image: '/images/dog-charlie.jpg',
      tags: ['Hypoallergenic', 'Smart'],
      status: 'Available' as DogStatus,
      description: 'Charlie is a clever, hypoallergenic pup who learns tricks quickly. Perfect for first-time dog owners.',
      isNeutered: true,
      isVaccinated: true,
      goodWithKids: true,
      goodWithDogs: true,
      goodWithCats: true,
      energyLevel: 'High' as EnergyLevel,
      arrivalDate: new Date('2025-10-05'),
      adoptionFee: 17500,
    },
    {
      name: 'Bella',
      breed: 'Doberman',
      age: '4 Years',
      gender: 'Female' as Gender,
      size: 'Large' as Size,
      image: '/images/dog-bella.jpg',
      tags: ['Protective', 'Calm'],
      status: 'Available' as DogStatus,
      description: 'Bella is a loyal guardian who forms deep bonds with her family. Calm indoors, alert outside.',
      isNeutered: true,
      isVaccinated: true,
      goodWithKids: true,
      goodWithDogs: false,
      goodWithCats: false,
      energyLevel: 'Medium' as EnergyLevel,
      arrivalDate: new Date('2025-03-22'),
      adoptionFee: 15000,
    },
  ]

  for (let i = 0; i < dogsData.length; i++) {
    const d = dogsData[i]
    await prisma.dog.upsert({
      where: { id: i + 1 },
      update: {
        name: d.name,
        breed: d.breed,
        ageMonths: parseAgeToMonths(d.age),
        gender: d.gender,
        size: d.size,
        image: d.image,
        tags: d.tags,
        status: d.status,
        description: d.description,
        isNeutered: d.isNeutered,
        isVaccinated: d.isVaccinated,
        goodWithKids: d.goodWithKids,
        goodWithDogs: d.goodWithDogs,
        goodWithCats: d.goodWithCats,
        energyLevel: d.energyLevel,
        arrivalDate: d.arrivalDate,
        adoptionFee: d.adoptionFee,
      },
      create: {
        id: i + 1,
        name: d.name,
        breed: d.breed,
        ageMonths: parseAgeToMonths(d.age),
        gender: d.gender,
        size: d.size,
        image: d.image,
        tags: d.tags,
        status: d.status,
        description: d.description,
        isNeutered: d.isNeutered,
        isVaccinated: d.isVaccinated,
        goodWithKids: d.goodWithKids,
        goodWithDogs: d.goodWithDogs,
        goodWithCats: d.goodWithCats,
        energyLevel: d.energyLevel,
        arrivalDate: d.arrivalDate,
        adoptionFee: d.adoptionFee,
      },
    })
  }
  console.log('Dogs created')

  // Create testimonials
  const testimonials = [
    {
      name: 'The Millers & Cooper',
      dogName: 'Cooper',
      quote: 'Adopting Cooper was the best decision our family ever made. Pawsome Shelter made the process so professional yet incredibly personal.',
      image: '/images/testimonial-1.jpg',
      rating: 5,
    },
    {
      name: 'Sarah Jenkins & Pip',
      dogName: 'Pip',
      quote: 'As a first-time dog owner, I was nervous. The team here supported me through every step. My apartment finally feels like a home now.',
      image: '/images/testimonial-2.jpg',
      rating: 5,
    },
    {
      name: 'David Chen & Gus',
      dogName: 'Gus',
      quote: 'We found our senior dog, Gus, here. Pawsome Shelter really cares about finding the right home for every animal, regardless of age.',
      image: '/images/testimonial-3.jpg',
      rating: 5,
    },
  ]

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { dogName: t.dogName } })
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: t })
    } else {
      await prisma.testimonial.create({ data: t })
    }
  }
  console.log('Testimonials created')

  // Create content sections
  const contentSections = [
    {
      section: 'hero',
      data: {
        headline: 'Find Your New Best Friend',
        subtext: 'Every dog deserves a loving home. Browse our available dogs and change a life today through our empathetic and professional adoption journey.',
        ctaText: 'Adopt Now',
        secondaryText: 'Learn How It Works',
      },
    },
    {
      section: 'about',
      data: {
        title: 'Professional Care, Emotional Connection.',
        description: 'Founded a decade ago, Pawsome Shelter has grown from a small rescue into a trusted community institution. We believe pet adoption is a life-changing journey of hope and companionship for both you and your new best friend.',
        stats: [
          { label: 'Rescued', value: '500+' },
          { label: 'Happy Families', value: '350+' },
          { label: 'Years Active', value: '10' },
          { label: 'Volunteers', value: '50+' },
        ],
      },
    },
    {
      section: 'contact',
      data: {
        address: '123 Rescue Lane, Houndview Heights, Paw City, PC 56789',
        phone: '(555) PAW-SOME • (555) 729-7663',
        hours: 'Mon - Fri: 10 AM - 6 PM, Sat - Sun: 11 AM - 4 PM',
        social: {
          facebook: '#',
          instagram: '#',
          twitter: '#',
          tiktok: '#',
        },
      },
    },
  ]

  for (const content of contentSections) {
    await prisma.content.upsert({
      where: { section: content.section },
      update: { data: content.data },
      create: content,
    })
  }
  console.log('Content sections created')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
