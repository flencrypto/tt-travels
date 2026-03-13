export interface GeoLocation {
  latitude: number
  longitude: number
  name: string
  country?: string
  admin1?: string
  timezone?: string
  population?: number
}

export async function geocodeLocation(query: string): Promise<GeoLocation[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
  
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Geocoding request failed')
    }
    
    const data = await response.json()
    
    if (!data.results || data.results.length === 0) {
      return []
    }
    
    return data.results.map((result: any) => ({
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
      country: result.country,
      admin1: result.admin1,
      timezone: result.timezone,
      population: result.population
    }))
  } catch (error) {
    console.error('Geocoding error:', error)
    return []
  }
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distanceKm = R * c
  
  return distanceKm
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function formatDistance(distanceKm: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'imperial') {
    const miles = distanceKm * 0.621371
    return `${Math.round(miles).toLocaleString()} mi`
  }
  return `${Math.round(distanceKm).toLocaleString()} km`
}

export function formatDuration(hours: number): string {
  const totalMinutes = Math.round(hours * 60)
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  
  if (h === 0) {
    return `${m}min`
  } else if (m === 0) {
    return `${h}h`
  } else {
    return `${h}h ${m}min`
  }
}

export function getTransportMode(distanceKm: number): 'driving' | 'flight' {
  return distanceKm > 500 ? 'flight' : 'driving'
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    const response = await fetch(url)
    const data = await response.json()
    
    return data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  } catch {
    return `${lat.toFixed(4)}, ${lon.toFixed(4)}`
  }
}
