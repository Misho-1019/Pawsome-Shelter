import { useState, useEffect, useCallback } from 'react'
import { api } from '../../services/api'
import { useToast } from '../ui/Toast'
import { DataTable, type Column } from './DataTable'
import { ConfirmDialog } from './ConfirmDialog'
import { FormField } from '../ui'
import type { Newsletter } from '../../types/dog-shelter'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function SubscribersSection() {
  const { addToast } = useToast()
  const [subscribers, setSubscribers] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<Newsletter | null>(null)

  const fetchSubscribers = useCallback(async (q?: string) => {
    try {
      setLoading(true)
      const response = await api.newsletter.list({ pageSize: 100, q })
      setSubscribers(response.data)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load subscribers', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    const timer = setTimeout(() => fetchSubscribers(search || undefined), 300)
    return () => clearTimeout(timer)
  }, [search, fetchSubscribers])

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await api.newsletter.unsubscribe(deleting.email)
      setSubscribers((prev) => prev.filter((s) => s.id !== deleting.id))
      addToast('Subscriber removed', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to remove', 'error')
    } finally {
      setDeleting(null)
    }
  }

  const columns: Column<Newsletter>[] = [
    { key: 'email', header: 'Email', render: (s) => <span className="font-medium">{s.email}</span> },
    { key: 'joined', header: 'Joined', render: (s) => formatDate(s.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (s) => (
        <button
          onClick={() => setDeleting(s)}
          className="p-2 rounded-lg hover:bg-error-container text-error transition-colors"
          aria-label={`Remove ${s.email}`}
        >
          <span className="material-symbols-outlined text-lg" aria-hidden="true">delete</span>
        </button>
      ),
    },
  ]

  return (
    <section id="subscribers" className="py-12">
      <h2 className="font-heading text-2xl text-on-surface mb-1">Newsletter Subscribers</h2>
      <p className="text-sm text-on-surface-variant mb-6">
        People who subscribed to receive shelter news and updates
      </p>

      <div className="mb-4 max-w-md">
        <FormField
          label=""
          name="search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="mb-0"
        />
      </div>

      <DataTable
        columns={columns}
        rows={subscribers}
        keyExtractor={(s) => s.id}
        loading={loading}
        emptyMessage="No subscribers yet"
      />

      <ConfirmDialog
        isOpen={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Remove subscriber?"
        message={`Remove ${deleting?.email} from the newsletter list? They will no longer receive updates.`}
        confirmText="Remove"
        cancelText="Cancel"
        destructive
      />
    </section>
  )
}
