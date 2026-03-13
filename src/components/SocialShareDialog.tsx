import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InstagramLogo, FacebookLogo, TiktokLogo, CheckCircle } from '@phosphor-icons/react'
import type { JournalEntry, SocialPlatform } from '@/lib/types'
import { toast } from 'sonner'

interface SocialShareDialogProps {
  entry: JournalEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onShare: (platform: SocialPlatform) => void
}

export function SocialShareDialog({ entry, open, onOpenChange, onShare }: SocialShareDialogProps) {
  const [sharing, setSharing] = useState<SocialPlatform | null>(null)

  if (!entry) return null

  const handleShare = async (platform: SocialPlatform) => {
    setSharing(platform)

    try {
      // For Instagram, Facebook, and TikTok, we'll use the Web Share API or provide sharing URLs
      let shareUrl = ''
      const shareText = `${entry.title}\n\n${entry.description}`

      if (platform === 'instagram') {
        // Instagram doesn't have a direct web share URL, but we can use the Web Share API
        // or open the Instagram app with intent URLs on mobile
        if (navigator.share) {
          await navigator.share({
            title: entry.title,
            text: entry.description,
          })
        } else {
          // Fallback: Copy to clipboard and show instructions
          await navigator.clipboard.writeText(shareText)
          toast.success('Content copied! Open Instagram to share.')
        }
      } else if (platform === 'facebook') {
        // Facebook share dialog
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`
        window.open(shareUrl, '_blank', 'width=600,height=400')
      } else if (platform === 'tiktok') {
        // TikTok doesn't have a direct web share, but we can copy content
        if (navigator.share) {
          await navigator.share({
            title: entry.title,
            text: entry.description,
          })
        } else {
          await navigator.clipboard.writeText(shareText)
          toast.success('Content copied! Open TikTok to share.')
        }
      }

      onShare(platform)
      toast.success(`Shared to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`)
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error(`Failed to share to ${platform}`)
      }
    } finally {
      setSharing(null)
    }
  }

  const platformButtons: { platform: SocialPlatform; icon: typeof InstagramLogo; label: string; color: string }[] = [
    { platform: 'instagram', icon: InstagramLogo, label: 'Instagram', color: 'bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600' },
    { platform: 'facebook', icon: FacebookLogo, label: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
    { platform: 'tiktok', icon: TiktokLogo, label: 'TikTok', color: 'bg-black hover:bg-gray-900' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share to Social Media</DialogTitle>
          <DialogDescription>
            Share your travel experience with friends and followers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-semibold mb-2">{entry.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">{entry.description}</p>
            {entry.location && (
              <p className="text-xs text-muted-foreground mt-2">📍 {entry.location}</p>
            )}
          </div>

          <div className="space-y-3">
            {platformButtons.map(({ platform, icon: Icon, label, color }) => {
              const isShared = entry.sharedOn?.includes(platform)
              const isSharing = sharing === platform

              return (
                <Button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  disabled={isSharing}
                  className={`w-full justify-between ${color} text-white`}
                  size="lg"
                >
                  <div className="flex items-center gap-2">
                    <Icon size={24} weight="fill" />
                    <span>{label}</span>
                  </div>
                  {isShared && <CheckCircle size={20} weight="fill" className="text-white" />}
                </Button>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
