import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cx } from '../../lib/cx'
import styles from './Alert.module.css'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
}

export interface AlertProps {
  tone?: AlertTone
  title: string
  children?: ReactNode
  className?: string
}

export function Alert({ tone = 'info', title, children, className }: AlertProps) {
  const Icon = icons[tone]
  const isUrgent = tone === 'danger' || tone === 'warning'

  return (
    <div className={cx(styles.alert, styles[tone], className)} role={isUrgent ? 'alert' : 'status'}>
      <Icon size={18} className={styles.icon} aria-hidden="true" />
      <div className={styles.body}>
        <strong className={styles.title}>{title}</strong>
        {children && <div className={styles.description}>{children}</div>}
      </div>
    </div>
  )
}
