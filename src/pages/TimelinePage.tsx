import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { HelpTip } from '../components/ui/HelpTip'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/Reveal'
import { SourceMeta } from '../components/ui/SourceMeta'
import { Chip } from '../components/ui/StatusBadge'
import { Notice } from '../components/ui/States'
import { authorityMeta } from '../data/authorities'
import type { StepTag, TimelineStep } from '../domain/types'
import { useI18n } from '../hooks/useI18n'
import { useProjectSession } from '../hooks/useProjectSession'
import { cn } from '../lib/cn'

export function TimelinePage() {
  const { t } = useI18n()
  const { results } = useProjectSession()
  const [open, setOpen] = useState<Record<string, boolean>>({ 'step-prepare': true })
  if (!results) return null
  const { core, sectorBranch } = results.timeline
  const allOpen = core.every((s) => open[s.id])

  return (
    <div className="space-y-6">
      <PageHeader title={t('timeline.title')} lead={t('timeline.lead')}>
        <Button variant="secondary" size="sm" onClick={() => setOpen(allOpen ? {} : Object.fromEntries([...core, ...(sectorBranch ? [sectorBranch] : [])].map((s) => [s.id, true])))}>
          {allOpen ? t('documents.collapseAll') : t('documents.expandAll')}
        </Button>
      </PageHeader>
      <Notice icon="info">{t('timeline.varies')}</Notice>

      <ol className="relative">
        <span aria-hidden="true" className="absolute bottom-8 top-8 w-px bg-gradient-to-b from-[var(--ink)] via-[var(--line-strong)] to-transparent start-[23px]" />
        {core.map((s, i) => (
          <li key={s.id} className="relative pb-4 ps-16 last:pb-0">
            <span
              aria-hidden="true"
              className={cn(
                'absolute start-0 top-4 flex h-12 w-12 items-center justify-center rounded-[16px] text-[17px] font-semibold tabular-nums',
                !s.applicable ? 'border border-dashed border-line-strong bg-surface text-faint' : i === 0 ? 'btn-primary' : 'glass glass-strong text-ink',
              )}
            >
              {i + 1}
            </span>
            <StepCard step={s} index={i + 1} open={!!open[s.id]} toggle={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))} />
          </li>
        ))}
      </ol>

      {sectorBranch && (
        <div className="relative rounded-[28px] border-2 border-dashed border-line-strong p-3 sm:p-4">
          <p className="mb-3 flex items-center gap-2 px-2 pt-1 text-[13px] font-semibold uppercase tracking-wider text-muted">
            <Icon name="alert" size={15} />
            {t('timeline.sectorBranch')}
          </p>
          <StepCard step={sectorBranch} index={null} open={!!open[sectorBranch.id]} toggle={() => setOpen((o) => ({ ...o, [sectorBranch.id]: !o[sectorBranch.id] }))} />
        </div>
      )}

      <SourceMeta meta={core[0]} />
    </div>
  )
}

function StepCard({ step, index, open, toggle }: { step: TimelineStep; index: number | null; open: boolean; toggle: () => void }) {
  const { t, l } = useI18n()
  const reduce = useReducedMotion()
  const tagMeta: Record<StepTag, { label: string; icon: string; tone: 'soft' | 'outline' | 'dashed' }> = {
    'to-prepare': { label: t('documents.toPrepare'), icon: 'circle', tone: 'soft' },
    conditional: { label: t('documents.conditional'), icon: 'layers', tone: 'outline' },
    verify: { label: t('common.verifyNeeded'), icon: 'alert', tone: 'dashed' },
  }
  const help = step.id === 'step-rne' ? 'immatriculation' : step.id === 'step-capital' ? 'apport' : step.id === 'step-statutes' ? 'statuts' : null
  return (
    <article className={cn('card overflow-hidden rounded-[24px]', !step.applicable && 'opacity-70')}>
      <button type="button" onClick={toggle} aria-expanded={open} className="flex w-full items-start gap-4 p-5 text-start transition-colors hover:bg-surface-2/50 sm:p-6">
        <div className="min-w-0 flex-1">
          {index !== null && (
            <p className="text-[12px] font-semibold uppercase tracking-wider text-faint">
              {t('timeline.step')} {index}
            </p>
          )}
          <h2 className="mt-0.5 text-[17.5px] font-semibold leading-snug text-ink">{l(step.title)}</h2>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {!step.applicable ? (
              <Chip tone="dashed" icon="minus">
                {t('timeline.notApplicable')}
              </Chip>
            ) : (
              step.tags.map((tag) => (
                <Chip key={tag} tone={tagMeta[tag].tone} icon={tagMeta[tag].icon}>
                  {tagMeta[tag].label}
                </Chip>
              ))
            )}
            {step.actors.map((a) => (
              <Chip key={a} tone="soft" icon="building">
                {l(authorityMeta[a].label)}
              </Chip>
            ))}
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 pt-1 text-[13px] font-medium text-muted">
          <span className="hidden sm:inline">{open ? t('timeline.collapse') : t('timeline.expand')}</span>
          <Icon name="chevron-down" size={19} className={cn('transition-transform duration-300', open && 'rotate-180')} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-5 pb-6 pt-5 sm:px-6">
              {step.applicabilityNote && <p className="mb-4 rounded-[14px] bg-surface-2 px-4 py-2.5 text-[13.5px] font-medium text-ink-2">{l(step.applicabilityNote)}</p>}
              <dl className="grid gap-5 md:grid-cols-2">
                <Detail icon="target" label={t('timeline.objective')} extra={help ? <HelpTip term={help} /> : null}>
                  {l(step.objective)}
                </Detail>
                <Detail icon="building" label={t('timeline.actor')}>
                  {l(step.actorsLabel)}
                </Detail>
                <Detail icon="file" label={t('timeline.documents')}>
                  <ul className="space-y-1">
                    {step.documents.map((d) => (
                      <li key={d.fr} className="flex items-start gap-1.5">
                        <Icon name="check" size={14} className="mt-1 shrink-0" />
                        {l(d)}
                      </li>
                    ))}
                  </ul>
                </Detail>
                <Detail icon="check-circle" label={t('timeline.result')}>
                  {l(step.result)}
                </Detail>
              </dl>
              <p className="mt-5 flex items-start gap-2 text-[13.5px] leading-relaxed text-muted">
                <Icon name="info" size={15} className="mt-0.5 shrink-0" />
                {l(step.notes)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}

function Detail({ icon, label, children, extra }: { icon: string; label: string; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-wider text-faint">
        <Icon name={icon} size={14} />
        {label}
        {extra}
      </dt>
      <dd className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{children}</dd>
    </div>
  )
}
