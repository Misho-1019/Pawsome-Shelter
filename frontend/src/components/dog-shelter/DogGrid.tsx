import { useState } from 'react'
import { useDogs } from '../../hooks/useDogs'
import { useFavorites } from '../../hooks/useFavorites'
import { DogCard } from './DogCard'
import { DogDetailDrawer } from './DogDetailDrawer'
import { AdoptionModal } from './AdoptionModal'

const filters = ['All', 'Small', 'Medium', 'Large', 'Puppies', 'Seniors', 'Favorites']

export function DogGrid() {
  const [activeFilter, setActiveFilter] = useState('All')
  const { dogs, loading, error } = useDogs()
  const { isFavorite, toggleFavorite, favoritesCount } = useFavorites()
  const [selectedDog, setSelectedDog] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAdoptOpen, setIsAdoptOpen] = useState(false)

  const filteredDogs = dogs.filter((dog) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Favorites') return isFavorite(dog.id)
    if (activeFilter === 'Puppies') return dog.age.includes('Month')
    if (activeFilter === 'Seniors') return parseInt(dog.age) >= 7
    return dog.size === activeFilter
  })

  const handleDogClick = (dog: any) => {
    setSelectedDog(dog)
    setIsDetailOpen(true)
  }

  const handleAdoptClick = (dog: any) => {
    setSelectedDog(dog)
    setIsDetailOpen(false)
    setIsAdoptOpen(true)
  }

  const handleAdoptFromDetail = () => {
    setIsDetailOpen(false)
    setIsAdoptOpen(true)
  }

  if (error) {
    return (
      <section className="py-24 bg-surface-bright" id="dogs">
        <div className="max-w-container mx-auto px-4 md:px-12 text-center">
          <p className="text-red-500">Error loading dogs: {error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-surface-bright" id="dogs">
      <div className="max-w-container mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl text-on-surface mb-2">
              Meet Our Residents
            </h2>
            <p className="font-body text-on-surface-variant">
              Ready for their forever homes. Each one is a unique story waiting to continue with you.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full font-body text-sm font-semibold transition-colors ${
                  activeFilter === filter
                    ? 'bg-primary-container text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {filter === 'Favorites' ? (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    Favorites {favoritesCount > 0 && `(${favoritesCount})`}
                  </span>
                ) : (
                  filter
                )}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-premium animate-pulse">
                <div className="h-72 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDogs.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-7xl text-on-surface-variant mb-4 block">
              {activeFilter === 'Favorites' ? 'favorite_border' : 'search_off'}
            </span>
            <h3 className="font-heading text-xl mb-2">
              {activeFilter === 'Favorites' ? 'No favorites yet' : 'No dogs found'}
            </h3>
            <p className="text-on-surface-variant mb-4">
              {activeFilter === 'Favorites'
                ? 'Click the heart icon on a dog card to save your favorites.'
                : 'Try a different filter or check back later for new arrivals.'}
            </p>
            <button
              onClick={() => setActiveFilter('All')}
              className="text-primary font-semibold hover:underline"
            >
              {activeFilter === 'Favorites' ? 'View all dogs' : 'Clear filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filteredDogs.map((dog) => (
              <DogCard
                key={dog.id}
                dog={dog}
                onClick={() => handleDogClick(dog)}
                onAdoptClick={() => handleAdoptClick(dog)}
                isFavorite={isFavorite(dog.id)}
                onToggleFavorite={() => toggleFavorite(dog.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dog Detail Drawer */}
      <DogDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        dog={selectedDog}
        onAdoptClick={handleAdoptFromDetail}
      />

      {/* Adoption Modal */}
      <AdoptionModal
        isOpen={isAdoptOpen}
        onClose={() => setIsAdoptOpen(false)}
        dog={selectedDog}
      />
    </section>
  )
}
