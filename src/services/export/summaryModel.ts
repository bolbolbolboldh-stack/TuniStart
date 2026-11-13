import { authorities } from '../../data/authorities'
import { getActivity } from '../../data/activities'
import { getBudgetCategory, fundingKinds } from '../../data/budget'
import { getGovernorate } from '../../data/governorates'
import { getLegalForm } from '../../data/legalForms'
import { CONTENT_VERSION, sources } from '../../data/sourceRegistry'
import { pct } from '../../domain/budget/calculateBudget'
import { participantCount } from '../../domain/schemas/project.schema'
import type { ProjectResults } from '../../domain/summary/buildProjectSummary'
import type { Lang } from '../../domain/types'
import { formatMoney, translate } from '../../i18n/I18nProvider'
import type { SessionState } from '../../app/providers/ProjectSessionProvider'

/**
 * Language-resolved, export-ready summary model shared by the PDF and the
 * text/Markdown exports so both always contain the same information.
 */
export interface SummaryModel {
  lang: Lang
  title: string
  generatedLabel: string
  generatedAt: string
  disclaimer: string
  isSample: boolean
  sampleLabel: string
  identity: { label: string; value: string }[]
  orientation: { heading: string; primary: string | null; items: { role: string; form: string; name: string; reasons: string[] }[]; uncertainty: string[] }
  legalNotes: string[]
  documents: { group: string; note?: string; applicable: boolean; items: { title: string; status: string; condition: string }[] }[]
  steps: { n: number; title: string; actor: string; result: string; note?: string }[]
  sectorStep?: { title: string; actor: string; result: string }
  contacts: { name: string; role: string; url?: string }[]
  budget: {
    lines: { label: string; category: string; amount: string; share: string }[]
    funding: { label: string; kind: string; amount: string }[]
    totalExpenses: string
    totalFunding: string
    balanceLabel: string
    balance: string
    declared?: string
    hasData: boolean
  }
  accounting: string[]
  sourcesList: string[]
  headings: Record<'s1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's9', string>
  labels: Record<string, string>
}

