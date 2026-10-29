import type { ReactNode } from 'react'
import { Compass } from 'lucide-react'
import { cx } from '../../lib/cx'
import styles from './StateMessage.module.css'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
}

export function EmptyState({ title, description, icon, actions }: EmptyStateProps) {
  return (
    <div className={cx(styles.state, styles.empty)}>
      <div className={styles.iconWrap} aria-hidden="true">
        {icon ?? <Compass size={28} />}
      </div>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
