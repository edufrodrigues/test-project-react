import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setScenario } from '../lib/scenario'
import { renderApp } from '../test/renderApp'

const BOOKING_PATH = '/experiencias/saveiro-ilhas-paraty/reservar'

async function fillValidForm(user: ReturnType<typeof renderApp>['user']) {
  const dateSelect = screen.getByLabelText(/^Data/)
  const firstDate = dateSelect.querySelectorAll('option')[1].getAttribute('value')!
  await user.selectOptions(dateSelect, firstDate)
  await user.type(screen.getByLabelText(/Nome completo/), 'Ana Lima')
  await user.type(screen.getByLabelText(/E-mail/), 'ana@exemplo.com')
  await user.type(screen.getByLabelText(/Telefone/), '11987654321')
  await user.click(screen.getByRole('checkbox'))
}

describe('Fluxo de reserva', () => {
  it('navega do detalhe para o formulário', async () => {
    const { user } = renderApp('/experiencias/saveiro-ilhas-paraty')

    await user.click(await screen.findByRole('link', { name: 'Reservar agora' }))

    expect(await screen.findByRole('heading', { name: 'Finalize sua reserva' })).toBeInTheDocument()
  })

  it('mostra erros de validação ao enviar vazio', async () => {
    const { user } = renderApp(BOOKING_PATH)

    await user.click(await screen.findByRole('button', { name: /Confirmar reserva/ }))

    expect(screen.getByText('Escolha uma data.')).toBeInTheDocument()
    expect(screen.getByText('Informe seu nome completo.')).toBeInTheDocument()
    expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument()
    expect(screen.getByText('Você precisa aceitar a política de cancelamento.')).toBeInTheDocument()
  })

  it('aplica a máscara de telefone', async () => {
    const { user } = renderApp(BOOKING_PATH)

    await user.type(await screen.findByLabelText(/Telefone/), '11987654321')

    expect(screen.getByLabelText(/Telefone/)).toHaveValue('(11) 98765-4321')
  })

  it('confirma a reserva e mostra a tela de sucesso', async () => {
    const { user } = renderApp(BOOKING_PATH)
    await screen.findByRole('heading', { name: 'Finalize sua reserva' })

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Confirmar reserva/ }))

    expect(await screen.findByRole('heading', { name: 'Reserva confirmada!' })).toBeInTheDocument()
    expect(screen.getByText('ana@exemplo.com')).toBeInTheDocument()
  })

  it('mantém os dados e mostra o erro quando o envio falha', async () => {
    setScenario('erro-envio')
    const { user } = renderApp(BOOKING_PATH)
    await screen.findByRole('heading', { name: 'Finalize sua reserva' })

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Confirmar reserva/ }))

    expect(await screen.findByText('Não foi possível concluir sua reserva')).toBeInTheDocument()
    expect(screen.getByLabelText(/Nome completo/)).toHaveValue('Ana Lima')
  })

  it('mostra "não encontrada" para uma experiência inexistente', async () => {
    renderApp('/experiencias/nao-existe')

    expect(await screen.findByRole('heading', { name: 'Experiência não encontrada' })).toBeInTheDocument()
  })
})
