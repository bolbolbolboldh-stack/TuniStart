import { Document, Font, Page, Path, Rect, StyleSheet, Svg, Text, View, Circle } from '@react-pdf/renderer'
import type { SummaryModel } from '../export/summaryModel'

let registered = false
/** Register bundled fonts (served from /fonts — works offline once loaded). */
export function registerPdfFonts(base = '') {
  if (registered) return
  Font.register({
    family: 'NotoSans',
    fonts: [
      { src: `${base}/fonts/NotoSans-Regular.ttf`, fontWeight: 400 },
      { src: `${base}/fonts/NotoSans-Bold.ttf`, fontWeight: 700 },
    ],
  })
  Font.register({
    family: 'NotoSansArabic',
    fonts: [
      { src: `${base}/fonts/NotoSansArabic-Regular.ttf`, fontWeight: 400 },
      { src: `${base}/fonts/NotoSansArabic-Bold.ttf`, fontWeight: 700 },
    ],
  })
  Font.registerHyphenationCallback((w) => [w])
  registered = true
}

const INK = '#0b0b0c'
const MUTED = '#5f5f64'
const LINE = '#e3e3e0'
const SOFT = '#f4f4f2'

const makeStyles = (rtl: boolean) =>
  StyleSheet.create({
    page: {
      paddingTop: 70,
      paddingBottom: 64,
      paddingHorizontal: 44,
      fontFamily: rtl ? ['NotoSansArabic', 'NotoSans'] as unknown as string : ['NotoSans', 'NotoSansArabic'] as unknown as string,
      fontSize: 9.5,
      color: INK,
      lineHeight: 1.45,
    },
    header: {
      position: 'absolute',
      top: 26,
      left: 44,
      right: 44,
      flexDirection: rtl ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 0.7,
      borderBottomColor: LINE,
      paddingBottom: 10,
    },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    brandText: { fontFamily: 'NotoSans', fontSize: 11, fontWeight: 700 },
    headerMeta: { fontSize: 8, color: MUTED, textAlign: rtl ? 'left' : 'right' },
    footer: {
      position: 'absolute',
      top: 800,
      left: 44,
      right: 44,
      flexDirection: rtl ? 'row-reverse' : 'row',
      justifyContent: 'space-between',
      borderTopWidth: 0.7,
      borderTopColor: LINE,
      paddingTop: 8,
      fontSize: 7.2,
      color: MUTED,
    },
    footerText: { width: '80%', textAlign: rtl ? 'right' : 'left' },
    title: { fontSize: 22, fontWeight: 700, lineHeight: 1.25, textAlign: rtl ? 'right' : 'left', marginBottom: 6 },
    sub: { fontSize: 9, color: MUTED, textAlign: rtl ? 'right' : 'left' },
    disclaimer: {
      marginTop: 14,
      padding: 10,
      borderWidth: 0.8,
      borderColor: INK,
      borderStyle: 'dashed',
      borderRadius: 8,
      fontSize: 8.6,
      textAlign: rtl ? 'right' : 'left',
    },
    sample: {
      marginTop: 8,
      alignSelf: rtl ? 'flex-end' : 'flex-start',
      backgroundColor: INK,
      color: '#fff',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      fontSize: 8,
      fontWeight: 700,
    },
    section: { marginTop: 18 },
    h2: {
      fontSize: 12.5,
      fontWeight: 700,
      marginBottom: 7,
      paddingBottom: rtl ? 7 : 4,
      lineHeight: rtl ? 1.7 : 1.3,
      borderBottomWidth: 1.2,
      borderBottomColor: INK,
      textAlign: rtl ? 'right' : 'left',
    },
    h3: { fontSize: 10, fontWeight: 700, marginTop: 8, marginBottom: 3, textAlign: rtl ? 'right' : 'left' },
    p: { textAlign: rtl ? 'right' : 'left', marginBottom: 2 },
    muted: { color: MUTED, textAlign: rtl ? 'right' : 'left' },
    row: { flexDirection: rtl ? 'row-reverse' : 'row', borderBottomWidth: 0.5, borderBottomColor: LINE, paddingVertical: 4 },
    k: { width: '32%', color: MUTED, textAlign: rtl ? 'right' : 'left', paddingHorizontal: 2 },
    v: { width: '68%', fontWeight: 700, textAlign: rtl ? 'right' : 'left', paddingHorizontal: 2 },
    bullet: { flexDirection: rtl ? 'row-reverse' : 'row', marginBottom: 2.5 },
    dot: { width: 10, textAlign: 'center' },
    bulletText: { flex: 1, textAlign: rtl ? 'right' : 'left' },
    card: { backgroundColor: SOFT, borderRadius: 8, padding: 9, marginBottom: 6 },
    th: { fontWeight: 700, color: MUTED, fontSize: 8 },
    cell: { paddingHorizontal: 3, textAlign: rtl ? 'right' : 'left' },
    num: { paddingHorizontal: 3, textAlign: rtl ? 'left' : 'right' },
    totals: { marginTop: 8, padding: 9, borderRadius: 8, backgroundColor: SOFT },
  })

