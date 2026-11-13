import { motion, useReducedMotion } from 'motion/react'
import { useI18n } from '../../hooks/useI18n'
import { Icon } from '../ui/Icon'

/**
 * Abstract liquid-glass composition: a flowing path crossing four glass
 * "phase" lenses. Decorative — hidden from assistive tech.
 */
export function HeroVisual() {
  const reduce = useReducedMotion()
  const { t } = useI18n()
  const nodes = [
    { x: 18, y: 72, icon: 'compass', label: t('home.how1') },
    { x: 40, y: 38, icon: 'scale', label: t('home.how2') },
    { x: 64, y: 60, icon: 'list-checks', label: t('home.how3') },
    { x: 84, y: 24, icon: 'file-check', label: t('home.how4') },
  ]
  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[5/4] w-full max-w-[560px] select-none" dir="ltr">
      {/* glass discs */}
      <div className="glass absolute left-[6%] top-[8%] h-[62%] w-[62%] rounded-full opacity-90" />
      <div className="glass absolute bottom-[4%] right-[4%] h-[52%] w-[52%] rounded-full opacity-80" />
      <div className="glass absolute right-[22%] top-[2%] h-[26%] w-[26%] rounded-full opacity-70" />

      {/* flowing path */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hv-line" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0" stopColor="var(--ink)" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="var(--ink)" stopOpacity="0.9" />
            <stop offset="1" stopColor="var(--ink)" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <path d="M2 92 C 14 80, 12 74, 18 72 S 32 40, 40 38 S 56 62, 64 60 S 78 26, 84 24 S 96 10, 99 6" fill="none" stroke="var(--line-strong)" strokeWidth="0.35" strokeDasharray="1 1.4" vectorEffect="non-scaling-stroke" />
        <motion.path
          d="M2 92 C 14 80, 12 74, 18 72 S 32 40, 40 38 S 56 62, 64 60 S 78 26, 84 24 S 96 10, 99 6"
          fill="none"
          stroke="url(#hv-line)"
          strokeWidth="2.2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
        />
      </svg>

      {nodes.map((n, i) => (
        <motion.div
          key={n.icon}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 + i * 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="glass glass-strong flex items-center gap-2 rounded-[18px] py-2 pe-3.5 ps-2">
            <span className={`flex h-9 w-9 items-center justify-center rounded-[12px] ${i === 3 ? 'btn-primary' : 'bg-surface-2 text-ink'}`}>
              <Icon name={n.icon} size={18} />
            </span>
            <span className="hidden whitespace-nowrap text-[12.5px] font-semibold text-ink sm:inline">{n.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
