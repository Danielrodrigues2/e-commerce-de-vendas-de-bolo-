import type { Cents, ConfigurableProduct, OptionSelection, Product, PurchasableProduct } from '@/types'

export function isPurchasable(product: Product): product is PurchasableProduct {
  return product.pricing !== 'quote'
}

export function hasOptions(product: Product): product is ConfigurableProduct {
  return product.pricing === 'options'
}

export function defaultSelection(product: Product): OptionSelection {
  if (!hasOptions(product)) return {}
  return Object.fromEntries(product.options.map((g) => [g.id, g.defaultChoiceId]))
}

export type SelectionResult = { ok: true; selection: OptionSelection } | { ok: false; error: string }

/**
 * Valida e completa uma seleção de opções.
 * Grupos ausentes recebem a escolha padrão; grupos ou escolhas desconhecidos são rejeitados.
 */
export function resolveSelection(product: Product, selection: OptionSelection = {}): SelectionResult {
  if (!hasOptions(product)) {
    return Object.keys(selection).length === 0
      ? { ok: true, selection: {} }
      : { ok: false, error: 'Este produto não possui opções.' }
  }
  for (const groupId of Object.keys(selection)) {
    if (!product.options.some((g) => g.id === groupId)) {
      return { ok: false, error: 'Opção inválida para este produto.' }
    }
  }
  const resolved: OptionSelection = {}
  for (const group of product.options) {
    const choiceId = selection[group.id] ?? group.defaultChoiceId
    if (!group.choices.some((c) => c.id === choiceId)) {
      return { ok: false, error: `Escolha inválida em "${group.label}".` }
    }
    resolved[group.id] = choiceId
  }
  return { ok: true, selection: resolved }
}

/** Preço unitário em centavos = preço base + acréscimos explícitos das escolhas. */
export function unitPrice(product: PurchasableProduct, selection: OptionSelection): Cents {
  if (!hasOptions(product)) return product.price
  let total = product.price
  for (const group of product.options) {
    const choice = group.choices.find((c) => c.id === selection[group.id])
    if (choice) total += choice.priceDelta
  }
  return total
}

/** Menor preço possível ("a partir de"). `null` para produtos sob orçamento. */
export function startingPrice(product: Product): Cents | null {
  if (!isPurchasable(product)) return null
  if (!hasOptions(product)) return product.price
  return product.options.reduce(
    (acc, g) => acc + Math.min(...g.choices.map((c) => c.priceDelta)),
    product.price,
  )
}

export function describeSelection(product: Product, selection: OptionSelection): { group: string; choice: string }[] {
  if (!hasOptions(product)) return []
  return product.options.flatMap((g) => {
    const choice = g.choices.find((c) => c.id === selection[g.id])
    return choice ? [{ group: g.label, choice: choice.label }] : []
  })
}
