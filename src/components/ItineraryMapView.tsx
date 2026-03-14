import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { MapPin, MapTrifold, X, Compass } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface Location {
  name: string
  lat: number
  lng: number
  type: 'destination' | 'attraction' | 'activity'
  description?: string
  day?: number
}

interface ItineraryMapViewProps {
  itinerary: string
  destination: string
}

interface PlottedLocation extends Location {
  x: number
  y: number
}

export function ItineraryMapView({ itinerary, destination }: ItineraryMapViewProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth
        const height = Math.max(500, Math.min(700, width * 0.6))
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const extractAndGeocodeLocations = async () => {
      if (!itinerary || !destination) return

      setLoading(true)
      try {
        const extractedLocations = await extractLocationsFromItinerary(itinerary, destination)
        setLocations(extractedLocations)
      } catch (error) {
        console.error('Failed to extract locations:', error)
      } finally {
        setLoading(false)
      }
    }

    extractAndGeocodeLocations()
  }, [itinerary, destination])

  useEffect(() => {
    if (!svgRef.current || locations.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions
    const margin = { top: 50, right: 40, bottom: 40, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const latExtent = d3.extent(locations.map(l => l.lat)) as [number, number]
    const lngExtent = d3.extent(locations.map(l => l.lng)) as [number, number]

    const latPadding = (latExtent[1] - latExtent[0]) * 0.2 || 0.1
    const lngPadding = (lngExtent[1] - lngExtent[0]) * 0.2 || 0.1

    const xScale = d3.scaleLinear()
      .domain([lngExtent[0] - lngPadding, lngExtent[1] + lngPadding])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([latExtent[1] + latPadding, latExtent[0] - latPadding])
      .range([0, innerHeight])

    const plottedLocations: PlottedLocation[] = locations.map(loc => ({
      ...loc,
      x: xScale(loc.lng),
      y: yScale(loc.lat),
    }))

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const defs = svg.append('defs')
    
    const mapGradient = defs.append('linearGradient')
      .attr('id', 'itinerary-map-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%')

    mapGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'oklch(0.75 0.10 240)')
      .attr('stop-opacity', 0.05)

    mapGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'oklch(0.70 0.18 45)')
      .attr('stop-opacity', 0.08)

    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'url(#itinerary-map-gradient)')
      .attr('rx', 8)

    const gridPattern = defs.append('pattern')
      .attr('id', 'grid-pattern')
      .attr('width', 40)
      .attr('height', 40)
      .attr('patternUnits', 'userSpaceOnUse')

    gridPattern.append('path')
      .attr('d', 'M 40 0 L 0 0 0 40')
      .attr('fill', 'none')
      .attr('stroke', 'oklch(0.85 0.02 240)')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.3)

    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'url(#grid-pattern)')
      .attr('rx', 8)

    if (plottedLocations.length > 1) {
      const pathData = d3.line<PlottedLocation>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveCatmullRom.alpha(0.5))

      const sortedByDay = [...plottedLocations].sort((a, b) => (a.day || 0) - (b.day || 0))

      g.append('path')
        .datum(sortedByDay)
        .attr('d', pathData)
        .attr('fill', 'none')
        .attr('stroke', 'oklch(0.70 0.18 45)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '8,4')
        .attr('opacity', 0.4)
        .attr('stroke-linecap', 'round')
    }

    const colorScale = d3.scaleOrdinal<string>()
      .domain(['destination', 'attraction', 'activity'])
      .range(['oklch(0.45 0.15 250)', 'oklch(0.70 0.18 45)', 'oklch(0.75 0.10 240)'])

    const markers = g.selectAll('.marker')
      .data(plottedLocations)
      .enter()
      .append('g')
      .attr('class', 'marker')
      .attr('transform', (d: PlottedLocation) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')

    markers.append('circle')
      .attr('r', 0)
      .attr('fill', (d: PlottedLocation) => colorScale(d.type))
      .attr('stroke', 'oklch(1 0 0)')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.9)
      .transition()
      .delay((_d, i) => i * 100)
      .duration(500)
      .attr('r', (d: PlottedLocation) => d.type === 'destination' ? 14 : 10)

    markers.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)
      .text((d: PlottedLocation) => d.type === 'destination' ? '★' : (d.day?.toString() || '•'))
      .transition()
      .delay((_d, i) => i * 100 + 500)
      .duration(300)
      .attr('opacity', 1)

    markers.on('mouseover', function(this: SVGGElement) {
      const circle = d3.select(this).select('circle')
      const currentR = parseFloat(circle.attr('r'))
      circle
        .transition()
        .duration(200)
        .attr('r', currentR * 1.3)
        .attr('stroke-width', 3.5)
    })
    .on('mouseout', function(this: SVGGElement, _event: MouseEvent, d: PlottedLocation) {
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', d.type === 'destination' ? 14 : 10)
        .attr('stroke-width', 2.5)
    })
    .on('click', (_event: MouseEvent, d: PlottedLocation) => {
      setSelectedLocation(d)
    })

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', '600')
      .attr('fill', 'oklch(0.20 0 0)')
      .text(`${destination} - Itinerary Locations`)

  }, [locations, dimensions, destination])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 glass-surface rounded-lg border">
        <div className="text-center space-y-3">
          <Compass size={48} className="text-primary mx-auto animate-spin" />
          <p className="text-muted-foreground">Mapping your itinerary locations...</p>
        </div>
      </div>
    )
  }

  if (locations.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 glass-surface rounded-lg border">
        <div className="text-center space-y-3">
          <MapTrifold size={48} className="text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Generate an itinerary to see recommended locations on the map
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="glass-surface rounded-lg border p-4">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {selectedLocation && (
        <div className="glass-surface p-6 rounded-lg border border-accent animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <MapPin size={32} weight="fill" className="text-primary mt-1" />
              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="text-xl font-bold">{selectedLocation.name}</h4>
                  {selectedLocation.day && (
                    <Badge variant="secondary" className="mt-2">
                      Day {selectedLocation.day}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{selectedLocation.lat.toFixed(4)}°, {selectedLocation.lng.toFixed(4)}°</span>
                  </div>
                </div>
                {selectedLocation.description && (
                  <p className="text-sm">{selectedLocation.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="capitalize"
                  >
                    {selectedLocation.type}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLocation(null)}
            >
              <X size={20} />
            </Button>
          </div>
        </div>
      )}

      <div className="glass-surface p-4 rounded-lg border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {locations.length} location{locations.length !== 1 ? 's' : ''} on your itinerary
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ background: 'oklch(0.45 0.15 250)' }} />
              <span>Main Destination</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'oklch(0.70 0.18 45)' }} />
              <span>Attractions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'oklch(0.75 0.10 240)' }} />
              <span>Activities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function extractLocationsFromItinerary(itinerary: string, destination: string): Promise<Location[]> {
  const promptText = `You are a travel location extraction expert. Analyze the following travel itinerary and extract all specific locations, landmarks, attractions, and places mentioned.

Itinerary for ${destination}:
${itinerary}

Extract and return a JSON array of locations. For each location include:
- name: The specific name of the location/landmark/attraction
- type: Either "destination" (the main city/destination), "attraction" (museums, monuments, landmarks), or "activity" (restaurants, markets, parks, venues)
- description: A very brief 1-sentence description
- day: Which day number it appears in (if mentioned, otherwise null)

IMPORTANT: Only include locations that are SPECIFIC places with names (not generic activities like "breakfast" or "shopping"). Focus on named landmarks, museums, restaurants, parks, neighborhoods, etc.

Return ONLY a valid JSON object in this exact format:
{
  "locations": [
    {"name": "Eiffel Tower", "type": "attraction", "description": "Iconic iron lattice tower", "day": 1},
    {"name": "Le Marais", "type": "activity", "description": "Historic district with cafes and shops", "day": 2},
    {"name": "Paris", "type": "destination", "description": "Main destination city", "day": null}
  ]
}

Focus on the most important 10-15 locations from the itinerary.`

  try {
    const result = await spark.llm(promptText, 'gpt-4o-mini', true)
    const parsed = JSON.parse(result)
    const extractedLocations = parsed.locations || []

    const locationsWithCoords = await Promise.all(
      extractedLocations.map(async (loc: { name: string; type: string; description?: string; day?: number }) => {
        const coords = await geocodeLocation(`${loc.name}, ${destination}`)
        if (coords) {
          return {
            name: loc.name,
            lat: coords.lat,
            lng: coords.lng,
            type: loc.type as 'destination' | 'attraction' | 'activity',
            description: loc.description,
            day: loc.day,
          }
        }
        return null
      })
    )

    return locationsWithCoords.filter((loc): loc is Location => loc !== null)
  } catch (error) {
    console.error('Failed to extract locations:', error)
    return []
  }
}

async function geocodeLocation(locationName: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    
    if (!data.results || data.results.length === 0) {
      return null
    }

    return {
      lat: data.results[0].latitude,
      lng: data.results[0].longitude,
    }
  } catch (error) {
    console.error(`Failed to geocode ${locationName}:`, error)
    return null
  }
}
