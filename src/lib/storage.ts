/*
 * Acesso seguro ao Web Storage. Em iframes, sandboxes ou modo privado o
 * storage pode estar bloqueado e lançar exceção, então tudo cai num fallback.
 */

type StorageKind = 'local' | 'session'

function getStorage(kind: StorageKind): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

export function readStorage<T>(key: string, fallback: T, kind: StorageKind = 'local'): T {
  try {
    const raw = getStorage(kind)?.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown, kind: StorageKind = 'local'): void {
  try {
    getStorage(kind)?.setItem(key, JSON.stringify(value))
  } catch {
    // Sem storage disponível: o estado continua só em memória.
  }
}
