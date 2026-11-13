import { buildDocumentChecklist } from '../documents/buildDocumentChecklist'
import { recommendLegalForms } from '../orientation/recommendLegalForms'
import { buildProcedureTimeline } from '../procedure/buildProcedureTimeline'
import { calculateBudget } from '../budget/calculateBudget'
import type { BudgetLine, FundingSource, ProjectProfile } from '../types'

export interface ProjectResults {
  orientation: ReturnType<typeof recommendLegalForms>
  checklist: ReturnType<typeof buildDocumentChecklist>
  timeline: ReturnType<typeof buildProcedureTimeline>
  budget: ReturnType<typeof calculateBudget>
}

/** Computes every derived result from the profile + budget — single source of truth. */
export function buildProjectResults(profile: ProjectProfile, lines: BudgetLine[], funding: FundingSource[]): ProjectResults {
  const orientation = recommendLegalForms(profile)
  // Documents follow the leading form; when undecided, the first compared form.
  const form = orientation.primary ?? orientation.candidates[0]?.form ?? null
  return {
    orientation,
    checklist: buildDocumentChecklist(profile, form),
    timeline: buildProcedureTimeline(profile, form),
    budget: calculateBudget(lines, funding, profile.budget),
  }
}

export const buildProjectSummary = buildProjectResults
