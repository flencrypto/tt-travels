import { useState } from 'react'
import { Heart, MapPin, Star } from '@phosphor-icons/react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import type { Destination } from '../App'
import { toast } from 'sonner'

type DestinationCardProps = {
  destination: Destination
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function DestinationCard({ destination, isFavorite, onToggleFavorite }: DestinationCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite()
    toast.success(
      isFavorite ? 'Removed from favorites' : 'Added to favorites!',
      {
        duration: 2000,
      }
    )
  }

  return (
    <>
      <Card 
        className="destination-card cursor-pointer overflow-hidden group hover:shadow-xl"
        onClick={() => setShowDetails(true)}
      >
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
            className={`heart-icon absolute top-3 right-3 bg-white/90 hover:bg-white backdrop-blur-sm ${
              isFavorite ? 'favorited' : ''
            }`}
            onClick={handleToggleFavorite}
          >
            <Heart 
              size={22} 
              weight={isFavorite ? 'fill' : 'regular'}
              className={isFavorite ? 'text-red-500' : 'text-gray-700'}
            />
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
          <Badge variant="secondary" className="text-xs">
            {destination.category}
          </Badge>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {destination.description}
          </p>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl flex items-center gap-3">
              {destination.name}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite()
                  toast.success(
                    isFavorite ? 'Removed from favorites' : 'Added to favorites!',
                    { duration: 2000 }
                  )
                }}
                className={`heart-icon ${isFavorite ? 'favorited' : ''}`}
              >
                <Heart 
                  size={24} 
                  weight={isFavorite ? 'fill' : 'regular'}
                  className={isFavorite ? 'text-red-500' : 'text-gray-700'}
                />
              </Button>
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-base">
              <MapPin size={18} weight="fill" />
              {destination.country}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
              <img 
                src={destination.image} 
                alt={destination.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <Badge variant="secondary">{destination.category}</Badge>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-2">About</h4>
              <p className="text-muted-foreground leading-relaxed">
                {destination.description}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Star size={20} weight="fill" className="text-accent" />
                Highlights
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {destination.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-accent mt-1">•</span>
                    <span className="text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
