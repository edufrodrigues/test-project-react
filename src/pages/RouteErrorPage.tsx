import { isRouteErrorResponse, useRouteError } from 'react-router'
import { ButtonLink } from '../components/Button/Button'
import { ErrorState } from '../components/StateMessage/ErrorState'

/** Exibido quando uma rota lança um erro não tratado durante a renderização. */
export function RouteErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Erro desconhecido.'

  return (
    <div style={{ padding: 'var(--space-8) var(--space-4)' }}>
      <ErrorState
        title="Ops, esta tela quebrou"
        description={message}
        actions={<ButtonLink to="/">Voltar para o início</ButtonLink>}
      />
    </div>
  )
}
