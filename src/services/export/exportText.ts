import type { SummaryModel } from './summaryModel'

/** Markdown-style plain text export of the full summary. */
export function exportText(m: SummaryModel): string {
  const out: string[] = []
  const h = (s: string) => out.push('', `## ${s}`, '')
  out.push(`# ${m.title} — TuniStart`, '', `> ${m.disclaimer}`, '', `${m.generatedLabel} : ${m.generatedAt}`)
  if (m.isSample) out.push('', `**${m.sampleLabel}**`)

  h(`1. ${m.headings.s1}`)
  m.identity.forEach((r) => out.push(`- **${r.label}** : ${r.value || '—'}`))

  h(`2. ${m.headings.s2}`)
  out.push(`**${m.orientation.heading}**`, '')
  m.orientation.items.forEach((i) => {
    out.push(`- **${i.form}** (${i.name}) — ${i.role}`)
    i.reasons.forEach((r) => out.push(`  - ${r}`))
  })
  m.orientation.uncertainty.forEach((u) => out.push(`- ⚠ ${u}`))

  h(`3. ${m.headings.s3}`)
  m.legalNotes.forEach((n) => out.push(`- ${n}`))

  h(`4. ${m.headings.s4}`)
  m.documents.forEach((g) => {
    out.push(`### ${g.group}`)
    if (g.note) out.push(`_${g.note}_`)
    g.items.forEach((i) => out.push(`- ${i.title} — ${i.condition} — ${i.status}`))
    out.push('')
  })

  h(`5. ${m.headings.s5}`)
  m.steps.forEach((s) => {
    out.push(`${s.n}. **${s.title}**`, `   - ${m.labels.actor} : ${s.actor}`, `   - ${m.labels.result} : ${s.result}`)
    if (s.note) out.push(`   - ${s.note}`)
  })
  if (m.sectorStep) out.push('', `- **${m.labels.sector} — ${m.sectorStep.title}** : ${m.sectorStep.actor} → ${m.sectorStep.result}`)

  h(`6. ${m.headings.s6}`)
  m.contacts.forEach((c) => out.push(`- **${c.name}** — ${c.role}${c.url ? ` (${c.url})` : ''}`))

  h(`7. ${m.headings.s7}`)
  out.push(`### ${m.labels.expenses}`)
  if (m.budget.lines.length) {
    out.push(`| ${m.labels.label} | ${m.labels.category} | ${m.labels.amount} | ${m.labels.share} |`, '|---|---|---:|---:|')
    m.budget.lines.forEach((l) => out.push(`| ${l.label} | ${l.category} | ${l.amount} | ${l.share} |`))
  } else out.push(m.labels.noLines)
  out.push('', `### ${m.labels.funding}`)
  if (m.budget.funding.length) m.budget.funding.forEach((f) => out.push(`- ${f.label} (${f.kind}) : ${f.amount}`))
  else out.push(m.labels.noFunding)
  out.push('', `- **${m.labels.totalExpenses}** : ${m.budget.totalExpenses}`, `- **${m.labels.totalFunding}** : ${m.budget.totalFunding}`, `- **${m.budget.balanceLabel}** : ${m.budget.balance}`)
  if (m.budget.declared) out.push(`- ${m.labels.vsDeclared} : ${m.budget.declared}`)

  h(`8. ${m.headings.s8}`)
  m.accounting.forEach((a) => out.push(`- ${a}`))

  h(`9. ${m.headings.s9}`)
  m.sourcesList.forEach((s) => out.push(`- ${s}`))

  out.push('', '---', '', m.disclaimer, '')
  return out.join('\n')
}

/** Checklist-only text export (documents page). */
export function exportChecklistText(m: SummaryModel): string {
  const out = [`# ${m.headings.s4} — TuniStart`, '', `> ${m.disclaimer}`, '', `${m.generatedLabel} : ${m.generatedAt}`, '']
  m.documents.forEach((g) => {
    out.push(`## ${g.group}`)
    if (g.note) out.push(`_${g.note}_`)
    g.items.forEach((i) => out.push(`- ${i.title} — ${i.condition} — ${i.status}`))
    out.push('')
  })
  return out.join('\n')
}
