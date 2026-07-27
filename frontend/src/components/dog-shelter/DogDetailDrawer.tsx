import { Drawer } from '../ui'
import { useToast } from '../ui/Toast'

interface DogDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  dog: {
    id: number
    name: string
    breed: string
    age: string
    gender: string
    size: string
    image: string
    tags: string[]
    status: string
  } | null
  onAdoptClick: (dog: { id: number; name: string; breed: string; age: string; gender: string; size: string; image: string; tags: string[]; status: string }) => void
}

export function DogDetailDrawer({ isOpen, onClose, dog, onAdoptClick }: DogDetailDrawerProps) {
  const { addToast } = useToast()
  if (!dog) return null

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={dog.name} size="lg">
      <div className="p-6">
        {/* Hero Image */}
        <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
          <img
            src={dog.image}
            alt={`${dog.name} - ${dog.breed}`}
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
            {dog.breed} • {dog.age} • {dog.gender}
          </p>
        </div>

        {/* Tags */}
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
              <p className="font-semibold">{dog.age}</p>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">Status</p>
              <p className="font-semibold">{dog.status}</p>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mb-6">
          <h4 className="font-heading text-lg mb-3">About {dog.name}</h4>
          <p className="text-on-surface-variant leading-relaxed">
            {dog.name} is a wonderful {dog.breed.toLowerCase()} looking for a forever home.
            {dog.tags.includes('Good with kids') && ' Great with children and families.'}
            {dog.tags.includes('House Trained') && ' Already house trained.'}
            {dog.tags.includes('Active') && ' Loves to play and go on adventures.'}
            {dog.tags.includes('Gentle') && ' Has a gentle and calm temperament.'}
            {` Come meet ${dog.name} and see if you're a perfect match!`}
          </p>
        </div>

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
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              addToast('Link copied to clipboard!', 'success')
            }}
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
