import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft, Mail, Phone, User } from 'lucide-react'
import { api, NotFoundError } from '../api/client'
import type { Experience } from '../api/types'
import { Alert } from '../components/Alert/Alert'
import { Breadcrumb } from '../components/Breadcrumb/Breadcrumb'
import { Button, ButtonLink } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Checkbox } from '../components/Checkbox/Checkbox'
import { Input } from '../components/Field/Input'
import { Select } from '../components/Field/Select'
import { Textarea } from '../components/Field/Textarea'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { EmptyState } from '../components/StateMessage/EmptyState'
import { ErrorState } from '../components/StateMessage/ErrorState'
import { ExperienceArt } from '../features/experiences/ExperienceArt'
import {
  formatPhone,
  validateBooking,
  type BookingFormErrors,
  type BookingFormValues,
} from '../features/booking/validation'
import { useAsync } from '../hooks/useAsync'
import { formatCurrency, formatGuests, formatLongDate } from '../lib/format'
import { useScenario } from '../lib/scenario'
import page from './Page.module.css'
import styles from './BookingPage.module.css'

export function BookingPage() {
  const { experienceId = '' } = useParams()
  const scenario = useScenario()
  const { state, reload } = useAsync(() => api.getExperience(experienceId), [experienceId, scenario])

  if (state.status === 'loading') {
    return (
      <div className={page.split} aria-busy="true" aria-label="Carregando reserva">
        <div className={page.stack}>
          <Skeleton width="260px" />
          <Skeleton width="60%" height="2.25rem" />
          <Skeleton shape="rect" height="420px" />
        </div>
        <Skeleton shape="rect" height="300px" />
      </div>
    )
  }

  if (state.status === 'error') {
    if (state.error instanceof NotFoundError) {
      return (
        <EmptyState
          title="Experiência não encontrada"
          description="Não é possível reservar uma experiência que não existe mais."
          actions={<ButtonLink to="/">Voltar para explorar</ButtonLink>}
        />
      )
    }
    return <ErrorState description={state.error.message} onRetry={reload} />
  }

  return <BookingForm experience={state.data} />
}

const initialValues: BookingFormValues = {
  name: '',
  email: '',
  phone: '',
  date: '',
  guests: '2',
  notes: '',
  acceptedPolicy: false,
}

