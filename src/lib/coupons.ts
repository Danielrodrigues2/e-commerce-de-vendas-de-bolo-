import type { Coupon } from '@/config/store'
import type { Cents } from '@/types'
import { formatBRL, percentOf } from './money'

export type CouponResult =
  | { ok: true; coupon: Coupon; discount: Cents }
  | { ok: false; error: string }

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase()
}

/** Aplica somente cupons presentes na configuração. Nunca retorna desconto maior que o subtotal. */
export function evaluateCoupon(code: string, subtotal: Cents, coupons: Coupon[]): CouponResult {
  const normalized = normalizeCouponCode(code)
  if (!normalized) return { ok: false, error: 'Informe um código de cupom.' }
  const coupon = coupons.find((c) => normalizeCouponCode(c.code) === normalized)
  if (!coupon) return { ok: false, error: 'Cupom inválido ou não disponível.' }
  if (coupon.minSubtotal !== undefined && subtotal < coupon.minSubtotal) {
    return { ok: false, error: `Este cupom vale para pedidos a partir de ${formatBRL(coupon.minSubtotal)}.` }
  }
  const raw = coupon.type === 'percent' ? percentOf(subtotal, coupon.value) : coupon.value
  const discount = Math.max(0, Math.min(raw, subtotal))
  return { ok: true, coupon, discount }
}