function Mark() {
  return (
    <Svg width={16} height={16} viewBox="0 0 64 64">
      <Rect width={64} height={64} rx={18} fill={INK} />
      <Path d="M18 44c8 0 10-24 18-24h10" stroke="#fff" strokeWidth={5} strokeLinecap="round" fill="none" />
      <Circle cx={18} cy={44} r={4.5} fill="#fff" />
      <Path d="M42 14l6 6-6 6" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  )
}

export function ProjectSummaryPdf({ m }: { m: SummaryModel }) {
  const rtl = m.lang === 'ar'
  const s = makeStyles(rtl)
  const Bullet = ({ children, bold }: { children: string; bold?: boolean }) => (
    <View style={s.bullet} wrap={false}>
      <Text style={s.dot}>•</Text>
      <Text style={[s.bulletText, bold ? { fontWeight: 700 } : {}]}>{children}</Text>
    </View>
  )
  return (
    <Document title={`TuniStart — ${m.title}`} author="TuniStart" subject={m.title} language={m.lang} creator="TuniStart" producer="TuniStart">
      <Page size="A4" style={s.page} wrap>
        <View style={s.footer} fixed>
          <Text style={s.footerText}>TuniStart · {m.disclaimer.split(/[.。]/)[0]}.</Text>
          <Text render={({ pageNumber, totalPages }) => `${m.labels.page} ${pageNumber} / ${totalPages}`} />
        </View>
        <View style={s.header} fixed>
          <View style={s.brand}>
            <Mark />
            <Text style={s.brandText}>TuniStart</Text>
          </View>
          <Text style={s.headerMeta}>
            {m.generatedLabel} {m.generatedAt}
          </Text>
        </View>

        <Text style={s.title}>{m.title}</Text>
        <Text style={s.sub}>{m.identity[0].value}</Text>
        {m.isSample && <Text style={s.sample}>{m.sampleLabel}</Text>}
        <Text style={s.disclaimer}>{m.disclaimer}</Text>

        {/* 1 */}
        <View style={s.section}>
          <Text style={s.h2} minPresenceAhead={120}>
            1. {m.headings.s1}
          </Text>
          {m.identity.map((r) => (
            <View key={r.label} style={s.row} wrap={false}>
              <Text style={s.k}>{r.label}</Text>
              <Text style={s.v}>{r.value || '—'}</Text>
            </View>
          ))}
        </View>

        {/* 2 */}
        <View style={s.section}>
          <Text style={s.h2} minPresenceAhead={120}>
            2. {m.headings.s2}
          </Text>
          <Text style={[s.p, { fontWeight: 700, marginBottom: 6 }]}>{m.orientation.heading}</Text>
          {m.orientation.items.map((i) => (
            <View key={i.form + i.role} style={s.card} wrap={false}>
              <Text style={[s.p, { fontWeight: 700 }]}>
                {i.form} — {i.name} · {i.role}
              </Text>
              {i.reasons.map((r, k) => (
                <Text key={k} style={s.muted}>
                  {r}
                </Text>
              ))}
            </View>
          ))}
          {m.orientation.uncertainty.map((u, k) => (
            <Bullet key={k}>{u}</Bullet>
          ))}
        </View>

        {/* 3 */}
        <View style={s.section}>
          <Text style={s.h2} minPresenceAhead={120}>
            3. {m.headings.s3}
          </Text>
          {m.legalNotes.map((n, k) => (
            <Bullet key={k}>{n}</Bullet>
          ))}
        </View>

        {/* 4 */}
        <View style={s.section}>
          <Text style={s.h2} minPresenceAhead={120}>
            4. {m.headings.s4}
          </Text>
          {m.documents.map((g) => (
            <View key={g.group}>
              <Text style={s.h3} minPresenceAhead={40}>
                {g.group}
              </Text>
              {g.note && <Text style={[s.muted, { fontSize: 8.4, marginBottom: 3 }]}>{g.note}</Text>}
              {g.items.map((i) => (
                <View key={i.title} style={s.row} wrap={false}>
                  <Text style={[s.cell, { width: '58%' }]}>{i.title}</Text>
                  <Text style={[s.cell, { width: '20%', color: MUTED }]}>{i.condition}</Text>
                  <Text style={[s.cell, { width: '22%', fontWeight: 700 }]}>{i.status}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* 5 */}
        <View style={s.section}>
          <Text style={s.h2} minPresenceAhead={120}>
            5. {m.headings.s5}
          </Text>
          {m.steps.map((st) => (
            <View key={st.n} style={s.card} wrap={false}>
              <Text style={[s.p, { fontWeight: 700 }]}>
                {st.n}. {st.title}
              </Text>
              <Text style={s.muted}>
                {m.labels.actor} : {st.actor}
              </Text>
              <Text style={s.muted}>
                {m.labels.result} : {st.result}
              </Text>
              {st.note && <Text style={[s.muted, { fontSize: 8.4 }]}>{st.note}</Text>}
            </View>
          ))}
          {m.sectorStep && (
            <View style={[s.card, { backgroundColor: '#fff', borderWidth: 0.8, borderStyle: 'dashed', borderColor: INK }]} wrap={false}>
              <Text style={[s.p, { fontWeight: 700 }]}>
                {m.labels.sector} — {m.sectorStep.title}
              </Text>
              <Text style={s.muted}>
                {m.labels.actor} : {m.sectorStep.actor}
              </Text>
              <Text style={s.muted}>
                {m.labels.result} : {m.sectorStep.result}
              </Text>
            </View>
          )}
        </View>

        {/* 6 */}
        <View style={s.section}>
          <Text style={s.h2} minPresenceAhead={120}>
            6. {m.headings.s6}
          </Text>
          {m.contacts.map((c) => (
            <View key={c.name} style={{ marginBottom: 5 }} wrap={false}>
              <Text style={[s.p, { fontWeight: 700 }]}>{c.name}</Text>
              <Text style={s.muted}>{c.role}</Text>
              {c.url && <Text style={[s.muted, { fontFamily: 'NotoSans', fontSize: 8 }]}>{c.url}</Text>}
            </View>
          ))}
        </View>

        {/* 7 */}
        <View style={s.section}>
          <View wrap={false}>
            <Text style={s.h2}>7. {m.headings.s7}</Text>
            <Text style={s.h3}>{m.labels.expenses}</Text>
          </View>
          {m.budget.lines.length === 0 ? (
            <Text style={s.muted}>{m.labels.noLines}</Text>
          ) : (
            <>
              <View style={s.row} wrap={false}>
                <Text style={[s.cell, s.th, { width: '38%' }]}>{m.labels.label}</Text>
                <Text style={[s.cell, s.th, { width: '28%' }]}>{m.labels.category}</Text>
                <Text style={[s.num, s.th, { width: '22%' }]}>{m.labels.amount}</Text>
                <Text style={[s.num, s.th, { width: '12%' }]}>{m.labels.share}</Text>
              </View>
              {m.budget.lines.map((l, k) => (
                <View key={k} style={s.row} wrap={false}>
                  <Text style={[s.cell, { width: '38%' }]}>{l.label}</Text>
                  <Text style={[s.cell, { width: '28%', color: MUTED }]}>{l.category}</Text>
                  <Text style={[s.num, { width: '22%' }]}>{l.amount}</Text>
                  <Text style={[s.num, { width: '12%', fontWeight: 700 }]}>{l.share}</Text>
                </View>
              ))}
            </>
          )}
          <Text style={s.h3}>{m.labels.funding}</Text>
          {m.budget.funding.length === 0 ? (
            <Text style={s.muted}>{m.labels.noFunding}</Text>
          ) : (
            m.budget.funding.map((f, k) => (
              <View key={k} style={s.row} wrap={false}>
                <Text style={[s.cell, { width: '66%' }]}>{f.label}</Text>
                <Text style={[s.num, { width: '34%' }]}>{f.amount}</Text>
              </View>
            ))
          )}
          <View style={s.totals} wrap={false}>
            {[
              [m.labels.totalExpenses, m.budget.totalExpenses],
              [m.labels.totalFunding, m.budget.totalFunding],
              [m.budget.balanceLabel, m.budget.balance],
            ].map(([k, v]) => (
              <View key={k} style={{ flexDirection: rtl ? 'row-reverse' : 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                <Text style={{ color: MUTED }}>{k}</Text>
                <Text style={{ fontWeight: 700 }}>{v}</Text>
              </View>
            ))}
            {m.budget.declared && <Text style={[s.muted, { marginTop: 4, fontSize: 8.4 }]}>{m.budget.declared}</Text>}
          </View>
        </View>

        {/* 8 */}
        <View style={s.section} wrap={false}>
          <Text style={s.h2}>8. {m.headings.s8}</Text>
          {m.accounting.map((a, k) => (
            <Bullet key={k}>{a}</Bullet>
          ))}
        </View>

        {/* 9 */}
        <View style={s.section}>
          <Text style={s.h2} minPresenceAhead={120}>
            9. {m.headings.s9}
          </Text>
          {m.sourcesList.map((x, k) => (
            <Bullet key={k}>{x}</Bullet>
          ))}
        </View>

      </Page>
    </Document>
  )
}
