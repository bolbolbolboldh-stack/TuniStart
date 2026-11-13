import { activities, getActivity, sectorLabels } from '../../data/activities'
import { getGovernorate, governorates } from '../../data/governorates'
import type { ProjectProfile } from '../../domain/types'
import { useI18n } from '../../hooks/useI18n'
import { cn } from '../../lib/cn'
import type { DictKey } from '../../i18n/dictionary'
import { MoneyField, SelectField, TextArea, TextField } from '../ui/Field'
import { HelpTip } from '../ui/HelpTip'
import { Icon } from '../ui/Icon'
import { OptionCard } from '../ui/OptionCard'
import { Notice } from '../ui/States'

export interface StepProps {
  profile: ProjectProfile
  patch: (p: Partial<ProjectProfile>) => void
  errors: Record<string, string>
  goTo?: (n: number) => void
}

function useErr(errors: Record<string, string>) {
  const { t } = useI18n()
  return (k: string) => (errors[k] ? t(errors[k] as DictKey) : undefined)
}

function GroupError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p role="alert" className="mt-3 flex items-center gap-1.5 text-[14px] font-medium text-ink">
      <Icon name="alert" size={15} />
      {msg}
    </p>
  )
}

export function StepActivity({ profile, patch, errors }: StepProps) {
  const { t, l } = useI18n()
  const err = useErr(errors)
  const selected = getActivity(profile.activity)
  return (
    <div>
      <div role="radiogroup" aria-label={t('wizard.s1q')} aria-invalid={!!errors.activity} className="grid gap-3 sm:grid-cols-2">
        {activities.map((a) => (
          <OptionCard
            key={a.id}
            selected={profile.activity === a.id}
            onSelect={() => patch({ activity: a.id })}
            title={l(a.label)}
            text={l(a.description)}
            icon={a.icon}
          />
        ))}
      </div>
      <GroupError msg={err('activity')} />
      {selected && (
        <div className="mt-6 space-y-4">
          <p className="text-[13px] text-muted">
            <Icon name="layers" size={14} className="me-1 inline align-[-2px]" />
            {l(sectorLabels[selected.sector])}
          </p>
          {selected.mayNeedSectorPermit && <Notice icon="alert">{t('wizard.sectorFlag')} — {l(selected.permitNote)}</Notice>}
          <TextField
            label={t('wizard.s1detail')}
            optional
            placeholder={t('wizard.s1detailPh')}
            value={profile.activityDetail}
            maxLength={200}
            onChange={(e) => patch({ activityDetail: e.target.value })}
            error={err('activityDetail')}
          />
        </div>
      )}
    </div>
  )
}

export function StepParticipants({ profile, patch, errors }: StepProps) {
  const { t } = useI18n()
  const err = useErr(errors)
  const opts = [
    { id: 'one' as const, title: t('wizard.one'), text: t('wizard.oneT'), icon: 'user-check' },
    { id: 'two' as const, title: t('wizard.two'), text: t('wizard.twoT'), icon: 'users' },
    { id: 'three-plus' as const, title: t('wizard.threePlus'), text: t('wizard.threePlusT'), icon: 'building' },
  ]
  return (
    <div>
      <div role="radiogroup" aria-label={t('wizard.s2q')} className="grid gap-3">
        {opts.map((o) => (
          <OptionCard
            key={o.id}
            selected={profile.participants === o.id}
            onSelect={() => patch({ participants: o.id, participantsCount: o.id === 'three-plus' ? profile.participantsCount : null })}
            title={o.title}
            text={o.text}
            icon={o.icon}
          />
        ))}
      </div>
      <GroupError msg={err('participants')} />
      {profile.participants === 'three-plus' && (
        <div className="mt-5 max-w-xs">
          <MoneyField
            label={t('wizard.exactCount')}
            optional
            integer
            suffix=""
            value={profile.participantsCount}
            onValue={(v) => patch({ participantsCount: v })}
            error={err('participantsCount')}
          />
        </div>
      )}
    </div>
  )
}

