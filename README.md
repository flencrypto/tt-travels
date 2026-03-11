# TT Travels - AI-Powered Travel Planning Platform

Your comprehensive AI travel command center for planning trips, booking flights and hotels, discovering destinations, and organizing your adventures — all in one beautiful platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Authentication (Required)
This app uses Clerk for authentication. Follow the simple 5-minute setup:

👉 **[View CLERK_SETUP.md](./CLERK_SETUP.md)** for step-by-step instructions

**TL;DR:**
1. Create free Clerk account at [clerk.com](https://clerk.com)
2. Copy your Publishable Key
3. Add it to `.env.local`:
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
   ```
4. Restart dev server

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` and sign in to start planning! 🎉

## ✨ Features

- 🤖 **AI Trip Planner** - Generate personalized itineraries with smart packing lists
- ✈️ **Flight & Hotel Search** - Real-time booking with price comparison
- 🌍 **Destination Explorer** - Discover places with weather and local recommendations  
- 📅 **Trip Manager** - Organize all your travels in one place
- 📸 **Travel Journal** - Capture and preserve your memories
- ⚙️ **Settings** - Personalize your experience
- 🔐 **Secure Authentication** - Powered by Clerk

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Icons**: Phosphor Icons
- **Authentication**: Clerk
- **AI**: Spark Runtime LLM API (GPT-4o)
- **Storage**: Spark KV (persistent key-value store)
- **APIs**: Amadeus Travel API, Open-Meteo Weather, OpenStreetMap

## 📖 Documentation

- 📋 [PRD.md](./PRD.md) - Product requirements and feature specifications
- 🔐 [CLERK_SETUP.md](./CLERK_SETUP.md) - Complete authentication setup guide with OAuth
- 🐛 [QUICK_DEBUG.md](./QUICK_DEBUG.md) - **START HERE** for troubleshooting
- ✅ [DEBUG_CHECKLIST.md](./DEBUG_CHECKLIST.md) - Comprehensive debugging guide
- 🔒 [SECURITY.md](./SECURITY.md) - Security policies and guidelines

## 🎨 Design Philosophy

TT Travels features a distinctive design with:
- **Typography**: Space Grotesk (headings) + Inter (body)
- **Color Palette**: Vibrant purples and warm oranges with glass morphism effects
- **Interactions**: Smooth animations with Framer Motion
- **Accessibility**: WCAG AA compliant with keyboard navigation

## 🧪 Development

### Project Structure
```
src/
├── components/     # React components (UI + feature components)
├── hooks/          # Custom React hooks
├── lib/            # Utilities and API integrations
├── pages/          # Route-based page components
└── styles/         # CSS and theme files
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🐛 Troubleshooting

**Having issues?** → Start with [QUICK_DEBUG.md](./QUICK_DEBUG.md) for immediate help!

### Common Quick Fixes

#### Authentication Not Working
1. Verify Clerk key in `.env.local` starts with `pk_test_`
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Hard refresh browser: `Ctrl+Shift+R`
4. See [CLERK_SETUP.md](./CLERK_SETUP.md#-troubleshooting-common-issues) for detailed solutions

#### OAuth Providers Missing (Google/GitHub)
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate: User & Authentication → Social Connections
3. Toggle Google and/or GitHub to ON
4. Click Save and wait 60 seconds
5. Refresh your app

#### Environment Variables Not Loading
- Ensure variables start with `VITE_` prefix
- File must be named `.env.local` in project root
- **Restart dev server** after any changes to `.env.local`
- Clear browser cache if issues persist

### Detailed Debugging Guides

- **[QUICK_DEBUG.md](./QUICK_DEBUG.md)** - 5-minute quick fixes for common issues
- **[DEBUG_CHECKLIST.md](./DEBUG_CHECKLIST.md)** - Comprehensive checklist for all features
- **[CLERK_SETUP.md](./CLERK_SETUP.md)** - Complete auth setup with troubleshooting

**90% of issues are fixed by:**
1. Checking browser console (F12) for errors
2. Restarting the dev server
3. Verifying Clerk key in `.env.local`
4. Hard refreshing the browser

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
