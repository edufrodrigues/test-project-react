import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cx } from '../../lib/cx'
import { ToastContext, type ToastOptions } from './toast-context'
import styles from './Toast.module.css'

interface ToastItem extends Required<Omit<ToastOptions, 'description'>> {
  id: number
  description?: string
}

const icons = { success: CheckCircle2, danger: XCircle, info: Info }
const AUTO_DISMISS_MS = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ title, description, tone = 'info' }: ToastOptions) => {
      const id = nextId.current++
      setToasts((current) => [...current, { id, title, description, tone }])
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.viewport} aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => {
          const Icon = icons[toast.tone]
          return (
            <div key={toast.id} className={cx(styles.toast, styles[toast.tone])}>
              <Icon size={18} className={styles.icon} aria-hidden="true" />
              <div className={styles.content}>
                <span className={styles.title}>{toast.title}</span>
                {toast.description && <span className={styles.description}>{toast.description}</span>}
              </div>
              <button
                type="button"
                className={styles.dismiss}
                onClick={() => dismiss(toast.id)}
                aria-label="Fechar aviso"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
