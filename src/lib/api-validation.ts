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

export async function testAllConnections(apiKeys: APIKeys): Promise<{
  amadeus: APIValidationResult | null
  openweather: APIValidationResult | null
  airbnb: APIValidationResult | null
  openai: APIValidationResult | null
}> {
  const results = {
    amadeus: null as APIValidationResult | null,
    openweather: null as APIValidationResult | null,
    airbnb: null as APIValidationResult | null,
    openai: null as APIValidationResult | null,
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

  return results
}
