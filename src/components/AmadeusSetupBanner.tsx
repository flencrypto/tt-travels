import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Info, WarningCircle } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface AmadeusSetupBannerProps {
  isConfigured: boolean
  isTested?: boolean
  onNavigateToSettings?: () => void
}

export function AmadeusSetupBanner({ isConfigured, isTested, onNavigateToSettings }: AmadeusSetupBannerProps) {
  if (isConfigured && isTested) {
    return (
      <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle size={24} weight="fill" className="text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Amadeus API Connected
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Flight and hotel search is enabled. You can now search for real travel options.
              </p>
            </div>
            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-300 dark:border-green-700">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isConfigured && !isTested) {
    return (
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <WarningCircle size={24} weight="fill" className="text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                Amadeus API Not Verified
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your credentials are configured but haven't been tested. Click Test in Settings to verify.
              </p>
            </div>
            {onNavigateToSettings && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onNavigateToSettings}
                className="border-amber-300 dark:border-amber-700"
              >
                Go to Settings
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Info size={24} weight="fill" className="text-blue-600 dark:text-blue-400 mt-1" />
            <div>
              <CardTitle className="text-blue-900 dark:text-blue-100">
                Configure Amadeus API
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300 mt-1.5">
                Enable real flight and hotel searches by adding your Amadeus API credentials
              </CardDescription>
            </div>
          </div>
          {onNavigateToSettings && (
            <Button 
              variant="default" 
              size="sm"
              onClick={onNavigateToSettings}
              className="shrink-0"
            >
              Get Started
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
            Quick Setup (5 minutes)
          </h4>
          <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-2 list-decimal list-inside">
            <li>
              Visit{' '}
              <a 
                href="https://developers.amadeus.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-900 dark:hover:text-blue-100 font-medium"
              >
                Amadeus for Developers
              </a>
              {' '}and create a free account
            </li>
            <li>Create a new app and copy your API Key and API Secret</li>
            <li>Go to Settings → API Keys section</li>
            <li>Paste your credentials and click Test</li>
            <li>Save and start searching for flights and hotels!</li>
          </ol>
        </div>
        
        <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3 space-y-1">
          <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
            💡 Pro Tips
          </p>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Test environment is completely free with realistic data</li>
            <li>• No credit card required to get started</li>
            <li>• Credentials are stored securely in your browser</li>
          </ul>
        </div>

        <p className="text-xs text-blue-600 dark:text-blue-400">
          See <strong>AMADEUS_SETUP_GUIDE.md</strong> for detailed instructions
        </p>
      </CardContent>
    </Card>
  )
}
