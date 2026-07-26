import { useState } from 'react'
import { Drawer, PhoneInput } from '../ui'
import { useAdoptions } from '../../hooks/useAdoptions'

interface AdoptionModalProps {
  isOpen: boolean
  onClose: () => void
  dog: {
    id: number
    name: string
    image: string
  } | null
}

export function AdoptionModal({ isOpen, onClose, dog }: AdoptionModalProps) {
  const { submitAdoption, loading, error, success, reset } = useAdoptions()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value })
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
        setFormData({ name: '', email: '', phone: '', message: '' })
        onClose()
      }, 2000)
    }
  }

  const handleClose = () => {
    reset()
    setFormData({ name: '', email: '', phone: '', message: '' })
    onClose()
  }

  if (!dog) return null

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title={`Adopt ${dog.name}`} size="md">
      <div className="p-6">
        {/* Dog Preview */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-surface-container-low rounded-xl">
          <img
            src={dog.image}
            alt={dog.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          <div>
            <h4 className="font-heading font-semibold">{dog.name}</h4>
            <p className="text-sm text-on-surface-variant">Adoption Inquiry</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-12 animate-scale-in">
            <span className="material-symbols-outlined text-6xl text-secondary mb-4 block">
              check_circle
            </span>
            <h3 className="font-heading text-xl mb-2">Inquiry Submitted!</h3>
            <p className="text-on-surface-variant">
              Thank you for your interest in adopting {dog.name}. We'll contact you soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-primary focus:ring-0 outline-none transition-colors duration-200"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-primary focus:ring-0 outline-none transition-colors duration-200"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone with Country Code */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                Phone Number
              </label>
              <PhoneInput
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-primary focus:ring-0 outline-none transition-colors duration-200 resize-none"
                placeholder="Tell us why you'd like to adopt this dog..."
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 animate-shake">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.email}
              className="w-full bg-primary-container text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Inquiry
                  <span className="material-symbols-outlined">send</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-on-surface-variant">
              By submitting, you agree to our adoption process. We'll review your inquiry and contact you within 24-48 hours.
            </p>
          </form>
        )}
      </div>
    </Drawer>
  )
}
