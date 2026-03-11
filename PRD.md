# TT Travels - AI-Powered Travel Planning Platform

A comprehensive travel command center combining AI-powered itinerary generation, real-time flight and hotel booking, location exploration with weather, trip management, and personal travel journaling.

**Experience Qualities**:
1. **Confident** - Bold visual design with glass morphism and smooth navigation instills trust in the platform's AI capabilities
2. **Exploratory** - Map integration, weather data, and discovery features encourage users to dream and plan adventures
3. **Organized** - Clear structure from dashboard to detailed features helps users manage complex trip planning workflows

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)

This is a sophisticated multi-feature application with route-based navigation, external API integrations (OpenAI, Amadeus, Open-Meteo, OpenStreetMap), browser API usage (geolocation), local persistence, AI generation, real-time booking search, and multiple interconnected planning modules that work together as a unified travel platform.

## Essential Features

### Dashboard/Home Command Center
- **Functionality**: Central hub displaying brand hero, quick actions, KPI tiles, workflow steps, and feature cards
- **Purpose**: Orient users and provide fast access to all major capabilities
- **Trigger**: Default landing route (/)
- **Progression**: User lands on dashboard → views KPI metrics → selects quick action or feature card → navigates to specific module
- **Success criteria**: Users can quickly understand platform value and access any feature within 2 clicks

### Flight and Hotel Booking
- **Functionality**: Real-time search for flights and hotels using Amadeus Travel API, with ability to save favorites to trips and compare prices across multiple dates
- **Purpose**: Enable users to search and compare flight and hotel options directly within the platform, identify best pricing opportunities, and save preferred options to their trips
- **Trigger**: Navigate to Bookings page, select Flights or Hotels tab, fill search form, click search
- **Progression**: Enter search criteria (origin/destination, dates, passengers) → validate required fields → authenticate with Amadeus API → fetch real-time offers → display results with pricing and details → optionally save to trip or view price trends
- **Success criteria**: Returns up to 10 flight/hotel offers within 5 seconds, displays pricing, duration, stops, hotel ratings, allows saving to trips, proper error handling for missing API credentials or search errors

### Price Comparison Across Dates
- **Functionality**: Visual price trend analysis across 7 consecutive days for flights and hotels
- **Purpose**: Help users identify the best dates to book by comparing prices visually with charts and statistics
- **Trigger**: Navigate to Bookings page, select Price Trends tab, enter search criteria, click compare
- **Progression**: Enter search criteria (route/city, start date, passengers) → fetch prices for 7 consecutive days → display interactive bar chart → show min/avg/max statistics → highlight best deal → show day-by-day price changes with percentages
- **Success criteria**: Successfully fetches and displays prices for multiple dates, clearly identifies lowest price, shows visual comparison with color-coded bars, displays price change trends

### AI Trip Planner
- **Functionality**: Generate personalized itineraries using OpenAI based on destination input
- **Purpose**: Leverage AI to create comprehensive travel plans instantly
- **Trigger**: User navigates to AI Planner, enters destination, clicks generate or presses Enter
- **Progression**: Enter destination → validate input → show loading state → call OpenAI API → display formatted itinerary → option to regenerate
- **Success criteria**: Returns well-formatted itinerary in <5 seconds with proper error handling and API key validation

### Location Exploration with Weather
- **Functionality**: Request geolocation, display map centered on user, fetch and show current weather with unit preferences
- **Purpose**: Help users explore nearby areas and check current conditions for trip planning
- **Trigger**: Navigate to Explore page, browser requests location permission
- **Progression**: Request geolocation → store coordinates → fetch weather from Open-Meteo → render OpenStreetMap iframe → display temperature with user's preferred unit
- **Success criteria**: Accurate location detection, weather display within 2 seconds, proper metric/imperial conversion

