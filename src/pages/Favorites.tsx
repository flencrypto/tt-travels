import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, MapPin, Trash, NotePencil, MapTrifold, Calendar, ArrowRight } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useFavorites } from '@/hooks/use-favorites'
import { toast } from 'sonner'

export function Favorites() {
  const { favorites, removeFavorite, updateNotes } = useFavorites()
  const navigate = useNavigate()
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [notesText, setNotesText] = useState('')

  const handleRemoveFavorite = (name: string) => {
    removeFavorite(name)
    toast.success('Removed from favorites')
  }

  const handleEditNotes = (destination: typeof favorites[0]) => {
    setEditingNotes(destination.id)
    setNotesText(destination.notes || '')
  }

  const handleSaveNotes = (name: string) => {
    updateNotes(name, notesText)
    setEditingNotes(null)
    toast.success('Notes updated')
  }

  const sortedFavorites = [...favorites].sort((a, b) => 
    new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  )

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Heart size={40} weight="fill" className="text-red-500" />
              Favorite Destinations
            </h1>
            <p className="text-muted-foreground text-lg">
              Your saved destinations for quick access and planning
            </p>
          </div>
          <Link to="/explore">
            <Button variant="outline" className="gap-2">
              <MapTrifold size={20} />
              Explore More
            </Button>
          </Link>
        </div>

        {favorites.length === 0 ? (
          <Card className="glass-surface">
            <CardContent className="p-16 text-center space-y-4">
              <Heart size={64} className="mx-auto text-muted-foreground" weight="light" />
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">No favorites yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start exploring destinations and save your favorites for quick access to travel information
                </p>
              </div>
              <div className="pt-4">
                <Link to="/explore">
                  <Button size="lg" className="gap-2">
                    <MapTrifold size={20} />
                    Explore Destinations
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {favorites.length} {favorites.length === 1 ? 'destination' : 'destinations'} saved
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedFavorites.map((destination) => (
                <Card key={destination.id} className="glass-surface group hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <MapPin size={20} className="text-primary" weight="fill" />
                          {destination.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {destination.country}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFavorite(destination.name)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Heart size={20} weight="fill" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {destination.latitude && destination.longitude && (
                      <div className="text-xs text-muted-foreground font-mono bg-muted/30 rounded p-2">
                        {destination.latitude.toFixed(4)}°, {destination.longitude.toFixed(4)}°
                      </div>
                    )}

                    {destination.notes && (
                      <div className="text-sm text-muted-foreground bg-accent/10 rounded-lg p-3 border border-accent/20">
                        {destination.notes}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditNotes(destination)}
                            className="gap-2 flex-1"
                          >
                            <NotePencil size={16} />
                            {destination.notes ? 'Edit Notes' : 'Add Notes'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Notes for {destination.name}</DialogTitle>
                            <DialogDescription>
                              Add personal notes about this destination
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="notes">Your Notes</Label>
                              <Textarea
                                id="notes"
                                placeholder="Add travel tips, reminders, or anything you want to remember..."
                                value={editingNotes === destination.id ? notesText : destination.notes || ''}
                                onChange={(e) => setNotesText(e.target.value)}
                                rows={6}
                              />
                            </div>
                            <Button 
                              onClick={() => handleSaveNotes(destination.name)}
                              className="w-full"
                            >
                              Save Notes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Link to={`/explore/${encodeURIComponent(destination.name)}`} className="flex-1">
                        <Button size="sm" className="gap-2 w-full">
                          View Guide
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>

                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      Saved {new Date(destination.savedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
