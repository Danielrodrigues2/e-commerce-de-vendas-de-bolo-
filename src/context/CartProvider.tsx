import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { storeConfig, type Coupon } from '@/config/store'
import { getProductById } from '@/data/products'
import {
  addLine,
  computeTotals,
  detailLines,
  removeLine,
  sanitizeLines,
  setLineQuantity,
  type CartLine,
  type ProductLookup,
} from '@/lib/cart'
import { evaluateCoupon, normalizeCouponCode } from '@/lib/coupons'
import { readJSON, writeJSON } from '@/lib/storage'
import { CartContext, type CartContextValue } from './cart-context'

export const CART_STORAGE_KEY = 'doce-encanto:carrinho:v1'

interface StoredCart {
  version: 1
  lines: unknown
  couponCode?: unknown
}

interface CartProviderProps {
  children: ReactNode
  storageKey?: string
  lookup?: ProductLookup
  coupons?: Coupon[]
  maxQuantity?: number
}

interface CartState {
  lines: CartLine[]
  couponCode: string | null
}

function loadCart(key: string, lookup: ProductLookup, maxQuantity: number, coupons: Coupon[]): CartState {
  const stored = readJSON<StoredCart>(key)
  if (!stored || stored.version !== 1) return { lines: [], couponCode: null }
  const code = typeof stored.couponCode === 'string' ? normalizeCouponCode(stored.couponCode) : null
  return {
    lines: sanitizeLines(stored.lines, lookup, maxQuantity),
    // Só mantém cupons que ainda existem na configuração.
    couponCode: code && coupons.some((c) => normalizeCouponCode(c.code) === code) ? code : null,
  }
}

/**
 * Carrinho local ao navegador (localStorage). Não representa um pedido registrado na loja.
 */
export function CartProvider({
  children,
  storageKey = CART_STORAGE_KEY,
  lookup = getProductById,
  coupons = storeConfig.coupons,
  maxQuantity = storeConfig.maxQuantityPerItem,
}: CartProviderProps) {
  const [state, setState] = useState<CartState>(() => loadCart(storageKey, lookup, maxQuantity, coupons))
  // Referência síncrona ao estado atual para que as ações possam retornar o resultado da validação.
  const stateRef = useRef(state)

  const commit = useCallback((next: CartState) => {
    stateRef.current = next
    setState(next)
  }, [])

  useEffect(() => {
    writeJSON(storageKey, { version: 1, lines: state.lines, couponCode: state.couponCode } satisfies StoredCart)
  }, [state, storageKey])

  // Mantém abas diferentes sincronizadas.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) commit(loadCart(storageKey, lookup, maxQuantity, coupons))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey, lookup, maxQuantity, coupons, commit])

  const lines = useMemo(() => detailLines(state.lines, lookup), [state.lines, lookup])
  const totals = useMemo(
    () => computeTotals(lines, { couponCode: state.couponCode, coupons }),
    [lines, state.couponCode, coupons],
  )

  const value = useMemo<CartContextValue>(() => {
    const current = () => stateRef.current
    return {
      lines,
      totals,
      itemCount: totals.itemCount,
      maxQuantity,
      couponCode: state.couponCode,
      addItem: (input) => {
        const result = addLine(current().lines, input, lookup, maxQuantity)
        if (result.ok) commit({ ...current(), lines: result.lines })
        return result
      },
      updateQuantity: (key, quantity) => {
        const result = setLineQuantity(current().lines, key, quantity, maxQuantity)
        if (result.ok) commit({ ...current(), lines: result.lines })
        return result
      },
      removeItem: (key) => {
        const remaining = removeLine(current().lines, key)
        commit({ lines: remaining, couponCode: remaining.length ? current().couponCode : null })
      },
      clear: () => commit({ lines: [], couponCode: null }),
      applyCoupon: (code) => {
        const subtotal = computeTotals(detailLines(current().lines, lookup), { coupons }).subtotal
        const result = evaluateCoupon(code, subtotal, coupons)
        if (result.ok) commit({ ...current(), couponCode: normalizeCouponCode(result.coupon.code) })
        return result
      },
      removeCoupon: () => commit({ ...current(), couponCode: null }),
    }
  }, [lines, totals, maxQuantity, state.couponCode, lookup, coupons, commit])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
