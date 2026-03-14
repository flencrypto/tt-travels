import { useState } from 'react'
import { MagnifyingGlass, MapPin, Warning } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation?: number
  feature_code?: string
  country_code?: string
  timezone?: string
  population?: number
  postcodes?: string[]
  country_id?: number
  country?: string
  admin1?: string
  admin2?: string
  admin3?: string
  admin4?: string
}

interface WeatherSearchProps {
  onLocationSelect: (location: GeocodingResult, weather: WeatherData) => void
  temperatureUnit: 'celsius' | 'fahrenheit'
}

interface WeatherData {
  temperature: number
  windSpeed: number
  weatherCode: number
  weatherCondition: string
}

export function WeatherSearch({ onLocationSelect, temperatureUnit }: WeatherSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const searchLocations = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setError('Please enter at least 2 characters to search')
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchQuery.trim()
        )}&count=10&language=en&format=json`
      )

      if (!response.ok) {
        throw new Error('Failed to search locations')
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.reason || 'Search failed')
      }

      setResults(data.results || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search locations')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchLocations()
    }
  }

  const handleSelectLocation = async (location: GeocodingResult) => {
    try {
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${
          location.longitude
        }&current_weather=true&temperature_unit=${
          temperatureUnit === 'celsius' ? 'celsius' : 'fahrenheit'
        }`
      )

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const weatherData = await weatherResponse.json()
      const currentWeather = weatherData.current_weather

      const weatherConditions: Record<number, string> = {
        0: 'clear',
        1: 'mainly clear',
        2: 'partly cloudy',
        3: 'overcast',
        45: 'foggy',
        48: 'foggy',
        51: 'light drizzle',
        53: 'moderate drizzle',
        55: 'dense drizzle',
        61: 'slight rain',
        63: 'moderate rain',
        65: 'heavy rain',
        71: 'slight snow',
        73: 'moderate snow',
        75: 'heavy snow',
        77: 'snow grains',
        80: 'slight rain showers',
        81: 'moderate rain showers',
        82: 'violent rain showers',
        85: 'slight snow showers',
        86: 'heavy snow showers',
        95: 'thunderstorm',
        96: 'thunderstorm with hail',
        99: 'thunderstorm with hail',
      }

      const weather: WeatherData = {
        temperature: currentWeather?.temperature || 0,
        windSpeed: currentWeather?.windspeed || 0,
        weatherCode: currentWeather?.weathercode || 0,
        weatherCondition: weatherConditions[currentWeather?.weathercode || 0] || 'varied',
      }

      onLocationSelect(location, weather)
      setSearchQuery('')
      setResults([])
      setHasSearched(false)
    } catch {
      setError('Failed to fetch weather data for this location')
    }
  }

  const getLocationLabel = (location: GeocodingResult) => {
    const parts = [location.name]
    if (location.admin1 && location.admin1 !== location.name) {
      parts.push(location.admin1)
    }
    if (location.country) {
      parts.push(location.country)
    }
    return parts.join(', ')
  }

  return (
    <Card className="glass-surface">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MagnifyingGlass size={24} className="text-primary" weight="bold" />
          Weather Search
        </CardTitle>
        <CardDescription>
          Search for any location worldwide to view weather and activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            id="location-search"
            placeholder="Enter city name, postal code, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={searchLocations}
            disabled={loading || !searchQuery.trim()}
            className="gap-2"
          >
            {loading ? (
              <>
                <MagnifyingGlass size={20} className="animate-pulse" />
                Searching...
              </>
            ) : (
              <>
                <MagnifyingGlass size={20} weight="bold" />
                Search
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <Warning size={16} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasSearched && !loading && !error && results.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin size={48} className="mx-auto mb-3 opacity-50" />
            <p>No locations found for "{searchQuery}"</p>
            <p className="text-sm mt-1">Try a different search term or check your spelling</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Found {results.length} location{results.length !== 1 ? 's' : ''}
            </p>
            <Separator />
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {results.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleSelectLocation(location)}
                    className="w-full text-left p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                            {getLocationLabel(location)}
                          </h4>
                          <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
                            {location.country_code && (
                              <Badge variant="outline" className="text-xs">
                                {location.country_code}
                              </Badge>
                            )}
                            {location.timezone && (
                              <span className="flex items-center gap-1">
                                {location.timezone}
                              </span>
                            )}
                          </div>
                        </div>
                        <MapPin size={20} className="text-primary shrink-0" weight="fill" />
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>
                          Lat: {location.latitude.toFixed(4)}°
                        </span>
                        <span>
                          Lng: {location.longitude.toFixed(4)}°
                        </span>
                        {location.elevation !== undefined && (
                          <span>
                            Elevation: {Math.round(location.elevation)}m
                          </span>
                        )}
                        {location.population && location.population > 0 && (
                          <span>
                            Pop: {location.population.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
