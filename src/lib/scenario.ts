import { useSyncExternalStore } from 'react'
import { readStorage, writeStorage } from './storage'

/**
 * Simulador de cenários da API falsa.
 * Pode ser definido pela URL (?cenario=erro) ou pelo painel flutuante.
 */
export type Scenario = 'normal' | 'lento' | 'erro' | 'vazio' | 'erro-envio'

export interface ScenarioOption {
  value: Scenario
  label: string
  description: string
}

export const SCENARIOS: ScenarioOption[] = [
  { value: 'normal', label: 'Normal', description: 'Dados de exemplo com atraso de ~0,8 s.' },
  { value: 'lento', label: 'Lento', description: 'Atraso de 4 s para observar os loadings.' },
  { value: 'erro', label: 'Erro', description: 'Todas as chamadas falham.' },
  { value: 'vazio', label: 'Vazio', description: 'Listas sem itens e detalhes não encontrados.' },
  { value: 'erro-envio', label: 'Erro no envio', description: 'Telas carregam, mas salvar e reservar falham.' },
]

const STORAGE_KEY = 'rota:cenario'
const URL_PARAM = 'cenario'

function isScenario(value: unknown): value is Scenario {
  return SCENARIOS.some((option) => option.value === value)
}

function readInitialScenario(): Scenario {
  if (typeof window === 'undefined') return 'normal'
  const fromUrl = new URLSearchParams(window.location.search).get(URL_PARAM)
  if (isScenario(fromUrl)) {
    writeStorage(STORAGE_KEY, fromUrl, 'session')
    return fromUrl
  }
  const stored = readStorage<unknown>(STORAGE_KEY, null, 'session')
  return isScenario(stored) ? stored : 'normal'
}

let current: Scenario = readInitialScenario()
const listeners = new Set<() => void>()

export function getScenario(): Scenario {
  return current
}

export function setScenario(next: Scenario): void {
  if (next === current) return
  current = next
  writeStorage(STORAGE_KEY, next, 'session')
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Cenário atual. Use nas dependências de carregamento para refazer a busca quando ele mudar. */
export function useScenario(): Scenario {
  return useSyncExternalStore(subscribe, getScenario, getScenario)
}
