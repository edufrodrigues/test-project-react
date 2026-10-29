import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp'

describe('BookingsPage', () => {
  it('separa as reservas por aba', async () => {
    const { user } = renderApp('/reservas')

    expect(await screen.findByText('Passeio de saveiro pelas ilhas de Paraty')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /Passadas/ }))
    expect(screen.getByText('Caminhada histórica por Ouro Preto')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /Canceladas/ }))
    expect(screen.getByText('Degustação de vinhos no Vale dos Vinhedos')).toBeInTheDocument()
  })

  it('cancela uma reserva pelo modal de confirmação', async () => {
    const { user } = renderApp('/reservas')
    await screen.findByText('Passeio de saveiro pelas ilhas de Paraty')

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    const dialog = screen.getByRole('dialog', { name: 'Cancelar esta reserva?' })
    await user.click(within(dialog).getByRole('button', { name: 'Sim, cancelar' }))

    expect(await screen.findByText('Reserva cancelada')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nenhuma viagem marcada' })).toBeInTheDocument()
  })
})
