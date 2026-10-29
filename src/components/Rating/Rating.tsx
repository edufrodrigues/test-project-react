import { Star } from 'lucide-react'
import styles from './Rating.module.css'

export interface RatingProps {
  value: number
  count?: number
}

export function Rating({ value, count }: RatingProps) {
  const formatted = value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

  return (
    <span className={styles.rating} aria-label={`Nota ${formatted} de 5${count ? `, ${count} avaliações` : ''}`}>
      <Star size={16} className={styles.star} aria-hidden="true" />
      <span aria-hidden="true">{formatted}</span>
      {count !== undefined && (
        <span className={styles.count} aria-hidden="true">
          ({count.toLocaleString('pt-BR')})
        </span>
      )}
    </span>
  )
}
