import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  keyExtractor: (row: T) => string | number
  loading?: boolean
  emptyMessage?: string
  className?: string
}

export function DataTable<T>({
  columns,
  rows,
  keyExtractor,
  loading = false,
  emptyMessage = 'No data',
  className = '',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-premium p-8 text-center ${className}`}>
        <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-spin" aria-hidden="true">
          progress_activity
        </span>
        <p className="text-on-surface-variant mt-3">Loading...</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-premium p-8 text-center ${className}`}>
        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block" aria-hidden="true">
          inbox
        </span>
        <p className="text-on-surface-variant">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-2xl shadow-premium overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm text-on-surface ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
