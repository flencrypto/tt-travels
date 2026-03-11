import type { WeatherData, Integration, FlightSearchParams, FlightOffer, HotelSearchParams, HotelOffer } from './types'

export class MissingApiKeyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MissingApiKeyError'
  }
}

export interface ItineraryOptions {
  destination: string
  duration: number
  travelStyle: string
  budget: string
  groupType: string
  pace: string
}

export async function generateItinerary(options: ItineraryOptions): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new MissingApiKeyError('OpenAI API key is not configured')
  }

  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo'

  const systemPrompt = 'You are a helpful travel assistant. Create detailed, practical travel itineraries with day-by-day activities, local tips, and recommendations. Tailor your suggestions to the traveler\'s preferences, budget, and travel style.'

  const travelStyleDescriptions: Record<string, string> = {
    adventure: 'outdoor activities, hiking, extreme sports, and adventurous experiences',
    relaxation: 'spa visits, beach time, leisurely activities, and stress-free experiences',
    culture: 'museums, historical sites, art galleries, and cultural immersion',
    food: 'local cuisine, food tours, cooking classes, and culinary experiences',
    nightlife: 'bars, clubs, entertainment venues, and evening activities',
    nature: 'parks, gardens, wildlife, and natural attractions',
    photography: 'scenic viewpoints, photo opportunities, and visually stunning locations',
    shopping: 'markets, boutiques, shopping districts, and local crafts',
    balanced: 'a well-rounded mix of various activities and experiences',
  }

  const budgetDescriptions: Record<string, string> = {
    budget: 'budget-friendly options, free attractions, affordable dining, and money-saving tips',
    moderate: 'mid-range options with a balance of value and quality',
    luxury: 'premium experiences, fine dining, luxury accommodations, and exclusive activities',
  }

  const groupDescriptions: Record<string, string> = {
    solo: 'solo traveler with opportunities to meet people and safe activities',
    couple: 'romantic couple with intimate and memorable experiences',
    family: 'family with children, including kid-friendly activities and practical considerations',
    friends: 'group of friends with social and fun activities',
  }

  const paceDescriptions: Record<string, string> = {
    relaxed: 'a relaxed pace with plenty of downtime and flexibility',
    moderate: 'a balanced pace with structured activities and some free time',
    packed: 'an action-packed schedule maximizing experiences each day',
  }

  const userPrompt = `Create a detailed ${options.duration}-day travel itinerary for ${options.destination}.

Travel Preferences:
- Travel Style: Focus on ${travelStyleDescriptions[options.travelStyle] || 'a balanced experience'}
- Budget Level: ${budgetDescriptions[options.budget] || 'moderate pricing'}
- Group Type: Traveling as ${groupDescriptions[options.groupType] || 'solo'}
- Pace: ${paceDescriptions[options.pace] || 'moderate'}

Please structure the itinerary with:
1. Day-by-day breakdown with morning, afternoon, and evening activities
2. Specific attraction and restaurant recommendations
3. Practical tips (transportation, booking advice, timing)
4. Estimated costs where relevant
5. Local insider tips and cultural notes

Make the itinerary detailed, actionable, and personalized to these preferences.`

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
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
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
    id: 'amadeus',
    name: 'Amadeus for Developers',
    description: 'Real-time flight and hotel booking search powered by Amadeus Travel APIs',
    envVars: ['VITE_AMADEUS_API_KEY', 'VITE_AMADEUS_API_SECRET'],
    setupSteps: [
      'Sign up at https://developers.amadeus.com',
      'Create a new app in your dashboard to get API credentials',
      'Copy your API Key and API Secret',
      'Add to your .env file: VITE_AMADEUS_API_KEY=your_api_key',
      'Add to your .env file: VITE_AMADEUS_API_SECRET=your_api_secret',
      'Start with test environment (free tier with test data)',
      'Restart your development server',
    ],
    officialLink: 'https://developers.amadeus.com',
    affectedActions: ['Bookings - Search flights', 'Bookings - Search hotels'],
    notes: 'Free test environment available with realistic test data',
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

let amadeusAccessToken: string | null = null
let amadeusTokenExpiry: number = 0

