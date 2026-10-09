import { storeConfig } from '@/config/store'
import { addDays } from '../dates'
import {
  emptyCheckoutForm,
  emptyCustomOrderForm,
  isValidBrazilianPhone,
  validateCheckout,
  validateCustomOrder,
  type CheckoutForm,
} from '../validation'

const today = '2026-10-09'
const ctx = { today, minLeadDays: 2, fulfillmentOptions: storeConfig.fulfillment }

const validPickup: CheckoutForm = { ...emptyCheckoutForm, name: 'Ana Souza', phone: '(11) 91234-5678', fulfillment: 'pickup', date: '2026-10-12' }

describe('validação', () => {
  it('telefones brasileiros', () => {
    expect(isValidBrazilianPhone('(11) 91234-5678')).toBe(true)
    expect(isValidBrazilianPhone('1132345678')).toBe(true)
    expect(isValidBrazilianPhone('+55 11 91234-5678')).toBe(true)
    expect(isValidBrazilianPhone('91234-5678')).toBe(false)
    expect(isValidBrazilianPhone('11 81234-5678')).toBe(false)
    expect(isValidBrazilianPhone('abc')).toBe(false)
  })

  it('exige campos obrigatórios do checkout', () => {
    const errors = validateCheckout(emptyCheckoutForm, ctx)
    expect(Object.keys(errors).sort()).toEqual(['date', 'fulfillment', 'name', 'phone'])
    expect(validateCheckout(validPickup, ctx)).toEqual({})
  })

  it('exige endereço somente para entrega', () => {
    const errors = validateCheckout({ ...validPickup, fulfillment: 'delivery' }, ctx)
    expect(Object.keys(errors).sort()).toEqual(['address', 'city', 'neighborhood'])
    expect(
      validateCheckout({ ...validPickup, fulfillment: 'delivery', address: 'Rua A, 10', neighborhood: 'Centro', city: 'São Paulo' }, ctx),
    ).toEqual({})
  })

  it('respeita a antecedência mínima e datas válidas', () => {
    expect(validateCheckout({ ...validPickup, date: addDays(today, 1) }, ctx).date).toMatch(/antecedência/)
    expect(validateCheckout({ ...validPickup, date: '2026-02-30' }, ctx).date).toMatch(/válida/)
    expect(validateCheckout({ ...validPickup, date: addDays(today, 2) }, ctx).date).toBeUndefined()
  })

  it('valida encomenda personalizada', () => {
    const c = { today, minLeadDays: 2, maxGuests: 1000 }
    const errors = validateCustomOrder(emptyCustomOrderForm, c)
    expect(Object.keys(errors).sort()).toEqual(['date', 'dough', 'filling', 'frosting', 'guests', 'name', 'occasion', 'phone'])
    const ok = {
      ...emptyCustomOrderForm,
      name: 'Ana',
      phone: '11912345678',
      occasion: 'Aniversário',
      guests: '30',
      dough: 'Massa branca',
      filling: 'Brigadeiro',
      frosting: 'Chantilly',
      date: '2026-10-20',
    }
    expect(validateCustomOrder(ok, c)).toEqual({})
    expect(validateCustomOrder({ ...ok, guests: '0' }, c).guests).toBeDefined()
    expect(validateCustomOrder({ ...ok, guests: '2.5' }, c).guests).toBeDefined()
  })
})
