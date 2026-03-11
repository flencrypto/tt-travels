# OpenAI API Configuration for TT Travels

## Overview

TT Travels uses OpenAI's GPT-4o model to power AI-driven features including trip itinerary generation, packing list creation, destination recommendations, and weather-based activity suggestions. The OpenAI API key can be configured directly in the Settings page for validation and management purposes.

## Important Note About AI Features

**TT Travels runs on the Spark runtime, which provides built-in AI capabilities through the `spark.llm()` API.** This means:

- ✅ AI features work out-of-the-box using Spark's integrated LLM
- ✅ No manual OpenAI API key is required for core functionality
- ✅ The Settings page API key configuration is primarily for validation and user awareness
- ✅ All AI generation uses the Spark runtime's `gpt-4o` model

## Configuring OpenAI API Key in Settings

### Step 1: Get Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy your API key (format: `sk-...`)
6. **Important**: Save it securely - you won't be able to see it again

### Step 2: Configure in TT Travels Settings

1. Navigate to **Settings** page in TT Travels
2. Scroll to the **API Keys** section
3. Find the **OpenAI API Key** field
4. Paste your API key (starting with `sk-`)
5. Click the **eye icon** to toggle visibility if needed
6. Click **Test** to validate the connection
7. Click **Save API Keys** to persist locally

### Step 3: Validation

The test function will:
- ✅ Verify the key format (must start with `sk-`)
- ✅ Check key length (minimum 40 characters)
- ✅ Test connection to OpenAI's `/v1/models` endpoint
- ✅ Display validation status with detailed feedback

**Validation Results:**
- 🟢 **Verified** - API key is valid and connection successful
- 🔴 **Failed** - Invalid key, revoked key, or connection error

## Features Powered by AI

### 1. AI Trip Planner - Itinerary Generation
**Location**: AI Planner page → Create Itinerary tab

Generates comprehensive, personalized travel itineraries based on:
- Destination
- Trip duration (1-14 days)
- Travel style (adventure, relaxation, culture, food, etc.)
- Budget level (budget, moderate, luxury)
- Group type (solo, couple, family, friends)
- Travel pace (relaxed, moderate, packed)

**Output includes**:
- Day-by-day detailed schedules
- Morning, afternoon, evening activities
- Restaurant recommendations with prices
- Insider tips and local secrets
- Transportation guidance
- Cultural etiquette advice

### 2. AI-Powered Packing Lists
**Location**: AI Planner page → Generate Packing List button

Creates weather-based packing lists with:
- Current weather conditions from Open-Meteo
- Climate-appropriate clothing suggestions
- Weather-specific items with explanations
- Category organization (Essentials, Clothing, Weather Protection, etc.)
- Practical recommendations for travel style

**Special Features**:
- 🌦️ Weather-based items marked with badges
- 📝 Explanations for each weather-specific item
- ✅ Checkbox tracking for packing progress

### 3. Smart Destination Discovery
**Location**: AI Planner page → Discover Destinations tab

AI-powered recommendations matching your preferences:
- Multiple interest selection (12 categories)
- Budget and travel style preferences
- Climate preferences
- Trip duration consideration

**Each recommendation includes**:
- Destination name and country
- Compelling description
- Best activities/experiences
- Seasonal information
- Budget estimates
- Must-see highlights
- Practical travel tips

### 4. Weather-Based Activity Recommendations
**Location**: Explore page → Activity Recommendations section

Generates 6-8 activity suggestions based on:
- Current weather conditions
- Real-time temperature
- Destination characteristics
- Activity categories

**Features**:
- Suitability ratings (excellent/good/fair)
- Weather-specific reasoning
- Practical tips for each activity
- Diverse category mix

### 5. Geo-Local Recommendations
**Location**: Explore page → Things to Do / Places to Eat tabs

AI-powered local discovery with:
- Mainstream popular attractions
- Off-the-beaten-track hidden gems
- Specific restaurant recommendations
- Neighborhood information
- Price ranges and best times

## API Key Storage & Privacy

### Local Storage Only
- 🔒 **All API keys stored locally** using Spark's KV store
- 🔒 **Never sent to TT Travels servers**
- 🔒 **Only sent to respective service providers** (OpenAI, Amadeus, etc.)
- 🔒 **Masked by default** with show/hide toggle

### Storage Location
```typescript
// Stored in Spark KV with key:
'tt-travels-api-keys'

// Structure:
{
  openai_api_key?: string
  amadeus_api_key?: string
  amadeus_api_secret?: string
  openweather_api_key?: string
  airbnb_api_key?: string
}
```

## Troubleshooting

### "Invalid API key format"
- **Cause**: Key doesn't start with `sk-`
- **Solution**: Verify you copied the correct OpenAI API key

### "API key appears to be invalid (too short)"
- **Cause**: Incomplete key or wrong value
- **Solution**: Ensure the entire key was copied (40+ characters)

### "Invalid API key" after validation
- **Cause**: Key has been revoked or is incorrect
- **Solution**: Generate a new key from OpenAI dashboard

### "Rate limit exceeded"
- **Cause**: Too many API requests in short time
- **Solution**: Wait a few minutes and try again

### "Connection failed"
- **Cause**: Network issues or CORS restrictions
- **Solution**: Check internet connection, try again later

## API Usage & Costs

### OpenAI Pricing
- GPT-4o model pricing applies
- Cost per token varies by model version
- Monitor usage in [OpenAI Dashboard](https://platform.openai.com/usage)

### Estimated Costs (as of 2024)
- **Itinerary generation**: ~$0.10-0.30 per comprehensive itinerary
- **Packing list**: ~$0.02-0.05 per list
- **Destination recommendations**: ~$0.05-0.10 per 5 destinations
- **Activity recommendations**: ~$0.03-0.08 per 6-8 activities

*Note: Actual costs depend on OpenAI's current pricing*

### Cost Control Tips
1. Use "Test All" button sparingly (tests all APIs)
2. Avoid generating multiple itineraries in quick succession
3. Set up billing alerts in OpenAI dashboard
4. Monitor usage regularly

## Additional API Keys

TT Travels also supports configuration for:

### Amadeus for Developers
- **Purpose**: Flight and hotel search
- **Setup**: Requires API Key + API Secret
- **Endpoint**: `https://test.api.amadeus.com`
- **Free Tier**: Available with test data

### OpenWeather
- **Purpose**: Weather data and activity recommendations
- **Setup**: Single API key
- **Endpoint**: `https://api.openweathermap.org`
- **Free Tier**: 1,000 calls/day

### Airbnb
- **Purpose**: Accommodation search
- **Setup**: API key (validation only)
- **Note**: Limited validation available

## Support & Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [Spark Runtime Documentation](https://github.com/github/spark)
- TT Travels Settings Page: `/settings`
- TT Travels Setup Guide: `/setup`

## Security Best Practices

1. ✅ Never share your API keys
2. ✅ Rotate keys periodically
3. ✅ Set up usage limits in OpenAI dashboard
4. ✅ Monitor for unusual activity
5. ✅ Use environment-specific keys (dev/prod)
6. ✅ Revoke compromised keys immediately

---

**Last Updated**: 2024
**TT Travels Version**: 1.0
**Spark Runtime**: Latest
