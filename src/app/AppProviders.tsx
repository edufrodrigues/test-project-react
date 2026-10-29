import type { ReactNode } from 'react'
import { ToastProvider } from '../components/Toast/ToastProvider'
import { ThemeProvider } from '../lib/theme'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}
