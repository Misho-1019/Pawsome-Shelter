import { Drawer } from '../ui'
import { useToast } from '../ui/Toast'
import type { Dog } from '../../types/dog-shelter'

interface DogDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  dog: Dog | null
  onAdoptClick: (dog: Dog) => void
}

function formatAge(months: number): string {
  if (months < 12) return `${months} ${months === 1 ? 'Month' : 'Months'}`
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  if (remainingMonths === 0) return `${years} ${years === 1 ? 'Year' : 'Years'}`
  return `${years}Y ${remainingMonths}M`
}

export function DogDetailDrawer({ isOpen, onClose, dog, onAdoptClick }: DogDetailDrawerProps) {
  const { addToast } = useToast()
  if (!dog) return null

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      addToast('Link copied to clipboard!', 'success')
    } catch {
      addToast('Failed to copy link', 'error')
    }
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={dog.name} size="lg">
      <div className="p-6">
        {/* Hero Image */}
        <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
          <img
            src={dog.image}
            alt={`${dog.name} - ${dog.breed}`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              dog.status === 'Available'
                ? 'bg-secondary text-white'
                : 'bg-primary-container text-white'
            }`}>
              {dog.status}
            </span>
          </div>
        </div>

        {/* Dog Info */}
        <div className="mb-6">
          <h3 className="font-heading text-2xl text-on-surface mb-2">{dog.name}</h3>
          <p className="text-on-surface-variant text-lg">
            {dog.breed} • {formatAge(dog.ageMonths)} • {dog.gender}
          </p>
        </div>

        {/* Tags */}
        {dog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {dog.tags.map((tag) => (
              <span
                key={tag}
                className="bg-surface-container-low text-primary px-3 py-1 rounded-full text-sm font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Details */}
        <div className="bg-surface-container-low rounded-2xl p-6 mb-6">
          <h4 className="font-heading text-lg mb-4">Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-on-surface-variant">Size</p>
              <p className="font-semibold">{dog.size}</p>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">Gender</p>
              <p className="font-semibold">{dog.gender}</p>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">Age</p>
              <p className="font-semibold">{formatAge(dog.ageMonths)}</p>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">Status</p>
              <p className="font-semibold">{dog.status}</p>
            </div>
          </div>
        </div>

        {/* About */}
        {dog.description && (
          <div className="mb-6">
            <h4 className="font-heading text-lg mb-3">About {dog.name}</h4>
            <p className="text-on-surface-variant leading-relaxed">{dog.description}</p>
          </div>
        )}

        {/* Compatibility */}
        {(dog.goodWithKids || dog.goodWithDogs || dog.goodWithCats) && (
          <div className="mb-6">
            <h4 className="font-heading text-lg mb-3">Good With</h4>
            <div className="flex flex-wrap gap-2">
              {dog.goodWithKids && <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-sm">Kids</span>}
              {dog.goodWithDogs && <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-sm">Other Dogs</span>}
              {dog.goodWithCats && <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-sm">Cats</span>}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onAdoptClick(dog)}
            className="flex-1 bg-primary-container text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Adopt {dog.name}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button
            onClick={handleShare}
            className="p-4 border-2 border-outline-variant rounded-xl hover:bg-surface-container transition-colors"
            aria-label="Share"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
      </div>
    </Drawer>
  )
}
