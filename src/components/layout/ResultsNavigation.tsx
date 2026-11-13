import { NavLink } from 'react-router'
import { useI18n } from '../../hooks/useI18n'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'

export function useResultsTabs() {
  const { t } = useI18n()
  return [
    { to: '/resultats', end: true, label: t('results.overview'), icon: 'dashboard' },
    { to: '/resultats/orientation', label: t('results.orientation'), icon: 'scale' },
    { to: '/resultats/documents', label: t('results.documents'), icon: 'list-checks' },
    { to: '/resultats/parcours', label: t('results.timeline'), icon: 'route' },
    { to: '/resultats/budget', label: t('results.budget'), icon: 'pie-chart' },
    { to: '/resultats/synthese', label: t('results.summary'), icon: 'file-check' },
  ]
}

/** Sidebar on large screens. */
export function ResultsSidebar() {
  const tabs = useResultsTabs()
  const { t } = useI18n()
  return (
    <nav aria-label={t('results.workspace')} className="glass sticky top-24 hidden rounded-[24px] p-2 lg:block">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-[16px] px-3.5 py-3 text-[14.5px] font-medium transition-colors',
              isActive ? 'bg-inverse text-on-inverse shadow-sm' : 'text-ink-2 hover:bg-surface-2',
            )
          }
        >
          <Icon name={tab.icon} size={18} />
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

/** Compact floating bottom navigation on mobile/tablet. */
export function ResultsBottomNav() {
  const tabs = useResultsTabs()
  const { t } = useI18n()
  return (
    <nav
      aria-label={t('results.workspace')}
      className="no-print glass glass-strong fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-[560px] justify-between rounded-[24px] p-1.5 lg:hidden"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            cn(
              'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[18px] px-1 py-2 text-[10.5px] font-medium leading-none transition-colors',
              isActive ? 'bg-inverse text-on-inverse' : 'text-muted',
            )
          }
        >
          <Icon name={tab.icon} size={19} />
          <span className="w-full truncate text-center">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
