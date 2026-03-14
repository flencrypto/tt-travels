# Quick Start: Amadeus API Setup

Get flight and hotel search working in 5 minutes! ✈️🏨

## What You'll Need
- 5 minutes
- A free Amadeus account
- Access to TT Travels Settings page

## Step 1: Create Amadeus Account (2 min)

1. Go to https://developers.amadeus.com/
2. Click **Sign Up** (top right)
3. Fill in:
   - Email
   - Password
   - Company name (can use "Personal")
4. Verify your email

## Step 2: Create an App (1 min)

1. Go to https://developers.amadeus.com/my-apps
2. Click **Create New App**
3. Enter:
   - **App Name**: `TT Travels`
   - **App Description**: `Travel booking app`
4. Click **Create**

## Step 3: Get Your Credentials (30 sec)

You'll see two values on your app page:

```
API Key:    AbCdEf123456GhIjKl789012MnOpQr34
API Secret: XyZ987abCD654efGH321ijKL098mnOP
```

**Copy both of these!** (Click the copy icon next to each)

## Step 4: Configure in TT Travels (1.5 min)

1. Open TT Travels
2. Go to **Settings** (gear icon)
3. Scroll to **API Keys** section
4. Find **Amadeus API Key** field:
   - Paste your API Key
5. Find **Amadeus API Secret** field:
   - Paste your API Secret
6. Click **Test** button (next to secret field)
   - Wait for green "Verified" badge ✓
7. Click **Save API Keys**

## Step 5: Try It Out! (30 sec)

1. Go to **Bookings** page
2. Search for a flight:
   - **Origin**: JFK
   - **Destination**: LAX
   - **Departure**: Tomorrow's date
   - **Adults**: 1
3. Click **Search Flights**
4. See results! 🎉

## ✅ You're Done!

Flight and hotel search is now enabled. The app uses Amadeus **test environment** which is:
- ✅ Completely FREE
- ✅ Unlimited searches
- ✅ Realistic test data
- ✅ No credit card needed

## Common Test Routes

Try these airport codes for reliable results:

| Route | Codes |
|-------|-------|
| New York → Los Angeles | JFK → LAX |
| London → Paris | LHR → CDG |
| Sydney → Melbourne | SYD → MEL |
| Tokyo → Singapore | NRT → SIN |
| Dubai → London | DXB → LHR |

## Troubleshooting

### "Invalid credentials" error
- Check for typos in API Key/Secret
- Make sure you copied the complete strings
- No extra spaces before/after

### No results found
- Use valid 3-letter IATA codes (JFK, LAX, etc.)
- Try the test routes listed above
- Make sure date is in the future

### Need Help?
See full guide: [AMADEUS_SETUP_GUIDE.md](./AMADEUS_SETUP_GUIDE.md)

---

**Need more features?** Check out [API_KEYS_SETUP_GUIDE.md](./API_KEYS_SETUP_GUIDE.md) for other integrations:
- OpenAI (AI trip planning)
- OpenWeather (detailed weather)
- Google Maps (enhanced maps)
- And more!
