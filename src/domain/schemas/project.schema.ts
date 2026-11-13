import { z } from 'zod'
import type { ProjectProfile } from '../types'

/**
 * Validation is expressed with Zod. Error messages are i18n keys
 * (resolved in the UI), so the domain layer stays language-agnostic.
 */
export const MAX_AMOUNT = 1_000_000_000

export const amountSchema = z
  .number({ error: 'err.number' })
  .refine((n) => Number.isFinite(n), { message: 'err.number' })
  .refine((n) => n >= 0, { message: 'err.negative' })
  .refine((n) => n <= MAX_AMOUNT, { message: 'err.tooLarge' })

const activityIds = ['retail', 'restaurant', 'b2b-services', 'b2c-services', 'crafts', 'industry', 'liberal', 'other'] as const

export const stepSchemas = {
  1: z.object({
    activity: z.enum(activityIds, { error: 'err.activity' }),
    activityDetail: z.string().max(200, { message: 'err.tooLong' }),
  }),
  2: z
    .object({
      participants: z.enum(['one', 'two', 'three-plus'], { error: 'err.participants' }),
      participantsCount: z.number({ error: 'err.participantsCount' }).nullable(),
    })
    .superRefine((v, ctx) => {
      if (v.participants === 'three-plus' && v.participantsCount !== null) {
        if (!Number.isInteger(v.participantsCount) || v.participantsCount < 3) {
          ctx.addIssue({ code: 'custom', path: ['participantsCount'], message: 'err.participantsCount' })
        } else if (v.participantsCount > 10000) {
          ctx.addIssue({ code: 'custom', path: ['participantsCount'], message: 'err.tooLarge' })
        }
      }
    }),
  3: z.object({ liability: z.enum(['yes', 'no', 'unsure'], { error: 'err.liability' }) }),
  4: z.object({ budget: z.number({ error: 'err.number' }).nullable() }).superRefine((v, ctx) => {
    if (v.budget === null) {
      ctx.addIssue({ code: 'custom', path: ['budget'], message: 'err.budgetRequired' })
      return
    }
    const r = amountSchema.safeParse(v.budget)
    if (!r.success) ctx.addIssue({ code: 'custom', path: ['budget'], message: r.error.issues[0].message })
  }),
  5: z.object({
    governorate: z.string().min(1, { message: 'err.governorate' }),
    delegation: z.string().max(120, { message: 'err.tooLong' }),
  }),
  6: z.object({
    projectName: z.string().max(120, { message: 'err.tooLong' }),
    activityDescription: z.string().max(600, { message: 'err.tooLong' }),
    employees: z
      .number({ error: 'err.employeesInvalid' })
      .nullable()
      .refine((v) => v !== null, { message: 'err.employees' })
      .refine((v) => v === null || (Number.isInteger(v) && v >= 0 && v <= 100000), { message: 'err.employeesInvalid' }),
    plannedCapital: amountSchema.nullable(),
    notes: z.string().max(1000, { message: 'err.tooLong' }),
  }),
} as const

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7

/** Returns a map of field → i18n error key for the given step (empty when valid). */
export function validateStep(step: StepNumber, profile: ProjectProfile): Record<string, string> {
  if (step === 7) {
    const all: Record<string, string> = {}
    for (const s of [1, 2, 3, 4, 5, 6] as const) Object.assign(all, validateStep(s, profile))
    return all
  }
  const schema = stepSchemas[step]
  const res = schema.safeParse(profile)
  if (res.success) return {}
  const errors: Record<string, string> = {}
  for (const issue of res.error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}

export function validateProjectProfile(profile: ProjectProfile) {
  const errors = validateStep(7, profile)
  return { valid: Object.keys(errors).length === 0, errors }
}

/** Number of associates as a number (null when "3+" without an exact count). */
export function participantCount(p: ProjectProfile): number | null {
  if (p.participants === 'one') return 1
  if (p.participants === 'two') return 2
  if (p.participants === 'three-plus') return p.participantsCount ?? null
  return null
}

export const emptyProfile = (): ProjectProfile => ({
  activity: null,
  activityDetail: '',
  participants: null,
  participantsCount: null,
  liability: null,
  budget: null,
  governorate: '',
  delegation: '',
  projectName: '',
  activityDescription: '',
  employees: null,
  plannedCapital: null,
  notes: '',
  isSample: false,
})

/** Parse user-typed numbers ("25 000", "25,000", "25000.5"). Returns NaN on malformed input. */
export function parseAmount(raw: string): number | null {
  let s = raw.replace(/[\s\u00a0\u202f]/g, '')
  // "25,000" / "1,250,000" → thousands separators; otherwise a comma is a decimal mark.
  if (/^\d{1,3}(,\d{3})+$/.test(s)) s = s.replace(/,/g, '')
  else s = s.replace(/,/g, '.')
  if (s === '') return null
  if (!/^\d+(\.\d{0,3})?$/.test(s)) return Number.NaN
  return Number(s)
}
