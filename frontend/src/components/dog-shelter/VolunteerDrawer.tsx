import { useState, useEffect } from 'react'
import {
  Drawer,
  PhoneInput,
  FormField,
  TextareaField,
  SelectField,
  FormError,
  SubmitButton,
} from '../ui'
import { api } from '../../services/api'

interface VolunteerDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  availability: '',
  experience: '',
  message: '',
}

export function VolunteerDrawer({ isOpen, onClose }: VolunteerDrawerProps) {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM)
      setError(null)
      setSuccess(false)
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await api.volunteers.create(formData)
      setSuccess(true)
      setTimeout(() => {
        setFormData(INITIAL_FORM)
        onClose()
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Become a Volunteer" size="md">
      <div className="p-6">
        {success ? (
          <div className="text-center py-12 animate-scale-in" role="status" aria-live="polite">
            <span className="material-symbols-outlined text-6xl text-secondary mb-4 block" aria-hidden="true">
              check_circle
            </span>
            <h3 className="font-heading text-xl mb-2">Application Submitted!</h3>
            <p className="text-on-surface-variant">
              Thank you for your interest in volunteering. We'll contact you soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <p className="text-on-surface-variant">
              Fill out this form and we'll get back to you about volunteer opportunities.
            </p>

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

            <SelectField
              label="Availability"
              name="availability"
              required
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="">Select availability</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="evenings">Evenings</option>
              <option value="flexible">Flexible</option>
            </SelectField>

            <TextareaField
              label="Experience with animals"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about your experience with animals..."
            />

            <TextareaField
              label="Why do you want to volunteer?"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us why you'd like to volunteer..."
            />

            {error && <FormError title="Failed to submit application">{error}</FormError>}

            <SubmitButton
              variant="secondary"
              loading={loading}
              loadingText="Submitting..."
              disabled={!formData.name || !formData.email || !formData.availability}
              className="w-full"
              size="lg"
            >
              <span className="flex items-center justify-center gap-2">
                Submit Application
                <span className="material-symbols-outlined" aria-hidden="true">volunteer_activism</span>
              </span>
            </SubmitButton>
          </form>
        )}
      </div>
    </Drawer>
  )
}
