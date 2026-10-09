import type { ReactNode } from 'react'
import type { CartTotals } from '@/lib/cart'
import { formatBRL } from '@/lib/money'

interface OrderSummaryProps {
  totals: CartTotals
  /** Texto exibido na linha de entrega. `undefined` oculta a linha. */
  shippingLabel?: string
  children?: ReactNode
}

export function OrderSummary({ totals, shippingLabel, children }: OrderSummaryProps) {
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-choco-soft">
          Subtotal ({totals.itemCount} {totals.itemCount === 1 ? 'item' : 'itens'})
        </dt>
        <dd className="font-medium tabular-nums">{formatBRL(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between gap-4 text-emerald-800">
          <dt>Desconto ({totals.couponCode})</dt>
          <dd className="font-medium tabular-nums">−{formatBRL(totals.discount)}</dd>
        </div>
      )}
      {shippingLabel !== undefined && (
        <div className="flex justify-between gap-4">
          <dt className="text-choco-soft">Entrega</dt>
          <dd className="text-right font-medium">{shippingLabel}</dd>
        </div>
      )}
      {children}
      <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <dt className="font-semibold">{totals.shippingPending ? 'Total estimado' : 'Total'}</dt>
        <dd className="text-right">
          <span className="font-serif text-3xl font-semibold tabular-nums">{formatBRL(totals.total)}</span>
          {totals.shippingPending && <span className="block text-xs text-choco-soft">+ taxa de entrega a confirmar</span>}
        </dd>
      </div>
    </dl>
  )
}
