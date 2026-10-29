import type { CSSProperties } from 'react'
import { cx } from '../../lib/cx'
import styles from './Skeleton.module.css'

export interface SkeletonProps {
  shape?: 'text' | 'rect' | 'circle'
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  className?: string
}

/** Bloco animado que ocupa o lugar do conteúdo enquanto ele carrega. */
export function Skeleton({ shape = 'text', width = '100%', height, className }: SkeletonProps) {
  return (
    <span
      className={cx(styles.skeleton, styles[shape], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}
