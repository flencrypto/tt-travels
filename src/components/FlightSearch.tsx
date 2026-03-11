import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { searchFlights, MissingApiKeyError } from '@/lib/api'
import type { FlightOffer } from '@/lib/types'
import { toast } from 'sonner'
import { AirplaneTilt, MagnifyingGlass, Clock, CurrencyDollar } from '@phosphor-icons/react'
import { SetupModal } from './SetupModal'
import { format } from 'date-fns'

export function FlightSearch() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [adults, setAdults] = useState('1')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<FlightOffer[]>([])
  const [showSetupModal, setShowSetupModal] = useState(false)

  const handleSearch = async () => {
    if (!origin || !destination || !departureDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    setResults([])

    try {
      const offers = await searchFlights({
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureDate,
        returnDate: returnDate || undefined,
        adults: parseInt(adults) || 1,
      })

      setResults(offers)
      
      if (offers.length === 0) {
        toast.info('No flights found for your search')
      } else {
        toast.success(`Found ${offers.length} flights`)
      }
    } catch (error) {
      if (error instanceof MissingApiKeyError) {
        setShowSetupModal(true)
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to search flights')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/)
    if (!match) return duration
    const hours = match[1] ? match[1].replace('H', 'h ') : ''
    const minutes = match[2] ? match[2].replace('M', 'm') : ''
    return hours + minutes
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin">Origin (IATA Code)</Label>
          <Input
            id="origin"
            placeholder="e.g., JFK"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            maxLength={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">Destination (IATA Code)</Label>
          <Input
            id="destination"
            placeholder="e.g., LAX"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            maxLength={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="departure-date">Departure Date</Label>
          <Input
            id="departure-date"
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="return-date">Return Date (Optional)</Label>
          <Input
            id="return-date"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={departureDate || new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adults">Adults</Label>
          <Input
            id="adults"
            type="number"
            min="1"
            max="9"
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="w-full gap-2"
            size="lg"
          >
            <MagnifyingGlass size={20} weight="bold" />
            {loading ? 'Searching...' : 'Search Flights'}
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Available Flights ({results.length})</h3>
          <div className="grid gap-4">
            {results.map((offer) => {
              const outbound = offer.itineraries[0]
              const firstSegment = outbound.segments[0]
              const lastSegment = outbound.segments[outbound.segments.length - 1]
              
              return (
                <div
                  key={offer.id}
                  className="glass-surface p-4 rounded-lg border hover:border-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-4">
                        <AirplaneTilt size={32} weight="fill" className="text-primary" />
                        <div className="flex-1">
                          <div className="flex items-center gap-4 text-lg font-semibold">
                            <span>{firstSegment.departure.iataCode}</span>
                            <span className="text-muted-foreground">→</span>
                            <span>{lastSegment.arrival.iataCode}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {format(new Date(firstSegment.departure.at), 'PPp')} - {format(new Date(lastSegment.arrival.at), 'p')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>{formatDuration(outbound.duration)}</span>
                        </div>
                        <div>
                          {outbound.segments.length === 1 ? 'Direct' : `${outbound.segments.length - 1} stop${outbound.segments.length > 2 ? 's' : ''}`}
                        </div>
                        <div>
                          {offer.validatingAirlineCodes.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex items-baseline gap-1">
                        <CurrencyDollar size={20} className="text-accent" weight="fill" />
                        <span className="text-2xl font-bold text-accent">
                          {parseFloat(offer.price.total).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {offer.price.currency}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <SetupModal open={showSetupModal} onOpenChange={setShowSetupModal} />
    </div>
  )
}
