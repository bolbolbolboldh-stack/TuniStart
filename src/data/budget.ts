import type { BudgetCategory, BudgetCategoryId, FundingKind, L10n } from '../domain/types'

const t = (fr: string, en: string, ar: string): L10n => ({ fr, en, ar })

export const budgetCategories: BudgetCategory[] = [
  { id: 'formation', label: t('Frais de constitution', 'Formation costs', 'مصاريف التأسيس'), hint: t('Montants vérifiés ou saisis par vous uniquement.', 'Only verified or self-entered amounts.', 'مبالغ متحقق منها أو تدخلها بنفسك فقط.') },
  { id: 'professional', label: t('Prestations professionnelles', 'Professional fees', 'أتعاب مهنية'), hint: t('Notaire, expert-comptable, avocat…', 'Notary, accountant, lawyer…', 'عدل إشهاد، خبير محاسب، محام…') },
  { id: 'office', label: t('Siège social', 'Registered office', 'المقر الاجتماعي'), hint: t('Loyer, domiciliation, caution…', 'Rent, domiciliation, deposit…', 'كراء، توطين، ضمان…') },
  { id: 'fitout', label: t('Aménagement du local', 'Premises fit-out', 'تهيئة المحل'), hint: t('Travaux, mobilier, agencement.', 'Works, furniture, layout.', 'أشغال، أثاث، تهيئة.') },
  { id: 'equipment', label: t('Équipements / matériel', 'Equipment', 'التجهيزات / المعدات'), hint: t('Matériel de vente, informatique, machines.', 'Sales equipment, IT, machines.', 'معدات البيع، إعلامية، آلات.') },
  { id: 'stock', label: t('Stock initial', 'Initial stock', 'المخزون الأولي'), hint: t('Marchandises ou matières premières.', 'Goods or raw materials.', 'بضائع أو مواد أولية.') },
  { id: 'admin', label: t('Frais administratifs', 'Administrative costs', 'مصاريف إدارية'), hint: t('Uniquement des montants vérifiés ou saisis par vous.', 'Only verified or self-entered amounts.', 'مبالغ متحقق منها أو تدخلها بنفسك فقط.') },
  { id: 'communication', label: t('Communication / lancement', 'Communication / launch', 'الاتصال / الإطلاق'), hint: t('Enseigne, réseaux sociaux, impression.', 'Signage, social media, printing.', 'لافتة، شبكات اجتماعية، طباعة.') },
  { id: 'cash', label: t('Trésorerie initiale', 'Initial working cash', 'السيولة الأولية'), hint: t('Fonds de départ pour les premières dépenses.', 'Starting cash for first expenses.', 'أموال انطلاق للمصاريف الأولى.') },
  { id: 'other', label: t('Autres dépenses', 'Other expenses', 'مصاريف أخرى'), hint: t('Toute dépense propre à votre activité.', 'Any expense specific to your activity.', 'كل مصروف خاص بنشاطك.') },
]

export const getBudgetCategory = (id: BudgetCategoryId) => budgetCategories.find((c) => c.id === id)!

export const fundingKinds: { id: FundingKind; label: L10n }[] = [
  { id: 'personal', label: t('Apport personnel', 'Personal contribution', 'مساهمة شخصية') },
  { id: 'associates', label: t('Apports des associés', 'Associates’ contributions', 'مساهمات الشركاء') },
  { id: 'loan', label: t('Prêt bancaire', 'Bank loan', 'قرض بنكي') },
  { id: 'other', label: t('Autre financement', 'Other funding', 'تمويل آخر') },
]

/** Monochrome palette for the chart (grayscale steps, readable in both themes). */
export const chartShades = ['#0b0b0c', '#3a3a3d', '#5f5f63', '#86868b', '#a8a8ad', '#c7c7cc', '#2a2a2d', '#727277', '#9a9aa0', '#b8b8bd']
