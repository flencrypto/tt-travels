import { Link, useLocation } from 'react-router-dom'
import { House, MapPin, Camera, Sparkle, CalendarDots, Gear, Ticket, Moon, Sun, Heart } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { SyncStatusIndicator } from '@/components/SyncStatusIndicator'
import { ClerkSetupBanner } from '@/components/ClerkSetupBanner'

const routes = [
  { path: '/dashboard', label: 'Dashboard', icon: House },
  { path: '/explore', label: 'Explore', icon: MapPin },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/bookings', label: 'Bookings', icon: Ticket },
  { path: '/journal', label: 'Journal', icon: Camera },
  { path: '/ai-planner', label: 'AI Planner', icon: Sparkle },
  { path: '/trips', label: 'Trips', icon: CalendarDots },
  { path: '/settings', label: 'Settings', icon: Gear },
]

export function Navigation() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="glass-surface sticky top-0 z-50 border-b">
      <ClerkSetupBanner />
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            TT Travels
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {routes.map((route) => {
              const Icon = route.icon
              const isActive = location.pathname === route.path
              
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200',
                    isActive
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                  <span>{route.label}</span>
                </Link>
              )
            })}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="ml-2 rounded-full"
            >
              {theme === 'dark' ? (
                <Sun size={20} weight="fill" />
              ) : (
                <Moon size={20} weight="fill" />
              )}
            </Button>
            
            <SyncStatusIndicator />
            
            <Show when="signed-out">
              <div className="flex items-center gap-2 ml-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Sign Up</Button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <div className="ml-2">
                <UserButton />
              </div>
            </Show>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun size={20} weight="fill" />
              ) : (
                <Moon size={20} weight="fill" />
              )}
            </Button>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Link
              to="/settings"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Gear size={24} />
            </Link>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-1 mt-4 overflow-x-auto pb-2">
          {routes.slice(0, -1).map((route) => {
            const Icon = route.icon
            const isActive = location.pathname === route.path
            
            return (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200',
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                <span className="text-sm">{route.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
