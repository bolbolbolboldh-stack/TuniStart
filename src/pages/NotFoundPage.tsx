import { ButtonLink } from '../components/ui/Button'
import { EmptyState } from '../components/ui/States'
import { useI18n } from '../hooks/useI18n'

export function NotFoundPage() {
  const { t } = useI18n()
  return (
    <div className="container-page py-20">
      <EmptyState
        icon="compass"
        title={t('notFound.title')}
        text={t('notFound.text')}
        actions={
          <ButtonLink to="/" icon="arrow-left">
            {t('notFound.home')}
          </ButtonLink>
        }
      />
    </div>
  )
}
