import { motion, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useI18n } from '../../hooks/useI18n'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function AppShell() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const reduce = useReducedMotion()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  // Section key: keep the results shell mounted while switching tabs.
  const key = pathname.startsWith('/resultats') ? '/resultats' : pathname

  return (
    <>
      <a href="#main" className="skip-link">
        {t('nav.skip')}
      </a>
      <div className="ambient" aria-hidden="true">
        <div className="grid-lines" />
      </div>
      <SiteHeader />
      <motion.main
        id="main"
        key={key}
        tabIndex={-1}
        className="outline-none"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Outlet />
      </motion.main>
      <SiteFooter />
    </>
  )
}
