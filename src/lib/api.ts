import type { WeatherData, Integration, FlightSearchParams, FlightOffer, HotelSearchParams, HotelOffer } from './types'

export class MissingApiKeyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MissingApiKeyError'
  }
}

export async function generateItinerary(destination: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new MissingApiKeyError('OpenAI API key is not configured')
  }

  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo'

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful travel assistant. Create detailed, practical travel itineraries with day-by-day activities, local tips, and recommendations.',
          },
          {
            role: 'user',
            content: `Create a detailed 3-day travel itinerary for ${destination}. Include must-see attractions, local food recommendations, and practical tips.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content?.trim() || 'No itinerary generated'
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      throw error
    }
    throw new Error(`Failed to generate itinerary: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function generateTemplateItinerary(destination: string): string {
  return `3-Day Itinerary for ${destination}

Day 1: Arrival & City Exploration
- Morning: Check into hotel and freshen up
- Afternoon: Visit the main city center and famous landmarks
- Evening: Try local cuisine at a popular restaurant

Day 2: Cultural Immersion
- Morning: Visit museums and historical sites
- Afternoon: Explore local markets and shopping districts
- Evening: Attend a cultural performance or local event

Day 3: Nature & Relaxation
- Morning: Take a day trip to nearby natural attractions
- Afternoon: Enjoy leisure activities or visit a spa
- Evening: Farewell dinner at a scenic location

Travel Tips:
- Book attractions in advance
- Try local transportation
- Learn basic local phrases
- Stay hydrated and respect local customs`
}

export async function fetchWeather(
  lat: number,
  lng: number,
  unit: 'celsius' | 'fahrenheit'
): Promise<WeatherData> {
  try {
    const tempUnit = unit === 'celsius' ? 'celsius' : 'fahrenheit'
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&temperature_unit=${tempUnit}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }

    const data = await response.json()

    return {
      main: {
        temp: data.current_weather?.temperature || 0,
      },
      unit: unit === 'celsius' ? '°C' : '°F',
    }
  } catch (error) {
    throw new Error(`Weather fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const INTEGRATIONS: Integration[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'AI-powered travel itinerary generation using GPT models',
    envVars: ['VITE_OPENAI_API_KEY', 'VITE_OPENAI_MODEL (optional)'],
    setupSteps: [
      'Sign up at https://platform.openai.com',
      'Generate an API key from your account dashboard',
      'Create a .env file in your project root',
      'Add: VITE_OPENAI_API_KEY=your_api_key_here',
      'Optionally add: VITE_OPENAI_MODEL=gpt-4 (defaults to gpt-3.5-turbo)',
      'Restart your development server',
    ],
    officialLink: 'https://platform.openai.com',
    affectedActions: ['AI Trip Planner - Generate itineraries'],
    notes: 'API usage will incur charges based on OpenAI pricing',
  },
  {
    id: 'geolocation',
    name: 'Browser Geolocation',
    description: 'Access your current location for weather and map features',
    envVars: [],
    setupSteps: [
      'Browser will request location permission when you visit Explore page',
      'Click "Allow" when prompted',
      'Location access is required for weather and map features',
    ],
    officialLink: 'https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API',
    affectedActions: ['Explore - View nearby locations', 'Explore - Check local weather'],
    notes: 'No API key required - uses browser built-in geolocation',
  },
]

export function isIntegrationConfigured(integration: Integration): boolean {
  if (integration.id === 'geolocation') {
    return 'geolocation' in navigator
  }

  if (integration.id === 'openai') {
    return Boolean(import.meta.env.VITE_OPENAI_API_KEY)
  }

  return false
}
