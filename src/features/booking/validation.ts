export interface BookingFormValues {
  name: string
  email: string
  phone: string
  date: string
  guests: string
  notes: string
  acceptedPolicy: boolean
}

export type BookingFormErrors = Partial<Record<keyof BookingFormValues, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Aplica a máscara de telefone brasileiro: (11) 98765-4321. */
export function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function validateBooking(values: BookingFormValues, maxGuests: number): BookingFormErrors {
  const errors: BookingFormErrors = {}

  if (values.name.trim().length < 3) errors.name = 'Informe seu nome completo.'
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Informe um e-mail válido.'

  const phoneDigits = onlyDigits(values.phone).length
  if (phoneDigits < 10 || phoneDigits > 11) errors.phone = 'Informe um telefone com DDD.'

  if (!values.date) errors.date = 'Escolha uma data.'

  const guests = Number(values.guests)
  if (!Number.isInteger(guests) || guests < 1 || guests > maxGuests) {
    errors.guests = `Escolha entre 1 e ${maxGuests} pessoas.`
  }

  if (values.notes.length > 300) errors.notes = 'Use no máximo 300 caracteres.'
  if (!values.acceptedPolicy) errors.acceptedPolicy = 'Você precisa aceitar a política de cancelamento.'

  return errors
}
