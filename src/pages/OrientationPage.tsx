import { useState } from 'react'
import { Card } from '../components/ui/GlassCard'
import { HelpTip } from '../components/ui/HelpTip'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/Reveal'
import { SourceMeta } from '../components/ui/SourceMeta'
import { Chip, ReviewChip } from '../components/ui/StatusBadge'
import { Notice } from '../components/ui/States'
import { getActivity } from '../data/activities'
import { legalForms, getLegalForm } from '../data/legalForms'
import { participantCount } from '../domain/schemas/project.schema'
import type { LegalForm, OrientationRole } from '../domain/types'
import { useI18n } from '../hooks/useI18n'
import { useProjectSession } from '../hooks/useProjectSession'
import { cn } from '../lib/cn'

export function OrientationPage() {
  const { t, l, money, num } = useI18n()
  const { state, results } = useProjectSession()
  const [showAll, setShowAll] = useState(false)
  if (!results) return null
  const { orientation } = results
  const p = state.profile

  const roleLabel: Record<OrientationRole, string> = {
    primary: t('orientation.primary'),
    alternative: t('orientation.alternative'),
    comparison: t('orientation.comparison'),
    'professional-review': t('orientation.proReview'),
  }
  const n = participantCount(p)
  const liability = p.liability === 'yes' ? t('common.yes') : p.liability === 'no' ? t('common.no') : t('wizard.unsure')
  const criteria = [
    { icon: 'users', label: t('results.participants'), value: n ? num(n) : t('results.threePlusUnknown') },
    { icon: 'shield', label: t('wizard.s3'), value: liability },
    { icon: 'store', label: t('results.activity'), value: l(getActivity(p.activity)?.label) },
    { icon: 'wallet', label: t('results.declaredBudget'), value: p.budget !== null ? money(p.budget) : '—' },
    { icon: 'users', label: t('wizard.employees'), value: p.employees !== null ? num(p.employees) : '—' },
  ]

  const relevantIds = orientation.candidates.map((c) => c.form)
  const compared: LegalForm[] = showAll ? legalForms : legalForms.filter((f) => relevantIds.includes(f.id))
  const complexity = (c: 1 | 2 | 3) => [t('orientation.low'), t('orientation.medium'), t('orientation.high')][c - 1]

  const rows: { key: string; label: string; render: (f: LegalForm) => React.ReactNode }[] = [
    { key: 'associates', label: t('orientation.associates'), render: (f) => l(f.associates) },
    { key: 'personality', label: t('orientation.personality'), render: (f) => l(f.legalPersonality) },
    { key: 'liability', label: t('orientation.liability'), render: (f) => l(f.liability) },
    { key: 'management', label: t('orientation.management'), render: (f) => l(f.management) },
    {
      key: 'complexity',
      label: t('orientation.complexity'),
      render: (f) => (
        <span className="inline-flex items-center gap-2">
          <span className="flex gap-0.5" aria-hidden="true">
            {[1, 2, 3].map((i) => (
              <span key={i} className={cn('h-2 w-4 rounded-full', i <= f.complexity ? 'bg-ink' : 'bg-surface-3')} />
            ))}
          </span>
          {complexity(f.complexity)}
        </span>
      ),
    },
    { key: 'advantages', label: t('orientation.advantages'), render: (f) => <List items={f.advantages.map(l)} icon="check" /> },
    { key: 'limitations', label: t('orientation.limitations'), render: (f) => <List items={f.limitations.map(l)} icon="minus" /> },
    {
      key: 'capital',
      label: t('orientation.capital'),
      render: (f) => (
        <div className="space-y-2">
          <p>{l(f.capital)}</p>
          <ReviewChip status={f.capitalStatus} />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('orientation.title')} lead={t('orientation.lead')} />
      <Notice icon="shield">{t('common.orientationWarning')}</Notice>

      {!orientation.decisive && (
        <Card className="p-6">
          <p className="flex items-center gap-2 text-[17px] font-semibold text-ink">
            <Icon name="layers" size={18} />
            {t('orientation.undecided')}
          </p>
          <ul className="mt-3 space-y-2">
            {orientation.uncertainty.map((u, i) => (
              <li key={i} className="text-[14.5px] leading-relaxed text-muted">
                {l(u)}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Candidates */}
      <div className="grid gap-4 md:grid-cols-2">
        {orientation.candidates.map((c) => {
          const f = getLegalForm(c.form)
          const isPrimary = c.role === 'primary'
          return (
            <article key={c.form + c.role} className={cn('rounded-[26px] p-6', isPrimary ? 'glass md:col-span-2' : 'card')}>
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone={isPrimary ? 'solid' : c.role === 'professional-review' ? 'dashed' : 'outline'} icon={isPrimary ? 'target' : c.role === 'professional-review' ? 'alert' : 'layers'}>
                  {roleLabel[c.role]}
                </Chip>
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <h2 className={cn('font-semibold leading-none text-ink', isPrimary ? 'text-[48px]' : 'text-[30px]')}>{f.shortName}</h2>
                {f.id === 'SUARL' && <HelpTip term="suarl" />}
              </div>
              <p className="mt-2 text-[15.5px] font-medium text-ink-2">{l(f.name)}</p>
              <p className="reading mt-2 text-[14.5px] leading-relaxed text-muted">{l(f.summary)}</p>
              <div className="mt-5 rounded-[18px] bg-surface-2/80 p-4">
                <p className="text-[12.5px] font-semibold uppercase tracking-wider text-faint">{t('orientation.why')}</p>
                <ul className="mt-2 space-y-1.5">
                  {c.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-[14.5px] leading-relaxed text-ink-2">
                      <Icon name="arrow-right" size={15} className="flip-rtl mt-1 shrink-0" />
                      {l(r)}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[12px] text-faint">
                  {t('orientation.rules')} : <span dir="ltr">{c.ruleIds.join(', ')}</span>
                </p>
              </div>
            </article>
          )
        })}
      </div>

      {/* Criteria */}
      <Card className="p-6">
        <h2 className="text-[18px] font-semibold text-ink">{t('orientation.criteria')}</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {criteria.map((c) => (
            <div key={c.label} className="rounded-[16px] bg-surface-2/70 p-3.5">
              <dt className="flex items-center gap-1.5 text-[12.5px] text-muted">
                <Icon name={c.icon} size={14} />
                {c.label}
              </dt>
              <dd className="mt-1 break-words text-[14.5px] font-semibold text-ink">{c.value || '—'}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* Comparison */}
      <section aria-labelledby="cmp">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="cmp" className="text-[22px] font-semibold text-ink">
            {t('orientation.compare')}
          </h2>
          <div role="radiogroup" aria-label={t('orientation.compare')} className="glass pill inline-flex p-1">
            {[false, true].map((v) => (
              <button
                key={String(v)}
                role="radio"
                aria-checked={showAll === v}
                onClick={() => setShowAll(v)}
                className={cn('pill px-3.5 py-1.5 text-[13px] font-medium transition-colors', showAll === v ? 'bg-inverse text-on-inverse' : 'text-muted hover:text-ink')}
              >
                {v ? t('orientation.showAll') : t('orientation.showRelevant')}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop table (scrollable with affordance) */}
        <div className="card hidden overflow-x-auto rounded-[24px] md:block">
          <table className="w-full min-w-[720px] border-collapse text-start text-[14px]">
            <caption className="sr-only">{t('orientation.compare')}</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="sticky start-0 w-44 bg-surface p-4 text-start text-[12.5px] font-semibold uppercase tracking-wider text-faint" />
                {compared.map((f) => (
                  <th key={f.id} scope="col" className="p-4 text-start align-bottom">
                    <span className="block text-[20px] font-semibold text-ink">{f.shortName}</span>
                    <span className="block text-[12.5px] font-normal text-muted">{l(f.name)}</span>
                    {f.id === orientation.primary && (
                      <span className="mt-2 inline-block">
                        <Chip tone="solid">{t('orientation.primary')}</Chip>
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-line last:border-0">
                  <th scope="row" className="sticky start-0 bg-surface p-4 text-start align-top text-[13px] font-semibold text-ink">
                    {r.label}
                  </th>
                  {compared.map((f) => (
                    <td key={f.id} className="p-4 align-top leading-relaxed text-ink-2">
                      {r.render(f)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="space-y-3 md:hidden">
          {compared.map((f) => (
            <details key={f.id} className="card group rounded-[22px] p-5" open={f.id === orientation.primary}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span>
                  <span className="block text-[20px] font-semibold text-ink">{f.shortName}</span>
                  <span className="block text-[13px] text-muted">{l(f.name)}</span>
                </span>
                <Icon name="chevron-down" size={18} className="shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <dl className="mt-4 space-y-3 border-t border-line pt-4">
                {rows.map((r) => (
                  <div key={r.key}>
                    <dt className="text-[12.5px] font-semibold text-faint">{r.label}</dt>
                    <dd className="mt-1 text-[14px] leading-relaxed text-ink-2">{r.render(f)}</dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        </div>
        <div className="mt-4">
          <SourceMeta meta={legalForms[0]} />
        </div>
      </section>

      {/* Questions */}
      {orientation.professionalQuestions.length > 0 && (
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-[18px] font-semibold text-ink">
            <Icon name="user-check" size={19} />
            {t('orientation.questions')}
          </h2>
          <ol className="mt-4 space-y-2.5">
            {orientation.professionalQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-ink-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[12px] font-semibold text-ink">{i + 1}</span>
                {l(q)}
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Rules */}
      <Card className="p-6">
        <h2 className="text-[18px] font-semibold text-ink">{t('orientation.rules')}</h2>
        <p className="mt-1 text-[14px] text-muted">{t('orientation.rulesLead')}</p>
        <ul className="mt-4 space-y-3">
          {orientation.appliedRules.map((r) => (
            <li key={r.id} className="rounded-[16px] border border-line p-4">
              <p className="text-[12px] font-semibold text-faint" dir="ltr">
                {r.id}
              </p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">{l(r.explanation)}</p>
              <div className="mt-2">
                <SourceMeta meta={r} compact />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Notice icon="info">
        <strong className="font-semibold">{t('orientation.other')}.</strong> {t('orientation.otherText')}
      </Notice>
    </div>
  )
}

function List({ items, icon }: { items: string[]; icon: string }) {
  return (
    <ul className="space-y-1">
      {items.map((s) => (
        <li key={s} className="flex items-start gap-1.5">
          <Icon name={icon} size={14} className="mt-1 shrink-0" />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  )
}
