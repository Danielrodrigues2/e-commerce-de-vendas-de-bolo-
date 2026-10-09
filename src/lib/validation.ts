import type { FulfillmentOption } from '@/config/store'
import type { FulfillmentMethod } from '@/types'
import { addDays, formatDateBR, isValidISODate } from './dates'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Telefone brasileiro com DDD (10 ou 11 dígitos), opcionalmente precedido de 55. */
export function isValidBrazilianPhone(value: string): boolean {
  let digits = onlyDigits(value)
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) digits = digits.slice(2)
  if (digits.length !== 10 && digits.length !== 11) return false
  if (digits.startsWith('0')) return false
  // Celulares com 11 dígitos começam com 9 após o DDD.
  if (digits.length === 11 && digits[2] !== '9') return false
  return true
}

function validateName(name: string): string | undefined {
  const trimmed = name.trim()
  if (!trimmed) return 'Informe seu nome.'
  if (trimmed.length < 2) return 'O nome deve ter pelo menos 2 caracteres.'
  if (trimmed.length > 80) return 'O nome deve ter no máximo 80 caracteres.'
  return undefined
}

function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) return 'Informe um telefone ou WhatsApp para contato.'
  if (!isValidBrazilianPhone(phone)) return 'Informe um telefone válido com DDD. Ex.: (11) 91234-5678.'
  return undefined
}

function validateDesiredDate(date: string, today: string, minLeadDays: number): string | undefined {
  if (!date) return 'Informe a data desejada.'
  if (!isValidISODate(date)) return 'Informe uma data válida.'
  const minDate = addDays(today, minLeadDays)
  if (date < minDate) return `Escolha uma data a partir de ${formatDateBR(minDate)} (antecedência mínima de ${minLeadDays} dias).`
  return undefined
}

function maxLength(value: string, max: number, label: string): string | undefined {
  return value.length > max ? `${label} deve ter no máximo ${max} caracteres.` : undefined
}

function compact<T>(errors: FieldErrors<T>): FieldErrors<T> {
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => Boolean(v))) as FieldErrors<T>
}

export interface CheckoutForm {
  name: string
  phone: string
  fulfillment: FulfillmentMethod | ''
  address: string
  neighborhood: string
  city: string
  complement: string
  date: string
  notes: string
}

export const emptyCheckoutForm: CheckoutForm = {
  name: '',
  phone: '',
  fulfillment: '',
  address: '',
  neighborhood: '',
  city: '',
  complement: '',
  date: '',
  notes: '',
}

export function validateCheckout(
  form: CheckoutForm,
  ctx: { today: string; minLeadDays: number; fulfillmentOptions: FulfillmentOption[] },
): FieldErrors<CheckoutForm> {
  const option = ctx.fulfillmentOptions.find((o) => o.enabled && o.id === form.fulfillment)
  const errors: FieldErrors<CheckoutForm> = {
    name: validateName(form.name),
    phone: validatePhone(form.phone),
    fulfillment: option ? undefined : 'Escolha como deseja receber o pedido.',
    date: validateDesiredDate(form.date, ctx.today, ctx.minLeadDays),
    notes: maxLength(form.notes, 500, 'As observações'),
  }
  if (option?.requiresAddress) {
    if (!form.address.trim()) errors.address = 'Informe rua e número para entrega.'
    if (!form.neighborhood.trim()) errors.neighborhood = 'Informe o bairro.'
    if (!form.city.trim()) errors.city = 'Informe a cidade.'
    errors.complement = maxLength(form.complement, 120, 'O complemento')
  }
  return compact(errors)
}

export interface CustomOrderForm {
  name: string
  phone: string
  occasion: string
  guests: string
  size: string
  dough: string
  filling: string
  frosting: string
  theme: string
  date: string
  notes: string
  reference: string
}

export const emptyCustomOrderForm: CustomOrderForm = {
  name: '',
  phone: '',
  occasion: '',
  guests: '',
  size: '',
  dough: '',
  filling: '',
  frosting: '',
  theme: '',
  date: '',
  notes: '',
  reference: '',
}

export function validateCustomOrder(
  form: CustomOrderForm,
  ctx: { today: string; minLeadDays: number; maxGuests: number },
): FieldErrors<CustomOrderForm> {
  const guests = Number(form.guests)
  let guestsError: string | undefined
  if (!form.guests.trim()) guestsError = 'Informe a quantidade aproximada de pessoas.'
  else if (!Number.isInteger(guests) || guests < 1 || guests > ctx.maxGuests)
    guestsError = `Informe um número inteiro entre 1 e ${ctx.maxGuests}.`

  return compact<CustomOrderForm>({
    name: validateName(form.name),
    phone: validatePhone(form.phone),
    occasion: form.occasion ? undefined : 'Escolha o tipo de ocasião.',
    guests: guestsError,
    dough: form.dough ? undefined : 'Escolha a massa.',
    filling: form.filling ? undefined : 'Escolha o recheio.',
    frosting: form.frosting ? undefined : 'Escolha a cobertura.',
    theme: maxLength(form.theme, 200, 'O tema'),
    date: validateDesiredDate(form.date, ctx.today, ctx.minLeadDays),
    notes: maxLength(form.notes, 800, 'As observações'),
    reference: maxLength(form.reference, 300, 'A referência'),
  })
}
