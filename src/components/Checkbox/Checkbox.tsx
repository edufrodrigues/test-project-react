import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cx } from '../../lib/cx'
import styles from './Checkbox.module.css'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  error?: string
}

export function Checkbox({ label, error, className, ...rest }: CheckboxProps) {
  const errorId = useId()

  return (
    <div className={cx(styles.wrapper, error && styles.invalid, className)}>
      <label className={styles.label}>
        <input
          type="checkbox"
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
        <span className={styles.box} aria-hidden="true">
          <Check size={14} strokeWidth={3} />
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  )
}
