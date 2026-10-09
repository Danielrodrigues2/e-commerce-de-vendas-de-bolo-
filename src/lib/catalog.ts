import type { Cents, Product } from '@/types'
import { startingPrice } from './pricing'
import { normalizeText } from './text'

export interface PriceRange {
  id: string
  label: string
  min: Cents
  max: Cents | null
}

/** Faixas de preço baseadas no menor preço do produto ("a partir de"). */
export const priceRanges: PriceRange[] = [
  { id: 'ate-100', label: 'Até R$ 100', min: 0, max: 10000 },
  { id: '100-a-130', label: 'R$ 100 a R$ 130', min: 10001, max: 13000 },
  { id: 'acima-de-130', label: 'Acima de R$ 130', min: 13001, max: null },
]

export const sortOptions = [
  { id: 'relevancia', label: 'Destaques' },
  { id: 'menor-preco', label: 'Menor preço' },
  { id: 'maior-preco', label: 'Maior preço' },
  { id: 'nome-az', label: 'Nome (A–Z)' },
  { id: 'nome-za', label: 'Nome (Z–A)' },
] as const

export type SortId = (typeof sortOptions)[number]['id']

export interface CatalogFilters {
  query?: string
  categoryId?: string | null
  priceRangeId?: string | null
  sort?: SortId
}

export function isSortId(value: string | null): value is SortId {
  return sortOptions.some((o) => o.id === value)
}

export function matchesQuery(product: Product, query: string): boolean {
  const terms = normalizeText(query).split(' ').filter(Boolean)
  if (terms.length === 0) return true
  const haystack = normalizeText(
    [product.name, product.shortDescription, product.description, ...(product.tags ?? [])].join(' '),
  )
  return terms.every((t) => haystack.includes(t))
}

export function matchesPriceRange(product: Product, rangeId: string | null | undefined): boolean {
  if (!rangeId) return true
  const range = priceRanges.find((r) => r.id === rangeId)
  if (!range) return true
  const price = startingPrice(product)
  // Produtos sob orçamento não têm preço definido e não entram em filtros de preço.
  if (price === null) return false
  return price >= range.min && (range.max === null || price <= range.max)
}

/** Aplica pesquisa, categoria e faixa de preço em conjunto, e então ordena. */
export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const result = products.filter(
    (p) =>
      matchesQuery(p, filters.query ?? '') &&
      (!filters.categoryId || p.categoryId === filters.categoryId) &&
      matchesPriceRange(p, filters.priceRangeId),
  )
  return sortProducts(result, filters.sort ?? 'relevancia')
}

export function sortProducts(products: Product[], sort: SortId): Product[] {
  const list = [...products]
  const priceOf = (p: Product) => startingPrice(p)
  const byPrice = (dir: 1 | -1) => (a: Product, b: Product) => {
    const pa = priceOf(a)
    const pb = priceOf(b)
    if (pa === null && pb === null) return 0
    if (pa === null) return 1 // sob orçamento sempre ao final
    if (pb === null) return -1
    return (pa - pb) * dir
  }
  const byName = (dir: 1 | -1) => (a: Product, b: Product) => a.name.localeCompare(b.name, 'pt-BR') * dir
  switch (sort) {
    case 'menor-preco':
      return list.sort(byPrice(1))
    case 'maior-preco':
      return list.sort(byPrice(-1))
    case 'nome-az':
      return list.sort(byName(1))
    case 'nome-za':
      return list.sort(byName(-1))
    default:
      // Destaques: mantém a ordem do catálogo, com indisponíveis ao final.
      return list.sort((a, b) => Number(b.available) - Number(a.available))
  }
}
