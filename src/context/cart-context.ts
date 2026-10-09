import { createContext, useContext } from 'react'
import type { CartLineDetail, CartResult, CartTotals } from '@/lib/cart'
import type { CouponResult } from '@/lib/coupons'
import type { OptionSelection } from '@/types'

export interface CartContextValue {
  lines: CartLineDetail[]
  totals: CartTotals
  itemCount: number
  maxQuantity: number
  couponCode: string | null
  addItem: (input: { productId: string; selection?: OptionSelection; quantity: number }) => CartResult
  updateQuantity: (key: string, quantity: number) => CartResult
  removeItem: (key: string) => void
  clear: () => void
  applyCoupon: (code: string) => CouponResult
  removeCoupon: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>')
  return ctx
}
