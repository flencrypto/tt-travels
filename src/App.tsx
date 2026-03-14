import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Header } from './components/Header'
import { DestinationGrid } from './components/DestinationGrid'
import { Favorites } from './components/Favorites'
import { Toaster } from './components/ui/sonner'

export type Destination = {
  id: string
  name: string
  country: string
  description: string
  highlights: string[]
  image: string
  category: string
}

export type FavoriteDestination = Destination & {
  savedAt: string
  notes?: string
}

function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'favorites'>('explore')
  const [favorites, setFavorites] = useKV<FavoriteDestination[]>('favorites', [])

  const toggleFavorite = (destination: Destination) => {
    setFavorites((currentFavorites) => {
      if (!currentFavorites) return [{ ...destination, savedAt: new Date().toISOString() }]
      const exists = currentFavorites.find(f => f.id === destination.id)
      if (exists) {
        return currentFavorites.filter(f => f.id !== destination.id)
      } else {
        return [...currentFavorites, { ...destination, savedAt: new Date().toISOString() }]
      }
    })
  }

  const isFavorite = (destinationId: string) => {
    return favorites?.some(f => f.id === destinationId) ?? false
  }

  const updateNote = (destinationId: string, notes: string) => {
    setFavorites((currentFavorites) => {
      if (!currentFavorites) return []
      return currentFavorites.map(f => 
        f.id === destinationId ? { ...f, notes } : f
      )
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} favoriteCount={favorites?.length ?? 0} />
      
      <main className="container mx-auto px-4 md:px-12 py-12">
        {activeTab === 'explore' ? (
          <DestinationGrid 
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        ) : (
          <Favorites 
            favorites={favorites || []}
            onToggleFavorite={toggleFavorite}
            onUpdateNote={updateNote}
          />
        )}
      </main>

      <Toaster />
    </div>
  )
}

export default App
