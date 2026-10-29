import { useRef, type KeyboardEvent } from 'react'
import styles from './Tabs.module.css'

export interface TabItem<T extends string> {
  value: T
  label: string
  count?: number
}

export interface TabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  /** Prefixo dos ids, para ligar cada aba ao seu painel (`${idPrefix}-panel-${value}`). */
  idPrefix: string
}

export function Tabs<T extends string>({ items, value, onChange, label, idPrefix }: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null)

  // Navegação por setas, como recomendado pelo padrão WAI-ARIA de abas.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    const index = items.findIndex((item) => item.value === value)
    const step = event.key === 'ArrowRight' ? 1 : -1
    const next = items[(index + step + items.length) % items.length]
    onChange(next.value)
    listRef.current?.querySelector<HTMLButtonElement>(`#${idPrefix}-tab-${next.value}`)?.focus()
  }

  return (
    <div ref={listRef} className={styles.list} role="tablist" aria-label={label} onKeyDown={handleKeyDown}>
      {items.map((item) => {
        const selected = item.value === value
        return (
          <button
            key={item.value}
            id={`${idPrefix}-tab-${item.value}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${item.value}`}
            tabIndex={selected ? 0 : -1}
            className={styles.tab}
            onClick={() => onChange(item.value)}
          >
            {item.label}
            {item.count !== undefined && <span className={styles.count}>{item.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
