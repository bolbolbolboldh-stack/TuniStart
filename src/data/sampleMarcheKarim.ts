import type { BudgetLine, FundingSource, Lang, ProjectProfile } from '../domain/types'

/**
 * « Exemple pédagogique — Marché Karim » (report ch. 9 and Annex 2).
 * Every amount is a pedagogical assumption, NOT an official fee or quote.
 */
export const sampleProfile: ProjectProfile = {
  activity: 'retail',
  activityDetail: 'Commerce de détail de produits alimentaires et d’hygiène',
  participants: 'one',
  participantsCount: 1,
  liability: 'yes',
  budget: 25000,
  governorate: 'siliana',
  delegation: 'Siliana Ville',
  projectName: 'Marché Karim',
  activityDescription: 'Commerce de détail de produits alimentaires et d’hygiène',
  employees: 1,
  plannedCapital: 3000,
  notes: 'Fondateur : Karim B. (exemple fictif). Partenaires envisagés : banque, expert-comptable.',
  isSample: true,
}

const L = {
  fitout: { fr: 'Aménagement du local', en: 'Premises fit-out', ar: 'تهيئة المحل' },
  equipment: { fr: 'Matériel de vente', en: 'Sales equipment', ar: 'معدات البيع' },
  stock: { fr: 'Stock initial', en: 'Initial stock', ar: 'المخزون الأولي' },
  formation: { fr: 'Frais de constitution', en: 'Formation costs', ar: 'مصاريف التأسيس' },
  cash: { fr: 'Trésorerie initiale', en: 'Initial working cash', ar: 'السيولة الأولية' },
  personal: { fr: 'Apport personnel', en: 'Personal contribution', ar: 'مساهمة شخصية' },
  loan: { fr: 'Prêt bancaire', en: 'Bank loan', ar: 'قرض بنكي' },
} as const

export const sampleBudgetLines = (lang: Lang = 'fr'): BudgetLine[] => [
  { id: 'k-fitout', category: 'fitout', label: L.fitout[lang], amount: 6000, example: true },
  { id: 'k-equipment', category: 'equipment', label: L.equipment[lang], amount: 4000, example: true },
  { id: 'k-stock', category: 'stock', label: L.stock[lang], amount: 12000, example: true },
  { id: 'k-formation', category: 'formation', label: L.formation[lang], amount: 1500, example: true },
  { id: 'k-cash', category: 'cash', label: L.cash[lang], amount: 1500, example: true },
]

export const sampleFunding = (lang: Lang = 'fr'): FundingSource[] => [
  { id: 'k-personal', kind: 'personal', label: L.personal[lang], amount: 10000, example: true },
  { id: 'k-loan', kind: 'loan', label: L.loan[lang], amount: 15000, example: true },
]

/** Optional context only — not a forecast. */
export const sampleOperating = { monthlyRevenue: 8000, monthlyCharges: 5500 }