### Trip Calendar/Manager
- **Functionality**: CRUD interface for saving trips with name, destination, start/end dates
- **Purpose**: Organize and track planned trips in one place
- **Trigger**: Navigate to Trips page, click add trip button
- **Progression**: Click add → fill form (name, destination, dates) → validate required fields → save to localStorage → display in trip list → option to remove trips
- **Success criteria**: Trips persist across sessions, validation prevents incomplete entries, dates are properly formatted

### Photo Journal
- **Functionality**: Upload and display travel photos in a grid layout
- **Purpose**: Document travel memories visually
- **Trigger**: Navigate to Journal page, select files via upload button
- **Progression**: Click upload → select multiple files → generate object URLs → display in 3-column responsive grid → view uploaded photos
- **Success criteria**: Multiple file selection works, images render correctly, grid adapts to screen size

### Settings Management
- **Functionality**: Configure display name and temperature unit preference (Celsius/Fahrenheit)
- **Purpose**: Personalize user experience and control data display formats
- **Trigger**: Navigate to Settings, modify fields, click save
- **Progression**: View current settings → modify name or unit → click save → persist to localStorage → show confirmation message
- **Success criteria**: Settings persist across sessions, weather display respects unit preference immediately

### Setup/Integration Registry
- **Functionality**: View integration status, setup instructions, and configuration requirements
- **Purpose**: Guide users through necessary API key setup and browser permission configuration
- **Trigger**: Navigate to Setup page or shown modal when missing API key
- **Progression**: View integration list → identify unconfigured items → read setup steps → configure environment variables → verify status changes
- **Success criteria**: Clear indication of which integrations are configured, actionable setup instructions, links to official documentation

## Edge Case Handling

- **Missing API Keys**: Setup modal with clear instructions when OpenAI or Amadeus keys are not configured
- **Geolocation Denied**: Fallback message explaining why location is needed for weather/map features
- **Offline/Network Errors**: Graceful error messages for API failures with retry options
- **Empty States**: Helpful guidance when no trips saved, no photos uploaded, no itinerary generated, no booking results found, or no price data available
- **Invalid Form Input**: Field validation with clear error messages for trip planning, settings, and booking search forms
- **Browser Compatibility**: Graceful degradation for older browsers that don't support modern geolocation APIs
- **Invalid Airport/City Codes**: Clear error messages when IATA codes are not recognized by Amadeus API
- **Date Validation**: Prevent past dates and ensure check-out/return dates are after check-in/departure dates
- **Price Comparison Failures**: Handle partial data when some dates don't return results, show only available data with clear indication of gaps

## Design Direction

The design should evoke a sense of **wanderlust and confidence** - inspiring users to explore while feeling organized and in control. Visual language combines modern glass morphism effects with vibrant travel-inspired colors, creating an interface that feels both cutting-edge and approachable. The experience should feel like looking through a window at your next adventure.

## Color Selection

A vibrant, travel-inspired palette with oceanic blues and sunset oranges, combining adventure energy with professional reliability.

- **Primary Color**: Deep Ocean Blue (oklch(0.45 0.15 250)) - communicates trust, depth, and exploration; used for primary actions and navigation
- **Secondary Colors**: 
  - Sky Blue (oklch(0.75 0.10 240)) - lighter supporting blue for backgrounds and secondary elements
  - Warm Sand (oklch(0.90 0.05 85)) - neutral warm tone for cards and surfaces
