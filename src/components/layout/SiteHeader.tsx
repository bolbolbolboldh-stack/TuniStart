import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useI18n } from '../../hooks/useI18n'
import { useProjectSession } from '../../hooks/useProjectSession'
import { cn } from '../../lib/cn'
import { Logo } from '../brand/Logo'
import { ButtonLink } from '../ui/Button'
import { DialogClose, Sheet } from '../ui/Dialog'
import { Icon } from '../ui/Icon'
import { LanguageSwitcher, ThemeSwitcher } from './Switchers'

export function SiteHeader() {
  const { t } = useI18n()
  const { state } = useProjectSession()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()

  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/guide', label: t('nav.guide') },
    { to: '/ressources', label: t('nav.resources') },
    { to: '/glossaire', label: t('nav.glossary') },
    ...(state.completed ? [{ to: '/resultats', label: t('nav.myProject') }] : []),
  ]

  return (
    <header className="no-print sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className={cn(
          'glass mx-auto flex h-16 max-w-[1200px] items-center gap-3 rounded-[22px] ps-4 pe-2.5 transition-[box-shadow,background-color] duration-300',
          scrolled && 'glass-strong',
        )}
      >
        <Link to="/" aria-label="TuniStart — accueil" className="rounded-xl">
          <Logo />
        </Link>
        <nav aria-label="Navigation principale" className="ms-4 hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'pill px-3.5 py-2 text-[14px] font-medium transition-colors',
                  isActive ? 'bg-surface-2 text-ink' : 'text-muted hover:text-ink',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeSwitcher />
          </div>
          <LanguageSwitcher />
          <div className="hidden md:block">
            <ButtonLink to={state.completed ? '/resultats' : '/diagnostic'} size="sm" className="h-10 px-4" iconEnd="arrow-right">
              <span className="hidden xl:inline">{state.completed ? t('nav.myProject') : t('nav.start')}</span>
              <span className="xl:hidden">{state.completed ? t('nav.myProject') : t('nav.startShort')}</span>
            </ButtonLink>
          </div>
          <button
            className="glass pill inline-flex h-10 w-10 items-center justify-center text-ink lg:hidden"
            aria-label={t('nav.menu')}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" size={19} />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen} title={t('nav.menu')}>
        <div className="flex items-center justify-between">
          <Logo compact />
          <DialogClose className="glass pill inline-flex h-10 w-10 items-center justify-center" aria-label={t('nav.close')}>
            <Icon name="x" size={19} />
          </DialogClose>
        </div>
        <nav aria-label="Navigation mobile" className="mt-6 flex flex-col">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn('flex items-center justify-between border-b border-line py-4 text-[20px] font-semibold', isActive ? 'text-ink' : 'text-ink-2')
              }
            >
              {l.label}
              <Icon name="arrow-right" size={18} className="flip-rtl text-faint" />
            </NavLink>
          ))}
          <NavLink to="/mentions" className="flex items-center justify-between border-b border-line py-4 text-[20px] font-semibold text-ink-2">
            {t('nav.about')}
            <Icon name="arrow-right" size={18} className="flip-rtl text-faint" />
          </NavLink>
        </nav>
        <div className="mt-6 space-y-5">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-faint">{t('nav.language')}</p>
            <LanguageSwitcher full />
          </div>
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-faint">{t('nav.theme')}</p>
            <ThemeSwitcher full />
          </div>
          <ButtonLink to={state.completed ? '/resultats' : '/diagnostic'} size="lg" className="w-full" iconEnd="arrow-right">
            {state.completed ? t('nav.myProject') : t('nav.start')}
          </ButtonLink>
        </div>
      </Sheet>
    </header>
  )
}
