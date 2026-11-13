import * as RD from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { useI18n } from '../../hooks/useI18n'
import { Button } from './Button'

/** Accessible confirmation dialog (focus trap + return focus via Radix). */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  destructive = true,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  destructive?: boolean
}) {
  const { t } = useI18n()
  return (
    <RD.Root open={open} onOpenChange={onOpenChange}>
      <RD.Portal>
        <RD.Overlay className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-[2px] data-[state=open]:animate-[fade_.2s_ease]" />
        <RD.Content className="glass glass-strong fixed left-1/2 top-1/2 z-[90] w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-[26px] p-6 data-[state=open]:animate-[pop_.25s_cubic-bezier(.2,.8,.2,1)] focus:outline-none">
          <RD.Title className="text-[19px] font-semibold text-ink">{title}</RD.Title>
          <RD.Description className="mt-2 text-[15px] leading-relaxed text-muted">{description}</RD.Description>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <RD.Close asChild>
              <Button variant="secondary">{t('common.cancel')}</Button>
            </RD.Close>
            <Button
              variant={destructive ? 'destructive' : 'primary'}
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </RD.Content>
      </RD.Portal>
    </RD.Root>
  )
}

export function Sheet({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; children: ReactNode }) {
  return (
    <RD.Root open={open} onOpenChange={onOpenChange}>
      <RD.Portal>
        <RD.Overlay className="fixed inset-0 z-[80] bg-black/25 backdrop-blur-[2px] data-[state=open]:animate-[fade_.2s_ease]" />
        <RD.Content className="glass glass-strong fixed inset-x-3 top-3 z-[90] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[26px] p-5 data-[state=open]:animate-[drop_.3s_cubic-bezier(.2,.8,.2,1)] focus:outline-none">
          <RD.Title className="sr-only">{title}</RD.Title>
          <RD.Description className="sr-only">{title}</RD.Description>
          {children}
        </RD.Content>
      </RD.Portal>
    </RD.Root>
  )
}

export const DialogClose = RD.Close
