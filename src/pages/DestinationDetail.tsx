import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, ThermometerSimple, Calendar, CurrencyDollar, Sparkle, BookOpen, Backpack, Camera, Info, ArrowLeft, Heart, Share, Newspaper } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { generateDestinationGuide, type DestinationGuide } from '@/lib/destination-api'
import { useKV } from '@github/spark/hooks'

interface SavedDestination {
  id: string
  name: string
  country: string
  savedAt: string
}

export function DestinationDetail() {
  const { destinationName } = useParams<{ destinationName: string }>()
  const navigate = useNavigate()
  const [guide, setGuide] = useState<DestinationGuide | null>(null)
  const [loading, setLoading] = useState(true)
  const [savedDestinations, setSavedDestinations] = useKV<SavedDestination[]>('tt-travels-saved-destinations', [])
  const [isSaved, setIsSaved] = useState(false)

  const decodedDestination = destinationName ? decodeURIComponent(destinationName) : ''

  useEffect(() => {
    if (savedDestinations) {
      const saved = savedDestinations.some(d => d.name === decodedDestination)
      setIsSaved(saved)
    }
  }, [savedDestinations, decodedDestination])

  useEffect(() => {
    const loadDestinationGuide = async () => {
      if (!decodedDestination) {
        navigate('/explore')
        return
      }

      setLoading(true)
      try {
        const guideData = await generateDestinationGuide(decodedDestination)
        setGuide(guideData)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load destination guide')
        navigate('/explore')
      } finally {
        setLoading(false)
      }
    }

    loadDestinationGuide()
  }, [decodedDestination, navigate])

  const handleSaveDestination = () => {
    if (!guide) return

    setSavedDestinations((current) => {
      if (!current) current = []
      const existing = current.some(d => d.name === guide.destination)
      
      if (existing) {
        toast.success('Destination removed from favorites')
        return current.filter(d => d.name !== guide.destination)
      } else {
        toast.success('Destination saved to favorites!')
        return [...current, {
          id: `dest-${Date.now()}`,
          name: guide.destination,
          country: guide.country,
          savedAt: new Date().toISOString(),
        }]
      }
    })
  }

  const handleShare = async () => {
    if (!guide) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${guide.destination} Travel Guide`,
          text: `Check out this comprehensive travel guide for ${guide.destination}!`,
          url: window.location.href,
        })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share')
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <Card className="glass-surface">
            <CardContent className="p-12 text-center">
              <div className="animate-pulse space-y-4">
                <Sparkle size={48} className="mx-auto text-primary animate-spin" />
                <p className="text-muted-foreground">Creating your comprehensive travel guide...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!guide) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/explore')}
              className="gap-2"
            >
              <ArrowLeft size={20} />
              Back to Explore
            </Button>
            <div className="flex-1" />
            <Button
              variant="outline"
              onClick={handleSaveDestination}
              className="gap-2"
            >
              <Heart size={20} weight={isSaved ? 'fill' : 'regular'} className={isSaved ? 'text-red-500' : ''} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="gap-2"
            >
              <Share size={20} />
              Share
            </Button>
          </div>

          <div className="relative rounded-2xl overflow-hidden mb-8 border border-border/50 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 p-12">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={32} className="text-primary" weight="fill" />
                <div>
                  <h1 className="text-5xl font-bold">{guide.destination}</h1>
                  <p className="text-xl text-muted-foreground mt-1">{guide.country}</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed max-w-3xl">{guide.overview}</p>
              
              <div className="flex flex-wrap gap-2 mt-6">
                {guide.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-surface">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar size={24} className="text-primary" weight="fill" />
                  <CardTitle className="text-lg">Best Time to Visit</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{guide.bestTimeToVisit}</p>
              </CardContent>
            </Card>

            <Card className="glass-surface">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ThermometerSimple size={24} className="text-accent" weight="fill" />
                  <CardTitle className="text-lg">Climate</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{guide.climate}</p>
              </CardContent>
            </Card>

            <Card className="glass-surface">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CurrencyDollar size={24} className="text-secondary" weight="fill" />
                  <CardTitle className="text-lg">Budget Range</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{guide.budgetRange}</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="attractions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="attractions" className="gap-2">
                <Camera size={18} />
                <span className="hidden sm:inline">Attractions</span>
              </TabsTrigger>
              <TabsTrigger value="culture" className="gap-2">
                <BookOpen size={18} />
                <span className="hidden sm:inline">Culture</span>
              </TabsTrigger>
              <TabsTrigger value="food" className="gap-2">
                <Sparkle size={18} />
                <span className="hidden sm:inline">Cuisine</span>
              </TabsTrigger>
              <TabsTrigger value="transport" className="gap-2">
                <MapPin size={18} />
                <span className="hidden sm:inline">Transport</span>
              </TabsTrigger>
              <TabsTrigger value="tips" className="gap-2">
                <Info size={18} />
                <span className="hidden sm:inline">Tips</span>
              </TabsTrigger>
              <TabsTrigger value="essentials" className="gap-2">
                <Backpack size={18} />
                <span className="hidden sm:inline">Essentials</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="attractions" className="space-y-6">
              <Card className="glass-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera size={24} className="text-primary" weight="fill" />
                    Top Attractions & Landmarks
                  </CardTitle>
                  <CardDescription>Must-see places and experiences in {guide.destination}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {guide.attractions.map((attraction, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-6" />}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{attraction.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{attraction.description}</p>
                          </div>
                          {attraction.estimatedTime && (
                            <Badge variant="outline" className="shrink-0">
                              {attraction.estimatedTime}
                            </Badge>
                          )}
                        </div>
                        {attraction.tips && attraction.tips.length > 0 && (
                          <div className="pl-4 border-l-2 border-accent/30 space-y-1">
                            {attraction.tips.map((tip, i) => (
                              <p key={i} className="text-sm text-muted-foreground">• {tip}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="culture" className="space-y-6">
              <Card className="glass-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={24} className="text-primary" weight="fill" />
                    Cultural Insights
                  </CardTitle>
                  <CardDescription>Important cultural information and local customs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {guide.culturalInsights.map((insight, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-semibold">{insight.topic}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      {index < guide.culturalInsights.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="food" className="space-y-6">
              <Card className="glass-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkle size={24} className="text-accent" weight="fill" />
                    Local Cuisine & Dining
                  </CardTitle>
                  <CardDescription>Must-try dishes and dining recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {guide.cuisine.map((item, index) => (
                    <div key={index}>
                      {index > 0 && <Separator className="my-6" />}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{item.dish}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          </div>
                          {item.type && (
                            <Badge variant="secondary" className="shrink-0">
                              {item.type}
                            </Badge>
                          )}
                        </div>
                        {item.whereToTry && (
                          <p className="text-sm text-accent">📍 Where to try: {item.whereToTry}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transport" className="space-y-6">
              <Card className="glass-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin size={24} className="text-secondary" weight="fill" />
                    Transportation Guide
                  </CardTitle>
                  <CardDescription>Getting around {guide.destination}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {guide.transportation.map((option, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{option.type}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                        </div>
                        {option.cost && (
                          <Badge variant="outline" className="shrink-0">
                            {option.cost}
                          </Badge>
                        )}
                      </div>
                      {index < guide.transportation.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-6">
              <Card className="glass-surface">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info size={24} className="text-primary" weight="fill" />
                    Essential Travel Tips
                  </CardTitle>
                  <CardDescription>Important information for your trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {guide.travelTips.map((tip, index) => (
                      <div key={index} className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border/50">
                        <h3 className="font-semibold text-primary">{tip.category}</h3>
                        <p className="text-sm text-muted-foreground">{tip.advice}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="essentials" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-surface">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Newspaper size={24} className="text-accent" weight="fill" />
                      Language & Communication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Primary Language</p>
                      <p className="text-base">{guide.essentials.language}</p>
                    </div>
                    {guide.essentials.commonPhrases && guide.essentials.commonPhrases.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Common Phrases</p>
                        <div className="space-y-1">
                          {guide.essentials.commonPhrases.map((phrase, index) => (
                            <p key={index} className="text-sm">• {phrase}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-surface">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CurrencyDollar size={24} className="text-primary" weight="fill" />
                      Currency & Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Local Currency</p>
                      <p className="text-base">{guide.essentials.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Visa Requirements</p>
                      <p className="text-sm text-muted-foreground">{guide.essentials.visaInfo}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-surface md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info size={24} className="text-secondary" weight="fill" />
                      Safety & Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Safety Information</p>
                      <p className="text-sm text-muted-foreground">{guide.essentials.safety}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Health Considerations</p>
                      <p className="text-sm text-muted-foreground">{guide.essentials.healthTips}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