export function StepLiability({ profile, patch, errors }: StepProps) {
  const { t } = useI18n()
  const err = useErr(errors)
  const opts = [
    { id: 'yes' as const, title: t('common.yes'), text: t('wizard.yesT'), icon: 'shield' },
    { id: 'no' as const, title: t('common.no'), text: t('wizard.noT'), icon: 'minus' },
    { id: 'unsure' as const, title: t('wizard.unsure'), text: t('wizard.unsureT'), icon: 'help' },
  ]
  return (
    <div>
      <div role="radiogroup" aria-label={t('wizard.s3q')} className="grid gap-3">
        {opts.map((o) => (
          <OptionCard key={o.id} selected={profile.liability === o.id} onSelect={() => patch({ liability: o.id })} title={o.title} text={o.text} icon={o.icon} />
        ))}
      </div>
      <GroupError msg={err('liability')} />
      <div className="mt-5 flex items-center gap-1 text-[13.5px] text-muted">
        <span>{t('common.whatIs')}…</span>
        <HelpTip term="responsabilite-limitee" />
        <HelpTip term="personnalite-morale" />
      </div>
    </div>
  )
}

export function StepBudget({ profile, patch, errors }: StepProps) {
  const { t, money } = useI18n()
  const err = useErr(errors)
  const shortcuts = [5000, 10000, 25000, 50000, 100000]
  return (
    <div className="max-w-lg">
      <MoneyField label={t('wizard.budgetLabel')} value={profile.budget} onValue={(v) => patch({ budget: v })} error={err('budget')} suffix={t('common.tnd')} />
      <p className="mb-2 mt-6 text-[13px] font-medium text-muted">{t('wizard.shortcuts')}</p>
      <div className="flex flex-wrap gap-2">
        {shortcuts.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => patch({ budget: s })}
            aria-pressed={profile.budget === s}
            className={cn(
              'pill h-10 border px-4 text-[14px] font-medium tabular-nums transition-colors',
              profile.budget === s ? 'border-ink bg-inverse text-on-inverse' : 'border-line-strong bg-surface text-ink hover:bg-surface-2',
            )}
          >
            {money(s)}
          </button>
        ))}
      </div>
    </div>
  )
}

export function StepLocation({ profile, patch, errors }: StepProps) {
  const { t, l } = useI18n()
  const err = useErr(errors)
  return (
    <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
      <SelectField label={t('wizard.governorate')} value={profile.governorate} onChange={(e) => patch({ governorate: e.target.value })} error={err('governorate')}>
        <option value="">{t('wizard.chooseGov')}</option>
        {governorates.map((g) => (
          <option key={g.id} value={g.id}>
            {l(g.name)}
          </option>
        ))}
      </SelectField>
      <TextField
        label={t('wizard.delegation')}
        optional
        value={profile.delegation}
        maxLength={120}
        onChange={(e) => patch({ delegation: e.target.value })}
        error={err('delegation')}
      />
    </div>
  )
}

export function StepDetails({ profile, patch, errors }: StepProps) {
  const { t } = useI18n()
  const err = useErr(errors)
  const empOpts = [0, 1, 2]
  const exact = profile.employees !== null && (profile.employees > 2 || Number.isNaN(profile.employees))
  const activity = getActivity(profile.activity)
  return (
    <div className="grid max-w-2xl gap-6">
      <TextField label={t('wizard.projectName')} optional hint={t('wizard.projectNameHint')} value={profile.projectName} maxLength={120} onChange={(e) => patch({ projectName: e.target.value })} error={err('projectName')} />
      <TextArea label={t('wizard.description')} optional value={profile.activityDescription} maxLength={600} onChange={(e) => patch({ activityDescription: e.target.value })} error={err('activityDescription')} />
      <fieldset>
        <legend className="mb-2 text-[14px] font-medium text-ink">
          {t('wizard.employees')} <span className="font-normal text-faint">({t('common.required')})</span>
        </legend>
        <div role="radiogroup" aria-label={t('wizard.employees')} className="flex flex-wrap gap-2">
          {empOpts.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={profile.employees === n}
              onClick={() => patch({ employees: n })}
              className={cn(
                'pill h-11 min-w-14 border px-5 text-[15px] font-medium transition-colors',
                profile.employees === n ? 'border-ink bg-inverse text-on-inverse' : 'border-line-strong bg-surface text-ink hover:bg-surface-2',
              )}
            >
              {n === 2 ? '2' : n}
            </button>
          ))}
          <button
            type="button"
            role="radio"
            aria-checked={exact}
            onClick={() => patch({ employees: 3 })}
            className={cn(
              'pill h-11 border px-5 text-[15px] font-medium transition-colors',
              exact ? 'border-ink bg-inverse text-on-inverse' : 'border-line-strong bg-surface text-ink hover:bg-surface-2',
            )}
          >
            3+
          </button>
        </div>
        {exact && (
          <div className="mt-4 max-w-xs">
            <MoneyField label={t('wizard.exact')} integer suffix="" value={profile.employees} onValue={(v) => patch({ employees: v })} error={err('employees')} />
          </div>
        )}
        {!exact && err('employees') && <GroupError msg={err('employees')} />}
      </fieldset>
      <MoneyField
        label={t('wizard.capital')}
        optional
        hint={t('wizard.capitalHint')}
        value={profile.plannedCapital}
        onValue={(v) => patch({ plannedCapital: v })}
        error={err('plannedCapital')}
        suffix={t('common.tnd')}
        labelExtra={<HelpTip term="capital-social" />}
      />
      <TextArea label={t('wizard.notes')} optional value={profile.notes} maxLength={1000} onChange={(e) => patch({ notes: e.target.value })} error={err('notes')} />
      {activity?.mayNeedSectorPermit && <Notice icon="alert">{t('wizard.sectorFlag')}</Notice>}
    </div>
  )
}

