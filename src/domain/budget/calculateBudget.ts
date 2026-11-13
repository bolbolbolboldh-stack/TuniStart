import type { BudgetCategoryId, BudgetLine, BudgetSummary, FundingSource } from '../types'

const safe = (n: number) => (Number.isFinite(n) && n >= 0 ? n : 0)
/** Round to millimes (TND has 3 decimals) to avoid float drift. */
const round3 = (n: number) => Math.round(n * 1000) / 1000

/** Pure budget calculator. Invalid values count as 0 — never NaN. */
export function calculateBudget(
  lines: BudgetLine[],
  funding: FundingSource[],
  declaredBudget: number | null = null,
): BudgetSummary {
  const totalExpenses = round3(lines.reduce((s, l) => s + safe(l.amount), 0))
  const totalFunding = round3(funding.reduce((s, f) => s + safe(f.amount), 0))
  const balance = round3(totalFunding - totalExpenses)

  const map = new Map<BudgetCategoryId, number>()
  for (const l of lines) map.set(l.category, round3((map.get(l.category) ?? 0) + safe(l.amount)))
  const byCategory = [...map.entries()]
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({ category, amount, share: totalExpenses > 0 ? amount / totalExpenses : 0 }))
    .sort((a, b) => b.amount - a.amount)

  const status: BudgetSummary['status'] =
    totalExpenses === 0 && totalFunding === 0 ? 'empty' : balance > 0 ? 'surplus' : balance < 0 ? 'gap' : 'balanced'

  return {
    totalExpenses,
    totalFunding,
    balance,
    status,
    byCategory,
    declaredBudgetDelta: declaredBudget !== null && Number.isFinite(declaredBudget) ? round3(declaredBudget - totalExpenses) : null,
  }
}

/** Percentage rounded to the nearest integer, for display. */
export const pct = (share: number) => Math.round(share * 100)
