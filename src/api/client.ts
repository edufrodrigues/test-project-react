import { getScenario, type Scenario } from '../lib/scenario'
import { readStorage, writeStorage } from '../lib/storage'
import { createSeedBookings, experiences, profile as seedProfile } from './data'
import type { Booking, BookingInput, Experience, Profile } from './types'

/*
 * API falsa. Tudo fica em memória (e no localStorage, quando disponível),
 * com atraso artificial e falhas controladas pelo cenário atual.
 */

export class ApiError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Recurso não encontrado.') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

const LATENCY_MS: Record<Scenario, number> = {
  normal: 800,
  lento: 4000,
  erro: 700,
  vazio: 600,
  'erro-envio': 800,
}

const BOOKINGS_KEY = 'rota:reservas'
const PROFILE_KEY = 'rota:perfil'

let bookings: Booking[] = readStorage(BOOKINGS_KEY, createSeedBookings())
let profile: Profile = readStorage(PROFILE_KEY, seedProfile)

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Simula uma requisição: aplica atraso e falha conforme o cenário. */
async function request<T>(resolve: (scenario: Scenario) => T, { mutation = false } = {}): Promise<T> {
  const scenario = getScenario()
  await wait(import.meta.env.MODE === 'test' ? 5 : LATENCY_MS[scenario])

  if (scenario === 'erro' || (mutation && scenario === 'erro-envio')) {
    throw new ApiError('Falha simulada de conexão com o servidor.')
  }
  return resolve(scenario)
}

function generateCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)]
  return `RT-${code}`
}

function findExperience(id: string): Experience {
  const experience = experiences.find((item) => item.id === id)
  if (!experience) throw new NotFoundError('Experiência não encontrada.')
  return experience
}

function findBooking(id: string): Booking {
  const booking = bookings.find((item) => item.id === id)
  if (!booking) throw new NotFoundError('Reserva não encontrada.')
  return booking
}

function saveBookings(next: Booking[]) {
  bookings = next
  writeStorage(BOOKINGS_KEY, bookings)
}

export const api = {
  listExperiences(): Promise<Experience[]> {
    return request((scenario) => (scenario === 'vazio' ? [] : experiences))
  },

  getExperience(id: string): Promise<Experience> {
    return request((scenario) => {
      if (scenario === 'vazio') throw new NotFoundError('Experiência não encontrada.')
      return findExperience(id)
    })
  },

  listBookings(): Promise<Booking[]> {
    return request((scenario) => (scenario === 'vazio' ? [] : [...bookings]))
  },

  getBooking(id: string): Promise<Booking> {
    return request(() => findBooking(id))
  },

  createBooking(input: BookingInput): Promise<Booking> {
    return request(
      () => {
        const experience = findExperience(input.experienceId)
        const booking: Booking = {
          ...input,
          id: generateCode(),
          experienceTitle: experience.title,
          location: `${experience.city}, ${experience.state}`,
          art: experience.art,
          total: experience.price * input.guests,
          status: 'confirmada',
          createdAt: new Date().toISOString(),
        }
        saveBookings([booking, ...bookings])
        return booking
      },
      { mutation: true },
    )
  },

  cancelBooking(id: string): Promise<Booking> {
    return request(
      () => {
        const updated: Booking = { ...findBooking(id), status: 'cancelada' }
        saveBookings(bookings.map((item) => (item.id === id ? updated : item)))
        return updated
      },
      { mutation: true },
    )
  },

  getProfile(): Promise<Profile> {
    return request(() => ({ ...profile }))
  },

  updateProfile(next: Profile): Promise<Profile> {
    return request(
      () => {
        profile = { ...next }
        writeStorage(PROFILE_KEY, profile)
        return { ...profile }
      },
      { mutation: true },
    )
  },

  /** Volta os dados ao estado inicial. Usado pelo painel de cenários e pelos testes. */
  reset(): void {
    saveBookings(createSeedBookings())
    profile = { ...seedProfile }
    writeStorage(PROFILE_KEY, profile)
  },
}
