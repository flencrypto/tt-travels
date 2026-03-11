/// <reference path="../vite-env.d.ts" />
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

async function getStoredAPIKeys() {
  try {
    const keys = await spark.kv.get<{ openai_api_key?: string }>('tt-travels-api-keys')
    return keys
  } catch {
    return null
  }
}

export async function generateItinerary(options: ItineraryOptions): Promise<string> {
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

  const prompt = spark.llmPrompt`You are an expert travel planner with extensive knowledge of global destinations. Create comprehensive, highly detailed travel itineraries with complete day-by-day breakdowns, specific recommendations, insider tips, and practical advice. Provide extensive information to help travelers make the most of their trip.

Create an extremely detailed and comprehensive ${options.duration}-day travel itinerary for ${options.destination}.

Travel Preferences:
- Travel Style: Focus on ${travelStyleDescriptions[options.travelStyle] || 'a balanced experience'}
- Budget Level: ${budgetDescriptions[options.budget] || 'moderate pricing'}
- Group Type: Traveling as ${groupDescriptions[options.groupType] || 'solo'}
- Pace: ${paceDescriptions[options.pace] || 'moderate'}

IMPORTANT: Provide extensive, thorough details for each section. Be verbose and comprehensive.

For EACH day, include ALL of the following sections:
1. **Morning (3-4 detailed activities with timing)**
   - Specific venues with addresses when possible
   - Opening hours and best visiting times
   - Expected duration for each activity
   - Transportation between locations
   - Breakfast/brunch recommendations with price ranges

2. **Afternoon (3-4 detailed activities with timing)**
   - Detailed attraction descriptions
   - Ticket prices and booking links when relevant
   - Lunch recommendations with menu highlights
   - Walking routes or public transport options
   - Photography tips and best viewpoints

3. **Evening (2-3 detailed activities with timing)**
   - Dinner recommendations with cuisine type and ambiance
   - Evening activities or entertainment options
   - Nightlife suggestions if appropriate
   - Return transportation to accommodation

4. **Daily Practical Information**
   - Estimated total daily cost breakdown
   - Recommended clothing/items to bring that day
   - Weather considerations for that time
   - Cultural etiquette tips
   - Local phrases that might be useful
   - Safety considerations

5. **Insider Tips & Alternatives**
   - Local secrets and hidden gems
   - Alternative options if places are crowded
   - Best times to avoid crowds
   - Money-saving tips
   - Where locals actually go

Additionally, include:
- **Pre-Trip Planning Section**: What to book in advance, visa requirements, best areas to stay, essential apps to download
- **Getting Around**: Detailed transportation guide for the city/region
- **Food Guide**: Must-try dishes, best restaurants by category, food markets
- **Shopping Recommendations**: Best areas for shopping, what to buy, price expectations
- **Day Trip Options**: Nearby destinations worth visiting if time permits
- **Emergency Information**: Important phone numbers, hospital locations, embassy details

Provide at least 2-3 paragraphs of detailed information for each major section. Include specific names, addresses, and pricing wherever possible. Make this itinerary comprehensive enough that a traveler could follow it without additional research.`

  try {
    const result = await spark.llm(prompt, 'gpt-4o')
    return result.trim() || 'No itinerary generated'
  } catch (error) {
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
  weatherBased?: boolean
  reason?: string
}

export interface DestinationWeather {
  temperature: number
  condition: string
  unit: string
}

async function fetchDestinationWeather(destination: string): Promise<DestinationWeather | null> {
  try {
    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`
    )
    
    if (!geocodeResponse.ok) {
      return null
    }

    const geocodeData = await geocodeResponse.json()
    
    if (!geocodeData || geocodeData.length === 0) {
      return null
    }

    const { lat, lon } = geocodeData[0]

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`
    )

    if (!weatherResponse.ok) {
      return null
    }

    const weatherData = await weatherResponse.json()
    const temp = weatherData.current_weather?.temperature || 0
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

    return {
      temperature: temp,
      condition: weatherConditions[weatherCode] || 'varied',
      unit: '°C',
    }
  } catch (error) {
    return null
  }
}

