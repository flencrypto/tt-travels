import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, NotePencil, MapTrifold, ArrowRight, CalendarDots, Globe } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useFavorites } from '@/hooks/use-favorites'
import { toast } from 'sonner'

export function Favorites() {
  const { favorites, removeFavorite, updateNotes } = useFavorites()
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
    <div className="min-h-screen space-y-8">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <section className="hero-section -mx-4 -mt-6 px-6 pt-12 pb-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="eyebrow mb-3">Your Collection</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center gap-3">
                <Heart size={36} weight="fill" className="text-primary" />
                <span>Favorite <span className="gradient-text">Places</span></span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Your personally curated collection of dream destinations.
              </p>
            </div>
            <Link to="/explore" className="self-end">
              <Button variant="outline" className="gap-2">
                <Globe size={18} weight="fill" />
                Discover More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl">
        {favorites.length === 0 ? (
          <Card className="glass-surface border-border/50">
            <CardContent className="p-16 text-center space-y-5">
              <div className="feature-icon w-20 h-20 rounded-3xl flex items-center justify-center mx-auto">
                <Heart size={40} className="text-primary" weight="duotone" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">No favorites yet</h3>
                <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                  Start exploring destinations and save the ones that inspire you. Build your dream travel list.
                </p>
              </div>
              <Link to="/explore">
                <Button size="lg" className="gap-2 shadow-sm shadow-primary/20 mt-2">
                  <MapTrifold size={20} weight="fill" />
                  Explore Destinations
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                <span className="font-semibold text-foreground">{favorites.length}</span>{' '}
                {favorites.length === 1 ? 'destination' : 'destinations'} saved
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedFavorites.map((destination) => (
                <Card key={destination.id} className="glass-surface card-luxury overflow-hidden border-border/50 group">
                  {/* Card header with gradient */}
                  <div className="relative h-24 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 overflow-hidden">
                    <div className="absolute inset-0 floral-bg opacity-50" />
                    <div className="absolute top-3 right-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFavorite(destination.name)}
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-black/40 dark:hover:bg-black/60 rounded-full"
                        title="Remove from favorites"
                      >
                        <Heart size={16} weight="fill" className="text-primary" />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 left-4">
                      <Badge variant="secondary" className="text-xs bg-white/80 dark:bg-black/40 backdrop-blur-sm">
                        {destination.category || 'Destination'}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    {/* Name + country */}
                    <div>
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                        {destination.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin size={12} weight="fill" className="text-primary/60" />
                        {destination.country}
                      </p>
                    </div>

                    {/* Coordinates */}
                    {destination.latitude && destination.longitude && (
                      <div className="text-xs font-mono text-muted-foreground bg-muted/30 rounded-lg px-2 py-1.5">
                        {destination.latitude.toFixed(3)}°, {destination.longitude.toFixed(3)}°
                      </div>
                    )}

                    {/* Notes */}
                    {destination.notes && (
                      <div className="text-sm text-muted-foreground bg-accent/10 rounded-xl p-3 border border-accent/20 leading-relaxed">
                        {destination.notes}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditNotes(destination)}
                            className="gap-1.5 flex-1 text-xs border-border/60 h-8"
                          >
                            <NotePencil size={13} />
                            {destination.notes ? 'Edit Notes' : 'Add Notes'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Notes for {destination.name}</DialogTitle>
                            <DialogDescription>
                              Add personal notes, tips, or reminders about this destination.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-2">
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
                            <Button onClick={() => handleSaveNotes(destination.name)} className="w-full">
                              Save Notes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Link to={`/explore/${encodeURIComponent(destination.name)}`} className="flex-1">
                        <Button size="sm" className="gap-1.5 w-full text-xs h-8 shadow-sm shadow-primary/15">
                          Explore
                          <ArrowRight size={13} />
                        </Button>
                      </Link>
                    </div>

                    {/* Saved date */}
                    <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1 border-t border-border/40">
                      <CalendarDots size={11} weight="fill" />
                      Saved {new Date(destination.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
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
