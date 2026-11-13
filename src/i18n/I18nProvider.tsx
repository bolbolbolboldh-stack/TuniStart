import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { L10n, Lang } from '../domain/types'
import { dict, type DictKey } from './dictionary'

const LANG_KEY = 'tunistart-lang'
const idx: Record<Lang, 0 | 1 | 2> = { fr: 0, en: 1, ar: 2 }

export interface I18nValue {
  lang: Lang
  dir: 'ltr' | 'rtl'
  setLang: (l: Lang) => void
  /** UI string by key, with optional {placeholders}. */
  t: (key: DictKey, vars?: Record<string, string | number>) => string
  /** Pick the current language from a localized data value. */
  l: (v: L10n | undefined | null) => string
  money: (n: number | null | undefined) => string
  num: (n: number) => string
  date: (d: Date) => string
  locale: string
}

export const I18nContext = createContext<I18nValue | null>(null)

const locales: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB', ar: 'ar-TN-u-nu-latn' }

function readLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY)
    if (v === 'fr' || v === 'en' || v === 'ar') return v
  } catch {
    /* storage unavailable */
  }
  return 'fr'
}

export function translate(lang: Lang, key: DictKey, vars?: Record<string, string | number>) {
  const [section, name] = key.split('.') as [keyof typeof dict, string]
  const entry = (dict[section] as Record<string, readonly [string, string, string]>)[name]
  let s = entry ? entry[idx[lang]] : key
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v))
  return s
}

export function formatMoney(lang: Lang, n: number | null | undefined) {
  const v = typeof n === 'number' && Number.isFinite(n) ? n : 0
  const s = new Intl.NumberFormat(locales[lang], { maximumFractionDigits: 3 }).format(v)
  return lang === 'ar' ? `${s} د.ت` : `${s} TND`
}

export function I18nProvider({ children, initial }: { children: ReactNode; initial?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initial ?? readLang)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(LANG_KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo<I18nValue>(() => {
    const locale = locales[lang]
    const nf = new Intl.NumberFormat(locale)
    const df = new Intl.DateTimeFormat(locale, { dateStyle: 'long' })
    return {
      lang,
      dir,
      setLang,
      locale,
      t: (key, vars) => translate(lang, key, vars),
      l: (v) => (v ? v[lang] || v.fr : ''),
      money: (n) => formatMoney(lang, n),
      num: (n) => nf.format(n),
      date: (d) => df.format(d),
    }
  }, [lang, dir, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
