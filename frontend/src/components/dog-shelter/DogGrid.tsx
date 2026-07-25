import { useState } from 'react'
import { useDogs } from '../../hooks/useDogs'
import { DogCard } from './DogCard'

const filters = ['All', 'Small', 'Medium', 'Large', 'Puppies', 'Seniors']

export function DogGrid() {
  const [activeFilter, setActiveFilter] = useState('All')
  const { dogs, loading, error } = useDogs()

  const filteredDogs = dogs.filter((dog) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Puppies') return dog.age.includes('Month')
    if (activeFilter === 'Seniors') return parseInt(dog.age) >= 7
    return dog.size === activeFilter
  })

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
                {filter}
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filteredDogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
