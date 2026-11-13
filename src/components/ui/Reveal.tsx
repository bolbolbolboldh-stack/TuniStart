import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/** Subtle one-time fade-up when a section enters the viewport. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, lead, center }: { eyebrow?: string; title: string; lead?: string; center?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">{eyebrow}</p>}
      <h2 className="mt-2 text-[30px] font-semibold leading-[1.1] text-ink sm:text-[40px]">{title}</h2>
      {lead && <p className="mt-3 text-[16.5px] leading-relaxed text-muted">{lead}</p>}
    </div>
  )
}

export function PageHeader({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 max-w-2xl">
        {eyebrow && <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">{eyebrow}</p>}
        <h1 className="mt-1 text-[28px] font-semibold leading-tight text-ink sm:text-[34px]">{title}</h1>
        {lead && <p className="mt-2 text-[16px] leading-relaxed text-muted">{lead}</p>}
      </div>
      {children && <div className="no-print flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}
