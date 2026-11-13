/**
 * TuniStart — domain model.
 * Every legal / procedural item carries review metadata so content owners can
 * replace the data files without touching UI components.
 */

export type Lang = 'fr' | 'en' | 'ar'

/** A localized string. French is the reference language. */
export interface L10n {
  fr: string
  en: string
  ar: string
}

export type ReviewStatus =
  | 'verified'
  | 'report-derived-needs-review'
  | 'pedagogical-example'
  | 'unverified'

export interface ContentReviewMetadata {
  sourceLabel: L10n
  sourceUrl?: string
  /** Printed page reference in the source report, e.g. "pp. 45–65". */
  reportPageReference?: string
  /** ISO date of a real review. Never fabricated — null when unknown. */
  lastReviewedAt: string | null
  reviewStatus: ReviewStatus
  notes?: L10n
}

export interface SourceRecord {
  id: string
  title: L10n
  url?: string
  description: L10n
}

/* ---------------- Activities ---------------- */

export type ActivityId =
  | 'retail'
  | 'restaurant'
  | 'b2b-services'
  | 'b2c-services'
  | 'crafts'
  | 'industry'
  | 'liberal'
  | 'other'

export type EconomicSector = 'primaire' | 'secondaire' | 'tertiaire' | 'quaternaire'

export interface ActivityCategory {
  id: ActivityId
  icon: string
  label: L10n
  description: L10n
  sector: EconomicSector
  /** True when the activity may require a sector-specific authorization. */
  mayNeedSectorPermit: boolean
  permitNote?: L10n
}

/* ---------------- Project profile ---------------- */

export type ParticipantsChoice = 'one' | 'two' | 'three-plus'
export type LiabilityChoice = 'yes' | 'no' | 'unsure'

export interface ProjectProfile {
  activity: ActivityId | null
  activityDetail: string
  participants: ParticipantsChoice | null
  participantsCount: number | null
  liability: LiabilityChoice | null
  budget: number | null
  governorate: string
  delegation: string
  projectName: string
  activityDescription: string
  employees: number | null
  plannedCapital: number | null
  notes: string
  isSample: boolean
}

/* ---------------- Legal forms ---------------- */

export type LegalFormId = 'EI' | 'SUARL' | 'SARL' | 'SA' | 'SNC' | 'SCS'

export interface LegalForm extends ContentReviewMetadata {
  id: LegalFormId
  shortName: string
  name: L10n
  summary: L10n
  associates: L10n
  legalPersonality: L10n
  liability: L10n
  management: L10n
  complexity: 1 | 2 | 3
  advantages: L10n[]
  limitations: L10n[]
  capital: L10n
  capitalStatus: ReviewStatus
}

export interface LegalFormRule extends ContentReviewMetadata {
  id: string
  explanation: L10n
}

export type OrientationRole = 'primary' | 'alternative' | 'comparison' | 'professional-review'

export interface OrientationCandidate {
  form: LegalFormId
  role: OrientationRole
  reasons: L10n[]
  ruleIds: string[]
}

export interface OrientationResult {
  /** True when the engine has enough consistent info to highlight one form. */
  decisive: boolean
  primary: LegalFormId | null
  candidates: OrientationCandidate[]
  uncertainty: L10n[]
  professionalQuestions: L10n[]
  appliedRules: LegalFormRule[]
}

/* ---------------- Authorities ---------------- */

export type AuthorityId = 'RNE' | 'DGI' | 'APII' | 'CNSS' | 'BANK' | 'PRO' | 'SECTOR' | 'FOUNDER'

export interface Authority extends ContentReviewMetadata {
  id: AuthorityId
  shortName: L10n
  name: L10n
  role: L10n
  services: L10n[]
  url?: string
  icon: string
}

/* ---------------- Documents ---------------- */

export type DocumentGroupId = 'constitution' | 'dgi' | 'rne' | 'cnss' | 'sector'
export type DocumentCondition = 'general' | 'conditional' | 'activity' | 'verify'

export interface DocumentRequirement extends ContentReviewMetadata {
  id: string
  group: DocumentGroupId
  title: L10n
  purpose: L10n
  why: L10n
  condition: DocumentCondition
  details: L10n
  /** Forms this document applies to. Empty = all company forms. */
  forms?: LegalFormId[]
  /** Excluded when the form is EI (no company statutes etc.). */
  companyOnly?: boolean
}

export interface DocumentGroup {
  id: DocumentGroupId
  authority: AuthorityId
  title: L10n
  description: L10n
  conditional: boolean
  conditionNote?: L10n
}

export interface ChecklistGroup {
  group: DocumentGroup
  items: DocumentRequirement[]
  applicable: boolean
  note?: L10n
}

/* ---------------- Procedure ---------------- */

export type StepTag = 'to-prepare' | 'conditional' | 'verify'

export interface ProcedureStep extends ContentReviewMetadata {
  id: string
  order: number
  phase: 1 | 2 | 3 | 4
  title: L10n
  objective: L10n
  documents: L10n[]
  actors: AuthorityId[]
  actorsLabel: L10n
  result: L10n
  notes: L10n
  tags: StepTag[]
  conditional?: 'employees' | 'sector' | 'capital'
}

export interface TimelineStep extends ProcedureStep {
  applicable: boolean
  applicabilityNote?: L10n
}

/* ---------------- Budget ---------------- */

export type BudgetCategoryId =
  | 'formation'
  | 'professional'
  | 'office'
  | 'equipment'
  | 'admin'
  | 'communication'
  | 'cash'
  | 'stock'
  | 'fitout'
  | 'other'

export interface BudgetCategory {
  id: BudgetCategoryId
  label: L10n
  hint: L10n
}

export interface BudgetLine {
  id: string
  category: BudgetCategoryId
  label: string
  amount: number
  example?: boolean
}

export type FundingKind = 'personal' | 'associates' | 'loan' | 'other'

export interface FundingSource {
  id: string
  kind: FundingKind
  label: string
  amount: number
  example?: boolean
}

export interface BudgetSummary {
  totalExpenses: number
  totalFunding: number
  balance: number
  status: 'surplus' | 'gap' | 'balanced' | 'empty'
  byCategory: { category: BudgetCategoryId; amount: number; share: number }[]
  /** Difference between the budget declared in the diagnostic and the computed cost. */
  declaredBudgetDelta: number | null
}

/* ---------------- Glossary ---------------- */

export interface GlossaryEntry {
  id: string
  term: L10n
  definition: L10n
  fromReport: boolean
}
