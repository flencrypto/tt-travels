import { Link } from 'react-router-dom'
import { Sparkle, MapPin, CalendarDots, Globe, Ticket, Heart, ArrowRight, MapTrifold, Camera } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFavorites } from '@/hooks/use-favorites'
import { useJournal } from '@/hooks/use-journal'
import { destinations } from '@/lib/destinations'

const FEATURE_CARDS = [
  {
    icon: Sparkle,
    title: 'AI Trip Planner',
    description: 'Let AI craft personalized itineraries just for you — flights, hotels, activities all in one.',
    to: '/ai-planner',
    color: 'from-rose-400/20 to-purple-400/20',
    accent: 'text-primary',
  },
  {
    icon: MapPin,
    title: 'Explore Destinations',
    description: 'Discover places worldwide with live weather, local tips, and activity recommendations.',
    to: '/explore',
    color: 'from-amber-400/20 to-rose-400/20',
    accent: 'text-accent',
  },
  {
    icon: Ticket,
    title: 'Book Travel',
    description: 'Search and compare flights and hotels to find the best deals for your journey.',
    to: '/bookings',
    color: 'from-purple-400/20 to-blue-400/20',
    accent: 'text-secondary',
  },
  {
    icon: Camera,
    title: 'Travel Journal',
    description: 'Document your adventures with photos, AI-powered captions, and social sharing.',
    to: '/journal',
    color: 'from-green-400/20 to-teal-400/20',
    accent: 'text-primary',
  },
  {
    icon: MapTrifold,
    title: 'Route Planner',
    description: 'Plan multi-stop routes with real distances, times, and interactive maps.',
    to: '/route-planner',
    color: 'from-blue-400/20 to-cyan-400/20',
    accent: 'text-secondary',
  },
  {
    icon: CalendarDots,
    title: 'Trip Manager',
    description: 'Organize all your trips, save flights & hotels, and keep everything in one place.',
    to: '/trips',
    color: 'from-pink-400/20 to-orange-400/20',
    accent: 'text-accent',
  },
]

const STATS = [
  { value: '10K+', label: 'Travelers', icon: Globe },
  { value: '500+', label: 'Destinations', icon: MapPin },
  { value: '25K+', label: 'Trips Planned', icon: Globe },
  { value: '4.9★', label: 'App Rating', icon: Sparkle },
]

const SHOWCASE_DESTINATIONS = [0, 1, 3, 4] // indices from destinations array

