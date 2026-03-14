import { useState, useEffect } from 'react'
import { MapPin, ThermometerSimple, Warning, NavigationArrow } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ActivityRecommendations } from '@/components/ActivityRecommendations'
import { GeoLocalRecommendations } from '@/components/GeoLocalRecommendations'
import { WeatherSearch, type GeocodingResult } from '@/components/WeatherSearch'
import type { Coordinates, WeatherData } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import type { Settings } from '@/lib/types'

export function Explore() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherCondition, setWeatherCondition] = useState<string>('clear')
  const [destination, setDestination] = useState<string>('your location')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(true)
  const [settings] = useKV<Settings>('tt-travels-settings', {
    displayName: '',
    temperatureUnit: 'celsius',
  })

  const handleLocationSelect = (location: GeocodingResult, weatherData: { temperature: number; windSpeed: number; weatherCode: number; weatherCondition: string }) => {
    const coords = {
      lat: location.latitude,
      lng: location.longitude,
    }
    setCoordinates(coords)
    setIsUsingCurrentLocation(false)

    const unit = settings?.temperatureUnit || 'celsius'
    setWeather({
      main: {
        temp: weatherData.temperature,
      },
      unit: unit === 'celsius' ? '°C' : '°F',
    })
    setWeatherCondition(weatherData.weatherCondition)

    const parts = [location.name]
    if (location.admin1 && location.admin1 !== location.name) {
      parts.push(location.admin1)
    }
    if (location.country) {
      parts.push(location.country)
    }
    setDestination(parts.join(', '))
    setError(null)
  }

  const loadCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true)
      setError(null)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCoordinates(coords)
          setIsUsingCurrentLocation(true)

          try {
            const unit = settings?.temperatureUnit || 'celsius'

            const weatherResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current_weather=true&temperature_unit=${unit === 'celsius' ? 'celsius' : 'fahrenheit'}`
            )
            const weatherData = await weatherResponse.json()
            const weatherCode = weatherData.current_weather?.weathercode || 0

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

            setWeatherCondition(weatherConditions[weatherCode] || 'varied')
            setWeather({
              main: {
                temp: weatherData.current_weather?.temperature || 0,
              },
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
          setError('Location access denied. Please enable location permissions.')
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

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Explore Weather & Activities</h1>
            <p className="text-muted-foreground text-lg">
              Search locations worldwide or use your current location
            </p>
          </div>
          {!isUsingCurrentLocation && (
            <Button
              onClick={loadCurrentLocation}
              variant="outline"
              className="gap-2 shrink-0"
            >
              <NavigationArrow size={20} weight="fill" />
              Use My Location
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <WeatherSearch
          onLocationSelect={handleLocationSelect}
          temperatureUnit={settings?.temperatureUnit || 'celsius'}
        />
      </div>

      {error && (
        <Card className="max-w-4xl mx-auto border-destructive">
          <CardContent className="p-6 flex items-center gap-3">
            <Warning size={24} className="text-destructive" weight="fill" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && !error && (
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="animate-pulse space-y-3">
              <MapPin size={48} className="mx-auto text-primary" />
              <p className="text-muted-foreground">Requesting location access...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {coordinates && !loading && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-surface">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin size={24} className="text-primary" weight="fill" />
                  <CardTitle>{isUsingCurrentLocation ? 'Your Location' : 'Selected Location'}</CardTitle>
                </div>
                {!isUsingCurrentLocation && (
                  <CardDescription>{destination}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Latitude</p>
                <p className="text-2xl font-mono">{coordinates.lat.toFixed(6)}</p>
                <p className="text-sm text-muted-foreground mt-4">Longitude</p>
                <p className="text-2xl font-mono">{coordinates.lng.toFixed(6)}</p>
              </CardContent>
            </Card>

            {weather && (
              <Card className="glass-surface">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ThermometerSimple size={24} className="text-accent" weight="fill" />
                    <CardTitle>Current Weather</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-6xl font-bold">{Math.round(weather.main.temp)}{weather.unit}</p>
                    <p className="text-muted-foreground mt-2">Temperature</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="glass-surface">
            <CardHeader>
              <CardTitle>Map View</CardTitle>
              <CardDescription>Your current location on the map</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 rounded-lg overflow-hidden border">
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

          {weather && (
            <ActivityRecommendations
              destination={destination}
              temperature={weather.main.temp}
              weatherCondition={weatherCondition}
              unit={weather.unit}
            />
          )}

          <GeoLocalRecommendations
            latitude={coordinates.lat}
            longitude={coordinates.lng}
            locationName={destination}
          />
        </div>
      )}
    </div>
  )
}
