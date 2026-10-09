import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { Icon } from '../ui/Icon'

/** Pesquisa global: leva ao catálogo preservando os filtros já aplicados nele. */
export function SearchForm({ id, onSubmitted, className = '' }: { id: string; onSubmitted?: () => void; className?: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const onCatalog = location.pathname === '/bolos'
  const [value, setValue] = useState(onCatalog ? (params.get('q') ?? '') : '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next = new URLSearchParams(onCatalog ? params : undefined)
    const q = value.trim()
    if (q) next.set('q', q)
    else next.delete('q')
    const qs = next.toString()
    navigate(`/bolos${qs ? `?${qs}` : ''}`)
    onSubmitted?.()
  }

  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Pesquisar bolos
      </label>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Pesquisar bolos"
        className="h-11 w-full rounded-full border border-line bg-white pr-11 pl-4 text-sm text-choco placeholder:text-choco-soft/80 focus:border-rose-ink focus:ring-2 focus:ring-rose/30 focus:outline-none"
      />
      <button type="submit" className="absolute top-1 right-1 grid size-9 place-items-center rounded-full text-choco hover:bg-blush" aria-label="Pesquisar">
        <Icon name="search" className="size-4.5" />
      </button>
    </form>
  )
}
