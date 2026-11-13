import { describe, expect, it } from 'vitest'
import { sampleBudgetLines, sampleFunding, sampleProfile } from '../../data/sampleMarcheKarim'
import { calculateBudget, pct } from '../../domain/budget/calculateBudget'
import { buildDocumentChecklist, checklistProgress } from '../../domain/documents/buildDocumentChecklist'
import { recommendLegalForms } from '../../domain/orientation/recommendLegalForms'
import { orientationRules } from '../../domain/orientation/orientationRules'
import { buildProcedureTimeline } from '../../domain/procedure/buildProcedureTimeline'
import { emptyProfile, parseAmount, validateProjectProfile, validateStep } from '../../domain/schemas/project.schema'
import type { ProjectProfile } from '../../domain/types'

const profile = (p: Partial<ProjectProfile>): ProjectProfile => ({ ...emptyProfile(), activity: 'retail', budget: 1000, governorate: 'tunis', employees: 0, ...p })

describe('Scenario A — Marché Karim', () => {
  const o = recommendLegalForms(sampleProfile)
  it('suggests SUARL first with EI as alternative and a reason', () => {
    expect(o.decisive).toBe(true)
    expect(o.primary).toBe('SUARL')
    expect(o.candidates.find((c) => c.role === 'alternative')?.form).toBe('EI')
    expect(o.candidates[0].reasons[0].fr).toMatch(/SUARL/)
    expect(o.appliedRules.map((r) => r.id)).toContain('R-ONE-PROTECT')
  })
  it('builds the SUARL commercial checklist grouped by Constitution, DGI, RNE and CNSS', () => {
    const groups = buildDocumentChecklist(sampleProfile, 'SUARL')
    expect(groups.map((g) => g.group.id)).toEqual(['constitution', 'dgi', 'rne', 'cnss'])
    const cnss = groups.find((g) => g.group.id === 'cnss')!
    expect(cnss.applicable).toBe(true)
    expect(cnss.group.conditional).toBe(true)
    expect(groups.find((g) => g.group.id === 'constitution')!.items).toHaveLength(6)
  })
  it('has seven core steps, each with objective, documents, actor and result', () => {
    const { core, sectorBranch } = buildProcedureTimeline(sampleProfile, 'SUARL')
    expect(core).toHaveLength(7)
    expect(sectorBranch).toBeNull()
    for (const s of core) {
      expect(s.objective.fr).toBeTruthy()
      expect(s.documents.length).toBeGreaterThan(0)
      expect(s.actorsLabel.fr).toBeTruthy()
      expect(s.result.fr).toBeTruthy()
    }
  })
  it('sample budget sums to exactly 25,000 TND with 24/16/48/6/6 %', () => {
    const b = calculateBudget(sampleBudgetLines(), sampleFunding(), sampleProfile.budget)
    expect(b.totalExpenses).toBe(25000)
    expect(b.totalFunding).toBe(25000)
    expect(b.status).toBe('balanced')
    expect(b.declaredBudgetDelta).toBe(0)
    const share = Object.fromEntries(b.byCategory.map((c) => [c.category, pct(c.share)]))
    expect(share).toEqual({ fitout: 24, equipment: 16, stock: 48, formation: 6, cash: 6 })
  })
})

describe('Scenario B — one founder, unsure about liability', () => {
  it('does not force a single form and compares EI and SUARL', () => {
    const o = recommendLegalForms(profile({ participants: 'one', liability: 'unsure' }))
    expect(o.decisive).toBe(false)
    expect(o.primary).toBeNull()
    expect(o.candidates.map((c) => c.form).sort()).toEqual(['EI', 'SUARL'])
    expect(o.uncertainty.length).toBeGreaterThan(0)
    expect(o.professionalQuestions.length).toBeGreaterThan(0)
  })
})

describe('Scenario C — multiple associates', () => {
  it('surfaces SARL (not SUARL) when limited liability is preferred', () => {
    const o = recommendLegalForms(profile({ participants: 'three-plus', participantsCount: 4, liability: 'yes' }))
    expect(o.primary).toBe('SARL')
    expect(o.candidates.map((c) => c.form)).not.toContain('SUARL')
    expect(o.candidates.find((c) => c.form === 'SA')?.role).toBe('professional-review')
  })
  it('explains SNC/SCS only with unlimited-liability warning', () => {
    const o = recommendLegalForms(profile({ participants: 'two', liability: 'no' }))
    expect(o.candidates.map((c) => c.form)).toEqual(expect.arrayContaining(['SNC', 'SCS']))
    expect(o.uncertainty.some((u) => /illimitée/.test(u.fr))).toBe(true)
  })
})

