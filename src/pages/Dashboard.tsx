import { Link } from 'react-router-dom'
import { Sparkle, MapPin, CalendarDots, Users, TrendUp, Globe } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function Dashboard() {
  const kpis = [
    { icon: Users, label: 'Active Users', value: '10,000+', color: 'text-primary' },
    { icon: TrendUp, label: 'Trips Planned', value: '25,000+', color: 'text-accent' },
    { icon: Globe, label: 'Destinations', value: '500+', color: 'text-secondary' },
  ]

  const quickActions = [
    {
      icon: Sparkle,
      title: 'AI Itinerary',
      description: 'Generate personalized travel plans',
      to: '/ai-planner',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: MapPin,
      title: 'Explore Nearby',
      description: 'Discover locations around you',
      to: '/explore',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: CalendarDots,
      title: 'Plan Trip',
      description: 'Schedule your next adventure',
      to: '/trips',
      color: 'bg-secondary/10 text-secondary',
    },
  ]

  const features = [
    {
      icon: Sparkle,
      title: 'AI Trip Planner',
      description: 'Let AI create detailed itineraries tailored to your preferences',
      to: '/ai-planner',
    },
    {
      icon: MapPin,
      title: 'Location Explorer',
      description: 'Find nearby attractions with real-time weather updates',
      to: '/explore',
    },
    {
      icon: CalendarDots,
      title: 'Trip Manager',
      description: 'Organize and track all your planned adventures',
      to: '/trips',
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, oklch(0.45 0.15 250) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, oklch(0.70 0.18 45) 0%, transparent 50%)`,
          }}
        />
        <div className="container mx-auto px-6 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Travel Command Center
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Plan, explore, and organize your adventures with AI-powered tools
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link to="/ai-planner">
                <Button size="lg" className="gap-2 text-lg">
                  <Sparkle size={20} weight="fill" />
                  Start Planning with AI
                </Button>
              </Link>
              <Link to="/setup">
                <Button size="lg" variant="outline" className="gap-2 text-lg">
                  Setup Integrations
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label} className="glass-surface">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-${kpi.color}/10`}>
                    <Icon size={32} weight="fill" className={kpi.color} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{kpi.value}</p>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} to={action.to}>
                <Card className="glass-surface hover:scale-105 transition-transform duration-200 cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className={`p-3 rounded-lg ${action.color} w-fit`}>
                      <Icon size={28} weight="fill" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <Separator className="my-8" />

      <section className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                1
              </div>
              <h3 className="font-semibold">Configure</h3>
              <p className="text-sm text-muted-foreground">
                Set up integrations and preferences
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                2
              </div>
              <h3 className="font-semibold">Generate</h3>
              <p className="text-sm text-muted-foreground">
                Use AI to create personalized itineraries
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                3
              </div>
              <h3 className="font-semibold">Explore</h3>
              <p className="text-sm text-muted-foreground">
                Discover locations and track your trips
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      <section className="container mx-auto px-6 py-8 pb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Link key={feature.title} to={feature.to}>
                <Card className="glass-surface h-full hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6 space-y-4">
                    <Icon size={40} weight="fill" className="text-primary" />
                    <h3 className="font-semibold text-xl">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
