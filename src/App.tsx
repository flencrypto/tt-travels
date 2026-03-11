import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Show } from '@clerk/react'
import { Navigation } from './components/Navigation'
import { Landing } from './pages/Landing'
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
import { useClerkSync } from './hooks/use-clerk-sync'
import { useTheme } from './hooks/use-theme'

function AppContent() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/' || location.pathname === '/landing'
  
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="min-h-screen bg-background">
        <Show when="signed-in">
          <Navigation />
        </Show>
        <Show when="signed-out">
          {!isLandingPage && <Navigation />}
        </Show>
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
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
    </>
  )
}

function App() {
  useClerkSync()
  useTheme()
  
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App