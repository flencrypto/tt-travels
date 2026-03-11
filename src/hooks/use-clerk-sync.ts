import { useEffect, useRef } from 'react'
import { useUser } from '@clerk/react'
import { useKV } from '@github/spark/hooks'
import type { Trip, Settings } from '@/lib/types'
import type { FavoriteDestination } from '@/hooks/use-favorites'
import type { 
  FlightSearchHistory, 
  HotelSearchHistory, 
  ItinerarySearchHistory 
} from '@/hooks/use-search-history'

interface UserMetadata {
  trips?: Trip[]
  settings?: Settings
  favoriteDestinations?: FavoriteDestination[]
  flightSearchHistory?: FlightSearchHistory[]
  hotelSearchHistory?: HotelSearchHistory[]
  itinerarySearchHistory?: ItinerarySearchHistory[]
  [key: string]: unknown
}

export function useClerkSync() {
  const { user, isLoaded, isSignedIn } = useUser()
  const hasInitialized = useRef(false)
  const isSyncing = useRef(false)
  
  const hasValidClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== 'pk_test_placeholder'
  
  const [localTrips] = useKV<Trip[]>('trips', [])
  const [localSettings] = useKV<Settings>('tt-travels-settings', {
    displayName: '',
    temperatureUnit: 'celsius',
  })
  const [localFavorites] = useKV<FavoriteDestination[]>('tt-travels-favorite-destinations', [])
  const [localFlightHistory] = useKV<FlightSearchHistory[]>('flight-search-history', [])
  const [localHotelHistory] = useKV<HotelSearchHistory[]>('hotel-search-history', [])
  const [localItineraryHistory] = useKV<ItinerarySearchHistory[]>('itinerary-search-history', [])

  useEffect(() => {
    if (!hasValidClerkKey || !isLoaded || !isSignedIn || !user || hasInitialized.current || isSyncing.current) {
      return
    }

    const syncFromClerk = async () => {
      isSyncing.current = true
      
      try {
        const metadata = (user.unsafeMetadata as UserMetadata) || {}
        
        if (metadata.trips && metadata.trips.length > 0) {
          await window.spark.kv.set('trips', metadata.trips)
        }
        
        if (metadata.settings) {
          await window.spark.kv.set('tt-travels-settings', metadata.settings)
        }
        
        if (metadata.favoriteDestinations && metadata.favoriteDestinations.length > 0) {
          await window.spark.kv.set('tt-travels-favorite-destinations', metadata.favoriteDestinations)
        }
        
        if (metadata.flightSearchHistory && metadata.flightSearchHistory.length > 0) {
          await window.spark.kv.set('flight-search-history', metadata.flightSearchHistory)
        }
        
        if (metadata.hotelSearchHistory && metadata.hotelSearchHistory.length > 0) {
          await window.spark.kv.set('hotel-search-history', metadata.hotelSearchHistory)
        }
        
        if (metadata.itinerarySearchHistory && metadata.itinerarySearchHistory.length > 0) {
          await window.spark.kv.set('itinerary-search-history', metadata.itinerarySearchHistory)
        }
        
        hasInitialized.current = true
      } catch (error) {
        console.error('Error syncing from Clerk:', error)
      } finally {
        isSyncing.current = false
      }
    }

    syncFromClerk()
  }, [isLoaded, isSignedIn, user])

  useEffect(() => {
    if (!hasValidClerkKey || !isLoaded || !isSignedIn || !user || !hasInitialized.current || isSyncing.current) {
      return
    }

    const syncToClerk = async () => {
      isSyncing.current = true
      
      try {
        const updatedMetadata: UserMetadata = {
          trips: localTrips || [],
          settings: localSettings,
          favoriteDestinations: localFavorites || [],
          flightSearchHistory: localFlightHistory || [],
          hotelSearchHistory: localHotelHistory || [],
          itinerarySearchHistory: localItineraryHistory || [],
        }

        await user.update({
          unsafeMetadata: updatedMetadata,
        })
      } catch (error) {
        console.error('Error syncing to Clerk:', error)
      } finally {
        isSyncing.current = false
      }
    }

    const timeoutId = setTimeout(syncToClerk, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [
    isLoaded,
    isSignedIn,
    user,
    localTrips,
    localSettings,
    localFavorites,
    localFlightHistory,
    localHotelHistory,
    localItineraryHistory,
  ])

  return {
    isSynced: isSignedIn && hasInitialized.current,
    isSignedIn,
  }
}
