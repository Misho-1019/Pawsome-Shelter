import { useState } from 'react'
import { Drawer } from '../ui'

interface VolunteerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VolunteerModal({ isOpen, onClose }: VolunteerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    availability: '',
    experience: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3001/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to submit')

      setSuccess(true)
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', availability: '', experience: '', message: '' })
        onClose()
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '', availability: '', experience: '', message: '' })
    setSuccess(false)
    setError(null)
    onClose()
  }

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="Become a Volunteer" size="md">
      <div className="p-6">
        {success ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-secondary mb-4 block">
              check_circle
            </span>
            <h3 className="font-heading text-xl mb-2">Application Submitted!</h3>
            <p className="text-on-surface-variant">
              Thank you for your interest in volunteering. We'll contact you soon!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-on-surface-variant">
              Fill out this form and we'll get back to you about volunteer opportunities.
            </p>

            {/* Name */}
            <div>
              <label htmlFor="vol-name" className="block text-sm font-semibold mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="vol-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-primary focus:ring-0 outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="vol-email" className="block text-sm font-semibold mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="vol-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-primary focus:ring-0 outline-none transition-colors"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="vol-phone" className="block text-sm font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="vol-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-primary focus:ring-0 outline-none transition-colors"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Availability */}
            <div>
              <label htmlFor="vol-availability" className="block text-sm font-semibold mb-2">
                Availability <span className="text-red-500">*</span>
              </label>
              <select
                id="vol-availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-primary focus:ring-0 outline-none transition-colors bg-white"
              >
                <option value="">Select availability</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="vol-experience" className="block text-sm font-semibold mb-2">
                Experience with animals
              </label>
              <textarea
                id="vol-experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-primary focus:ring-0 outline-none transition-colors resize-none"
                placeholder="Tell us about your experience with animals..."
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="vol-message" className="block text-sm font-semibold mb-2">
                Why do you want to volunteer?
              </label>
              <textarea
                id="vol-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-primary focus:ring-0 outline-none transition-colors resize-none"
                placeholder="Tell us why you'd like to volunteer..."
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.email || !formData.availability}
              className="w-full bg-secondary text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <span className="material-symbols-outlined">volunteer_activism</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </Drawer>
  )
}
