import { useState } from 'react'
import { Icon } from './Icon'

interface QuantityInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max: number
  label: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

/** Controle de quantidade que só emite inteiros dentro do intervalo permitido. */
export function QuantityInput({ value, onChange, min = 1, max, label, disabled, size = 'md' }: QuantityInputProps) {
  // Texto em edição; `null` exibe o valor confirmado.
  const [draft, setDraft] = useState<string | null>(null)

  const commit = (raw: string) => {
    const n = Number(raw)
    if (raw.trim() !== '' && Number.isInteger(n) && n >= min && n <= max && n !== value) onChange(n)
    setDraft(null)
  }

  const btn =
    'grid place-items-center rounded-full text-choco transition hover:bg-blush disabled:cursor-not-allowed disabled:opacity-40 ' +
    (size === 'sm' ? 'size-8' : 'size-10')

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-white p-1" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={disabled || value <= min} aria-label="Diminuir quantidade">
        <Icon name="minus" className="size-4" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        className={`${size === 'sm' ? 'w-8' : 'w-10'} bg-transparent text-center font-semibold tabular-nums focus:outline-none`}
        value={draft ?? String(value)}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 3))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit(e.currentTarget.value)
          }
        }}
      />
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={disabled || value >= max} aria-label="Aumentar quantidade">
        <Icon name="plus" className="size-4" />
      </button>
    </div>
  )
}
