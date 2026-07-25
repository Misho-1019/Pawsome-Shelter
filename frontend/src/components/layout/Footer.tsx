import { useState } from 'react'
import { Button } from '../ui'

const quickLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Available Dogs', href: '#dogs' },
  { label: 'How to Adopt', href: '#process' },
  { label: 'Volunteer', href: '#volunteer' },
  { label: 'Success Stories', href: '#stories' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Adoption FAQ', href: '#' },
  { label: 'Volunteer Login', href: '#' },
]

export function Footer() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <footer className="bg-surface-container-highest rounded-t-[3rem] mt-12">
      <div className="max-w-container mx-auto px-4 md:px-12 pt-24 pb-12">
        {/* Newsletter */}
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
                className="flex-1 bg-white border-none rounded-xl px-6 py-3 focus:ring-2 focus:ring-primary-container outline-none"
              />
              <Button type="submit" variant="primary">
                Subscribe
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
        </div>

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
  )
}
