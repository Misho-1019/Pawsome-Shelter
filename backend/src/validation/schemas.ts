import { z } from 'zod'

// Enum values matching the Prisma schema
export const GenderEnum = z.enum(['Male', 'Female'])
export const SizeEnum = z.enum(['Small', 'Medium', 'Large'])
export const DogStatusEnum = z.enum(['Available', 'Pending', 'Adopted'])
export const EnergyLevelEnum = z.enum(['Low', 'Medium', 'High'])
export const AdoptionStatusEnum = z.enum(['Pending', 'InReview', 'MeetGreet', 'Approved', 'Rejected', 'Completed'])
export const VolunteerStatusEnum = z.enum(['Pending', 'Approved', 'Rejected'])

export const CreateDogSchema = z.object({
  name: z.string().min(1).max(100),
  breed: z.string().min(1).max(100),
  ageMonths: z.number().int().min(0).max(360), // 0-30 years
  gender: GenderEnum,
  size: SizeEnum,
  image: z.string().min(1),
  tags: z.array(z.string().max(50)).default([]),
  status: DogStatusEnum.default('Available'),
  description: z.string().max(2000).optional(),
  isNeutered: z.boolean().default(false),
  isVaccinated: z.boolean().default(false),
  goodWithKids: z.boolean().default(false),
  goodWithDogs: z.boolean().default(false),
  goodWithCats: z.boolean().default(false),
  energyLevel: EnergyLevelEnum.optional(),
  arrivalDate: z.coerce.date().optional(),
  adoptionFee: z.number().int().min(0).max(1000000).optional(), // max $10,000
})

export const UpdateDogSchema = CreateDogSchema.partial()

export const CreateAdoptionSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  message: z.string().max(2000).optional(),
  dogId: z.number().int().positive().optional(),
  householdType: z.string().max(50).optional(),
  hasYard: z.boolean().optional(),
  otherPets: z.string().max(500).optional(),
})

export const UpdateAdoptionSchema = z.object({
  status: AdoptionStatusEnum.optional(),
  notes: z.string().max(2000).optional(),
})

export const CreateTestimonialSchema = z.object({
  name: z.string().min(1).max(100),
  dogName: z.string().min(1).max(100),
  quote: z.string().min(1).max(1000),
  image: z.string().min(1),
  rating: z.number().int().min(1).max(5).default(5),
})

export const UpdateTestimonialSchema = CreateTestimonialSchema.partial()

export const CreateVolunteerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  availability: z.string().min(1).max(100),
  experience: z.string().max(1000).optional(),
  message: z.string().max(2000).optional(),
})

export const UpdateVolunteerSchema = z.object({
  status: VolunteerStatusEnum.optional(),
  notes: z.string().max(2000).optional(),
})

export const SubscribeNewsletterSchema = z.object({
  email: z.string().email(),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const CreateCheckoutSchema = z.object({
  amount: z.number().positive().max(999999),
  interval: z.enum(['one_time', 'monthly', 'annual']).default('one_time'),
  donorEmail: z.string().email().optional(),
  donorName: z.string().min(1).max(100).optional(),
  message: z.string().max(500).optional(),
})

// Dog filter query schema (for GET /api/dogs)
export const DogFilterSchema = z.object({
  size: SizeEnum.optional(),
  status: DogStatusEnum.optional(),
  gender: GenderEnum.optional(),
  breed: z.string().max(100).optional(),
  ageMin: z.coerce.number().int().min(0).max(360).optional(),
  ageMax: z.coerce.number().int().min(0).max(360).optional(),
  q: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

// Generic pagination schema (for other list endpoints)
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

// Content section schemas
export const HeroContentSchema = z.object({
  headline: z.string().min(1).max(200),
  subtext: z.string().min(1).max(500),
  ctaText: z.string().min(1).max(50),
  secondaryText: z.string().min(1).max(50),
})

export const AboutContentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  stats: z.array(z.object({
    label: z.string().min(1).max(50),
    value: z.string().min(1).max(20),
  })).min(1).max(10),
})

export const ContactContentSchema = z.object({
  address: z.string().min(1).max(200),
  phone: z.string().min(1).max(50),
  hours: z.string().min(1).max(200),
  social: z.object({
    facebook: z.string().max(200).default('#'),
    instagram: z.string().max(200).default('#'),
    twitter: z.string().max(200).default('#'),
    tiktok: z.string().max(200).default('#'),
  }).optional(),
})

export const ContentSectionSchemas: Record<string, z.ZodSchema> = {
  hero: HeroContentSchema,
  about: AboutContentSchema,
  contact: ContactContentSchema,
}

// Generic validator factory for body validation
export function validateBody(schema: z.ZodSchema) {
  return (req: { body?: unknown }, res: { status: (code: number) => { json: (data: unknown) => unknown } }, next: () => void) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const message = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
      return res.status(400).json({ error: message })
    }
    req.body = result.data
    next()
  }
}

// Generic validator factory for query parameter validation
// Express 5 makes req.query a getter-only property, so we attach the
// validated data as `req.validatedQuery` instead of mutating req.query.
export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: { query?: unknown } & { validatedQuery?: z.infer<T> }, res: { status: (code: number) => { json: (data: unknown) => unknown } }, next: () => void) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      const message = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
      return res.status(400).json({ error: message })
    }
    req.validatedQuery = result.data
    next()
  }
}

// Backwards-compat alias
export const validate = validateBody
