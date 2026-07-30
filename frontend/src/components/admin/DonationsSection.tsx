import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../services/api'
import { useToast } from '../ui/Toast'
import { DataTable, type Column } from './DataTable'
import type { Donation, DonationStatus } from '../../types/dog-shelter'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function formatAmount(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}

function statusColor(status: DonationStatus): string {
  switch (status) {
    case 'Succeeded':
      return 'bg-secondary-container text-secondary'
    case 'Pending':
      return 'bg-tertiary-container text-tertiary'
    case 'Failed':
      return 'bg-error-container text-error'
    case 'Refunded':
      return 'bg-surface-container-high text-on-surface-variant'
  }
}

export function DonationsSection() {
  const { addToast } = useToast()
  const [statusFilter, setStatusFilter] = useState<DonationStatus | 'all'>('all')

  const query = useQuery({
    queryKey: ['donations', { status: statusFilter }],
    queryFn: () => api.donations.list({
      pageSize: 100,
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    staleTime: 1000 * 60, // 1 minute
  })

  const handleRefresh = useCallback(() => {
    query.refetch()
    addToast('Refreshing donations...', 'info')
  }, [query, addToast])

  const donations = query.data?.data ?? []
  const totalAmount = donations
    .filter((d) => d.status === 'Succeeded')
    .reduce((sum, d) => sum + d.amount, 0)

  const columns: Column<Donation>[] = [
    {
      key: 'createdAt',
      header: 'Date',
      render: (d) => formatDate(d.createdAt),
    },
    {
      key: 'donor',
      header: 'Donor',
      render: (d) => (
        <div>
          <div className="font-medium">{d.donorName || 'Anonymous'}</div>
          {d.donorEmail && (
            <div className="text-xs text-on-surface-variant">{d.donorEmail}</div>
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (d) => (
        <span className="font-semibold">{formatAmount(d.amount, d.currency)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (d) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColor(d.status)}`}
        >
          {d.status}
        </span>
      ),
    },
    {
      key: 'message',
      header: 'Message',
      render: (d) => (
        <span className="text-sm text-on-surface-variant line-clamp-1 max-w-xs">
          {d.message || '—'}
        </span>
      ),
    },
  ]

  return (
    <section id="donations" className="py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-2xl text-on-surface">Donations</h2>
          <p className="text-sm text-on-surface-variant">
            Total raised (succeeded):{' '}
            <span className="font-semibold text-secondary">{formatAmount(totalAmount)}</span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DonationStatus | 'all')}
            className="px-3 py-2 rounded-lg border border-outline-variant text-sm bg-white"
          >
            <option value="all">All statuses</option>
            <option value="Succeeded">Succeeded</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-lg border border-outline-variant text-sm font-semibold hover:bg-surface-container transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={donations}
        keyExtractor={(d) => d.id}
        loading={query.isLoading}
        emptyMessage="No donations yet. They'll appear here once donors complete checkout."
      />
    </section>
  )
}
