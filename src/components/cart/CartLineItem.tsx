import { useState } from 'react'
import { Link } from 'react-router'
import { useCart } from '@/context/cart-context'
import type { CartLineDetail } from '@/lib/cart'
import { formatBRL } from '@/lib/money'
import { ProductImage } from '../product/ProductImage'
import { Icon } from '../ui/Icon'
import { QuantityInput } from '../ui/QuantityInput'

export function CartLineItem({ line }: { line: CartLineDetail }) {
  const { updateQuantity, removeItem, maxQuantity } = useCart()
  const [error, setError] = useState<string | null>(null)
  const image = line.product.images[0]!

  return (
    <li className="flex gap-4 py-6 sm:gap-6">
      <Link to={`/bolos/${line.product.slug}`} className="shrink-0" tabIndex={-1} aria-hidden="true">
        <ProductImage src={image.src} alt="" width={160} height={200} className="h-30 w-24 rounded-2xl sm:h-36 sm:w-28" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-serif text-2xl leading-tight">
            <Link to={`/bolos/${line.product.slug}`} className="hover:text-rose-ink">
              {line.product.name}
            </Link>
          </h3>
          {line.selectionLabels.length > 0 && (
            <ul className="mt-1 text-sm text-choco-soft">
              {line.selectionLabels.map((s) => (
                <li key={s.group}>
                  {s.group}: {s.choice}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-1 text-sm text-choco-soft tabular-nums">{formatBRL(line.unitPrice)} cada</p>
          {error && (
            <p role="alert" className="mt-2 text-sm text-red-800">
              {error}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <QuantityInput
            size="sm"
            label={`Quantidade de ${line.product.name}`}
            value={line.quantity}
            max={maxQuantity}
            onChange={(q) => {
              const result = updateQuantity(line.key, q)
              setError(result.ok ? null : result.error)
            }}
          />
          <p className="font-semibold tabular-nums">
            <span className="sr-only">Subtotal: </span>
            {formatBRL(line.subtotal)}
          </p>
          <button
            type="button"
            onClick={() => removeItem(line.key)}
            className="inline-flex items-center gap-1 text-sm text-choco-soft hover:text-red-800"
          >
            <Icon name="trash" className="size-4" />
            Remover <span className="sr-only">{line.product.name}</span>
          </button>
        </div>
      </div>
    </li>
  )
}
