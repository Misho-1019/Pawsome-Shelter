import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@pawsomeshelter.com' },
    update: {},
    create: {
      email: 'admin@pawsomeshelter.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin'
    }
  })
  console.log('Admin user created')

  // Create dogs
  const dogs = [
    {
      name: 'Buddy',
      breed: 'Golden Retriever Mix',
      age: '2 Years',
      gender: 'Male',
      size: 'Large',
      image: '/images/dog-buddy.jpg',
      tags: ['Active', 'Good with kids'],
      status: 'Available'
    },
    {
      name: 'Luna',
      breed: 'Labrador Puppy',
      age: '4 Months',
      gender: 'Female',
      size: 'Small',
      image: '/images/dog-luna.jpg',
      tags: ['Playful', 'Training'],
      status: 'Pending'
    },
    {
      name: 'Max',
      breed: 'German Shepherd',
      age: '8 Years',
      gender: 'Male',
      size: 'Large',
      image: '/images/dog-max.jpg',
      tags: ['Gentle', 'House Trained'],
      status: 'Available'
    },
    {
      name: 'Daisy',
      breed: 'Beagle',
      age: '3 Years',
      gender: 'Female',
      size: 'Medium',
      image: '/images/dog-daisy.jpg',
      tags: ['Curious', 'Loyal'],
      status: 'Available'
    },
    {
      name: 'Charlie',
      breed: 'Poodle Mix',
      age: '1 Year',
      gender: 'Male',
      size: 'Medium',
      image: '/images/dog-charlie.jpg',
      tags: ['Hypoallergenic', 'Smart'],
      status: 'Available'
    },
    {
      name: 'Bella',
      breed: 'Doberman',
      age: '4 Years',
      gender: 'Female',
      size: 'Large',
      image: '/images/dog-bella.jpg',
      tags: ['Protective', 'Calm'],
      status: 'Available'
    }
  ]

  for (let i = 0; i < dogs.length; i++) {
    await prisma.dog.upsert({
      where: { id: i + 1 },
      update: dogs[i],
      create: { id: i + 1, ...dogs[i] }
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
      rating: 5
    },
    {
      name: 'Sarah Jenkins & Pip',
      dogName: 'Pip',
      quote: 'As a first-time dog owner, I was nervous. The team here supported me through every step. My apartment finally feels like a home now.',
      image: '/images/testimonial-2.jpg',
      rating: 5
    },
    {
      name: 'David Chen & Gus',
      dogName: 'Gus',
      quote: 'We found our senior dog, Gus, here. Pawsome Shelter really cares about finding the right home for every animal, regardless of age.',
      image: '/images/testimonial-3.jpg',
      rating: 5
    }
  ]

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i]
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
        secondaryText: 'Learn How It Works'
      }
    },
    {
      section: 'about',
      data: {
        title: 'Professional Care, Emotional Connection.',
        description: 'Founded a decade ago, Pawsome Shelter has evolved from a small rescue into a high-standard professional institution. We believe that pet adoption is not just a transaction, but a life-changing journey of hope and companionship.',
        stats: [
          { label: 'Rescued', value: '500+' },
          { label: 'Happy Families', value: '350+' },
          { label: 'Years Active', value: '10' },
          { label: 'Volunteers', value: '50+' }
        ]
      }
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
          tiktok: '#'
        }
      }
    }
  ]

  for (const content of contentSections) {
    await prisma.content.upsert({
      where: { section: content.section },
      update: { data: content.data },
      create: content
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
