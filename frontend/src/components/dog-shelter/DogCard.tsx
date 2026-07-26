import { Badge, Card } from '../ui'

interface DogCardProps {
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
  }
  onClick: () => void
  onAdoptClick: () => void
}

export function DogCard({ dog, onClick, onAdoptClick }: DogCardProps) {
  return (
    <Card className="group cursor-pointer" onClick={onClick}>
      <div className="relative h-72 overflow-hidden">
        <img
          src={dog.image}
          alt={`${dog.name} - ${dog.breed}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="status" status={dog.status.toLowerCase() as 'available' | 'pending'}>
            {dog.status}
          </Badge>
        </div>
      </div>
      <div className="p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-heading text-xl text-on-surface mb-1">{dog.name}</h3>
        <p className="text-on-surface-variant text-sm mb-4">
          {dog.breed} • {dog.age} • {dog.gender}
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
