import { useKV } from '@github/spark/hooks'
import type { JournalEntry } from '@/lib/types'

export function useJournal() {
  const [entries, setEntries] = useKV<JournalEntry[]>('tt-travels-journal-entries', [])

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    setEntries((current) => {
      if (!current) current = []
      const newEntry: JournalEntry = {
        ...entry,
        id: `journal-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      return [newEntry, ...current]
    })
  }

  const updateEntry = (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => {
    setEntries((current) => {
      if (!current) return []
      return current.map(entry =>
        entry.id === id
          ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
          : entry
      )
    })
  }

  const deleteEntry = (id: string) => {
    setEntries((current) => {
      if (!current) return []
      return current.filter(entry => entry.id !== id)
    })
  }

  const getEntry = (id: string) => {
    return entries?.find(entry => entry.id === id)
  }

  const markAsShared = (id: string, platform: 'instagram' | 'facebook' | 'tiktok') => {
    setEntries((current) => {
      if (!current) return []
      return current.map(entry => {
        if (entry.id === id) {
          const sharedOn = entry.sharedOn || []
          if (!sharedOn.includes(platform)) {
            return { ...entry, sharedOn: [...sharedOn, platform], updatedAt: new Date().toISOString() }
          }
        }
        return entry
      })
    })
  }

  return {
    entries: entries ?? [],
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    markAsShared,
  }
}
