import { useParams } from 'react-router'
import { CalendarCheck, CheckCircle2, Compass } from 'lucide-react'
import { api, NotFoundError } from '../api/client'
import { ButtonLink } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { EmptyState } from '../components/StateMessage/EmptyState'
import { ErrorState } from '../components/StateMessage/ErrorState'
import { useAsync } from '../hooks/useAsync'
import { formatCurrency, formatGuests, formatLongDate } from '../lib/format'
import { useScenario } from '../lib/scenario'
import page from './Page.module.css'
import styles from './ConfirmationPage.module.css'

export function ConfirmationPage() {
  const { bookingId = '' } = useParams()
  const scenario = useScenario()
  const { state, reload } = useAsync(() => api.getBooking(bookingId), [bookingId, scenario])

  if (state.status === 'loading') {
    return (
      <div className={styles.wrapper} aria-busy="true" aria-label="Carregando confirmação">
        <Card padding="lg" className={styles.card}>
          <Skeleton shape="circle" width="72px" height="72px" />
          <Skeleton width="60%" height="2rem" />
          <Skeleton width="80%" />
          <Skeleton shape="rect" height="160px" />
        </Card>
      </div>
    )
  }

  if (state.status === 'error') {
    if (state.error instanceof NotFoundError) {
      return (
        <EmptyState
          title="Reserva não encontrada"
          description="Confira o código da reserva ou veja a lista completa."
          actions={<ButtonLink to="/reservas">Ver minhas reservas</ButtonLink>}
        />
      )
    }
    return <ErrorState description={state.error.message} onRetry={reload} />
  }

  const booking = state.data

  return (
    <div className={styles.wrapper}>
      <Card padding="lg" className={styles.card}>
        <div className={styles.check} aria-hidden="true">
          <CheckCircle2 size={40} />
        </div>
        <div className={page.stackSm}>
          <h1 className={page.title}>Reserva confirmada!</h1>
          <p className={page.muted}>
            Enviamos os detalhes para <strong>{booking.email}</strong>. Apresente o código abaixo no ponto de encontro.
          </p>
        </div>
        <span className={styles.code} aria-label={`Código da reserva ${booking.id}`}>
          {booking.id}
        </span>
        <dl className={styles.details}>
          <div className={styles.detail}>
            <dt>Experiência</dt>
            <dd>{booking.experienceTitle}</dd>
          </div>
          <div className={styles.detail}>
            <dt>Local</dt>
            <dd>{booking.location}</dd>
          </div>
          <div className={styles.detail}>
            <dt>Data</dt>
            <dd>{formatLongDate(booking.date)}</dd>
          </div>
          <div className={styles.detail}>
            <dt>Pessoas</dt>
            <dd>{formatGuests(booking.guests)}</dd>
          </div>
          <div className={styles.detail}>
            <dt>Total pago</dt>
            <dd>{formatCurrency(booking.total)}</dd>
          </div>
        </dl>
        <div className={styles.actions}>
          <ButtonLink to="/reservas" iconLeft={<CalendarCheck size={16} aria-hidden="true" />}>
            Ver minhas reservas
          </ButtonLink>
          <ButtonLink to="/" variant="secondary" iconLeft={<Compass size={16} aria-hidden="true" />}>
            Explorar mais
          </ButtonLink>
        </div>
      </Card>
    </div>
  )
}
