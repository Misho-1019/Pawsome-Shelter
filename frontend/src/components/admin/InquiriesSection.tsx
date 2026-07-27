import { useState, useEffect, useCallback } from 'react'
import { api } from '../../services/api'
import { useToast } from '../ui/Toast'
import { DataTable, type Column } from './DataTable'
import type { Adoption, Volunteer, AdoptionStatus, VolunteerStatus } from '../../types/dog-shelter'

const ADOPTION_STATUSES: AdoptionStatus[] = ['Pending', 'InReview', 'MeetGreet', 'Approved', 'Rejected', 'Completed']
const VOLUNTEER_STATUSES: VolunteerStatus[] = ['Pending', 'Approved', 'Rejected']

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function statusColor(status: string): string {
  if (status === 'Approved' || status === 'Completed') return 'bg-secondary-container text-secondary'
  if (status === 'Rejected') return 'bg-error-container text-error'
  if (status === 'InReview' || status === 'MeetGreet') return 'bg-tertiary-container text-tertiary'
  return 'bg-surface-container-high text-on-surface-variant'
}

export function InquiriesSection() {
  const { addToast } = useToast()
  const [adoptions, setAdoptions] = useState<Adoption[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [a, v] = await Promise.all([
        api.adoptions.list({ pageSize: 100 }),
        api.volunteers.list({ pageSize: 100 }),
      ])
      setAdoptions(a.data)
      setVolunteers(v.data)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load inquiries', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { fetchData() }, [fetchData])

  const handleAdoptionStatusChange = async (id: number, status: AdoptionStatus) => {
    try {
      await api.adoptions.update(id, { status })
      setAdoptions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
      addToast('Adoption status updated', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to update', 'error')
    }
  }

  const handleVolunteerStatusChange = async (id: number, status: VolunteerStatus) => {
    try {
      await api.volunteers.update(id, { status })
      setVolunteers((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)))
      addToast('Volunteer status updated', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to update', 'error')
    }
  }

  const adoptionColumns: Column<Adoption>[] = [
    { key: 'name', header: 'Name', render: (a) => a.name },
    { key: 'email', header: 'Email', render: (a) => <span className="text-on-surface-variant text-xs">{a.email}</span> },
    { key: 'dog', header: 'Dog', render: (a) => a.dog?.name ?? '—' },
    {
      key: 'status',
      header: 'Status',
      render: (a) => (
        <select
          value={a.status}
          onChange={(e) => handleAdoptionStatusChange(a.id, e.target.value as AdoptionStatus)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer ${statusColor(a.status)}`}
        >
          {ADOPTION_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
    { key: 'created', header: 'Submitted', render: (a) => formatDate(a.createdAt) },
  ]

  const volunteerColumns: Column<Volunteer>[] = [
    { key: 'name', header: 'Name', render: (v) => v.name },
    { key: 'email', header: 'Email', render: (v) => <span className="text-on-surface-variant text-xs">{v.email}</span> },
    { key: 'availability', header: 'Availability', render: (v) => v.availability },
    {
      key: 'status',
      header: 'Status',
      render: (v) => (
        <select
          value={v.status}
          onChange={(e) => handleVolunteerStatusChange(v.id, e.target.value as VolunteerStatus)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer ${statusColor(v.status)}`}
        >
          {VOLUNTEER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      ),
    },
    { key: 'created', header: 'Applied', render: (v) => formatDate(v.createdAt) },
  ]

  return (
    <section id="inquiries" className="py-12">
      <h2 className="font-heading text-2xl text-on-surface mb-1">Inquiries</h2>
      <p className="text-sm text-on-surface-variant mb-6">Adoption and volunteer applications</p>

      <div className="space-y-8">
        <div>
          <h3 className="font-heading text-lg text-on-surface mb-3">
            Adoption Inquiries
            <span className="ml-2 text-sm font-normal text-on-surface-variant">({adoptions.length})</span>
          </h3>
          <DataTable
            columns={adoptionColumns}
            rows={adoptions}
            keyExtractor={(a) => a.id}
            loading={loading}
            emptyMessage="No adoption inquiries yet"
          />
        </div>

        <div>
          <h3 className="font-heading text-lg text-on-surface mb-3">
            Volunteer Applications
            <span className="ml-2 text-sm font-normal text-on-surface-variant">({volunteers.length})</span>
          </h3>
          <DataTable
            columns={volunteerColumns}
            rows={volunteers}
            keyExtractor={(v) => v.id}
            loading={loading}
            emptyMessage="No volunteer applications yet"
          />
        </div>
      </div>
    </section>
  )
}
