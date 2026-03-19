import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import { registerSW } from 'virtual:pwa-register'
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./index.css"

// Register service worker with auto-update. A toast or banner could be shown
// to the user when an update is available by calling updateSW().
registerSW({
  onNeedRefresh() {
    // Service worker has fetched a new version – auto-apply after next reload
  },
  onOfflineReady() {
    console.info('[PWA] App ready for offline use.')
  },
})

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>
)
