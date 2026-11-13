import { Link } from 'react-router'
import { authorities } from '../../data/authorities'
import { useI18n } from '../../hooks/useI18n'
import { Logo } from '../brand/Logo'
import { Icon } from '../ui/Icon'

export function SiteFooter() {
  const { t, l } = useI18n()
  const official = authorities.filter((a) => a.url)
  return (
    <footer className="no-print mt-24 border-t border-line">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted">{t('footer.about')}</p>
          <p className="mt-6 text-[12.5px] text-faint">{t('common.disclaimerShort')}</p>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-faint">{t('footer.product')}</p>
          <ul className="mt-4 space-y-2.5 text-[14.5px]">
            {[
              ['/diagnostic', t('nav.start')],
              ['/guide', t('nav.guide')],
              ['/ressources', t('nav.resources')],
              ['/glossaire', t('nav.glossary')],
              ['/mentions', t('nav.about')],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-ink-2 transition-colors hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-faint">{t('footer.official')}</p>
          <ul className="mt-4 space-y-2.5 text-[14.5px]">
            {official.map((a) => (
              <li key={a.id}>
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink">
                  {l(a.shortName)}
                  <Icon name="external" size={13} />
                  <span className="sr-only">{t('nav.external')}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-5 text-[12.5px] text-faint">
          <span>© {new Date().getFullYear()} TuniStart · {t('footer.rights')}</span>
          <span dir="ltr">Français · العربية · English</span>
        </div>
      </div>
    </footer>
  )
}
