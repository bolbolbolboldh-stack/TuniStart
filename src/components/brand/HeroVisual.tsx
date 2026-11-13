import { motion, useReducedMotion } from 'motion/react'
import { useI18n } from '../../hooks/useI18n'
import { Icon } from '../ui/Icon'

/**
 * Hero composition: layered liquid-glass panes showing the product's flow
 * (question → orientation → checklist). Decorative and hidden from assistive tech;
 * it shows the teaching example only, never real metrics.
 */
export function HeroVisual() {
  const reduce = useReducedMotion()
  const { t } = useI18n()
  const enter = (delay: number, y = 16) =>
    reduce ? {} : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] as const } }

  return (
    <div aria-hidden="true" className="relative mx-auto aspect-[1/1] w-full max-w-[540px] select-none sm:aspect-[6/5]">
      {/* light orbs behind the glass */}
      <div className="absolute left-[8%] top-[10%] h-[46%] w-[46%] rounded-full bg-[radial-gradient(circle_at_30%_30%,var(--surface),transparent_70%)] opacity-90 blur-2xl" />
      <div className="absolute bottom-[6%] right-[4%] h-[50%] w-[50%] rounded-full bg-[radial-gradient(circle,var(--line-strong),transparent_70%)] opacity-70 blur-3xl" />

      {/* flow line */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <motion.path
          d="M6 86 C 22 86, 18 52, 40 50 S 70 22, 94 12"
          fill="none"
          stroke="var(--ink)"
          strokeOpacity="0.35"
          strokeWidth="1.4"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
          {...(reduce ? {} : { initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 2, delay: 0.3, ease: [0.65, 0, 0.35, 1] } })}
        />
      </svg>

      {/* back pane for depth */}
      <div className="glass absolute left-[14%] top-[6%] h-[70%] w-[72%] rotate-[-5deg] rounded-[30px] opacity-60" />

      {/* main pane: diagnostic question */}
      <motion.div {...enter(0.1)} className="glass glass-strong absolute left-[8%] top-[20%] w-[72%] rounded-[28px] p-[5%]">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          </div>
          <span className="text-[11px] font-semibold text-muted">{t('wizard.stepOf', { n: 2 })}</span>
        </div>
        <div className="mt-3 flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <span key={i} className={`h-1 flex-1 rounded-full ${i <= 2 ? 'bg-ink' : 'bg-surface-3'}`} />
          ))}
        </div>
        <p className="mt-4 text-[clamp(13px,2.6vw,17px)] font-semibold leading-snug text-ink">{t('wizard.s2q')}</p>
        <div className="mt-3 space-y-2">
          {[
            { icon: 'user-check', label: t('wizard.one'), on: true },
            { icon: 'users', label: t('wizard.two'), on: false },
            { icon: 'building', label: t('wizard.threePlus'), on: false },
          ].map((o) => (
            <div
              key={o.label}
              className={`flex items-center gap-2.5 rounded-[14px] border px-3 py-2 text-[clamp(11px,2vw,13.5px)] font-medium ${
                o.on ? 'border-ink bg-surface text-ink shadow-[0_0_0_1px_var(--ink)]' : 'border-line bg-surface/60 text-ink-2'
              }`}
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] ${o.on ? 'bg-ink text-on-inverse' : 'bg-surface-2'}`}>
                <Icon name={o.icon} size={13} />
              </span>
              <span className="truncate">{o.label}</span>
              {o.on && <Icon name="check-circle" size={15} className="ms-auto shrink-0" />}
            </div>
          ))}
        </div>
      </motion.div>

      {/* orientation card */}
      <motion.div {...enter(0.45, -12)} className="absolute right-0 top-0 w-[42%] animate-[float_7s_ease-in-out_infinite] motion-reduce:animate-none">
        <div className="glass glass-strong rounded-[22px] p-[8%]">
          <span className="inline-flex items-center gap-1 rounded-full bg-inverse px-2 py-0.5 text-[10px] font-semibold text-on-inverse">
            <Icon name="scale" size={11} />
            {t('results.leadingForm')}
          </span>
          <p className="mt-2 text-[clamp(22px,5vw,34px)] font-semibold leading-none tracking-tight text-ink">SUARL</p>
          <p className="mt-1 text-[10.5px] text-muted">{t('common.sample')}</p>
        </div>
      </motion.div>

      {/* checklist card */}
      <motion.div {...enter(0.7, 12)} className="absolute bottom-[3%] right-[6%] w-[50%] animate-[float_8s_ease-in-out_1s_infinite] motion-reduce:animate-none">
        <div className="glass glass-strong rounded-[22px] p-[7%]">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-muted">
            <Icon name="list-checks" size={13} />
            {t('results.docsPrepared')}
          </div>
          <div className="mt-2 space-y-1.5">
            {[true, true, false].map((done, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`flex h-4 w-4 items-center justify-center rounded-[5px] border ${done ? 'border-ink bg-ink text-on-inverse' : 'border-line-strong'}`}>
                  {done && <Icon name="check" size={10} strokeWidth={3} />}
                </span>
                <span className={`h-1.5 rounded-full ${done ? 'bg-ink/25' : 'bg-surface-3'}`} style={{ width: `${70 - i * 14}%` }} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* PDF chip */}
      <motion.div {...enter(0.9, 12)} className="absolute bottom-[12%] left-[2%]">
        <div className="glass glass-strong flex items-center gap-2 rounded-[16px] py-2 pe-3 ps-2">
          <span className="btn-primary flex h-8 w-8 items-center justify-center rounded-[10px]">
            <Icon name="file-check" size={16} />
          </span>
          <span className="text-[11.5px] font-semibold text-ink">PDF</span>
        </div>
      </motion.div>
    </div>
  )
}
