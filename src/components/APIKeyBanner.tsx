import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Key, X, CheckCircle, WarningCircle, Info } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface APIKeyBannerProps {
  requiredKeys: Array<{
    name: string
    key: keyof APIKeys
    feature: string
  }>
  apiKeys?: APIKeys
  showIfConfigured?: boolean
}

type APIKeys = {
  amadeus_api_key?: string
  amadeus_api_secret?: string
  openweather_api_key?: string
  airbnb_api_key?: string
  openai_api_key?: string
  mapbox_token?: string
  aviationstack_key?: string
  yelp_key?: string
  ticketmaster_key?: string
  google_maps_key?: string
}

export function APIKeyBanner({ requiredKeys, apiKeys, showIfConfigured = false }: APIKeyBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  const missingKeys = requiredKeys.filter(({ key }) => !apiKeys?.[key])
  const configuredKeys = requiredKeys.filter(({ key }) => apiKeys?.[key])

  if (isDismissed) return null
  if (!showIfConfigured && missingKeys.length === 0) return null

  const allConfigured = missingKeys.length === 0

  return (
    <Alert 
      className={`relative ${
        allConfigured 
          ? 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800' 
          : 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => setIsDismissed(true)}
      >
        <X size={16} />
      </Button>

      <div className="flex items-start gap-3 pr-8">
        {allConfigured ? (
          <CheckCircle size={24} weight="fill" className="text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
        ) : (
          <WarningCircle size={24} weight="fill" className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
        )}
        
        <div className="flex-1 space-y-3">
          <div>
            <h4 className={`font-semibold text-sm mb-1 ${
              allConfigured 
                ? 'text-green-900 dark:text-green-100' 
                : 'text-amber-900 dark:text-amber-100'
            }`}>
              {allConfigured ? 'API Keys Configured' : 'API Keys Required'}
            </h4>
            <AlertDescription className={
              allConfigured 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-amber-800 dark:text-amber-200'
            }>
              {allConfigured ? (
                <>
                  All required API keys are configured. You have full access to {requiredKeys.map(k => k.feature).join(', ')}.
                </>
              ) : (
                <>
                  Configure the following API keys in Settings to unlock full functionality.
                </>
              )}
            </AlertDescription>
          </div>

          {missingKeys.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-amber-900 dark:text-amber-100">Missing Keys:</p>
              <div className="flex flex-wrap gap-2">
                {missingKeys.map(({ name, feature }) => (
                  <Badge 
                    key={name}
                    variant="outline" 
                    className="bg-white/50 dark:bg-black/20 border-amber-300 dark:border-amber-700"
                  >
                    <Key size={14} className="mr-1" weight="fill" />
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {configuredKeys.length > 0 && !allConfigured && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-green-700 dark:text-green-300">Configured:</p>
              <div className="flex flex-wrap gap-2">
                {configuredKeys.map(({ name }) => (
                  <Badge 
                    key={name}
                    variant="outline" 
                    className="bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-800 dark:text-green-200"
                  >
                    <CheckCircle size={14} className="mr-1" weight="fill" />
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Link to="/settings">
              <Button 
                size="sm" 
                className={
                  allConfigured
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }
              >
                <Key size={16} className="mr-2" weight="fill" />
                {allConfigured ? 'Manage API Keys' : 'Configure API Keys'}
              </Button>
            </Link>
            {!allConfigured && (
              <a 
                href="https://github.com/yourusername/tt-travels/blob/main/API_KEYS_SETUP_GUIDE.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="outline" className="border-amber-300 dark:border-amber-700">
                  <Info size={16} className="mr-2" />
                  Setup Guide
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </Alert>
  )
}