async function getAmadeusAccessToken(): Promise<string> {
  if (amadeusAccessToken && Date.now() < amadeusTokenExpiry) {
    return amadeusAccessToken
  }

  const apiKey = import.meta.env.VITE_AMADEUS_API_KEY
  const apiSecret = import.meta.env.VITE_AMADEUS_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new MissingApiKeyError('Amadeus API credentials are not configured')
  }

  try {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: apiKey,
        client_secret: apiSecret,
      }),
    })

    if (!response.ok) {
      throw new Error(`Amadeus authentication failed: ${response.statusText}`)
    }

    const data = await response.json()
    amadeusAccessToken = data.access_token
    amadeusTokenExpiry = Date.now() + (data.expires_in * 1000) - 60000

    return amadeusAccessToken as string
  } catch (error) {
    throw new Error(`Failed to authenticate with Amadeus: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
  try {
    const token = await getAmadeusAccessToken()

    const queryParams = new URLSearchParams({
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      max: '10',
      currencyCode: 'USD',
    })

    if (params.returnDate) {
      queryParams.append('returnDate', params.returnDate)
    }

    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.errors?.[0]?.detail || `Flight search failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      throw error
    }
    throw new Error(`Failed to search flights: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function searchHotels(params: HotelSearchParams): Promise<HotelOffer[]> {
  try {
    const token = await getAmadeusAccessToken()

    const queryParams = new URLSearchParams({
      cityCode: params.cityCode,
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      adults: params.adults.toString(),
      radius: (params.radius || 5).toString(),
      radiusUnit: params.radiusUnit || 'KM',
      ratings: '3,4,5',
      includeClosed: 'false',
      bestRateOnly: 'true',
    })

    const response = await fetch(
      `https://test.api.amadeus.com/v3/shopping/hotel-offers?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.errors?.[0]?.detail || `Hotel search failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      throw error
    }
    throw new Error(`Failed to search hotels: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export interface PackingListOptions {
  destination: string
  duration: number
  travelStyle: string
  budget: string
  groupType: string
  season?: string
}

export interface PackingListItem {
  id: string
  name: string
  category: string
  checked: boolean
}

export async function generatePackingList(options: PackingListOptions): Promise<PackingListItem[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new MissingApiKeyError('OpenAI API key is not configured')
  }

  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo'

  const travelStyleDescriptions: Record<string, string> = {
    adventure: 'outdoor activities, hiking, extreme sports',
    relaxation: 'spa, beach, leisure',
    culture: 'museums, historical sites, art galleries',
    food: 'local cuisine, food tours, dining',
    nightlife: 'bars, clubs, evening activities',
    nature: 'parks, gardens, wildlife',
    photography: 'scenic viewpoints, photography',
    shopping: 'markets, boutiques, shopping',
    balanced: 'a balanced mix of activities',
  }

  const systemPrompt = 'You are a travel packing expert. Generate comprehensive, practical packing lists tailored to the destination, trip duration, travel style, and group type. Organize items by category. Return ONLY a valid JSON object with a "items" property containing an array of objects with "name" and "category" properties.'

  const userPrompt = `Create a detailed packing list for a ${options.duration}-day trip to ${options.destination}.

Travel Details:
- Travel Style: ${travelStyleDescriptions[options.travelStyle] || 'balanced'}
- Budget Level: ${options.budget}
- Group Type: ${options.groupType}
${options.season ? `- Season: ${options.season}` : ''}

Categories to include:
- Essentials (passport, documents, wallet, etc.)
- Clothing (appropriate for destination climate and activities)
- Toiletries
- Electronics
- Health & Safety
- Activities & Recreation (specific to travel style)
- Miscellaneous

Return ONLY a JSON object in this exact format:
{
  "items": [
    {"name": "Passport", "category": "Essentials"},
    {"name": "T-shirts", "category": "Clothing"},
    ...more items
  ]
}

Be specific and practical. Consider the destination's climate, culture, and the travel style.`

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
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content?.trim()
    
    if (!content) {
      throw new Error('No packing list generated')
    }

    const parsed = JSON.parse(content)
    const items = parsed.items || []

    return items.map((item: { name: string; category: string }, index: number) => ({
      id: `item-${index}`,
      name: item.name,
      category: item.category,
      checked: false,
    }))
  } catch (error) {
    if (error instanceof MissingApiKeyError) {
      throw error
    }
    throw new Error(`Failed to generate packing list: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function isIntegrationConfigured(integration: Integration): boolean {
  if (integration.id === 'geolocation') {
    return 'geolocation' in navigator
  }

  if (integration.id === 'openai') {
    return Boolean(import.meta.env.VITE_OPENAI_API_KEY)
  }

  if (integration.id === 'amadeus') {
    return Boolean(import.meta.env.VITE_AMADEUS_API_KEY && import.meta.env.VITE_AMADEUS_API_SECRET)
  }

  return false
}
