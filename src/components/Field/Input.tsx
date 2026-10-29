import type { InputHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/cx'
import { Field, type FieldBaseProps } from './Field'
import styles from './Field.module.css'

export interface InputProps extends FieldBaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  icon?: ReactNode
}

export function Input({ label, hint, error, required, icon, className, ...rest }: InputProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {(control) => (
        <div className={styles.control}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <input
            {...control}
            {...rest}
            required={required}
            className={cx(styles.input, Boolean(icon) && styles.withIcon, error && styles.invalid, className)}
          />
        </div>
      )}
    </Field>
  )
}
