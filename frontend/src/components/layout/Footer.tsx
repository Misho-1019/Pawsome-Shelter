import { useState } from 'react'
import { Button } from '../ui'
import { FadeIn } from '../ui/animations'
import { useToast } from '../ui/Toast'
import { PrivacyPolicyModal } from '../dog-shelter/PrivacyPolicyModal'
import { TermsOfServiceModal } from '../dog-shelter/TermsOfServiceModal'
import { FAQModal } from '../dog-shelter/FAQModal'
import { apiUrl } from '../../config'

const quickLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Available Dogs', href: '#dogs' },
  { label: 'How to Adopt', href: '#process' },
  { label: 'Volunteer', href: '#volunteer' },
  { label: 'Success Stories', href: '#stories' },
]

const legalLinks = [
  { label: 'Privacy Policy', action: 'privacy' },
  { label: 'Terms of Service', action: 'terms' },
  { label: 'Adoption FAQ', action: 'faq' },
  { label: 'Volunteer Login', href: '#' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isFaqOpen, setIsFaqOpen] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email', 'error')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(apiUrl('/api/newsletter'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to subscribe')
      }

      addToast('Successfully subscribed to newsletter!', 'success')
      setEmail('')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to subscribe', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLegalClick = (action?: string) => {
    if (action === 'privacy') setIsPrivacyOpen(true)
    else if (action === 'terms') setIsTermsOpen(true)
    else if (action === 'faq') setIsFaqOpen(true)
  }

  return (
    <>
      <footer className="bg-surface-container-highest rounded-t-[3rem] mt-12">
        <div className="max-w-container mx-auto px-4 md:px-12 pt-24 pb-12">
          {/* Newsletter */}
          <FadeIn direction="up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
              <div className="col-span-1 lg:col-span-2">
                <h2 className="font-heading text-xl font-extrabold text-primary mb-6">
                  Pawsome Shelter
                </h2>
                <p className="font-body text-on-surface-variant max-w-sm mb-8 leading-relaxed">
                  Stay updated on our latest rescues and success stories. Join our community and help us make a difference.
                </p>
                <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    disabled={loading}
                    className="flex-1 bg-white border-none rounded-xl px-6 py-3 focus:ring-2 focus:ring-primary-container outline-none disabled:opacity-50"
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? '...' : 'Subscribe'}
              </Button>
            </form>
          </div>

              <div>
                <h4 className="font-body text-sm font-semibold uppercase tracking-widest text-on-surface mb-6">
                  Quick Links
                </h4>
                <ul className="space-y-4 font-body text-xs text-on-surface-variant">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="hover:text-primary transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-body text-sm font-semibold uppercase tracking-widest text-on-surface mb-6">
                  Legal
                </h4>
                <ul className="space-y-4 font-body text-xs text-on-surface-variant">
                  {legalLinks.map((link) => (
                    <li key={link.label}>
                      {link.action ? (
                        <button
                          onClick={() => handleLegalClick(link.action)}
                          className="hover:text-primary transition-colors text-left"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <a
                          href={link.href}
                          className="hover:text-primary transition-colors"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>

          {/* Bottom */}
          <div className="pt-12 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-body text-xs text-on-surface-variant">
              © 2026 Pawsome Shelter. Made with ❤️ for dogs everywhere.
            </p>
            <div className="flex items-center gap-2 text-primary font-heading text-sm">
              <span className="material-symbols-outlined text-[18px]">pets</span>
              Bark Responsibly
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsOfServiceModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <FAQModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
    </>
  )
}
