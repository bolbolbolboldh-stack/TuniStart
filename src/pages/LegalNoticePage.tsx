import { ButtonLink } from '../components/ui/Button'
import { Card } from '../components/ui/GlassCard'
import { Icon, IconTile } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/Reveal'
import { CONTENT_VERSION, REPORT_TITLE } from '../data/sourceRegistry'
import { useI18n } from '../hooks/useI18n'

export function LegalNoticePage() {
  const { t } = useI18n()
  const blocks = [
    { icon: 'compass', title: t('about.whatTitle'), text: t('about.whatText') },
    { icon: 'users', title: t('about.forTitle'), text: t('about.forText') },
    { icon: 'alert', title: t('about.whyTitle'), text: t('about.whyText') },
    { icon: 'shield', title: t('about.privacyTitle'), text: t('about.privacyText') },
    { icon: 'check-circle', title: t('about.reviewTitle'), text: t('about.reviewText') },
    { icon: 'target', title: t('about.metricsTitle'), text: t('about.metricsText') },
  ]
  return (
    <div className="container-page max-w-[1000px] py-10 sm:py-14">
      <PageHeader eyebrow={t('nav.about')} title={t('about.title')} lead={t('about.lead')} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-[18px] font-semibold text-ink">
            <Icon name="check-circle" size={19} />
            {t('about.doesTitle')}
          </h2>
          <ul className="mt-4 space-y-2">
            {t('about.does')
              .split('|')
              .map((x) => (
                <li key={x} className="flex items-start gap-2 text-[14.5px] text-ink-2">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0" />
                  {x}
                </li>
              ))}
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-[18px] font-semibold text-ink">
            <Icon name="x" size={19} />
            {t('about.doesNotTitle')}
          </h2>
          <ul className="mt-4 space-y-2">
            {t('about.doesNot')
              .split('|')
              .map((x) => (
                <li key={x} className="flex items-start gap-2 text-[14.5px] text-ink-2">
                  <Icon name="minus" size={16} className="mt-0.5 shrink-0" />
                  {x}
                </li>
              ))}
          </ul>
        </Card>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {blocks.map((b) => (
          <Card key={b.title} className="p-6">
            <IconTile name={b.icon} size="sm" />
            <h2 className="mt-4 text-[17px] font-semibold text-ink">{b.title}</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{b.text}</p>
          </Card>
        ))}
      </div>
      <div className="glass mt-6 rounded-[24px] p-6">
        <p className="text-[14.5px] leading-relaxed text-ink-2">{t('common.disclaimerShort')}</p>
        <p className="mt-3 text-[12.5px] text-faint">
          {t('common.source')} : « {REPORT_TITLE} » · {t('about.version')} {CONTENT_VERSION}
        </p>
      </div>
      <div className="mt-8">
        <ButtonLink to="/diagnostic" iconEnd="arrow-right">
          {t('nav.start')}
        </ButtonLink>
      </div>
    </div>
  )
}
