import { Link } from 'react-router-dom'
import { SignInButton, SignUpButton } from '@clerk/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Sparkle, 
  MapPin, 
  CalendarDots, 
  Camera, 
  Airplane, 
  Compass,
  ChartLine,
  MapTrifold,
  Heart,
  ArrowRight,
  CheckCircle
} from '@phosphor-icons/react'

export function Landing() {
  const features = [
    {
      icon: Sparkle,
      title: 'AI-Powered Planning',
      description: 'Generate personalized itineraries and discover destinations tailored to your preferences with advanced AI technology.'
    },
    {
      icon: Airplane,
      title: 'Flight & Hotel Booking',
      description: 'Search real-time flight and hotel options with price comparison across dates to find the best deals.'
    },
    {
      icon: MapTrifold,
      title: 'Smart Exploration',
      description: 'Discover local gems and activities with weather-based recommendations and geo-location insights.'
    },
    {
      icon: ChartLine,
      title: 'Price Analytics',
      description: 'Visual price trends help you identify the perfect time to book your next adventure.'
    },
    {
      icon: CalendarDots,
      title: 'Trip Management',
      description: 'Organize all your travels in one place with comprehensive trip tracking and planning tools.'
    },
    {
      icon: Camera,
      title: 'Travel Journal',
      description: 'Capture and preserve your travel memories with a beautiful photo journal.'
    }
  ]

  const benefits = [
    'AI-generated personalized itineraries',
    'Real-time flight and hotel search',
    'Weather-based packing lists',
    'Local recommendations and hidden gems',
    'Price comparison across dates',
    'Interactive maps and location data',
    'Trip organization and favorites',
    'Photo journal for memories'
  ]

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.70_0.18_45/0.15),transparent_50%),radial-gradient(circle_at_70%_60%,oklch(0.45_0.15_250/0.1),transparent_50%)]" />
        
        <div className="container relative mx-auto px-6 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent-foreground">
              <Sparkle size={16} weight="fill" />
              AI-Powered Travel Platform
            </div>
            
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Plan Your Next{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Adventure
              </span>
            </h1>
            
            <p className="mb-10 text-xl text-muted-foreground md:text-2xl">
              Your AI-powered travel command center. Search flights, discover destinations, 
              generate itineraries, and organize every detail of your journey in one beautiful platform.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <SignUpButton mode="modal">
                <Button size="lg" className="group gap-2 text-lg">
                  Get Started Free
                  <ArrowRight size={20} weight="bold" className="transition-transform group-hover:translate-x-1" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button size="lg" variant="outline" className="text-lg">
                  Sign In
                </Button>
              </SignInButton>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required · Free to start · Explore unlimited destinations
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Everything You Need to Travel Smarter
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From AI-powered planning to real-time booking, TT Travels brings all your travel tools together.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group glass-surface cursor-pointer border-2 p-8 transition-all hover:scale-105 hover:border-accent/50 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-accent/10 p-4 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon size={32} weight="duotone" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Compass size={16} weight="fill" />
                Powered by AI
              </div>
              
              <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                Discover, Plan, and Book with Confidence
              </h2>
              
              <p className="mb-8 text-lg text-muted-foreground">
                TT Travels combines cutting-edge AI with real-time travel data to help you plan 
                the perfect trip. Whether you're exploring new destinations or booking your next 
                flight, we've got you covered.
              </p>
              
              <div className="grid gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle size={24} weight="fill" className="mt-0.5 shrink-0 text-accent" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <SignUpButton mode="modal">
                  <Button size="lg" className="gap-2">
                    Start Planning Now
                    <ArrowRight size={20} weight="bold" />
                  </Button>
                </SignUpButton>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-card shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                <div className="relative p-8">
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <div className="glass-surface rounded-2xl p-4">
                      <MapPin size={24} weight="duotone" className="mb-2 text-primary" />
                      <div className="text-2xl font-bold">150+</div>
                      <div className="text-xs text-muted-foreground">Countries</div>
                    </div>
                    <div className="glass-surface rounded-2xl p-4">
                      <Airplane size={24} weight="duotone" className="mb-2 text-accent" />
                      <div className="text-2xl font-bold">10K+</div>
                      <div className="text-xs text-muted-foreground">Flights Daily</div>
                    </div>
                    <div className="glass-surface rounded-2xl p-4">
                      <Heart size={24} weight="duotone" className="mb-2 text-destructive" />
                      <div className="text-2xl font-bold">5K+</div>
                      <div className="text-xs text-muted-foreground">Hotels</div>
                    </div>
                  </div>
                  
                  <Card className="glass-surface mb-4 border-2 p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-full bg-accent/10 p-3">
                        <Sparkle size={24} weight="fill" className="text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold">AI Itinerary Generated</h4>
                        <p className="text-sm text-muted-foreground">Tokyo, Japan · 7 Days</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>Senso-ji Temple & Asakusa District</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        <span>Shibuya Crossing & Harajuku</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-secondary" />
                        <span>Mount Fuji Day Trip</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="glass-surface border-2 p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium">Best Price Found</span>
                      <ChartLine size={20} weight="duotone" className="text-accent" />
                    </div>
                    <div className="text-3xl font-bold text-accent">$459</div>
                    <div className="text-sm text-muted-foreground">Save $127 by booking Tuesday</div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5 p-12 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Join thousands of travelers who plan smarter with TT Travels
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SignUpButton mode="modal">
              <Button size="lg" className="gap-2 text-lg">
                Create Free Account
                <ArrowRight size={20} weight="bold" />
              </Button>
            </SignUpButton>
            <Button size="lg" variant="outline" className="gap-2 text-lg" asChild>
              <Link to="/explore">
                <MapPin size={20} weight="bold" />
                Explore Destinations
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link to="/" className="mb-4 block text-2xl font-bold text-primary">
                TT Travels
              </Link>
              <p className="text-sm text-muted-foreground">
                Your AI-powered travel command center for smarter planning and booking.
              </p>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/ai-planner" className="hover:text-foreground transition-colors">AI Planner</Link></li>
                <li><Link to="/explore" className="hover:text-foreground transition-colors">Explore</Link></li>
                <li><Link to="/bookings" className="hover:text-foreground transition-colors">Bookings</Link></li>
                <li><Link to="/trips" className="hover:text-foreground transition-colors">Trips</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/setup" className="hover:text-foreground transition-colors">Setup Guide</Link></li>
                <li><Link to="/settings" className="hover:text-foreground transition-colors">Settings</Link></li>
                <li><Link to="/journal" className="hover:text-foreground transition-colors">Journal</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="mb-4 font-semibold">Get Started</h4>
              <div className="space-y-3">
                <SignUpButton mode="modal">
                  <Button variant="outline" className="w-full">Sign Up</Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </SignInButton>
              </div>
            </div>
          </div>
          
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} TT Travels. Built with AI-powered technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
