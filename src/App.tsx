import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { Dashboard } from './pages/Dashboard'
import { Explore } from './pages/Explore'
import { Favorites } from './pages/Favorites'
import { AIPlanner } from './pages/AIPlanner'
import { Journal } from './pages/Journal'
import { Trips } from './pages/Trips'
import { Settings } from './pages/Settings'
import { Setup } from './pages/Setup'
import { Bookings } from './pages/Bookings'
import { DestinationDetail } from './pages/DestinationDetail'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:destinationName" element={<DestinationDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/setup" element={<Setup />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </BrowserRouter>
  )
}

export default App