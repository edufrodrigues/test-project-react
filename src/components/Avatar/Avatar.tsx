import { cx } from '../../lib/cx'
import styles from './Avatar.module.css'

export interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <span className={cx(styles.avatar, styles[size], className)} title={name}>
      {src ? <img src={src} alt={name} className={styles.image} /> : <span aria-label={name}>{initials(name)}</span>}
    </span>
  )
}
