import { parseISODate } from './date'
import type { Category } from '../api/types'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const longDate = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const shortDate = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })

export function formatCurrency(value: number): string {
  return currency.format(value)
}

/** Ex.: "sábado, 14 de novembro de 2026". */
export function formatLongDate(isoDate: string): string {
  return longDate.format(parseISODate(isoDate))
}

/** Ex.: "sáb., 14 de nov.". */
export function formatShortDate(isoDate: string): string {
  return shortDate.format(parseISODate(isoDate))
}

export function formatDuration(hours: number): string {
  return hours === 1 ? '1 hora' : `${hours} horas`
}

export function formatGuests(guests: number): string {
  return guests === 1 ? '1 pessoa' : `${guests} pessoas`
}

export const categoryLabels: Record<Category, string> = {
  aventura: 'Aventura',
  natureza: 'Natureza',
  gastronomia: 'Gastronomia',
  cultura: 'Cultura',
}
