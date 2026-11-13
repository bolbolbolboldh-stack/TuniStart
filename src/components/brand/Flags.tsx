import type { Lang } from '../../domain/types'

/** Flags drawn as inline SVG (no external assets). Arabic uses the Tunisian flag. */
export function FlagTN({ size = 20 }: { size?: number }) {
  // Red field, white disc, red crescent and five-pointed star.
  return (
    <svg width={size} height={(size * 2) / 3} viewBox="0 0 120 80" aria-hidden="true" className="rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
      <rect width="120" height="80" fill="#E70013" />
      <circle cx="60" cy="40" r="20" fill="#fff" />
      <circle cx="60" cy="40" r="15" fill="#E70013" />
      <circle cx="64" cy="40" r="12" fill="#fff" />
      <polygon fill="#E70013" points="54.50,40.00 60.59,37.88 60.72,31.44 64.61,36.58 70.78,34.71 67.10,40.00 70.78,45.29 64.61,43.42 60.72,48.56 60.59,42.12" />
    </svg>
  )
}

export function FlagFR({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 2) / 3} viewBox="0 0 3 2" aria-hidden="true" className="rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
      <rect width="1" height="2" x="0" fill="#002654" />
      <rect width="1" height="2" x="1" fill="#fff" />
      <rect width="1" height="2" x="2" fill="#CE1126" />
    </svg>
  )
}

export function FlagGB({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 2) / 3} viewBox="0 0 60 40" aria-hidden="true" className="rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
      <clipPath id="gb-c">
        <rect width="60" height="40" />
      </clipPath>
      <g clipPath="url(#gb-c)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 60,40 M60,0 0,40" stroke="#fff" strokeWidth="8" />
        <path d="M0,0 60,40 M60,0 0,40" stroke="#C8102E" strokeWidth="3" />
        <path d="M30,0v40M0,20h60" stroke="#fff" strokeWidth="12" />
        <path d="M30,0v40M0,20h60" stroke="#C8102E" strokeWidth="7" />
      </g>
    </svg>
  )
}

export function Flag({ lang, size }: { lang: Lang; size?: number }) {
  if (lang === 'ar') return <FlagTN size={size} />
  if (lang === 'en') return <FlagGB size={size} />
  return <FlagFR size={size} />
}
