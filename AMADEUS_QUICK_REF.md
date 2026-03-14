# 🎯 Amadeus API - Quick Reference Card

## 🚀 5-Minute Setup

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Get Account (2 min)                           │
│  → https://developers.amadeus.com/                     │
│  → Sign up → Create app → Copy credentials             │
├─────────────────────────────────────────────────────────┤
│  Step 2: Configure (1 min)                             │
│  → Settings → API Keys                                 │
│  → Paste API Key & Secret → Test → Save               │
├─────────────────────────────────────────────────────────┤
│  Step 3: Test (1 min)                                  │
│  → Bookings → Search JFK to LAX → See results ✓       │
└─────────────────────────────────────────────────────────┘
```

## 📖 Documentation Map

```
START HERE
    ↓
┌─────────────────────────────────────┐
│  QUICK_AMADEUS_SETUP.md            │  ← Best for users
│  • 5-minute checklist              │
│  • Minimal steps                   │
│  • Quick troubleshooting           │
└─────────────────────────────────────┘
    ↓ Need more details?
┌─────────────────────────────────────┐
│  AMADEUS_SETUP_GUIDE.md            │  ← Comprehensive guide
│  • Step-by-step screenshots        │
│  • Full troubleshooting            │
│  • Security & costs                │
│  • Test vs production              │
└─────────────────────────────────────┘
    ↓ Need technical info?
┌─────────────────────────────────────┐
│  AMADEUS_CONFIGURATION_SUMMARY.md  │  ← For developers
│  • Code changes explained          │
│  • Architecture details            │
│  • Testing procedures              │
└─────────────────────────────────────┘
```

## 🔑 Credential Sources (Priority Order)

```
1. SETTINGS PAGE (Browser KV Storage)    ← Checked First ✓
   └─→ User-friendly UI
   └─→ Built-in validation
   └─→ Export/import
   
2. ENVIRONMENT VARIABLES (.env.local)    ← Fallback
   └─→ VITE_AMADEUS_API_KEY
   └─→ VITE_AMADEUS_API_SECRET
```

## 🎨 User Experience Flow

```
┌──────────────────┐
│  Bookings Page   │
└────────┬─────────┘
         │
    No Config? ──────┐
         │           │
         │      ┌────▼────────────────┐
         │      │  Setup Banner       │
         │      │  • Instructions     │
         │      │  • Quick nav        │
         │      └─────────────────────┘
         │
    Has Config ──────┐
         │           │
         │      ┌────▼────────────────┐
         │      │  Search Enabled     │
         │      │  • Flights          │
         │      │  • Hotels           │
         │      │  • Price trends     │
         │      └─────────────────────┘
```

## 🧪 Quick Tests

### Test 1: Verify Credentials
```
Settings → API Keys → Test button
Expected: ✅ "Amadeus credentials verified successfully"
```

### Test 2: Search Flights
```
Bookings → Flights tab
Origin: JFK
Destination: LAX
Date: Tomorrow
Expected: List of 5-10 flights with prices
```

### Test 3: Search Hotels
```
Bookings → Hotels tab
City: PAR
Check-in: Tomorrow
Check-out: +3 days
Expected: List of hotels with room prices
```

## 🗺️ Sample Test Routes

### Flights ✈️
```
Popular Routes (Good Test Data):
• JFK → LAX  (New York → Los Angeles)
• LHR → CDG  (London → Paris)
• SYD → MEL  (Sydney → Melbourne)
• NRT → SIN  (Tokyo → Singapore)
• DXB → LHR  (Dubai → London)
```

### Hotels 🏨
```
Popular Cities (Good Test Data):
• PAR  (Paris)
• NYC  (New York)
• LON  (London)
• TOK  (Tokyo)
• SYD  (Sydney)
```

## 💰 Cost Breakdown

```
TEST ENVIRONMENT (Default):
├─ Cost: $0.00 (FREE)
├─ Limits: Unlimited
├─ Data: Realistic test data
└─ Use: Development, testing, demos

PRODUCTION ENVIRONMENT:
├─ Cost: ~$0.35 per search
├─ Limits: Based on plan
├─ Data: Real-time live data
└─ Use: Production deployments
```

## 🐛 Top 3 Issues & Fixes

```
1. "API credentials are not configured"
   Fix: Add credentials in Settings → API Keys

2. "Invalid credentials" 
   Fix: Check for typos, copy fresh from dashboard

3. "No results found"
   Fix: Use valid IATA codes (JFK, LAX, etc.)
```

## 🔒 Security Summary

```
✅ Settings: Stored in browser (localStorage)
✅ Env Vars: Stored in .env.local (gitignored)
✅ Transmission: Only to Amadeus API
✅ Servers: Never sent to TT Travels
✅ Export: JSON backup available
```

## 📞 Help Resources

```
┌─────────────────────────────────────────────┐
│  In-App Help                               │
├─────────────────────────────────────────────┤
│  • Setup Banner (Bookings page)            │
│  • Test Button (Settings page)             │
│  • Setup Modal (search without config)     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Documentation                              │
├─────────────────────────────────────────────┤
│  • QUICK_AMADEUS_SETUP.md (start here)     │
│  • AMADEUS_SETUP_GUIDE.md (detailed)       │
│  • API_KEYS_SETUP_GUIDE.md (all APIs)      │
│  • README.md (project overview)            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  External                                   │
├─────────────────────────────────────────────┤
│  • developers.amadeus.com (docs)           │
│  • developers.amadeus.com/support          │
│  • status.amadeus.com (status)             │
└─────────────────────────────────────────────┘
```

## ✅ Success Checklist

```
□ Created Amadeus account
□ Created app and got credentials
□ Added credentials to Settings
□ Clicked Test button → Green badge
□ Searched flights → Got results
□ Searched hotels → Got results
□ Saved to trip → Worked
□ Recent searches → Appeared

✓ All checked? You're ready to go! 🎉
```

## 🚀 What's Next?

```
1. ✅ Configure Amadeus (you're here!)
2. → Search and save flights/hotels
3. → Configure OpenAI for AI planning
4. → Add weather API for forecasts
5. → Explore other integrations
```

---

**Quick Links:**
- Setup: `QUICK_AMADEUS_SETUP.md`
- Details: `AMADEUS_SETUP_GUIDE.md`
- All APIs: `API_KEYS_SETUP_GUIDE.md`

**Time to Value:** 5 minutes | **Cost:** FREE (test env)
