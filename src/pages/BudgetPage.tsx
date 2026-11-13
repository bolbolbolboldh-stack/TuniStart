import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/Dialog'
import { MoneyField } from '../components/ui/Field'
import { Card } from '../components/ui/GlassCard'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/Reveal'
import { Chip } from '../components/ui/StatusBadge'
import { Notice } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { budgetCategories, fundingKinds, getBudgetCategory } from '../data/budget'
import { pct } from '../domain/budget/calculateBudget'
import type { BudgetCategoryId, BudgetLine, FundingKind, FundingSource } from '../domain/types'
import { useI18n } from '../hooks/useI18n'
import { useProjectSession } from '../hooks/useProjectSession'
import { cn } from '../lib/cn'

const uid = () => Math.random().toString(36).slice(2, 10)
const shade = (i: number) => `var(--chart-${(i % 5) + 1})`

export function BudgetPage() {
  const { t, l, money, lang } = useI18n()
  const { state, results, dispatch } = useProjectSession()
  const toast = useToast()
  const [confirm, setConfirm] = useState(false)
  if (!results) return null
  const b = results.budget
  const lines = state.budgetLines
  const funding = state.funding

  const setLines = (next: BudgetLine[]) => dispatch({ type: 'set-lines', lines: next })
  const setFunding = (next: FundingSource[]) => dispatch({ type: 'set-funding', funding: next })
  const updLine = (id: string, p: Partial<BudgetLine>) => setLines(lines.map((x) => (x.id === id ? { ...x, ...p, example: false } : x)))
  const updFund = (id: string, p: Partial<FundingSource>) => setFunding(funding.map((x) => (x.id === id ? { ...x, ...p, example: false } : x)))

  const statusMeta = {
    surplus: { label: t('budget.surplus'), icon: 'arrow-right' },
    gap: { label: t('budget.gap'), icon: 'alert' },
    balanced: { label: t('budget.balanced'), icon: 'check-circle' },
    empty: { label: t('budget.empty'), icon: 'minus' },
  }[b.status]

  const chartData = b.byCategory.map((c) => ({ name: l(getBudgetCategory(c.category).label), value: c.amount, share: c.share }))
  const hasExample = lines.some((x) => x.example) || funding.some((x) => x.example)
  const delta = b.declaredBudgetDelta

  return (
    <div className="space-y-6">
      <PageHeader title={t('budget.title')} lead={t('budget.lead')}>
        <Button
          variant="secondary"
          size="sm"
          icon="sparkles"
          onClick={() => {
            dispatch({ type: 'load-sample-budget', lang })
            toast(t('toast.sampleLoaded'))
          }}
        >
          {t('budget.loadSample')}
        </Button>
        <Button variant="tertiary" size="sm" icon="reset" disabled={!lines.length && !funding.length} onClick={() => setConfirm(true)}>
          {t('budget.reset')}
        </Button>
      </PageHeader>
      <Notice icon="info">{t('budget.noOfficial')}</Notice>

      {/* Totals */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[13px] font-medium text-muted">{t('budget.totalExpenses')}</p>
          <p className="mt-2 break-words text-[24px] font-semibold tabular-nums text-ink" aria-live="polite">
            {money(b.totalExpenses)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[13px] font-medium text-muted">{t('budget.totalFunding')}</p>
          <p className="mt-2 break-words text-[24px] font-semibold tabular-nums text-ink" aria-live="polite">
            {money(b.totalFunding)}
          </p>
        </Card>
        <div className={cn('rounded-[22px] p-5', b.status === 'gap' ? 'btn-primary' : 'glass')}>
          <p className={cn('flex items-center gap-1.5 text-[13px] font-medium', b.status === 'gap' ? 'opacity-80' : 'text-muted')}>
            <Icon name={statusMeta.icon} size={15} className={statusMeta.icon === 'arrow-right' ? 'flip-rtl' : ''} />
            {t('budget.balance')} · {statusMeta.label}
          </p>
          <p className="mt-2 break-words text-[24px] font-semibold tabular-nums" aria-live="polite">
            {b.balance > 0 ? '+' : b.balance < 0 ? '−' : ''}
            {money(Math.abs(b.balance))}
          </p>
        </div>
      </div>

      {delta !== null && b.totalExpenses > 0 && (
        <p className="flex items-start gap-2 rounded-[16px] border border-line px-4 py-3 text-[14px] text-ink-2">
          <Icon name="scale" size={16} className="mt-0.5 shrink-0" />
          <span>
            <strong className="font-semibold">{t('budget.vsDeclared')} — </strong>
            {delta > 0 ? t('budget.declaredMore', { x: money(delta) }) : delta < 0 ? t('budget.declaredLess', { x: money(-delta) }) : t('budget.declaredEqual')}
          </span>
        </p>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        {/* Expenses editor */}
        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[18px] font-semibold text-ink">{t('budget.expenses')}</h2>
            {hasExample && <Chip tone="dashed" icon="book">{t('common.pedagogical')}</Chip>}
          </div>
          {lines.length === 0 && <p className="mt-4 rounded-[16px] bg-surface-2 p-5 text-center text-[14px] text-muted">{t('budget.noLines')}</p>}
          <ul className="mt-4 space-y-3">
            {lines.map((line) => (
              <li key={line.id} className="rounded-[18px] border border-line p-3.5">
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
                  <label className="block min-w-0">
                    <span className="mb-1.5 block text-[12.5px] font-medium text-muted">{t('budget.category')}</span>
                    <select
                      value={line.category}
                      onChange={(e) => updLine(line.id, { category: e.target.value as BudgetCategoryId })}
                      className="h-11 w-full rounded-[12px] border border-line-strong bg-surface px-3 text-[15px] text-ink focus:border-ink focus:outline-none"
                    >
                      {budgetCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {l(c.label)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block min-w-0">
                    <span className="mb-1.5 block text-[12.5px] font-medium text-muted">{t('budget.label')}</span>
                    <input
                      value={line.label}
                      maxLength={120}
                      onChange={(e) => updLine(line.id, { label: e.target.value })}
                      placeholder={l(getBudgetCategory(line.category).label)}
                      className="h-11 w-full rounded-[12px] border border-line-strong bg-surface px-3 text-[15px] text-ink placeholder:text-faint focus:border-ink focus:outline-none"
                    />
                  </label>
                </div>
                <div className="mt-3 flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <AmountInput label={t('budget.amount')} value={line.amount} onChange={(v) => updLine(line.id, { amount: v })} />
                  </div>
                  <Button variant="tertiary" size="sm" className="mb-1.5 h-10 w-10 px-0" aria-label={`${t('budget.remove')} : ${line.label || l(getBudgetCategory(line.category).label)}`} onClick={() => setLines(lines.filter((x) => x.id !== line.id))}>
                    <Icon name="trash" size={17} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="secondary" size="sm" icon="plus" className="mt-4" onClick={() => setLines([...lines, { id: uid(), category: 'other', label: '', amount: 0 }])}>
            {t('budget.addLine')}
          </Button>
        </Card>

        {/* Chart */}
        <Card className="p-5 sm:p-6">
          <h2 className="text-[18px] font-semibold text-ink">{t('budget.breakdown')}</h2>
          {chartData.length === 0 ? (
            <div className="mt-4 flex aspect-square max-h-72 w-full flex-col items-center justify-center rounded-full border-2 border-dashed border-line-strong text-center text-[14px] text-muted">
              <Icon name="pie-chart" size={26} className="mb-2 text-faint" />
              <span className="max-w-[60%]">{t('budget.chartEmpty')}</span>
            </div>
          ) : (
            <>
              <div className="relative mx-auto mt-2 h-64 w-full max-w-[300px]" role="img" aria-label={`${t('budget.breakdown')} : ${chartData.map((c) => `${c.name} ${pct(c.share)}%`).join(', ')}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="var(--surface)" strokeWidth={2} isAnimationActive>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={shade(i)} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => money(Number(v))}
                      contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 14, color: 'var(--ink)', fontSize: 13 }}
                      itemStyle={{ color: 'var(--ink)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[12px] text-muted">{t('budget.totalExpenses')}</span>
                  <span className="mt-0.5 max-w-[55%] break-words text-[17px] font-semibold tabular-nums text-ink">{money(b.totalExpenses)}</span>
                </div>
              </div>
              <table className="mt-4 w-full text-[13.5px]">
                <caption className="sr-only">{t('budget.tableAlt')}</caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">{t('budget.category')}</th>
                    <th scope="col">{t('budget.amount')}</th>
                    <th scope="col">{t('budget.share')}</th>
                  </tr>
                </thead>
                <tbody>
                  {b.byCategory.map((c, i) => (
                    <tr key={c.category} className="border-t border-line">
                      <td className="py-2 pe-2">
                        <span className="flex items-center gap-2 text-ink-2">
                          <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-[4px] border border-line" style={{ background: shade(i) }} />
                          {l(getBudgetCategory(c.category).label)}
                        </span>
                      </td>
                      <td className="py-2 text-end tabular-nums text-ink">{money(c.amount)}</td>
                      <td className="w-14 py-2 text-end font-semibold tabular-nums text-ink">{pct(c.share)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Card>
      </div>

      {/* Funding */}
      <Card className="p-5 sm:p-6">
        <h2 className="text-[18px] font-semibold text-ink">{t('budget.funding')}</h2>
        {funding.length === 0 && <p className="mt-4 rounded-[16px] bg-surface-2 p-5 text-center text-[14px] text-muted">{t('budget.noFunding')}</p>}
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {funding.map((f) => (
            <li key={f.id} className="rounded-[18px] border border-line p-3.5">
              <label className="block">
                <span className="mb-1.5 block text-[12.5px] font-medium text-muted">{t('budget.source')}</span>
                <select
                  value={f.kind}
                  onChange={(e) => {
                    const kind = e.target.value as FundingKind
                    updFund(f.id, { kind, label: l(fundingKinds.find((k) => k.id === kind)?.label) })
                  }}
                  className="h-11 w-full rounded-[12px] border border-line-strong bg-surface px-3 text-[15px] text-ink focus:border-ink focus:outline-none"
                >
                  {fundingKinds.map((k) => (
                    <option key={k.id} value={k.id}>
                      {l(k.label)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="mt-3 flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <AmountInput label={t('budget.amount')} value={f.amount} onChange={(v) => updFund(f.id, { amount: v })} />
                </div>
                <Button variant="tertiary" size="sm" className="mb-1.5 h-10 w-10 px-0" aria-label={`${t('budget.remove')} : ${f.label}`} onClick={() => setFunding(funding.filter((x) => x.id !== f.id))}>
                  <Icon name="trash" size={17} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button
          variant="secondary"
          size="sm"
          icon="plus"
          className="mt-4"
          onClick={() => setFunding([...funding, { id: uid(), kind: 'personal', label: l(fundingKinds[0].label), amount: 0 }])}
        >
          {t('budget.addFunding')}
        </Button>
      </Card>

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={t('budget.resetTitle')}
        description={t('budget.resetText')}
        confirmLabel={t('budget.reset')}
        onConfirm={() => {
          dispatch({ type: 'reset-budget' })
          toast(t('toast.budgetReset'))
        }}
      />
    </div>
  )
}

/** Wraps MoneyField: invalid input is shown as an error and stored as 0 (never NaN). */
function AmountInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const { t } = useI18n()
  const [err, setErr] = useState<string | undefined>()
  const [blank, setBlank] = useState(false)
  return (
    <MoneyField
      label={label}
      value={blank && value === 0 ? null : value}
      suffix={t('common.tnd')}
      error={err}
      inputClassName="h-11"
      onValue={(v) => {
        setBlank(v === null)
        if (v === null) {
          setErr(undefined)
          onChange(0)
        } else if (Number.isNaN(v)) {
          setErr(t('err.number'))
        } else if (v > 1_000_000_000) {
          setErr(t('err.tooLarge'))
        } else {
          setErr(undefined)
          onChange(v)
        }
      }}
    />
  )
}
