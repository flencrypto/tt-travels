import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Backpack, Sparkle, Check, Plus, Trash } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export interface PackingItem {
  id: string
  name: string
  category: string
  checked: boolean
  isCustom?: boolean
}

interface PackingListProps {
  destination: string
  duration: number
  travelStyle: string
  budget: string
  groupType: string
  items: PackingItem[]
  onItemsChange: (items: PackingItem[]) => void
}

export function PackingList({
  destination,
  duration,
  travelStyle,
  budget,
  groupType,
  items,
  onItemsChange,
}: PackingListProps) {
  const [customItem, setCustomItem] = useState('')
  const [savedLists, setSavedLists] = useKV<Record<string, PackingItem[]>>('packing-lists', {})

  const categories = Array.from(new Set(items.map((item) => item.category)))

  const handleToggleItem = (itemId: string) => {
    onItemsChange(
      items.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item))
    )
  }

  const handleAddCustomItem = () => {
    if (!customItem.trim()) return

    const newItem: PackingItem = {
      id: `custom-${Date.now()}`,
      name: customItem.trim(),
      category: 'Custom Items',
      checked: false,
      isCustom: true,
    }

    onItemsChange([...items, newItem])
    setCustomItem('')
    toast.success('Item added to packing list')
  }

  const handleDeleteItem = (itemId: string) => {
    onItemsChange(items.filter((item) => item.id !== itemId))
    toast.success('Item removed from packing list')
  }

  const handleSaveList = () => {
    const listKey = `${destination}-${Date.now()}`
    setSavedLists((current) => ({
      ...current,
      [listKey]: items,
    }))
    toast.success(`Packing list for ${destination} saved!`)
  }

  const checkedCount = items.filter((item) => item.checked).length
  const totalCount = items.length
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0

  return (
    <Card className="glass-surface">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Backpack size={24} className="text-accent" weight="fill" />
              <CardTitle>AI-Generated Packing List</CardTitle>
            </div>
            <CardDescription>
              Customized for {duration}-day {travelStyle} trip to {destination}
            </CardDescription>
          </div>
          <Button onClick={handleSaveList} variant="outline" size="sm">
            Save List
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Packing Progress</span>
            <span className="text-muted-foreground">
              {checkedCount} of {totalCount} items packed
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {items.filter((item) => item.category === category && item.checked).length} /{' '}
                  {items.filter((item) => item.category === category).length}
                </span>
              </div>
              <div className="space-y-2 pl-2">
                {items
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 group hover:bg-accent/5 p-2 rounded-md transition-colors"
                    >
                      <Checkbox
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={() => handleToggleItem(item.id)}
                      />
                      <label
                        htmlFor={item.id}
                        className={`flex-1 text-sm cursor-pointer select-none ${
                          item.checked ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {item.name}
                      </label>
                      {item.isCustom && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                          <Trash size={16} className="text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Add Custom Item</h4>
          <div className="flex gap-2">
            <Input
              id="custom-item"
              placeholder="e.g., Sunscreen, Phone charger..."
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomItem()}
            />
            <Button onClick={handleAddCustomItem} size="sm" className="gap-2">
              <Plus size={16} />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
