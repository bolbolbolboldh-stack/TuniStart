import type { L10n, LegalFormRule } from '../types'

const t = (fr: string, en: string, ar: string): L10n => ({ fr, en, ar })

const meta = {
  sourceLabel: t(
    'Rapport, ch. 3 — critères de choix de la forme juridique ; ch. 9 — cas Marché Karim',
    'Report, ch. 3 — legal-form choice criteria; ch. 9 — Marché Karim case',
    'التقرير، الفصل 3 — معايير اختيار الشكل القانوني؛ الفصل 9 — حالة Marché Karim',
  ),
  reportPageReference: 'pp. 45–65, 208–211',
  lastReviewedAt: null,
  reviewStatus: 'report-derived-needs-review' as const,
}

/**
 * Orientation rules. Each rule has an ID, a human explanation, a source and a
 * review status. The engine (`recommendLegalForms`) references these by ID.
 * No numeric "large project" thresholds are defined: the report gives none.
 */
export const orientationRules: Record<string, LegalFormRule> = {
  'R-ONE-PROTECT': {
    ...meta,
    id: 'R-ONE-PROTECT',
    explanation: t(
      'Un seul fondateur souhaitant protéger son patrimoine personnel : la SUARL est une forme forte à examiner.',
      'A single founder wishing to protect personal assets: the SUARL is a strong form to examine.',
      'مؤسس واحد يرغب في حماية ذمته الشخصية: شركة الشخص الواحد شكل قوي للدراسة.',
    ),
  },
  'R-ONE-EI-ALT': {
    ...meta,
    id: 'R-ONE-EI-ALT',
    explanation: t(
      'L’entreprise individuelle reste une alternative plus simple, avec un profil de responsabilité différent.',
      'The sole proprietorship remains a simpler alternative, with a different liability profile.',
      'تبقى المؤسسة الفردية بديلًا أبسط مع نظام مسؤولية مختلف.',
    ),
  },
  'R-ONE-NO-PROTECT': {
    ...meta,
    id: 'R-ONE-NO-PROTECT',
    explanation: t(
      'Un seul fondateur sans besoin de protection particulière : l’entreprise individuelle peut être examinée en priorité.',
      'A single founder with no particular protection need: the sole proprietorship may be examined first.',
      'مؤسس واحد دون حاجة خاصة للحماية: يمكن دراسة المؤسسة الفردية أولًا.',
    ),
  },
  'R-ONE-UNSURE': {
    ...meta,
    id: 'R-ONE-UNSURE',
    explanation: t(
      'Un seul fondateur, préférence de responsabilité non tranchée : EI et SUARL sont présentées côte à côte, sans choix imposé.',
      'A single founder with no settled liability preference: EI and SUARL are shown side by side, with no forced choice.',
      'مؤسس واحد دون تفضيل محسوم للمسؤولية: تعرض المؤسسة الفردية وشركة الشخص الواحد جنبًا إلى جنب دون فرض اختيار.',
    ),
  },
  'R-MULTI-PROTECT': {
    ...meta,
    id: 'R-MULTI-PROTECT',
    explanation: t(
      'Plusieurs associés souhaitant une responsabilité limitée : la SARL est une candidate à examiner.',
      'Several associates wanting limited liability: the SARL is a candidate to examine.',
      'عدة شركاء يرغبون في مسؤولية محدودة: الشركة ذات المسؤولية المحدودة مرشحة للدراسة.',
    ),
  },
  'R-MULTI-SA': {
    ...meta,
    id: 'R-MULTI-SA',
    explanation: t(
      'La SA peut être envisagée pour un projet plus important ou un besoin de capitaux élevé — examen professionnel obligatoire.',
      'The SA may be considered for a larger project or high capital needs — professional review required.',
      'يمكن النظر في الشركة خفية الاسم لمشروع أكبر أو حاجة عالية لرأس المال — مراجعة مهنية ضرورية.',
    ),
  },
  'R-MULTI-NO-PROTECT': {
    ...meta,
    id: 'R-MULTI-NO-PROTECT',
    explanation: t(
      'Plusieurs associés acceptant une responsabilité illimitée : la SNC peut être comparée, en comprenant bien ses conséquences.',
      'Several associates accepting unlimited liability: the SNC may be compared, fully understanding its consequences.',
      'عدة شركاء يقبلون مسؤولية غير محدودة: يمكن مقارنة شركة المفاوضة مع فهم تبعاتها.',
    ),
  },
  'R-MULTI-SCS': {
    ...meta,
    id: 'R-MULTI-SCS',
    explanation: t(
      'La SCS s’explique lorsque des associés gestionnaires et des investisseurs passifs coexistent.',
      'The SCS makes sense when managing partners and passive investors coexist.',
      'تكون شركة المقارضة البسيطة منطقية عند وجود شركاء مسيرين ومستثمرين غير مسيرين.',
    ),
  },
  'R-MULTI-UNSURE': {
    ...meta,
    id: 'R-MULTI-UNSURE',
    explanation: t(
      'Plusieurs associés, responsabilité non tranchée : plusieurs formes sont présentées pour discussion avec un professionnel.',
      'Several associates, liability not settled: several forms are shown for discussion with a professional.',
      'عدة شركاء والمسؤولية غير محسومة: تعرض عدة أشكال للنقاش مع مهني.',
    ),
  },
  'R-INCOMPLETE': {
    ...meta,
    id: 'R-INCOMPLETE',
    explanation: t(
      'Réponses incomplètes : aucune forme ne peut être mise en avant.',
      'Incomplete answers: no form can be highlighted.',
      'إجابات غير مكتملة: لا يمكن إبراز أي شكل.',
    ),
  },
  'R-SECTOR': {
    ...meta,
    reviewStatus: 'unverified',
    id: 'R-SECTOR',
    explanation: t(
      'Activité pouvant relever d’une réglementation sectorielle : vérification complémentaire nécessaire.',
      'Activity that may fall under sector regulation: additional verification needed.',
      'نشاط قد يخضع لتنظيم قطاعي: يلزم تحقق إضافي.',
    ),
  },
}