export function Dashboard() {
  const { favorites } = useFavorites()
  const { entries } = useJournal()
  const recentFavorites = favorites.slice(0, 3)
  const recentEntries = entries.slice(0, 2)

  return (
    <div className="min-h-screen -mx-4 -mt-6">

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="hero-section relative overflow-hidden px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Decorative orbs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative container mx-auto max-w-5xl text-center">
          <div className="eyebrow mb-4">✦ Your Luxury Travel Companion</div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="block">The World is</span>
            <span className="gradient-text block">Waiting for You</span>
          </h1>

          <p className="travel-quote text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            "Not all those who wander are lost — but they do have better itineraries."
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/ai-planner">
              <Button size="lg" className="gap-2 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                <Sparkle size={20} weight="fill" />
                Start with AI Planner
              </Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="gap-2 text-base border-gradient">
                <MapPin size={20} weight="fill" />
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────── */}
      <section className="bg-card/80 backdrop-blur-sm border-y border-border/50 py-8">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
                  <Icon size={24} weight="fill" className="text-primary mb-1 opacity-70" />
                  <span className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Destinations ─────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="eyebrow mb-2">Curated for You</div>
            <h2 className="text-3xl md:text-4xl font-bold">Dream Destinations</h2>
          </div>
          <Link to="/explore">
            <Button variant="ghost" className="gap-2 text-primary hover:text-primary">
              View All <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SHOWCASE_DESTINATIONS.map((idx, showcaseIndex) => {
            const dest = destinations[idx]
            if (!dest) return null
            const isLarge = showcaseIndex === 0
            return (
              <Link
                key={dest.id}
                to="/explore"
                className={`group relative overflow-hidden rounded-2xl ${isLarge ? 'sm:col-span-2 sm:row-span-2' : ''} card-luxury`}
                style={{ minHeight: isLarge ? '360px' : '200px' }}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="destination-overlay absolute inset-0" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Badge variant="secondary" className="mb-2 text-xs bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {dest.category}
                  </Badge>
                  <h3 className="text-white font-bold text-xl leading-tight">{dest.name}</h3>
                  <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                    <MapPin size={12} weight="fill" />
                    {dest.country}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Feature Grid ─────────────────────────────────────────────── */}
      <section className="hero-section py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <div className="eyebrow mb-2">Everything in One Place</div>
            <h2 className="text-3xl md:text-4xl font-bold">Your Complete Travel Hub</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              From dreaming to booking to blogging — TTs Travels has you covered every step of the journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURE_CARDS.map((feature) => {
              const Icon = feature.icon
              return (
                <Link key={feature.title} to={feature.to} className="group">
                  <Card className={`glass-surface card-luxury h-full border-border/50 overflow-hidden`}>
                    <CardContent className="p-6 space-y-4">
                      <div className={`feature-icon w-12 h-12 rounded-2xl flex items-center justify-center`}>
                        <Icon size={24} weight="fill" className={feature.accent} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 text-sm font-medium ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        Explore <ArrowRight size={16} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Recent Favorites ─────────────────────────────────────────── */}
      {recentFavorites.length > 0 && (
        <section className="container mx-auto px-6 py-16 max-w-6xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="eyebrow mb-2">Saved by You</div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Heart size={28} weight="fill" className="text-primary" />
                Your Favorites
              </h2>
            </div>
            <Link to="/favorites">
              <Button variant="ghost" className="gap-2 text-primary hover:text-primary">
                View All <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentFavorites.map((dest) => (
              <Link key={dest.id} to="/favorites" className="group">
                <Card className="glass-surface card-luxury overflow-hidden border-border/50">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin size={12} weight="fill" className="text-primary/60" />
                          {dest.country}
                        </p>
                      </div>
                      <Heart size={18} weight="fill" className="text-primary shrink-0" />
                    </div>
                    {dest.notes && (
                      <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2 line-clamp-2">
                        {dest.notes}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground pt-1 border-t border-border/40">
                      Saved {new Date(dest.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Journal Preview ───────────────────────────────────────────── */}
      {recentEntries.length > 0 && (
        <section className="hero-section py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="eyebrow mb-2">Your Stories</div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Camera size={28} weight="fill" className="text-primary" />
                  Travel Journal
                </h2>
              </div>
              <Link to="/journal">
                <Button variant="ghost" className="gap-2 text-primary hover:text-primary">
                  View Journal <ArrowRight size={18} />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentEntries.map((entry) => (
                <Link key={entry.id} to="/journal" className="group">
                  <Card className="glass-surface journal-card overflow-hidden border-border/50">
                    {entry.media.length > 0 && (
                      <div className="relative aspect-video overflow-hidden">
                        {entry.media[0].type === 'image' ? (
                          <img
                            src={entry.media[0].url}
                            alt={entry.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <video src={entry.media[0].url} className="w-full h-full object-cover" />
                        )}
                        <div className="destination-overlay absolute inset-0" />
                        {entry.location && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs">
                            <MapPin size={12} weight="fill" />
                            {entry.location}
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {entry.title}
                      </h3>
                      {entry.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {entry.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/40">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Section ──────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16 pb-24 max-w-4xl text-center">
        <div className="glass-surface rounded-3xl p-10 md:p-16 border border-border/50 relative overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <div className="eyebrow mb-3">Get Started Today</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Next Adventure<br />
              <span className="gradient-text">Starts Here</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join thousands of travelers who plan smarter, explore more, and document their journeys beautifully.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/ai-planner">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                  <Sparkle size={20} weight="fill" />
                  Plan with AI
                </Button>
              </Link>
              <Link to="/setup">
                <Button size="lg" variant="outline" className="gap-2">
                  Setup Integrations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
