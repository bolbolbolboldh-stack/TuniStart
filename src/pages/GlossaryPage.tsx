import { useMemo, useState } from 'react'
import { Icon } from '../components/ui/Icon'
import { PageHeader } from '../components/ui/Reveal'
import { Chip } from '../components/ui/StatusBadge'
import { glossary } from '../data/glossary'
import { useI18n } from '../hooks/useI18n'

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u064B-\u065F]/g, '')
    .toLowerCase()

export function GlossaryPage() {
  const { t, l, lang } = useI18n()
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const nq = norm(q.trim())
    return glossary
      .filter((g) => !nq || [g.term.fr, g.term.en, g.term.ar, g.definition[lang]].some((x) => norm(x).includes(nq)))
      .sort((a, b) => l(a.term).localeCompare(l(b.term), lang))
  }, [q, lang, l])

  return (
    <div className="container-page max-w-[960px] py-10 sm:py-14">
      <PageHeader eyebrow={t('nav.glossary')} title={t('glossary.title')} lead={t('glossary.lead')} />
      <div className="glass sticky top-[88px] z-20 rounded-[20px] p-2">
        <label className="relative block">
          <span className="sr-only">{t('glossary.search')}</span>
          <Icon name="search" size={18} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('glossary.search')}
            className="h-12 w-full rounded-[14px] bg-surface/80 pe-4 ps-11 text-[16px] text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </label>
      </div>
      <p className="mt-4 text-[13px] text-muted" aria-live="polite">
        {t('glossary.count', { n: list.length })}
      </p>
      {list.length === 0 ? (
        <div className="card mt-4 rounded-[22px] p-10 text-center text-muted">{t('glossary.none', { q })}</div>
      ) : (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {list.map((g) => (
            <div key={g.id} id={g.id} className="card rounded-[22px] p-5">
              <dt className="flex items-start justify-between gap-3">
                <span className="text-[18px] font-semibold text-ink">{l(g.term)}</span>
                <Chip tone={g.fromReport ? 'outline' : 'soft'} icon={g.fromReport ? 'book' : 'sparkles'}>
                  {g.fromReport ? t('glossary.fromReport') : t('glossary.added')}
                </Chip>
              </dt>
              <dd className="mt-2 text-[14.5px] leading-relaxed text-muted">{l(g.definition)}</dd>
              {lang !== 'fr' && <dd className="mt-2 text-[12.5px] text-faint" lang="fr">FR : {g.term.fr}</dd>}
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
