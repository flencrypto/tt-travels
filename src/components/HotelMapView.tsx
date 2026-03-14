import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { HotelOffer } from '@/lib/types'
import { Buildings, House, MapPin, X } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { differenceInDays, format } from 'date-fns'

interface HotelMapViewProps {
  hotels: HotelOffer[]
  provider: 'hotels' | 'airbnb'
  onSelectHotel: (hotel: HotelOffer) => void
}

interface HotelLocation {
  hotel: HotelOffer
  x: number
  y: number
  lat: number
  lng: number
}

export function HotelMapView({ hotels, provider, onSelectHotel }: HotelMapViewProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedHotel, setSelectedHotel] = useState<HotelOffer | null>(null)
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
    if (!svgRef.current || hotels.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions
    const margin = { top: 40, right: 40, bottom: 40, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const hotelLocations: HotelLocation[] = hotels.map((hotel, i) => {
      const angle = (i / hotels.length) * 2 * Math.PI
      const radius = Math.min(innerWidth, innerHeight) * 0.35
      const centerX = innerWidth / 2
      const centerY = innerHeight / 2
      
      const jitter = () => (Math.random() - 0.5) * 60
      
      return {
        hotel,
        x: centerX + Math.cos(angle) * radius + jitter(),
        y: centerY + Math.sin(angle) * radius + jitter(),
        lat: 48.8566 + (Math.random() - 0.5) * 0.1,
        lng: 2.3522 + (Math.random() - 0.5) * 0.1,
      }
    })

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const defs = svg.append('defs')
    const gradient = defs.append('radialGradient')
      .attr('id', 'map-gradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'oklch(0.75 0.10 240)')
      .attr('stop-opacity', 0.1)

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'oklch(0.45 0.15 250)')
      .attr('stop-opacity', 0.05)

    g.append('circle')
      .attr('cx', innerWidth / 2)
      .attr('cy', innerHeight / 2)
      .attr('r', Math.min(innerWidth, innerHeight) * 0.45)
      .attr('fill', 'url(#map-gradient)')
      .attr('opacity', 0.6)

    const gridLines = 12
    for (let i = 0; i < gridLines; i++) {
      const angle = (i / gridLines) * 2 * Math.PI
      const radius = Math.min(innerWidth, innerHeight) * 0.45
      
      g.append('line')
        .attr('x1', innerWidth / 2)
        .attr('y1', innerHeight / 2)
        .attr('x2', innerWidth / 2 + Math.cos(angle) * radius)
        .attr('y2', innerHeight / 2 + Math.sin(angle) * radius)
        .attr('stroke', 'oklch(0.85 0.02 240)')
        .attr('stroke-width', 1)
        .attr('opacity', 0.2)
    }

    const circles = [0.25, 0.5, 0.75, 1]
    circles.forEach(scale => {
      g.append('circle')
        .attr('cx', innerWidth / 2)
        .attr('cy', innerHeight / 2)
        .attr('r', Math.min(innerWidth, innerHeight) * 0.45 * scale)
        .attr('fill', 'none')
        .attr('stroke', 'oklch(0.85 0.02 240)')
        .attr('stroke-width', 1)
        .attr('opacity', 0.3)
    })

    const priceExtent = d3.extent(
      hotelLocations.map(loc => parseFloat(loc.hotel.offers?.[0]?.price.total || '0'))
    ) as [number, number]

    const radiusScale = d3.scaleSqrt()
      .domain(priceExtent)
      .range([8, 24])

    const markers = g.selectAll('.marker')
      .data(hotelLocations)
      .enter()
      .append('g')
      .attr('class', 'marker')
      .attr('transform', (d: HotelLocation) => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')

    markers.append('circle')
      .attr('r', (d: HotelLocation) => radiusScale(parseFloat(d.hotel.offers?.[0]?.price.total || '0')))
      .attr('fill', 'oklch(0.45 0.15 250)')
      .attr('stroke', 'oklch(1 0 0)')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.85)
      .on('mouseover', function(this: SVGCircleElement) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3)
          .attr('r', function(this: SVGCircleElement) {
            return parseFloat(d3.select(this).attr('r')) * 1.15
          })
      })
      .on('mouseout', function(this: SVGCircleElement, _event: MouseEvent, d: HotelLocation) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.85)
          .attr('stroke-width', 2.5)
          .attr('r', radiusScale(parseFloat(d.hotel.offers?.[0]?.price.total || '0')))
      })
      .on('click', (_event: MouseEvent, d: HotelLocation) => {
        setSelectedHotel(d.hotel)
      })

    markers.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .text((d: HotelLocation) => d.hotel.offers?.[0]?.price.currency === 'USD' ? '$' : d.hotel.offers?.[0]?.price.currency || '')

    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', 'oklch(0.20 0 0)')
      .text(`${provider === 'hotels' ? 'Hotel' : 'Airbnb'} Locations Map`)

  }, [hotels, dimensions, provider])

  if (hotels.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 glass-surface rounded-lg border">
        <div className="text-center space-y-3">
          <MapPin size={48} className="text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Search for {provider === 'hotels' ? 'hotels' : 'Airbnb listings'} to view them on the map
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

      {selectedHotel && (
        <div className="glass-surface p-6 rounded-lg border border-accent animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {provider === 'hotels' ? (
                <Buildings size={32} weight="fill" className="text-primary mt-1" />
              ) : (
                <House size={32} weight="fill" className="text-primary mt-1" />
              )}
              <div className="flex-1 space-y-2">
                <h4 className="text-xl font-bold">{selectedHotel.hotel.name}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={16} />
                  <span>{selectedHotel.hotel.cityCode || 'City not specified'}</span>
                </div>
                {selectedHotel.offers?.[0] && (
                  <div className="text-sm space-y-1 mt-3">
                    <div>
                      <span className="font-medium">Check-in:</span>{' '}
                      {format(new Date(selectedHotel.offers[0].checkInDate), 'PPP')}
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span>{' '}
                      {format(new Date(selectedHotel.offers[0].checkOutDate), 'PPP')}
                    </div>
                    <div>
                      <span className="font-medium">{provider === 'hotels' ? 'Room' : 'Property'}:</span>{' '}
                      {selectedHotel.offers[0].room.type}
                    </div>
                    <div>
                      <span className="font-medium">Guests:</span>{' '}
                      {selectedHotel.offers[0].guests.adults} adult(s)
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right space-y-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4"
              >
                <X size={20} />
              </Button>
              {selectedHotel.offers?.[0] && (
                <>
                  <div className="text-3xl font-bold text-accent mt-8">
                    ${parseFloat(selectedHotel.offers[0].price.total).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedHotel.offers[0].price.currency} total
                  </div>
                  <div className="text-sm text-muted-foreground">
                    $
                    {(
                      parseFloat(selectedHotel.offers[0].price.total) /
                      differenceInDays(
                        new Date(selectedHotel.offers[0].checkOutDate),
                        new Date(selectedHotel.offers[0].checkInDate)
                      )
                    ).toFixed(2)}{' '}
                    / night
                  </div>
                  <Button
                    onClick={() => onSelectHotel(selectedHotel)}
                    className="gap-2 mt-4"
                    size="lg"
                  >
                    Save to Trip
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="glass-surface p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {hotels.length} {provider === 'hotels' ? 'hotels' : 'Airbnb listings'}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-white" />
              <span>Lower price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary border-2 border-white" />
              <span>Higher price</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
