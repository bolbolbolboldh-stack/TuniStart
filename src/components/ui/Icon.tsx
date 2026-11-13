import {
  ArrowLeft, ArrowRight, Banknote, BookOpen, Briefcase, Building2, Check, CheckCircle2, ChevronDown, Circle,
  CircleAlert, CircleHelp, ClipboardList, Compass, Download, ExternalLink, Factory, FileCheck2, FileText, Filter,
  Hammer, HandCoins, Info, Landmark, Languages, Laptop, Layers, LayoutDashboard, Library, ListChecks, LoaderCircle,
  MapPin, Menu, Minus, Monitor, Moon, PieChart, Plus, Printer, Receipt, RotateCcw, Route, Scale, Search, ShieldCheck,
  Sparkles, Store, Sun, Target, Trash2, UserCheck, Users, UtensilsCrossed, Wallet, X, type LucideProps,
} from 'lucide-react'

/**
 * TuniStart icon pack — one restrained stroke family (Lucide, 1.6px) behind a
 * single semantic name map, so the whole product speaks one visual language.
 */
const map = {
  'arrow-left': ArrowLeft, 'arrow-right': ArrowRight, banknote: Banknote, book: BookOpen, briefcase: Briefcase,
  building: Building2, check: Check, 'check-circle': CheckCircle2, 'chevron-down': ChevronDown, circle: Circle,
  alert: CircleAlert, help: CircleHelp, clipboard: ClipboardList, compass: Compass, download: Download,
  external: ExternalLink, factory: Factory, 'file-check': FileCheck2, file: FileText, filter: Filter, hammer: Hammer,
  coins: HandCoins, info: Info, landmark: Landmark, languages: Languages, laptop: Laptop, layers: Layers,
  dashboard: LayoutDashboard, library: Library, 'list-checks': ListChecks, loader: LoaderCircle, 'map-pin': MapPin,
  menu: Menu, minus: Minus, monitor: Monitor, moon: Moon, 'pie-chart': PieChart, plus: Plus, printer: Printer,
  receipt: Receipt, reset: RotateCcw, route: Route, scale: Scale, search: Search, shield: ShieldCheck,
  sparkles: Sparkles, store: Store, sun: Sun, target: Target, trash: Trash2, 'user-check': UserCheck, users: Users,
  utensils: UtensilsCrossed, wallet: Wallet, x: X,
} as const

export type IconName = keyof typeof map

export function Icon({ name, size = 18, strokeWidth = 1.6, ...rest }: { name: IconName | string } & LucideProps) {
  const C = map[name as IconName] ?? Circle
  return <C size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" {...rest} />
}

/** An icon set in a small liquid-glass tile. */
export function IconTile({ name, size = 'md', inverted = false }: { name: IconName | string; size?: 'sm' | 'md' | 'lg'; inverted?: boolean }) {
  const dims = size === 'sm' ? 'h-9 w-9 rounded-[11px]' : size === 'lg' ? 'h-14 w-14 rounded-[18px]' : 'h-11 w-11 rounded-[14px]'
  const icon = size === 'sm' ? 16 : size === 'lg' ? 24 : 20
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center ${dims} ${
        inverted ? 'btn-primary' : 'glass text-ink'
      }`}
    >
      <Icon name={name} size={icon} />
    </span>
  )
}
