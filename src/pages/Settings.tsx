import { useState, useEffect } from 'react'
import { Gear, Check } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { Settings } from '@/lib/types'

export function Settings() {
  const [settings, setSettings] = useState<Settings>({
    displayName: '',
    temperatureUnit: 'celsius',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem('tt-travels-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('tt-travels-settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
              value={settings.displayName}
              onChange={(e) =>
                setSettings({ ...settings, displayName: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              This name will be used throughout the application
            </p>
          </div>

          <div className="space-y-3">
            <Label>Temperature Unit</Label>
            <RadioGroup
              value={settings.temperatureUnit}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  temperatureUnit: value as 'celsius' | 'fahrenheit',
                })
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
            onClick={handleSave}
            className="w-full gap-2"
            size="lg"
          >
            {saved ? (
              <>
                <Check size={20} weight="bold" />
                Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
