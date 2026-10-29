import type { HTMLAttributes } from 'react'
import { cx } from '../../lib/cx'
import styles from './Card.module.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'md' | 'lg'
  /** Eleva o card no hover. Use quando o card inteiro for clicável. */
  interactive?: boolean
}

const paddingClass = {
  none: styles.paddingNone,
  md: styles.paddingMd,
  lg: styles.paddingLg,
}

export function Card({ padding = 'md', interactive = false, className, ...rest }: CardProps) {
  return (
    <div
      className={cx(styles.card, paddingClass[padding], interactive && styles.interactive, className)}
      {...rest}
    />
  )
}
