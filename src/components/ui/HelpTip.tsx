import * as Popover from '@radix-ui/react-popover'
import { glossary } from '../../data/glossary'
import { useI18n } from '../../hooks/useI18n'
import { Icon } from './Icon'

/** Context-sensitive "?" help popover bound to a glossary entry. */
export function HelpTip({ term }: { term: string }) {
  const { l, t } = useI18n()
  const entry = glossary.find((g) => g.id === term)
  if (!entry) return null
  return (
    <Popover.Root>
      <Popover.Trigger
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink align-middle"
        aria-label={`${t('common.help')} : ${l(entry.term)}`}
      >
        <Icon name="help" size={15} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          collisionPadding={12}
          className="glass glass-strong z-[70] w-[min(86vw,300px)] rounded-[18px] p-4 text-[14px] leading-relaxed"
        >
          <p className="font-semibold text-ink">{l(entry.term)}</p>
          <p className="mt-1 text-muted">{l(entry.definition)}</p>
          <Popover.Arrow className="fill-[var(--glass-bg-strong)]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
