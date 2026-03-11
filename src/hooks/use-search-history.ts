import { useKV } from '@github/spark/hooks'

export interface FlightSearchHistory {
  id: string
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults: number
  searchedAt: string
}

export interface HotelSearchHistory {
  id: string
  cityCode: string
  checkInDate: string
  checkOutDate: string
  adults: number
  provider: 'hotels' | 'airbnb'
  searchedAt: string
}

export interface ItinerarySearchHistory {
  id: string
  destination: string
  duration: number
  travelStyle: string
  budget: string
  groupType: string
  pace: string
  searchedAt: string
}

const MAX_HISTORY_ITEMS = 5

export function useFlightSearchHistory() {
  const [history, setHistory] = useKV<FlightSearchHistory[]>('flight-search-history', [])

  const addSearch = (search: Omit<FlightSearchHistory, 'id' | 'searchedAt'>) => {
    setHistory((currentHistory) => {
      const newSearch: FlightSearchHistory = {
        ...search,
        id: `flight-${Date.now()}`,
        searchedAt: new Date().toISOString(),
      }
      const updated = [newSearch, ...(currentHistory || [])].slice(0, MAX_HISTORY_ITEMS)
      return updated
    })
  }

  const clearHistory = () => {
    setHistory([])
  }

  return {
    history: history || [],
    addSearch,
    clearHistory,
  }
}

export function useHotelSearchHistory() {
  const [history, setHistory] = useKV<HotelSearchHistory[]>('hotel-search-history', [])

  const addSearch = (search: Omit<HotelSearchHistory, 'id' | 'searchedAt'>) => {
    setHistory((currentHistory) => {
      const newSearch: HotelSearchHistory = {
        ...search,
        id: `hotel-${Date.now()}`,
        searchedAt: new Date().toISOString(),
      }
      const updated = [newSearch, ...(currentHistory || [])].slice(0, MAX_HISTORY_ITEMS)
      return updated
    })
  }

  const clearHistory = () => {
    setHistory([])
  }

  return {
    history: history || [],
    addSearch,
    clearHistory,
  }
}

export function useItinerarySearchHistory() {
  const [history, setHistory] = useKV<ItinerarySearchHistory[]>('itinerary-search-history', [])

  const addSearch = (search: Omit<ItinerarySearchHistory, 'id' | 'searchedAt'>) => {
    setHistory((currentHistory) => {
      const newSearch: ItinerarySearchHistory = {
        ...search,
        id: `itinerary-${Date.now()}`,
        searchedAt: new Date().toISOString(),
      }
      const updated = [newSearch, ...(currentHistory || [])].slice(0, MAX_HISTORY_ITEMS)
      return updated
    })
  }

  const clearHistory = () => {
    setHistory([])
  }

  return {
    history: history || [],
    addSearch,
    clearHistory,
  }
}