function BookingForm({ experience }: { experience: Experience }) {
  const navigate = useNavigate()
  const [values, setValues] = useState<BookingFormValues>({
    ...initialValues,
    guests: String(Math.min(2, experience.maxGuests)),
  })
  const [touched, setTouched] = useState<Partial<Record<keyof BookingFormValues, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const errors = validateBooking(values, experience.maxGuests)
  // Só mostra o erro de um campo depois que a pessoa saiu dele ou tentou enviar.
  const visibleError = (field: keyof BookingFormValues) => (submitted || touched[field] ? errors[field] : undefined)

  function update<K extends keyof BookingFormValues>(field: K, value: BookingFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function blur(field: keyof BookingFormValues) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    setSubmitError(null)

    const currentErrors: BookingFormErrors = validateBooking(values, experience.maxGuests)
    if (Object.keys(currentErrors).length > 0) {
      // Foca o primeiro campo inválido na ordem em que aparece na tela.
      const fields = event.currentTarget.querySelectorAll<HTMLElement>('[name]')
      const firstInvalid = Array.from(fields).find((field) => field.getAttribute('name')! in currentErrors)
      firstInvalid?.focus()
      return
    }

    setSubmitting(true)
    try {
      const booking = await api.createBooking({
        experienceId: experience.id,
        date: values.date,
        guests: Number(values.guests),
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone,
        notes: values.notes.trim(),
      })
      navigate(`/reserva/${booking.id}/confirmada`, { replace: true })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Erro inesperado.')
      setSubmitting(false)
    }
  }

  const guests = Number(values.guests) || 0
  const guestOptions = Array.from({ length: experience.maxGuests }, (_, index) => ({
    value: String(index + 1),
    label: formatGuests(index + 1),
  }))
  const dateOptions = experience.availableDates.map((date) => ({ value: date, label: formatLongDate(date) }))

  return (
    <div className={page.stack}>
      <Breadcrumb
        items={[
          { label: 'Explorar', to: '/' },
          { label: experience.title, to: `/experiencias/${experience.id}` },
          { label: 'Reserva' },
        ]}
      />

      <div className={page.pageHeader}>
        <h1 className={page.title}>Finalize sua reserva</h1>
        <p className={page.subtitle}>Preencha seus dados. A confirmação chega por e-mail na hora.</p>
      </div>

      <div className={page.split}>
        <Card padding="lg">
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {submitError && (
              <Alert tone="danger" title="Não foi possível concluir sua reserva">
                {submitError} Seus dados foram mantidos, é só tentar de novo.
              </Alert>
            )}

            <fieldset className={styles.section} disabled={submitting}>
              <legend className={`${page.sectionTitle} ${styles.legend}`}>Quando e quantas pessoas</legend>
              <div className={styles.row}>
                <Select
                  label="Data"
                  name="date"
                  required
                  placeholder="Escolha uma data"
                  options={dateOptions}
                  value={values.date}
                  onChange={(event) => update('date', event.target.value)}
                  onBlur={() => blur('date')}
                  error={visibleError('date')}
                />
                <Select
                  label="Pessoas"
                  name="guests"
                  required
                  options={guestOptions}
                  value={values.guests}
                  onChange={(event) => update('guests', event.target.value)}
                  onBlur={() => blur('guests')}
                  error={visibleError('guests')}
                  hint={`Máximo de ${experience.maxGuests} por reserva.`}
                />
              </div>
            </fieldset>

            <hr className={page.divider} />

            <fieldset className={styles.section} disabled={submitting}>
              <legend className={`${page.sectionTitle} ${styles.legend}`}>Seus dados</legend>
              <Input
                label="Nome completo"
                name="name"
                autoComplete="name"
                required
                icon={<User size={18} aria-hidden="true" />}
                value={values.name}
                onChange={(event) => update('name', event.target.value)}
                onBlur={() => blur('name')}
                error={visibleError('name')}
              />
              <div className={styles.row}>
                <Input
                  label="E-mail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="voce@exemplo.com"
                  icon={<Mail size={18} aria-hidden="true" />}
                  value={values.email}
                  onChange={(event) => update('email', event.target.value)}
                  onBlur={() => blur('email')}
                  error={visibleError('email')}
                />
                <Input
                  label="Telefone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                  placeholder="(11) 98765-4321"
                  icon={<Phone size={18} aria-hidden="true" />}
                  value={values.phone}
                  onChange={(event) => update('phone', formatPhone(event.target.value))}
                  onBlur={() => blur('phone')}
                  error={visibleError('phone')}
                />
              </div>
              <Textarea
                label="Observações"
                name="notes"
                hint="Restrições alimentares, acessibilidade ou outros pedidos. Opcional."
                maxLength={320}
                value={values.notes}
                onChange={(event) => update('notes', event.target.value)}
                onBlur={() => blur('notes')}
                error={visibleError('notes')}
              />
              <Checkbox
                name="acceptedPolicy"
                label="Li e aceito a política de cancelamento: grátis até 48 horas antes da experiência."
                checked={values.acceptedPolicy}
                onChange={(event) => update('acceptedPolicy', event.target.checked)}
                error={submitted ? errors.acceptedPolicy : undefined}
              />
            </fieldset>

            <div className={styles.actions}>
              <ButtonLink
                to={`/experiencias/${experience.id}`}
                variant="ghost"
                iconLeft={<ArrowLeft size={16} aria-hidden="true" />}
              >
                Voltar
              </ButtonLink>
              <Button type="submit" size="lg" loading={submitting}>
                {submitting ? 'Confirmando…' : `Confirmar reserva de ${formatCurrency(experience.price * guests)}`}
              </Button>
            </div>
          </form>
        </Card>

        <aside className={page.aside}>
          <Card padding="lg" className={styles.summary}>
            <div className={styles.summaryHeader}>
              <div className={styles.thumb}>
                <ExperienceArt art={experience.art} />
              </div>
              <div>
                <h2 className={styles.summaryTitle}>{experience.title}</h2>
                <span className={page.muted}>
                  {experience.city}, {experience.state}
                </span>
              </div>
            </div>
            <hr className={page.divider} />
            <dl className={styles.lines}>
              <div className={styles.line}>
                <dt>Data</dt>
                <dd>{values.date ? formatLongDate(values.date) : 'A escolher'}</dd>
              </div>
              <div className={styles.line}>
                <dt>
                  {formatCurrency(experience.price)} x {formatGuests(guests)}
                </dt>
                <dd>{formatCurrency(experience.price * guests)}</dd>
              </div>
              <div className={styles.line}>
                <dt>Taxa de serviço</dt>
                <dd>Grátis</dd>
              </div>
            </dl>
            <hr className={page.divider} />
            <div className={`${styles.line} ${styles.total}`}>
              <span>Total</span>
              <span>{formatCurrency(experience.price * guests)}</span>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
