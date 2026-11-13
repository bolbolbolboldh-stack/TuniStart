import { Link } from 'react-router'
import { ButtonLink } from '../components/ui/Button'
import { Icon } from '../components/ui/Icon'
import { PageHeader, Reveal } from '../components/ui/Reveal'
import { Notice } from '../components/ui/States'
import { phases } from '../data/procedureSteps'
import { useI18n } from '../hooks/useI18n'

export function GuidePage() {
  const { t, l } = useI18n()
  const linkLabel: Record<string, string> = {
    '/diagnostic': t('guide.goDiagnostic'),
    '/ressources': t('guide.goResources'),
    '/glossaire': t('guide.goGlossary'),
  }
  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader eyebrow={t('nav.guide')} title={t('guide.title')} lead={t('guide.lead')} />
      <Notice icon="info">{t('guide.varies')}</Notice>

      <ol className="relative mt-10 space-y-5">
        <span aria-hidden="true" className="absolute bottom-6 top-6 hidden w-px bg-line-strong md:block md:start-[27px]" />
        {phases.map((p, i) => (
          <li key={p.id} className="relative md:ps-20">
            <Reveal delay={i * 0.05}>
              <span
                aria-hidden="true"
                className={`absolute start-0 top-6 hidden h-14 w-14 items-center justify-center rounded-[18px] text-[20px] font-semibold md:flex ${
                  i === 0 ? 'btn-primary' : 'glass text-ink'
                }`}
              >
                {p.id}
              </span>
              <article className="card rounded-[26px] p-6 sm:p-8">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">
                  {t('guide.phase')} {p.id}
                </p>
                <h2 className="mt-1.5 text-[24px] font-semibold text-ink">{l(p.title)}</h2>
                <p className="reading mt-2 text-[16px] leading-relaxed text-muted">{l(p.text)}</p>
                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{t('guide.tasks')}</p>
                    <ul className="mt-2 space-y-1.5">
                      {p.tasks.map((task) => (
                        <li key={task.fr} className="flex items-start gap-2 text-[14.5px] text-ink-2">
                          <Icon name="check" size={16} className="mt-0.5 shrink-0" />
                          {l(task)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{t('guide.actors')}</p>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{l(p.actors)}</p>
                  </div>
                  <div className="rounded-[18px] bg-surface-2 p-4">
                    <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                      <Icon name="help" size={15} />
                      {t('guide.why')}
                    </p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{l(p.why)}</p>
                  </div>
                </div>
                <Link to={p.link} className="mt-6 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                  {linkLabel[p.link]}
                  <Icon name="arrow-right" size={16} className="flip-rtl" />
                </Link>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex justify-center">
        <ButtonLink to="/diagnostic" size="lg" iconEnd="arrow-right">
          {t('nav.start')}
        </ButtonLink>
      </div>
    </div>
  )
}
