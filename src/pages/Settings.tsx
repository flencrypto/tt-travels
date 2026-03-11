import { useState } from 'react'
import { Gear, Check, Moon, Sun, Key, Eye, EyeSlash } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useKV } from '@github/spark/hooks'
import { useTheme } from '@/hooks/use-theme'
import { toast } from 'sonner'
import type { Settings, APIKeys } from '@/lib/types'

export function Settings() {
  const [settings, setSettings] = useKV<Settings>('tt-travels-settings', {
    displayName: '',
    temperatureUnit: 'celsius',
  })
  const [apiKeys, setApiKeys] = useKV<APIKeys>('tt-travels-api-keys', {})
  const { theme, toggleTheme } = useTheme()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!')
  }

  const handleSaveAPIKeys = () => {
    toast.success('API keys saved successfully!')
  }

  const toggleKeyVisibility = (key: string) => {
    setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }))
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
          <div className="flex items-center gap-2">
            <Key size={24} className="text-primary" weight="fill" />
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Configure API keys for third-party services (stored locally)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amadeus-api-key">Amadeus API Key</Label>
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
            <p className="text-xs text-muted-foreground">
              Required for flight and hotel search functionality
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amadeus-api-secret">Amadeus API Secret</Label>
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
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="openweather-api-key">OpenWeather API Key</Label>
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
            </div>
            <p className="text-xs text-muted-foreground">
              Required for weather data and activity recommendations
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="airbnb-api-key">Airbnb API Key</Label>
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
            </div>
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
