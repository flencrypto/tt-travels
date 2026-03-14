import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { MapPin, MapTrifold, X, Compass } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

interface Destination {
  id: string
  name: string
  lat: number
  lon: number
  order: number
}

interface RouteMapViewProps {
  destinations: Array<{
    id: string
    name: string
    lat?: number
    lon?: number
  }>
}

interface PlottedDestination extends Destination {
  x: number
  y: number
}

export function RouteMapView({ destinations }: RouteMapViewProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  const validDestinations = destinations.filter(
    (d): d is Destination => 
      d.lat !== undefined && d.lon !== undefined && d.name.trim() !== ''
  ).map((d, index) => ({
    id: d.id,
    name: d.name,
    lat: d.lat!,
    lon: d.lon!,
    order: index + 1
  }))

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
    if (!svgRef.current || validDestinations.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions
    const margin = { top: 60, right: 40, bottom: 40, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const latExtent = d3.extent(validDestinations.map(l => l.lat)) as [number, number]
    const lonExtent = d3.extent(validDestinations.map(l => l.lon)) as [number, number]

    const latPadding = Math.max((latExtent[1] - latExtent[0]) * 0.2, 0.5)
    const lonPadding = Math.max((lonExtent[1] - lonExtent[0]) * 0.2, 0.5)

    const xScale = d3.scaleLinear()
      .domain([lonExtent[0] - lonPadding, lonExtent[1] + lonPadding])
      .range([0, innerWidth])

    const yScale = d3.scaleLinear()
      .domain([latExtent[1] + latPadding, latExtent[0] - latPadding])
      .range([0, innerHeight])

    const plottedDestinations: PlottedDestination[] = validDestinations.map(dest => ({
      ...dest,
      x: xScale(dest.lon),
      y: yScale(dest.lat),
    }))

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const defs = svg.append('defs')
    
    const mapGradient = defs.append('linearGradient')
      .attr('id', 'route-map-gradient')
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
      .attr('fill', 'url(#route-map-gradient)')
      .attr('rx', 12)

    const gridPattern = defs.append('pattern')
      .attr('id', 'route-grid-pattern')
      .attr('width', 50)
      .attr('height', 50)
      .attr('patternUnits', 'userSpaceOnUse')

    gridPattern.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 1)
      .attr('fill', 'oklch(0.85 0.02 240)')
      .attr('opacity', 0.3)

    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'url(#route-grid-pattern)')
      .attr('rx', 12)

    if (plottedDestinations.length > 1) {
      const arrowMarker = defs.append('marker')
        .attr('id', 'route-arrow')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 8)
        .attr('refY', 5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')

      arrowMarker.append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', 'oklch(0.45 0.15 250)')
        .attr('opacity', 0.7)

      for (let i = 0; i < plottedDestinations.length - 1; i++) {
        const start = plottedDestinations[i]
        const end = plottedDestinations[i + 1]

        g.append('line')
          .attr('x1', start.x)
          .attr('y1', start.y)
          .attr('x2', end.x)
          .attr('y2', end.y)
          .attr('stroke', 'oklch(0.45 0.15 250)')
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', '10,5')
          .attr('stroke-linecap', 'round')
          .attr('opacity', 0)
          .attr('marker-end', 'url(#route-arrow)')
          .transition()
          .delay(i * 150)
          .duration(600)
          .attr('opacity', 0.6)

        const midX = (start.x + end.x) / 2
        const midY = (start.y + end.y) / 2

        g.append('circle')
          .attr('cx', midX)
          .attr('cy', midY)
          .attr('r', 0)
          .attr('fill', 'oklch(0.70 0.18 45)')
          .attr('opacity', 0.4)
          .transition()
          .delay(i * 150 + 300)
          .duration(400)
          .attr('r', 4)
      }
    }

    const markers = g.selectAll('.route-marker')
      .data(plottedDestinations)
      .enter()
      .append('g')
      .attr('class', 'route-marker')
      .attr('transform', (d: PlottedDestination) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')

    markers.append('circle')
      .attr('r', 0)
      .attr('fill', (d: PlottedDestination, i: number) => {
        if (i === 0) return 'oklch(0.60 0.20 140)'
        if (i === plottedDestinations.length - 1) return 'oklch(0.65 0.22 27)'
        return 'oklch(0.45 0.15 250)'
      })
      .attr('stroke', 'oklch(1 0 0)')
      .attr('stroke-width', 3)
      .attr('opacity', 0.95)
      .transition()
      .delay((_d, i) => i * 150 + 200)
      .duration(500)
      .attr('r', (d: PlottedDestination, i: number) => {
        if (i === 0 || i === plottedDestinations.length - 1) return 18
        return 15
      })

    markers.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)
      .text((d: PlottedDestination) => d.order)
      .transition()
      .delay((_d, i) => i * 150 + 700)
      .duration(300)
      .attr('opacity', 1)

    markers.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', -25)
      .attr('fill', 'oklch(0.20 0 0)')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .attr('opacity', 0)
      .text((d: PlottedDestination) => {
        const maxLength = 20
        return d.name.length > maxLength ? d.name.substring(0, maxLength) + '...' : d.name
      })
      .transition()
      .delay((_d, i) => i * 150 + 700)
      .duration(300)
      .attr('opacity', 0.9)

    markers.on('mouseover', function(this: SVGGElement) {
      const circle = d3.select(this).select('circle')
      const currentR = parseFloat(circle.attr('r'))
      circle
        .transition()
        .duration(200)
        .attr('r', currentR * 1.25)
        .attr('stroke-width', 4)
    })
    .on('mouseout', function(this: SVGGElement, _event: MouseEvent, d: PlottedDestination) {
      const index = plottedDestinations.indexOf(d)
      const baseR = (index === 0 || index === plottedDestinations.length - 1) ? 18 : 15
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('r', baseR)
        .attr('stroke-width', 3)
    })
    .on('click', (_event: MouseEvent, d: PlottedDestination) => {
      setSelectedDestination(d)
    })

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', '700')
      .attr('fill', 'oklch(0.20 0 0)')
      .text('Your Multi-Destination Route')

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '13px')
      .attr('font-weight', '500')
      .attr('fill', 'oklch(0.45 0.02 85)')
      .text(`${plottedDestinations.length} destination${plottedDestinations.length !== 1 ? 's' : ''}`)

  }, [validDestinations, dimensions])

  if (validDestinations.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 glass-surface rounded-lg border border-dashed">
        <div className="text-center space-y-3">
          <MapTrifold size={48} className="text-muted-foreground mx-auto" weight="duotone" />
          <p className="text-muted-foreground font-medium">
            Calculate your route to see the map
          </p>
          <p className="text-sm text-muted-foreground">
            Enter destinations and click "Calculate Route"
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="glass-surface rounded-lg border p-4 shadow-md">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      {selectedDestination && (
        <div className="glass-surface p-6 rounded-lg border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-300 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                {selectedDestination.order}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="text-xl font-bold">{selectedDestination.name}</h4>
                  <Badge variant="secondary" className="mt-2">
                    Stop {selectedDestination.order} of {validDestinations.length}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>Latitude: {selectedDestination.lat.toFixed(4)}°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Compass size={16} />
                    <span>Longitude: {selectedDestination.lon.toFixed(4)}°</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  {selectedDestination.order === 1 && (
                    <Badge className="bg-green-600 hover:bg-green-700">
                      Starting Point
                    </Badge>
                  )}
                  {selectedDestination.order === validDestinations.length && (
                    <Badge className="bg-red-600 hover:bg-red-700">
                      Final Destination
                    </Badge>
                  )}
                  {selectedDestination.order > 1 && selectedDestination.order < validDestinations.length && (
                    <Badge variant="outline">
                      Waypoint
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDestination(null)}
            >
              <X size={20} />
            </Button>
          </div>
        </div>
      )}

      <div className="glass-surface p-4 rounded-lg border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="text-sm text-muted-foreground">
            Route includes {validDestinations.length} destination{validDestinations.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white" style={{ background: 'oklch(0.60 0.20 140)' }} />
              <span>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white" style={{ background: 'oklch(0.45 0.15 250)' }} />
              <span>Waypoint</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-white" style={{ background: 'oklch(0.65 0.22 27)' }} />
              <span>End</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
