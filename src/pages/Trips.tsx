import { useState, useEffect } from 'react'
import { CalendarDots, Plus, Trash } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { Trip } from '@/lib/types'

export function Trips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('tt-travels-trips')
    if (saved) {
      setTrips(JSON.parse(saved))
    }
  }, [])

  const saveTrips = (newTrips: Trip[]) => {
    localStorage.setItem('tt-travels-trips', JSON.stringify(newTrips))
    setTrips(newTrips)
  }

  const handleAddTrip = () => {
    if (!formData.name || !formData.destination || !formData.startDate || !formData.endDate) {
      return
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      ...formData,
    }

    saveTrips([...trips, newTrip])
    setFormData({ name: '', destination: '', startDate: '', endDate: '' })
    setShowForm(false)
  }

  const handleRemoveTrip = (id: string) => {
    saveTrips(trips.filter((trip) => trip.id !== id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CalendarDots size={40} className="text-primary" weight="fill" />
              <h1 className="text-4xl font-bold">Trip Planner</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Organize and track your travel plans
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
            size="lg"
          >
            <Plus size={20} weight="bold" />
            Add Trip
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="max-w-4xl mx-auto glass-surface">
          <CardHeader>
            <CardTitle>New Trip</CardTitle>
            <CardDescription>Add a new trip to your planner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trip-name">Trip Name</Label>
                <Input
                  id="trip-name"
                  placeholder="Summer Vacation"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trip-destination">Destination</Label>
                <Input
                  id="trip-destination"
                  placeholder="Paris, France"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trip-start">Start Date</Label>
                <Input
                  id="trip-start"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trip-end">End Date</Label>
                <Input
                  id="trip-end"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddTrip} className="flex-1">
                Save Trip
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="max-w-4xl mx-auto space-y-4">
        {trips.length === 0 ? (
          <Card className="glass-surface">
            <CardContent className="p-12 text-center">
              <CalendarDots size={64} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">No trips planned yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click "Add Trip" to start planning your adventure
              </p>
            </CardContent>
          </Card>
        ) : (
          trips.map((trip) => (
            <Card key={trip.id} className="glass-surface">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl">{trip.name}</h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <CalendarDots size={16} />
                      {trip.destination}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRemoveTrip(trip.id)}
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