- **Accent Color**: Sunset Orange (oklch(0.70 0.18 45)) - vibrant highlight for CTAs, active states, and important elements that demand attention
- **Foreground/Background Pairings**:
  - Primary Blue (oklch(0.45 0.15 250)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Accent Orange (oklch(0.70 0.18 45)): Dark text (oklch(0.20 0 0)) - Ratio 7.5:1 ✓
  - Background (oklch(0.98 0.01 240)): Dark text (oklch(0.20 0 0)) - Ratio 15.8:1 ✓
  - Card/Glass surfaces (oklch(1 0 0 / 0.7)): Dark text (oklch(0.20 0 0)) - Ratio 15.8:1 ✓

## Font Selection

Typography should balance modern tech credibility with inviting warmth - professional enough for planning tools, friendly enough for travel inspiration.

- **Primary Font**: Space Grotesk - geometric sans-serif with technical sophistication for headings and navigation
- **Secondary Font**: Inter - clean, readable system font for body text and form inputs

**Typographic Hierarchy**:
- H1 (Hero Title): Space Grotesk Bold/48px/tight letter-spacing/-0.02em
- H2 (Section Headers): Space Grotesk Semibold/32px/normal letter-spacing
- H3 (Card Titles): Space Grotesk Medium/24px/normal letter-spacing
- Body (Paragraphs): Inter Regular/16px/line-height 1.6
- Small (Metadata): Inter Regular/14px/line-height 1.5
- Button Text: Space Grotesk Medium/16px/letter-spacing 0.01em

## Animations

Animations should enhance the sense of exploration and smooth transitions between planning modes - glass surfaces should feel responsive and fluid, navigation should provide spatial continuity, and interactive elements should offer satisfying micro-feedback.

- Page transitions use subtle slide/fade (300ms) to maintain spatial context
- Glass morphism surfaces have gentle hover lifts (150ms) with backdrop blur intensification
- Loading states use smooth pulsing skeleton rather than harsh spinners
- Form inputs expand focus rings with spring physics (200ms)
- Success confirmations use gentle scale + fade celebration (400ms)
- Weather/map data loads with progressive fade-in (250ms)
- Skip link slides down smoothly on keyboard focus (200ms)
- Respect prefers-reduced-motion by removing transforms, keeping only opacity changes

## Component Selection

**Components**:
- **Button**: Primary CTAs, quick actions, form submissions - customized with glass background and bold accent colors
- **Card**: Feature cards, KPI tiles, trip items, integration cards - enhanced with glass morphism backdrop-blur effect
- **Input**: Destination entry, settings fields, trip form - with focus states that intensify glass borders
- **Separator**: Visual division between nav sections and dashboard modules
- **Badge**: Integration status indicators (configured/not configured)
- **Dialog**: Setup modal for missing API key guidance
- **Form + Label**: Trip planner and settings with react-hook-form validation

**Customizations**:
- Custom glass navigation shell with backdrop-blur-xl and subtle border
- Custom hero section with animated gradient background using mesh gradients
- Custom KPI card component with icon, metric, and label styling
- Custom quick-action cards with hover lift and icon emphasis
- Custom integration status component showing env var requirements
- Custom weather display with temperature and unit formatting
- Custom skip-link component with keyboard-only visibility

**States**:
- Buttons: default glass surface → hover (lift + glow) → active (press down) → disabled (reduced opacity)
- Inputs: default outline → focus (thick accent border + glow ring) → error (red border) → success (green border)
- Cards: default glass → hover (lift shadow + border intensify) → active (navigation highlight)
- Nav pills: default muted → hover (background lighten) → active (accent background + white text)

**Icon Selection**: Phosphor icons throughout
- MapPin for location/explore
- Sparkle for AI planner
- Calendar for trips
- Camera for journal
- Gear for settings
- House for dashboard/home
- Warning for error states
- Check for success confirmation
- ChartLine for price trends and analytics
- HeartStraight for saving favorites

**Spacing**: 
- Page padding: px-6 md:px-12
- Section gaps: gap-8 md:gap-12
- Card padding: p-6
- Component gaps: gap-4
- Tight groups: gap-2
- Nav items: gap-1

**Mobile**:
- Navigation collapses to hamburger menu below 768px with slide-out drawer
- Hero text sizes reduce: 48px → 32px
- Grid layouts adapt: 3-column KPIs → 1-column stack
- Photo grid: 3 columns → 2 columns → 1 column
- Quick actions: horizontal scroll on mobile with snap points
- Form inputs expand to full width
- Glass effects reduce backdrop-blur intensity on low-power devices
