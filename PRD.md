# Planning Guide

A minimalist travel inspiration app that helps users discover and save dream destinations with beautiful visuals and simple interactions.

**Experience Qualities**: 
1. Inspiring - Evokes wanderlust through stunning visuals and engaging destination cards
2. Effortless - Simple, intuitive interface requiring minimal clicks to explore and save places
3. Personal - Curated feel with ability to save favorites and add personal notes

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused tool centered on destination discovery and personal collections without complex booking flows or multi-view navigation systems.

## Essential Features

### Destination Discovery
- **Functionality**: Browse curated list of inspiring travel destinations with photos and key details
- **Purpose**: Spark travel ideas and help users discover new places
- **Trigger**: User visits explore section
- **Progression**: View grid of destinations → Click card to see details → Read description and highlights → Save to favorites or close
- **Success criteria**: Users can easily scan destinations and access basic information

### Favorites Collection
- **Functionality**: Save destinations with optional personal notes
- **Purpose**: Let users build their personal travel wishlist
- **Trigger**: Click heart icon on any destination
- **Progression**: Click heart → Destination saved → Optional: add note → View in favorites page
- **Success criteria**: Saved destinations persist and are easily accessible with notes

### Quick Search
- **Functionality**: Filter destinations by name or country
- **Purpose**: Help users quickly find specific places
- **Trigger**: Type in search field
- **Progression**: Enter text → Results filter in real-time → Clear search to reset
- **Success criteria**: Search updates instantly and accurately matches destination names/countries

## Edge Case Handling

- **Empty Favorites**: Show welcoming empty state encouraging users to explore and save destinations
- **Search No Results**: Display helpful message when no destinations match search query
- **Duplicate Saves**: Prevent adding same destination twice with visual feedback
- **Long Notes**: Truncate with "read more" for notes exceeding character limit

## Design Direction

The design should feel like flipping through a premium travel magazine - elegant, spacious, and aspirational with rich imagery and refined typography.

## Color Selection

A sophisticated palette inspired by travel photography with warm sunset tones and deep blues.

- **Primary Color**: Deep Ocean Blue `oklch(0.42 0.12 240)` - Evokes adventure and trust, used for navigation and key actions
- **Secondary Colors**: 
  - Soft Sky `oklch(0.88 0.05 235)` - Calming background tones
  - Warm Sand `oklch(0.92 0.03 80)` - Subtle accents and muted areas
- **Accent Color**: Sunset Orange `oklch(0.68 0.18 45)` - Attention-grabbing for CTAs, favorites, and important highlights
- **Foreground/Background Pairings**: 
  - Background (Soft Sky #F5F7FA): Deep Charcoal Text (#1A1D23) - Ratio 11.2:1 ✓
  - Primary (Deep Ocean Blue #2D4A7C): White text (#FFFFFF) - Ratio 6.8:1 ✓
  - Accent (Sunset Orange #E89B5F): Deep Charcoal (#1A1D23) - Ratio 5.1:1 ✓
  - Card (White #FFFFFF): Deep Charcoal Text (#1A1D23) - Ratio 14.5:1 ✓

## Font Selection

Typography should balance modern cleanliness with editorial sophistication.

- **Typographic Hierarchy**: 
  - H1 (Page Titles): Playfair Display Bold/36px/tight tracking, used sparingly for main headings
  - H2 (Section Headers): Space Grotesk SemiBold/24px/normal tracking
  - H3 (Card Titles): Space Grotesk Medium/18px/normal tracking
  - Body: Inter Regular/16px/relaxed leading (1.6)
  - Small Text: Inter Regular/14px/normal leading

## Animations

Animations should feel smooth and purposeful, enhancing the premium magazine-like experience. Subtle hover lifts on cards (scale 1.02), gentle opacity transitions on favorites (200ms), smooth page transitions (300ms), and delightful micro-interactions when saving destinations (heart fill animation).

## Component Selection

- **Components**: 
  - Cards for destinations with hover effects and shadow transitions
  - Input with search icon for filtering
  - Button variants (primary for CTAs, ghost for secondary actions, icon for favorites)
  - Dialog for destination details with large imagery
  - Textarea for notes with character counter
  - Badge for destination categories/types
  - Separator for visual breaks between sections
  - Scroll Area for favorites list on mobile
  
- **Customizations**: 
  - Custom image aspect ratio container (4:3) for consistent destination cards
  - Gradient overlays on card images for text readability
  - Heart icon with fill state animation for favorites
  - Custom search input with phosphor icons and clear button
  
- **States**: 
  - Buttons: subtle scale on hover (0.98), opacity decrease on press, clear disabled state with reduced opacity
  - Cards: lift effect (translateY -4px) with shadow on hover, active state with slight press down
  - Inputs: border color change and subtle glow on focus, error state with red border
  - Heart icon: unfilled outline → filled with bounce animation when toggled
  
- **Icon Selection**: 
  - MagnifyingGlass for search
  - Heart (outline/fill variants) for favorites
  - Plus for adding notes
  - X for closing dialogs and clearing search
  - MapPin for location indicators
  - Star for highlighting featured destinations
  
- **Spacing**: 
  - Container padding: px-6 (mobile), px-12 (desktop)
  - Card padding: p-6
  - Section gaps: gap-8 (mobile), gap-12 (desktop)
  - Grid gaps: gap-6 for card grids
  - Vertical section spacing: py-12
  
- **Mobile**: 
  - Single column card grid on mobile, 2 columns on tablet, 3 columns on desktop
  - Sticky search bar at top on mobile
  - Full-screen dialogs for destination details on mobile
  - Bottom sheet style for notes input on small screens
  - Reduced padding (px-4) on mobile containers
