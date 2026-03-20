/**
 * TtsLogo – the "TTs ✦ TRAVELS" wordmark SVG component.
 *
 * Matches the brand logo: chrome rose-gold metallic "TTs" with sparkle stars,
 * and "TRAVELS" in deep-plum tracking-widest caps below.
 *
 * Props:
 *   size   – controls the height in px (width scales proportionally). Default: 48
 *   dark   – when true, uses light variant colours for dark backgrounds
 *   mono   – when true, renders in a single colour (primary) – for favicons / og-images
 */

type TtsLogoProps = {
  size?: number
  dark?: boolean
  mono?: boolean
  className?: string
}

/** Width-to-height ratio of the wordmark viewBox (612 / 240) */
const ASPECT_RATIO = 2.55

export function TtsLogo({ size = 48, dark = false, mono = false, className = '' }: TtsLogoProps) {
  // Width scales proportionally from the viewBox aspect ratio
  const w = Math.round(size * ASPECT_RATIO)
  const h = size

  // Colour tokens matching the brand palette
  const goldStart = mono ? 'oklch(58% .09 5)' : '#D4967A'  // warm rose gold highlight
  const goldMid   = mono ? 'oklch(52% .09 5)' : '#B76C7A'  // chrome rose gold
  const goldEnd   = mono ? 'oklch(44% .08 5)' : '#8C4A56'  // deep rose gold shadow
  const textColor = dark || mono ? (mono ? 'oklch(58% .09 5)' : '#F5E8E3') : '#6B4C7A' // deep plum

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 612 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TTs Travels"
      className={className}
    >
      <defs>
        {/* Metallic rose-gold gradient for the letterforms */}
        <linearGradient id="ttsMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={goldStart} />
          <stop offset="40%"  stopColor={goldMid} />
          <stop offset="100%" stopColor={goldEnd} />
        </linearGradient>
        {/* Slightly lighter version for the small "s" */}
        <linearGradient id="ttsMetalS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={goldStart} />
          <stop offset="60%"  stopColor={goldMid} />
          <stop offset="100%" stopColor={goldEnd} />
        </linearGradient>
      </defs>

      {/* ── "T" (first) ─────────────────────────────────────────────────── */}
      {/* Horizontal crossbar */}
      <rect x="8"   y="12" width="174" height="18" rx="4" fill="url(#ttsMetal)" />
      {/* Vertical stem */}
      <rect x="81"  y="12" width="20"  height="148" rx="4" fill="url(#ttsMetal)" />

      {/* ── "T" (second) ────────────────────────────────────────────────── */}
      <rect x="200" y="12" width="174" height="18" rx="4" fill="url(#ttsMetal)" />
      <rect x="273" y="12" width="20"  height="148" rx="4" fill="url(#ttsMetal)" />

      {/* ── "s" (small, italic serif feel) ─────────────────────────────── */}
      {/*
        Two cubic-bezier arcs that form a correct lowercase 's':
        – Upper bowl: starts right (x≈462), arcs UP+LEFT over the top, descends
          to the left side (x≈388) at the midpoint. The concave face opens RIGHT.
        – Lower bowl: continues straight down from the left side, dips BELOW the
          end-point (creating the visible bottom curve), then rises to the right
          side (x≈460). The concave face opens LEFT.
        Both arcs share a vertical tangent at the midpoint for a smooth join.
      */}
      <path
        d="M462 90 C464 68,388 62,388 110 C388 152,466 174,460 168"
        stroke="url(#ttsMetalS)"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Sparkle stars ───────────────────────────────────────────────── */}
      {/* Large 4-point star */}
      <g fill={goldMid}>
        <path d="M510 46 L515 62 L531 56 L515 68 L510 84 L505 68 L489 56 L505 62 Z" />
      </g>
      {/* Small star */}
      <g fill={goldStart} opacity="0.85">
        <path d="M538 18 L541 26 L549 24 L541 30 L538 38 L535 30 L527 24 L535 26 Z" />
      </g>
      {/* Tiny dot star */}
      <circle cx="492" cy="28" r="3.5" fill={goldStart} opacity="0.7" />

      {/* ── "TRAVELS" wordmark ──────────────────────────────────────────── */}
      <text
        x="306"
        y="215"
        textAnchor="middle"
        fontFamily="'Space Grotesk', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="500"
        fontSize="46"
        letterSpacing="14"
        fill={textColor}
        style={{ fontFamily: "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif" }}
      >
        TRAVELS
      </text>
    </svg>
  )
}
