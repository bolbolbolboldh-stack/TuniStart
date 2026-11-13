import { useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/GlassCard'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/Reveal'
import { Chip } from '../components/ui/StatusBadge'
import { ErrorState, Notice } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { useI18n } from '../hooks/useI18n'
import { useProjectSession } from '../hooks/useProjectSession'
import { downloadBlob, slug } from '../lib/download'
import { exportText } from '../services/export/exportText'
import { buildSummaryModel } from '../services/export/summaryModel'
import { downloadSummaryPdf } from '../services/pdf/downloadSummary'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function SummaryPage() {
  const { t, lang } = useI18n()
  const { state, results } = useProjectSession()
  const toast = useToast()
  const [status, setStatus] = useState<Status>('idle')
  const model = useMemo(() => (results ? buildSummaryModel(state, results, lang) : null), [state, results, lang])
  if (!results || !model) return null

  const pdf = async () => {
    setStatus('loading')
    try {
      await downloadSummaryPdf(buildSummaryModel(state, results, lang), state.profile.projectName)
      setStatus('success')
      toast(t('summary.success'))
    } catch (e) {
      console.error(e)
      setStatus('error')
    }
  }
  const text = () => {
    downloadBlob(new Blob([exportText(buildSummaryModel(state, results, lang))], { type: 'text/markdown;charset=utf-8' }), `tunistart-synthese-${slug(state.profile.projectName)}.md`)
    toast(t('summary.textSuccess'))
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('summary.title')} lead={t('summary.lead')}>
        <Button icon={status === 'loading' ? 'loader' : 'download'} onClick={pdf} disabled={status === 'loading'} className={status === 'loading' ? '[&_svg]:animate-spin' : ''}>
          {status === 'loading' ? t('summary.generating') : t('summary.pdf')}
        </Button>
        <Button variant="secondary" icon="file" onClick={text}>
          {t('summary.text')}
        </Button>
      </PageHeader>

      {status === 'error' && (
        <ErrorState
          title={t('summary.error')}
          action={
            <Button size="sm" variant="secondary" icon="reset" onClick={pdf}>
              {t('common.retry')}
            </Button>
          }
        />
      )}
      <p className="flex items-center gap-2 text-[13px] text-muted">
        <Icon name="languages" size={15} />
        {t('summary.pdfLangNote')}
      </p>

      {/* Document-style preview */}
      <Card className="overflow-hidden rounded-[28px]">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2/60 px-6 py-3 text-[12.5px] text-muted">
          <span className="font-semibold uppercase tracking-wider">{t('summary.preview')}</span>
          <span>
            {model.generatedLabel} {model.generatedAt}
          </span>
        </div>
        <div className="space-y-8 p-6 sm:p-10">
          <div>
            <h2 className="text-[26px] font-semibold text-ink sm:text-[30px]">{model.title}</h2>
            <p className="mt-1 text-[15px] text-muted">{model.identity[0].value}</p>
            {model.isSample && (
              <div className="mt-3">
                <Chip tone="solid" icon="book">
                  {model.sampleLabel}
                </Chip>
              </div>
            )}
            <p className="mt-5 rounded-[16px] border border-dashed border-ink/60 p-4 text-[13.5px] leading-relaxed text-ink-2">{model.disclaimer}</p>
          </div>

          <Section n={1} title={model.headings.s1}>
            <dl className="grid gap-x-8 sm:grid-cols-2">
              {model.identity.map((r) => (
                <div key={r.label} className="flex justify-between gap-4 border-b border-line py-2.5">
                  <dt className="text-[13.5px] text-muted">{r.label}</dt>
                  <dd className="break-words text-end text-[14px] font-semibold text-ink">{r.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section n={2} title={model.headings.s2}>
            <p className="font-semibold text-ink">{model.orientation.heading}</p>
            <ul className="mt-3 space-y-2">
              {model.orientation.items.map((i) => (
                <li key={i.form + i.role} className="rounded-[14px] bg-surface-2/70 p-3.5 text-[14px]">
                  <span className="font-semibold text-ink">
                    {i.form} — {i.name}
                  </span>{' '}
                  <span className="text-muted">· {i.role}</span>
                  {i.reasons.map((r, k) => (
                    <p key={k} className="mt-1 text-muted">
                      {r}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </Section>

          <Section n={3} title={model.headings.s3}>
            <Bullets items={model.legalNotes} />
          </Section>

          <Section n={4} title={model.headings.s4}>
            <div className="space-y-4">
              {model.documents.map((g) => (
                <div key={g.group}>
                  <p className="font-semibold text-ink">{g.group}</p>
                  {g.note && <p className="text-[13px] text-muted">{g.note}</p>}
                  <ul className="mt-1.5">
                    {g.items.map((i) => (
                      <li key={i.title} className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-line py-2 text-[14px]">
                        <span className="min-w-0 break-words text-ink-2">{i.title}</span>
                        <span className="shrink-0 text-[12.5px] text-muted">
                          {i.condition} · <strong className="text-ink">{i.status}</strong>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section n={5} title={model.headings.s5}>
            <ol className="space-y-2">
              {model.steps.map((s) => (
                <li key={s.n} className="text-[14px]">
                  <span className="font-semibold text-ink">
                    {s.n}. {s.title}
                  </span>
                  <span className="text-muted">
                    {' '}
                    — {s.actor} → {s.result}
                  </span>
                </li>
              ))}
              {model.sectorStep && (
                <li className="rounded-[12px] border border-dashed border-line-strong p-2.5 text-[14px]">
                  <span className="font-semibold text-ink">
                    {model.labels.sector} — {model.sectorStep.title}
                  </span>
                </li>
              )}
            </ol>
          </Section>

          <Section n={6} title={model.headings.s6}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {model.contacts.map((c) => (
                <li key={c.name} className="text-[14px]">
                  <p className="font-semibold text-ink">{c.name}</p>
                  <p className="text-muted">{c.role}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section n={7} title={model.headings.s7}>
            {model.budget.lines.length === 0 ? (
              <p className="text-[14px] text-muted">{model.labels.noLines}</p>
            ) : (
              <ul>
                {model.budget.lines.map((l, k) => (
                  <li key={k} className="flex justify-between gap-4 border-b border-line py-2 text-[14px]">
                    <span className="min-w-0 break-words text-ink-2">{l.label}</span>
                    <span className="shrink-0 tabular-nums text-ink">
                      {l.amount} · <strong>{l.share}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 grid gap-2 rounded-[16px] bg-surface-2/70 p-4 text-[14px] sm:grid-cols-3">
              <p>
                <span className="block text-[12.5px] text-muted">{model.labels.totalExpenses}</span>
                <strong className="tabular-nums text-ink">{model.budget.totalExpenses}</strong>
              </p>
              <p>
                <span className="block text-[12.5px] text-muted">{model.labels.totalFunding}</span>
                <strong className="tabular-nums text-ink">{model.budget.totalFunding}</strong>
              </p>
              <p>
                <span className="block text-[12.5px] text-muted">{model.budget.balanceLabel}</span>
                <strong className="tabular-nums text-ink">{model.budget.balance}</strong>
              </p>
            </div>
          </Section>

          <Section n={8} title={model.headings.s8}>
            <Bullets items={model.accounting} />
          </Section>
          <Section n={9} title={model.headings.s9}>
            <Bullets items={model.sourcesList} />
          </Section>
        </div>
      </Card>
      <Notice icon="shield">{t('wizard.privacy')}</Notice>
    </div>
  )
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 border-b-2 border-ink pb-2 text-[17px] font-semibold text-ink">
        {n}. {title}
      </h3>
      {children}
    </section>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((x, k) => (
        <li key={k} className="flex items-start gap-2 text-[14px] leading-relaxed text-ink-2">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
          <span className="min-w-0 break-words">{x}</span>
        </li>
      ))}
    </ul>
  )
}
