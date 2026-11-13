import { Link } from 'react-router'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/GlassCard'
import { Icon, IconTile } from '../components/ui/Icon'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Chip } from '../components/ui/StatusBadge'
import { Notice } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { getActivity } from '../data/activities'
import { getGovernorate } from '../data/governorates'
import { getLegalForm } from '../data/legalForms'
import { checklistProgress } from '../domain/documents/buildDocumentChecklist'
import { participantCount } from '../domain/schemas/project.schema'
import { useI18n } from '../hooks/useI18n'
import { useProjectSession } from '../hooks/useProjectSession'

export function ResultsPage() {
  const { t, l, money, num, lang } = useI18n()
  const { state, results, dispatch } = useProjectSession()
  const toast = useToast()
  if (!results) return null
  const p = state.profile
  const { orientation, checklist, timeline, budget } = results
  const progress = checklistProgress(checklist, state.prepared)
  const primary = orientation.primary ? getLegalForm(orientation.primary) : null
  const alternatives = orientation.candidates.filter((c) => c.form !== orientation.primary)
  const n = participantCount(p)
  const activity = getActivity(p.activity)
  const gov = getGovernorate(p.governorate)

  // Next suggested action = earliest unprepared applicable document.
  const nextDoc = checklist.filter((g) => g.applicable).flatMap((g) => g.items.map((i) => ({ i, g }))).find(({ i }) => !state.prepared[i.id])

  const facts = [
    { icon: 'store', label: t('results.activity'), value: l(activity?.label) },
    { icon: 'map-pin', label: t('results.location'), value: [gov ? l(gov.name) : '', p.delegation].filter(Boolean).join(', ') },
    { icon: 'users', label: t('results.participants'), value: n ? t('results.personsN', { n: num(n) }) : t('results.threePlusUnknown') },
    { icon: 'wallet', label: t('results.declaredBudget'), value: p.budget !== null ? money(p.budget) : t('common.toComplete') },
  ]

  const nav = [
    { to: 'orientation', icon: 'scale', title: t('results.orientation'), text: primary ? `${primary.shortName} — ${l(primary.name)}` : t('results.noLeading') },
    { to: 'documents', icon: 'list-checks', title: t('results.documents'), text: t('results.preparedOf', { a: progress.done, b: progress.total }) },
    { to: 'parcours', icon: 'route', title: t('results.timeline'), text: `${timeline.core.length} ${t('results.steps').toLowerCase()}` },
    { to: 'budget', icon: 'pie-chart', title: t('results.budget'), text: budget.totalExpenses > 0 ? money(budget.totalExpenses) : t('common.toComplete') },
    { to: 'synthese', icon: 'file-check', title: t('results.summary'), text: t('summary.pdf') },
  ]

  return (
    <div className="space-y-5">
      {/* Facts */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {facts.map((f) => (
          <Card key={f.label} className="p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[12.5px] font-medium text-muted">
              <Icon name={f.icon} size={15} />
              {f.label}
            </div>
            <p className="mt-2 break-words text-[15.5px] font-semibold text-ink sm:text-[17px]">{f.value || '—'}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        {/* Orientation hero card */}
        <section className="glass relative overflow-hidden rounded-[28px] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Chip icon="scale" tone="solid">
              {t('results.leadingForm')}
            </Chip>
            <Chip tone="dashed" icon="alert">
              {t('common.indicative')}
            </Chip>
          </div>
          {primary ? (
            <>
              <p className="mt-6 text-[13.5px] font-medium text-muted">{t('results.formToExamine')}</p>
              <p className="mt-1 text-[56px] font-semibold leading-none tracking-tight text-ink sm:text-[64px]">{primary.shortName}</p>
              <p className="mt-2 text-[16px] text-ink-2">{l(primary.name)}</p>
              <p className="reading mt-4 text-[14.5px] leading-relaxed text-muted">{l(orientation.candidates.find((c) => c.role === 'primary')?.reasons[0])}</p>
            </>
          ) : (
            <>
              <p className="mt-6 text-[26px] font-semibold text-ink">{t('results.noLeading')}</p>
              <p className="reading mt-3 text-[14.5px] leading-relaxed text-muted">{l(orientation.uncertainty[0])}</p>
            </>
          )}
          {alternatives.length > 0 && (
            <div className="mt-6">
              <p className="text-[13px] font-medium text-muted">{primary ? t('results.alternatives') : t('orientation.comparison')}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {alternatives.map((c) => (
                  <Chip key={c.form} tone="outline">
                    {c.form} · {l(getLegalForm(c.form).name)}
                  </Chip>
                ))}
              </div>
            </div>
          )}
          <Link to="orientation" className="mt-7 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
            {t('orientation.why')}
            <Icon name="arrow-right" size={16} className="flip-rtl" />
          </Link>
        </section>

        <div className="grid gap-5">
          {/* Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[13.5px] font-medium text-muted">
                <Icon name="list-checks" size={16} />
                {t('results.docsPrepared')}
              </p>
              <p className="text-[13.5px] font-semibold tabular-nums text-ink">
                {progress.done}/{progress.total}
              </p>
            </div>
            <ProgressBar value={progress.done} max={progress.total} label={t('results.docsPrepared')} className="mt-4" />
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-5">
              <div>
                <p className="text-[12.5px] text-muted">{t('results.steps')}</p>
                <p className="mt-1 text-[24px] font-semibold tabular-nums text-ink">{timeline.core.length}</p>
              </div>
              <div>
                <p className="text-[12.5px] text-muted">{t('results.estimatedCost')}</p>
                <p className="mt-1 text-[18px] font-semibold tabular-nums text-ink sm:text-[20px]">{budget.totalExpenses > 0 ? money(budget.totalExpenses) : t('common.toComplete')}</p>
              </div>
            </div>
          </Card>
          {/* Next action */}
          <Card className="p-6">
            <p className="flex items-center gap-2 text-[13.5px] font-medium text-muted">
              <Icon name="target" size={16} />
              {t('results.nextAction')}
            </p>
            {nextDoc ? (
              <>
                <p className="mt-3 text-[16.5px] font-semibold leading-snug text-ink">{l(nextDoc.i.title)}</p>
                <p className="mt-1 text-[13.5px] text-muted">{l(nextDoc.g.group.title)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="secondary" icon="check" onClick={() => dispatch({ type: 'toggle-doc', id: nextDoc.i.id })}>
                    {t('documents.prepared')}
                  </Button>
                  <Link to="documents" className="pill px-3 py-2 text-[13.5px] font-semibold text-ink hover:bg-surface-2">
                    {t('results.documents')}
                  </Link>
                </div>
              </>
            ) : (
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{t('results.allPrepared')}</p>
            )}
            <p className="mt-4 text-[12px] text-faint">{t('results.nextActionNote')}</p>
          </Card>
        </div>
      </div>

      {/* Navigation cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {nav.map((c) => (
          <Link key={c.to} to={c.to} className="card lift group flex flex-col rounded-[22px] p-5">
            <IconTile name={c.icon} size="sm" />
            <p className="mt-4 text-[16px] font-semibold text-ink">{c.title}</p>
            <p className="mt-1 line-clamp-2 text-[13.5px] text-muted">{c.text}</p>
            <Icon name="arrow-right" size={16} className="flip-rtl mt-4 text-faint transition-colors group-hover:text-ink" />
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="glass"
          size="sm"
          icon="sparkles"
          onClick={() => {
            dispatch({ type: 'load-sample', lang })
            toast(t('toast.sampleLoaded'))
          }}
        >
          {t('results.loadSample')}
        </Button>
      </div>

      <Notice icon="shield">{t('common.disclaimerShort')}</Notice>
    </div>
  )
}
