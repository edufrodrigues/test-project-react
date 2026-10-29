import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { CalendarDays, CalendarX2, MapPin, Users } from 'lucide-react'
import { api } from '../api/client'
import type { Booking } from '../api/types'
import { Badge } from '../components/Badge/Badge'
import { Button, ButtonLink } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Modal } from '../components/Modal/Modal'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { EmptyState } from '../components/StateMessage/EmptyState'
import { ErrorState } from '../components/StateMessage/ErrorState'
import { Tabs } from '../components/Tabs/Tabs'
import { useToast } from '../components/Toast/toast-context'
import { ExperienceArt } from '../features/experiences/ExperienceArt'
import { useAsync } from '../hooks/useAsync'
import { isUpcoming, parseISODate } from '../lib/date'
import { formatCurrency, formatGuests, formatLongDate } from '../lib/format'
import { useScenario } from '../lib/scenario'
import page from './Page.module.css'
import styles from './BookingsPage.module.css'

type TabValue = 'proximas' | 'passadas' | 'canceladas'

const emptyCopy: Record<TabValue, { title: string; description: string }> = {
  proximas: {
    title: 'Nenhuma viagem marcada',
    description: 'Quando você reservar uma experiência, ela aparece aqui.',
  },
  passadas: {
    title: 'Nenhuma experiência no histórico',
    description: 'As experiências que você já fez ficam guardadas nesta aba.',
  },
  canceladas: {
    title: 'Nenhuma reserva cancelada',
    description: 'Que bom! Nenhum plano foi desfeito por aqui.',
  },
}

function groupBookings(bookings: Booking[]): Record<TabValue, Booking[]> {
  const byDate = (a: Booking, b: Booking) => parseISODate(a.date).getTime() - parseISODate(b.date).getTime()
  const active = bookings.filter((booking) => booking.status === 'confirmada')
  return {
    proximas: active.filter((booking) => isUpcoming(booking.date)).sort(byDate),
    passadas: active.filter((booking) => !isUpcoming(booking.date)).sort((a, b) => byDate(b, a)),
    canceladas: bookings.filter((booking) => booking.status === 'cancelada').sort(byDate),
  }
}

export function BookingsPage() {
  const scenario = useScenario()
  const { state, reload, setData } = useAsync(() => api.listBookings(), [scenario])
  const [params, setParams] = useSearchParams()
  const { showToast } = useToast()
  const [toCancel, setToCancel] = useState<Booking | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const tabParam = params.get('aba')
  const tab: TabValue = tabParam === 'passadas' || tabParam === 'canceladas' ? tabParam : 'proximas'

  function changeTab(next: TabValue) {
    setParams(
      (current) => {
        const updated = new URLSearchParams(current)
        if (next === 'proximas') updated.delete('aba')
        else updated.set('aba', next)
        return updated
      },
      { replace: true },
    )
  }

  async function confirmCancel() {
    if (!toCancel) return
    setCancelling(true)
    try {
      const updated = await api.cancelBooking(toCancel.id)
      setData((bookings) => bookings.map((item) => (item.id === updated.id ? updated : item)))
      showToast({ tone: 'success', title: 'Reserva cancelada', description: `O reembolso de ${formatCurrency(updated.total)} foi solicitado.` })
      setToCancel(null)
    } catch (error) {
      showToast({
        tone: 'danger',
        title: 'Não foi possível cancelar',
        description: error instanceof Error ? error.message : 'Tente novamente em instantes.',
      })
    } finally {
      setCancelling(false)
    }
  }

  const groups = state.status === 'success' ? groupBookings(state.data) : null

  return (
    <div className={page.stack}>
      <div className={page.pageHeader}>
        <h1 className={page.title}>Minhas reservas</h1>
        <p className={page.subtitle}>Acompanhe suas próximas experiências e o histórico de viagens.</p>
      </div>

      <div>
        <Tabs
          label="Filtrar reservas"
          idPrefix="reservas"
          value={tab}
          onChange={changeTab}
          items={[
            { value: 'proximas', label: 'Próximas', count: groups?.proximas.length },
            { value: 'passadas', label: 'Passadas', count: groups?.passadas.length },
            { value: 'canceladas', label: 'Canceladas', count: groups?.canceladas.length },
          ]}
        />
      </div>

      <div id={`reservas-panel-${tab}`} role="tabpanel" aria-labelledby={`reservas-tab-${tab}`}>
        {state.status === 'loading' && (
          <div className={page.list} aria-busy="true" aria-label="Carregando reservas">
            {Array.from({ length: 3 }, (_, index) => (
              <Card key={index} padding="none" className={styles.item}>
                <Skeleton shape="rect" className={styles.thumb} height="auto" />
                <div className={styles.info}>
                  <Skeleton width="60%" height="1.2em" />
                  <Skeleton width="40%" />
                </div>
                <Skeleton width="90px" height="32px" shape="rect" />
              </Card>
            ))}
          </div>
        )}

        {state.status === 'error' && (
          <ErrorState title="Não foi possível carregar suas reservas" description={state.error.message} onRetry={reload} />
        )}

        {groups && groups[tab].length === 0 && (
          <EmptyState
            icon={<CalendarX2 size={28} />}
            title={emptyCopy[tab].title}
            description={emptyCopy[tab].description}
            actions={tab === 'proximas' ? <ButtonLink to="/">Explorar experiências</ButtonLink> : undefined}
          />
        )}

        {groups && groups[tab].length > 0 && (
          <ul className={page.list}>
            {groups[tab].map((booking) => (
              <li key={booking.id}>
                <BookingItem booking={booking} tab={tab} onCancel={() => setToCancel(booking)} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={toCancel !== null}
        title="Cancelar esta reserva?"
        onClose={() => !cancelling && setToCancel(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setToCancel(null)} disabled={cancelling}>
              Manter reserva
            </Button>
            <Button variant="danger" onClick={confirmCancel} loading={cancelling}>
              Sim, cancelar
            </Button>
          </>
        }
      >
        {toCancel && (
          <p>
            Você vai cancelar <strong>{toCancel.experienceTitle}</strong> em {formatLongDate(toCancel.date)}. O valor
            de {formatCurrency(toCancel.total)} será devolvido em até 7 dias úteis. Essa ação não pode ser desfeita.
          </p>
        )}
      </Modal>
    </div>
  )
}

function BookingItem({ booking, tab, onCancel }: { booking: Booking; tab: TabValue; onCancel: () => void }) {
  const statusBadge = {
    proximas: <Badge tone="success">Confirmada</Badge>,
    passadas: <Badge>Concluída</Badge>,
    canceladas: <Badge tone="danger">Cancelada</Badge>,
  }[tab]

  return (
    <Card padding="none" className={styles.item}>
      <div className={styles.thumb}>
        <ExperienceArt art={booking.art} />
      </div>
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>
            <Link to={`/experiencias/${booking.experienceId}`}>{booking.experienceTitle}</Link>
          </h2>
          {statusBadge}
        </div>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <CalendarDays size={14} aria-hidden="true" />
            {formatLongDate(booking.date)}
          </span>
          <span className={styles.metaItem}>
            <MapPin size={14} aria-hidden="true" />
            {booking.location}
          </span>
          <span className={styles.metaItem}>
            <Users size={14} aria-hidden="true" />
            {formatGuests(booking.guests)}
          </span>
        </div>
        <span className={styles.code}>Código {booking.id}</span>
      </div>
      <div className={styles.side}>
        <span className={styles.total}>{formatCurrency(booking.total)}</span>
        {tab === 'proximas' && (
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </Card>
  )
}
