import type { ReactNode } from 'react'
import { RefreshCw, WifiOff } from 'lucide-react'
import { cx } from '../../lib/cx'
import { Button } from '../Button/Button'
import styles from './StateMessage.module.css'

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  actions?: ReactNode
}

export function ErrorState({
  title = 'Algo deu errado',
  description = 'Não conseguimos carregar as informações. Verifique sua conexão e tente de novo.',
  onRetry,
  actions,
}: ErrorStateProps) {
  return (
    <div className={cx(styles.state, styles.error)} role="alert">
      <div className={styles.iconWrap} aria-hidden="true">
        <WifiOff size={28} />
      </div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {(onRetry || actions) && (
        <div className={styles.actions}>
          {onRetry && (
            <Button onClick={onRetry} iconLeft={<RefreshCw size={16} aria-hidden="true" />}>
              Tentar de novo
            </Button>
          )}
          {actions}
        </div>
      )}
    </div>
  )
}
