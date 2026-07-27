import { useEffect, useState, useCallback } from 'react'
import { api } from '../../services/api'
import { useToast } from '../ui/Toast'
import { AdminHeader } from './AdminHeader'
import { StatsCard } from './StatsCard'
import { DogsSection } from './DogsSection'
import { InquiriesSection } from './InquiriesSection'
import { ContentSection } from './ContentSection'
import { SubscribersSection } from './SubscribersSection'

interface AdminStats {
  dogsAvailable: number
  dogsTotal: number
  pendingInquiries: number
  activeVolunteers: number
  subscribers: number
  totalAdoptions: number
}

const ZERO_STATS: AdminStats = {
  dogsAvailable: 0,
  dogsTotal: 0,
  pendingInquiries: 0,
  activeVolunteers: 0,
  subscribers: 0,
  totalAdoptions: 0,
}

export function AdminPage() {
  const { addToast } = useToast()
  const [stats, setStats] = useState<AdminStats>(ZERO_STATS)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const [dogs, adoptions, volunteers, subscribers] = await Promise.all([
        api.dogs.list({ pageSize: 100 }),
        api.adoptions.list({ pageSize: 100, status: 'Pending' }),
        api.volunteers.list({ pageSize: 100, status: 'Approved' }),
        api.newsletter.list({ pageSize: 1 }), // just need the total
      ])
      setStats({
        dogsTotal: dogs.meta.total,
        dogsAvailable: dogs.data.filter((d) => d.status === 'Available').length,
        pendingInquiries: adoptions.meta.total,
        activeVolunteers: volunteers.meta.total,
        subscribers: subscribers.meta.total,
        totalAdoptions: 0,
      })
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load stats', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { fetchStats() }, [fetchStats])

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader />
      <main className="max-w-container mx-auto px-4 md:px-8 pb-16">
        {/* Stats Overview */}
        <section id="stats" className="py-8">
          <h1 className="font-heading text-3xl text-on-surface mb-1">Overview</h1>
          <p className="text-on-surface-variant mb-6">A quick look at your shelter's activity</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard
              label="Dogs Available"
              value={loading ? '…' : stats.dogsAvailable}
              icon="pets"
              colorClass="text-secondary"
            />
            <StatsCard
              label="Total Dogs"
              value={loading ? '…' : stats.dogsTotal}
              icon="inventory_2"
              colorClass="text-primary"
            />
            <StatsCard
              label="Pending Inquiries"
              value={loading ? '…' : stats.pendingInquiries}
              icon="mail"
              colorClass="text-tertiary"
            />
            <StatsCard
              label="Active Volunteers"
              value={loading ? '…' : stats.activeVolunteers}
              icon="volunteer_activism"
              colorClass="text-primary"
            />
            <StatsCard
              label="Newsletter Subscribers"
              value={loading ? '…' : stats.subscribers}
              icon="mark_email_read"
              colorClass="text-secondary"
            />
          </div>
        </section>

        <div className="border-t border-outline-variant" />

        <DogsSection />
        <div className="border-t border-outline-variant" />
        <InquiriesSection />
        <div className="border-t border-outline-variant" />
        <ContentSection />
        <div className="border-t border-outline-variant" />
        <SubscribersSection />
      </main>
    </div>
  )
}
