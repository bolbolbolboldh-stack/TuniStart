import type { ReactNode } from 'react'
import { Icon, IconTile, type IconName } from './Icon'

export function EmptyState({ icon = 'compass', title, text, actions }: { icon?: IconName; title: string; text: string; actions?: ReactNode }) {
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-center rounded-[28px] px-6 py-12 text-center">
      <IconTile name={icon} size="lg" />
      <h2 className="mt-5 text-[22px] font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">{text}</p>
      {actions && <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  )
}

export function ErrorState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-[18px] border border-line-strong bg-surface p-4">
      <Icon name="alert" size={20} className="mt-0.5 shrink-0 text-ink" />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{title}</p>
        {text && <p className="mt-1 text-[14px] text-muted">{text}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}

export function Notice({ children, icon = 'info' }: { children: ReactNode; icon?: IconName }) {
  return (
    <div className="flex items-start gap-3 rounded-[18px] border border-dashed border-line-strong px-4 py-3.5 text-[14px] leading-relaxed text-ink-2">
      <Icon name={icon} size={18} className="mt-0.5 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  )
}
