import { useState } from 'react'
import { dogs } from '../../data/dogs'
import { DogCard } from './DogCard'

const filters = ['All', 'Small', 'Medium', 'Large', 'Puppies', 'Seniors']

export function DogGrid() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredDogs = dogs.filter((dog) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Puppies') return dog.age.includes('Month')
    if (activeFilter === 'Seniors') return parseInt(dog.age) >= 7
    return dog.size === activeFilter
  })

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredDogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      </div>
    </section>
  )
}
