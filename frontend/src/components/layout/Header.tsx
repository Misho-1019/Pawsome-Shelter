import { useState, useEffect, useRef } from 'react'
import { Button } from '../ui'

const navLinks = [
  { label: 'Home', href: '#dogs' },
  { label: 'Adopt', href: '#dogs' },
  { label: 'Process', href: '#process' },
  { label: 'Stories', href: '#stories' },
  { label: 'Volunteer', href: '#volunteer' },
  { label: 'Contact', href: '#contact' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileNavRef = useRef<HTMLDivElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileMenuOpen(false)
  }

  const handleDonate = () => {
    setMobileMenuOpen(false)
    scrollToSection('#volunteer')
  }

  // Focus trap for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        toggleButtonRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !mobileNavRef.current) return

      const focusable = mobileNavRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Focus first link when menu opens
    const firstLink = mobileNavRef.current?.querySelector<HTMLElement>('a[href]')
    firstLink?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-md shadow-sm">
      <div className="max-w-container mx-auto flex justify-between items-center px-4 md:px-12 py-4">
        <a href="#" className="font-heading text-xl font-extrabold text-primary tracking-tighter">
          Pawsome Shelter
        </a>

        {/* Desktop Nav (visible at md+ to close the 768-1023px gap) */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(link.href)
              }}
              className="font-body text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.assign('/admin/login')}
            className="font-body"
          >
            Login
          </Button>
          <Button variant="primary" size="md" onClick={handleDonate}>
            Donate Now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          ref={toggleButtonRef}
          className="md:hidden text-primary p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <span className="material-symbols-outlined text-2xl" aria-hidden="true">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileNavRef}
        id="mobile-nav"
        role="navigation"
        aria-label="Mobile navigation"
        className={`md:hidden bg-surface border-t border-outline-variant px-4 py-6 flex flex-col gap-4 ${mobileMenuOpen ? '' : 'hidden'}`}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => {
              e.preventDefault()
              scrollToSection(link.href)
            }}
            className="font-heading text-lg text-on-surface-variant py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded"
          >
            {link.label}
          </a>
        ))}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            setMobileMenuOpen(false)
            window.location.assign('/admin/login')
          }}
          className="w-full mt-2"
        >
          Login
        </Button>
        <Button variant="primary" size="lg" onClick={handleDonate} className="w-full mt-2">
          Donate Now
        </Button>
      </div>
    </header>
  )
}
