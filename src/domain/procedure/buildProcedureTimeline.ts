import { getActivity } from '../../data/activities'
import { procedureSteps } from '../../data/procedureSteps'
import type { LegalFormId, ProcedureStep, ProjectProfile, TimelineStep } from '../types'

/**
 * Builds the ordered timeline. The seven core steps always appear (the actual
 * order can vary — the UI says so). Conditional steps are flagged, and the
 * sector branch is returned separately only when the activity calls for it.
 */
export function buildProcedureTimeline(
  profile: ProjectProfile,
  form: LegalFormId | null,
  steps: ProcedureStep[] = procedureSteps,
): { core: TimelineStep[]; sectorBranch: TimelineStep | null } {
  const hasEmployees = (profile.employees ?? 0) > 0
  const isEI = form === 'EI'
  const core = steps
    .filter((s) => s.conditional !== 'sector')
    .sort((a, b) => a.order - b.order)
    .map<TimelineStep>((s) => {
      if (s.conditional === 'employees') {
        return {
          ...s,
          applicable: true,
          applicabilityNote: hasEmployees
            ? { fr: 'Affiliation CNSS applicable : vous prévoyez d’embaucher.', en: 'CNSS affiliation applies: you plan to hire.', ar: 'الانخراط في الضمان الاجتماعي منطبق: تعتزم الانتداب.' }
            : { fr: 'Affiliation CNSS non applicable selon vos réponses — à confirmer.', en: 'CNSS affiliation not applicable based on your answers — to confirm.', ar: 'الانخراط في الضمان الاجتماعي غير منطبق حسب إجاباتك — يجب التأكيد.' },
        }
      }
      if (s.conditional === 'capital' && isEI) {
        return {
          ...s,
          applicable: false,
          applicabilityNote: { fr: 'Pas de capital social pour une entreprise individuelle.', en: 'No share capital for a sole proprietorship.', ar: 'لا رأس مال اجتماعي للمؤسسة الفردية.' },
        }
      }
      if (s.id === 'step-statutes' && isEI) {
        return {
          ...s,
          applicable: true,
          applicabilityNote: { fr: 'Pour une EI : seul le justificatif du siège est concerné.', en: 'For an EI: only the office proof applies.', ar: 'بالنسبة للمؤسسة الفردية: يقتصر الأمر على إثبات المقر.' },
        }
      }
      return { ...s, applicable: true }
    })
  const sector = steps.find((s) => s.conditional === 'sector')
  const sectorBranch = sector && getActivity(profile.activity)?.mayNeedSectorPermit ? { ...sector, applicable: true } : null
  return { core, sectorBranch }
}
