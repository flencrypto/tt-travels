import { Link, useLocation } from 'react-router-dom'
import { House, MapPin, Camera, Sparkle, CalendarDots, Gear, Ticket, Moon, Sun, Heart, MapTrifold } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { SyncStatusIndicator } from '@/components/SyncStatusIndicator'
import { ClerkSetupBanner } from '@/components/ClerkSetupBanner'
import { TtsLogo } from '@/components/TtsLogo'

const routes = [
  { path: '/', label: 'Home', icon: House },
  { path: '/explore', label: 'Explore', icon: MapPin },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/bookings', label: 'Bookings', icon: Ticket },
  { path: '/journal', label: 'Journal', icon: Camera },
  { path: '/ai-planner', label: 'AI Planner', icon: Sparkle },
  { path: '/route-planner', label: 'Routes', icon: MapTrifold },
  { path: '/trips', label: 'Trips', icon: CalendarDots },
  { path: '/settings', label: 'Settings', icon: Gear },
]

// Routes shown in mobile bottom nav (most important ones)
const mobileRoutes = [
  { path: '/', label: 'Home', icon: House },
  { path: '/explore', label: 'Explore', icon: MapPin },
  { path: '/journal', label: 'Journal', icon: Camera },
  { path: '/ai-planner', label: 'AI', icon: Sparkle },
  { path: '/favorites', label: 'Saved', icon: Heart },
]

export function Navigation() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <header className="glass-surface sticky top-0 z-50 border-b border-border/40">
        <ClerkSetupBanner />
        <nav className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0" aria-label="TTs Travels home">
              <TtsLogo size={32} />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {routes.slice(0, -1).map((route) => {
                const Icon = route.icon
                const isActive = location.pathname === route.path
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={cn(
                      'relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'
                    )}
                  >
                    <Icon size={16} weight={isActive ? 'fill' : 'regular'} />
                    <span>{route.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-xl h-9 w-9"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={18} weight="fill" />
                ) : (
                  <Moon size={18} weight="fill" />
                )}
              </Button>

              <div className="hidden md:flex items-center">
                <SyncStatusIndicator />
              </div>

              <Show when="signed-out">
                <div className="hidden md:flex items-center gap-2">
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="text-sm">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm" className="text-sm shadow-sm shadow-primary/20">Sign Up</Button>
                  </SignUpButton>
                </div>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>

              <Link
                to="/settings"
                className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
                aria-label="Settings"
              >
                <Gear size={20} />
              </Link>
            </div>
          </div>

          {/* Tablet nav scrollbar */}
          <div className="hidden md:flex lg:hidden items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {routes.slice(0, -1).map((route) => {
              const Icon = route.icon
              const isActive = location.pathname === route.path
              return (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap text-sm transition-all duration-200 shrink-0',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  <Icon size={15} weight={isActive ? 'fill' : 'regular'} />
                  <span>{route.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </header>

      {/* Mobile bottom navigation bar */}
      <div className="mobile-bottom-nav md:hidden safe-area-inset-bottom" role="navigation" aria-label="Mobile navigation">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileRoutes.map((route) => {
            const Icon = route.icon
            const isActive = location.pathname === route.path
            return (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[52px]',
                  isActive
                    ? 'text-primary'
                    : 'text-foreground/50 hover:text-foreground/80'
                )}
              >
                <Icon
                  size={22}
                  weight={isActive ? 'fill' : 'regular'}
                />
                <span className="text-[10px] font-medium">{route.label}</span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16" aria-hidden="true" />
    </>
  )
}
