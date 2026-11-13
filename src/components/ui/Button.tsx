import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cn } from '../../lib/cn'
import { Icon, type IconName } from './Icon'

type Variant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'glass'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[transform,background-color,box-shadow,opacity,border-color] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 motion-reduce:active:scale-100'
const variants: Record<Variant, string> = {
  primary: 'btn-primary pill hover:opacity-90',
  secondary: 'pill border border-line-strong bg-surface text-ink hover:bg-surface-2',
  tertiary: 'pill text-ink hover:bg-surface-2',
  destructive: 'pill bg-[#b3261e] text-white hover:bg-[#9b1f18] dark:bg-[#f2b8b5] dark:text-[#3b0907] dark:hover:bg-[#eaa19d]',
  glass: 'glass pill text-ink hover:brightness-[1.03]',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13.5px]',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-[16px]',
}

interface Common {
  variant?: Variant
  size?: Size
  icon?: IconName
  iconEnd?: IconName
  children?: ReactNode
  className?: string
}

export const Button = forwardRef<HTMLButtonElement, Common & ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { variant = 'primary', size = 'md', icon, iconEnd, children, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} className={icon.startsWith('arrow') ? 'flip-rtl' : ''} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={size === 'sm' ? 16 : 18} className={iconEnd.startsWith('arrow') ? 'flip-rtl' : ''} />}
    </button>
  )
})

export function ButtonLink({ variant = 'primary', size = 'md', icon, iconEnd, children, className, ...rest }: Common & LinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} className={icon.startsWith('arrow') ? 'flip-rtl' : ''} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={size === 'sm' ? 16 : 18} className={iconEnd.startsWith('arrow') ? 'flip-rtl' : ''} />}
    </Link>
  )
}
