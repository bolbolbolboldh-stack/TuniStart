import { IconTile, Icon } from '../components/ui/Icon'
import { PageHeader, Reveal } from '../components/ui/Reveal'
import { SourceMeta } from '../components/ui/SourceMeta'
import { Chip } from '../components/ui/StatusBadge'
import { Notice } from '../components/ui/States'
import { authorities } from '../data/authorities'
import { useI18n } from '../hooks/useI18n'

export function ResourcesPage() {
  const { t, l } = useI18n()
  return (
    <div className="container-page py-10 sm:py-14">
      <PageHeader eyebrow={t('nav.resources')} title={t('resources.title')} lead={t('resources.lead')} />
      <Notice icon="alert">{t('resources.warning')}</Notice>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {authorities.map((a, i) => (
          <Reveal key={a.id} delay={(i % 2) * 0.05}>
            <article className="card flex h-full flex-col rounded-[26px] p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <IconTile name={a.icon} size="lg" inverted={i === 0} />
                <div className="min-w-0">
                  <h2 className="text-[21px] font-semibold text-ink">{l(a.shortName)}</h2>
                  <p className="text-[13.5px] text-muted">{l(a.name)}</p>
                </div>
              </div>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{l(a.role)}</p>
              <div className="mt-4">
                <p className="text-[12.5px] font-semibold uppercase tracking-wider text-faint">{t('resources.services')}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {a.services.map((s) => (
                    <Chip key={s.fr}>{l(s)}</Chip>
                  ))}
                </div>
              </div>
              {a.notes && <p className="mt-4 text-[13px] leading-relaxed text-muted">{l(a.notes)}</p>}
              <div className="mt-auto pt-6">
                {a.url ? (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary pill inline-flex h-10 items-center gap-2 px-4 text-[14px] font-medium transition-opacity hover:opacity-90"
                  >
                    {t('resources.visit')}
                    <Icon name="external" size={15} />
                    <span className="sr-only">{t('nav.external')}</span>
                  </a>
                ) : (
                  <Chip tone="dashed" icon="alert">
                    {a.id === 'DGI' ? t('resources.noUrl') : t('common.toVerify')}
                  </Chip>
                )}
                {a.url && (
                  <p className="mt-2 break-all text-[12px] text-faint" dir="ltr">
                    {a.url.replace(/^https?:\/\//, '')}
                  </p>
                )}
                <div className="mt-4 border-t border-line pt-4">
                  <SourceMeta meta={a} />
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
