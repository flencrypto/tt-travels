import { useState, useEffect } from 'react'
import { MapPin, Clock, Airplane, Car } from '@phosphor-icons/react'
import { calculateDistance, formatDistance, formatTravelTime, getUserLocation, getTravelMode, type DistanceResult } from '@/lib/distance-calculator'
import type { Coordinates } from '@/lib/types'
import { useKV } from '@github/spark/hooks'
import type { Settings } from '@/lib/types'

interface DistanceInfoProps {
  destination: Coordinates
  destinationName?: string
  compact?: boolean
  className?: string
}

export function DistanceInfo({ destination, destinationName, compact = false, className = '' }: DistanceInfoProps) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [distance, setDistance] = useState<DistanceResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [settings] = useKV<Settings>('tt-travels-settings', {
    displayName: '',
    temperatureUnit: 'celsius',
  })

  useEffect(() => {
    const loadLocation = async () => {
      setLoading(true)
      const location = await getUserLocation()
      
      if (location) {
        setUserLocation(location)
        const dist = calculateDistance(location, destination)
        setDistance(dist)
      }
      
      setLoading(false)
    }

    loadLocation()
  }, [destination])

  if (loading) {
    return null
  }

  if (!userLocation || !distance) {
    return null
  }

  const unit = settings?.temperatureUnit === 'fahrenheit' ? 'imperial' : 'metric'
  const travelMode = getTravelMode(distance.distanceKm)
  const TravelIcon = travelMode === 'flight' ? Airplane : Car

  if (compact) {
    return (
      <div className={`flex items-center gap-3 text-sm text-muted-foreground ${className}`}>
        <div className="flex items-center gap-1">
          <MapPin size={14} weight="fill" />
          <span>{formatDistance(distance, unit)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} weight="fill" />
          <span>{formatTravelTime(distance)}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
          <TravelIcon size={16} weight="fill" className="text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Distance</span>
          <span className="font-medium">{formatDistance(distance, unit)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10">
          <Clock size={16} weight="fill" className="text-accent" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">
            {travelMode === 'flight' ? 'Flight time' : 'Drive time'}
          </span>
          <span className="font-medium">{formatTravelTime(distance)}</span>
        </div>
      </div>
    </div>
  )
}
