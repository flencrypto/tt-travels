import { useState } from 'react'
import { Sparkle, Warning, Backpack, Compass, MapTrifold, ClockCounterClockwise, Trash, MapPin, NavigationArrow } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SetupModal } from '@/components/SetupModal'
import { PackingList } from '@/components/PackingList'
import { DestinationRecommendations } from '@/components/DestinationRecommendations'
import { ItineraryMapView } from '@/components/ItineraryMapView'
import { GeoLocalRecommendations } from '@/components/GeoLocalRecommendations'
import { generateItinerary, generatePackingList, MissingApiKeyError, type ItineraryOptions, type PackingListOptions, type PackingListItem } from '@/lib/api'
import { toast } from 'sonner'
import { useItinerarySearchHistory } from '@/hooks/use-search-history'

const SAMPLE_ITINERARY = `🗼 Paris, France - 5 Day Cultural Adventure

DAY 1: ARRIVAL & INTRODUCTION TO PARIS
Morning:
• Arrive at Charles de Gaulle Airport
• Check into hotel in Le Marais district (great for culture & walkability)
• Light breakfast at a local café (try a croissant and café au lait)

Afternoon:
• Stroll through Le Marais neighborhood
• Visit Place des Vosges, Paris's oldest planned square
• Explore vintage boutiques and art galleries
• Lunch at L'As du Fallafel (famous falafel spot)

Evening:
• Walk along the Seine River at sunset
• Visit Pont des Arts and Pont Neuf bridges
• Dinner at a traditional bistro in Saint-Germain-des-Prés
• Evening walk around Notre-Dame Cathedral (exterior viewing)

DAY 2: ICONIC LANDMARKS
Morning:
• Early visit to the Louvre Museum (arrive at opening to avoid crowds)
• See the Mona Lisa, Venus de Milo, and Winged Victory
• Explore Egyptian antiquities and Renaissance paintings (3-4 hours)

Afternoon:
• Lunch at Café Marly overlooking the Louvre courtyard
• Walk through Tuileries Garden
• Visit Place de la Concorde
• Stroll up the Champs-Élysées to the Arc de Triomphe
• Climb to the top of Arc de Triomphe for panoramic views

Evening:
• Metro to Trocadéro for Eiffel Tower photo opportunities
• Pre-booked ticket to climb the Eiffel Tower at sunset
• Enjoy champagne at the tower's champagne bar
• Dinner in the 7th arrondissement

DAY 3: ARTISTIC MONTMARTRE & SACRÉ-CŒUR
Morning:
• Breakfast in Montmartre at a local café
• Visit Sacré-Cœur Basilica early morning
• Explore the artistic heart of Montmartre
• See Place du Tertre with street artists

Afternoon:
• Visit the Musée de Montmartre
• Lunch at La Maison Rose (iconic pink restaurant)
• Walk to Moulin Rouge area
• Visit the Musée d'Orsay (Impressionist masterpieces)

Evening:
• Sunset from the Musée d'Orsay's 5th floor
• Dinner cruise on the Seine River with Bateaux Parisiens
• See illuminated monuments from the water

DAY 4: VERSAILLES DAY TRIP
Morning:
• Early train to Versailles (book tickets in advance)
• Tour the Palace of Versailles and Hall of Mirrors
• Explore the State Apartments

Afternoon:
• Lunch at Angelina tearoom in Versailles
• Walk through the magnificent Gardens of Versailles
• Visit Marie Antoinette's Estate and The Trianon
• Rent a bicycle or golf cart to explore the vast grounds

Evening:
• Return to Paris by late afternoon
• Relaxing evening in Le Marais
• Dinner at a traditional French brasserie
• Try escargot, coq au vin, or duck confit

DAY 5: FINAL DAY - LATIN QUARTER & HIDDEN GEMS
Morning:
• Breakfast in the Latin Quarter
• Visit the Panthéon
• Explore Shakespeare and Company bookstore
• Walk through Luxembourg Gardens

Afternoon:
• Lunch at a crêperie on Rue Mouffetard
• Visit Sainte-Chapelle for stunning stained glass
• Browse the bouquinistes (book stalls) along the Seine
• Last-minute shopping or museum visits

Evening:
• Farewell dinner at a rooftop restaurant with Eiffel Tower views
• Final walk along the Seine
• Enjoy a macaron from Pierre Hermé or Ladurée

💡 TRAVEL TIPS:
• Purchase a Paris Museum Pass for skip-the-line access
• Use the Metro (buy a carnet of 10 tickets or Navigo pass)
• Most museums closed on Mondays or Tuesdays
• Book Eiffel Tower and Versailles tickets well in advance
• Learn basic French phrases (bonjour, merci, s'il vous plaît)
• Restaurants often close between lunch (2pm) and dinner (7pm)
• Tipping: Service charge included, but small tip (5-10%) appreciated

🍽️ MUST-TRY FOODS:
• Croissants and pain au chocolat for breakfast
• French onion soup
• Steak frites
• Crème brûlée
• Macarons
• French wine and cheese

Estimated Daily Budget (Moderate):
• Accommodation: €100-150/night
• Meals: €50-70/day
• Attractions: €40-60/day
• Transportation: €10-15/day
• Total: Approximately €200-295 per day`

