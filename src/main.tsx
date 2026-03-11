import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"
import { ClerkProvider } from "@clerk/react"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey || publishableKey === 'pk_test_placeholder') {
  console.warn(
    '⚠️ Clerk Publishable Key not configured!\n\n' +
    'To enable authentication:\n' +
    '1. Get your key from: https://dashboard.clerk.com/~/api-keys\n' +
    '2. Add it to .env.local: VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key\n' +
    '3. Restart the dev server\n\n' +
    'See CLERK_SETUP.md for detailed instructions.'
  )
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ClerkProvider 
      publishableKey={publishableKey || 'pk_test_placeholder'} 
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/setup"
      appearance={{
        variables: {
          colorPrimary: "oklch(0.45 0.15 250)",
          colorBackground: "oklch(0.98 0.01 240)",
          fontFamily: "'Space Grotesk', sans-serif",
          borderRadius: "0.75rem"
        }
      }}
    >
      <App />
    </ClerkProvider>
   </ErrorBoundary>
)