export function buildSummaryModel(state: SessionState, results: ProjectResults, lang: Lang, now = new Date()): SummaryModel {
  const T = (k: Parameters<typeof translate>[1], v?: Record<string, string | number>) => translate(lang, k, v)
  const L = (v?: { fr: string; en: string; ar: string } | null) => (v ? v[lang] || v.fr : '')
  const M = (n: number | null | undefined) => formatMoney(lang, n)
  const p = state.profile
  const n = participantCount(p)
  const gov = getGovernorate(p.governorate)
  const act = getActivity(p.activity)
  const dateFmt = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-TN-u-nu-latn' : lang === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'long', timeStyle: 'short' })

  const roleLabel = {
    primary: T('orientation.primary'),
    alternative: T('orientation.alternative'),
    comparison: T('orientation.comparison'),
    'professional-review': T('orientation.proReview'),
  }
  const condLabel = {
    general: T('documents.general'),
    conditional: T('documents.conditional'),
    activity: T('documents.activity'),
    verify: T('documents.verify'),
  }

  const usedAuthorities = new Set<string>(['PRO'])
  results.timeline.core.forEach((s) => s.actors.forEach((a) => usedAuthorities.add(a)))
  if ((p.employees ?? 0) === 0) usedAuthorities.delete('CNSS')

  const b = results.budget
  const balanceLabel = b.status === 'surplus' ? T('budget.surplus') : b.status === 'gap' ? T('budget.gap') : b.status === 'balanced' ? T('budget.balanced') : T('budget.empty')

  return {
    lang,
    title: T('summary.title'),
    generatedLabel: T('summary.generatedOn'),
    generatedAt: dateFmt.format(now),
    disclaimer: T('common.exportDisclaimer'),
    isSample: p.isSample,
    sampleLabel: T('common.sample'),
    headings: {
      s1: T('summary.s1'), s2: T('summary.s2'), s3: T('summary.s3'), s4: T('summary.s4'), s5: T('summary.s5'),
      s6: T('summary.s6'), s7: T('summary.s7'), s8: T('summary.s8'), s9: T('summary.s9'),
    },
    labels: {
      page: T('summary.page'),
      category: T('budget.category'),
      label: T('budget.label'),
      amount: T('budget.amount'),
      share: T('budget.share'),
      expenses: T('budget.expenses'),
      funding: T('budget.funding'),
      totalExpenses: T('budget.totalExpenses'),
      totalFunding: T('budget.totalFunding'),
      vsDeclared: T('budget.vsDeclared'),
      actor: T('timeline.actor'),
      result: T('timeline.result'),
      status: T('documents.filterStatus'),
      noLines: T('budget.noLines'),
      noFunding: T('budget.noFunding'),
      sector: T('timeline.sectorBranch'),
      version: T('about.version'),
    },
    identity: [
      { label: T('summary.projectName'), value: p.projectName || T('results.myProject') },
      { label: T('results.activity'), value: [L(act?.label), p.activityDescription || p.activityDetail].filter(Boolean).join(' — ') },
      { label: T('results.location'), value: [gov ? L(gov.name) : '', p.delegation].filter(Boolean).join(', ') },
      { label: T('results.participants'), value: n ? String(n) : T('results.threePlusUnknown') },
      { label: T('summary.employees'), value: p.employees !== null ? String(p.employees) : '—' },
      { label: T('results.declaredBudget'), value: p.budget !== null ? M(p.budget) : '—' },
      { label: T('summary.capital'), value: p.plannedCapital !== null ? `${M(p.plannedCapital)} (${T('common.toVerify')})` : '—' },
    ],
    orientation: {
      heading: results.orientation.primary ? `${T('results.formToExamine')} : ${results.orientation.primary}` : T('orientation.undecided'),
      primary: results.orientation.primary,
      items: results.orientation.candidates.map((c) => ({
        role: roleLabel[c.role],
        form: c.form,
        name: L(getLegalForm(c.form).name),
        reasons: c.reasons.map(L),
      })),
      uncertainty: results.orientation.uncertainty.map(L),
    },
    legalNotes: [
      T('common.orientationWarning'),
      ...results.orientation.candidates.map((c) => `${c.form} — ${T('orientation.capital')} : ${L(getLegalForm(c.form).capital)}`),
      ...results.orientation.professionalQuestions.map((q) => `${T('orientation.questions')} : ${L(q)}`),
    ],
    documents: results.checklist.map((g) => ({
      group: L(g.group.title),
      note: g.note ? L(g.note) : undefined,
      applicable: g.applicable,
      items: g.items.map((i) => ({
        title: L(i.title),
        status: !g.applicable ? T('documents.notApplicable') : state.prepared[i.id] ? T('documents.prepared') : T('documents.toPrepare'),
        condition: condLabel[i.condition],
      })),
    })),
    steps: results.timeline.core.map((s, i) => ({
      n: i + 1,
      title: L(s.title),
      actor: L(s.actorsLabel),
      result: L(s.result),
      note: s.applicabilityNote ? L(s.applicabilityNote) : undefined,
    })),
    sectorStep: results.timeline.sectorBranch
      ? { title: L(results.timeline.sectorBranch.title), actor: L(results.timeline.sectorBranch.actorsLabel), result: L(results.timeline.sectorBranch.result) }
      : undefined,
    contacts: authorities.filter((a) => usedAuthorities.has(a.id)).map((a) => ({ name: `${L(a.shortName)} — ${L(a.name)}`, role: L(a.role), url: a.url })),
    budget: {
      lines: state.budgetLines.map((l) => ({
        label: l.label || L(getBudgetCategory(l.category).label),
        category: L(getBudgetCategory(l.category).label),
        amount: M(l.amount),
        share: b.totalExpenses > 0 ? `${pct((Number.isFinite(l.amount) ? l.amount : 0) / b.totalExpenses)}%` : '0%',
      })),
      funding: state.funding.map((f) => ({ label: f.label || L(fundingKinds.find((k) => k.id === f.kind)?.label), kind: L(fundingKinds.find((k) => k.id === f.kind)?.label), amount: M(f.amount) })),
      totalExpenses: M(b.totalExpenses),
      totalFunding: M(b.totalFunding),
      balanceLabel,
      balance: M(Math.abs(b.balance)),
      declared:
        b.declaredBudgetDelta === null
          ? undefined
          : b.declaredBudgetDelta > 0
            ? T('budget.declaredMore', { x: M(b.declaredBudgetDelta) })
            : b.declaredBudgetDelta < 0
              ? T('budget.declaredLess', { x: M(-b.declaredBudgetDelta) })
              : T('budget.declaredEqual'),
      hasData: state.budgetLines.length > 0 || state.funding.length > 0,
    },
    accounting: [T('summary.acc1'), T('summary.acc2'), T('summary.acc3')],
    sourcesList: [
      ...sources.map((s) => `${L(s.title)}${s.url ? ` — ${s.url}` : ''}`),
      `${T('common.lastReview')} : ${T('common.noReviewDate')} — ${T('common.reportDerived')}`,
      `${T('about.version')} : ${CONTENT_VERSION}`,
    ],
  }
}
