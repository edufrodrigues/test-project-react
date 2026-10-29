import { useCallback, useEffect, useState, type DependencyList } from 'react'

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }

/**
 * Executa uma função assíncrona e expõe o estado de carregamento.
 * Refaz a busca quando `deps` mudam ou quando `reload` é chamado.
 */
export function useAsync<T>(load: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    load().then(
      (data) => {
        if (!cancelled) setState({ status: 'success', data })
      },
      (error: unknown) => {
        if (!cancelled) setState({ status: 'error', error: error instanceof Error ? error : new Error(String(error)) })
      },
    )
    return () => {
      cancelled = true
    }
    // `load` muda a cada render; quem controla a recarga são `deps` e `attempt`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const reload = useCallback(() => setAttempt((value) => value + 1), [])

  /** Atualiza os dados já carregados, sem nova requisição. */
  const setData = useCallback((update: (data: T) => T) => {
    setState((current) => (current.status === 'success' ? { status: 'success', data: update(current.data) } : current))
  }, [])

  return { state, reload, setData }
}
