import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Info, X } from '@phosphor-icons/react'

export function ClerkSetupBanner() {
  const [dismissed, setDismissed] = useState(false)
  
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const isConfigured = publishableKey && publishableKey !== 'pk_test_placeholder'
  
  if (isConfigured || dismissed) {
    return null
  }
  
  return (
    <Alert className="relative border-accent/50 bg-accent/10">
      <Info size={20} weight="fill" className="text-accent" />
      <AlertTitle className="text-accent-foreground">Authentication Setup Required</AlertTitle>
      <AlertDescription className="text-accent-foreground/80">
        To enable sign-in and sign-up features, you need to configure Clerk authentication.{' '}
        <a 
          href="https://dashboard.clerk.com/~/api-keys" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-2 hover:text-accent-foreground"
        >
          Get your Clerk key
        </a>
        {' '}and add it to <code className="rounded bg-accent/20 px-1 py-0.5 text-sm">.env.local</code>.{' '}
        See <code className="rounded bg-accent/20 px-1 py-0.5 text-sm">CLERK_SETUP.md</code> for details.
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6"
        onClick={() => setDismissed(true)}
      >
        <X size={16} />
      </Button>
    </Alert>
  )
}
