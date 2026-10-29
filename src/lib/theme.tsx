import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { readStorage, writeStorage } from './storage'
import { ThemeContext, type ResolvedTheme, type ThemeContextValue, type ThemePreference } from './theme-context'

const STORAGE_KEY = 'rota:tema'

function systemTheme(): ResolvedTheme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readStorage(STORAGE_KEY, 'sistema'))
  const [system, setSystem] = useState<ResolvedTheme>(systemTheme)

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!media) return
    const update = () => setSystem(media.matches ? 'dark' : 'light')
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const resolved: ResolvedTheme = preference === 'sistema' ? system : preference === 'escuro' ? 'dark' : 'light'

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolved,
      setPreference(next) {
        setPreferenceState(next)
        writeStorage(STORAGE_KEY, next)
      },
    }),
    [preference, resolved],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
