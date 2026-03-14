import { useState } from 'react'
import { Heart, MapPin, Plus, X } from '@phosphor-icons/react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import type { FavoriteDestination } from '../App'
import { toast } from 'sonner'

type FavoritesProps = {
  favorites: FavoriteDestination[]
  onToggleFavorite: (destination: FavoriteDestination) => void
  onUpdateNote: (destinationId: string, notes: string) => void
}

export function Favorites({ favorites, onToggleFavorite, onUpdateNote }: FavoritesProps) {
  const [selectedDestination, setSelectedDestination] = useState<FavoriteDestination | null>(null)
  const [noteText, setNoteText] = useState('')

  const handleOpenNoteDialog = (destination: FavoriteDestination) => {
    setSelectedDestination(destination)
    setNoteText(destination.notes || '')
  }

  const handleSaveNote = () => {
    if (selectedDestination) {
      onUpdateNote(selectedDestination.id, noteText)
      toast.success('Note saved!')
      setSelectedDestination(null)
      setNoteText('')
    }
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <Heart size={64} weight="duotone" className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
        <p className="text-muted-foreground mb-6">
          Start exploring destinations and save your favorites to build your dream travel list
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Your Travel Wishlist</h2>
        <p className="text-muted-foreground text-lg">
          {favorites.length} {favorites.length === 1 ? 'destination' : 'destinations'} saved
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((destination) => (
          <Card key={destination.id} className="destination-card overflow-hidden group hover:shadow-xl">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={destination.image} 
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <Button
                variant="ghost"
                size="icon"
                className="heart-icon favorited absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm"
                onClick={() => {
                  onToggleFavorite(destination)
                  toast.success('Removed from favorites')
                }}
              >
                <Heart size={22} weight="fill" className="text-red-500" />
              </Button>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-semibold text-xl mb-1">{destination.name}</h3>
                <p className="text-white/90 text-sm flex items-center gap-1">
                  <MapPin size={14} weight="fill" />
                  {destination.country}
                </p>
              </div>
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {destination.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Saved {new Date(destination.savedAt).toLocaleDateString()}
                </span>
              </div>
              
              {destination.notes ? (
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {destination.notes}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleOpenNoteDialog(destination)}
                  >
                    Edit note
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleOpenNoteDialog(destination)}
                >
                  <Plus size={16} />
                  Add notes
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedDestination} onOpenChange={(open) => !open && setSelectedDestination(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin size={24} weight="fill" className="text-primary" />
              {selectedDestination?.name}
            </DialogTitle>
            <DialogDescription>
              Add personal notes, travel plans, or anything you want to remember about this destination
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="destination-notes">Your Notes</Label>
              <Textarea
                id="destination-notes"
                placeholder="Why do you want to visit? When are you planning to go? What do you want to see?"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="min-h-[150px] mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {noteText.length} characters
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDestination(null)
                  setNoteText('')
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveNote}>
                Save Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
