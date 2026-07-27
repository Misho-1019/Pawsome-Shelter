import { useState } from 'react'
import { api } from '../../services/api'
import { Drawer, FormField, TextareaField, SelectField, FormError, SubmitButton, useToast } from '../ui'
import type { Dog, DogStatus, Gender, Size, EnergyLevel } from '../../types/dog-shelter'

interface DogFormProps {
  dog: Dog | null
  onClose: () => void
  onSaved: (dog: Dog) => void
}

const EMPTY_FORM = {
  name: '',
  breed: '',
  ageMonths: 0,
  gender: 'Male' as Gender,
  size: 'Medium' as Size,
  status: 'Available' as DogStatus,
  image: '',
  description: '',
  isNeutered: false,
  isVaccinated: false,
  goodWithKids: false,
  goodWithDogs: false,
  goodWithCats: false,
  energyLevel: '' as EnergyLevel | '',
  arrivalDate: '',
  adoptionFee: 0,
}

export function DogForm({ dog, onClose, onSaved }: DogFormProps) {
  const { addToast } = useToast()
  const [formData, setFormData] = useState(() => ({
    ...EMPTY_FORM,
    ...(dog || {}),
    description: dog?.description ?? '',
    arrivalDate: dog?.arrivalDate ? dog.arrivalDate.split('T')[0] : '',
    energyLevel: dog?.energyLevel ?? '',
    adoptionFee: dog?.adoptionFee ?? 0,
  }))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        ...formData,
        description: formData.description || undefined,
        energyLevel: (formData.energyLevel || undefined) as EnergyLevel | undefined,
        arrivalDate: formData.arrivalDate || undefined,
        adoptionFee: formData.adoptionFee || undefined,
      }
      const saved = dog
        ? await api.dogs.update(dog.id, payload)
        : await api.dogs.create(payload)
      onSaved(saved)
      addToast(dog ? 'Dog updated' : 'Dog created', 'success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer isOpen onClose={onClose} title={dog ? `Edit ${dog.name}` : 'Add Dog'} size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Buddy"
          />
          <FormField
            label="Breed"
            name="breed"
            type="text"
            required
            value={formData.breed}
            onChange={handleChange}
            placeholder="Golden Retriever"
          />
          <FormField
            label="Age (months)"
            name="ageMonths"
            type="number"
            required
            value={formData.ageMonths || ''}
            onChange={handleChange}
            placeholder="24"
          />
          <SelectField
            label="Gender"
            name="gender"
            required
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </SelectField>
          <SelectField
            label="Size"
            name="size"
            required
            value={formData.size}
            onChange={handleChange}
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </SelectField>
          <SelectField
            label="Status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Adopted">Adopted</option>
          </SelectField>
          <FormField
            label="Image URL"
            name="image"
            type="text"
            required
            value={formData.image}
            onChange={handleChange}
            placeholder="/images/dog-buddy.jpg"
            className="md:col-span-2"
          />
          <SelectField
            label="Energy Level"
            name="energyLevel"
            value={formData.energyLevel}
            onChange={handleChange}
          >
            <option value="">—</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </SelectField>
          <FormField
            label="Arrival Date"
            name="arrivalDate"
            type="date"
            value={formData.arrivalDate}
            onChange={handleChange}
          />
          <FormField
            label="Adoption Fee (cents)"
            name="adoptionFee"
            type="number"
            value={formData.adoptionFee || ''}
            onChange={handleChange}
            placeholder="15000"
          />
        </div>

        <TextareaField
          label="Description / Bio"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Tell potential adopters about this dog's personality..."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'isNeutered', label: 'Neutered/Spayed' },
            { name: 'isVaccinated', label: 'Vaccinated' },
            { name: 'goodWithKids', label: 'Good with kids' },
            { name: 'goodWithDogs', label: 'Good with dogs' },
            { name: 'goodWithCats', label: 'Good with cats' },
          ].map((flag) => (
            <label key={flag.name} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={flag.name}
                checked={Boolean(formData[flag.name as keyof typeof formData])}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-on-surface">{flag.label}</span>
            </label>
          ))}
        </div>

        {error && <FormError title="Save failed">{error}</FormError>}

        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm border-2 border-outline-variant hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <SubmitButton loading={loading} loadingText="Saving..." size="lg">
            {dog ? 'Save Changes' : 'Create Dog'}
          </SubmitButton>
        </div>
      </form>
    </Drawer>
  )
}
