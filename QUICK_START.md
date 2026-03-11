# 🚀 Quick Start - Get Your App Running in 5 Minutes

## What You Need

You mentioned having Clerk keys from earlier in the conversation. Here's what you need to configure to get TT Travels fully operational:

### 1. **Clerk Publishable Key** (Required for Authentication)
Your Clerk Publishable Key from: https://dashboard.clerk.com/~/api-keys

The key should look like: `pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX`

**Add it to `.env.local`:**
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
```

### 2. **Google OAuth** (Optional - Already Configured in Clerk)
You mentioned having this Google OAuth Client ID from earlier:
```
797538028420-bplucd4ukqvcha1spf4iekps4p4llca7.apps.googleusercontent.com
```

**⚠️ Important:** This gets configured in your **Clerk Dashboard**, NOT in `.env.local`!

**To enable Google OAuth:**
1. Go to Clerk Dashboard → User & Authentication → Social Connections
2. Find Google → Toggle ON
3. Choose "Use custom credentials"
4. Paste your Google OAuth Client ID
5. Save changes

### 3. **OpenAI API Key** (Optional - For AI Features)
Get from: https://platform.openai.com/api-keys

**Two ways to configure:**
- **Option A**: Add to `.env.local` as default:
  ```bash
  VITE_OPENAI_API_KEY=sk-proj-XXXXXXXXXXXX
  ```
- **Option B**: Users can add it in Settings page (stored locally per user)

### 4. **Other API Keys** (All Optional)
These can be configured by users in the Settings page:

- **Amadeus Travel API** (for flights/hotels): https://developers.amadeus.com/
- **OpenWeather API** (for weather): https://openweathermap.org/api
- **Airbnb API** (for accommodations): Currently using unofficial API

## ⚡ Setup Steps

### Step 1: Add Your Clerk Key
```bash
# Edit .env.local file and replace the placeholder:
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
```

### Step 2: Restart the Dev Server
```bash
# Press Ctrl+C to stop, then:
npm run dev
```

### Step 3: Test Authentication
1. Open http://localhost:5173
2. Click "Sign Up" or "Sign In"
3. You should see the Clerk modal with:
   - Continue with Google (if configured)
   - Continue with GitHub (if configured)
   - Continue with email

### Step 4: Configure OAuth Providers (Optional)
In your Clerk Dashboard:
1. Go to User & Authentication → Social Connections
2. Enable Google:
   - Toggle ON
   - Add your Google OAuth Client ID: `797538028420-bplucd4ukqvcha1spf4iekps4p4llca7.apps.googleusercontent.com`
   - Save
3. Enable GitHub (optional):
   - Toggle ON
   - Use Clerk's dev keys or add your own
   - Save

### Step 5: Configure API Keys (Optional)
After signing in:
1. Go to Settings page
2. Add any API keys you have:
   - OpenAI (for AI trip planning)
   - Amadeus (for flight/hotel search)
   - OpenWeather (for weather data)
3. Click "Test" to verify each key
4. Click "Save API Keys"

## ✅ Verification Checklist

Your app is working if:
- ✅ Clerk modal opens when you click Sign In/Sign Up
- ✅ You can sign in with email or OAuth providers
- ✅ After signing in, you see your profile picture in the nav
- ✅ You're redirected to Dashboard after sign-in
- ✅ Theme toggle works (moon/sun icon)
- ✅ You can navigate to all pages

## 🎯 Current Status

Based on your `.env.local` file:
- ❌ Clerk: Using placeholder key → **Needs your real key**
- ❌ OpenAI: Empty → **Optional, can add later**

## 🔑 Where to Find Your Keys

### Clerk Publishable Key
1. Go to https://dashboard.clerk.com/
2. Select your application
3. Click "API Keys" in sidebar
4. Copy the "Publishable Key" (starts with `pk_test_`)

### Google OAuth Setup (in Clerk Dashboard)
1. In Clerk Dashboard → Social Connections → Google
2. Toggle ON
3. Choose:
   - "Use Clerk's development keys" (quick testing)
   - OR "Use custom credentials" (your Google OAuth ID)
4. If using custom:
   - Paste: `797538028420-bplucd4ukqvcha1spf4iekps4p4llca7.apps.googleusercontent.com`
   - Add Client Secret from Google Cloud Console
5. Save

## 📚 Full Documentation

- **Clerk Setup**: See `CLERK_SETUP.md` for detailed authentication setup
- **PRD**: See `PRD.md` for complete product requirements and features
- **API Keys**: All API key management is in the Settings page (in-app)

## 🐛 Quick Troubleshooting

**Clerk modal not opening?**
- Verify your key in `.env.local` starts with `pk_test_`
- Make sure you restarted the dev server
- Check browser console for errors

**OAuth providers not showing?**
- Enable them in Clerk Dashboard → Social Connections
- Wait 30-60 seconds after enabling
- Hard refresh browser (Ctrl+Shift+R)

**API features not working?**
- Sign in first
- Go to Settings page
- Add the relevant API keys
- Click "Test" to verify
- Click "Save"

## 🎨 What's Already Working

Even without API keys, you can:
- ✅ Sign up and sign in (with Clerk key)
- ✅ Navigate all pages
- ✅ Toggle dark mode
- ✅ Use the beautiful UI
- ✅ Manage favorites
- ✅ Create trips
- ✅ Upload journal photos
- ✅ Explore the interface

With API keys, you unlock:
- 🔑 OpenAI → AI trip planning and recommendations
- 🔑 Amadeus → Real-time flight and hotel search
- 🔑 OpenWeather → Weather data and forecasts
- 🔑 Airbnb → Accommodation search

## 📞 Need Help?

Refer to detailed documentation:
- `CLERK_SETUP.md` - Complete Clerk authentication guide
- `PRD.md` - Full feature documentation
- `README.md` - General project overview

---

**Pro Tip:** Start with just the Clerk key to get authentication working, then add other API keys as needed in the Settings page!
