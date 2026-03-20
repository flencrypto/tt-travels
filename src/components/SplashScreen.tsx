import { useEffect, useRef, useState } from 'react'
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
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  useEffect(() => {
    // Animate progress bar from 0 → 100 over `duration` ms
    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const pct = Math.min((elapsed / duration) * 100, 100)
      setProgress(pct)

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        // Progress done → start fade-out
        setFadeOut(true)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [duration])

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
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
        opacity: fadeOut ? 0 : 1,
        transition: fadeOut ? 'opacity 0.65s ease-in-out' : 'opacity 0.4s ease-out',
        pointerEvents: fadeOut ? 'none' : 'all',
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

      {/* ── Sparkle stars ─────────────────────────────────────────────── */}
      <div className="splash-sparkles" aria-hidden="true">
        <svg className="sparkle sparkle-1" viewBox="0 0 40 40" fill="none">
          <path d="M20 2 L22 18 L38 20 L22 22 L20 38 L18 22 L2 20 L18 18 Z"
                fill="#D4967A" opacity="0.9"/>
        </svg>
        <svg className="sparkle sparkle-2" viewBox="0 0 28 28" fill="none">
          <path d="M14 1 L15.5 12.5 L27 14 L15.5 15.5 L14 27 L12.5 15.5 L1 14 L12.5 12.5 Z"
                fill="#E8B49A" opacity="0.85"/>
        </svg>
        <svg className="sparkle sparkle-3" viewBox="0 0 20 20" fill="none">
          <path d="M10 1 L11 9 L19 10 L11 11 L10 19 L9 11 L1 10 L9 9 Z"
                fill="#D4967A" opacity="0.75"/>
        </svg>
        <svg className="sparkle sparkle-4" viewBox="0 0 16 16" fill="none">
          <path d="M8 1 L8.8 7.2 L15 8 L8.8 8.8 L8 15 L7.2 8.8 L1 8 L7.2 7.2 Z"
                fill="#E8C0A0" opacity="0.70"/>
        </svg>
      </div>

      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div className="splash-logo">
        <TtsLogo size={96} dark />
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────── */}
      <div className="splash-progress-wrap" aria-hidden="true">
        <div
          className="splash-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
