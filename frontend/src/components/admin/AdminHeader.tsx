import { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui'

export function AdminHeader() {
  const { user, logout } = useAuth()

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Mark the active section in the nav based on scroll position
  useEffect(() => {
    const sections = ['stats', 'dogs', 'inquiries', 'content', 'subscribers']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            document.querySelectorAll<HTMLAnchorElement>('[data-admin-nav]').forEach((link) => {
              const isActive = link.getAttribute('href') === `#${id}`
              link.classList.toggle('text-primary', isActive)
              link.classList.toggle('font-semibold', isActive)
            })
          }
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-outline-variant">
      <div className="max-w-container mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <a href="/" className="font-heading text-xl font-extrabold text-primary tracking-tighter">
          Pawsome Admin
        </a>

        <nav className="flex flex-wrap items-center gap-4 md:gap-6 flex-1" aria-label="Admin sections">
          <a
            href="#stats"
            onClick={(e) => { e.preventDefault(); scrollToSection('stats') }}
            data-admin-nav
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Overview
          </a>
          <a
            href="#dogs"
            onClick={(e) => { e.preventDefault(); scrollToSection('dogs') }}
            data-admin-nav
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Dogs
          </a>
          <a
            href="#inquiries"
            onClick={(e) => { e.preventDefault(); scrollToSection('inquiries') }}
            data-admin-nav
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Inquiries
          </a>
          <a
            href="#content"
            onClick={(e) => { e.preventDefault(); scrollToSection('content') }}
            data-admin-nav
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Content
          </a>
          <a
            href="#subscribers"
            onClick={(e) => { e.preventDefault(); scrollToSection('subscribers') }}
            data-admin-nav
            className="text-sm text-on-surface-variant hover:text-primary transition-colors"
          >
            Subscribers
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-on-surface-variant hidden sm:inline">
            {user?.email}
          </span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
