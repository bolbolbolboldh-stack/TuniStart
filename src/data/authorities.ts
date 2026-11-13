import type { Authority, AuthorityId } from '../domain/types'

const fromReport = {
  sourceLabel: {
    fr: 'Rapport, Partie III, ch. 6 — écosystème administratif tunisien',
    en: 'Report, Part III, ch. 6 — Tunisian administrative ecosystem',
    ar: 'التقرير، الجزء الثالث، الفصل 6 — المنظومة الإدارية التونسية',
  },
  reportPageReference: 'pp. 124–168',
  lastReviewedAt: null,
  reviewStatus: 'report-derived-needs-review' as const,
}

/**
 * Official actors. URLs are only those given in the report. The DGI URL is
 * intentionally left empty (the report gives no single reliable direct link):
 * set `url` here once verified.
 */
export const authorities: Authority[] = [
  {
    ...fromReport,
    id: 'RNE',
    icon: 'landmark',
    shortName: { fr: 'RNE', en: 'RNE', ar: 'السجل الوطني للمؤسسات' },
    name: { fr: 'Registre National des Entreprises', en: 'National Business Register', ar: 'السجل الوطني للمؤسسات' },
    role: {
      fr: 'Immatriculation, identité juridique de l’entreprise, services liés à la dénomination et informations du registre.',
      en: 'Registration, legal identity of the business, name-related services and register information.',
      ar: 'التسجيل، الهوية القانونية للمؤسسة، الخدمات المتعلقة بالتسمية ومعلومات السجل.',
    },
    services: [
      { fr: 'Réservation de la dénomination', en: 'Company name reservation', ar: 'حجز التسمية' },
      { fr: 'Immatriculation', en: 'Registration', ar: 'الترسيم' },
      { fr: 'Extrait du registre', en: 'Register extract', ar: 'مضمون السجل' },
    ],
    url: 'https://www.registre-entreprises.tn',
  },
  {
    ...fromReport,
    id: 'DGI',
    icon: 'receipt',
    shortName: { fr: 'DGI', en: 'DGI', ar: 'الإدارة العامة للأداءات' },
    name: { fr: 'Direction Générale des Impôts', en: 'Directorate General of Taxes', ar: 'الإدارة العامة للأداءات' },
    role: {
      fr: 'Déclaration d’existence, identification fiscale et obligations fiscales.',
      en: 'Declaration of existence, tax identification and tax obligations.',
      ar: 'التصريح بالوجود، المعرف الجبائي والواجبات الجبائية.',
    },
    services: [
      { fr: 'Déclaration d’existence', en: 'Declaration of existence', ar: 'التصريح بالوجود' },
      { fr: 'Carte / identifiant fiscal', en: 'Tax card / identifier', ar: 'البطاقة / المعرف الجبائي' },
    ],
    notes: {
      fr: 'Le rapport cite les services en ligne de la DGI sans fournir de lien direct fiable : lien à configurer après vérification.',
      en: 'The report mentions DGI online services without a reliable direct link: link to configure after verification.',
      ar: 'يذكر التقرير خدمات الإدارة على الخط دون رابط مباشر موثوق: يضبط الرابط بعد التحقق.',
    },
  },
  {
    ...fromReport,
    id: 'APII',
    icon: 'building',
    shortName: { fr: 'APII', en: 'APII', ar: 'وكالة النهوض بالصناعة والتجديد' },
    name: {
      fr: 'Agence de Promotion de l’Industrie et de l’Innovation',
      en: 'Agency for the Promotion of Industry and Innovation',
      ar: 'وكالة النهوض بالصناعة والتجديد',
    },
    role: {
      fr: 'Information et accompagnement des investisseurs, dont le service de guichet unique documenté.',
      en: 'Investor information and support, including the documented one-stop shop.',
      ar: 'إرشاد المستثمرين ومرافقتهم، بما في ذلك الشباك الموحد.',
    },
    services: [
      { fr: 'Guichet unique', en: 'One-stop shop', ar: 'الشباك الموحد' },
      { fr: 'Information investisseurs', en: 'Investor information', ar: 'إرشاد المستثمرين' },
    ],
    url: 'https://www.tunisieindustrie.nat.tn/fr/doc.asp?mcat=16&mrub=186&msrub=269',
  },
  {
    ...fromReport,
    id: 'CNSS',
    icon: 'shield',
    shortName: { fr: 'CNSS', en: 'CNSS', ar: 'الصندوق الوطني للضمان الاجتماعي' },
    name: { fr: 'Caisse Nationale de Sécurité Sociale', en: 'National Social Security Fund', ar: 'الصندوق الوطني للضمان الاجتماعي' },
    role: {
      fr: 'Affiliation de l’employeur et obligations de sécurité sociale.',
      en: 'Employer affiliation and social-security obligations.',
      ar: 'انخراط المؤجر وواجبات الضمان الاجتماعي.',
    },
    services: [
      { fr: 'Affiliation employeur', en: 'Employer affiliation', ar: 'انخراط المؤجر' },
      { fr: 'Déclaration des salariés', en: 'Employee declarations', ar: 'التصريح بالأجراء' },
    ],
    url: 'https://www.cnss.tn',
  },
  {
    ...fromReport,
    id: 'BANK',
    icon: 'wallet',
    shortName: { fr: 'Banques', en: 'Banks', ar: 'البنوك' },
    name: { fr: 'Établissements bancaires', en: 'Banks', ar: 'المؤسسات البنكية' },
    role: {
      fr: 'Dépôt du capital lorsqu’il est requis et opérations bancaires professionnelles.',
      en: 'Capital deposit where required and professional banking operations.',
      ar: 'إيداع رأس المال عند الاقتضاء والعمليات البنكية المهنية.',
    },
    services: [
      { fr: 'Attestation de dépôt du capital', en: 'Capital deposit certificate', ar: 'شهادة إيداع رأس المال' },
      { fr: 'Compte professionnel', en: 'Business account', ar: 'حساب مهني' },
      { fr: 'Financement', en: 'Financing', ar: 'التمويل' },
    ],
  },
  {
    ...fromReport,
    id: 'PRO',
    icon: 'user-check',
    shortName: { fr: 'Professionnels', en: 'Professionals', ar: 'المهنيون' },
    name: {
      fr: 'Notaire, expert-comptable, avocat',
      en: 'Notary, chartered accountant, lawyer',
      ar: 'عدل إشهاد، خبير محاسب، محام',
    },
    role: {
      fr: 'Assistance pour les statuts et validation juridique ou comptable selon la situation.',
      en: 'Assistance with statutes and legal or accounting validation, as appropriate.',
      ar: 'المساعدة في تحرير النظام الأساسي والمصادقة القانونية أو المحاسبية حسب الحالة.',
    },
    services: [
      { fr: 'Rédaction des statuts', en: 'Drafting statutes', ar: 'تحرير النظام الأساسي' },
      { fr: 'Conseil juridique et fiscal', en: 'Legal and tax advice', ar: 'استشارة قانونية وجبائية' },
      { fr: 'Organisation comptable', en: 'Accounting set-up', ar: 'التنظيم المحاسبي' },
    ],
  },
]

export const authorityMeta: Record<AuthorityId, { label: { fr: string; en: string; ar: string } }> = {
  RNE: { label: { fr: 'RNE', en: 'RNE', ar: 'السجل الوطني' } },
  DGI: { label: { fr: 'DGI', en: 'DGI', ar: 'إدارة الأداءات' } },
  APII: { label: { fr: 'APII', en: 'APII', ar: 'وكالة النهوض بالصناعة' } },
  CNSS: { label: { fr: 'CNSS', en: 'CNSS', ar: 'الضمان الاجتماعي' } },
  BANK: { label: { fr: 'Banque', en: 'Bank', ar: 'البنك' } },
  PRO: { label: { fr: 'Professionnel', en: 'Professional', ar: 'مهني' } },
  SECTOR: { label: { fr: 'Organisme sectoriel', en: 'Sector body', ar: 'الهيكل القطاعي' } },
  FOUNDER: { label: { fr: 'Porteur de projet', en: 'Project owner', ar: 'باعث المشروع' } },
}
