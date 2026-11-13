import { getActivity } from '../../data/activities'
import { participantCount } from '../schemas/project.schema'
import type { L10n, LegalFormRule, OrientationCandidate, OrientationResult, ProjectProfile } from '../types'
import { orientationRules } from './orientationRules'

const t = (fr: string, en: string, ar: string): L10n => ({ fr, en, ar })

const Q = {
  liability: t(
    'Quelles garanties personnelles une banque pourrait-elle me demander malgré une responsabilité limitée ?',
    'What personal guarantees might a bank ask for despite limited liability?',
    'ما هي الضمانات الشخصية التي قد يطلبها البنك رغم المسؤولية المحدودة؟',
  ),
  capital: t(
    'Quel capital minimum s’applique aujourd’hui à la forme envisagée ?',
    'What minimum capital applies today to the intended form?',
    'ما هو الحد الأدنى لرأس المال المطبق حاليًا على الشكل المقترح؟',
  ),
  tax: t(
    'Quel régime fiscal et quelles obligations comptables découlent de cette forme ?',
    'Which tax regime and accounting obligations follow from this form?',
    'ما هو النظام الجبائي والواجبات المحاسبية المترتبة عن هذا الشكل؟',
  ),
  evolve: t(
    'Comment faire évoluer la structure si de nouveaux associés arrivent ?',
    'How can the structure evolve if new associates join?',
    'كيف يمكن تطوير الهيكل إذا انضم شركاء جدد؟',
  ),
  split: t(
    'Comment répartir les parts et les pouvoirs entre associés ?',
    'How should shares and powers be split between associates?',
    'كيف يتم توزيع الحصص والصلاحيات بين الشركاء؟',
  ),
  permit: t(
    'Mon activité exige-t-elle une autorisation sectorielle avant le démarrage ?',
    'Does my activity require a sector authorization before starting?',
    'هل يتطلب نشاطي ترخيصًا قطاعيًا قبل الانطلاق؟',
  ),
  unlimited: t(
    'Quelles sont les conséquences concrètes d’une responsabilité illimitée et solidaire ?',
    'What are the concrete consequences of unlimited, joint liability?',
    'ما هي التبعات العملية للمسؤولية غير المحدودة والتضامنية؟',
  ),
}

/**
 * Transparent, deterministic orientation engine.
 * Returns candidates with the reasons and rule IDs that produced them.
 * It never forces a single form when answers are uncertain or incomplete.
 */
