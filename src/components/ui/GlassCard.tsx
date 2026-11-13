import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export function GlassCard({ className, strong, ...rest }: HTMLAttributes<HTMLDivElement> & { strong?: boolean }) {
  return <div className={cn('glass rounded-[22px]', strong && 'glass-strong', className)} {...rest} />
}

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('card rounded-[22px]', className)} {...rest} />
}
