import * as DM from '@radix-ui/react-dropdown-menu'
import type { Lang } from '../../domain/types'
import { useI18n } from '../../hooks/useI18n'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../lib/cn'
import { Flag } from '../brand/Flags'
import { Icon } from '../ui/Icon'
import type { ThemeChoice } from '../../app/providers/ThemeProvider'

const langs: { id: Lang; native: string; code: string }[] = [
  { id: 'fr', native: 'Français', code: 'FR' },
  { id: 'ar', native: 'العربية', code: 'ع' },
  { id: 'en', native: 'English', code: 'EN' },
]

export function LanguageSwitcher({ full = false }: { full?: boolean }) {
  const { lang, setLang, t } = useI18n()
  const current = langs.find((l) => l.id === lang)!
  if (full) {
    return (
      <div role="radiogroup" aria-label={t('nav.language')} className="grid grid-cols-3 gap-2">
        {langs.map((l) => (
          <button
            key={l.id}
            role="radio"
            aria-checked={lang === l.id}
            onClick={() => setLang(l.id)}
            className={cn(
              'flex h-12 items-center justify-center gap-2 rounded-[14px] border text-[14px] font-medium transition-colors',
              lang === l.id ? 'border-ink bg-surface text-ink' : 'border-line text-muted hover:text-ink',
            )}
          >
            <Flag lang={l.id} size={20} />
            <span lang={l.id}>{l.native}</span>
          </button>
        ))}
      </div>
    )
  }
  return (
    <DM.Root modal={false}>
      <DM.Trigger
        aria-label={`${t('nav.language')} : ${current.native}`}
        className="glass pill inline-flex h-10 items-center gap-2 ps-3 pe-2.5 text-[13px] font-semibold text-ink transition-[filter] hover:brightness-[1.04]"
      >
        <Flag lang={lang} size={20} />
        <span>{current.code}</span>
        <Icon name="chevron-down" size={14} className="text-muted" />
      </DM.Trigger>
      <DM.Portal>
        <DM.Content
          align="end"
          sideOffset={10}
          className="glass glass-strong z-[70] min-w-[200px] rounded-[18px] p-1.5"
        >
          <DM.Label className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-faint">{t('nav.language')}</DM.Label>
          <DM.RadioGroup value={lang} onValueChange={(v) => setLang(v as Lang)}>
            {langs.map((l) => (
              <DM.RadioItem
                key={l.id}
                value={l.id}
                className="flex cursor-pointer items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14.5px] text-ink outline-none data-[highlighted]:bg-surface-2"
              >
                <Flag lang={l.id} size={22} />
                <span lang={l.id} className="flex-1">
                  {l.native}
                </span>
                <DM.ItemIndicator>
                  <Icon name="check" size={16} />
                </DM.ItemIndicator>
              </DM.RadioItem>
            ))}
          </DM.RadioGroup>
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  )
}

export function ThemeSwitcher({ full = false }: { full?: boolean }) {
  const { theme, setTheme } = useTheme()
  const { t } = useI18n()
  const opts: { id: ThemeChoice; icon: string; label: string }[] = [
    { id: 'light', icon: 'sun', label: t('nav.light') },
    { id: 'dark', icon: 'moon', label: t('nav.dark') },
    { id: 'system', icon: 'monitor', label: t('nav.system') },
  ]
  return (
    <div role="radiogroup" aria-label={t('nav.theme')} className={cn(full ? 'grid grid-cols-3 gap-2' : 'glass pill inline-flex h-10 items-center gap-0.5 p-1')}>
      {opts.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={theme === o.id}
          aria-label={o.label}
          title={o.label}
          onClick={() => setTheme(o.id)}
          className={cn(
            'inline-flex items-center justify-center gap-2 transition-all duration-200',
            full
              ? cn('h-12 rounded-[14px] border text-[14px] font-medium', theme === o.id ? 'border-ink bg-surface text-ink' : 'border-line text-muted hover:text-ink')
              : cn('h-8 w-8 rounded-full', theme === o.id ? 'bg-inverse text-on-inverse shadow-sm' : 'text-muted hover:text-ink'),
          )}
        >
          <Icon name={o.icon} size={full ? 17 : 15} />
          {full && o.label}
        </button>
      ))}
    </div>
  )
}
