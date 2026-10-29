import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setScenario } from '../lib/scenario'
import { renderApp } from '../test/renderApp'

describe('ExplorePage', () => {
  it('mostra o loading e depois a lista de experiências', async () => {
    renderApp('/')

    expect(screen.getByLabelText('Carregando experiências')).toBeInTheDocument()
    expect(await screen.findByText('9 experiências encontradas')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Mergulho guiado na Baía do Sancho/ })).toBeInTheDocument()
  })

  it('filtra pela busca e permite limpar os filtros', async () => {
    const { user } = renderApp('/')
    await screen.findByText('9 experiências encontradas')

    await user.type(screen.getByLabelText('Buscar experiência'), 'paraty')
    expect(screen.getByText('1 experiência encontrada')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Buscar experiência'))
    await user.type(screen.getByLabelText('Buscar experiência'), 'xyz')
    expect(screen.getByRole('heading', { name: 'Nada encontrado' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    expect(screen.getByText('9 experiências encontradas')).toBeInTheDocument()
  })

  it('filtra por categoria', async () => {
    const { user } = renderApp('/')
    await screen.findByText('9 experiências encontradas')

    const group = screen.getByRole('group', { name: 'Filtrar por categoria' })
    await user.click(within(group).getByRole('button', { name: 'Gastronomia' }))

    expect(screen.getByText('2 experiências encontradas')).toBeInTheDocument()
  })

  it('mostra o estado de erro e tenta de novo', async () => {
    setScenario('erro')
    const { user } = renderApp('/')

    expect(await screen.findByRole('heading', { name: 'Não foi possível carregar as experiências' })).toBeInTheDocument()

    setScenario('normal')
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(await screen.findByText('9 experiências encontradas')).toBeInTheDocument()
  })

  it('mostra o estado vazio quando não há dados', async () => {
    setScenario('vazio')
    renderApp('/')

    expect(await screen.findByRole('heading', { name: 'Nenhuma experiência disponível' })).toBeInTheDocument()
  })
})
