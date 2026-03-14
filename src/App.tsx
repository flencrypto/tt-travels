import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { Navigation } from './components/Navigation'
import { Dashboard } from './pages/Dashboard'
import { Explore } from './pages/Explore'
import { AIPlanner } from './pages/AIPlanner'
import { RoutePlanner } from './pages/RoutePlanner'
import { Bookings } from './pages/Bookings'
import { Trips } from './pages/Trips'
import { Favorites } from './pages/Favorites'
import { Journal } from './pages/Journal'
import { Settings } from './pages/Settings'
import { Setup } from './pages/Setup'

export type Destination = {
  id: string
  name: string
  country: string
  description: string
  highlights: string[]
  image: string
  category: string
}

export type FavoriteDestination = Destination & {
  savedAt: string
  notes?: string
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/ai-planner" element={<AIPlanner />} />
              <Route path="/route-planner" element={<RoutePlanner />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
