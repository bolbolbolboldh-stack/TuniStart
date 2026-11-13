import type { ActivityCategory } from '../domain/types'

/**
 * Activity taxonomy (report Part I, ch. 2 — sectors and activity types).
 * `mayNeedSectorPermit` only raises a "verification needed" card — it never
 * claims to determine the exact authorization required.
 */
export const activities: ActivityCategory[] = [
  {
    id: 'retail',
    icon: 'store',
    sector: 'tertiaire',
    mayNeedSectorPermit: false,
    label: { fr: 'Commerce de détail', en: 'Retail trade', ar: 'تجارة التفصيل' },
    description: {
      fr: 'Vente de produits aux particuliers : épicerie, boutique, magasin.',
      en: 'Selling products to consumers: grocery, shop, store.',
      ar: 'بيع المنتجات للأفراد: بقالة، متجر، محل.',
    },
  },
  {
    id: 'restaurant',
    icon: 'utensils',
    sector: 'tertiaire',
    mayNeedSectorPermit: true,
    permitNote: {
      fr: 'La restauration peut relever de règles d’hygiène et d’autorisations spécifiques.',
      en: 'Food service may be subject to specific hygiene rules and authorizations.',
      ar: 'قد يخضع نشاط المطاعم لقواعد صحية وتراخيص خاصة.',
    },
    label: { fr: 'Restauration', en: 'Food service', ar: 'المطاعم' },
    description: {
      fr: 'Restaurant, café, traiteur, vente à emporter.',
      en: 'Restaurant, café, catering, take-away.',
      ar: 'مطعم، مقهى، خدمات الإطعام، البيع المحمول.',
    },
  },
  {
    id: 'b2b-services',
    icon: 'briefcase',
    sector: 'tertiaire',
    mayNeedSectorPermit: false,
    label: { fr: 'Services aux entreprises', en: 'Business services', ar: 'خدمات للمؤسسات' },
    description: {
      fr: 'Conseil, informatique, maintenance, nettoyage, communication.',
      en: 'Consulting, IT, maintenance, cleaning, communication.',
      ar: 'استشارات، إعلامية، صيانة، تنظيف، اتصال.',
    },
  },
  {
    id: 'b2c-services',
    icon: 'users',
    sector: 'tertiaire',
    mayNeedSectorPermit: true,
    permitNote: {
      fr: 'Certains services (transport, santé, formation professionnelle…) exigent une autorisation sectorielle.',
      en: 'Some services (transport, health, vocational training…) require a sector authorization.',
      ar: 'بعض الخدمات (النقل، الصحة، التكوين المهني…) تتطلب ترخيصًا قطاعيًا.',
    },
    label: { fr: 'Services aux particuliers', en: 'Personal services', ar: 'خدمات للأفراد' },
    description: {
      fr: 'Coiffure, réparation, transport, cours, bien-être.',
      en: 'Hairdressing, repairs, transport, tutoring, wellness.',
      ar: 'حلاقة، تصليح، نقل، دروس، رفاهية.',
    },
  },
  {
    id: 'crafts',
    icon: 'hammer',
    sector: 'secondaire',
    mayNeedSectorPermit: false,
    label: { fr: 'Artisanat', en: 'Crafts', ar: 'الصناعات التقليدية' },
    description: {
      fr: 'Production artisanale : céramique, textile, menuiserie, bijoux.',
      en: 'Artisan production: ceramics, textiles, carpentry, jewellery.',
      ar: 'إنتاج حرفي: خزف، نسيج، نجارة، مصوغ.',
    },
  },
  {
    id: 'industry',
    icon: 'factory',
    sector: 'secondaire',
    mayNeedSectorPermit: true,
    permitNote: {
      fr: 'Une activité industrielle peut être soumise à des règles de protection de l’environnement.',
      en: 'An industrial activity may be subject to environmental protection rules.',
      ar: 'قد يخضع النشاط الصناعي لقواعد حماية البيئة.',
    },
    label: { fr: 'Industrie', en: 'Industry', ar: 'الصناعة' },
    description: {
      fr: 'Transformation, fabrication, agroalimentaire.',
      en: 'Processing, manufacturing, food industry.',
      ar: 'تحويل، تصنيع، صناعات غذائية.',
    },
  },
  {
    id: 'liberal',
    icon: 'scale',
    sector: 'quaternaire',
    mayNeedSectorPermit: true,
    permitNote: {
      fr: 'Les professions libérales réglementées dépendent souvent d’un ordre ou d’un agrément.',
      en: 'Regulated liberal professions often depend on a professional order or approval.',
      ar: 'غالبًا ما ترتبط المهن الحرة المنظمة بهيئة مهنية أو بترخيص.',
    },
    label: { fr: 'Profession libérale', en: 'Liberal profession', ar: 'مهنة حرة' },
    description: {
      fr: 'Activité intellectuelle exercée en indépendant.',
      en: 'Independent intellectual activity.',
      ar: 'نشاط فكري يمارس بصفة مستقلة.',
    },
  },
  {
    id: 'other',
    icon: 'sparkles',
    sector: 'tertiaire',
    mayNeedSectorPermit: true,
    permitNote: {
      fr: 'Activité non classée : une vérification complémentaire est nécessaire.',
      en: 'Unclassified activity: an additional check is needed.',
      ar: 'نشاط غير مصنف: يلزم تحقق إضافي.',
    },
    label: { fr: 'Autre', en: 'Other', ar: 'أخرى' },
    description: {
      fr: 'Votre activité ne correspond à aucune catégorie ci-dessus.',
      en: 'Your activity fits none of the categories above.',
      ar: 'نشاطك لا يندرج ضمن الأصناف السابقة.',
    },
  },
]

export const sectorLabels = {
  primaire: { fr: 'Secteur primaire', en: 'Primary sector', ar: 'القطاع الأول' },
  secondaire: { fr: 'Secteur secondaire', en: 'Secondary sector', ar: 'القطاع الثاني' },
  tertiaire: { fr: 'Secteur tertiaire', en: 'Tertiary sector', ar: 'القطاع الثالث' },
  quaternaire: { fr: 'Secteur quaternaire', en: 'Quaternary sector', ar: 'القطاع الرابع' },
} as const

export const getActivity = (id: string | null) => activities.find((a) => a.id === id) ?? null
