import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/Dialog'
import { HelpTip } from '../components/ui/HelpTip'
import { Icon, IconTile } from '../components/ui/Icon'
import { ProgressBar } from '../components/ui/ProgressBar'
import { PageHeader } from '../components/ui/Reveal'
import { SourceMeta } from '../components/ui/SourceMeta'
import { Chip } from '../components/ui/StatusBadge'
import { Notice } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { authorities } from '../data/authorities'
import { getLegalForm } from '../data/legalForms'
import { checklistProgress } from '../domain/documents/buildDocumentChecklist'
import type { DocumentCondition, DocumentGroupId, DocumentRequirement } from '../domain/types'
import { useI18n } from '../hooks/useI18n'
import { useProjectSession } from '../hooks/useProjectSession'
import { cn } from '../lib/cn'
import { downloadBlob, slug } from '../lib/download'
import { exportChecklistText } from '../services/export/exportText'
import { buildSummaryModel } from '../services/export/summaryModel'

type StatusFilter = 'all' | 'todo' | 'done'

const groupIcon: Record<DocumentGroupId, string> = {
  constitution: 'file',
  dgi: 'receipt',
  rne: 'landmark',
  cnss: 'shield',
  sector: 'alert',
}

export function DocumentsPage() {
  const { t, l, lang } = useI18n()
  const { state, results, dispatch } = useProjectSession()
  const toast = useToast()
  const [org, setOrg] = useState<'all' | DocumentGroupId>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [confirm, setConfirm] = useState(false)
  if (!results) return null

  const { checklist, orientation } = results
  const form = orientation.primary ?? orientation.candidates[0]?.form ?? null
  const progress = checklistProgress(checklist, state.prepared)

  const condLabel: Record<DocumentCondition, { label: string; icon: string; tone: 'soft' | 'outline' | 'dashed' }> = {
    general: { label: t('documents.general'), icon: 'circle', tone: 'soft' },
    conditional: { label: t('documents.conditional'), icon: 'layers', tone: 'outline' },
    activity: { label: t('documents.activity'), icon: 'store', tone: 'outline' },
    verify: { label: t('documents.verify'), icon: 'alert', tone: 'dashed' },
  }

  const matches = (i: DocumentRequirement) => (status === 'all' ? true : status === 'done' ? !!state.prepared[i.id] : !state.prepared[i.id])
  const visible = checklist.filter((g) => org === 'all' || g.group.id === org).map((g) => ({ ...g, shown: g.items.filter(matches) }))
  const anyShown = visible.some((g) => g.shown.length > 0)
  const allCollapsed = checklist.every((g) => collapsed[g.group.id])

  const download = () => {
    const m = buildSummaryModel(state, results, lang)
    downloadBlob(new Blob([exportChecklistText(m)], { type: 'text/plain;charset=utf-8' }), `tunistart-documents-${slug(state.profile.projectName)}.txt`)
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('documents.title')} lead={t('documents.lead')}>
        <Button variant="secondary" size="sm" icon="download" onClick={download}>
          {t('documents.download')}
        </Button>
        <Button variant="secondary" size="sm" icon="printer" onClick={() => window.print()}>
          {t('common.print')}
        </Button>
      </PageHeader>

      {/* Progress + filters */}
      <div className="glass sticky top-[88px] z-20 rounded-[24px] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-ink" aria-live="polite">
              {t('results.preparedOf', { a: progress.done, b: progress.total })}
            </p>
            {form && (
              <p className="text-[12.5px] text-muted">
                {t('documents.basedOn')} : {getLegalForm(form).shortName}
              </p>
            )}
          </div>
          <div className="no-print flex items-center gap-1">
            <Button variant="tertiary" size="sm" onClick={() => setCollapsed(allCollapsed ? {} : Object.fromEntries(checklist.map((g) => [g.group.id, true])))}>
              {allCollapsed ? t('documents.expandAll') : t('documents.collapseAll')}
            </Button>
            <Button variant="tertiary" size="sm" icon="reset" onClick={() => setConfirm(true)} disabled={progress.done === 0}>
              {t('documents.reset')}
            </Button>
          </div>
        </div>
        <ProgressBar value={progress.done} max={progress.total} label={t('results.docsPrepared')} className="mt-3" />
        <div className="no-print mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <FilterGroup
            label={t('documents.filterOrg')}
            value={org}
            onChange={(v) => setOrg(v as typeof org)}
            options={[{ id: 'all', label: t('documents.all') }, ...checklist.map((g) => ({ id: g.group.id, label: l(authorities.find((a) => a.id === g.group.authority)?.shortName) || l(g.group.title).split(' ')[0] }))]}
          />
          <FilterGroup
            label={t('documents.filterStatus')}
            value={status}
            onChange={(v) => setStatus(v as StatusFilter)}
            options={[
              { id: 'all', label: t('documents.all') },
              { id: 'todo', label: t('documents.toPrepare') },
              { id: 'done', label: t('documents.prepared') },
            ]}
          />
        </div>
      </div>

      <Notice icon="info">{t('documents.noUpload')}</Notice>

      {!anyShown && (
        <div className="card rounded-[22px] p-8 text-center text-[15px] text-muted">
          <Icon name="filter" size={22} className="mx-auto mb-2 text-faint" />
          {t('documents.noMatch')}
        </div>
      )}

      <div className="space-y-4">
        {visible
          .filter((g) => g.shown.length > 0)
          .map((g) => {
            const open = !collapsed[g.group.id]
            const done = g.items.filter((i) => state.prepared[i.id]).length
            return (
              <section key={g.group.id} className={cn('card overflow-hidden rounded-[24px]', !g.applicable && 'opacity-75')} aria-labelledby={`grp-${g.group.id}`}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`grp-body-${g.group.id}`}
                  onClick={() => setCollapsed((c) => ({ ...c, [g.group.id]: open }))}
                  className="flex w-full items-center gap-4 p-5 text-start transition-colors hover:bg-surface-2/50 sm:p-6"
                >
                  <IconTile name={groupIcon[g.group.id]} />
                  <div className="min-w-0 flex-1">
                    <h2 id={`grp-${g.group.id}`} className="text-[17px] font-semibold text-ink">
                      {l(g.group.title)}
                    </h2>
                    <p className="mt-0.5 text-[13.5px] text-muted">{l(g.group.description)}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {g.group.conditional && (
                        <Chip tone="outline" icon="layers">
                          {t('documents.conditional')}
                        </Chip>
                      )}
                      {!g.applicable && (
                        <Chip tone="dashed" icon="minus">
                          {t('documents.notApplicable')}
                        </Chip>
                      )}
                      {g.applicable && (
                        <Chip tone="soft">
                          {done}/{g.items.length}
                        </Chip>
                      )}
                    </div>
                  </div>
                  <Icon name="chevron-down" size={20} className={cn('shrink-0 text-muted transition-transform duration-300', open && 'rotate-180')} />
                </button>
                <Collapse open={open} id={`grp-body-${g.group.id}`}>
                  {g.note && <p className="mx-5 mb-3 rounded-[14px] bg-surface-2 px-4 py-2.5 text-[13.5px] text-ink-2 sm:mx-6">{l(g.note)}</p>}
                  <ul className="divide-y divide-[var(--line)] border-t border-line">
                    {g.shown.map((i) => (
                      <DocItem key={i.id} item={i} checked={!!state.prepared[i.id]} disabled={!g.applicable} onToggle={() => dispatch({ type: 'toggle-doc', id: i.id })} cond={condLabel[i.condition]} />
                    ))}
                  </ul>
                </Collapse>
              </section>
            )
          })}
      </div>

      <SourceMeta meta={checklist[0]?.items[0] ?? { sourceLabel: { fr: '', en: '', ar: '' }, lastReviewedAt: null, reviewStatus: 'unverified' }} />
      <Notice icon="shield">{t('common.exportDisclaimer')}</Notice>

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={t('documents.resetTitle')}
        description={t('documents.resetText')}
        confirmLabel={t('documents.reset')}
        onConfirm={() => {
          dispatch({ type: 'reset-docs' })
          toast(t('toast.checklistReset'))
        }}
      />
    </div>
  )
}

