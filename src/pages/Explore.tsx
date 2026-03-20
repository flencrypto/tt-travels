import { useState, useEffect } from 'react'
import { MapPin, ThermometerSimple, Warning, NavigationArrow, Wind, Drop } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ActivityRecommendations } from '@/components/ActivityRecommendations'
import { GeoLocalRecommendations } from '@/components/GeoLocalRecommendations'
import { WeatherSearch, type GeocodingResult } from '@/components/WeatherSearch'
import type { Coordinates, WeatherData } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import type { Settings } from '@/lib/types'

function getWeatherClass(condition: string): string {
  const c = condition.toLowerCase()
  if (c.includes('clear') || c.includes('sunny')) return 'weather-sunny'
  if (c.includes('rain') || c.includes('drizzle')) return 'weather-rainy'
  if (c.includes('snow')) return 'weather-snowy'
  if (c.includes('cloud') || c.includes('overcast')) return 'weather-cloudy'
  return 'weather-sunny'
}

function getWeatherIcon(condition: string) {
  // Return ThermometerSimple for all as a safe fallback
  return ThermometerSimple
}

function getWeatherEmoji(condition: string): string {
  const c = condition.toLowerCase()
  if (c.includes('clear') || c.includes('sunny')) return '☀️'
  if (c.includes('mainly clear') || c.includes('partly')) return '🌤️'
  if (c.includes('overcast')) return '☁️'
  if (c.includes('fog')) return '��️'
  if (c.includes('drizzle')) return '🌦️'
  if (c.includes('rain')) return '🌧️'
  if (c.includes('snow')) return '❄️'
  if (c.includes('thunder')) return '⛈️'
  return '🌈'
}

