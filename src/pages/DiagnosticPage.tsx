import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { StepActivity, StepBudget, StepDetails, StepLiability, StepLocation, StepParticipants, StepReview, type StepProps } from '../components/diagnostic/Steps'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/Dialog'
import { Icon } from '../components/ui/Icon'
import { ProgressBar } from '../components/ui/ProgressBar'
import { emptyProfile, validateStep, type StepNumber } from '../domain/schemas/project.schema'
import type { ProjectProfile } from '../domain/types'
import type { DictKey } from '../i18n/dictionary'
import { useI18n } from '../hooks/useI18n'
import { useProjectSession } from '../hooks/useProjectSession'
import { cn } from '../lib/cn'

const steps: { title: DictKey; q: DictKey; h: DictKey; C: (p: StepProps) => React.ReactNode }[] = [
  { title: 'wizard.s1', q: 'wizard.s1q', h: 'wizard.s1h', C: StepActivity },
  { title: 'wizard.s2', q: 'wizard.s2q', h: 'wizard.s2h', C: StepParticipants },
  { title: 'wizard.s3', q: 'wizard.s3q', h: 'wizard.s3h', C: StepLiability },
  { title: 'wizard.s4', q: 'wizard.s4q', h: 'wizard.s4h', C: StepBudget },
  { title: 'wizard.s5', q: 'wizard.s5q', h: 'wizard.s5h', C: StepLocation },
  { title: 'wizard.s6', q: 'wizard.s6q', h: 'wizard.s6h', C: StepDetails },
  { title: 'wizard.s7', q: 'wizard.s7q', h: 'wizard.s7h', C: StepReview },
]

export function DiagnosticPage() {
  const { t, dir } = useI18n()
  const { state, dispatch } = useProjectSession()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const step = state.step as StepNumber
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [direction, setDirection] = useState(1)
  const [quit, setQuit] = useState(false)
  const [busy, setBusy] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    headingRef.current?.focus()
  }, [step])

  const patch = (p: Partial<ProjectProfile>) => {
    dispatch({ type: 'patch', patch: p })
    if (Object.keys(errors).length) {
      const keys = Object.keys(p)
      setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => !keys.includes(k))))
    }
  }

  const goTo = (n: number) => {
    setDirection(n > step ? 1 : -1)
    setErrors({})
    dispatch({ type: 'step', step: n })
  }

  const next = () => {
    const e = validateStep(step, state.profile)
    if (Object.keys(e).length) {
      setErrors(e)
      return
    }
    if (step === 7) {
      setBusy(true)
      dispatch({ type: 'complete' })
      setTimeout(() => navigate('/resultats'), reduce ? 0 : 450)
      return
    }
    goTo(step + 1)
  }

  const S = steps[step - 1]
  const hasErrors = Object.keys(errors).length > 0
  const slide = (dir === 'rtl' ? -1 : 1) * direction * 24

  return (
    <div className="container-page max-w-[860px] py-8 sm:py-12">
      {/* Stepper */}
      <div className="glass sticky top-[88px] z-30 mb-8 rounded-[22px] px-4 py-3.5 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13.5px] font-semibold text-ink" aria-live="polite">
            <span className="sm:hidden">{t('wizard.stepShort', { n: step })}</span>
            <span className="hidden sm:inline">{t('wizard.stepOf', { n: step })}</span>
            <span className="text-muted"> · {t(S.title)}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              if (state.completed) navigate('/resultats')
              else if (JSON.stringify(state.profile) === JSON.stringify(emptyProfile())) navigate('/')
              else setQuit(true)
            }}
            className="pill inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <Icon name="x" size={15} />
            <span className="hidden sm:inline">{t('wizard.quit')}</span>
            <span className="sr-only sm:hidden">{t('wizard.quit')}</span>
          </button>
        </div>
        <ol className="mt-3 hidden gap-1.5 sm:flex" aria-label={t('wizard.title')}>
          {steps.map((s, i) => {
            const n = i + 1
            const done = n < step
            return (
              <li key={s.title} className="flex-1">
                <button
                  type="button"
                  disabled={n > step}
                  onClick={() => goTo(n)}
                  aria-current={n === step ? 'step' : undefined}
                  aria-label={`${t('wizard.stepOf', { n })} — ${t(s.title)}`}
                  className={cn(
                    'block h-1.5 w-full rounded-full transition-colors duration-300 disabled:cursor-default',
                    n === step ? 'bg-ink' : done ? 'bg-ink/45 hover:bg-ink/70' : 'bg-surface-3',
                  )}
                />
              </li>
            )
          })}
        </ol>
        <ProgressBar value={step} max={7} label={t('wizard.stepShort', { n: step })} className="mt-3 sm:hidden" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={step}
          initial={reduce ? false : { opacity: 0, x: slide }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? undefined : { opacity: 0, x: -slide }}
          transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          aria-labelledby="wizard-q"
        >
          <h1 id="wizard-q" ref={headingRef} tabIndex={-1} className="text-[28px] font-semibold leading-tight text-ink outline-none sm:text-[36px]">
            {t(S.q)}
          </h1>
          <p className="reading mt-3 text-[16px] leading-relaxed text-muted">{t(S.h)}</p>
          <div className="mt-8">
            <S.C profile={state.profile} patch={patch} errors={errors} goTo={goTo} />
          </div>
        </motion.section>
      </AnimatePresence>

      {hasErrors && (
        <p role="alert" className="mt-6 flex items-center gap-2 text-[14px] font-medium text-ink">
          <Icon name="alert" size={16} />
          {t('wizard.fixErrors')}
        </p>
      )}

      {/* Stable controls */}
      <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
        <Button variant="secondary" icon="arrow-left" onClick={() => goTo(step - 1)} disabled={step === 1}>
          {t('common.previous')}
        </Button>
        {step < 7 ? (
          <Button onClick={next} iconEnd="arrow-right">
            {t('common.next')}
          </Button>
        ) : (
          <Button onClick={next} icon={busy ? 'loader' : 'sparkles'} disabled={busy} className={busy ? '[&_svg]:animate-spin' : ''}>
            {busy ? t('wizard.generating') : t('wizard.generate')}
          </Button>
        )}
      </div>
      <p className="mt-6 flex items-center gap-2 text-[12.5px] text-faint">
        <Icon name="shield" size={14} />
        {t('wizard.privacy')}
      </p>

      <ConfirmDialog
        open={quit}
        onOpenChange={setQuit}
        title={t('wizard.quitConfirmTitle')}
        description={t('wizard.quitConfirmText')}
        confirmLabel={t('wizard.quitConfirm')}
        onConfirm={() => {
          dispatch({ type: 'clear' })
          navigate('/')
        }}
      />
    </div>
  )
}