export function StepReview({ profile, goTo, errors }: StepProps) {
  const { t, l, money, num } = useI18n()
  const activity = getActivity(profile.activity)
  const gov = getGovernorate(profile.governorate)
  const np = t('wizard.notProvided')
  const participants =
    profile.participants === 'one'
      ? t('wizard.one')
      : profile.participants === 'two'
        ? t('wizard.two')
        : profile.participants === 'three-plus'
          ? profile.participantsCount
            ? t('results.personsN', { n: num(profile.participantsCount) })
            : t('wizard.threePlus')
          : np
  const liability = profile.liability === 'yes' ? t('common.yes') : profile.liability === 'no' ? t('common.no') : profile.liability === 'unsure' ? t('wizard.unsure') : np
  const rows: { step: number; label: string; value: string; err?: boolean }[] = [
    { step: 1, label: t('wizard.s1'), value: activity ? `${l(activity.label)}${profile.activityDetail ? ` — ${profile.activityDetail}` : ''}` : np, err: !!errors.activity },
    { step: 2, label: t('wizard.s2'), value: participants, err: !!errors.participants || !!errors.participantsCount },
    { step: 3, label: t('wizard.s3'), value: liability, err: !!errors.liability },
    { step: 4, label: t('wizard.s4'), value: profile.budget !== null && !Number.isNaN(profile.budget) ? money(profile.budget) : np, err: !!errors.budget },
    { step: 5, label: t('wizard.s5'), value: gov ? `${l(gov.name)}${profile.delegation ? ` — ${profile.delegation}` : ''}` : np, err: !!errors.governorate },
    { step: 6, label: t('wizard.projectName'), value: profile.projectName || np },
    { step: 6, label: t('wizard.employees'), value: profile.employees !== null && !Number.isNaN(profile.employees) ? num(profile.employees) : np, err: !!errors.employees },
    { step: 6, label: t('wizard.capital'), value: profile.plannedCapital !== null && !Number.isNaN(profile.plannedCapital) ? money(profile.plannedCapital) : np },
  ]
  return (
    <div className="space-y-6">
      <dl className="card divide-y divide-[var(--line)] overflow-hidden rounded-[22px]">
        {rows.map((r, i) => (
          <div key={i} className="flex items-start gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <dt className="text-[13px] font-medium text-muted">{r.label}</dt>
              <dd className={cn('mt-0.5 break-words text-[15.5px] font-medium', r.err ? 'text-ink underline decoration-dashed underline-offset-4' : 'text-ink')}>
                {r.err && <Icon name="alert" size={15} className="me-1.5 inline align-[-2px]" />}
                {r.value}
              </dd>
            </div>
            <button type="button" onClick={() => goTo?.(r.step)} className="pill shrink-0 px-3 py-1.5 text-[13.5px] font-semibold text-ink underline-offset-4 hover:bg-surface-2">
              {t('common.edit')}
              <span className="sr-only"> : {r.label}</span>
            </button>
          </div>
        ))}
      </dl>
      <Notice icon="shield">{t('common.orientationWarning')}</Notice>
    </div>
  )
}
