import type { TextareaHTMLAttributes } from 'react'
import { cx } from '../../lib/cx'
import { Field, type FieldBaseProps } from './Field'
import styles from './Field.module.css'

export interface TextareaProps extends FieldBaseProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {}

export function Textarea({ label, hint, error, required, className, ...rest }: TextareaProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      {(control) => (
        <textarea
          {...control}
          {...rest}
          required={required}
          className={cx(styles.textarea, error && styles.invalid, className)}
        />
      )}
    </Field>
  )
}
