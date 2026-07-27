import { useState, useEffect } from 'react'
import { Drawer, PhoneInput, FormField, TextareaField, FormError, SubmitButton } from '../ui'
import { useAdoptions } from '../../hooks/useAdoptions'
import type { Dog } from '../../types/dog-shelter'

interface AdoptionDrawerProps {
  isOpen: boolean
  onClose: () => void
  dog: Pick<Dog, 'id' | 'name' | 'image'> | null
}

const INITIAL_FORM = { name: '', email: '', phone: '', message: '' }

export function AdoptionDrawer({ isOpen, onClose, dog }: AdoptionDrawerProps) {
  const { submitAdoption, loading, error, success, reset } = useAdoptions()
  const [formData, setFormData] = useState(INITIAL_FORM)

  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM)
      reset()
    }
  }, [isOpen, reset])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dog) return

    const submitted = await submitAdoption({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      message: formData.message || undefined,
      dogId: dog.id,
    })

    if (submitted) {
      setTimeout(() => {
        setFormData(INITIAL_FORM)
        onClose()
      }, 2000)
    }
  }

  if (!dog) return null

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Adopt ${dog.name}`} size="md">
      <div className="p-6">
        {/* Dog Preview */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-surface-container-low rounded-xl">
          <img
            src={dog.image}
            alt={dog.name}
            className="w-16 h-16 rounded-xl object-cover"
            loading="lazy"
          />
          <div>
            <h4 className="font-heading font-semibold">{dog.name}</h4>
            <p className="text-sm text-on-surface-variant">Adoption Inquiry</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-12 animate-scale-in" role="status" aria-live="polite">
            <span className="material-symbols-outlined text-6xl text-secondary mb-4 block" aria-hidden="true">
              check_circle
            </span>
            <h3 className="font-heading text-xl mb-2">Inquiry Submitted!</h3>
            <p className="text-on-surface-variant">
              Thank you for your interest in adopting {dog.name}. We'll contact you soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField
              label="Your Name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
            />

            <FormField
              label="Email Address"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              autoComplete="email"
            />

            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">
                Phone Number
              </label>
              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
              />
            </div>

            <TextareaField
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us why you'd like to adopt this dog..."
            />

            {error && <FormError title="Failed to submit inquiry">{error}</FormError>}

            <SubmitButton
              loading={loading}
              loadingText="Submitting..."
              disabled={!formData.name || !formData.email}
              className="w-full"
              size="lg"
            >
              <span className="flex items-center justify-center gap-2">
                Submit Inquiry
                <span className="material-symbols-outlined" aria-hidden="true">send</span>
              </span>
            </SubmitButton>

            <p className="text-center text-sm text-on-surface-variant">
              By submitting, you agree to our adoption process. We'll review your inquiry and contact you within 24-48 hours.
            </p>
          </form>
        )}
      </div>
    </Drawer>
  )
}
