import { useState, useEffect, useCallback } from 'react'
import { api } from '../../services/api'
import { useToast } from '../ui/Toast'
import { DataTable, type Column } from './DataTable'
import { DogForm } from './DogForm'
import { ConfirmDialog } from './ConfirmDialog'
import type { Dog } from '../../types/dog-shelter'

function formatAge(months: number): string {
  if (months < 12) return `${months}mo`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem === 0 ? `${years}y` : `${years}y ${rem}mo`
}

function formatPrice(cents: number | null | undefined): string {
  if (!cents) return '—'
  return `$${(cents / 100).toFixed(0)}`
}

export function DogsSection() {
  const { addToast } = useToast()
  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDog, setEditingDog] = useState<Dog | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchDogs = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.dogs.list({ pageSize: 100 })
      setDogs(response.data)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load dogs', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { fetchDogs() }, [fetchDogs])

  const handleEdit = (dog: Dog) => {
    setEditingDog(dog)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditingDog(null)
    setIsFormOpen(true)
  }

  const handleSaved = (saved: Dog) => {
    setDogs((prev) => {
      const exists = prev.some((d) => d.id === saved.id)
      return exists ? prev.map((d) => (d.id === saved.id ? saved : d)) : [saved, ...prev]
    })
    setIsFormOpen(false)
    setEditingDog(null)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await api.dogs.delete(deletingId)
      setDogs((prev) => prev.filter((d) => d.id !== deletingId))
      addToast('Dog deleted', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to delete', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const columns: Column<Dog>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (dog) => (
        <div className="flex items-center gap-3">
          <img src={dog.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
          <div>
            <div className="font-semibold">{dog.name}</div>
            <div className="text-xs text-on-surface-variant">{dog.breed}</div>
          </div>
        </div>
      ),
    },
    { key: 'age', header: 'Age', render: (dog) => formatAge(dog.ageMonths) },
    { key: 'gender', header: 'Gender', render: (dog) => dog.gender },
    { key: 'size', header: 'Size', render: (dog) => dog.size },
    {
      key: 'status',
      header: 'Status',
      render: (dog) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
            dog.status === 'Available'
              ? 'bg-secondary-container text-secondary'
              : dog.status === 'Pending'
              ? 'bg-tertiary-container text-tertiary'
              : 'bg-surface-container-high text-on-surface-variant'
          }`}
        >
          {dog.status}
        </span>
      ),
    },
    { key: 'fee', header: 'Fee', render: (dog) => formatPrice(dog.adoptionFee) },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (dog) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handleEdit(dog)}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors"
            aria-label={`Edit ${dog.name}`}
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">edit</span>
          </button>
          <button
            onClick={() => setDeletingId(dog.id)}
            className="p-2 rounded-lg hover:bg-error-container text-error transition-colors"
            aria-label={`Delete ${dog.name}`}
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">delete</span>
          </button>
        </div>
      ),
    },
  ]

  return (
    <section id="dogs" className="py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-2xl text-on-surface">Dogs</h2>
          <p className="text-sm text-on-surface-variant">Manage your adoptable dogs</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-lg" aria-hidden="true">add</span>
          Add Dog
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={dogs}
        keyExtractor={(dog) => dog.id}
        loading={loading}
        emptyMessage="No dogs yet. Click 'Add Dog' to get started."
      />

      {isFormOpen && (
        <DogForm
          dog={editingDog}
          onClose={() => { setIsFormOpen(false); setEditingDog(null) }}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete dog?"
        message="This will permanently remove the dog from the website. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        destructive
      />
    </section>
  )
}
