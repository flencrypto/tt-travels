import { useState, useEffect } from 'react'
import { MapPin, ForkKnife, Compass, Sparkle, NavigationArrow, MapTrifold, Coffee, Martini, Hamburger, Timer } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { generateGeoLocalRecommendations, type GeoRecommendation } from '@/lib/geo-recommendations'
import { cn } from '@/lib/utils'

interface GeoLocalRecommendationsProps {
  latitude?: number
  longitude?: number
  locationName?: string
  currentLocation?: { lat: number; lon: number; name: string } | null
  onLocationDetected?: () => void
}

export function GeoLocalRecommendations({ 
  latitude, 
  longitude, 
  locationName,
  currentLocation,
  onLocationDetected
}: GeoLocalRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<GeoRecommendation[]>([])
  const [offTheBeaten, setOffTheBeaten] = useState<GeoRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'things-to-do' | 'places-to-eat'>('things-to-do')

  const effectiveLatitude = latitude ?? currentLocation?.lat
  const effectiveLongitude = longitude ?? currentLocation?.lon
  const effectiveLocationName = locationName ?? currentLocation?.name ?? ''

  useEffect(() => {
    if (effectiveLatitude !== undefined && effectiveLongitude !== undefined) {
      loadRecommendations()
    }
  }, [effectiveLatitude, effectiveLongitude, activeTab])

  const loadRecommendations = async () => {
    if (effectiveLatitude === undefined || effectiveLongitude === undefined) {
      return
    }
    
    setLoading(true)
    try {
      const data = await generateGeoLocalRecommendations(
        effectiveLatitude,
        effectiveLongitude,
        effectiveLocationName,
        activeTab
      )
      setRecommendations(data.mainstream)
      setOffTheBeaten(data.offTheBeaten)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load recommendations')
      setRecommendations([])
      setOffTheBeaten([])
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase()
    if (lower.includes('coffee') || lower.includes('café') || lower.includes('cafe')) return Coffee
    if (lower.includes('bar') || lower.includes('drink') || lower.includes('pub')) return Martini
    if (lower.includes('restaurant') || lower.includes('dining') || lower.includes('food')) return Hamburger
    if (lower.includes('activity') || lower.includes('attraction')) return Compass
    return ForkKnife
  }

  const getCategoryColor = (category: string) => {
    const lower = category.toLowerCase()
    if (lower.includes('coffee') || lower.includes('café') || lower.includes('cafe')) return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
    if (lower.includes('bar') || lower.includes('drink') || lower.includes('pub')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
    if (lower.includes('restaurant') || lower.includes('dining') || lower.includes('food')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    if (lower.includes('activity') || lower.includes('attraction')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
    return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  }

  const openInMaps = (name: string) => {
    const query = encodeURIComponent(`${name} near ${effectiveLocationName}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
  }

  if (!effectiveLatitude || !effectiveLongitude) {
    return (
      <Card className="glass-surface">
        <CardContent className="p-12 text-center space-y-6">
          <div className="flex justify-center">
            <NavigationArrow size={64} className="text-primary" weight="fill" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Enable Location to Get Local Recommendations</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Share your location to discover amazing places to visit and eat nearby, including hidden gems that locals love.
            </p>
          </div>
          {onLocationDetected && (
            <Button size="lg" onClick={onLocationDetected} className="gap-2">
              <MapPin size={20} weight="fill" />
              Detect My Location
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="glass-surface">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <Sparkle size={40} className="mx-auto text-primary animate-spin" />
            <p className="text-muted-foreground">Discovering local gems...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const RecommendationCard = ({ rec }: { rec: GeoRecommendation }) => {
    const Icon = getCategoryIcon(rec.category)
    return (
      <Card className="glass-surface hover:shadow-lg transition-shadow group">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {rec.name}
              </CardTitle>
              {rec.neighborhood && (
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin size={14} />
                  {rec.neighborhood}
                </CardDescription>
              )}
            </div>
            <Badge className={cn('shrink-0', getCategoryColor(rec.category))}>
              <Icon size={14} className="mr-1" />
              {rec.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground/90 leading-relaxed">
            {rec.description}
          </p>

          {rec.specialties && rec.specialties.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {activeTab === 'places-to-eat' ? 'Must Try' : 'Highlights'}
              </p>
              <div className="flex flex-wrap gap-2">
                {rec.specialties.map((specialty: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {rec.bestTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer size={16} />
              <span className="text-xs">Best time: {rec.bestTime}</span>
            </div>
          )}

          {rec.priceRange && (
            <div className="text-sm">
              <span className="text-muted-foreground">Price: </span>
              <span className="font-medium">{rec.priceRange}</span>
            </div>
          )}

          {rec.localTip && (
            <div className="bg-accent/20 p-3 rounded-lg">
              <p className="text-xs font-semibold text-accent-foreground mb-1">
                Local Tip
              </p>
              <p className="text-xs text-foreground/80 italic">
                {rec.localTip}
              </p>
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => openInMaps(rec.name)}
          >
            <MapTrifold size={16} className="mr-2" />
            View on Maps
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="things-to-do" className="flex items-center gap-2">
            <Compass size={18} />
            Things to Do
          </TabsTrigger>
          <TabsTrigger value="places-to-eat" className="flex items-center gap-2">
            <ForkKnife size={18} />
            Places to Eat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="things-to-do" className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Popular Attractions</h3>
                <p className="text-sm text-muted-foreground">Well-known places worth visiting</p>
              </div>
              <Button variant="ghost" size="sm" onClick={loadRecommendations}>
                <NavigationArrow size={16} className="mr-2" />
                Refresh
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, idx) => (
                <RecommendationCard key={idx} rec={rec} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkle size={20} className="text-accent" />
              <div>
                <h3 className="text-lg font-semibold">Off the Beaten Track</h3>
                <p className="text-sm text-muted-foreground">Hidden gems and local favorites</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offTheBeaten.map((rec, idx) => (
                <RecommendationCard key={idx} rec={rec} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="places-to-eat" className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Popular Restaurants</h3>
                <p className="text-sm text-muted-foreground">Well-reviewed dining spots</p>
              </div>
              <Button variant="ghost" size="sm" onClick={loadRecommendations}>
                <NavigationArrow size={16} className="mr-2" />
                Refresh
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, idx) => (
                <RecommendationCard key={idx} rec={rec} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkle size={20} className="text-accent" />
              <div>
                <h3 className="text-lg font-semibold">Off the Beaten Track</h3>
                <p className="text-sm text-muted-foreground">Hidden culinary gems and local favorites</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offTheBeaten.map((rec, idx) => (
                <RecommendationCard key={idx} rec={rec} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