function Collapse({ open, id, children }: { open: boolean; id: string; children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          initial={reduce ? false : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={reduce ? undefined : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DocItem({
  item,
  checked,
  disabled,
  onToggle,
  cond,
}: {
  item: DocumentRequirement
  checked: boolean
  disabled: boolean
  onToggle: () => void
  cond: { label: string; icon: string; tone: 'soft' | 'outline' | 'dashed' }
}) {
  const { t, l } = useI18n()
  const [more, setMore] = useState(false)
  const helpTerm = item.id === 'doc-statutes' ? 'statuts' : item.id === 'doc-office' ? 'siege-social' : item.id === 'doc-dgi-form' ? 'declaration-existence' : item.id === 'doc-rne-ubo' ? 'beneficiaire-effectif' : null
  return (
    <li className="px-5 py-4 sm:px-6">
      <div className="flex items-start gap-3.5">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          disabled={disabled}
          onClick={onToggle}
          aria-label={`${l(item.title)} — ${checked ? t('documents.prepared') : t('documents.toPrepare')}`}
          className={cn(
            'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] border-[1.5px] transition-all duration-200 disabled:opacity-40',
            checked ? 'border-ink bg-ink text-on-inverse' : 'border-line-strong hover:border-ink',
          )}
        >
          {checked && <Icon name="check" size={15} strokeWidth={2.6} />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className={cn('break-words text-[15.5px] font-medium', checked ? 'text-muted line-through decoration-line-strong' : 'text-ink')}>{l(item.title)}</p>
            {helpTerm && <HelpTip term={helpTerm} />}
          </div>
          <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{l(item.purpose)}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Chip tone={cond.tone} icon={cond.icon}>
              {cond.label}
            </Chip>
            <Chip tone={checked ? 'solid' : 'soft'} icon={checked ? 'check-circle' : 'circle'}>
              {checked ? t('documents.prepared') : t('documents.toPrepare')}
            </Chip>
            <button type="button" onClick={() => setMore((m) => !m)} aria-expanded={more} className="pill px-2.5 py-1 text-[12.5px] font-semibold text-ink underline-offset-4 hover:bg-surface-2">
              {t('documents.understand')}
            </button>
          </div>
          {more && (
            <div className="mt-3 space-y-2 rounded-[16px] bg-surface-2/80 p-4 text-[13.5px] leading-relaxed">
              <p>
                <span className="font-semibold text-ink">{t('documents.why')} </span>
                <span className="text-ink-2">{l(item.why)}</span>
              </p>
              <p className="text-ink-2">{l(item.details)}</p>
              <SourceMeta meta={item} compact />
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

function FilterGroup({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { id: string; label: string }[] }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 text-[12.5px] font-medium text-muted">{label}</span>
      <div role="radiogroup" aria-label={label} className="no-scrollbar flex min-w-0 gap-1 overflow-x-auto">
        {options.map((o) => (
          <button
            key={o.id}
            role="radio"
            aria-checked={value === o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              'pill shrink-0 border px-3 py-1.5 text-[13px] font-medium transition-colors',
              value === o.id ? 'border-ink bg-inverse text-on-inverse' : 'border-line bg-surface text-ink-2 hover:text-ink',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
