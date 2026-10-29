import { useId, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import styles from './Field.module.css'

export interface FieldBaseProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
}

interface FieldProps extends FieldBaseProps {
  /** Recebe os atributos de acessibilidade que o controle precisa aplicar. */
  children: (control: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }) => ReactNode
}

/** Estrutura comum de label, dica e erro usada por Input, Select e Textarea. */
export function Field({ label, hint, error, required, children }: FieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {hint && !error && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.error}>
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  )
}
