import { testCoupons } from '@/test/fixtures'
import { evaluateCoupon } from '../coupons'

describe('cupons', () => {
  it('aceita código configurado sem diferenciar maiúsculas e espaços', () => {
    expect(evaluateCoupon('  dez ', 20000, testCoupons)).toMatchObject({ ok: true, discount: 2000 })
  })
  it('rejeita códigos arbitrários e vazios', () => {
    expect(evaluateCoupon('DESCONTO50', 20000, testCoupons).ok).toBe(false)
    expect(evaluateCoupon('', 20000, testCoupons).ok).toBe(false)
    expect(evaluateCoupon('DEZ', 20000, []).ok).toBe(false)
  })
  it('nunca desconta mais que o subtotal', () => {
    expect(evaluateCoupon('CINCO', 300, testCoupons)).toMatchObject({ ok: true, discount: 300 })
  })
})
