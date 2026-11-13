import { useNavigate } from 'react-router'
import { HeroVisual } from '../components/brand/HeroVisual'
import { Button, ButtonLink } from '../components/ui/Button'
import { Card, GlassCard } from '../components/ui/GlassCard'
import { Icon, IconTile } from '../components/ui/Icon'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Reveal, SectionHeading } from '../components/ui/Reveal'
import { Chip } from '../components/ui/StatusBadge'
import { useToast } from '../components/ui/Toast'
import { authorities } from '../data/authorities'
import { getLegalForm } from '../data/legalForms'
import { sampleBudgetLines, sampleFunding, sampleProfile } from '../data/sampleMarcheKarim'
import { pct } from '../domain/budget/calculateBudget'
import { buildProjectResults } from '../domain/summary/buildProjectSummary'
import { useI18n } from '../hooks/useI18n'
import { useProjectSession } from '../hooks/useProjectSession'
import { getBudgetCategory } from '../data/budget'

export function HomePage() {
  const { t, l, lang, money } = useI18n()
  const { dispatch } = useProjectSession()
  const navigate = useNavigate()
  const toast = useToast()

  const loadSample = () => {
    dispatch({ type: 'load-sample', lang })
    toast(t('toast.sampleLoaded'))
    navigate('/resultats')
  }

  // Preview computed from the teaching example — never fabricated metrics.
  const preview = buildProjectResults(sampleProfile, sampleBudgetLines(lang), sampleFunding(lang))
  const primary = getLegalForm(preview.orientation.primary!)
  const docsTotal = preview.checklist.filter((g) => g.applicable).reduce((s, g) => s + g.items.length, 0)

  const services = [
    { icon: 'scale', title: t('home.s1Title'), text: t('home.s1Text'), to: '/resultats/orientation' },
    { icon: 'list-checks', title: t('home.s2Title'), text: t('home.s2Text'), to: '/resultats/documents' },
    { icon: 'route', title: t('home.s3Title'), text: t('home.s3Text'), to: '/resultats/parcours' },
  ]
  const how = [
    { icon: 'compass', title: t('home.how1'), text: t('home.how1t') },
    { icon: 'layers', title: t('home.how2'), text: t('home.how2t') },
    { icon: 'clipboard', title: t('home.how3'), text: t('home.how3t') },
    { icon: 'download', title: t('home.how4'), text: t('home.how4t') },
  ]

  return (
    <>
      {/* HERO */}
      <section className="container-page grid items-center gap-10 pb-16 pt-10 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-24 lg:pt-20">
        <div>
          <Reveal>
            <span className="glass pill inline-flex items-center gap-2 px-3.5 py-1.5 text-[13px] font-medium text-ink-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink opacity-30 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
              </span>
              {t('home.eyebrow')}
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-gradient mt-6 text-[44px] font-semibold leading-[1.02] sm:text-[60px] lg:text-[72px]">{t('brand.tagline')}</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted sm:text-[19px]">{t('home.lead')}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink to="/diagnostic" size="lg" iconEnd="arrow-right">
                {t('nav.start')}
              </ButtonLink>
              <ButtonLink to="/guide" size="lg" variant="glass">
                {t('home.discoverGuide')}
              </ButtonLink>
            </div>
            <button onClick={loadSample} className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink">
              <Icon name="sparkles" size={16} />
              {t('home.seeExample')}
            </button>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-muted">
              {[
                ['shield', t('home.trust1')],
                ['laptop', t('home.trust2')],
                ['languages', t('home.trust3')],
              ].map(([icon, text]) => (
                <li key={icon} className="flex items-center gap-2">
                  <Icon name={icon} size={16} className="text-ink" />
                  {text}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <HeroVisual />
        </Reveal>
      </section>

      {/* SERVICES */}
      <section className="container-page py-16">
        <Reveal>
          <SectionHeading title={t('home.servicesTitle')} lead={t('home.servicesLead')} />
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <button
                onClick={() => navigate(s.to)}
                className="card lift group flex h-full w-full flex-col rounded-[26px] p-6 text-start sm:p-7"
              >
                <IconTile name={s.icon} size="lg" inverted={i === 0} />
                <h3 className="mt-6 text-[20px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{s.text}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                  {t('results.explore')}
                  <Icon name="arrow-right" size={16} className="flip-rtl transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container-page py-16">
        <Reveal>
          <SectionHeading title={t('home.howTitle')} />
        </Reveal>
        <ol className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {how.map((h, i) => (
            <li key={h.title} className="h-full">
            <Reveal delay={i * 0.06} className="h-full">
              <div className="glass relative h-full rounded-[24px] p-6">
                <div className="flex items-center justify-between">
                  <IconTile name={h.icon} />
                  <span className="text-[44px] font-semibold leading-none text-line-strong tabular-nums" aria-hidden="true">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-[17px] font-semibold text-ink">{h.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{h.text}</p>
              </div>
            </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* PREVIEW */}
      <section className="container-page py-16">
        <Reveal>
          <SectionHeading title={t('home.previewTitle')} lead={t('home.previewLead')} />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10 rounded-[32px] border border-line bg-surface-2/60 p-3 sm:p-5">
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-5 md:col-span-2 lg:col-span-2 lg:row-span-2">
                <div className="flex items-center justify-between gap-2">
                  <Chip icon="scale" tone="solid">
                    {t('results.leadingForm')}
                  </Chip>
                  <Chip tone="outline" icon="book">
                    {t('common.sampleBadge')}
                  </Chip>
                </div>
                <p className="mt-6 text-[13px] font-medium text-muted">{t('results.formToExamine')}</p>
                <p className="mt-1 text-[48px] font-semibold leading-none text-ink">{primary.shortName}</p>
                <p className="mt-2 text-[15px] text-ink-2">{l(primary.name)}</p>
                <p className="mt-5 text-[14px] leading-relaxed text-muted">{l(preview.orientation.candidates[0].reasons[0])}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="text-[13px] text-faint">{t('results.alternatives')} :</span>
                  {preview.orientation.candidates
                    .filter((c) => c.role !== 'primary')
                    .map((c) => (
                      <Chip key={c.form}>{c.form}</Chip>
                    ))}
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-2 text-[13px] font-medium text-muted">
                  <Icon name="list-checks" size={16} />
                  {t('results.docsPrepared')}
                </div>
                <p className="mt-3 text-[30px] font-semibold text-ink tabular-nums">
                  4<span className="text-faint">/{docsTotal}</span>
                </p>
                <ProgressBar value={4} max={docsTotal} label={t('results.docsPrepared')} className="mt-3" />
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-2 text-[13px] font-medium text-muted">
                  <Icon name="route" size={16} />
                  {t('results.steps')}
                </div>
                <p className="mt-3 text-[30px] font-semibold text-ink tabular-nums">{preview.timeline.core.length}</p>
                <div className="mt-3 flex gap-1">
                  {preview.timeline.core.map((s, i) => (
                    <span key={s.id} className={`h-1.5 flex-1 rounded-full ${i < 2 ? 'bg-ink' : 'bg-surface-3'}`} />
                  ))}
                </div>
              </Card>
              <Card className="p-5 md:col-span-2">
                <div className="flex items-center justify-between gap-2 text-[13px] font-medium text-muted">
                  <span className="flex items-center gap-2">
                    <Icon name="pie-chart" size={16} />
                    {t('results.estimatedCost')}
                  </span>
                  <Chip tone="dashed">{t('common.pedagogical')}</Chip>
                </div>
                <p className="mt-3 text-[30px] font-semibold text-ink tabular-nums">{money(preview.budget.totalExpenses)}</p>
                <div className="mt-4 flex h-2.5 overflow-hidden rounded-full">
                  {preview.budget.byCategory.map((c, i) => (
                    <span key={c.category} style={{ width: `${c.share * 100}%`, background: `var(--chart-${(i % 5) + 1})` }} />
                  ))}
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-muted">
                  {preview.budget.byCategory.map((c) => (
                    <li key={c.category}>
                      {l(getBudgetCategory(c.category).label)} {pct(c.share)}%
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="glass" icon="sparkles" onClick={loadSample}>
                {t('home.seeExample')}
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ECOSYSTEM */}
      <section className="container-page py-16">
        <Reveal>
          <SectionHeading title={t('home.ecoTitle')} lead={t('home.ecoLead')} />
        </Reveal>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {authorities
            .filter((a) => a.id !== 'PRO')
            .map((a, i) => (
              <Reveal key={a.id} delay={i * 0.05}>
                <div className="card h-full rounded-[22px] p-5">
                  <IconTile name={a.icon} size="sm" />
                  <p className="mt-4 text-[17px] font-semibold text-ink">{l(a.shortName)}</p>
                  <p className="mt-0.5 text-[12.5px] text-faint">{l(a.name)}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{l(a.role)}</p>
                </div>
              </Reveal>
            ))}
        </div>
        <div className="mt-6">
          <ButtonLink to="/ressources" variant="secondary" iconEnd="arrow-right">
            {t('nav.resources')}
          </ButtonLink>
        </div>
      </section>

      {/* TRUST + CTA */}
      <section className="container-page py-16">
        <Reveal>
          <GlassCard className="overflow-hidden rounded-[34px] p-8 sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <h2 className="text-[32px] font-semibold leading-tight text-ink sm:text-[44px]">{t('home.ctaTitle')}</h2>
                <p className="mt-3 max-w-lg text-[16.5px] leading-relaxed text-muted">{t('home.ctaText')}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink to="/diagnostic" size="lg" iconEnd="arrow-right">
                    {t('nav.start')}
                  </ButtonLink>
                  <Button size="lg" variant="secondary" icon="sparkles" onClick={loadSample}>
                    {t('home.seeExample')}
                  </Button>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[22px] border border-dashed border-line-strong p-5">
                <Icon name="shield" size={22} className="mt-0.5 shrink-0 text-ink" />
                <p className="text-[14.5px] leading-relaxed text-ink-2">{t('common.disclaimerShort')}</p>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </section>
    </>
  )
}
