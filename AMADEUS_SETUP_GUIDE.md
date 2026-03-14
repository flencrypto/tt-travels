# Amadeus API Configuration Guide

This guide will help you configure Amadeus API credentials to enable real flight and hotel searches in TT Travels.

Amadeus for Develop

- A free Amadeus for Developers account



   - Email address
   - Company/Organization (ca

## Step 2: Create an App

3. Fill in the app details:
2. Click **Sign Up** in the top right corner
3. Fill in your details:
   - Email address
   - Password
   - Company/Organization (can be "Personal" or "Individual")
   - Accept terms and conditions
4. Verify your email address by clicking the link sent to your inbox

## Step 2: Create an App

1. Log in to your [Amadeus Dashboard](https://developers.amadeus.com/my-apps)
2. Click **Create New App**
3. Fill in the app details:
   - **App Name**: `TT Travels` (or any name you prefer)
   - **App Description**: `Travel planning and booking application`
   - **Callback URL**: Can be left as default or use `http://localhost`
3. **Important**: C

### Option A: Via Settings Page (Re

3. Scroll down to the **API Keys** section

5. Find the **Amadeus API Secret** fie
   - Click the eye icon to verify it's correct
   - This validates your credentials with Amadeus
7. 
### Option B: Via Environment Variables (Alte
If you prefer to use environment variables:
1. Open the `.env.local` file in the project root

   VITE_AMADEUS_API_SECRET=your_api_secret_here





   - **Destination**: LAX (Los
   - **Adults**: 1
4. You should see a list of available flig
If you see results, congratulations! Y
## Understanding Test v
### Test Environment (Default & Free)
- **URL**: `https://test.api.amadeus.com`
- **Data**: Realistic test
- **Best For**: Getting started, learning the 
TT Travels is configured to use the **test environment** 
### Production Environment (Paid)
- **URL**: `https://api.amadeus.com`
7. Click **Save API Keys** at the bottom

### Option B: Via Environment Variables (Alternative)

If you prefer to use environment variables:

1. Open the `.env.local` file in the project root
2. Add or update these lines:
   ```
   VITE_AMADEUS_API_KEY=your_api_key_here
   VITE_AMADEUS_API_SECRET=your_api_secret_here
   ```
3. Save the file
4. Restart the development server

**Note**: Settings page credentials (Option A) take precedence over environment variables.

## Step 5: Test the Integration

1. Navigate to the **Bookings** page in TT Travels
2. Try searching for flights:
   - **Origin**: JFK (New York)
   - **Destination**: LAX (Los Angeles)
   - **Departure Date**: Tomorrow's date
   - **Adults**: 1
3. Click **Search Flights**
4. You should see a list of available flights with prices

If you see results, congratulations! Your Amadeus API is configured correctly.

## Understanding Test vs. Production Environment

### Test Environment (Default & Free)

- **URL**: `https://test.api.amadeus.com`
- **Cost**: Free (unlimited requests)
- **Data**: Realistic test data, not real bookings
- **Use Case**: Development, testing, demos
- **Best For**: Getting started, learning the API

TT Travels is configured to use the **test environment** by default.

### Production Environment (Paid)

- **URL**: `https://api.amadeus.com`
- **Cost**: Pay-per-request pricing
- **Data**: Real-time flight and hotel data
- **Use Case**: Live applications with real users
- **Best For**: Production deployments

To switch to production (not recommended for testing):
1. Update the API URLs in the code from `test.api.amadeus.com` to `api.amadeus.com`
2. Request production credentials from Amadeus dashboard
3. Monitor your usage to avoid unexpected charges

## Troubleshooting

### "Amadeus API credentials are not configured"

**Solution**: 
- Make sure you've entered both API Key and API Secret
- Click the **Test** button to verify credentials
- Click **Save API Keys**

### "Invalid credentials" error

**Causes**:
- API Key or Secret contains typos
- Extra spaces before/after the credentials
- Using production credentials with test environment (or vice versa)

**Solution**:
- Copy credentials directly from Amadeus dashboard
- Use the eye icon to verify no extra characters
- Make sure you're using test environment credentials

### "Authentication failed" error

**Causes**:
- Network connectivity issues
- Amadeus API is temporarily unavailable
- Rate limiting (unlikely in test environment)

**Solution**:
- Check your internet connection
- Wait a few minutes and try again
- Check [Amadeus Status Page](https://status.amadeus.com/)

### No results found

**Causes**:
- Invalid IATA airport codes (e.g., "NYC" instead of "JFK")
- Search dates in the past
- No flights available for the route in test data

**Solution**:
- Use valid 3-letter IATA codes (JFK, LAX, LHR, CDG, etc.)
- Try popular routes: JFK→LAX, LHR→CDG, SYD→MEL
- Ensure dates are in the future
- In test environment, some routes may have limited data

## Features Enabled by Amadeus API

Once configured, you'll have access to:

### Flight Search ✈️
- Real-time flight availability
- Multiple airlines and routes
- Price comparison across dates
- Direct and connecting flights
- Flight duration and stops information
- Airline and aircraft details

### Hotel Search 🏨
- Hotel availability by city
- Room types and pricing
- Check-in/check-out date ranges
- Guest capacity information
- Hotel ratings and amenities
- Multiple room rate options

### Trip Management
- Save flights to trips
- Save hotels to trips
- Compare prices across different dates
- Track saved accommodations
- Build complete itineraries

## API Rate Limits

### Test Environment
- **Rate Limit**: None (unlimited)
- **Quota**: Unlimited requests per month
- **Best Practice**: Still be reasonable with requests

### Production Environment
- **Rate Limit**: 10 requests per second (default)
- **Quota**: Depends on your pricing plan
- **Monitoring**: Check usage in Amadeus dashboard

## Data Privacy & Security

### Where Are Credentials Stored?

**Settings Page (Option A)**:
- Stored in browser's local key-value storage
- Never sent to TT Travels servers
- Only transmitted directly to Amadeus API
- Cleared when you clear browser data
- Can be exported/imported as JSON backup

**Environment Variables (Option B)**:
- Stored in `.env.local` file on your computer
- Never committed to version control (in `.gitignore`)
- Loaded at application startup
- More secure for development

### Security Best Practices

✅ **Do**:
- Keep your API credentials secret
- Use test environment for development
- Monitor your API usage regularly
- Rotate credentials if compromised
- Use export feature to backup credentials

❌ **Don't**:
- Share credentials publicly
- Commit credentials to Git repositories
- Use production credentials for testing
- Expose credentials in screenshots or logs

## Cost & Billing

### Test Environment
- **Cost**: $0 (completely free)
- **Billing**: Not required
- **Credit Card**: Not needed

### Production Environment
- **Cost**: Variable (pay-per-request)
- **Flight Offers**: ~$0.35 per search
- **Hotel Search**: ~$0.35 per search
- **Billing**: Monthly invoice
- **Free Tier**: Some APIs have free quotas

See [Amadeus Pricing](https://developers.amadeus.com/pricing) for current rates.

## Additional Resources

- **Official Documentation**: https://developers.amadeus.com/docs
- **API Reference**: https://developers.amadeus.com/self-service







































