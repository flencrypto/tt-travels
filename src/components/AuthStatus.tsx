import { useUser } from '@clerk/react'
import { CheckCircle, XCircle, Warning } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function AuthStatus() {
  const { isLoaded, isSignedIn } = useUser()
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const isConfigured = publishableKey && publishableKey !== 'pk_test_placeholder'
  
  if (!isLoaded) {
    return null
  }
  
  if (!isConfigured) {
    return (
      <Alert className="border-destructive/50 bg-destructive/10">
        <XCircle size={20} weight="fill" className="text-destructive" />
        <AlertTitle className="text-destructive-foreground">Authentication Not Configured</AlertTitle>
        <AlertDescription className="text-destructive-foreground/80">
          Clerk authentication is not set up. See <code className="rounded bg-destructive/20 px-1 py-0.5 text-sm">AUTH_QUICK_FIX.md</code> for setup instructions.
        </AlertDescription>
      </Alert>
    )
  }
  
  if (isSignedIn) {
    return (
      <Alert className="border-accent/50 bg-accent/10">
        <CheckCircle size={20} weight="fill" className="text-accent" />
        <AlertTitle className="text-accent-foreground">Authentication Working</AlertTitle>
        <AlertDescription className="text-accent-foreground/80">
          You're signed in and your data is syncing across devices.
        </AlertDescription>
      </Alert>
    )
  }
  
  return (
    <Alert className="border-muted-foreground/50 bg-muted/50">
      <Warning size={20} weight="fill" className="text-muted-foreground" />
      <AlertTitle className="text-foreground">Ready to Sign In</AlertTitle>
      <AlertDescription className="text-muted-foreground">
        Clerk is configured. Click "Sign In" or "Sign Up" in the navigation to get started.
      </AlertDescription>
    </Alert>
  )
}
