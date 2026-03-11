import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Compass, Sparkle, MapPin, Tag, BookOpen } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { generateSmartDestinationRecommendations, type DestinationRecommendation } from '@/lib/api'

const INTEREST_OPTIONS = [
  'Adventure & Outdoor',
  'Culture & History',
  'Food & Culinary',
  'Beach & Relaxation',
  'Nature & Wildlife',
  'Photography',
  'Shopping',
  'Nightlife',
  'Architecture',
  'Art & Museums',
  'Music & Festivals',
  'Wellness & Spa',
]

const CLIMATE_OPTIONS = [
  { value: 'any', label: 'Any Climate' },
  { value: 'tropical', label: 'Tropical & Warm' },
  { value: 'temperate', label: 'Temperate & Mild' },
  { value: 'cold', label: 'Cold & Snowy' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'desert', label: 'Desert & Dry' },
]

export function DestinationRecommendations() {
  const navigate = useNavigate()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [budget, setBudget] = useState('moderate')
  const [travelStyle, setTravelStyle] = useState('balanced')
  const [duration, setDuration] = useState('7')
  const [climate, setClimate] = useState('any')
  const [recommendations, setRecommendations] = useState<DestinationRecommendation[]>([])
  const [loading, setLoading] = useState(false)

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  const handleGetRecommendations = async () => {
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest')
      return
    }

    setLoading(true)

    try {
      const results = await generateSmartDestinationRecommendations({
        interests: selectedInterests,
        budget,
        travelStyle,
        duration: parseInt(duration),
        climate: climate === 'any' ? undefined : climate,
      })
      setRecommendations(results)
      toast.success('Found destinations perfect for you!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to get recommendations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="glass-surface">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Compass size={24} className="text-primary" weight="fill" />
            <CardTitle>Smart Destination Finder</CardTitle>
          </div>
          <CardDescription>
            Tell us what you love, and we'll recommend perfect destinations tailored to your interests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base">What are you interested in?</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {INTEREST_OPTIONS.map((interest) => (
                <div
                  key={interest}
                  className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => toggleInterest(interest)}
                >
                  <Checkbox
                    id={`interest-${interest}`}
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={() => toggleInterest(interest)}
                  />
                  <Label
                    htmlFor={`interest-${interest}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recommend-duration">Trip Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger id="recommend-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Days (Weekend)</SelectItem>
                  <SelectItem value="5">5 Days</SelectItem>
                  <SelectItem value="7">7 Days (1 Week)</SelectItem>
                  <SelectItem value="10">10 Days</SelectItem>
                  <SelectItem value="14">14 Days (2 Weeks)</SelectItem>
                  <SelectItem value="21">21 Days (3 Weeks)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommend-budget">Budget Level</Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger id="recommend-budget">
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
              <Label htmlFor="recommend-style">Travel Style</Label>
              <Select value={travelStyle} onValueChange={setTravelStyle}>
                <SelectTrigger id="recommend-style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced Mix</SelectItem>
                  <SelectItem value="adventure">Adventure & Outdoor</SelectItem>
                  <SelectItem value="relaxation">Relaxation & Wellness</SelectItem>
                  <SelectItem value="culture">Culture & History</SelectItem>
                  <SelectItem value="food">Food & Culinary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommend-climate">Preferred Climate</Label>
              <Select value={climate} onValueChange={setClimate}>
                <SelectTrigger id="recommend-climate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLIMATE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGetRecommendations}
            disabled={loading || selectedInterests.length === 0}
            className="w-full gap-2"
            size="lg"
          >
            {loading ? (
              <>
                <Sparkle size={20} className="animate-spin" />
                Finding Perfect Destinations...
              </>
            ) : (
              <>
                <Compass size={20} weight="fill" />
                Get Destination Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Recommended Destinations for You</h3>
          <div className="grid grid-cols-1 gap-6">
            {recommendations.map((rec, index) => (
              <Card key={index} className="glass-surface overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={24} className="text-primary" weight="fill" />
                        <CardTitle className="text-2xl">{rec.destination}</CardTitle>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground">
                        {rec.country}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {rec.estimatedBudget}
                    </Badge>
                  </div>
                  <p className="text-base mt-3">{rec.description}</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Tag size={18} weight="fill" className="text-accent" />
                      Best For
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.bestFor.map((item, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">When to Visit</h4>
                    <p className="text-sm text-muted-foreground">{rec.seasonInfo}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Must-See Highlights</h4>
                    <ul className="space-y-1">
                      {rec.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Travel Tips</h4>
                    <ul className="space-y-1">
                      {rec.travelTips.map((tip, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">→</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => navigate(`/explore/${encodeURIComponent(rec.destination)}`)}
                    className="w-full gap-2 mt-2"
                    variant="default"
                  >
                    <BookOpen size={20} weight="fill" />
                    View Full Travel Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