export function Explore() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherCondition, setWeatherCondition] = useState<string>('clear')
  const [windSpeed, setWindSpeed] = useState<number | null>(null)
  const [destination, setDestination] = useState<string>('your location')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(true)
  const [settings] = useKV<Settings>('tt-travels-settings', {
    displayName: '',
    temperatureUnit: 'celsius',
  })

  const handleLocationSelect = (location: GeocodingResult, weatherData: { temperature: number; windSpeed: number; weatherCode: number; weatherCondition: string }) => {
    const coords = { lat: location.latitude, lng: location.longitude }
    setCoordinates(coords)
    setIsUsingCurrentLocation(false)
    const unit = settings?.temperatureUnit || 'celsius'
    setWeather({
      main: { temp: weatherData.temperature },
      unit: unit === 'celsius' ? '°C' : '°F',
    })
    setWindSpeed(weatherData.windSpeed)
    setWeatherCondition(weatherData.weatherCondition)
    const parts = [location.name]
    if (location.admin1 && location.admin1 !== location.name) parts.push(location.admin1)
    if (location.country) parts.push(location.country)
    setDestination(parts.join(', '))
    setError(null)
  }

  const loadCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true)
      setError(null)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude }
          setCoordinates(coords)
          setIsUsingCurrentLocation(true)
          try {
            const unit = settings?.temperatureUnit || 'celsius'
            const weatherResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true&temperature_unit=${unit === 'celsius' ? 'celsius' : 'fahrenheit'}`
            )
            const weatherData = await weatherResponse.json()
            const weatherCode = weatherData.current_weather?.weathercode || 0
            const ws = weatherData.current_weather?.windspeed
            setWindSpeed(ws ?? null)

            const weatherConditions: Record<number, string> = {
              0: 'clear', 1: 'mainly clear', 2: 'partly cloudy', 3: 'overcast',
              45: 'foggy', 48: 'foggy', 51: 'light drizzle', 53: 'moderate drizzle',
              55: 'dense drizzle', 61: 'slight rain', 63: 'moderate rain', 65: 'heavy rain',
              71: 'slight snow', 73: 'moderate snow', 75: 'heavy snow', 77: 'snow grains',
              80: 'slight rain showers', 81: 'moderate rain showers', 82: 'violent rain showers',
              85: 'slight snow showers', 86: 'heavy snow showers', 95: 'thunderstorm',
              96: 'thunderstorm with hail', 99: 'thunderstorm with hail',
            }

            setWeatherCondition(weatherConditions[weatherCode] || 'varied')
            setWeather({
              main: { temp: weatherData.current_weather?.temperature || 0 },
              unit: unit === 'celsius' ? '°C' : '°F',
            })

            const geocodeResponse = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
            )
            const geocodeData = await geocodeResponse.json()
            const city = geocodeData.address?.city || geocodeData.address?.town || geocodeData.address?.village || geocodeData.address?.county || 'your location'
            setDestination(city)
          } catch {
            setError('Failed to fetch weather data')
          } finally {
            setLoading(false)
          }
        },
        () => {
          setError('Location access denied. Please enable location permissions or search for a city.')
          setLoading(false)
        }
      )
    } else {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCurrentLocation()
  }, [])

  const WeatherIcon = weather ? getWeatherIcon(weatherCondition) : ThermometerSimple
  const weatherClass = weather ? getWeatherClass(weatherCondition) : 'weather-sunny'
  const weatherEmoji = getWeatherEmoji(weatherCondition)

  return (
    <div className="min-h-screen space-y-8">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <section className="hero-section -mx-4 -mt-6 px-6 pt-12 pb-10">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="eyebrow mb-3">Discover the World</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                <span className="gradient-text">Explore</span> & Weather
              </h1>
              <p className="text-muted-foreground text-lg max-w-md">
                Search any city worldwide for live weather, activities, and local recommendations.
              </p>
            </div>
            {!isUsingCurrentLocation && (
              <Button
                onClick={loadCurrentLocation}
                variant="outline"
                className="gap-2 shrink-0 self-end"
              >
                <NavigationArrow size={18} weight="fill" />
                Use My Location
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl space-y-6">

        {/* Search */}
        <WeatherSearch
          onLocationSelect={handleLocationSelect}
          temperatureUnit={settings?.temperatureUnit || 'celsius'}
        />

        {/* Error */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 flex items-center gap-3">
              <Warning size={20} className="text-destructive shrink-0" weight="fill" />
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && !error && (
          <Card className="glass-surface border-border/50">
            <CardContent className="p-12 text-center">
              <div className="animate-pulse space-y-3">
                <div className="feature-icon w-14 h-14 rounded-2xl flex items-center justify-center mx-auto">
                  <MapPin size={28} className="text-primary" weight="fill" />
                </div>
                <p className="text-muted-foreground">Requesting location access...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {coordinates && !loading && (
          <div className="space-y-6">

            {/* Weather hero card */}
            {weather && (
              <Card className={`overflow-hidden border-0 shadow-xl card-luxury`}>
                <div className={`${weatherClass} p-8 text-white relative overflow-hidden`}>
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 opacity-20">
                    <WeatherIcon size={160} weight="fill" />
                  </div>
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-white/80 text-sm font-medium mb-1">
                          {isUsingCurrentLocation ? '📍 Current Location' : `📍 ${destination}`}
                        </p>
                        <div className="flex items-end gap-3">
                          <span className="text-7xl font-bold leading-none">
                            {Math.round(weather.main.temp)}
                          </span>
                          <span className="text-3xl font-light pb-1">{weather.unit}</span>
                        </div>
                        <p className="text-white/90 text-xl mt-2 capitalize">
                          {weatherEmoji} {weatherCondition}
                        </p>
                      </div>
                      <div className="space-y-2">
                        {windSpeed !== null && (
                          <Badge className="bg-white/20 text-white border-white/30 gap-1.5 backdrop-blur-sm">
                            <Wind size={14} weight="fill" />
                            {Math.round(windSpeed)} km/h
                          </Badge>
                        )}
                        <div>
                          <Badge className="bg-white/20 text-white border-white/30 gap-1.5 backdrop-blur-sm">
                            <Drop size={14} weight="fill" />
                            Live Data
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Location + Map row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coordinates */}
              <Card className="glass-surface border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin size={18} className="text-primary" weight="fill" />
                    {isUsingCurrentLocation ? 'Your Location' : 'Selected Location'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!isUsingCurrentLocation && (
                    <p className="text-sm text-muted-foreground font-medium">{destination}</p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground mb-1">Latitude</p>
                      <p className="font-mono text-sm font-medium">{coordinates.lat.toFixed(4)}°</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground mb-1">Longitude</p>
                      <p className="font-mono text-sm font-medium">{coordinates.lng.toFixed(4)}°</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick weather stats */}
              {weather && (
                <Card className="glass-surface border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ThermometerSimple size={18} className="text-accent" weight="fill" />
                      Weather Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/30 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                        <p className="text-xl font-bold">{Math.round(weather.main.temp)}{weather.unit}</p>
                      </div>
                      <div className="bg-muted/30 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">Condition</p>
                        <p className="text-sm font-medium capitalize">{weatherEmoji} {weatherCondition}</p>
                      </div>
                      {windSpeed !== null && (
                        <div className="bg-muted/30 rounded-xl p-3 col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Wind Speed</p>
                          <p className="text-sm font-medium">{Math.round(windSpeed)} km/h</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Map */}
            <Card className="glass-surface border-border/50 overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Map View</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative w-full h-64 md:h-80">
                  <iframe
                    title="Location Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
                    style={{ border: 0 }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Activity Recommendations */}
            {weather && (
              <ActivityRecommendations
                destination={destination}
                temperature={weather.main.temp}
                weatherCondition={weatherCondition}
                unit={weather.unit}
              />
            )}

            {/* Geo Local Recommendations */}
            <GeoLocalRecommendations
              latitude={coordinates.lat}
              longitude={coordinates.lng}
              locationName={destination}
            />
          </div>
        )}
      </div>
    </div>
  )
}
