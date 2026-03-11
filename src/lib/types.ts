export interface SavedFlight {
  id: string
  flightOffer: FlightOffer
  savedAt: string
}

export interface SavedHotel {
  id: string
  hotelOffer: HotelOffer
  savedAt: string
}

export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  savedFlights?: SavedFlight[]
  savedHotels?: SavedHotel[]
}

export interface Settings {
  displayName: string
  temperatureUnit: 'celsius' | 'fahrenheit'
}

export interface APIKeys {
  amadeus_api_key?: string
  amadeus_api_secret?: string
  openweather_api_key?: string
  airbnb_api_key?: string
  openai_api_key?: string
}

export interface APIValidationResult {
  isValid: boolean
  message: string
  details?: string
}

export interface Integration {
  id: string
  name: string
  description: string
  envVars: string[]
  setupSteps: string[]
  officialLink: string
  affectedActions: string[]
  notes?: string
}

export interface WeatherData {
  main: {
    temp: number
  }
  unit: string
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface FlightOffer {
  id: string
  price: {
    total: string
    currency: string
  }
  itineraries: {
    duration: string
    segments: {
      departure: {
        iataCode: string
        at: string
      }
      arrival: {
        iataCode: string
        at: string
      }
      carrierCode: string
      number: string
      duration: string
    }[]
  }[]
  validatingAirlineCodes: string[]
}

export interface HotelOffer {
  hotel: {
    hotelId: string
    name: string
    rating?: string
    cityCode?: string
  }
  available: boolean
  offers?: {
    id: string
    checkInDate: string
    checkOutDate: string
    room: {
      type: string
      typeEstimated?: {
        category: string
        beds?: number
        bedType?: string
      }
    }
    guests: {
      adults: number
    }
    price: {
      total: string
      currency: string
    }
  }[]
}

export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  adults: number
}

export interface HotelSearchParams {
  cityCode: string
  checkInDate: string
  checkOutDate: string
  adults: number
  radius?: number
  radiusUnit?: 'KM' | 'MILE'
}
