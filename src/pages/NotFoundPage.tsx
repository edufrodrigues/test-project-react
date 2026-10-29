import { MapPinOff } from 'lucide-react'
import { ButtonLink } from '../components/Button/Button'
import { EmptyState } from '../components/StateMessage/EmptyState'

export function NotFoundPage() {
  return (
    <EmptyState
      icon={<MapPinOff size={28} />}
      title="Página não encontrada"
      description="Parece que essa rota não leva a lugar nenhum. Confira o endereço ou volte para o início."
      actions={<ButtonLink to="/">Voltar para o início</ButtonLink>}
    />
  )
}
