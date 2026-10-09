import { formatBRL } from '@/lib/money'
import { hasOptions, startingPrice } from '@/lib/pricing'
import type { Product } from '@/types'

export function PriceTag({ product, className = '' }: { product: Product; className?: string }) {
  const price = startingPrice(product)
  if (price === null) {
    return <span className={`font-semibold text-rose-ink ${className}`}>Orçamento sob consulta</span>
  }
  return (
    <span className={`inline-flex flex-col ${className}`}>
      {hasOptions(product) && <span className="text-xs font-medium text-choco-soft">a partir de</span>}
      <span className="font-semibold whitespace-nowrap tabular-nums">{formatBRL(price)}</span>
    </span>
  )
}
