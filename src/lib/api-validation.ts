import type { APIValidationResult, APIKeys } from './types'

export async function validateAmadeusCredentials(
  apiKey: string,
  apiSecret: string
): Promise<APIValidationResult> {
  if (!apiKey || !apiSecret) {
    return {
      isValid: false,
      message: 'API key and secret are required',
    }
  }

  if (apiKey.trim().length < 10) {
    return {
      isValid: false,
      message: 'API key appears to be invalid (too short)',
    }
  }

  if (apiSecret.trim().length < 10) {
    return {
      isValid: false,
      message: 'API secret appears to be invalid (too short)',
    }
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

    if (response.ok) {
      const data = await response.json()
      return {
        isValid: true,
        message: 'Amadeus credentials verified successfully',
        details: `Access token expires in ${Math.floor(data.expires_in / 60)} minutes`,
      }
    }

    if (response.status === 401) {
      return {
        isValid: false,
        message: 'Invalid credentials',
        details: 'The API key or secret is incorrect',
      }
    }

    return {
      isValid: false,
      message: `Authentication failed (${response.status})`,
      details: response.statusText,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function validateOpenWeatherKey(apiKey: string): Promise<APIValidationResult> {
  if (!apiKey) {
    return {
      isValid: false,
      message: 'API key is required',
    }
  }

  if (apiKey.trim().length < 20) {
    return {
      isValid: false,
      message: 'API key appears to be invalid (too short)',
    }
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}`
    )

    if (response.ok) {
      return {
        isValid: true,
        message: 'OpenWeather API key verified successfully',
        details: 'Connection to OpenWeather API successful',
      }
    }

    if (response.status === 401) {
      const data = await response.json()
      return {
        isValid: false,
        message: 'Invalid API key',
        details: data.message || 'The API key is incorrect',
      }
    }

    return {
      isValid: false,
      message: `Validation failed (${response.status})`,
      details: response.statusText,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function validateAirbnbKey(apiKey: string): Promise<APIValidationResult> {
  if (!apiKey) {
    return {
      isValid: false,
      message: 'API key is required',
    }
  }

  if (apiKey.trim().length < 10) {
    return {
      isValid: false,
      message: 'API key appears to be invalid (too short)',
    }
  }

  return {
    isValid: true,
    message: 'API key format accepted',
    details: 'Note: Airbnb API validation requires actual API endpoint access',
  }
}

export async function validateOpenAIKey(apiKey: string): Promise<APIValidationResult> {
  if (!apiKey) {
    return {
      isValid: false,
      message: 'API key is required',
    }
  }

  if (!apiKey.startsWith('sk-')) {
    return {
      isValid: false,
      message: 'Invalid API key format',
      details: 'OpenAI API keys should start with "sk-"',
    }
  }

  if (apiKey.trim().length < 40) {
    return {
      isValid: false,
      message: 'API key appears to be invalid (too short)',
    }
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (response.ok) {
      return {
        isValid: true,
        message: 'OpenAI API key verified successfully',
        details: 'Connection to OpenAI API successful',
      }
    }

    if (response.status === 401) {
      const data = await response.json()
      return {
        isValid: false,
        message: 'Invalid API key',
        details: data.error?.message || 'The API key is incorrect or has been revoked',
      }
    }

    if (response.status === 429) {
      return {
        isValid: false,
        message: 'Rate limit exceeded',
        details: 'Too many requests. Please try again later.',
      }
    }

    return {
      isValid: false,
      message: `Validation failed (${response.status})`,
      details: response.statusText,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function validateMapboxToken(token: string): Promise<APIValidationResult> {
  if (!token) {
    return {
      isValid: false,
      message: 'Token is required',
    }
  }

  if (token.trim().length < 20) {
    return {
      isValid: false,
      message: 'Token appears to be invalid (too short)',
    }
  }

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/London.json?access_token=${token}&limit=1`
    )

    if (response.ok) {
      return {
        isValid: true,
        message: 'Mapbox token verified successfully',
        details: 'Connection to Mapbox API successful',
      }
    }

    if (response.status === 401) {
      return {
        isValid: false,
        message: 'Invalid token',
        details: 'The Mapbox token is incorrect or has been revoked',
      }
    }

    return {
      isValid: false,
      message: `Validation failed (${response.status})`,
      details: response.statusText,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function validateAviationStackKey(apiKey: string): Promise<APIValidationResult> {
  if (!apiKey) {
    return {
      isValid: false,
      message: 'API key is required',
    }
  }

  if (apiKey.trim().length < 20) {
    return {
      isValid: false,
      message: 'API key appears to be invalid (too short)',
    }
  }

  try {
    const response = await fetch(
      `http://api.aviationstack.com/v1/airlines?access_key=${apiKey}&limit=1`
    )

    if (response.ok) {
      const data = await response.json()
      if (data.error) {
        return {
          isValid: false,
          message: 'Invalid API key',
          details: data.error.info || 'The API key is incorrect',
        }
      }
      return {
        isValid: true,
        message: 'AviationStack API key verified successfully',
        details: 'Connection to AviationStack API successful',
      }
    }

    return {
      isValid: false,
      message: `Validation failed (${response.status})`,
      details: response.statusText,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function validateYelpKey(apiKey: string): Promise<APIValidationResult> {
  if (!apiKey) {
    return {
      isValid: false,
      message: 'API key is required',
    }
  }

  if (apiKey.trim().length < 40) {
    return {
      isValid: false,
      message: 'API key appears to be invalid (too short)',
    }
  }

  try {
    const response = await fetch(
      'https://api.yelp.com/v3/businesses/search?location=London&limit=1',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    )

    if (response.ok) {
      return {
        isValid: true,
        message: 'Yelp API key verified successfully',
        details: 'Connection to Yelp API successful',
      }
    }

    if (response.status === 401 || response.status === 400) {
      return {
        isValid: false,
        message: 'Invalid API key',
        details: 'The Yelp API key is incorrect',
      }
    }

    return {
      isValid: false,
      message: `Validation failed (${response.status})`,
      details: response.statusText,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function validateTicketmasterKey(apiKey: string): Promise<APIValidationResult> {
  if (!apiKey) {
    return {
      isValid: false,
      message: 'API key is required',
    }
  }

  if (apiKey.trim().length < 20) {
    return {
      isValid: false,
      message: 'API key appears to be invalid (too short)',
    }
  }

  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&size=1`
    )

    if (response.ok) {
      return {
        isValid: true,
        message: 'Ticketmaster API key verified successfully',
        details: 'Connection to Ticketmaster API successful',
      }
    }

    if (response.status === 401) {
      return {
        isValid: false,
        message: 'Invalid API key',
        details: 'The Ticketmaster API key is incorrect',
      }
    }

    return {
      isValid: false,
      message: `Validation failed (${response.status})`,
      details: response.statusText,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function validateGoogleMapsKey(apiKey: string): Promise<APIValidationResult> {
  if (!apiKey) {
    return {
      isValid: false,
      message: 'API key is required',
    }
  }

  if (apiKey.trim().length < 30) {
    return {
      isValid: false,
      message: 'API key appears to be invalid (too short)',
    }
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=London&key=${apiKey}`
    )

    if (response.ok) {
      const data = await response.json()
      if (data.status === 'OK') {
        return {
          isValid: true,
          message: 'Google Maps API key verified successfully',
          details: 'Connection to Google Maps API successful',
        }
      } else if (data.status === 'REQUEST_DENIED') {
        return {
          isValid: false,
          message: 'Invalid API key or API not enabled',
          details: data.error_message || 'Check your API key and ensure Geocoding API is enabled',
        }
      }
    }

    return {
      isValid: false,
      message: `Validation failed (${response.status})`,
      details: response.statusText,
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function testAllConnections(apiKeys: APIKeys): Promise<{
  amadeus: APIValidationResult | null
  openweather: APIValidationResult | null
  airbnb: APIValidationResult | null
  openai: APIValidationResult | null
  mapbox: APIValidationResult | null
  aviationstack: APIValidationResult | null
  yelp: APIValidationResult | null
  ticketmaster: APIValidationResult | null
  googlemaps: APIValidationResult | null
}> {
  const results = {
    amadeus: null as APIValidationResult | null,
    openweather: null as APIValidationResult | null,
    airbnb: null as APIValidationResult | null,
    openai: null as APIValidationResult | null,
    mapbox: null as APIValidationResult | null,
    aviationstack: null as APIValidationResult | null,
    yelp: null as APIValidationResult | null,
    ticketmaster: null as APIValidationResult | null,
    googlemaps: null as APIValidationResult | null,
  }

  if (apiKeys.amadeus_api_key && apiKeys.amadeus_api_secret) {
    results.amadeus = await validateAmadeusCredentials(
      apiKeys.amadeus_api_key,
      apiKeys.amadeus_api_secret
    )
  }

  if (apiKeys.openweather_api_key) {
    results.openweather = await validateOpenWeatherKey(apiKeys.openweather_api_key)
  }

  if (apiKeys.airbnb_api_key) {
    results.airbnb = await validateAirbnbKey(apiKeys.airbnb_api_key)
  }

  if (apiKeys.openai_api_key) {
    results.openai = await validateOpenAIKey(apiKeys.openai_api_key)
  }

  if (apiKeys.mapbox_token) {
    results.mapbox = await validateMapboxToken(apiKeys.mapbox_token)
  }

  if (apiKeys.aviationstack_key) {
    results.aviationstack = await validateAviationStackKey(apiKeys.aviationstack_key)
  }

  if (apiKeys.yelp_key) {
    results.yelp = await validateYelpKey(apiKeys.yelp_key)
  }

  if (apiKeys.ticketmaster_key) {
    results.ticketmaster = await validateTicketmasterKey(apiKeys.ticketmaster_key)
  }

  if (apiKeys.google_maps_key) {
    results.googlemaps = await validateGoogleMapsKey(apiKeys.google_maps_key)
  }

  return results
}
