import { z } from 'zod'

export const CreateDogSchema = z.object({
  name: z.string().min(1).max(100),
  breed: z.string().min(1).max(100),
  age: z.string().min(1).max(50),
  gender: z.enum(['Male', 'Female']),
  size: z.enum(['Small', 'Medium', 'Large']),
  image: z.string().min(1),
  tags: z.array(z.string()).default([]),
  status: z.enum(['Available', 'Pending', 'Adopted']).default('Available'),
})

export const UpdateDogSchema = CreateDogSchema.partial()

export const CreateAdoptionSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  message: z.string().max(2000).optional(),
  dogId: z.number().int().positive().optional(),
})

export const UpdateAdoptionSchema = z.object({
  status: z.enum(['Pending', 'Approved', 'Rejected']),
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
  status: z.enum(['Pending', 'Approved', 'Rejected']),
})

export const SubscribeNewsletterSchema = z.object({
  email: z.string().email(),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export function validate(schema: z.ZodSchema) {
  return (req: { body?: unknown; query?: unknown }, res: { status: (code: number) => { json: (data: unknown) => unknown } }, next: () => void) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ')
      return res.status(400).json({ error: message })
    }
    req.body = result.data
    next()
  }
}
