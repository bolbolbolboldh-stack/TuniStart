// @vitest-environment node
import { renderToBuffer } from '@react-pdf/renderer'
import { describe, expect, it } from 'vitest'
import { sampleBudgetLines, sampleFunding, sampleProfile } from '../../data/sampleMarcheKarim'
import { buildProjectResults } from '../../domain/summary/buildProjectSummary'
import { buildSummaryModel } from '../../services/export/summaryModel'
import { ProjectSummaryPdf, registerPdfFonts } from '../../services/pdf/ProjectSummaryPdf'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

describe('PDF export', () => {
  it.each(['fr', 'en', 'ar'] as const)('renders a multi-page A4 PDF (%s)', async (lang) => {
    registerPdfFonts(resolve(process.cwd(), 'public'))
    const lines = sampleBudgetLines(lang)
    const funding = sampleFunding(lang)
    const state = { profile: sampleProfile, completed: true, step: 7, prepared: { 'doc-id': true }, budgetLines: lines, funding }
    const results = buildProjectResults(sampleProfile, lines, funding)
    const m = buildSummaryModel(state, results, lang, new Date('2026-01-01T10:00:00Z'))
    const buf = await renderToBuffer(<ProjectSummaryPdf m={m} />)
    expect(buf.subarray(0, 5).toString()).toBe('%PDF-')
    if (process.env.PDF_OUT) {
      mkdirSync(process.env.PDF_OUT, { recursive: true })
      writeFileSync(`${process.env.PDF_OUT}/summary-${lang}.pdf`, buf)
    }
  }, 30000)
})
