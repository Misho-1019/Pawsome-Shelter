import { Badge, Card, HeartButton } from '../ui'
import type { Dog } from '../../types/dog-shelter'

interface DogCardProps {
  dog: Dog
  onClick: () => void
  onAdoptClick: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}

function formatAge(months: number): string {
  if (months < 12) return `${months} ${months === 1 ? 'Month' : 'Months'}`
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  if (remainingMonths === 0) return `${years} ${years === 1 ? 'Year' : 'Years'}`
  return `${years}Y ${remainingMonths}M`
}

export function DogCard({ dog, onClick, onAdoptClick, isFavorite, onToggleFavorite }: DogCardProps) {
  return (
    <Card className="group cursor-pointer" onClick={onClick}>
      <div className="relative h-72 overflow-hidden">
        <img
          src={dog.image}
          alt={`${dog.name} - ${dog.breed}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="status" status={dog.status.toLowerCase() as 'available' | 'pending'}>
            {dog.status}
          </Badge>
        </div>
        <div className="absolute top-4 left-4">
          <HeartButton
            isFavorite={isFavorite}
            onClick={onToggleFavorite}
            size="sm"
          />
        </div>
      </div>
      <div className="p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-heading text-xl text-on-surface mb-1">{dog.name}</h3>
        <p className="text-on-surface-variant text-sm mb-4">
          {dog.breed} • {formatAge(dog.ageMonths)} • {dog.gender}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {dog.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAdoptClick()
          }}
          className="w-full border-2 border-secondary text-secondary font-body text-sm font-semibold py-3 rounded-xl hover:bg-secondary hover:text-white transition-all flex justify-center items-center gap-2"
        >
          Meet Me
          <span className="material-symbols-outlined text-[18px]">favorite</span>
        </button>
      </div>
    </Card>
  )
}
