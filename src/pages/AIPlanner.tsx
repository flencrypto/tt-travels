import { useState } from 'react'
import { Sparkle, Warning } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SetupModal } from '@/components/SetupModal'
import { generateItinerary, MissingApiKeyError, type ItineraryOptions } from '@/lib/api'

export function AIPlanner() {
  const [destination, setDestination] = useState('')
  const [duration, setDuration] = useState('3')
  const [travelStyle, setTravelStyle] = useState('balanced')
  const [budget, setBudget] = useState('moderate')
  const [groupType, setGroupType] = useState('solo')
  const [pace, setPace] = useState('moderate')
  const [itinerary, setItinerary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSetupModal, setShowSetupModal] = useState(false)

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate()
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Sparkle size={40} className="text-accent" weight="fill" />
          <h1 className="text-4xl font-bold">AI Trip Planner</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Generate personalized travel itineraries powered by AI with customizable options
        </p>
      </div>

      <Card className="max-w-4xl mx-auto glass-surface">
        <CardHeader>
          <CardTitle>Create Your Custom Itinerary</CardTitle>
          <CardDescription>
            Customize your trip preferences and let AI create a detailed personalized travel plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g., Paris, Tokyo, New York"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
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

          <Button
            onClick={handleGenerate}
            disabled={loading || !destination.trim()}
            className="w-full gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <Sparkle size={20} className="animate-spin" />
                Generating Your Personalized Itinerary...
              </>
            ) : (
              <>
                <Sparkle size={20} weight="fill" />
                Generate Custom Itinerary
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {itinerary && (
        <Card className="max-w-4xl mx-auto glass-surface">
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
      )}

      <SetupModal open={showSetupModal} onOpenChange={setShowSetupModal} />
    </div>
  )
}
