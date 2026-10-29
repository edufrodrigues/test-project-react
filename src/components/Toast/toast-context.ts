import { createContext, useContext } from 'react'

export type ToastTone = 'success' | 'danger' | 'info'

export interface ToastOptions {
  title: string
  description?: string
  tone?: ToastTone
}

export interface ToastContextValue {
  showToast: (options: ToastOptions) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast precisa estar dentro de <ToastProvider>.')
  return context
}
