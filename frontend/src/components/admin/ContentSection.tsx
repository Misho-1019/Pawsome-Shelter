import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { useToast } from '../ui/Toast'
import { FormField, TextareaField, FormError, SubmitButton } from '../ui'
import { useHeroContent, useAboutContent, useContactContent } from '../../hooks/useContent'
import type { HeroContent, AboutContent, ContactContent } from '../../hooks/useContent'

type SectionKey = 'hero' | 'about' | 'contact'
const SECTIONS: { key: SectionKey; label: string; description: string }[] = [
  { key: 'hero', label: 'Hero', description: 'The big banner at the top of the home page' },
  { key: 'about', label: 'About', description: 'The about section with stats' },
  { key: 'contact', label: 'Contact', description: 'Address, phone, hours, and social links' },
]

export function ContentSection() {
  const { addToast } = useToast()
  const [activeSection, setActiveSection] = useState<SectionKey>('hero')

  return (
    <section id="content" className="py-12">
      <h2 className="font-heading text-2xl text-on-surface mb-1">Site Content</h2>
      <p className="text-sm text-on-surface-variant mb-6">Edit the content shown on the public website</p>

      <div className="flex gap-2 mb-6 flex-wrap" role="tablist">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={activeSection === s.key}
            onClick={() => setActiveSection(s.key)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-colors ${
              activeSection === s.key
                ? 'bg-primary-container text-white'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-premium p-6 md:p-8">
        {activeSection === 'hero' && <HeroEditor onSaved={() => addToast('Hero content saved', 'success')} />}
        {activeSection === 'about' && <AboutEditor onSaved={() => addToast('About content saved', 'success')} />}
        {activeSection === 'contact' && <ContactEditor onSaved={() => addToast('Contact content saved', 'success')} />}
      </div>
    </section>
  )
}

function HeroEditor({ onSaved }: { onSaved: () => void }) {
  const { data, refetch } = useHeroContent()
  const [form, setForm] = useState<HeroContent>({
    headline: '', subtext: '', ctaText: '', secondaryText: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.content.update('hero', form as unknown as Record<string, unknown>)
      await refetch()
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField
        label="Headline (use \\n for line break)"
        name="headline"
        type="text"
        required
        value={form.headline}
        onChange={(e) => setForm({ ...form, headline: e.target.value })}
        placeholder="Find Your New\nBest Friend"
      />
      <TextareaField
        label="Subtext"
        name="subtext"
        required
        rows={3}
        value={form.subtext}
        onChange={(e) => setForm({ ...form, subtext: e.target.value })}
        placeholder="Every dog deserves a loving home..."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Primary CTA text"
          name="ctaText"
          type="text"
          required
          value={form.ctaText}
          onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
          placeholder="Adopt Now"
        />
        <FormField
          label="Secondary CTA text"
          name="secondaryText"
          type="text"
          required
          value={form.secondaryText}
          onChange={(e) => setForm({ ...form, secondaryText: e.target.value })}
          placeholder="Learn How It Works"
        />
      </div>
      {error && <FormError title="Save failed">{error}</FormError>}
      <SubmitButton loading={loading} loadingText="Saving..." size="lg">Save Hero Content</SubmitButton>
    </form>
  )
}

function AboutEditor({ onSaved }: { onSaved: () => void }) {
  const { data, refetch } = useAboutContent()
  const [form, setForm] = useState<AboutContent>({
    title: '',
    description: '',
    stats: [
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
    ],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (data) {
      // Pad stats to always have 4 entries
      const padded = [...data.stats]
      while (padded.length < 4) padded.push({ label: '', value: '' })
      setForm({ ...data, stats: padded.slice(0, 4) })
    }
  }, [data])

  const updateStat = (i: number, key: 'label' | 'value', value: string) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Filter out empty stats
      const cleaned = { ...form, stats: form.stats.filter((s) => s.label && s.value) }
      await api.content.update('about', cleaned as unknown as Record<string, unknown>)
      await refetch()
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField
        label="Title"
        name="title"
        type="text"
        required
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Professional Care, Emotional Connection."
      />
      <TextareaField
        label="Description"
        name="description"
        required
        rows={5}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Founded a decade ago..."
      />
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">Stats (4 entries)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {form.stats.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={s.label}
                onChange={(e) => updateStat(i, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1 px-3 py-2 rounded-lg border border-outline-variant text-sm"
              />
              <input
                type="text"
                value={s.value}
                onChange={(e) => updateStat(i, 'value', e.target.value)}
                placeholder="Value (e.g. 500+)"
                className="w-24 px-3 py-2 rounded-lg border border-outline-variant text-sm"
              />
            </div>
          ))}
        </div>
      </div>
      {error && <FormError title="Save failed">{error}</FormError>}
      <SubmitButton loading={loading} loadingText="Saving..." size="lg">Save About Content</SubmitButton>
    </form>
  )
}

function ContactEditor({ onSaved }: { onSaved: () => void }) {
  const { data, refetch } = useContactContent()
  const [form, setForm] = useState<ContactContent>({
    address: '',
    phone: '',
    hours: '',
    social: { facebook: '#', instagram: '#', twitter: '#', tiktok: '#' },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (data) {
      const existingSocial = data.social || { facebook: '#', instagram: '#', twitter: '#', tiktok: '#' }
      setForm({
        ...data,
        social: {
          facebook: existingSocial.facebook || '#',
          instagram: existingSocial.instagram || '#',
          twitter: existingSocial.twitter || '#',
          tiktok: existingSocial.tiktok || '#',
        },
      })
    }
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.content.update('contact', form as unknown as Record<string, unknown>)
      await refetch()
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <FormField
        label="Address"
        name="address"
        type="text"
        required
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        placeholder="123 Rescue Lane, City, State 56789"
      />
      <FormField
        label="Phone"
        name="phone"
        type="text"
        required
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="(555) PAW-SOME • (555) 729-7663"
      />
      <FormField
        label="Hours"
        name="hours"
        type="text"
        required
        value={form.hours}
        onChange={(e) => setForm({ ...form, hours: e.target.value })}
        placeholder="Mon - Fri: 10 AM - 6 PM, Sat - Sun: 11 AM - 4 PM"
      />
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">Social Links (use # for none)</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(['facebook', 'instagram', 'twitter', 'tiktok'] as const).map((key) => (
            <input
              key={key}
              type="text"
              value={form.social?.[key] || '#'}
              onChange={(e) => setForm({ ...form, social: { facebook: form.social?.facebook || '#', instagram: form.social?.instagram || '#', twitter: form.social?.twitter || '#', tiktok: form.social?.tiktok || '#', [key]: e.target.value } })}
              placeholder={key}
              className="px-3 py-2 rounded-lg border border-outline-variant text-sm"
            />
          ))}
        </div>
      </div>
      {error && <FormError title="Save failed">{error}</FormError>}
      <SubmitButton loading={loading} loadingText="Saving..." size="lg">Save Contact Content</SubmitButton>
    </form>
  )
}
