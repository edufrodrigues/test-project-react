export type Category = 'aventura' | 'natureza' | 'gastronomia' | 'cultura'

/** Cenas disponíveis para a ilustração SVG de cada experiência. */
export type ArtScene = 'montanha' | 'mar' | 'cidade' | 'vinhedo'

export interface ArtPalette {
  scene: ArtScene
  skyTop: string
  skyBottom: string
  far: string
  near: string
  sun: string
}

export interface Experience {
  id: string
  title: string
  city: string
  state: string
  category: Category
  summary: string
  description: string
  /** Preço por pessoa, em reais. */
  price: number
  rating: number
  reviewsCount: number
  durationHours: number
  maxGuests: number
  meetingPoint: string
  highlights: string[]
  includes: string[]
  /** Datas disponíveis no formato YYYY-MM-DD. */
  availableDates: string[]
  art: ArtPalette
}

export type BookingStatus = 'confirmada' | 'cancelada'

export interface Booking {
  id: string
  experienceId: string
  experienceTitle: string
  location: string
  art: ArtPalette
  /** Data da experiência no formato YYYY-MM-DD. */
  date: string
  guests: number
  total: number
  name: string
  email: string
  phone: string
  notes: string
  status: BookingStatus
  createdAt: string
}

export interface BookingInput {
  experienceId: string
  date: string
  guests: number
  name: string
  email: string
  phone: string
  notes: string
}

export interface Profile {
  name: string
  email: string
  phone: string
  city: string
  memberSince: string
}
