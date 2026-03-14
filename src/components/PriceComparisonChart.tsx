import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { searchFlights, searchHotels, MissingApiKeyError } from '@/lib/api'
import { toast } from 'sonner'
import { ChartLine, MagnifyingGlass } from '@phosphor-icons/react'
import { addDays, format } from 'date-fns'
import type { FlightSearchParams, HotelSearchParams } from '@/lib/types'

interface PriceDataPoint {
  date: string
  price: number
  formattedDate: string
}

interface PriceComparisonChartProps {
  type: 'flight' | 'hotel'
}

export function PriceComparisonChart({ type }: PriceComparisonChartProps) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [cityCode, setCityCode] = useState('')
  const [baseDate, setBaseDate] = useState('')
  const [adults, setAdults] = useState('1')
  const [loading, setLoading] = useState(false)
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([])

  const isFlight = type === 'flight'

  const handleCompare = async () => {
    if (isFlight && (!origin || !destination || !baseDate)) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!isFlight && (!cityCode || !baseDate)) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    setPriceData([])

    try {
      const dates = Array.from({ length: 7 }, (_, i) => 
        addDays(new Date(baseDate), i)
      )

      const pricePromises = dates.map(async (date) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        
        try {
          if (isFlight) {
            const offers = await searchFlights({
              origin: origin.toUpperCase(),
              destination: destination.toUpperCase(),
              departureDate: dateStr,
              adults: parseInt(adults) || 1,
            } as FlightSearchParams)

            if (offers.length > 0) {
              const minPrice = Math.min(...offers.map(o => parseFloat(o.price.total)))
              return {
                date: dateStr,
                price: minPrice,
                formattedDate: format(date, 'MMM d'),
              }
            }
          } else {
            const checkOutDate = format(addDays(date, 1), 'yyyy-MM-dd')
            const offers = await searchHotels({
              cityCode: cityCode.toUpperCase(),
              checkInDate: dateStr,
              checkOutDate,
              adults: parseInt(adults) || 1,
            } as HotelSearchParams)

            const availableOffers = offers.filter(o => o.available && o.offers && o.offers.length > 0)
            if (availableOffers.length > 0) {
              const prices = availableOffers
                .filter(o => o.offers && o.offers[0])
                .map(o => parseFloat(o.offers![0].price.total))
              
              if (prices.length > 0) {
                const minPrice = Math.min(...prices)
                return {
                  date: dateStr,
                  price: minPrice,
                  formattedDate: format(date, 'MMM d'),
                }
              }
            }
          }
          return null
        } catch (error) {
          console.error(`Error fetching price for ${dateStr}:`, error)
          return null
        }
      })

      const results = await Promise.all(pricePromises)
      const validResults = results.filter((r): r is PriceDataPoint => r !== null)

      if (validResults.length === 0) {
        toast.info('No prices found for the selected dates')
      } else {
        setPriceData(validResults)
        toast.success(`Found prices for ${validResults.length} dates`)
      }
    } catch (error) {
      if (error instanceof MissingApiKeyError) {
        toast.error('Amadeus API key not configured. Please check setup.')
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to compare prices')
      }
    } finally {
      setLoading(false)
    }
  }

  const minPrice = priceData.length > 0 ? Math.min(...priceData.map(d => d.price)) : 0
  const maxPrice = priceData.length > 0 ? Math.max(...priceData.map(d => d.price)) : 0
  const avgPrice = priceData.length > 0 
    ? priceData.reduce((sum, d) => sum + d.price, 0) / priceData.length 
    : 0

  return (
    <Card className="glass-surface">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ChartLine size={24} weight="bold" className="text-primary" />
          <div>
            <CardTitle>Price Comparison Across Dates</CardTitle>
            <CardDescription>
              Compare {isFlight ? 'flight' : 'hotel'} prices over the next 7 days
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isFlight ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="chart-origin">Origin (IATA)</Label>
                <Input
                  id="chart-origin"
                  placeholder="e.g., JFK"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  maxLength={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chart-destination">Destination (IATA)</Label>
                <Input
                  id="chart-destination"
                  placeholder="e.g., LAX"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  maxLength={3}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="chart-city">City (IATA)</Label>
              <Input
                id="chart-city"
                placeholder="e.g., PAR"
                value={cityCode}
                onChange={(e) => setCityCode(e.target.value)}
                maxLength={3}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="chart-base-date">Start Date</Label>
            <Input
              id="chart-base-date"
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chart-adults">Adults</Label>
            <Input
              id="chart-adults"
              type="number"
              min="1"
              max="9"
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleCompare}
          disabled={loading}
          className="w-full gap-2"
          size="lg"
        >
          <MagnifyingGlass size={20} weight="bold" />
          {loading ? 'Comparing Prices...' : 'Compare Prices'}
        </Button>

        {priceData.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="text-sm text-muted-foreground mb-1">Lowest Price</div>
                <div className="text-2xl font-bold text-accent">${minPrice.toFixed(2)}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-sm text-muted-foreground mb-1">Average Price</div>
                <div className="text-2xl font-bold text-primary">${avgPrice.toFixed(2)}</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted border border-border">
                <div className="text-sm text-muted-foreground mb-1">Highest Price</div>
                <div className="text-2xl font-bold">${maxPrice.toFixed(2)}</div>
              </div>
            </div>

            <div className="relative h-64 bg-gradient-to-br from-background to-muted/30 rounded-lg border p-6">
              <div className="absolute inset-0 p-6">
                <div className="relative h-full flex items-end justify-between gap-2">
                  {priceData.map((point, _index) => {
                    const heightPercent = ((point.price - minPrice) / (maxPrice - minPrice || 1)) * 100
                    const isLowest = point.price === minPrice
                    const isHighest = point.price === maxPrice
                    
                    return (
                      <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs font-semibold text-accent mb-1">
                          ${point.price.toFixed(0)}
                        </div>
                        <div
                          className={`w-full rounded-t-md transition-all hover:opacity-80 cursor-pointer relative group ${
                            isLowest 
                              ? 'bg-gradient-to-t from-accent to-accent/60 shadow-lg shadow-accent/30' 
                              : isHighest
                              ? 'bg-gradient-to-t from-muted-foreground to-muted-foreground/60'
                              : 'bg-gradient-to-t from-primary to-primary/60'
                          }`}
                          style={{ 
                            height: `${Math.max(heightPercent, 10)}%`,
                          }}
                        >
                          {isLowest && (
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-accent whitespace-nowrap">
                              Best Deal
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground text-center">
                          {point.formattedDate}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {priceData.map((point, index) => {
                const isLowest = point.price === minPrice
                const prevPrice = index > 0 ? priceData[index - 1].price : point.price
                const priceChange = point.price - prevPrice
                const percentChange = prevPrice !== 0 ? (priceChange / prevPrice) * 100 : 0

                return (
                  <div 
                    key={point.date}
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      isLowest ? 'bg-accent/10 border-accent/30' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-semibold">{point.formattedDate}</div>
                      {isLowest && (
                        <span className="text-xs font-bold text-accent px-2 py-1 rounded-full bg-accent/20">
                          BEST PRICE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {index > 0 && (
                        <div className={`text-sm ${priceChange > 0 ? 'text-red-500' : priceChange < 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)} ({percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%)
                        </div>
                      )}
                      <div className="text-lg font-bold">${point.price.toFixed(2)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
