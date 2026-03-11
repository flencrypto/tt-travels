import { useState } from 'react'
import { Gear, Check, Moon, Sun, Key, Eye, EyeSlash, CheckCircle, XCircle, WarningCircle, Lightning } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { useTheme } from '@/hooks/use-theme'
import { toast } from 'sonner'
import type { Settings, APIKeys, APIValidationResult } from '@/lib/types'
import { 
  validateAmadeusCredentials, 
  validateOpenWeatherKey, 
  validateAirbnbKey,
  testAllConnections 
} from '@/lib/api-validation'

export function Settings() {
  const [settings, setSettings] = useKV<Settings>('tt-travels-settings', {
    displayName: '',
    temperatureUnit: 'celsius',
  })
  const [apiKeys, setApiKeys] = useKV<APIKeys>('tt-travels-api-keys', {})
  const { theme, toggleTheme } = useTheme()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [validationResults, setValidationResults] = useState<{
    amadeus?: APIValidationResult
    openweather?: APIValidationResult
    airbnb?: APIValidationResult
  }>({})
  const [isTestingAll, setIsTestingAll] = useState(false)
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({})

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!')
  }

  const handleSaveAPIKeys = () => {
    toast.success('API keys saved successfully!')
  }

  const toggleKeyVisibility = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const testAmadeusConnection = async () => {
    if (!apiKeys?.amadeus_api_key || !apiKeys?.amadeus_api_secret) {
      toast.error('Please enter both Amadeus API key and secret')
      return
    }

    setIsTesting((prev) => ({ ...prev, amadeus: true }))
    const result = await validateAmadeusCredentials(
      apiKeys.amadeus_api_key,
      apiKeys.amadeus_api_secret
    )
    setValidationResults((prev) => ({ ...prev, amadeus: result }))
    setIsTesting((prev) => ({ ...prev, amadeus: false }))

    if (result.isValid) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const testOpenWeatherConnection = async () => {
    if (!apiKeys?.openweather_api_key) {
      toast.error('Please enter OpenWeather API key')
      return
    }

    setIsTesting((prev) => ({ ...prev, openweather: true }))
    const result = await validateOpenWeatherKey(apiKeys.openweather_api_key)
    setValidationResults((prev) => ({ ...prev, openweather: result }))
    setIsTesting((prev) => ({ ...prev, openweather: false }))

    if (result.isValid) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const testAirbnbConnection = async () => {
    if (!apiKeys?.airbnb_api_key) {
      toast.error('Please enter Airbnb API key')
      return
    }

    setIsTesting((prev) => ({ ...prev, airbnb: true }))
    const result = await validateAirbnbKey(apiKeys.airbnb_api_key)
    setValidationResults((prev) => ({ ...prev, airbnb: result }))
    setIsTesting((prev) => ({ ...prev, airbnb: false }))

    toast.info(result.message)
  }

  const testAllAPIConnections = async () => {
    if (!apiKeys || Object.keys(apiKeys).length === 0) {
      toast.error('Please enter at least one API key')
      return
    }

    setIsTestingAll(true)
    toast.info('Testing all API connections...')

    const results = await testAllConnections(apiKeys)
    
    const filteredResults = {
      ...(results.amadeus && { amadeus: results.amadeus }),
      ...(results.openweather && { openweather: results.openweather }),
      ...(results.airbnb && { airbnb: results.airbnb }),
    }
    
    setValidationResults(filteredResults)
    setIsTestingAll(false)

    const validCount = Object.values(results).filter((r) => r?.isValid).length
    const totalCount = Object.values(results).filter((r) => r !== null).length

    if (validCount === totalCount) {
      toast.success(`All ${totalCount} API connections verified successfully!`)
    } else if (validCount > 0) {
      toast.warning(`${validCount} of ${totalCount} API connections verified`)
    } else {
      toast.error('All API connection tests failed')
    }
  }

  const getValidationIcon = (result?: APIValidationResult) => {
    if (!result) return null
    if (result.isValid) {
      return <CheckCircle size={20} weight="fill" className="text-green-600" />
    }
    return <XCircle size={20} weight="fill" className="text-red-600" />
  }

  const getValidationBadge = (result?: APIValidationResult) => {
    if (!result) return null
    if (result.isValid) {
      return <Badge className="bg-green-100 text-green-800 border-green-300">Verified</Badge>
    }
    return <Badge variant="destructive">Failed</Badge>
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Gear size={40} className="text-primary" weight="fill" />
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Customize your TT Travels experience
        </p>
      </div>

      <Card className="max-w-2xl mx-auto glass-surface">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the visual theme of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Dark Mode</Label>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10"
            >
              {theme === 'dark' ? (
                <Sun size={20} weight="fill" className="text-accent" />
              ) : (
                <Moon size={20} weight="fill" className="text-primary" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto glass-surface">
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
          <CardDescription>
            Manage your personal settings and display preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input
              id="display-name"
              placeholder="Enter your name"
              value={settings?.displayName || ''}
              onChange={(e) =>
                setSettings((current) => ({ ...current!, displayName: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              This name will be used throughout the application
            </p>
          </div>

          <div className="space-y-3">
            <Label>Temperature Unit</Label>
            <RadioGroup
              value={settings?.temperatureUnit || 'celsius'}
              onValueChange={(value) =>
                setSettings((current) => ({
                  ...current!,
                  temperatureUnit: value as 'celsius' | 'fahrenheit',
                }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="celsius" id="celsius" />
                <Label htmlFor="celsius" className="font-normal cursor-pointer">
                  Celsius (°C)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                <Label htmlFor="fahrenheit" className="font-normal cursor-pointer">
                  Fahrenheit (°F)
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Choose your preferred temperature unit for weather displays
            </p>
          </div>

          <Button
            onClick={handleSaveSettings}
            className="w-full gap-2"
            size="lg"
          >
            <Check size={20} weight="bold" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto glass-surface">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key size={24} className="text-primary" weight="fill" />
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Configure API keys for third-party services (stored locally)
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={testAllAPIConnections}
              disabled={isTestingAll || !apiKeys || Object.keys(apiKeys).length === 0}
              variant="outline"
              className="gap-2"
            >
              <Lightning size={20} weight="fill" />
              Test All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="amadeus-api-key">Amadeus API Key</Label>
              {getValidationBadge(validationResults.amadeus)}
            </div>
            <div className="flex gap-2">
              <Input
                id="amadeus-api-key"
                type={showKeys['amadeus_api_key'] ? 'text' : 'password'}
                placeholder="Enter your Amadeus API key"
                value={apiKeys?.amadeus_api_key || ''}
                onChange={(e) =>
                  setApiKeys((current) => ({ ...current, amadeus_api_key: e.target.value }))
                }
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleKeyVisibility('amadeus_api_key')}
              >
                {showKeys['amadeus_api_key'] ? (
                  <EyeSlash size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </Button>
            </div>
            {validationResults.amadeus && (
              <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                validationResults.amadeus.isValid 
                  ? 'bg-green-50 dark:bg-green-950/20 text-green-900 dark:text-green-100' 
                  : 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100'
              }`}>
                {getValidationIcon(validationResults.amadeus)}
                <div>
                  <p className="font-medium">{validationResults.amadeus.message}</p>
                  {validationResults.amadeus.details && (
                    <p className="text-xs opacity-80 mt-1">{validationResults.amadeus.details}</p>
                  )}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Required for flight and hotel search functionality
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="amadeus-api-secret">Amadeus API Secret</Label>
            </div>
            <div className="flex gap-2">
              <Input
                id="amadeus-api-secret"
                type={showKeys['amadeus_api_secret'] ? 'text' : 'password'}
                placeholder="Enter your Amadeus API secret"
                value={apiKeys?.amadeus_api_secret || ''}
                onChange={(e) =>
                  setApiKeys((current) => ({ ...current, amadeus_api_secret: e.target.value }))
                }
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleKeyVisibility('amadeus_api_secret')}
              >
                {showKeys['amadeus_api_secret'] ? (
                  <EyeSlash size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={testAmadeusConnection}
                disabled={isTesting.amadeus || !apiKeys?.amadeus_api_key || !apiKeys?.amadeus_api_secret}
                className="gap-2"
              >
                {isTesting.amadeus ? (
                  <>Testing...</>
                ) : (
                  <>
                    <Lightning size={18} weight="fill" />
                    Test
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="openweather-api-key">OpenWeather API Key</Label>
              {getValidationBadge(validationResults.openweather)}
            </div>
            <div className="flex gap-2">
              <Input
                id="openweather-api-key"
                type={showKeys['openweather_api_key'] ? 'text' : 'password'}
                placeholder="Enter your OpenWeather API key"
                value={apiKeys?.openweather_api_key || ''}
                onChange={(e) =>
                  setApiKeys((current) => ({ ...current, openweather_api_key: e.target.value }))
                }
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleKeyVisibility('openweather_api_key')}
              >
                {showKeys['openweather_api_key'] ? (
                  <EyeSlash size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={testOpenWeatherConnection}
                disabled={isTesting.openweather || !apiKeys?.openweather_api_key}
                className="gap-2"
              >
                {isTesting.openweather ? (
                  <>Testing...</>
                ) : (
                  <>
                    <Lightning size={18} weight="fill" />
                    Test
                  </>
                )}
              </Button>
            </div>
            {validationResults.openweather && (
              <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                validationResults.openweather.isValid 
                  ? 'bg-green-50 dark:bg-green-950/20 text-green-900 dark:text-green-100' 
                  : 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100'
              }`}>
                {getValidationIcon(validationResults.openweather)}
                <div>
                  <p className="font-medium">{validationResults.openweather.message}</p>
                  {validationResults.openweather.details && (
                    <p className="text-xs opacity-80 mt-1">{validationResults.openweather.details}</p>
                  )}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Required for weather data and activity recommendations
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="airbnb-api-key">Airbnb API Key</Label>
              {getValidationBadge(validationResults.airbnb)}
            </div>
            <div className="flex gap-2">
              <Input
                id="airbnb-api-key"
                type={showKeys['airbnb_api_key'] ? 'text' : 'password'}
                placeholder="Enter your Airbnb API key"
                value={apiKeys?.airbnb_api_key || ''}
                onChange={(e) =>
                  setApiKeys((current) => ({ ...current, airbnb_api_key: e.target.value }))
                }
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleKeyVisibility('airbnb_api_key')}
              >
                {showKeys['airbnb_api_key'] ? (
                  <EyeSlash size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={testAirbnbConnection}
                disabled={isTesting.airbnb || !apiKeys?.airbnb_api_key}
                className="gap-2"
              >
                {isTesting.airbnb ? (
                  <>Testing...</>
                ) : (
                  <>
                    <Lightning size={18} weight="fill" />
                    Test
                  </>
                )}
              </Button>
            </div>
            {validationResults.airbnb && (
              <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                validationResults.airbnb.isValid 
                  ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100' 
                  : 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-100'
              }`}>
                <WarningCircle size={20} weight="fill" className="text-blue-600" />
                <div>
                  <p className="font-medium">{validationResults.airbnb.message}</p>
                  {validationResults.airbnb.details && (
                    <p className="text-xs opacity-80 mt-1">{validationResults.airbnb.details}</p>
                  )}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Optional: for Airbnb accommodation search
            </p>
          </div>

          <Button
            onClick={handleSaveAPIKeys}
            className="w-full gap-2"
            size="lg"
          >
            <Check size={20} weight="bold" />
            Save API Keys
          </Button>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Privacy Note:</strong> All API keys are stored locally in your browser and never sent to any server except the respective service providers when making API calls.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
