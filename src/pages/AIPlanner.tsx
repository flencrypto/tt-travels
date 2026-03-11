import { useState } from 'react'
import { Sparkle, Warning } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SetupModal } from '@/components/SetupModal'
import { generateItinerary, MissingApiKeyError } from '@/lib/api'

export function AIPlanner() {
  const [destination, setDestination] = useState('')
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

    try {
      const result = await generateItinerary(destination)
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
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Sparkle size={40} className="text-accent" weight="fill" />
          <h1 className="text-4xl font-bold">AI Trip Planner</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Generate personalized travel itineraries powered by AI
        </p>
      </div>

      <Card className="max-w-3xl mx-auto glass-surface">
        <CardHeader>
          <CardTitle>Create Your Itinerary</CardTitle>
          <CardDescription>
            Enter a destination and let AI create a detailed 3-day travel plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                Generating...
              </>
            ) : (
              <>
                <Sparkle size={20} weight="fill" />
                Generate Itinerary
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {itinerary && (
        <Card className="max-w-3xl mx-auto glass-surface">
          <CardHeader>
            <CardTitle>Your Personalized Itinerary</CardTitle>
            <CardDescription>3-day travel plan for {destination}</CardDescription>
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
