import type { LegalForm, LegalFormId } from '../domain/types'

const reportSource = {
  sourceLabel: {
    fr: 'Rapport « La digitalisation du processus de constitution d’une société en Tunisie », Partie II, ch. 3',
    en: 'Report “Digitalising the company formation process in Tunisia”, Part II, ch. 3',
    ar: 'تقرير « رقمنة مسار تأسيس شركة في تونس »، الجزء الثاني، الفصل 3',
  },
  reportPageReference: 'pp. 45–65',
  lastReviewedAt: null,
} as const

/**
 * Legal-form reference dataset. Values come from the report and are flagged
 * `report-derived-needs-review`: they must be checked against the law in force.
 */
export const legalForms: LegalForm[] = [
  {
    ...reportSource,
    id: 'EI',
    shortName: 'EI',
    reviewStatus: 'report-derived-needs-review',
    name: { fr: 'Entreprise individuelle', en: 'Sole proprietorship', ar: 'المؤسسة الفردية' },
    summary: {
      fr: 'Une personne physique exerce l’activité en son nom propre. Structure simple, sans société distincte.',
      en: 'One natural person runs the business in their own name. A simple structure with no separate company.',
      ar: 'شخص طبيعي يمارس النشاط باسمه الخاص. هيكل بسيط دون شركة مستقلة.',
    },
    associates: { fr: '1 personne physique', en: '1 natural person', ar: 'شخص طبيعي واحد' },
    legalPersonality: {
      fr: 'Pas de personnalité morale distincte (selon le rapport)',
      en: 'No separate legal personality (per the report)',
      ar: 'لا شخصية معنوية مستقلة (حسب التقرير)',
    },
    liability: {
      fr: 'L’entrepreneur est personnellement exposé aux dettes de l’activité, selon le régime applicable.',
      en: 'The entrepreneur is personally exposed to business debts, under the applicable regime.',
      ar: 'يتحمل صاحب المؤسسة شخصيًا ديون النشاط حسب النظام المعمول به.',
    },
    management: { fr: 'L’entrepreneur lui-même', en: 'The entrepreneur themselves', ar: 'صاحب المؤسسة نفسه' },
    complexity: 1,
    advantages: [
      { fr: 'Formation relativement légère', en: 'Relatively light formation', ar: 'إجراءات تأسيس خفيفة نسبيًا' },
      { fr: 'Gestion simple et directe', en: 'Simple, direct management', ar: 'تسيير بسيط ومباشر' },
      { fr: 'Adaptée aux petites activités à risque modéré', en: 'Suited to small, lower-risk activities', ar: 'ملائمة للأنشطة الصغيرة محدودة المخاطر' },
    ],
    limitations: [
      { fr: 'Patrimoine personnel exposé', en: 'Personal assets exposed', ar: 'الذمة المالية الشخصية معرضة' },
      { fr: 'Pas d’associé possible', en: 'No associates possible', ar: 'لا يمكن إشراك شركاء' },
      { fr: 'Crédibilité parfois moindre auprès des partenaires', en: 'Sometimes less credibility with partners', ar: 'مصداقية أقل أحيانًا لدى الشركاء' },
    ],
    capital: {
      fr: 'Pas de capital social au sens du droit des sociétés',
      en: 'No share capital in the company-law sense',
      ar: 'لا رأس مال اجتماعي بمفهوم قانون الشركات',
    },
    capitalStatus: 'report-derived-needs-review',
  },
  {
    ...reportSource,
    id: 'SUARL',
    shortName: 'SUARL',
    reviewStatus: 'report-derived-needs-review',
    name: {
      fr: 'Société unipersonnelle à responsabilité limitée',
      en: 'Single-member limited liability company',
      ar: 'شركة الشخص الواحد ذات المسؤولية المحدودة',
    },
    summary: {
      fr: 'Une société avec un seul associé, qui distingue le patrimoine de la société de celui du fondateur.',
      en: 'A company with a single associate that separates the company’s assets from the founder’s.',
      ar: 'شركة بشريك واحد تفصل بين ذمة الشركة وذمة المؤسس.',
    },
    associates: { fr: '1 associé unique', en: '1 sole associate', ar: 'شريك وحيد' },
    legalPersonality: {
      fr: 'Personnalité morale distincte selon les règles applicables',
      en: 'Separate legal personality under applicable rules',
      ar: 'شخصية معنوية مستقلة وفق القواعد المعمول بها',
    },
    liability: {
      fr: 'Limitée aux apports en principe, sous réserve des exceptions légales et des garanties personnelles.',
      en: 'Generally limited to contributions, subject to statutory exceptions and personal guarantees.',
      ar: 'محدودة مبدئيًا بالمساهمات، مع مراعاة الاستثناءات القانونية والضمانات الشخصية.',
    },
    management: { fr: 'Un gérant', en: 'One manager (gérant)', ar: 'مسير واحد' },
    complexity: 2,
    advantages: [
      { fr: 'Protection du patrimoine personnel en principe', en: 'Personal assets protected in principle', ar: 'حماية الذمة الشخصية مبدئيًا' },
      { fr: 'Le fondateur garde le contrôle total', en: 'Founder keeps full control', ar: 'يحتفظ المؤسس بالتحكم الكامل' },
      { fr: 'Peut évoluer en SARL avec l’arrivée d’associés', en: 'Can evolve into an SARL when associates join', ar: 'يمكن تحويلها إلى ش.ذ.م.م عند دخول شركاء' },
    ],
    limitations: [
      { fr: 'Statuts, capital et formalités plus lourds qu’une EI', en: 'Statutes, capital and formalities heavier than an EI', ar: 'نظام أساسي ورأس مال وإجراءات أثقل من المؤسسة الفردية' },
      { fr: 'Obligations comptables de société', en: 'Company accounting obligations', ar: 'التزامات محاسبية خاصة بالشركات' },
    ],
    capital: {
      fr: 'Le rapport mentionne 1 000 TND minimum — à vérifier selon le texte consolidé en vigueur',
      en: 'The report mentions a 1,000 TND minimum — to verify against the current consolidated law',
      ar: 'يذكر التقرير حدًا أدنى قدره 1000 دينار — يجب التحقق منه وفق النص المحين',
    },
    capitalStatus: 'report-derived-needs-review',
  },
  {
    ...reportSource,
    id: 'SARL',
    shortName: 'SARL',
    reviewStatus: 'report-derived-needs-review',
    name: {
      fr: 'Société à responsabilité limitée',
      en: 'Limited liability company',
      ar: 'شركة ذات مسؤولية محدودة',
    },
    summary: {
      fr: 'La forme la plus courante pour plusieurs associés souhaitant limiter leur responsabilité.',
      en: 'The most common form for several associates wishing to limit their liability.',
      ar: 'الشكل الأكثر شيوعًا لعدة شركاء يرغبون في تحديد مسؤوليتهم.',
    },
    associates: { fr: '2 à 50 associés (selon le rapport)', en: '2 to 50 associates (per the report)', ar: 'من 2 إلى 50 شريكًا (حسب التقرير)' },
    legalPersonality: { fr: 'Personnalité morale distincte', en: 'Separate legal personality', ar: 'شخصية معنوية مستقلة' },
    liability: {
      fr: 'Limitée aux apports en principe, sous réserve des exceptions.',
      en: 'Generally limited to contributions, subject to exceptions.',
      ar: 'محدودة مبدئيًا بالمساهمات مع مراعاة الاستثناءات.',
    },
    management: { fr: 'Un ou plusieurs gérants', en: 'One or more managers', ar: 'مسير أو أكثر' },
    complexity: 2,
    advantages: [
      { fr: 'Responsabilité limitée des associés', en: 'Limited liability for associates', ar: 'مسؤولية محدودة للشركاء' },
      { fr: 'Cadre adapté aux PME', en: 'Framework suited to SMEs', ar: 'إطار ملائم للمؤسسات الصغرى والمتوسطة' },
      { fr: 'Répartition claire des parts sociales', en: 'Clear allocation of shares', ar: 'توزيع واضح للحصص' },
    ],
    limitations: [
      { fr: 'Rédaction des statuts plus engageante', en: 'More demanding statutes drafting', ar: 'تحرير نظام أساسي أكثر التزامًا' },
      { fr: 'Cessions de parts encadrées', en: 'Share transfers are regulated', ar: 'إحالة الحصص مؤطرة' },
    ],
    capital: {
      fr: 'Le rapport mentionne 1 000 TND minimum — à vérifier selon la loi en vigueur',
      en: 'The report mentions a 1,000 TND minimum — to verify against current law',
      ar: 'يذكر التقرير حدًا أدنى قدره 1000 دينار — يجب التحقق منه وفق القانون الساري',
    },
    capitalStatus: 'report-derived-needs-review',
  },
  {
    ...reportSource,
    id: 'SA',
    shortName: 'SA',
    reviewStatus: 'report-derived-needs-review',
    name: { fr: 'Société anonyme', en: 'Public limited company', ar: 'شركة خفية الاسم' },
    summary: {
      fr: 'Capital divisé en actions, gouvernance structurée. Pour des projets d’envergure — examen professionnel indispensable.',
      en: 'Capital divided into shares with structured governance. For larger projects — professional review essential.',
      ar: 'رأس مال مقسم إلى أسهم وحوكمة منظمة. للمشاريع الكبرى — مراجعة مهنية ضرورية.',
    },
    associates: { fr: 'Selon le régime applicable', en: 'Depending on the applicable regime', ar: 'حسب النظام المعمول به' },
    legalPersonality: { fr: 'Personnalité morale distincte', en: 'Separate legal personality', ar: 'شخصية معنوية مستقلة' },
    liability: {
      fr: 'Limitée aux apports selon la loi applicable.',
      en: 'Limited to contributions under applicable law.',
      ar: 'محدودة بالمساهمات وفق القانون المعمول به.',
    },
    management: {
      fr: 'Conseil d’administration, ou directoire et conseil de surveillance',
      en: 'Board of directors, or management and supervisory boards',
      ar: 'مجلس إدارة، أو هيئة إدارة جماعية ومجلس مراقبة',
    },
    complexity: 3,
    advantages: [
      { fr: 'Adaptée aux besoins de capitaux importants', en: 'Suited to large capital needs', ar: 'ملائمة لحاجيات رأس مال كبيرة' },
      { fr: 'Actions plus facilement transmissibles', en: 'Shares more easily transferable', ar: 'أسهم أسهل في الإحالة' },
    ],
    limitations: [
      { fr: 'Formalisme et coûts de gouvernance élevés', en: 'High formality and governance costs', ar: 'شكليات وتكاليف حوكمة مرتفعة' },
      { fr: 'Exigences de capital variables selon le régime', en: 'Capital requirements vary by regime', ar: 'متطلبات رأس المال تختلف حسب النظام' },
    ],
    capital: {
      fr: 'Dépend du régime applicable et de l’appel public à l’épargne — à vérifier',
      en: 'Depends on the applicable regime and public offering — to verify',
      ar: 'يتوقف على النظام المعمول به وعلى اللجوء إلى الادخار العام — يجب التحقق',
    },
    capitalStatus: 'unverified',
  },
  {
    ...reportSource,
    id: 'SNC',
    shortName: 'SNC',
    reviewStatus: 'report-derived-needs-review',
    name: { fr: 'Société en nom collectif', en: 'General partnership', ar: 'شركة المفاوضة' },
    summary: {
      fr: 'Associés commerçants, responsables indéfiniment et solidairement des dettes sociales.',
      en: 'Associates are traders with unlimited, joint liability for company debts.',
      ar: 'شركاء تجار مسؤولون بصفة غير محدودة وبالتضامن عن ديون الشركة.',
    },
    associates: { fr: 'Au moins 2 associés', en: 'At least 2 associates', ar: 'شريكان على الأقل' },
    legalPersonality: { fr: 'Personnalité morale distincte', en: 'Separate legal personality', ar: 'شخصية معنوية مستقلة' },
    liability: {
      fr: 'Indéfinie et solidaire : chaque associé peut répondre de toutes les dettes.',
      en: 'Unlimited and joint: each associate may answer for all debts.',
      ar: 'غير محدودة وتضامنية: كل شريك قد يُطالب بكل الديون.',
    },
    management: { fr: 'Un ou plusieurs gérants', en: 'One or more managers', ar: 'مسير أو أكثر' },
    complexity: 2,
    advantages: [
      { fr: 'Forte relation de confiance entre associés', en: 'Strong trust between associates', ar: 'علاقة ثقة قوية بين الشركاء' },
      { fr: 'Pas de capital minimum indiqué dans le rapport', en: 'No minimum capital indicated in the report', ar: 'لا يذكر التقرير حدًا أدنى لرأس المال' },
    ],
    limitations: [
      { fr: 'Responsabilité illimitée et solidaire', en: 'Unlimited, joint liability', ar: 'مسؤولية غير محدودة وتضامنية' },
      { fr: 'Cession de parts très encadrée', en: 'Share transfers tightly regulated', ar: 'إحالة الحصص مقيدة جدًا' },
    ],
    capital: {
      fr: 'Aucun capital minimum spécifique indiqué dans le rapport',
      en: 'No specific minimum capital indicated in the report',
      ar: 'لا يذكر التقرير حدًا أدنى محددًا لرأس المال',
    },
    capitalStatus: 'report-derived-needs-review',
  },
  {
    ...reportSource,
    id: 'SCS',
    shortName: 'SCS',
    reviewStatus: 'report-derived-needs-review',
    name: { fr: 'Société en commandite simple', en: 'Limited partnership', ar: 'شركة المقارضة البسيطة' },
    summary: {
      fr: 'Deux catégories d’associés : les commandités qui gèrent, les commanditaires qui investissent.',
      en: 'Two classes of associates: managing partners (commandités) and investors (commanditaires).',
      ar: 'صنفان من الشركاء: شركاء متضامنون يسيرون، وشركاء موصون يستثمرون.',
    },
    associates: {
      fr: 'Commandités + commanditaires',
      en: 'Managing + limited partners',
      ar: 'شركاء متضامنون + شركاء موصون',
    },
    legalPersonality: { fr: 'Personnalité morale distincte', en: 'Separate legal personality', ar: 'شخصية معنوية مستقلة' },
    liability: {
      fr: 'Commandités : illimitée. Commanditaires : limitée à leurs apports en principe.',
      en: 'Managing partners: unlimited. Limited partners: generally limited to contributions.',
      ar: 'المتضامنون: غير محدودة. الموصون: محدودة مبدئيًا بمساهماتهم.',
    },
    management: { fr: 'Par les commandités', en: 'By the managing partners', ar: 'من قبل الشركاء المتضامنين' },
    complexity: 2,
    advantages: [
      { fr: 'Associe gestionnaires et investisseurs passifs', en: 'Combines managers and passive investors', ar: 'تجمع بين المسيرين والمستثمرين' },
      { fr: 'Les commanditaires limitent leur risque', en: 'Limited partners cap their risk', ar: 'يحد الموصون من مخاطرهم' },
    ],
    limitations: [
      { fr: 'Responsabilité illimitée des commandités', en: 'Unlimited liability for managing partners', ar: 'مسؤولية غير محدودة للمتضامنين' },
      { fr: 'Les commanditaires ne gèrent pas', en: 'Limited partners cannot manage', ar: 'لا يحق للموصين التسيير' },
    ],
    capital: {
      fr: 'Aucun capital minimum spécifique indiqué dans le rapport',
      en: 'No specific minimum capital indicated in the report',
      ar: 'لا يذكر التقرير حدًا أدنى محددًا لرأس المال',
    },
    capitalStatus: 'report-derived-needs-review',
  },
]

export const getLegalForm = (id: LegalFormId) => legalForms.find((f) => f.id === id)!