export function recommendLegalForms(
  profile: ProjectProfile,
  rules: Record<string, LegalFormRule> = orientationRules,
): OrientationResult {
  const n = participantCount(profile)
  const multi = profile.participants === 'two' || profile.participants === 'three-plus'
  const applied = new Set<string>()
  const candidates: OrientationCandidate[] = []
  const uncertainty: L10n[] = []
  const questions: L10n[] = []
  const r = (id: string) => {
    applied.add(id)
    return rules[id].explanation
  }

  if (!profile.participants || !profile.liability) {
    applied.add('R-INCOMPLETE')
    return {
      decisive: false,
      primary: null,
      candidates: [],
      uncertainty: [rules['R-INCOMPLETE'].explanation],
      professionalQuestions: [],
      appliedRules: [rules['R-INCOMPLETE']],
    }
  }

  if (profile.participants === 'one') {
    if (profile.liability === 'yes') {
      candidates.push({ form: 'SUARL', role: 'primary', reasons: [r('R-ONE-PROTECT')], ruleIds: ['R-ONE-PROTECT'] })
      candidates.push({ form: 'EI', role: 'alternative', reasons: [r('R-ONE-EI-ALT')], ruleIds: ['R-ONE-EI-ALT'] })
      questions.push(Q.liability, Q.capital, Q.tax, Q.evolve)
    } else if (profile.liability === 'no') {
      candidates.push({ form: 'EI', role: 'primary', reasons: [r('R-ONE-NO-PROTECT')], ruleIds: ['R-ONE-NO-PROTECT'] })
      candidates.push({
        form: 'SUARL',
        role: 'alternative',
        reasons: [
          t(
            'La SUARL reste à comparer si vous souhaitez séparer votre patrimoine plus tard.',
            'The SUARL is still worth comparing if you later want to separate your assets.',
            'تبقى شركة الشخص الواحد جديرة بالمقارنة إذا رغبت لاحقًا في فصل ذمتك.',
          ),
        ],
        ruleIds: ['R-ONE-NO-PROTECT'],
      })
      questions.push(Q.liability, Q.tax)
    } else {
      candidates.push({ form: 'EI', role: 'comparison', reasons: [r('R-ONE-UNSURE')], ruleIds: ['R-ONE-UNSURE'] })
      candidates.push({ form: 'SUARL', role: 'comparison', reasons: [r('R-ONE-UNSURE')], ruleIds: ['R-ONE-UNSURE'] })
      uncertainty.push(
        t(
          'Vous n’avez pas encore tranché sur la protection de votre patrimoine : c’est le critère qui départage EI et SUARL. Discutez-en avec un professionnel.',
          'You have not decided on protecting your assets yet: that is the criterion separating EI and SUARL. Discuss it with a professional.',
          'لم تحسم بعد مسألة حماية ذمتك: هذا هو المعيار الفاصل بين المؤسسة الفردية وشركة الشخص الواحد. ناقشه مع مهني.',
        ),
      )
      questions.push(Q.liability, Q.capital, Q.tax)
    }
  } else if (multi) {
    if (profile.liability === 'yes') {
      candidates.push({ form: 'SARL', role: 'primary', reasons: [r('R-MULTI-PROTECT')], ruleIds: ['R-MULTI-PROTECT'] })
      candidates.push({ form: 'SA', role: 'professional-review', reasons: [r('R-MULTI-SA')], ruleIds: ['R-MULTI-SA'] })
      questions.push(Q.split, Q.capital, Q.liability, Q.tax)
    } else if (profile.liability === 'no') {
      candidates.push({ form: 'SNC', role: 'comparison', reasons: [r('R-MULTI-NO-PROTECT')], ruleIds: ['R-MULTI-NO-PROTECT'] })
      candidates.push({ form: 'SCS', role: 'comparison', reasons: [r('R-MULTI-SCS')], ruleIds: ['R-MULTI-SCS'] })
      candidates.push({
        form: 'SARL',
        role: 'alternative',
        reasons: [r('R-MULTI-PROTECT')],
        ruleIds: ['R-MULTI-PROTECT'],
      })
      uncertainty.push(
        t(
          'Les formes à responsabilité illimitée exposent le patrimoine de chaque associé. Assurez-vous d’en comprendre les conséquences.',
          'Unlimited-liability forms expose each associate’s assets. Make sure you understand the consequences.',
          'الأشكال ذات المسؤولية غير المحدودة تعرض ذمة كل شريك. تأكد من فهم التبعات.',
        ),
      )
      questions.push(Q.unlimited, Q.split, Q.tax)
    } else {
      candidates.push({ form: 'SARL', role: 'comparison', reasons: [r('R-MULTI-UNSURE')], ruleIds: ['R-MULTI-UNSURE'] })
      candidates.push({ form: 'SNC', role: 'comparison', reasons: [r('R-MULTI-NO-PROTECT')], ruleIds: ['R-MULTI-NO-PROTECT'] })
      candidates.push({ form: 'SCS', role: 'comparison', reasons: [r('R-MULTI-SCS')], ruleIds: ['R-MULTI-SCS'] })
      candidates.push({ form: 'SA', role: 'professional-review', reasons: [r('R-MULTI-SA')], ruleIds: ['R-MULTI-SA'] })
      uncertainty.push(
        t(
          'Sans préférence de responsabilité, plusieurs formes restent ouvertes. Un professionnel vous aidera à trancher.',
          'Without a liability preference, several forms remain open. A professional will help you decide.',
          'بدون تفضيل للمسؤولية تبقى عدة أشكال ممكنة. سيساعدك مهني على الحسم.',
        ),
      )
      questions.push(Q.liability, Q.unlimited, Q.split)
    }
    if (n !== null && n > 50) {
      uncertainty.push(
        t(
          'Le rapport indique 2 à 50 associés pour une SARL : avec plus de 50 associés, un examen professionnel est indispensable.',
          'The report indicates 2 to 50 associates for an SARL: with more than 50, professional review is essential.',
          'يشير التقرير إلى 2 إلى 50 شريكًا للشركة ذات المسؤولية المحدودة: بأكثر من 50 شريكًا تكون المراجعة المهنية ضرورية.',
        ),
      )
    }
  }

  const activity = getActivity(profile.activity)
  if (activity?.mayNeedSectorPermit) {
    applied.add('R-SECTOR')
    uncertainty.push(rules['R-SECTOR'].explanation)
    questions.push(Q.permit)
  }

  const primaryCandidate = candidates.find((c) => c.role === 'primary') ?? null
  return {
    decisive: primaryCandidate !== null,
    primary: primaryCandidate?.form ?? null,
    candidates,
    uncertainty,
    professionalQuestions: questions,
    appliedRules: [...applied].map((id) => rules[id]),
  }
}
