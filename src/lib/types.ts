export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
}

export interface Settings {
  displayName: string
  temperatureUnit: 'celsius' | 'fahrenheit'
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
