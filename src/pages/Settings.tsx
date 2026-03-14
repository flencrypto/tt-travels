import { useState, useEffect } from 'react'
import { Gear, Moon, Sun, Key, Eye, EyeSlash, CheckCircle, XCircle, Lightning, Airplane, LockKey, ShieldCheck } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AuthStatus } from '@/components/AuthStatus'
import { useKV } from '@github/spark/hooks'
import { useTheme } from '@/hooks/use-theme'
import { useClerkSync } from '@/hooks/use-clerk-sync'
import { useUser } from '@clerk/react'
import { toast } from 'sonner'
import type { Settings, APIKeys, APIValidationResult } from '@/lib/types'
import { validateAmadeusCredentials, testAllConnections } from '@/lib/api-validation'

export function Settings() {
  const [settings, setSettings] = useKV<Settings>('tt-travels-settings', {
    displayName: '',
    temperatureUnit: 'celsius',
  })
  const [apiKeys, setApiKeys] = useKV<APIKeys>('tt-travels-api-keys', {})
  const { theme, toggleTheme } = useTheme()
  const { isSynced, isSignedIn } = useClerkSync()
  const { user } = useUser()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [validationResults, setValidationResults] = useState<{
    amadeus?: APIValidationResult
  }>({})
  const [isTestingAll, setIsTestingAll] = useState(false)
  const [isTesting, setIsTesting] = useState<Record<string, boolean>>({})
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [isCheckingOwnership, setIsCheckingOwnership] = useState(true)

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        const currentUser = await spark.user()
        setIsOwner(currentUser.isOwner)
      } catch (error) {
        console.error('Failed to check ownership:', error)
        setIsOwner(false)
      } finally {
        setIsCheckingOwnership(false)
      }
    }
    checkOwnership()
  }, [])

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
      toast.success('Amadeus credentials verified successfully!')
    } else {
      toast.error(result.message)
    }
  }

  const testAllConnectionsHandler = async () => {
    if (!apiKeys) {
      toast.error('No API keys configured')
      return
    }
    setIsTestingAll(true)
    const results = await testAllConnections(apiKeys)
    setValidationResults({
      amadeus: results.amadeus || undefined,
    })
    setIsTestingAll(false)

    const validCount = Object.values(results).filter((r) => r?.isValid).length
    const testedCount = Object.values(results).filter((r) => r !== null).length

    if (testedCount === 0) {
      toast.error('No API keys to test. Please configure at least one integration.')
    } else if (validCount === testedCount) {
      toast.success(`All ${validCount} configured API${validCount > 1 ? 's' : ''} verified successfully!`)
    } else {
      toast.warning(`${validCount}/${testedCount} API${testedCount > 1 ? 's' : ''} verified successfully`)
    }
  }

  const getValidationIcon = (result?: APIValidationResult) => {
    if (!result) return null
    return result.isValid ? (
      <CheckCircle size={20} weight="fill" className="text-green-500" />
    ) : (
      <XCircle size={20} weight="fill" className="text-red-500" />
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Gear size={40} weight="fill" className="text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and API integrations
        </p>
      </div>

      <AuthStatus />

      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>Customize how information is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="Enter your display name"
              value={settings?.displayName || ''}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev!, displayName: e.target.value }))
              }
            />
          </div>

          <div className="space-y-3">
            <Label>Temperature Unit</Label>
            <RadioGroup
              value={settings?.temperatureUnit || 'celsius'}
              onValueChange={(value) =>
                setSettings((prev) => ({
                  ...prev!,
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
          </div>

          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon size={24} weight="fill" className="text-primary" />
                ) : (
                  <Sun size={24} weight="fill" className="text-accent" />
                )}
                <div>
                  <p className="font-medium">
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <Button onClick={toggleTheme} variant="outline">
                Toggle Theme
              </Button>
            </div>
          </div>

          <Button onClick={handleSaveSettings} className="w-full">
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key size={24} weight="fill" className="text-primary" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Configure external API integrations for enhanced features
              </CardDescription>
            </div>
            {isOwner && (
              <Badge variant="default" className="gap-1">
                <ShieldCheck size={16} weight="fill" />
                Owner
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Lightning size={20} weight="fill" className="text-accent" />
            <AlertDescription>
              <strong>AI Features Built-In:</strong> AI trip planning and recommendations are powered by Spark's built-in AI and don't require any API keys!
            </AlertDescription>
          </Alert>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Airplane size={20} weight="fill" className="text-primary" />
                  Amadeus Travel APIs
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  For flight and hotel search (optional - free test environment available)
                </p>
              </div>
              {validationResults.amadeus && (
                <div className="flex items-center gap-2">
                  {getValidationIcon(validationResults.amadeus)}
                  <span className="text-sm">
                    {validationResults.amadeus.isValid ? 'Verified' : 'Invalid'}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amadeus_api_key">API Key</Label>
                <div className="relative">
                  <Input
                    id="amadeus_api_key"
                    type={showKeys.amadeus_api_key ? 'text' : 'password'}
                    placeholder="Enter Amadeus API key"
                    value={apiKeys?.amadeus_api_key || ''}
                    onChange={(e) =>
                      setApiKeys((prev) => ({
                        ...prev,
                        amadeus_api_key: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleKeyVisibility('amadeus_api_key')}
                  >
                    {showKeys.amadeus_api_key ? (
                      <EyeSlash size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amadeus_api_secret">API Secret</Label>
                <div className="relative">
                  <Input
                    id="amadeus_api_secret"
                    type={showKeys.amadeus_api_secret ? 'text' : 'password'}
                    placeholder="Enter Amadeus API secret"
                    value={apiKeys?.amadeus_api_secret || ''}
                    onChange={(e) =>
                      setApiKeys((prev) => ({
                        ...prev,
                        amadeus_api_secret: e.target.value,
                      }))
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleKeyVisibility('amadeus_api_secret')}
                  >
                    {showKeys.amadeus_api_secret ? (
                      <EyeSlash size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={testAmadeusConnection}
                variant="outline"
                disabled={isTesting.amadeus}
                className="flex-1"
              >
                {isTesting.amadeus ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>

            <Alert>
              <AlertDescription className="text-xs">
                <strong>Setup Instructions:</strong>
                <ol className="list-decimal ml-4 mt-2 space-y-1">
                  <li>Sign up at <a href="https://developers.amadeus.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">developers.amadeus.com</a></li>
                  <li>Create a new app to get your API credentials</li>
                  <li>Start with the free test environment</li>
                  <li>Enter your API key and secret above and test the connection</li>
                </ol>
              </AlertDescription>
            </Alert>
          </div>

          <Separator />

          <div className="flex gap-3">
            <Button onClick={handleSaveAPIKeys} className="flex-1">
              <LockKey size={20} weight="fill" className="mr-2" />
              Save API Keys
            </Button>
            <Button
              onClick={testAllConnectionsHandler}
              variant="outline"
              disabled={isTestingAll}
            >
              {isTestingAll ? 'Testing All...' : 'Test All Connections'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Sync</CardTitle>
          <CardDescription>Your data is automatically synced when signed in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">
                {isSignedIn ? 'Synced' : 'Not Signed In'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isSignedIn
                  ? 'Your settings and data are being synced across devices'
                  : 'Sign in to sync your data across devices'}
              </p>
            </div>
            <Badge variant={isSynced ? 'default' : 'secondary'}>
              {isSynced ? 'Active' : 'Local Only'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
