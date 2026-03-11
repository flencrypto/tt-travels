import { CalendarDots, Plus, Trash, AirplaneTilt, Buildings, CurrencyDollar, Star, Clock, MapPin } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Trip } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import { useState } from 'react'
import { format, differenceInDays } from 'date-fns'

export function Trips() {
  const [trips, setTrips] = useKV<Trip[]>('trips', [])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
  })

  const handleAddTrip = () => {
    if (!formData.name || !formData.destination || !formData.startDate || !formData.endDate) {
      return
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      ...formData,
      savedFlights: [],
      savedHotels: [],
    }

    setTrips((currentTrips) => [...(currentTrips || []), newTrip])
    setFormData({ name: '', destination: '', startDate: '', endDate: '' })
    setShowForm(false)
  }

  const handleRemoveTrip = (id: string) => {
    setTrips((currentTrips) => (currentTrips || []).filter((trip) => trip.id !== id))
  }

  const handleRemoveFlight = (tripId: string, flightId: string) => {
    setTrips((currentTrips) =>
      (currentTrips || []).map((trip) => {
        if (trip.id === tripId) {
          return {
            ...trip,
            savedFlights: (trip.savedFlights || []).filter((f) => f.id !== flightId),
          }
        }
        return trip
      })
    )
  }

  const handleRemoveHotel = (tripId: string, hotelId: string) => {
    setTrips((currentTrips) =>
      (currentTrips || []).map((trip) => {
        if (trip.id === tripId) {
          return {
            ...trip,
            savedHotels: (trip.savedHotels || []).filter((h) => h.id !== hotelId),
          }
        }
        return trip
      })
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/)
    if (!match) return duration
    const hours = match[1] ? match[1].replace('H', 'h ') : ''
    const minutes = match[2] ? match[2].replace('M', 'm') : ''
    return hours + minutes
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CalendarDots size={40} className="text-primary" weight="fill" />
              <h1 className="text-4xl font-bold">Trip Planner</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Organize and track your travel plans
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
            size="lg"
          >
            <Plus size={20} weight="bold" />
            Add Trip
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="max-w-6xl mx-auto glass-surface">
          <CardHeader>
            <CardTitle>New Trip</CardTitle>
            <CardDescription>Add a new trip to your planner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trip-name">Trip Name</Label>
                <Input
                  id="trip-name"
                  placeholder="Summer Vacation"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trip-destination">Destination</Label>
                <Input
                  id="trip-destination"
                  placeholder="Paris, France"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trip-start">Start Date</Label>
                <Input
                  id="trip-start"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trip-end">End Date</Label>
                <Input
                  id="trip-end"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddTrip} className="flex-1">
                Save Trip
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {(trips || []).length === 0 ? (
          <Card className="glass-surface">
            <CardContent className="p-12 text-center">
              <CalendarDots size={64} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No trips planned yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click "Add Trip" to start planning your adventure
              </p>
            </CardContent>
          </Card>
        ) : (
          (trips || []).map((trip) => (
            <Card key={trip.id} className="glass-surface">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{trip.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base">
                      <MapPin size={16} />
                      {trip.destination}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveTrip(trip.id)}
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash size={20} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="flights" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="flights" className="gap-2">
                      <AirplaneTilt size={16} weight="fill" />
                      Flights ({(trip.savedFlights || []).length})
                    </TabsTrigger>
                    <TabsTrigger value="hotels" className="gap-2">
                      <Buildings size={16} weight="fill" />
                      Hotels ({(trip.savedHotels || []).length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="flights" className="mt-4 space-y-4">
                    {(trip.savedFlights || []).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <AirplaneTilt size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No flights saved yet</p>
                        <p className="text-sm mt-1">Visit Bookings to add flights</p>
                      </div>
                    ) : (
                      (trip.savedFlights || []).map((savedFlight) => {
                        const offer = savedFlight.flightOffer
                        const outbound = offer.itineraries[0]
                        const firstSegment = outbound.segments[0]
                        const lastSegment = outbound.segments[outbound.segments.length - 1]

                        return (
                          <div
                            key={savedFlight.id}
                            className="border rounded-lg p-4 bg-card/50 hover:bg-card transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-4">
                                  <AirplaneTilt size={24} weight="fill" className="text-primary" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-4 font-semibold">
                                      <span>{firstSegment.departure.iataCode}</span>
                                      <span className="text-muted-foreground">→</span>
                                      <span>{lastSegment.arrival.iataCode}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                      {format(new Date(firstSegment.departure.at), 'PPp')}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{formatDuration(outbound.duration)}</span>
                                  </div>
                                  <div>
                                    {outbound.segments.length === 1
                                      ? 'Direct'
                                      : `${outbound.segments.length - 1} stop${outbound.segments.length > 2 ? 's' : ''}`}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right space-y-2">
                                <div className="flex items-baseline gap-1">
                                  <CurrencyDollar size={18} className="text-accent" weight="fill" />
                                  <span className="text-xl font-bold text-accent">
                                    {parseFloat(offer.price.total).toFixed(2)}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {offer.price.currency}
                                </div>
                                <Button
                                  onClick={() => handleRemoveFlight(trip.id, savedFlight.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </TabsContent>

                  <TabsContent value="hotels" className="mt-4 space-y-4">
                    {(trip.savedHotels || []).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Buildings size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No hotels saved yet</p>
                        <p className="text-sm mt-1">Visit Bookings to add hotels</p>
                      </div>
                    ) : (
                      (trip.savedHotels || []).map((savedHotel) => {
                        const offer = savedHotel.hotelOffer
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
                            key={savedHotel.id}
                            className="border rounded-lg p-4 bg-card/50 hover:bg-card transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start gap-4">
                                  <Buildings size={24} weight="fill" className="text-primary mt-1" />
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{hotel.name}</h4>
                                    {hotel.rating && (
                                      <div className="flex items-center gap-1 mt-1">
                                        {Array.from({ length: parseInt(hotel.rating) }).map((_, i) => (
                                          <Star key={i} size={14} weight="fill" className="text-accent" />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="text-sm space-y-1 text-muted-foreground">
                                  <div>
                                    {format(new Date(bestOffer.checkInDate), 'MMM d')} -{' '}
                                    {format(new Date(bestOffer.checkOutDate), 'MMM d, yyyy')}
                                  </div>
                                  <div>
                                    {bestOffer.room.type} • {nights} night{nights > 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right space-y-2">
                                <div className="flex items-baseline gap-1">
                                  <CurrencyDollar size={18} className="text-accent" weight="fill" />
                                  <span className="text-xl font-bold text-accent">
                                    {parseFloat(bestOffer.price.total).toFixed(2)}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  ${pricePerNight.toFixed(2)} / night
                                </div>
                                <Button
                                  onClick={() => handleRemoveHotel(trip.id, savedHotel.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
