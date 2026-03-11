import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { searchHotels, MissingApiKeyError } from '@/lib/api'
import type { HotelOffer, Trip, SavedHotel } from '@/lib/types'
import { toast } from 'sonner'
import { Buildings, MagnifyingGlass, MapPin, CurrencyDollar, Star, HeartStraight, House, ListBullets, MapTrifold } from '@phosphor-icons/react'
import { SetupModal } from './SetupModal'
import { format, differenceInDays } from 'date-fns'
import { useKV } from '@github/spark/hooks'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HotelMapView } from './HotelMapView'

type Provider = 'hotels' | 'airbnb'
type ViewMode = 'list' | 'map'

export function HotelSearch() {
  const [provider, setProvider] = useState<Provider>('hotels')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [cityCode, setCityCode] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [adults, setAdults] = useState('1')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<HotelOffer[]>([])
  const [showSetupModal, setShowSetupModal] = useState(false)
  const [trips, setTrips] = useKV<Trip[]>('trips', [])
  const [showTripDialog, setShowTripDialog] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<HotelOffer | null>(null)

  const handleSearch = async () => {
    if (!cityCode || !checkInDate || !checkOutDate) {
      toast.error('Please fill in all required fields')
      return
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast.error('Check-out date must be after check-in date')
      return
    }

    setLoading(true)
    setResults([])

    try {
      const offers = await searchHotels({
        cityCode: cityCode.toUpperCase(),
        checkInDate,
        checkOutDate,
        adults: parseInt(adults) || 1,
      })

      const availableOffers = offers.filter(offer => offer.available && offer.offers && offer.offers.length > 0)
      setResults(availableOffers)
      
      if (availableOffers.length === 0) {
        toast.info(`No ${provider === 'hotels' ? 'hotels' : 'Airbnb listings'} found for your search`)
      } else {
        toast.success(`Found ${availableOffers.length} ${provider === 'hotels' ? 'hotels' : 'Airbnb listings'}`)
      }
    } catch (error) {
      if (error instanceof MissingApiKeyError) {
        setShowSetupModal(true)
      } else {
        toast.error(error instanceof Error ? error.message : `Failed to search ${provider === 'hotels' ? 'hotels' : 'Airbnb listings'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveToTrip = (tripId: string) => {
    if (!selectedHotel) return

    setTrips((currentTrips) => 
      (currentTrips || []).map((trip) => {
        if (trip.id === tripId) {
          const savedHotel: SavedHotel = {
            id: `hotel-${Date.now()}`,
            hotelOffer: selectedHotel,
            savedAt: new Date().toISOString(),
          }
          return {
            ...trip,
            savedHotels: [...(trip.savedHotels || []), savedHotel],
          }
        }
        return trip
      })
    )

    toast.success(`${provider === 'hotels' ? 'Hotel' : 'Airbnb listing'} saved to trip!`)
    setShowTripDialog(false)
    setSelectedHotel(null)
  }

  const openSaveDialog = (hotel: HotelOffer) => {
    setSelectedHotel(hotel)
    setShowTripDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Tabs value={provider} onValueChange={(value) => setProvider(value as Provider)} className="w-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hotels" className="gap-2">
              <Buildings size={18} weight="fill" />
              Hotels
            </TabsTrigger>
            <TabsTrigger value="airbnb" className="gap-2">
              <House size={18} weight="fill" />
              Airbnb
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city-code">City (IATA Code)</Label>
          <Input
            id="city-code"
            placeholder="e.g., PAR"
            value={cityCode}
            onChange={(e) => setCityCode(e.target.value)}
            maxLength={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="check-in-date">Check-in Date</Label>
          <Input
            id="check-in-date"
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="check-out-date">Check-out Date</Label>
          <Input
            id="check-out-date"
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            min={checkInDate || new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hotel-adults">Adults</Label>
          <Input
            id="hotel-adults"
            type="number"
            min="1"
            max="9"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
          />
        </div>

        <div className="flex items-end md:col-span-2">
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="w-full gap-2"
            size="lg"
          >
            <MagnifyingGlass size={20} weight="bold" />
            {loading ? 'Searching...' : `Search ${provider === 'hotels' ? 'Hotels' : 'Airbnb'}`}
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Available {provider === 'hotels' ? 'Hotels' : 'Airbnb Listings'} ({results.length})
            </h3>
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="w-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" className="gap-2">
                  <ListBullets size={18} weight="bold" />
                  List
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-2">
                  <MapTrifold size={18} weight="fill" />
                  Map
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewMode === 'map' ? (
            <HotelMapView 
              hotels={results} 
              provider={provider}
              onSelectHotel={openSaveDialog}
            />
          ) : (
            <div className="grid gap-4">
            {results.map((offer) => {
              const hotel = offer.hotel
              const bestOffer = offer.offers?.[0]
              
              if (!bestOffer) return null

              const nights = differenceInDays(
                new Date(bestOffer.checkOutDate),
                new Date(bestOffer.checkInDate)
              )
              const pricePerNight = parseFloat(bestOffer.price.total) / nights
              
              return (
                <div
                  key={hotel.hotelId}
                  className="glass-surface p-4 rounded-lg border hover:border-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-4">
                        {provider === 'hotels' ? (
                          <Buildings size={32} weight="fill" className="text-primary mt-1" />
                        ) : (
                          <House size={32} weight="fill" className="text-primary mt-1" />
                        )}
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold">{hotel.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin size={16} />
                            <span>{hotel.cityCode || 'City not specified'}</span>
                          </div>
                          {hotel.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              {Array.from({ length: parseInt(hotel.rating) }).map((_, i) => (
                                <Star key={i} size={16} weight="fill" className="text-accent" />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-sm space-y-1">
                        <div className="text-muted-foreground">
                          <span className="font-medium">Check-in:</span> {format(new Date(bestOffer.checkInDate), 'PPP')}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium">Check-out:</span> {format(new Date(bestOffer.checkOutDate), 'PPP')}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium">{provider === 'hotels' ? 'Room' : 'Property'}:</span> {bestOffer.room.type}
                          {bestOffer.room.typeEstimated && bestOffer.room.typeEstimated.beds && (
                            <span> • {bestOffer.room.typeEstimated.beds} bed(s)</span>
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium">Guests:</span> {bestOffer.guests.adults} adult(s)
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex items-baseline gap-1">
                        <CurrencyDollar size={20} className="text-accent" weight="fill" />
                        <span className="text-2xl font-bold text-accent">
                          {parseFloat(bestOffer.price.total).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {bestOffer.price.currency} total
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${pricePerNight.toFixed(2)} / night
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {nights} night{nights > 1 ? 's' : ''}
                      </div>
                      <Button
                        onClick={() => openSaveDialog(offer)}
                        variant="outline"
                        size="sm"
                        className="gap-2 mt-2"
                      >
                        <HeartStraight size={16} weight="fill" />
                        Save to Trip
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
            </div>
          )}
        </div>
      )}

      <Dialog open={showTripDialog} onOpenChange={setShowTripDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save {provider === 'hotels' ? 'Hotel' : 'Airbnb'} to Trip</DialogTitle>
            <DialogDescription>
              Choose which trip to add this {provider === 'hotels' ? 'hotel' : 'listing'} to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {(trips || []).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No trips created yet. Create a trip first to save {provider === 'hotels' ? 'hotels' : 'Airbnb listings'}.
              </p>
            ) : (
              (trips || []).map((trip) => (
                <Button
                  key={trip.id}
                  onClick={() => handleSaveToTrip(trip.id)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <div className="text-left">
                    <div className="font-semibold">{trip.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {trip.destination} • {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SetupModal open={showSetupModal} onOpenChange={setShowSetupModal} />
    </div>
  )
}
