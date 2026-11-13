import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { Icon } from './Icon'

interface ToastItem {
  id: number
  text: string
  tone: 'success' | 'info' | 'error'
}
const Ctx = createContext<(text: string, tone?: ToastItem['tone']) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const push = useCallback((text: string, tone: ToastItem['tone'] = 'success') => {
    const id = Date.now() + Math.random()
    setItems((s) => [...s.slice(-2), { id, text, tone }])
    setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 3200)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[100] flex flex-col items-center gap-2 px-4 max-lg:bottom-24">
        {items.map((i) => (
          <div key={i.id} className="glass glass-strong pill flex items-center gap-2.5 px-4 py-2.5 text-[14px] font-medium text-ink animate-[toastIn_.3s_cubic-bezier(.2,.8,.2,1)]">
            <Icon name={i.tone === 'error' ? 'alert' : i.tone === 'info' ? 'info' : 'check-circle'} size={17} />
            {i.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
