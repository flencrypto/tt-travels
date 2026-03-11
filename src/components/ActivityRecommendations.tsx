import { useState, useEffect } from 'react'
import { Sparkle, Sun, CloudRain, Snowflake, Wind, MapTrifold, Info } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { generateWeatherActivities, type WeatherActivity } from '@/lib/api'

interface ActivityRecommendationsProps {
  destination: string
  temperature: number
  weatherCondition: string
  unit: string
}

export function ActivityRecommendations({
  destination,
  temperature,
  weatherCondition,
  unit,
}: ActivityRecommendationsProps) {
  const [activities, setActivities] = useState<WeatherActivity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getWeatherIcon = () => {
    const condition = weatherCondition.toLowerCase()
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return <CloudRain size={32} weight="fill" className="text-blue-500" />
    }
    if (condition.includes('snow')) {
      return <Snowflake size={32} weight="fill" className="text-blue-300" />
    }
    if (condition.includes('clear') || condition.includes('sun')) {
      return <Sun size={32} weight="fill" className="text-yellow-500" />
    }
    if (condition.includes('wind')) {
      return <Wind size={32} weight="fill" className="text-gray-500" />
    }
    return <MapTrifold size={32} weight="fill" className="text-accent" />
  }

  const getWeatherSummary = () => {
    const temp = Math.round(temperature)
    const condition = weatherCondition.toLowerCase()
    
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return `${temp}${unit} and rainy`
    }
    if (condition.includes('snow')) {
      return `${temp}${unit} and snowy`
    }
    if (temp > 25 && unit === '°C') {
      return `${temp}${unit} and warm`
    }
    if (temp > 77 && unit === '°F') {
      return `${temp}${unit} and warm`
    }
    if (temp < 10 && unit === '°C') {
      return `${temp}${unit} and cold`
    }
    if (temp < 50 && unit === '°F') {
      return `${temp}${unit} and cold`
    }
    return `${temp}${unit} and ${condition}`
  }

  const handleGenerateActivities = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await generateWeatherActivities(destination, temperature, weatherCondition, unit)
      setActivities(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate activity recommendations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGenerateActivities()
  }, [destination, temperature, weatherCondition])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Indoor': 'bg-purple-100 text-purple-800 border-purple-200',
      'Outdoor': 'bg-green-100 text-green-800 border-green-200',
      'Cultural': 'bg-blue-100 text-blue-800 border-blue-200',
      'Food & Dining': 'bg-orange-100 text-orange-800 border-orange-200',
      'Entertainment': 'bg-pink-100 text-pink-800 border-pink-200',
      'Nature': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Shopping': 'bg-amber-100 text-amber-800 border-amber-200',
      'Relaxation': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    }
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability.toLowerCase()) {
      case 'excellent':
        return 'bg-green-500'
      case 'good':
        return 'bg-blue-500'
      case 'fair':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card className="glass-surface">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {getWeatherIcon()}
              <CardTitle>Weather-Based Activity Recommendations</CardTitle>
            </div>
            <CardDescription>
              Personalized suggestions for {destination} based on current conditions: {getWeatherSummary()}
            </CardDescription>
          </div>
          <Button
            onClick={handleGenerateActivities}
            disabled={loading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {loading ? (
              <>
                <Sparkle size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Sparkle size={16} weight="fill" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <Info size={16} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-3 p-4 rounded-lg bg-muted/50">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-5/6" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && activities.length > 0 && (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-semibold text-lg">{activity.name}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {activity.description}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getCategoryColor(activity.category)} shrink-0`}
                    >
                      {activity.category}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Suitability:</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${getSuitabilityColor(activity.suitability)}`} />
                        <span className="text-xs font-medium capitalize">{activity.suitability}</span>
                      </div>
                    </div>

                    {activity.weatherReason && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Info size={14} />
                          <span>{activity.weatherReason}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {activity.tips && activity.tips.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-medium text-muted-foreground">Tips:</span>
                      <ul className="space-y-1">
                        {activity.tips.map((tip: string, tipIndex: number) => (
                          <li key={tipIndex} className="text-xs text-muted-foreground pl-3 relative before:content-['•'] before:absolute before:left-0">
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MapTrifold size={48} className="mx-auto mb-3 opacity-50" />
            <p>No activity recommendations available at the moment.</p>
            <Button
              onClick={handleGenerateActivities}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
