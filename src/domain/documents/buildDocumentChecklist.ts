import { getActivity } from '../../data/activities'
import { documentGroups, documentRequirements } from '../../data/documents'
import type { ChecklistGroup, DocumentRequirement, LegalFormId, ProjectProfile } from '../types'

/**
 * Builds the personalized checklist, grouped by organization.
 * - EI: company-only documents (statutes, capital, UBO…) are removed.
 * - CNSS group: applicable only when employees > 0; otherwise kept but flagged
 *   "Non applicable selon les réponses — à confirmer".
 * - Sector group: only when the activity may require a permit.
 */
export function buildDocumentChecklist(
  profile: ProjectProfile,
  form: LegalFormId | null,
  requirements: DocumentRequirement[] = documentRequirements,
): ChecklistGroup[] {
  const isEI = form === 'EI'
  const hasEmployees = (profile.employees ?? 0) > 0
  const activity = getActivity(profile.activity)
  const needsSector = activity?.mayNeedSectorPermit ?? false

  return documentGroups
    .filter((g) => g.id !== 'sector' || needsSector)
    .map((group) => {
      const items = requirements.filter(
        (r) => r.group === group.id && !(isEI && r.companyOnly) && (!r.forms || !form || r.forms.includes(form)),
      )
      if (group.id === 'cnss') {
        return {
          group,
          items,
          applicable: hasEmployees,
          note: hasEmployees
            ? group.conditionNote
            : {
                fr: 'Non applicable selon les réponses — à confirmer.',
                en: 'Not applicable based on your answers — to confirm.',
                ar: 'غير منطبق حسب إجاباتك — يجب التأكيد.',
              },
        }
      }
      if (group.id === 'sector') return { group, items, applicable: true, note: activity?.permitNote ?? group.conditionNote }
      return { group, items, applicable: true }
    })
    .filter((g) => g.items.length > 0)
}

export function checklistProgress(groups: ChecklistGroup[], prepared: Record<string, boolean>) {
  const items = groups.filter((g) => g.applicable).flatMap((g) => g.items)
  const done = items.filter((i) => prepared[i.id]).length
  return { done, total: items.length }
}
