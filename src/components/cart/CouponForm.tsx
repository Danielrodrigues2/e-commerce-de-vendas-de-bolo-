import { useState, type FormEvent } from 'react'
import { useCart } from '@/context/cart-context'
import { Button } from '../ui/Button'

export function CouponForm() {
  const { couponCode, applyCoupon, removeCoupon, totals } = useCart()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const result = applyCoupon(code)
    if (result.ok) {
      setError(null)
      setCode('')
    } else {
      setError(result.error)
    }
  }

  if (couponCode) {
    return (
      <div className="rounded-2xl bg-cream p-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <p>
            Cupom <strong>{couponCode}</strong> {totals.couponError ? 'não se aplica' : 'aplicado'}
          </p>
          <button type="button" onClick={removeCoupon} className="font-semibold text-rose-ink underline-offset-2 hover:underline">
            Remover
          </button>
        </div>
        {totals.couponError && (
          <p className="mt-1 text-red-800" role="alert">
            {totals.couponError}
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="cupom" className="text-sm font-semibold">
        Cupom de desconto
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="cupom"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError(null)
          }}
          autoComplete="off"
          autoCapitalize="characters"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'cupom-erro' : undefined}
          className="h-11 min-w-0 flex-1 rounded-full border border-line bg-white px-4 text-sm uppercase focus:border-rose-ink focus:ring-2 focus:ring-rose/30 focus:outline-none"
        />
        <Button type="submit" variant="secondary" disabled={!code.trim()}>
          Aplicar
        </Button>
      </div>
      {error && (
        <p id="cupom-erro" role="alert" className="mt-2 text-sm text-red-800">
          {error}
        </p>
      )}
    </form>
  )
}
