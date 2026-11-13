import { describe, expect, it } from 'vitest'
import { dict } from '../../i18n/dictionary'
import { activities } from '../../data/activities'
import { legalForms } from '../../data/legalForms'
import { documentRequirements } from '../../data/documents'
import { procedureSteps } from '../../data/procedureSteps'
import { glossary } from '../../data/glossary'

describe('Localization completeness', () => {
  it('every UI string exists in FR, EN and AR', () => {
    for (const [section, entries] of Object.entries(dict)) {
      for (const [key, v] of Object.entries(entries as Record<string, readonly string[]>)) {
        expect(v, `${section}.${key}`).toHaveLength(3)
        v.forEach((s) => expect(s.trim().length, `${section}.${key}`).toBeGreaterThan(0))
      }
    }
  })
  it('content data is fully localized', () => {
    const check = (o: { fr: string; en: string; ar: string }) => expect(o.fr && o.en && o.ar).toBeTruthy()
    activities.forEach((a) => (check(a.label), check(a.description)))
    legalForms.forEach((f) => (check(f.name), check(f.summary), check(f.capital)))
    documentRequirements.forEach((d) => (check(d.title), check(d.purpose), check(d.details)))
    procedureSteps.forEach((s) => (check(s.title), check(s.objective), check(s.result)))
    glossary.forEach((g) => (check(g.term), check(g.definition)))
  })
})
