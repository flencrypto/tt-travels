import { useState, useRef } from 'react'
import { Camera, Upload, Sparkle, Share, Trash, Video, Image as ImageIcon, X, MapPin, CalendarDots } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    addMediaFiles(Array.from(files))
  }

  const addMediaFiles = (files: File[]) => {
    const newMedia: JournalMedia[] = files.map((file) => ({
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith('image/') || f.type.startsWith('video/')
    )
    if (files.length > 0) addMediaFiles(files)
  }

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
      const generated = await generateMediaDescription(selectedMedia.length, mediaTypes, location || undefined)
      setDescription(generated)
      toast.success('AI description generated!')
    } catch (error) {
      toast.error('Failed to generate description')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

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

    setTitle('')
    setDescription('')
    setLocation('')
    setSelectedMedia([])
    if (fileInputRef.current) fileInputRef.current.value = ''
    toast.success('Journal entry saved! ✨')
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
    <div className="min-h-screen space-y-10">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <section className="hero-section -mx-4 -mt-6 px-6 pt-12 pb-10">
        <div className="container mx-auto max-w-5xl">
          <div className="eyebrow mb-3">Your Story Awaits</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Travel <span className="gradient-text">Journal</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Document your adventures with photos, videos, and AI-powered descriptions. Share your story with the world.
          </p>
        </div>
      </section>

      {/* ── Create + Entries Layout ───────────────────────────────────── */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── New Entry Form (left / top) ───────────────────────────── */}
          <div className="lg:col-span-2 space-y-0">
            <Card className="glass-surface border-border/50 sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <div className="feature-icon w-8 h-8 rounded-xl flex items-center justify-center">
                    <Camera size={16} weight="fill" className="text-primary" />
                  </div>
                  New Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Name this memory..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-border/60"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Location
                  </Label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" weight="fill" />
                    <Input
                      id="location"
                      placeholder="Where was this?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-9 border-border/60"
                    />
                  </div>
                </div>

                {/* Media Upload Zone */}
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-border/60 hover:border-primary/50 hover:bg-muted/20'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="media-upload"
                  />
                  <div className="feature-icon w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Upload size={20} className="text-primary" weight="fill" />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {isDragging ? 'Drop your files here' : 'Upload Photos & Videos'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Click or drag & drop
                  </p>
                </div>

                {/* Media Preview Grid */}
                {selectedMedia.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      {selectedMedia.length} file{selectedMedia.length > 1 ? 's' : ''} selected
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedMedia.map((media) => (
                        <div key={media.id} className="relative aspect-square rounded-xl overflow-hidden group">
                          {media.type === 'image' ? (
                            <img src={media.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="relative w-full h-full bg-muted">
                              <video src={media.url} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Video size={24} className="text-white" weight="fill" />
                              </div>
                            </div>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeMedia(media.id) }}
                            className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} weight="bold" />
                          </button>
                          <div className="absolute bottom-1 left-1">
                            {media.type === 'image'
                              ? <ImageIcon size={10} weight="fill" className="text-white/80" />
                              : <Video size={10} weight="fill" className="text-white/80" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Description
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGenerateDescription}
                      disabled={isGenerating || selectedMedia.length === 0}
                      className="h-7 gap-1 text-xs text-primary hover:text-primary px-2"
                    >
                      <Sparkle size={12} weight="fill" />
                      {isGenerating ? 'Writing...' : 'AI Write'}
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Describe your experience..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="border-border/60 resize-none text-sm"
                  />
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSaveEntry}
                  className="w-full gap-2 shadow-sm shadow-primary/20"
                  disabled={!title.trim() || selectedMedia.length === 0}
                >
                  <Camera size={16} weight="fill" />
                  Publish Entry
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ── Entries Feed (right / bottom) ─────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            {entries.length === 0 ? (
              <Card className="glass-surface border-border/50">
                <CardContent className="p-16 text-center space-y-4">
                  <div className="feature-icon w-16 h-16 rounded-3xl flex items-center justify-center mx-auto">
                    <Camera size={32} className="text-primary" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-semibold">Your journal is empty</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Start documenting your adventures. Upload your first photo or video to create a memory.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {entries.length} {entries.length === 1 ? 'Memory' : 'Memories'}
                  </h2>
                </div>

                {entries.map((entry) => (
                  <article key={entry.id} className="journal-card glass-surface rounded-2xl overflow-hidden border border-border/50">
                    {/* Cover image */}
                    {entry.media.length > 0 && (
                      <div className="relative aspect-video overflow-hidden">
                        {entry.media[0].type === 'image' ? (
                          <img
                            src={entry.media[0].url}
                            alt={entry.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video src={entry.media[0].url} controls className="w-full h-full object-cover" />
                        )}
                        <div className="destination-overlay absolute inset-0 pointer-events-none" />
                        {/* Media count badge */}
                        {entry.media.length > 1 && (
                          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <ImageIcon size={11} weight="fill" />
                            +{entry.media.length - 1}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-5 space-y-3">
                      {/* Meta row */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDots size={12} weight="fill" />
                          {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        {entry.location && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} weight="fill" className="text-primary/60" />
                              {entry.location}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="font-bold text-xl leading-tight">{entry.title}</h2>

                      {/* Description */}
                      {entry.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {entry.description}
                        </p>
                      )}

                      {/* Extra media thumbnails */}
                      {entry.media.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {entry.media.slice(1, 5).map((media) => (
                            <div key={media.id} className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                              {media.type === 'image' ? (
                                <img src={media.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="relative w-full h-full bg-muted flex items-center justify-center">
                                  <Video size={20} className="text-muted-foreground" weight="fill" />
                                </div>
                              )}
                            </div>
                          ))}
                          {entry.media.length > 5 && (
                            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 text-xs font-semibold text-muted-foreground">
                              +{entry.media.length - 5}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Shared on badges */}
                      {entry.sharedOn && entry.sharedOn.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {entry.sharedOn.map((platform) => (
                            <Badge key={platform} variant="secondary" className="text-xs gap-1">
                              #{platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(entry)}
                          className="gap-1.5 text-xs flex-1 border-border/60"
                        >
                          <Share size={13} weight="fill" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/5 border-border/60"
                        >
                          <Trash size={13} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

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