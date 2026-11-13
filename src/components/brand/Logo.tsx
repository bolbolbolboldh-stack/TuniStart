/** TuniStart mark: a path that rises from a starting point into an arrow. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
      <rect width="64" height="64" rx="18" fill="var(--inverse)" />
      <rect x="0.5" y="0.5" width="63" height="63" rx="17.5" fill="none" stroke="rgba(255,255,255,0.18)" />
      <path d="M18 44c8 0 10-24 18-24h10" stroke="var(--on-inverse)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="18" cy="44" r="4.5" fill="var(--on-inverse)" />
      <path d="M42 14l6 6-6 6" stroke="var(--on-inverse)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" dir="ltr">
      <LogoMark size={compact ? 26 : 30} />
      <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
        Tuni<span className="text-muted">Start</span>
      </span>
    </span>
  )
}
