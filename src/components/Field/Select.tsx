import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cx } from '../../lib/cx'
import { Field, type FieldBaseProps } from './Field'
import styles from './Field.module.css'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends FieldBaseProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  options: SelectOption[]
  placeholder?: string
}

export function Select({ label, hint, error, required, options, placeholder, className, ...rest }: SelectProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {(control) => (
        <div className={styles.control}>
          <select
            {...control}
            {...rest}
            required={required}
            className={cx(styles.select, error && styles.invalid, className)}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className={styles.chevron}>
            <ChevronDown size={16} aria-hidden="true" />
          </span>
        </div>
      )}
    </Field>
  )
}
