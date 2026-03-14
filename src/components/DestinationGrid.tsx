import { useState } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { Input } from './ui/input'
import { DestinationCard } from './DestinationCard'
import { destinations } from '@/lib/destinations'
import type { Destination } from '../App'

type DestinationGridProps = {
  onToggleFavorite: (destination: Destination) => void
  isFavorite: (destinationId: string) => boolean
}

export function DestinationGrid({ onToggleFavorite, isFavorite }: DestinationGridProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Discover Your Next Adventure</h2>
        <p className="text-muted-foreground text-lg mb-6">
          Explore breathtaking destinations around the world and start building your travel wishlist
        </p>

        <div className="relative">
          <MagnifyingGlass 
            size={20} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            id="destination-search"
            placeholder="Search destinations, countries, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-12 text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {filteredDestinations.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-2">No destinations found</p>
          <p className="text-muted-foreground">Try adjusting your search</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                isFavorite={isFavorite(destination.id)}
                onToggleFavorite={() => onToggleFavorite(destination)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
