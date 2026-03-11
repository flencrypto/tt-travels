import { useKV } from '@github/spark/hooks'

export interface FavoriteDestination {
  id: string
  name: string
  country: string
  latitude?: number
  longitude?: number
  savedAt: string
  notes?: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useKV<FavoriteDestination[]>('tt-travels-favorite-destinations', [])

  const addFavorite = (destination: Omit<FavoriteDestination, 'id' | 'savedAt'>) => {
    setFavorites((current) => {
      if (!current) current = []
      const exists = current.some(d => d.name === destination.name)
      if (exists) return current

      return [...current, {
        ...destination,
        id: `fav-${Date.now()}`,
        savedAt: new Date().toISOString(),
      }]
    })
  }

  const removeFavorite = (name: string) => {
    setFavorites((current) => {
      if (!current) return []
      return current.filter(d => d.name !== name)
    })
  }

  const isFavorite = (name: string) => {
    return favorites?.some(d => d.name === name) ?? false
  }

  const toggleFavorite = (destination: Omit<FavoriteDestination, 'id' | 'savedAt'>) => {
    if (isFavorite(destination.name)) {
      removeFavorite(destination.name)
      return false
    } else {
      addFavorite(destination)
      return true
    }
  }

  const updateNotes = (name: string, notes: string) => {
    setFavorites((current) => {
      if (!current) return []
      return current.map(d => d.name === name ? { ...d, notes } : d)
    })
  }

  return {
    favorites: favorites ?? [],
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    updateNotes,
  }
}
