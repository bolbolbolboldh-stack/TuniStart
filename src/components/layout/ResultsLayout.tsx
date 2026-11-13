import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { getActivity } from '../../data/activities'
import { getGovernorate } from '../../data/governorates'
import { useI18n } from '../../hooks/useI18n'
import { useProjectSession } from '../../hooks/useProjectSession'
import { Button, ButtonLink } from '../ui/Button'
import { ConfirmDialog } from '../ui/Dialog'
import { Chip } from '../ui/StatusBadge'
import { EmptyState } from '../ui/States'
import { useToast } from '../ui/Toast'
import { ResultsBottomNav, ResultsSidebar } from './ResultsNavigation'

export function ResultsLayout() {
  const { t, l, lang } = useI18n()
  const { state, dispatch } = useProjectSession()
  const [confirm, setConfirm] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  if (!state.completed) {
    return (
      <div className="container-page py-16 sm:py-24">
        <EmptyState
          icon="dashboard"
          title={t('results.emptyTitle')}
          text={t('results.emptyText')}
          actions={
            <>
              <ButtonLink to="/diagnostic" iconEnd="arrow-right">
                {t('nav.start')}
              </ButtonLink>
              <Button
                variant="secondary"
                icon="sparkles"
                onClick={() => {
                  dispatch({ type: 'load-sample', lang })
                  toast(t('toast.sampleLoaded'))
                }}
              >
                {t('results.loadSample')}
              </Button>
            </>
          }
        />
      </div>
    )
  }

  const p = state.profile
  const activity = getActivity(p.activity)
  const gov = getGovernorate(p.governorate)

  return (
    <div className="container-page pb-32 pt-8 lg:pb-12">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-faint">{t('results.workspace')}</p>
            {p.isSample && (
              <Chip icon="book" tone="outline">
                {t('common.sample')}
              </Chip>
            )}
          </div>
          <h1 className="mt-2 break-words text-[30px] font-semibold leading-tight text-ink sm:text-[38px]">{p.projectName || t('results.myProject')}</h1>
          <p className="mt-1.5 text-[15px] text-muted">
            {[l(activity?.label), gov ? l(gov.name) : null].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon="clipboard"
            onClick={() => {
              dispatch({ type: 'step', step: 7 })
              navigate('/diagnostic')
            }}
          >
            {t('results.editAnswers')}
          </Button>
          <Button variant="tertiary" size="sm" icon="reset" onClick={() => setConfirm(true)}>
            {t('results.restart')}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[232px_minmax(0,1fr)]">
        <aside className="no-print">
          <ResultsSidebar />
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
      <ResultsBottomNav />

      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={t('results.restartTitle')}
        description={t('results.restartText')}
        confirmLabel={t('results.clearData')}
        onConfirm={() => {
          dispatch({ type: 'clear' })
          toast(t('toast.cleared'))
          navigate('/')
        }}
      />
    </div>
  )
}
