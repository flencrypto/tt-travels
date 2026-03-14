import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/react'
import { Toaster } from './components/ui/sonner'
import { Navigation } from './components/Navigation'
import { AuthStatus } from './components/AuthStatus'
import { ClerkSetupBanner } from './components/ClerkSetupBanner'
import { Landing } from './pages/Landing'
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

function AuthenticatedApp() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <>
      <ClerkSetupBanner />
      <Navigation />
      <main className="lg:ml-64">
        <div className="container mx-auto px-4 py-6">
          <AuthStatus />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </>
  )
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function App() {
  if (!clerkPubKey) {
    return (
      <div className="min-h-screen bg-background">
        <ClerkSetupBanner />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold">Welcome to TT Travels</h1>
            <p className="text-lg text-muted-foreground">
              Please configure Clerk authentication to continue. See the banner above for setup instructions.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <AuthenticatedApp />
        </div>
        <Toaster />
      </BrowserRouter>
    </ClerkProvider>
  )
}

export default App
