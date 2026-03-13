import { useState, useRef } from 'react'
import { Camera, Upload, Sparkle, Share, Trash, Video, Image as ImageIcon, X } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useJournal } from '@/hooks/use-journal'
import { generateMediaDescription } from '@/lib/api'
import { SocialShareDialog } from '@/components/SocialShareDialog'
import type { JournalMedia, JournalEntry, SocialPlatform } from '@/lib/types'
import { toast } from 'sonner'

export function Journal() {
  const { entries, addEntry, deleteEntry, markAsShared } = useJournal()

  const [selectedMedia, setSelectedMedia] = useState<JournalMedia[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedEntryForShare, setSelectedEntryForShare] = useState<JournalEntry | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ==================== MEDIA HANDLING ====================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newMedia: JournalMedia[] = Array.from(files).map((file) => ({
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      file,
    }))

    setSelectedMedia((prev) => [...prev, ...newMedia])
  }

  const removeMedia = (id: string) => {
    setSelectedMedia((prev) => {
      const media = prev.find((m) => m.id === id)
      if (media) URL.revokeObjectURL(media.url)
      return prev.filter((m) => m.id !== id)
    })
  }

  // ==================== AI DESCRIPTION ====================
  const handleGenerateDescription = async () => {
    if (selectedMedia.length === 0) {
      toast.error('Please upload at least one photo or video')
      return
    }

    setIsGenerating(true)
    try {
      const mediaTypes = {
        images: selectedMedia.filter((m) => m.type === 'image').length,
        videos: selectedMedia.filter((m) => m.type === 'video').length,
      }

      const generated = await generateMediaDescription(
        selectedMedia.length,
        mediaTypes,
        location || undefined
      )

      setDescription(generated)
      toast.success('AI description generated!')
    } catch (error) {
      toast.error('Failed to generate description')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  // ==================== SAVE ENTRY ====================
  const handleSaveEntry = () => {
    if (!title.trim()) {
      toast.error('Please add a title')
      return
    }
    if (selectedMedia.length === 0) {
      toast.error('Please upload at least one photo or video')
      return
    }

    addEntry({
      title: title.trim(),
      description: description.trim(),
      location: location.trim() || undefined,
      media: selectedMedia,
      tags: [],
    })

    // Reset form
    setTitle('')
    setDescription('')
    setLocation('')
    setSelectedMedia([])
    if (fileInputRef.current) fileInputRef.current.value = ''

    toast.success('Journal entry saved!')
  }

  const handleShare = (entry: JournalEntry) => {
    setSelectedEntryForShare(entry)
    setShareDialogOpen(true)
  }

  const handleShareComplete = (platform: SocialPlatform) => {
    if (selectedEntryForShare) {
      markAsShared(selectedEntryForShare.id, platform)
    }
  }

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id)
    toast.success('Entry deleted')
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Camera size={40} className="text-primary" weight="fill" />
          <h1 className="text-4xl font-bold">Travel Journal</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Document your adventures with photos, videos, and AI-powered descriptions
        </p>
      </div>

      {/* Create New Entry */}
      <Card className="max-w-5xl mx-auto glass-surface">
        <CardHeader>
          <CardTitle>Create New Entry</CardTitle>
          <CardDescription>
            Upload photos and videos from your travels, add details, and share to social media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Give your entry a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              placeholder="Where was this taken?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Media Upload */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              id="media-upload"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="media-upload">
              <Button asChild variant="outline" size="lg" className="gap-2 cursor-pointer">
                <Upload size={20} />
                Choose Photos & Videos
              </Button>
            </label>
            <p className="text-sm text-muted-foreground mt-4">
              Click to select multiple photos and videos
            </p>
          </div>

          {/* Media Preview */}
          {selectedMedia.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Selected Media ({selectedMedia.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedMedia.map((media) => (
                  <div
                    key={media.id}
                    className="relative aspect-square rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {media.type === 'image' ? (
                      <img src={media.url} alt="Selected media" className="w-full h-full object-cover" />
                    ) : (
                      <div className="relative w-full h-full">
                        <video src={media.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Video size={48} className="text-white" weight="fill" />
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => removeMedia(media.id)}
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} weight="bold" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {media.type === 'image' ? <ImageIcon size={12} weight="fill" /> : <Video size={12} weight="fill" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description + AI Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isGenerating || selectedMedia.length === 0}
                className="gap-2"
              >
                <Sparkle size={16} weight="fill" />
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder="Describe your experience, key moments & how it felt... or let AI generate a polished description ✨"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveEntry}
            size="lg"
            className="w-full gap-2"
            disabled={!title.trim() || selectedMedia.length === 0}
          >
            <Camera size={20} weight="fill" />
            Save Journal Entry
          </Button>
        </CardContent>
      </Card>

      {/* Existing Entries */}
      {entries.length > 0 && (
        <div className="max-w-5xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold">Your Entries</h2>
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="glass-surface">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{entry.title}</CardTitle>
                      {entry.location && <p className="text-sm text-muted-foreground mt-1">📍 {entry.location}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleShare(entry)} className="gap-2">
                        <Share size={16} weight="fill" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {entry.media.map((media) => (
                      <div key={media.id} className="relative aspect-square rounded-lg overflow-hidden border shadow-sm">
                        {media.type === 'image' ? (
                          <img src={media.url} alt="Journal media" className="w-full h-full object-cover" />
                        ) : (
                          <video src={media.url} controls className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                  {entry.description && <p className="text-sm whitespace-pre-wrap">{entry.description}</p>}
                  {entry.sharedOn && entry.sharedOn.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {entry.sharedOn.map((platform) => (
                        <span
                          key={platform}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          Shared on {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="max-w-5xl mx-auto">
          <Card className="glass-surface">
            <CardContent className="text-center py-12">
              <Camera size={64} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No journal entries yet. Create your first one above!</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Social Share Dialog */}
      <SocialShareDialog
        entry={selectedEntryForShare}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onShare={handleShareComplete}
      />
    </div>
  )
}