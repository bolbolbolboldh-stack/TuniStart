import { useId, useRef, useState, useEffect, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { useI18n } from '../../hooks/useI18n'
import { parseAmount } from '../../domain/schemas/project.schema'
import { Icon } from './Icon'

const control =
  'w-full rounded-[14px] border bg-surface px-4 text-[16px] text-ink placeholder:text-faint transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-ink focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ink)_10%,transparent)]'

export function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  children,
  labelExtra,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  optional?: boolean
  children: ReactNode
  labelExtra?: ReactNode
}) {
  const { t } = useI18n()
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-1">
        <label htmlFor={id} className="text-[14px] font-medium text-ink">
          {label}
          {optional && <span className="ms-1.5 font-normal text-faint">({t('common.optional')})</span>}
        </label>
        {labelExtra}
      </div>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-ink">
          <Icon name="alert" size={14} />
          {error}
        </p>
      )}
    </div>
  )
}

export function TextField({ label, hint, error, optional, labelExtra, className, ...rest }: { label: string; hint?: string; error?: string; optional?: boolean; labelExtra?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} labelExtra={labelExtra}>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, 'h-12', error ? 'border-ink' : 'border-line-strong', className)}
        {...rest}
      />
    </FieldShell>
  )
}

export function TextArea({ label, hint, error, optional, ...rest }: { label: string; hint?: string; error?: string; optional?: boolean } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        rows={3}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, 'min-h-[96px] resize-y py-3', error ? 'border-ink' : 'border-line-strong')}
        {...rest}
      />
    </FieldShell>
  )
}

export function SelectField({ label, hint, error, optional, children, ...rest }: { label: string; hint?: string; error?: string; optional?: boolean; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(control, 'h-12 appearance-none pe-11', error ? 'border-ink' : 'border-line-strong')}
          {...rest}
        >
          {children}
        </select>
        <Icon name="chevron-down" size={18} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-muted" />
      </div>
    </FieldShell>
  )
}

/**
 * Money input: free typing ("25 000", "25000,5"), parsed on change.
 * Reports `null` for empty and `NaN` for malformed input so validation can explain.
 */
export function MoneyField({
  label,
  hint,
  error,
  optional,
  value,
  onValue,
  suffix = 'TND',
  integer = false,
  labelExtra,
  inputClassName,
  ariaLabel,
}: {
  label: string
  hint?: string
  error?: string
  optional?: boolean
  value: number | null
  onValue: (v: number | null) => void
  suffix?: string
  integer?: boolean
  labelExtra?: ReactNode
  inputClassName?: string
  ariaLabel?: string
}) {
  const id = useId()
  const [raw, setRaw] = useState(value === null || Number.isNaN(value) ? '' : String(value))
  const emitted = useRef<number | null | undefined>(undefined)
  useEffect(() => {
    // Only resync when the value changed from outside (e.g. sample loaded, shortcut chip).
    if (Object.is(value, emitted.current)) return
    setRaw(value === null || Number.isNaN(value) ? '' : String(value))
  }, [value])
  const emit = (v: number | null) => {
    emitted.current = v
    onValue(v)
  }
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} labelExtra={labelExtra}>
      <div className="relative">
        <input
          id={id}
          inputMode={integer ? 'numeric' : 'decimal'}
          autoComplete="off"
          aria-label={ariaLabel}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(control, 'h-12 pe-16 tabular-nums', error ? 'border-ink' : 'border-line-strong', inputClassName)}
          value={raw}
          dir="ltr"
          onChange={(e) => {
            const v = e.target.value
            setRaw(v)
            const p = parseAmount(v)
            if (integer && p !== null && !Number.isNaN(p) && !Number.isInteger(p)) emit(Number.NaN)
            else emit(p)
          }}
        />
        {suffix && <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-[13px] font-medium text-muted">{suffix}</span>}
      </div>
    </FieldShell>
  )
}
