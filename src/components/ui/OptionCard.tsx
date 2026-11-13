import { cn } from '../../lib/cn'
import { Icon, IconTile, type IconName } from './Icon'

/** Selectable card used as a radio option (role=radio inside a radiogroup). */
export function OptionCard({
  selected,
  onSelect,
  title,
  text,
  icon,
  compact,
  id,
}: {
  selected: boolean
  onSelect: () => void
  title: string
  text?: string
  icon?: IconName | string
  compact?: boolean
  id?: string
}) {
  return (
    <button
      type="button"
      role="radio"
      id={id}
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'lift group relative flex w-full items-start gap-3.5 rounded-[20px] border p-4 text-start',
        selected ? 'border-ink bg-surface shadow-[0_0_0_1px_var(--ink),var(--card-shadow)]' : 'border-line bg-surface/70 hover:bg-surface',
        compact && 'items-center p-3.5',
      )}
    >
      {icon && <IconTile name={icon} size={compact ? 'sm' : 'md'} inverted={selected} />}
      <span className="min-w-0 flex-1">
        <span className="block text-[15.5px] font-semibold text-ink">{title}</span>
        {text && <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{text}</span>}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full border transition-colors',
          selected ? 'border-ink bg-ink text-on-inverse' : 'border-line-strong',
        )}
      >
        {selected && <Icon name="check" size={13} strokeWidth={2.5} />}
      </span>
    </button>
  )
}
