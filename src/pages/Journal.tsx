import { useEffect, useMemo, useState } from 'react'
import { Camera, Upload, VideoCamera, InstagramLogo, FacebookLogo, TiktokLogo, Sparkle } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

type MediaType = 'image' | 'video'

type MediaItem = {
  url: string
  type: MediaType
  name: string
  size: number
}

type Platform = 'instagram' | 'facebook' | 'tiktok'

const platformMeta: Record<Platform, { label: string; description: string; accent: string; Icon: typeof InstagramLogo }> = {
  instagram: {
    label: 'Instagram',
    description: 'Share reels or carousels with rich visuals',
    accent: 'from-pink-500 via-orange-400 to-yellow-400',
    Icon: InstagramLogo,
  },
  facebook: {
    label: 'Facebook',
    description: 'Cross-post full stories to friends and groups',
    accent: 'from-blue-500 via-blue-600 to-blue-700',
    Icon: FacebookLogo,
  },
  tiktok: {
    label: 'TikTok',
    description: 'Short-form clips with catchy hooks',
    accent: 'from-slate-900 via-gray-800 to-gray-900',
    Icon: TiktokLogo,
  },
}

export function Journal() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram', 'tiktok'])
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [tiktokHook, setTiktokHook] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [lastPosted, setLastPosted] = useState<string | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newMedia = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
      name: file.name,
      size: file.size,
    }))

    setMedia((prev) => [...prev, ...newMedia])
  }

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    )
  }

  const mediaSummary = useMemo(() => {
    if (!media.length) return 'No media uploaded.'

    const photoCount = media.filter((item) => item.type === 'image').length
    const videoCount = media.filter((item) => item.type === 'video').length

    const details = media.map((item, index) => {
      const sizeMb = (item.size / (1024 * 1024)).toFixed(1)
      return `${index + 1}. ${item.type === 'video' ? 'Video' : 'Photo'} - ${item.name} (${sizeMb}MB)`
    })

    return `Photos: ${photoCount}, Videos: ${videoCount}\n${details.join('\n')}`
  }, [media])

  const handleGenerateDescription = async () => {
    if (!media.length) {
      toast.error('Upload photos or videos before asking for AI suggestions.')
      return
    }

    setAiLoading(true)

    const prompt = spark.llmPrompt`You are a social media copywriter crafting captions for a travel journal. Use the uploaded media details to create a platform-ready post that works for Instagram, Facebook, and TikTok—even when the destination isn't explicitly stated.

Media details:
${mediaSummary}

Return ONLY valid JSON with the following shape:
{
  "caption": "70-120 word first-person caption that paints the scene, feelings, and motion. Keep it inclusive and vivid without inventing precise place names unless obvious from filenames.",
  "hashtags": ["#list", "#5to8", "#relevant", "#short", "#travel"],
  "tiktokHook": "A punchy 40-80 character hook optimized for TikTok/Reels openings"
}

Keep tone: warm, curious, adventurous. Avoid repeating filenames verbatim.`

    try {
      const result = await spark.llm(prompt, 'gpt-4o-mini', true)
      const parsed = JSON.parse(result)

      if (parsed.caption) setCaption(parsed.caption.trim())
      if (Array.isArray(parsed.hashtags)) setHashtags(parsed.hashtags.slice(0, 8))
      if (parsed.tiktokHook) setTiktokHook(parsed.tiktokHook.trim())
      toast.success('AI description ready to share')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate AI description')
    } finally {
      setAiLoading(false)
    }
  }

  const handlePost = async () => {
    if (!media.length) {
      toast.error('Add at least one photo or video to post.')
      return
    }

    if (!selectedPlatforms.length) {
      toast.error('Select at least one platform to post to.')
      return
    }

    setPosting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      const platformNames = selectedPlatforms.map((p) => platformMeta[p].label).join(', ')
      toast.success(`Post scheduled for ${platformNames}`, {
        description: caption ? 'Using your current caption and media selection' : 'Using default captionless post',
      })
      setLastPosted(`Posted to ${platformNames} just now`)
    } catch {
      toast.error('Unable to schedule posts right now')
    } finally {
      setPosting(false)
    }
  }

  useEffect(() => {
    return () => {
      media.forEach((item) => URL.revokeObjectURL(item.url))
    }
  }, [media])

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Camera size={40} className="text-primary" weight="fill" />
          <h1 className="text-4xl font-bold">Travel Journal</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Document your adventures with photos, videos, AI-crafted captions, and one-click social sharing
        </p>
      </div>

      <div className="grid gap-6 max-w-5xl mx-auto">
        <Card className="glass-surface">
          <CardHeader>
            <CardTitle>Upload Media</CardTitle>
            <CardDescription>
              Bring in photos or short clips and we will keep them ready for captions and sharing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-primary transition-colors bg-muted/30">
              <input
                type="file"
                id="media-upload"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="media-upload">
                <Button asChild variant="outline" size="lg" className="gap-2 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Upload size={20} />
                    Add Photos or Videos
                  </span>
                </Button>
              </label>
              <p className="text-sm text-muted-foreground mt-4">
                Supports JPG, PNG, HEIC, MP4, MOV. You can select multiple files at once.
              </p>
            </div>

            {media.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      {media.filter((item) => item.type === 'image').length} photos
                    </Badge>
                    <Badge variant="secondary">
                      {media.filter((item) => item.type === 'video').length} videos
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    AI uses filenames and media type to craft the story—no content is sent.
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {media.map((item, index) => (
                    <div
                      key={`${item.url}-${index}`}
                      className="relative aspect-square rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
                    >
                      {item.type === 'video' ? (
                        <video
                          src={item.url}
                          controls
                          muted
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.name || `Travel media ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className="backdrop-blur bg-background/80">
                          {item.type === 'video' ? <VideoCamera size={14} className="mr-2" /> : <Camera size={14} className="mr-2" />}
                          {item.type === 'video' ? 'Video' : 'Photo'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {media.length === 0 && (
              <div className="text-center py-10">
                <Camera size={64} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No media uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-surface">
          <CardHeader>
            <CardTitle>AI Story & Social Posting</CardTitle>
            <CardDescription>
              Generate platform-ready captions and push them to Instagram, Facebook, and TikTok
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <Sparkle size={22} className="text-accent mt-1" weight="fill" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="sm" onClick={handleGenerateDescription} disabled={aiLoading}>
                    {aiLoading ? 'Thinking...' : 'AI Suggestion'}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Let AI turn your media list into a story-ready caption with hashtags and hooks.
                  </p>
                </div>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write or generate your caption..."
                  className="min-h-[140px]"
                />
                {tiktokHook && (
                  <div className="text-sm text-muted-foreground">
                    TikTok hook: <span className="text-foreground font-medium">{tiktokHook}</span>
                  </div>
                )}
                {hashtags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {hashtags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(platformMeta).map(([key, meta]) => {
                  const platform = key as Platform
                  const active = selectedPlatforms.includes(platform)
                  return (
                    <div
                      key={platform}
                      className={`border rounded-xl p-4 bg-gradient-to-br ${meta.accent} text-white shadow-sm`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <meta.Icon size={24} weight="fill" />
                          <div>
                            <p className="font-semibold">{meta.label}</p>
                            <p className="text-xs opacity-85">{meta.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={active}
                          onCheckedChange={() => togglePlatform(platform)}
                          aria-label={`Toggle ${meta.label} posting`}
                        />
                      </div>
                      <div className="mt-3 text-xs opacity-90 space-y-1">
                        <p>{platform === 'tiktok' ? 'Auto-uses hook for the opening line.' : 'Uses caption and hashtags as provided.'}</p>
                        <p>{active ? 'Enabled for next post' : 'Tap to include in next post'}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handlePost} disabled={posting} className="gap-2">
                  <Upload size={18} />
                  {posting ? 'Posting...' : 'Post to Selected'}
                </Button>
                <p className="text-sm text-muted-foreground">
                  Your media stays local. We simulate the posting flow so you can stage captions confidently.
                </p>
              </div>
              {lastPosted && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Badge variant="secondary">Latest</Badge>
                  {lastPosted}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