export async function generatePackingList(options: PackingListOptions): Promise<PackingListItem[]> {
  const weather = await fetchDestinationWeather(options.destination)

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

  const weatherContext = weather 
    ? `\n\nCurrent Weather in ${options.destination}:
- Temperature: ${weather.temperature}${weather.unit}
- Conditions: ${weather.condition}

IMPORTANT: Based on these weather conditions, recommend appropriate weather-specific items and mark them with "weatherBased": true and include a "reason" field explaining why (e.g., "Heavy rain expected", "Cold temperatures", "Hot weather"). This is critical for helping travelers prepare for the actual conditions.`
    : ''

  const prompt = spark.llmPrompt`You are a travel packing expert. Generate comprehensive, practical packing lists tailored to the destination, trip duration, travel style, group type, and current weather conditions. Organize items by category. Mark weather-specific items with a weatherBased flag and provide a brief reason. Return ONLY a valid JSON object with an "items" property containing an array of objects.

Create a detailed packing list for a ${options.duration}-day trip to ${options.destination}.

Travel Details:
- Travel Style: ${travelStyleDescriptions[options.travelStyle] || 'balanced'}
- Budget Level: ${options.budget}
- Group Type: ${options.groupType}
${options.season ? `- Season: ${options.season}` : ''}${weatherContext}

Categories to include:
- Essentials (passport, documents, wallet, etc.)
- Clothing (appropriate for destination climate and activities)
- Weather Protection (based on current weather conditions)
- Toiletries
- Electronics
- Health & Safety
- Activities & Recreation (specific to travel style)
- Miscellaneous

Return ONLY a JSON object in this exact format:
{
  "items": [
    {"name": "Passport", "category": "Essentials", "weatherBased": false},
    {"name": "Umbrella", "category": "Weather Protection", "weatherBased": true, "reason": "Moderate rain expected"},
    {"name": "Sunscreen SPF 50", "category": "Toiletries", "weatherBased": true, "reason": "Hot sunny weather"},
    ...more items
  ]
}

Be specific and practical. Consider the destination's climate, culture, travel style, and especially the current weather conditions. Include 5-10 weather-specific recommendations marked with weatherBased: true.`

  try {
    const result = await spark.llm(prompt, 'gpt-4o', true)
    const parsed = JSON.parse(result)
    const items = parsed.items || []

    return items.map((item: { name: string; category: string; weatherBased?: boolean; reason?: string }, index: number) => ({
      id: `item-${index}`,
      name: item.name,
      category: item.category,
      checked: false,
      weatherBased: item.weatherBased || false,
      reason: item.reason,
    }))
  } catch (error) {
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

export interface WeatherActivity {
  name: string
  description: string
  category: string
  suitability: 'excellent' | 'good' | 'fair'
  weatherReason: string
  tips?: string[]
}

export async function generateWeatherActivities(
  destination: string,
  temperature: number,
  weatherCondition: string,
  unit: string
): Promise<WeatherActivity[]> {
  const prompt = spark.llmPrompt`You are a knowledgeable travel expert who recommends activities based on current weather conditions and destinations. Provide practical, specific, and localized recommendations that consider both weather suitability and the unique character of each destination. Return ONLY valid JSON.

Generate 6-8 weather-appropriate activity recommendations for ${destination} given the current conditions:
- Temperature: ${temperature}${unit}
- Weather: ${weatherCondition}

Provide a diverse mix of activities across categories: Indoor, Outdoor, Cultural, Food & Dining, Entertainment, Nature, Shopping, and Relaxation.

For each activity:
1. Consider how the current weather affects the experience
2. Rate suitability as "excellent", "good", or "fair" based on weather conditions
3. Explain WHY this activity is recommended given the weather
4. Include 2-3 practical tips specific to the destination and weather

Return ONLY a JSON object in this exact format:
{
  "activities": [
    {
      "name": "Visit the Louvre Museum",
      "description": "Explore world-class art collections in climate-controlled galleries spanning 72,735 square meters",
      "category": "Indoor",
      "suitability": "excellent",
      "weatherReason": "Perfect indoor activity for rainy weather - stay dry while enjoying art",
      "tips": ["Book timed entry online to skip lines", "Visit the Denon wing first for Mona Lisa", "Wear comfortable shoes for extensive walking"]
    }
  ]
}

Be specific to ${destination} - mention actual landmarks, neighborhoods, and local favorites. Consider the weather when rating suitability.`

  try {
    const apiKeys = await getStoredAPIKeys()
    const envKey = import.meta.env.VITE_OPENAI_API_KEY
    
    if (!apiKeys?.openai_api_key && !envKey) {
      throw new Error('OpenAI API key not configured. Please add it in Settings.')
    }

    const result = await spark.llm(prompt, 'gpt-4o', true)
    
    if (!result || result.trim().length === 0) {
      throw new Error('Empty response from AI service. Please check your OpenAI API key.')
    }

    let parsed
    try {
      parsed = JSON.parse(result)
    } catch (parseError) {
      console.error('Failed to parse AI response:', result)
      throw new Error(`Invalid JSON response from AI. Please try again.`)
    }

    if (!parsed.activities || !Array.isArray(parsed.activities)) {
      console.error('Response missing activities array:', parsed)
      throw new Error('AI response format incorrect. Please try again.')
    }

    const activities = parsed.activities.map((activity: any) => ({
      name: activity.name || 'Unknown Activity',
      description: activity.description || '',
      category: activity.category || 'General',
      suitability: activity.suitability || 'good',
      weatherReason: activity.weatherReason || '',
      tips: Array.isArray(activity.tips) ? activity.tips : [],
    }))

    return activities as WeatherActivity[]
  } catch (error) {
    console.error('Activity generation error:', error)
    throw new Error(`Failed to generate activity recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export interface DestinationRecommendation {
  destination: string
  country: string
  description: string
  bestFor: string[]
  seasonInfo: string
  estimatedBudget: string
  highlights: string[]
  travelTips: string[]
}

export async function generateSmartDestinationRecommendations(params: {
  interests: string[]
  budget?: string
  travelStyle?: string
  duration?: number
  climate?: string
}): Promise<DestinationRecommendation[]> {
  const interestsStr = params.interests.join(', ')
  const budgetStr = params.budget || 'moderate'
  const styleStr = params.travelStyle || 'balanced'
  const durationStr = params.duration ? `${params.duration} days` : 'flexible'
  const climateStr = params.climate || 'any'

  const prompt = spark.llmPrompt`You are an expert travel advisor with deep knowledge of global destinations. Provide personalized, detailed destination recommendations based on traveler preferences.

Generate 5 destination recommendations matching these criteria:
- Interests: ${interestsStr}
- Budget Level: ${budgetStr}
- Travel Style: ${styleStr}
- Trip Duration: ${durationStr}
- Preferred Climate: ${climateStr}

For each destination, provide:
1. Specific destination name and country
2. Compelling description (2-3 sentences) explaining why it matches their interests
3. Array of specific activities/experiences it's best for
4. Current season information and best time to visit
5. Estimated daily budget range in USD
6. 4-5 must-see highlights or unique experiences
7. 3-4 practical travel tips

Return ONLY a JSON object in this exact format:
{
  "recommendations": [
    {
      "destination": "Kyoto",
      "country": "Japan",
      "description": "Ancient capital blending traditional temples with modern culture, perfect for cultural immersion and photography",
      "bestFor": ["Temple visits", "Traditional tea ceremonies", "Cherry blossom viewing", "Japanese cuisine"],
      "seasonInfo": "Best in spring (March-May) and fall (September-November) for mild weather and stunning foliage",
      "estimatedBudget": "$80-150 per day for moderate travelers",
      "highlights": ["Fushimi Inari Shrine", "Arashiyama Bamboo Grove", "Kinkaku-ji Golden Pavilion", "Gion geisha district", "Nishiki Market"],
      "travelTips": ["Get a JR Pass for unlimited train travel", "Visit temples early morning to avoid crowds", "Try kaiseki dining for authentic experience", "Learn basic Japanese phrases"]
    }
  ]
}

Ensure destinations are diverse geographically, culturally distinct, and genuinely match the specified interests and constraints.`

  try {
    const apiKeys = await getStoredAPIKeys()
    const envKey = import.meta.env.VITE_OPENAI_API_KEY
    
    if (!apiKeys?.openai_api_key && !envKey) {
      throw new Error('OpenAI API key not configured. Please add it in Settings.')
    }

    const result = await spark.llm(prompt, 'gpt-4o', true)
    
    if (!result || result.trim().length === 0) {
      throw new Error('Empty response from AI service. Please check your OpenAI API key.')
    }

    let parsed
    try {
      parsed = JSON.parse(result)
    } catch (parseError) {
      console.error('Failed to parse AI response:', result)
      throw new Error(`Invalid JSON response from AI. Please try again.`)
    }

    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      console.error('Response missing recommendations array:', parsed)
      throw new Error('AI response format incorrect. Please try again.')
    }

    return parsed.recommendations as DestinationRecommendation[]
  } catch (error) {
    console.error('Destination recommendations error:', error)
    throw new Error(`Failed to generate destination recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
