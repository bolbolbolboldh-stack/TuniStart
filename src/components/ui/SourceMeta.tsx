import type { ContentReviewMetadata } from '../../domain/types'
import { useI18n } from '../../hooks/useI18n'
import { ReviewChip } from './StatusBadge'

/** Source + review metadata for any legal/procedural item. Never invents a date. */
export function SourceMeta({ meta, compact }: { meta: ContentReviewMetadata; compact?: boolean }) {
  const { t, l, date } = useI18n()
  return (
    <div className={compact ? 'flex flex-wrap items-center gap-2 text-[12px] text-muted' : 'flex flex-wrap items-center gap-x-3 gap-y-2 text-[12.5px] text-muted'}>
      <ReviewChip status={meta.reviewStatus} />
      <span>
        {t('common.source')} : {l(meta.sourceLabel)}
        {meta.reportPageReference ? ` (${meta.reportPageReference})` : ''}
      </span>
      {!compact && <span>· {t('common.lastReview')} : {meta.lastReviewedAt ? date(new Date(meta.lastReviewedAt)) : t('common.noReviewDate')}</span>}
    </div>
  )
}
