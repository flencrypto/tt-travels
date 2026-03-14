import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AirplaneTilt, Buildings, ChartLine } from '@phosphor-icons/react'
import { FlightSearch } from '@/components/FlightSearch'
import { HotelSearch } from '@/components/HotelSearch'
import { PriceComparisonChart } from '@/components/PriceComparisonChart'
import { AmadeusSetupBanner } from '@/components/AmadeusSetupBanner'
import { useKV } from '@github/spark/hooks'
import type { APIKeys } from '@/lib/types'

export function Bookings() {
  const [activeTab, setActiveTab] = useState('flights')
  const [apiKeys] = useKV<APIKeys>('tt-travels-api-keys', {})
  const [isAmadeusConfigured, setIsAmadeusConfigured] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const hasEnvKeys = !!(import.meta.env.VITE_AMADEUS_API_KEY && import.meta.env.VITE_AMADEUS_API_SECRET)
    const hasStoredKeys = !!(apiKeys?.amadeus_api_key && apiKeys?.amadeus_api_secret)
    setIsAmadeusConfigured(hasEnvKeys || hasStoredKeys)
  }, [apiKeys])

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Buildings size={40} className="text-primary" weight="fill" />
          <h1 className="text-4xl font-bold">Book Travel</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Search and compare flights and hotels in real-time
        </p>
      </div>

      {!isAmadeusConfigured && (
        <div className="max-w-6xl mx-auto">
          <AmadeusSetupBanner 
            isConfigured={isAmadeusConfigured}
            onNavigateToSettings={() => navigate('/settings')}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="flights" className="gap-2">
              <AirplaneTilt size={20} weight="fill" />
              Flights
            </TabsTrigger>
            <TabsTrigger value="hotels" className="gap-2">
              <Buildings size={20} weight="fill" />
              Hotels
            </TabsTrigger>
            <TabsTrigger value="price-trends" className="gap-2">
              <ChartLine size={20} weight="fill" />
              Price Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flights" className="mt-6">
            <Card className="glass-surface">
              <CardHeader>
                <CardTitle>Search Flights</CardTitle>
                <CardDescription>
                  Find the best flight deals powered by Amadeus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FlightSearch />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotels" className="mt-6">
            <Card className="glass-surface">
              <CardHeader>
                <CardTitle>Search Hotels</CardTitle>
                <CardDescription>
                  Discover great hotels at your destination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HotelSearch />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="price-trends" className="mt-6 space-y-6">
            <PriceComparisonChart type="flight" />
            <PriceComparisonChart type="hotel" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
