import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cx } from '../../lib/cx'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  iconLeft?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
}

export interface ButtonProps extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  /** Mostra um spinner e bloqueia cliques. */
  loading?: boolean
}

function buttonClass({ variant = 'primary', size = 'md', fullWidth }: BaseProps, className?: string) {
  return cx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)
}

export function Button({
  variant,
  size,
  iconLeft,
  iconRight,
  fullWidth,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, fullWidth }, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  )
}

export interface ButtonLinkProps extends BaseProps, LinkProps {}

/** Link de navegação com a aparência de um botão. */
export function ButtonLink({
  variant,
  size,
  iconLeft,
  iconRight,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass({ variant, size, fullWidth }, className)} {...rest}>
      {iconLeft}
      {children}
      {iconRight}
    </Link>
  )
}
