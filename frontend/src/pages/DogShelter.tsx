import { lazy, Suspense } from 'react'
import { Layout } from '../components/layout'
import { Skeleton } from '../components/ui/Skeleton'
import { HeroSection } from '../components/dog-shelter/HeroSection'
import { DogGrid } from '../components/dog-shelter/DogGrid'

// Code-split the below-the-fold sections to reduce initial bundle size
const HowToAdopt = lazy(() => import('../components/dog-shelter/HowToAdopt').then((m) => ({ default: m.HowToAdopt })))
const SuccessStories = lazy(() => import('../components/dog-shelter/SuccessStories').then((m) => ({ default: m.SuccessStories })))
const GetInvolved = lazy(() => import('../components/dog-shelter/GetInvolved').then((m) => ({ default: m.GetInvolved })))
const AboutSection = lazy(() => import('../components/dog-shelter/AboutSection').then((m) => ({ default: m.AboutSection })))
const ContactSection = lazy(() => import('../components/dog-shelter/ContactSection').then((m) => ({ default: m.ContactSection })))

function SectionFallback() {
  return (
    <section className="py-24">
      <div className="max-w-container mx-auto px-4 md:px-12 space-y-4">
        <Skeleton className="h-10" width="1/3" />
        <Skeleton className="h-6" width="2/3" />
        <Skeleton className="h-40" width="full" />
      </div>
    </section>
  )
}

export function DogShelter() {
  return (
    <Layout>
      <HeroSection />
      <DogGrid />
      <Suspense fallback={<SectionFallback />}><HowToAdopt /></Suspense>
      <Suspense fallback={<SectionFallback />}><SuccessStories /></Suspense>
      <Suspense fallback={<SectionFallback />}><GetInvolved /></Suspense>
      <Suspense fallback={<SectionFallback />}><AboutSection /></Suspense>
      <Suspense fallback={<SectionFallback />}><ContactSection /></Suspense>
    </Layout>
  )
}
