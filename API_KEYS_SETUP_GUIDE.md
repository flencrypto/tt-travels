# API Keys Setup Guide

This guide will help you obtain and configure API keys for all TT Travels features. All API keys are stored locally in your browser for security.

## Table of Contents
1. [Required APIs](#required-apis)
2. [Optional APIs](#optional-apis)
3. [How to Configure](#how-to-configure)

---

## Required APIs

### 1. OpenAI API Key
**Purpose**: AI-powered trip planning, itinerary generation, packing lists, and destination recommendations

**How to Get**:
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Store it securely - you won't be able to see it again

**Format**: `sk-...` (begins with sk-)

**Cost**: Pay-as-you-go. See [OpenAI Pricing](https://openai.com/pricing)

**Features Unlocked**:
- AI Trip Planner with customizable options
- Smart destination recommendations
- Weather-based packing lists
- Local recommendations (things to do, places to eat)

---

### 2. Amadeus API Credentials
**Purpose**: Flight and hotel search functionality

**How to Get**:
1. Visit [Amadeus for Developers](https://developers.amadeus.com/)
2. Create a free account
3. Create a new app in the [My Apps](https://developers.amadeus.com/my-apps) section
4. Get your **API Key** and **API Secret**
5. Start with the **Test environment** (free)

**Format**: 
- API Key: alphanumeric string
- API Secret: alphanumeric string

**Cost**: Free tier available (test environment). See [Amadeus Pricing](https://developers.amadeus.com/pricing)

**Features Unlocked**:
- Real-time flight search
- Hotel availability and pricing
- Price comparison across dates
- Save flights and hotels to trips

---

## Optional APIs

### 3. OpenWeather API Key
**Purpose**: Enhanced weather data and forecasts

**How to Get**:
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to [API Keys](https://home.openweathermap.org/api_keys)
4. Copy your default API key or create a new one
5. Wait ~2 hours for activation

**Format**: 32-character hexadecimal string

**Cost**: Free tier (60 calls/minute). See [OpenWeather Pricing](https://openweathermap.org/price)

**Features Unlocked**:
- Detailed weather forecasts
- Historical weather data
- Weather alerts

**Note**: Basic weather still works without this key using Open-Meteo free service.

---

### 4. Mapbox Access Token
**Purpose**: Enhanced mapping features and geocoding

**How to Get**:
1. Visit [Mapbox](https://www.mapbox.com/)
2. Sign up for a free account
3. Go to your [Account page](https://account.mapbox.com/)
4. Copy your default public token or create a new one

**Format**: Starts with `pk.`

**Cost**: Free tier (50,000 requests/month). See [Mapbox Pricing](https://www.mapbox.com/pricing)

**Features Unlocked**:
- Interactive maps with custom styling
- Advanced geocoding
- Route visualization
- Location autocomplete

---

### 5. Google Maps API Key
**Purpose**: Places API, geocoding, and enhanced map features

**How to Get**:
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
5. Create an API key
6. Restrict the key to your domain (recommended)

**Format**: 39-character string

**Cost**: Free tier ($200 credit/month). See [Google Maps Pricing](https://mapsplatform.google.com/pricing/)

**Features Unlocked**:
- "View on Maps" functionality
- Place details and photos
- Enhanced geocoding
- Street view integration

---

### 6. Yelp API Key
**Purpose**: Local business recommendations and reviews

**How to Get**:
1. Visit [Yelp Fusion](https://www.yelp.com/developers)
2. Sign up or log in
3. Create an app in the [Manage App](https://www.yelp.com/developers/v3/manage_app) section
4. Copy your API Key

**Format**: Long alphanumeric string

**Cost**: Free (5,000 calls/day limit). See [Yelp API](https://www.yelp.com/developers/faq)

**Features Unlocked**:
- Restaurant recommendations with ratings
- Local business information
- Reviews and photos
- Business hours and contact info

---

### 7. Ticketmaster API Key
**Purpose**: Events, concerts, and entertainment recommendations

**How to Get**:
1. Visit [Ticketmaster Developer Portal](https://developer.ticketmaster.com/)
2. Create a free account
3. Get your API key from the dashboard

**Format**: 32-character string

**Cost**: Free tier (5,000 API calls/day). See [Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)

**Features Unlocked**:
- Event listings and schedules
- Concert and show information
- Sports events
- Ticket availability

---

### 8. AviationStack API Key
**Purpose**: Real-time flight tracking and airline information

**How to Get**:
1. Visit [AviationStack](https://aviationstack.com/)
2. Sign up for a free account
3. Copy your API key from the dashboard

**Format**: 32-character string

**Cost**: Free tier (500 requests/month). See [AviationStack Pricing](https://aviationstack.com/product)

**Features Unlocked**:
- Real-time flight tracking
- Flight status updates
- Airline information
- Airport data

---

### 9. Airbnb API Key
**Purpose**: Vacation rental search (unofficial API)

**How to Get**:
Note: Airbnb does not offer an official public API. You may need to use third-party services like:
- [RapidAPI Airbnb](https://rapidapi.com/3b-data-3b-data-default/api/airbnb13)
- Custom scraping solutions (check terms of service)

**Format**: Varies by provider

**Cost**: Varies by provider

**Features Unlocked**:
- Airbnb property search
- Availability checking
- Pricing information

**Note**: This is currently a placeholder. Full integration requires a third-party service.

---

## How to Configure

### Step 1: Access Settings
1. Navigate to the **Settings** page in TT Travels
2. Scroll down to the **API Keys** section

### Step 2: Enter Your Keys
1. Paste each API key into the corresponding field
2. Use the eye icon to show/hide sensitive keys
3. Click **Test** next to each key to verify it works

### Step 3: Test Connections
- Test individual keys with the **Test** button
- Or use **Test All** to validate all configured keys at once
- Green checkmark = Verified ✓
- Red X = Failed ✗

### Step 4: Save
1. Click **Save API Keys** at the bottom
2. Your keys are stored locally in your browser
3. They are never sent to TT Travels servers

---

## Security & Privacy

✅ **Local Storage Only**: All API keys are stored in your browser using Spark's KV storage  
✅ **No Server Upload**: Keys are never transmitted to TT Travels servers  
✅ **Direct API Calls**: Your browser calls APIs directly with your keys  
✅ **Encrypted Storage**: Browser storage is protected by same-origin policy  
✅ **You Control Access**: Clear browser data to remove keys  

⚠️ **Important Security Tips**:
- Never share your API keys publicly
- Use API key restrictions when available (domain, IP)
- Monitor your API usage on provider dashboards
- Rotate keys if you suspect compromise
- Use free tiers to start and upgrade as needed

---

## Troubleshooting

### Key Not Validating
1. **Check Format**: Ensure no extra spaces or characters
2. **Wait for Activation**: Some keys take time to activate (OpenWeather: ~2 hours)
3. **Verify Permissions**: Check that required APIs are enabled (Google Cloud)
4. **Check Billing**: Some APIs require billing info even on free tier
5. **API Limits**: Ensure you haven't exceeded free tier limits

### Features Not Working
1. **Test Connection**: Use the Test button to verify key validity
2. **Check Browser Console**: Look for error messages
3. **Clear Cache**: Sometimes browser cache causes issues
4. **Try Different Key**: Create a new key on the provider's dashboard

### CORS Errors
Some APIs may have CORS restrictions. If you encounter these:
- Check API documentation for workarounds
- Ensure you're using the correct endpoint (some have different URLs for browser use)
- Consider using a proxy service if allowed by terms of service

---

## Quick Start Recommendations

**Minimum Setup** (Free):
- ✅ OpenAI API Key - $5 credit to start
- ✅ Amadeus API (Test) - Free
- ⏭️ All others are optional

**Enhanced Experience** (Free):
- ✅ OpenAI API Key
- ✅ Amadeus API
- ✅ OpenWeather API
- ✅ Google Maps API
- ⏭️ Others as needed

**Full Feature Access** (Paid tiers for high usage):
- ✅ All APIs configured
- Consider paid tiers for frequent use

---

## Cost Management Tips

1. **Start Free**: Use free tiers to test features
2. **Set Budgets**: Configure spending alerts on provider dashboards
3. **Monitor Usage**: Check API usage regularly
4. **Cache Results**: The app caches some data to reduce API calls
5. **Use Wisely**: Don't spam refresh buttons

---

## Support & Resources

- **TT Travels Support**: Check the app's Settings page for status indicators
- **Provider Documentation**: Each API has detailed docs linked above
- **Community Forums**: Stack Overflow, Reddit for specific API questions
- **Rate Limits**: All providers show limits in their dashboards

---

## Last Updated
December 2024

For the most current API pricing and availability, always check the provider's official website.
