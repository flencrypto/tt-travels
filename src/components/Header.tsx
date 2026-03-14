import { Heart } from '@phosphor-icons/react'

type HeaderProps = {
  activeTab: 'explore' | 'favorites'
  onTabChange: (tab: 'explore' | 'favorites') => void
  favoriteCount: number
}

export function Header({ activeTab, onTabChange, favoriteCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-12 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Wanderlist
          </h1>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => onTabChange('explore')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'explore'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => onTabChange('favorites')}
              className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeTab === 'favorites'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Heart size={20} weight={activeTab === 'favorites' ? 'fill' : 'regular'} />
              Favorites
              {favoriteCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">
                  {favoriteCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
