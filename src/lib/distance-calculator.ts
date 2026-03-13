import type { Coordinates } from './types'

export interface DistanceResult {
  distanceKm: number
  distanceMiles: number
  travelTimeHours: number
  travelTimeMinutes: number
}

export function calculateDistance(from: Coordinates, to: Coordinates): DistanceResult {
  const R = 6371
  const dLat = toRad(to.lat - from.lat)
  const dLon = toRad(to.lng - from.lng)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distanceKm = R * c
  const distanceMiles = distanceKm * 0.621371
  
  const avgFlightSpeedKmH = 800
  const avgDrivingSpeedKmH = 80
  
  const speedKmH = distanceKm > 500 ? avgFlightSpeedKmH : avgDrivingSpeedKmH
  const travelTimeHours = distanceKm / speedKmH
  const travelTimeMinutes = Math.round(travelTimeHours * 60)
  
  return {
    distanceKm: Math.round(distanceKm),
    distanceMiles: Math.round(distanceMiles),
    travelTimeHours: Math.round(travelTimeHours * 10) / 10,
    travelTimeMinutes
  }
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function formatDistance(distance: DistanceResult, unit: 'metric' | 'imperial' = 'metric'): string {
  const dist = unit === 'metric' ? distance.distanceKm : distance.distanceMiles
  const unitLabel = unit === 'metric' ? 'km' : 'mi'
  return `${dist.toLocaleString()} ${unitLabel}`
}

export function formatTravelTime(distance: DistanceResult): string {
  const hours = Math.floor(distance.travelTimeMinutes / 60)
  const minutes = distance.travelTimeMinutes % 60
  
  if (hours === 0) {
    return `${minutes}min`
  } else if (minutes === 0) {
    return `${hours}h`
  } else {
    return `${hours}h ${minutes}min`
  }
}

export function getTravelMode(distanceKm: number): 'driving' | 'flight' {
  return distanceKm > 500 ? 'flight' : 'driving'
}

export async function getUserLocation(): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      () => {
        resolve(null)
      },
      { timeout: 5000 }
    )
  })
}
