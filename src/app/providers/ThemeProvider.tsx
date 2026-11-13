import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'

export type ThemeChoice = 'light' | 'dark' | 'system'
const KEY = 'tunistart-theme'

export interface ThemeValue {
  theme: ThemeChoice
  resolved: 'light' | 'dark'
  setTheme: (t: ThemeChoice) => void
}

export const ThemeContext = createContext<ThemeValue | null>(null)

const read = (): ThemeChoice => {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark' || v === 'system') return v
  } catch {
    /* ignore */
  }
  return 'system'
}
const systemDark = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>(read)
  const [sys, setSys] = useState<boolean>(systemDark)

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const fn = () => setSys(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  const resolved: 'light' | 'dark' = theme === 'system' ? (sys ? 'dark' : 'light') : theme

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-transition')
    root.classList.toggle('dark', resolved === 'dark')
    root.style.colorScheme = resolved
    const id = window.setTimeout(() => root.classList.remove('theme-transition'), 350)
    return () => window.clearTimeout(id)
  }, [resolved])

  const setTheme = useCallback((t: ThemeChoice) => {
    setThemeState(t)
    try {
      localStorage.setItem(KEY, t)
    } catch {
      /* ignore */
    }
  }, [])

  return <ThemeContext.Provider value={{ theme, resolved, setTheme }}>{children}</ThemeContext.Provider>
}
