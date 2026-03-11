import { Link } from 'react-router-dom'
import { Warning, ArrowRight } from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SetupModal({ open, onOpenChange }: SetupModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Warning size={24} className="text-accent" weight="fill" />
            </div>
            <DialogTitle>OpenAI Integration Required</DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-3">
            <p>
              The AI Trip Planner requires an OpenAI API key to generate
              personalized itineraries.
            </p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="font-medium text-foreground">Quick Setup:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Visit the Setup page for detailed instructions</li>
                <li>Get your API key from OpenAI</li>
                <li>Add it to your environment variables</li>
                <li>Restart the app to enable AI features</li>
              </ol>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Link to="/setup" className="flex-1">
            <Button className="w-full gap-2" onClick={() => onOpenChange(false)}>
              Go to Setup
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
