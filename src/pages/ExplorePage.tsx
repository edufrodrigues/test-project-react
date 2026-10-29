import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { Search, SearchX } from 'lucide-react'
import { api } from '../api/client'
import type { Category, Experience } from '../api/types'
import { Button } from '../components/Button/Button'
import { Input } from '../components/Field/Input'
import { Select } from '../components/Field/Select'
import { EmptyState } from '../components/StateMessage/EmptyState'
import { ErrorState } from '../components/StateMessage/ErrorState'
import { ExperienceCard, ExperienceCardSkeleton } from '../features/experiences/ExperienceCard'
import { useAsync } from '../hooks/useAsync'
import { categoryLabels } from '../lib/format'
import { useScenario } from '../lib/scenario'
import page from './Page.module.css'
import styles from './ExplorePage.module.css'

type SortOrder = 'relevancia' | 'menor-preco' | 'maior-preco' | 'avaliacao'

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'relevancia', label: 'Mais populares' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'avaliacao', label: 'Melhor avaliação' },
]

const categories = Object.keys(categoryLabels) as Category[]

function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function applyFilters(items: Experience[], query: string, category: Category | null, order: SortOrder) {
  const term = normalize(query.trim())
  const filtered = items.filter((item) => {
    if (category && item.category !== category) return false
    if (!term) return true
    return normalize(`${item.title} ${item.city} ${item.state} ${item.summary}`).includes(term)
  })

  const sorters: Record<SortOrder, (a: Experience, b: Experience) => number> = {
    relevancia: (a, b) => b.reviewsCount - a.reviewsCount,
    'menor-preco': (a, b) => a.price - b.price,
    'maior-preco': (a, b) => b.price - a.price,
    avaliacao: (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount,
  }
  return [...filtered].sort(sorters[order])
}

export function ExplorePage() {
  const scenario = useScenario()
  const { state, reload } = useAsync(() => api.listExperiences(), [scenario])
  const [params, setParams] = useSearchParams()

  const query = params.get('q') ?? ''
  const category = categories.find((value) => value === params.get('categoria')) ?? null
  const order = sortOptions.find((option) => option.value === params.get('ordem'))?.value ?? 'relevancia'

  // Atualiza um filtro na URL preservando os demais (inclusive ?cenario).
  function updateParam(key: string, value: string | null) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  }

  function clearFilters() {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        ;['q', 'categoria', 'ordem'].forEach((key) => next.delete(key))
        return next
      },
      { replace: true },
    )
  }

  const results = useMemo(
    () => (state.status === 'success' ? applyFilters(state.data, query, category, order) : []),
    [state, query, category, order],
  )

  return (
    <div className={page.stack}>
      <section className={styles.hero}>
        <span className={page.eyebrow}>Experiências pelo Brasil</span>
        <h1 className={page.title}>Viva o melhor de cada destino</h1>
        <p className={page.subtitle}>
          Passeios, trilhas e sabores escolhidos a dedo, com guias locais e grupos pequenos.
        </p>
      </section>

      <section className={page.stack} aria-labelledby="explore-results">
        <div className={styles.toolbar}>
          <Input
            label="Buscar experiência"
            type="search"
            placeholder="Destino, cidade ou atividade"
            icon={<Search size={18} aria-hidden="true" />}
            value={query}
            onChange={(event) => updateParam('q', event.target.value)}
          />
          <Select
            label="Ordenar por"
            options={sortOptions}
            value={order}
            onChange={(event) => updateParam('ordem', event.target.value === 'relevancia' ? null : event.target.value)}
          />
        </div>

        <div className={styles.chips} role="group" aria-label="Filtrar por categoria">
          <button
            type="button"
            className={styles.chip}
            aria-pressed={category === null}
            onClick={() => updateParam('categoria', null)}
          >
            Todas
          </button>
          {categories.map((value) => (
            <button
              key={value}
              type="button"
              className={styles.chip}
              aria-pressed={category === value}
              onClick={() => updateParam('categoria', value)}
            >
              {categoryLabels[value]}
            </button>
          ))}
        </div>

        <h2 id="explore-results" className="visually-hidden">
          Resultados
        </h2>

        {state.status === 'loading' && (
          <div className={page.grid} aria-busy="true" aria-label="Carregando experiências">
            {Array.from({ length: 6 }, (_, index) => (
              <ExperienceCardSkeleton key={index} />
            ))}
          </div>
        )}

        {state.status === 'error' && (
          <ErrorState
            title="Não foi possível carregar as experiências"
            description={state.error.message}
            onRetry={reload}
          />
        )}

        {state.status === 'success' && state.data.length === 0 && (
          <EmptyState
            title="Nenhuma experiência disponível"
            description="Ainda não temos experiências cadastradas. Volte em breve para conferir as novidades."
          />
        )}

        {state.status === 'success' && state.data.length > 0 && results.length === 0 && (
          <EmptyState
            icon={<SearchX size={28} />}
            title="Nada encontrado"
            description={query ? `Não achamos experiências para "${query}". Tente outro termo ou categoria.` : 'Nenhuma experiência nesta categoria.'}
            actions={
              <Button variant="secondary" onClick={clearFilters}>
                Limpar filtros
              </Button>
            }
          />
        )}

        {results.length > 0 && (
          <>
            <div className={styles.resultsBar}>
              <span>
                {results.length === 1 ? '1 experiência encontrada' : `${results.length} experiências encontradas`}
              </span>
            </div>
            <div className={page.grid}>
              {results.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
