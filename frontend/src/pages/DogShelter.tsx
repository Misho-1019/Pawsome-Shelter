import { Layout } from '../components/layout'
import {
  HeroSection,
  DogGrid,
  HowToAdopt,
  SuccessStories,
  GetInvolved,
  AboutSection,
  ContactSection,
} from '../components/dog-shelter'

export function DogShelter() {
  return (
    <Layout>
      <HeroSection />
      <DogGrid />
      <HowToAdopt />
      <SuccessStories />
      <GetInvolved />
      <AboutSection />
      <ContactSection />
    </Layout>
  )
}
