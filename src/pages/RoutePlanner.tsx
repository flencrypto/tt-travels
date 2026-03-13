import { useState } from 'react'
import { MapTrifold, Plus, Trash, Clock, MapPin, Car, Airplane, X, ArrowsClockwise, NavigationArrow, Sparkle } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { geocodeLocation, calculateDistance, formatDistance, formatDuration, getTransportMode } from '@/lib/geo'
import { motion, AnimatePresence } from 'framer-motion'
import { RouteMapView } from '@/components/RouteMapView'

interface Destination {
  id: string
  name: string
  lat?: number
  lon?: number
  geocoded: boolean
}

interface RouteSegment {
  from: string
  to: string
  distance: number
  duration: number
  mode: 'driving' | 'flight'
}

export function RoutePlanner() {
  const [destinations, setDestinations] = useState<Destination[]>([
    { id: '1', name: '', geocoded: false },
    { id: '2', name: '', geocoded: false }
  ])
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([])
  const [totalDistance, setTotalDistance] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [loading, setLoading] = useState(false)
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [isOptimized, setIsOptimized] = useState(false)

  const addDestination = () => {
    const newId = (Math.max(...destinations.map(d => parseInt(d.id))) + 1).toString()
    setDestinations([...destinations, { id: newId, name: '', geocoded: false }])
  }

  const removeDestination = (id: string) => {
    if (destinations.length <= 2) {
      toast.error('Route must have at least 2 destinations')
      return
    }
    setDestinations(destinations.filter(d => d.id !== id))
    setRouteSegments([])
  }

  const updateDestination = (id: string, name: string) => {
    setDestinations(destinations.map(d => 
      d.id === id ? { ...d, name, geocoded: false, lat: undefined, lon: undefined } : d
    ))
    setRouteSegments([])
    setIsOptimized(false)
  }

  const reorderDestinations = (fromIndex: number, direction: 'up' | 'down') => {
    const newDestinations = [...destinations]
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    
    if (toIndex < 0 || toIndex >= newDestinations.length) return
    
    [newDestinations[fromIndex], newDestinations[toIndex]] = 
    [newDestinations[toIndex], newDestinations[fromIndex]]
    
    setDestinations(newDestinations)
    setRouteSegments([])
    setIsOptimized(false)
  }

  const useCurrentLocationAsStart = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords
      setCurrentLocation({ lat: latitude, lon: longitude })

      const locationName = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
      
      setDestinations(destinations.map((d, i) => 
        i === 0 
          ? { ...d, name: locationName, lat: latitude, lon: longitude, geocoded: true }
          : d
      ))

      toast.success('Using current location as starting point')
    } catch (error) {
      toast.error('Unable to retrieve your location')
    }
  }

  const calculateRoute = async () => {
    const emptyDestinations = destinations.filter(d => !d.name.trim())
    if (emptyDestinations.length > 0) {
      toast.error('Please fill in all destination names')
      return
    }

    setLoading(true)
    setRouteSegments([])
    
    try {
      const geocodedDestinations: Destination[] = []
      
      for (const dest of destinations) {
        if (dest.geocoded && dest.lat !== undefined && dest.lon !== undefined) {
          geocodedDestinations.push(dest)
          continue
        }

        const results = await geocodeLocation(dest.name)
        
        if (results.length === 0) {
          toast.error(`Could not find location: ${dest.name}`)
          setLoading(false)
          return
        }

        const bestMatch = results[0]
        geocodedDestinations.push({
          ...dest,
          lat: bestMatch.latitude,
          lon: bestMatch.longitude,
          geocoded: true
        })
      }

      setDestinations(geocodedDestinations)

      const segments: RouteSegment[] = []
      let totalDist = 0
      let totalTime = 0

      for (let i = 0; i < geocodedDestinations.length - 1; i++) {
        const from = geocodedDestinations[i]
        const to = geocodedDestinations[i + 1]

        const distance = calculateDistance(
          from.lat!,
          from.lon!,
          to.lat!,
          to.lon!
        )

        const mode = getTransportMode(distance)
        const duration = mode === 'driving' 
          ? distance / 80
          : distance / 800

        segments.push({
          from: from.name,
          to: to.name,
          distance,
          duration,
          mode
        })

        totalDist += distance
        totalTime += duration
      }

      setRouteSegments(segments)
      setTotalDistance(totalDist)
      setTotalDuration(totalTime)
      
      toast.success('Route calculated successfully!')
    } catch (error) {
      console.error('Route calculation error:', error)
      toast.error('Failed to calculate route')
    } finally {
      setLoading(false)
    }
  }

  const clearRoute = () => {
    setDestinations([
      { id: '1', name: '', geocoded: false },
      { id: '2', name: '', geocoded: false }
    ])
    setRouteSegments([])
    setTotalDistance(0)
    setTotalDuration(0)
    setCurrentLocation(null)
    setIsOptimized(false)
  }

  const optimizeRoute = async () => {
    if (destinations.length < 3) {
      toast.error('Need at least 3 destinations to optimize')
      return
    }

    const geocodedDests = destinations.filter(d => d.geocoded && d.lat !== undefined && d.lon !== undefined)
    
    if (geocodedDests.length < destinations.length) {
      toast.error('Please calculate route first before optimizing')
      return
    }

    setLoading(true)
    
    try {
      const firstDest = geocodedDests[0]
      const lastDest = geocodedDests[geocodedDests.length - 1]
      const middleDests = geocodedDests.slice(1, -1)

      if (middleDests.length === 0) {
        toast.info('Route already optimal with only 2 destinations')
        setLoading(false)
        return
      }

      const optimizedMiddle = nearestNeighborOptimization(
        firstDest,
        middleDests,
        lastDest
      )

      const optimizedRoute = [firstDest, ...optimizedMiddle, lastDest]
      
      setDestinations(optimizedRoute)

      const segments: RouteSegment[] = []
      let totalDist = 0
      let totalTime = 0

      for (let i = 0; i < optimizedRoute.length - 1; i++) {
        const from = optimizedRoute[i]
        const to = optimizedRoute[i + 1]

        const distance = calculateDistance(
          from.lat!,
          from.lon!,
          to.lat!,
          to.lon!
        )

        const mode = getTransportMode(distance)
        const duration = mode === 'driving' 
          ? distance / 80
          : distance / 800

        segments.push({
          from: from.name,
          to: to.name,
          distance,
          duration,
          mode
        })

        totalDist += distance
        totalTime += duration
      }

      const savedDistance = totalDistance - totalDist
      const savedTime = totalDuration - totalTime

      setRouteSegments(segments)
      setTotalDistance(totalDist)
      setTotalDuration(totalTime)

      if (savedDistance > 0) {
        setIsOptimized(true)
        toast.success(
          `Route optimized! Saved ${formatDistance(savedDistance, unit)} and ${formatDuration(savedTime)}`,
          { duration: 5000 }
        )
      } else {
        setIsOptimized(true)
        toast.success('Route is already optimal!')
      }
    } catch (error) {
      console.error('Optimization error:', error)
      toast.error('Failed to optimize route')
    } finally {
      setLoading(false)
    }
  }

  const nearestNeighborOptimization = (
    start: Destination,
    waypoints: Destination[],
    end: Destination
  ): Destination[] => {
    if (waypoints.length === 0) return []
    if (waypoints.length === 1) return waypoints

    const unvisited = [...waypoints]
    const optimized: Destination[] = []
    let current = start

    while (unvisited.length > 0) {
      let nearestIndex = 0
      let nearestDistance = calculateDistance(
        current.lat!,
        current.lon!,
        unvisited[0].lat!,
        unvisited[0].lon!
      )

      for (let i = 1; i < unvisited.length; i++) {
        const distance = calculateDistance(
          current.lat!,
          current.lon!,
          unvisited[i].lat!,
          unvisited[i].lon!
        )

        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = i
        }
      }

      const nearest = unvisited.splice(nearestIndex, 1)[0]
      optimized.push(nearest)
      current = nearest
    }

    return optimized
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-3 rounded-xl">
            <MapTrifold size={28} weight="duotone" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Multi-Destination Route Planner</h1>
            <p className="text-muted-foreground">Plan your journey across multiple destinations</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={20} />
                Destinations
              </CardTitle>
              <CardDescription>
                Add destinations in the order you want to visit them
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {destinations.map((dest, index) => (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm mt-2">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder={index === 0 ? "Starting point" : `Destination ${index + 1}`}
                              value={dest.name}
                              onChange={(e) => updateDestination(dest.id, e.target.value)}
                              className="flex-1"
                            />
                            {destinations.length > 2 && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => removeDestination(dest.id)}
                              >
                                <Trash size={16} />
                              </Button>
                            )}
                          </div>

                          {index === 0 && !dest.geocoded && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={useCurrentLocationAsStart}
                              className="w-full"
                            >
                              <NavigationArrow size={16} />
                              Use Current Location
                            </Button>
                          )}

                          {dest.geocoded && (
                            <Badge variant="secondary" className="text-xs">
                              <MapPin size={12} className="mr-1" />
                              Located
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-col gap-1">
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => reorderDestinations(index, 'up')}
                              className="h-6 w-6"
                            >
                              ↑
                            </Button>
                          )}
                          {index < destinations.length - 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => reorderDestinations(index, 'down')}
                              className="h-6 w-6"
                            >
                              ↓
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={addDestination}
                  className="flex-1"
                >
                  <Plus size={18} />
                  Add Destination
                </Button>
                
                {destinations.length > 2 && (
                  <Button
                    variant="ghost"
                    onClick={clearRoute}
                    size="icon"
                  >
                    <X size={18} />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>Distance Unit</Label>
                <Select value={unit} onValueChange={(v) => setUnit(v as 'metric' | 'imperial')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Kilometers (km)</SelectItem>
                    <SelectItem value="imperial">Miles (mi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={calculateRoute}
                  disabled={loading}
                  className="flex-1"
                >
                  <ArrowsClockwise size={18} className={loading ? 'animate-spin' : ''} />
                  {loading ? 'Calculating...' : 'Calculate Route'}
                </Button>
              </div>

              {routeSegments.length > 0 && destinations.length > 2 && (
                <div className="space-y-2">
                  <Button
                    onClick={optimizeRoute}
                    disabled={loading}
                    variant="secondary"
                    className="w-full"
                  >
                    <Sparkle size={18} weight="duotone" />
                    Optimize Route Order
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Reorder waypoints to minimize total travel distance and time
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            {routeSegments.length > 0 && (
              <>
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Clock size={20} />
                        Route Summary
                      </CardTitle>
                      {isOptimized && (
                        <Badge className="bg-accent text-accent-foreground gap-1">
                          <Sparkle size={14} weight="fill" />
                          Optimized
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Distance</p>
                        <p className="text-2xl font-bold">
                          {formatDistance(totalDistance, unit)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Total Travel Time</p>
                        <p className="text-2xl font-bold">
                          {formatDuration(totalDuration)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Number of Stops</p>
                      <p className="text-xl font-semibold">{destinations.length}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Route Segments</CardTitle>
                    <CardDescription>
                      Breakdown of each leg of your journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {routeSegments.map((segment, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg border bg-card/50 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                                <span className="text-muted-foreground">Leg {index + 1}</span>
                                {segment.mode === 'driving' ? (
                                  <Badge variant="secondary" className="gap-1">
                                    <Car size={12} />
                                    Drive
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="gap-1">
                                    <Airplane size={12} />
                                    Flight
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-sm">
                                  <span className="text-muted-foreground">From:</span> {segment.from}
                                </p>
                                <p className="text-sm">
                                  <span className="text-muted-foreground">To:</span> {segment.to}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 pt-2 border-t">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin size={14} className="text-muted-foreground" />
                              <span className="font-medium">{formatDistance(segment.distance, unit)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock size={14} className="text-muted-foreground" />
                              <span className="font-medium">{formatDuration(segment.duration)}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {routeSegments.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <MapTrifold size={48} className="text-muted-foreground mb-4" weight="duotone" />
                  <p className="text-muted-foreground mb-2">No route calculated yet</p>
                  <p className="text-sm text-muted-foreground">
                    Enter your destinations and click "Calculate Route"
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {routeSegments.length > 0 && (
          <div className="mt-6">
            <RouteMapView destinations={destinations} />
          </div>
        )}
      </div>
    </div>
  )
}
