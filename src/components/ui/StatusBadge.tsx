import type { ReactNode } from 'react'
import { useI18n } from '../../hooks/useI18n'
import { cn } from '../../lib/cn'
import type { ReviewStatus } from '../../domain/types'
import { Icon, type IconName } from './Icon'

type Tone = 'solid' | 'outline' | 'soft' | 'dashed'

export function Chip({ children, icon, tone = 'soft', className }: { children: ReactNode; icon?: IconName | string; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none whitespace-nowrap',
        tone === 'solid' && 'bg-inverse text-on-inverse',
        tone === 'outline' && 'border border-line-strong text-ink',
        tone === 'soft' && 'bg-surface-2 text-ink-2',
        tone === 'dashed' && 'border border-dashed border-line-strong text-muted',
        className,
      )}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  )
}

/** Review status of a content item — text + icon, never colour alone. */
export function ReviewChip({ status }: { status: ReviewStatus }) {
  const { t } = useI18n()
  const m: Record<ReviewStatus, { label: string; icon: IconName; tone: Tone }> = {
    verified: { label: t('common.verified'), icon: 'check-circle', tone: 'solid' },
    'report-derived-needs-review': { label: t('common.toVerify'), icon: 'alert', tone: 'dashed' },
    'pedagogical-example': { label: t('common.pedagogical'), icon: 'book', tone: 'outline' },
    unverified: { label: t('common.unverified'), icon: 'help', tone: 'dashed' },
  }
  const v = m[status]
  return (
    <Chip icon={v.icon} tone={v.tone}>
      {v.label}
    </Chip>
  )
}