describe('Conditional requirements', () => {
  it('CNSS is marked non-applicable when no employees', () => {
    const g = buildDocumentChecklist(profile({ participants: 'one', liability: 'yes', employees: 0 }), 'SUARL').find((x) => x.group.id === 'cnss')!
    expect(g.applicable).toBe(false)
    expect(g.note?.fr).toMatch(/Non applicable/)
  })
  it('sector permit card appears for activities that may need it', () => {
    const p = profile({ activity: 'restaurant', participants: 'one', liability: 'yes' })
    expect(buildDocumentChecklist(p, 'SUARL').some((g) => g.group.id === 'sector')).toBe(true)
    expect(buildProcedureTimeline(p, 'SUARL').sectorBranch).not.toBeNull()
    expect(recommendLegalForms(p).appliedRules.map((r) => r.id)).toContain('R-SECTOR')
  })
  it('EI removes company-only documents and capital step', () => {
    const p = profile({ participants: 'one', liability: 'no' })
    const ids = buildDocumentChecklist(p, 'EI').flatMap((g) => g.items.map((i) => i.id))
    expect(ids).not.toContain('doc-statutes')
    expect(ids).not.toContain('doc-capital')
    expect(buildProcedureTimeline(p, 'EI').core.find((s) => s.id === 'step-capital')?.applicable).toBe(false)
  })
  it('incomplete answers produce no recommendation', () => {
    expect(recommendLegalForms(emptyProfile()).candidates).toHaveLength(0)
  })
  it('every rule has an id, explanation, source and review status', () => {
    for (const r of Object.values(orientationRules)) {
      expect(r.id).toBeTruthy()
      expect(r.explanation.fr && r.explanation.en && r.explanation.ar).toBeTruthy()
      expect(r.sourceLabel.fr).toBeTruthy()
      expect(r.reviewStatus).toBeTruthy()
      expect(r.lastReviewedAt).toBeNull()
    }
  })
})

describe('Validation and calculations', () => {
  it('rejects negative, malformed and empty required values', () => {
    expect(validateStep(4, profile({ budget: null })).budget).toBe('err.budgetRequired')
    expect(validateStep(4, profile({ budget: -5 })).budget).toBe('err.negative')
    expect(validateStep(4, profile({ budget: Number.NaN })).budget).toBe('err.number')
    expect(validateStep(4, profile({ budget: Infinity })).budget).toBeDefined()
    expect(validateStep(4, profile({ budget: 0 }))).toEqual({})
  })
  it('requires activity, participants, liability, governorate, employees', () => {
    const { valid, errors } = validateProjectProfile(emptyProfile())
    expect(valid).toBe(false)
    expect(Object.keys(errors)).toEqual(expect.arrayContaining(['activity', 'participants', 'liability', 'budget', 'governorate', 'employees']))
    expect(validateProjectProfile(sampleProfile).valid).toBe(true)
  })
  it('participant count for 3+ must be ≥ 3 when given', () => {
    expect(validateStep(2, profile({ participants: 'three-plus', participantsCount: 2 })).participantsCount).toBe('err.participantsCount')
    expect(validateStep(2, profile({ participants: 'three-plus', participantsCount: null }))).toEqual({})
  })
  it('parses user amounts safely', () => {
    expect(parseAmount('25 000')).toBe(25000)
    expect(parseAmount('25,000')).toBe(25000)
    expect(parseAmount('12,5')).toBe(12.5)
    expect(parseAmount('')).toBeNull()
    expect(parseAmount('-4')).toBeNaN()
    expect(parseAmount('abc')).toBeNaN()
  })
  it('budget handles empty, gaps, surpluses and invalid values without NaN', () => {
    expect(calculateBudget([], []).status).toBe('empty')
    const gap = calculateBudget([{ id: 'a', category: 'stock', label: '', amount: 1000 }], [{ id: 'f', kind: 'personal', label: '', amount: 400 }])
    expect(gap.status).toBe('gap')
    expect(gap.balance).toBe(-600)
    const bad = calculateBudget([{ id: 'a', category: 'stock', label: '', amount: Number.NaN }, { id: 'b', category: 'cash', label: '', amount: -50 }], [])
    expect(bad.totalExpenses).toBe(0)
    expect(bad.byCategory).toHaveLength(0)
    const surplus = calculateBudget([{ id: 'a', category: 'stock', label: '', amount: 0.1 }, { id: 'b', category: 'stock', label: '', amount: 0.2 }], [{ id: 'f', kind: 'loan', label: '', amount: 1 }])
    expect(surplus.totalExpenses).toBe(0.3)
    expect(surplus.status).toBe('surplus')
  })
  it('checklist progress counts only applicable groups', () => {
    const groups = buildDocumentChecklist(profile({ participants: 'one', liability: 'yes', employees: 0 }), 'SUARL')
    const p = checklistProgress(groups, { 'doc-id': true, 'doc-cnss-request': true })
    expect(p.done).toBe(1)
  })
})