export function AIPlanner() {
  const [destination, setDestination] = useState('Paris, France')
  const [duration, setDuration] = useState('5')
  const [travelStyle, setTravelStyle] = useState('culture')
  const [budget, setBudget] = useState('moderate')
  const [groupType, setGroupType] = useState('solo')
  const [pace, setPace] = useState('moderate')
  const [itinerary, setItinerary] = useState<string | null>(SAMPLE_ITINERARY)
  const [packingList, setPackingList] = useState<PackingListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [packingLoading, setPackingLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSetupModal, setShowSetupModal] = useState(false)
  const { history, addSearch, clearHistory } = useItinerarySearchHistory()
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number; name: string } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)

  const handleGenerate = async () => {
    if (!destination.trim()) {
      setError('Please enter a destination')
      return
    }

    setLoading(true)
    setError(null)
    setItinerary(null)

    const options: ItineraryOptions = {
      destination,
      duration: parseInt(duration),
      travelStyle,
      budget,
      groupType,
      pace,
    }

    try {
      const result = await generateItinerary(options)
      setItinerary(result)
      
      addSearch({
        destination,
        duration: parseInt(duration),
        travelStyle,
        budget,
        groupType,
        pace,
      })
    } catch (err) {
      if (err instanceof MissingApiKeyError) {
        setShowSetupModal(true)
        setError('OpenAI API key is not configured')
      } else {
        setError(err instanceof Error ? err.message : 'Failed to generate itinerary')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadFromHistory = (item: typeof history[0]) => {
    setDestination(item.destination)
    setDuration(item.duration.toString())
    setTravelStyle(item.travelStyle)
    setBudget(item.budget)
    setGroupType(item.groupType)
    setPace(item.pace)
  }

  const handleGeneratePackingList = async () => {
    if (!destination.trim()) {
      toast.error('Please enter a destination first')
      return
    }

    setPackingLoading(true)

    const options: PackingListOptions = {
      destination,
      duration: parseInt(duration),
      travelStyle,
      budget,
      groupType,
    }

    try {
      const result = await generatePackingList(options)
      setPackingList(result)
      toast.success('Packing list generated!')
    } catch (err) {
      if (err instanceof MissingApiKeyError) {
        setShowSetupModal(true)
        toast.error('OpenAI API key is not configured')
      } else {
        toast.error(err instanceof Error ? err.message : 'Failed to generate packing list')
      }
    } finally {
      setPackingLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate()
    }
  }

  const getLocationName = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1`
      )
      if (!response.ok) throw new Error('Failed to reverse geocode')
      
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        const location = data.results[0]
        return location.name + (location.country ? `, ${location.country}` : '')
      }
      return `${lat.toFixed(2)}, ${lon.toFixed(2)}`
    } catch (error) {
      return `${lat.toFixed(2)}, ${lon.toFixed(2)}`
    }
  }

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    setLocationLoading(true)
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        
        const locationName = await getLocationName(lat, lon)
        
        setCurrentLocation({ lat, lon, name: locationName })
        setDestination(locationName)
        setLocationLoading(false)
        toast.success(`Location detected: ${locationName}`)
      },
      (error) => {
        setLocationLoading(false)
        let errorMessage = 'Unable to retrieve your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        
        toast.error(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Sparkle size={40} className="text-accent" weight="fill" />
          <h1 className="text-4xl font-bold">AI Trip Planner</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Generate personalized travel itineraries and discover perfect destinations powered by AI
        </p>
      </div>

      <Tabs defaultValue="itinerary" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="itinerary" className="gap-2">
            <Sparkle size={18} weight="fill" />
            Create Itinerary
          </TabsTrigger>
          <TabsTrigger value="discover" className="gap-2">
            <Compass size={18} weight="fill" />
            Discover Destinations
          </TabsTrigger>
          <TabsTrigger value="local" className="gap-2">
            <NavigationArrow size={18} weight="fill" />
            Local Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary" className="space-y-8">
          <Card className="glass-surface">
            <CardHeader>
              <CardTitle>Create Your Custom Itinerary</CardTitle>
              <CardDescription>
                Customize your trip preferences and let AI create a detailed personalized travel plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      id="destination"
                      placeholder="e.g., Paris, Tokyo, New York"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      className="pr-10"
                    />
                    {currentLocation && (
                      <MapPin 
                        size={20} 
                        weight="fill" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-accent"
                      />
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUseMyLocation}
                    disabled={locationLoading || loading}
                    className="shrink-0"
                    title="Use my current location"
                  >
                    {locationLoading ? (
                      <NavigationArrow size={20} className="animate-spin" />
                    ) : (
                      <NavigationArrow size={20} weight="fill" />
                    )}
                  </Button>
                </div>
                {currentLocation && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin size={14} weight="fill" />
                    Planning from: {currentLocation.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Trip Duration</Label>
                  <Select value={duration} onValueChange={setDuration} disabled={loading}>
                    <SelectTrigger id="duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Day</SelectItem>
                      <SelectItem value="2">2 Days</SelectItem>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="4">4 Days</SelectItem>
                      <SelectItem value="5">5 Days</SelectItem>
                      <SelectItem value="7">7 Days (1 Week)</SelectItem>
                      <SelectItem value="10">10 Days</SelectItem>
                      <SelectItem value="14">14 Days (2 Weeks)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travel-style">Travel Style</Label>
                  <Select value={travelStyle} onValueChange={setTravelStyle} disabled={loading}>
                    <SelectTrigger id="travel-style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced Mix</SelectItem>
                      <SelectItem value="adventure">Adventure & Outdoor</SelectItem>
                      <SelectItem value="relaxation">Relaxation & Wellness</SelectItem>
                      <SelectItem value="culture">Culture & History</SelectItem>
                      <SelectItem value="food">Food & Culinary</SelectItem>
                      <SelectItem value="nightlife">Nightlife & Entertainment</SelectItem>
                      <SelectItem value="nature">Nature & Wildlife</SelectItem>
                      <SelectItem value="photography">Photography & Sightseeing</SelectItem>
                      <SelectItem value="shopping">Shopping & Markets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Level</Label>
                  <Select value={budget} onValueChange={setBudget} disabled={loading}>
                    <SelectTrigger id="budget">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget-Friendly</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group-type">Traveling With</Label>
                  <Select value={groupType} onValueChange={setGroupType} disabled={loading}>
                    <SelectTrigger id="group-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="couple">Couple</SelectItem>
                      <SelectItem value="family">Family with Kids</SelectItem>
                      <SelectItem value="friends">Friends Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pace">Travel Pace</Label>
                  <Select value={pace} onValueChange={setPace} disabled={loading}>
                    <SelectTrigger id="pace">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relaxed">Relaxed - Lots of downtime</SelectItem>
                      <SelectItem value="moderate">Moderate - Balanced schedule</SelectItem>
                      <SelectItem value="packed">Packed - Maximize experiences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                  <Warning size={20} weight="fill" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {history.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClockCounterClockwise size={20} className="text-muted-foreground" weight="fill" />
                      <h3 className="text-sm font-semibold text-muted-foreground">Recent Itineraries</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="gap-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash size={16} />
                      Clear
                    </Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {history.map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        size="sm"
                        onClick={() => loadFromHistory(item)}
                        className="gap-2"
                      >
                        <span className="font-semibold">{item.destination}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.duration}d • {item.travelStyle}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !destination.trim()}
                  className="gap-2"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Sparkle size={20} className="animate-spin" />
                      Generating Itinerary...
                    </>
                  ) : (
                    <>
                      <Sparkle size={20} weight="fill" />
                      Generate Itinerary
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleGeneratePackingList}
                  disabled={packingLoading || !destination.trim()}
                  className="gap-2"
                  size="lg"
                  variant="secondary"
                >
                  {packingLoading ? (
                    <>
                      <Backpack size={20} className="animate-spin" />
                      Generating Packing List...
                    </>
                  ) : (
                    <>
                      <Backpack size={20} weight="fill" />
                      Generate Packing List
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {(itinerary || packingList.length > 0) && (
            <div className="space-y-8">
              {itinerary && (
                <>
                  <Card className="glass-surface">
                    <CardHeader>
                      <CardTitle>Your Personalized Itinerary</CardTitle>
                      <CardDescription>
                        {duration}-day {travelStyle} travel plan for {destination}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed">
                        {itinerary}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card className="glass-surface">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <MapTrifold size={24} className="text-primary" weight="fill" />
                        <CardTitle>Itinerary Map View</CardTitle>
                      </div>
                      <CardDescription>
                        Interactive map showing all recommended locations from your itinerary
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ItineraryMapView itinerary={itinerary} destination={destination} />
                    </CardContent>
                  </Card>
                </>
              )}

              {packingList.length > 0 && (
                <PackingList
                  destination={destination}
                  duration={parseInt(duration)}
                  travelStyle={travelStyle}
                  budget={budget}
                  groupType={groupType}
                  items={packingList}
                  onItemsChange={setPackingList}
                />
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover">
          <DestinationRecommendations />
        </TabsContent>

        <TabsContent value="local">
          <GeoLocalRecommendations currentLocation={currentLocation} onLocationDetected={handleUseMyLocation} />
        </TabsContent>
      </Tabs>

      <SetupModal open={showSetupModal} onOpenChange={setShowSetupModal} />
    </div>
  )
}
