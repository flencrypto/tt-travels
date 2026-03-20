import { useEffect, useRef, useState, type TransitionEvent } from 'react'
import { TtsLogo } from '@/components/TtsLogo'

/**
 * SplashScreen
 *
 * Full-screen startup screen that mirrors the brand bokeh background image:
 *   – Soft pink-to-warm gradient (portrait orientation)
 *   – Animated bokeh orbs drifting and pulsing
 *   – Animated sparkle stars
 *   – TTs Travels wordmark fading and scaling in
 *   – Animated rose-gold progress bar
 *   – Entire screen fades out once loading is complete
 *
 * Props:
 *   duration  – total visible time in ms before fade-out begins (default 2800)
 *   onDone    – called after the fade-out animation finishes
 */
type SplashScreenProps = {
  duration?: number
  onDone: () => void
}

export function SplashScreen({ duration = 2800, onDone }: SplashScreenProps) {
  const [visible, setVisible] = useState(false)   // entrance: starts hidden, flips to visible
  const [fadeOut, setFadeOut] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Entrance fade-in: flip to visible on first paint
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Single timer — triggers fade-out after the progress animation completes
  useEffect(() => {
    timerRef.current = setTimeout(() => setFadeOut(true), duration)
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [duration])

  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    // Only trigger onDone when the root wrapper finishes its opacity fade
    if (e.propertyName === 'opacity' && fadeOut) {
      onDone()
    }
  }

  return (
    <div
      aria-label="Loading TTs Travels"
      aria-live="polite"
      role="status"
      className="splash-root"
      style={{
        opacity: fadeOut ? 0 : visible ? 1 : 0,
        transition: fadeOut
          ? 'opacity 0.65s ease-in-out'
          : visible
            ? 'opacity 0.4s ease-out'
            : 'none',
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      {/* ── Background gradient ───────────────────────────────────────── */}
      <div className="splash-bg" />

      {/* ── Bokeh orb layer ───────────────────────────────────────────── */}
      <div className="splash-bokeh" aria-hidden="true">
        {/* Large warm-gold orbs (bottom cluster) */}
        <div className="bokeh-orb orb-1" />
        <div className="bokeh-orb orb-2" />
        <div className="bokeh-orb orb-3" />
        <div className="bokeh-orb orb-4" />
        <div className="bokeh-orb orb-5" />
        <div className="bokeh-orb orb-6" />
        {/* Smaller accent orbs */}
        <div className="bokeh-orb orb-sm-1" />
        <div className="bokeh-orb orb-sm-2" />
        <div className="bokeh-orb orb-sm-3" />
        {/* Soft pink upper corner orbs */}
        <div className="bokeh-orb orb-pk-1" />
        <div className="bokeh-orb orb-pk-2" />
      </div>

      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div className="splash-logo">
        <TtsLogo size={140} dark />
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────── */}
      <div className="splash-progress-wrap" aria-hidden="true">
        <div
          className="splash-progress-bar"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  )
}
