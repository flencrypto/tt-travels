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

export async function testAllConnections(apiKeys: APIKeys): Promise<{
  amadeus: APIValidationResult | null
}> {
  const results = {
    amadeus: null as APIValidationResult | null,
  }

  if (apiKeys.amadeus_api_key && apiKeys.amadeus_api_secret) {
    results.amadeus = await validateAmadeusCredentials(
      apiKeys.amadeus_api_key,
      apiKeys.amadeus_api_secret
    )
  }

  return results
}
