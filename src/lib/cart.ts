import type { Coupon, FulfillmentOption } from '@/config/store'
import type { Cents, OptionSelection, Product, PurchasableProduct } from '@/types'
import { evaluateCoupon } from './coupons'
import { multiplyCents, sumCents } from './money'
import { describeSelection, isPurchasable, resolveSelection, unitPrice } from './pricing'

/**
 * Regras puras do carrinho. O carrinho guarda apenas identificadores, opções e quantidades;
 * preços são sempre recalculados a partir do catálogo (nunca confiamos em valores salvos).
 */

export interface CartLine {
  productId: string
  selection: OptionSelection
  quantity: number
}

export interface CartLineDetail extends CartLine {
  key: string
  product: PurchasableProduct
  unitPrice: Cents
  subtotal: Cents
  selectionLabels: { group: string; choice: string }[]
}

export type CartResult = { ok: true; lines: CartLine[] } | { ok: false; error: string }

export type ProductLookup = (id: string) => Product | undefined

/** Chave estável: mesmo produto com opções diferentes gera linhas diferentes. */
export function lineKey(productId: string, selection: OptionSelection): string {
  const parts = Object.keys(selection)
    .sort()
    .map((k) => `${k}=${selection[k]}`)
  return parts.length ? `${productId}|${parts.join(';')}` : productId
}

export function isValidQuantity(quantity: number, max: number): boolean {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= max
}

function quantityError(max: number): string {
  return `A quantidade deve ser um número inteiro entre 1 e ${max}.`
}

export function addLine(
  lines: CartLine[],
  input: { productId: string; selection?: OptionSelection; quantity: number },
  lookup: ProductLookup,
  maxQuantity: number,
): CartResult {
  const product = lookup(input.productId)
  if (!product) return { ok: false, error: 'Produto não encontrado.' }
  if (!isPurchasable(product)) return { ok: false, error: 'Este produto é feito sob orçamento. Solicite uma proposta.' }
  if (!product.available) return { ok: false, error: 'Este produto está indisponível no momento.' }
  if (!isValidQuantity(input.quantity, maxQuantity)) return { ok: false, error: quantityError(maxQuantity) }

  const resolved = resolveSelection(product, input.selection)
  if (!resolved.ok) return resolved

  const key = lineKey(product.id, resolved.selection)
  const existing = lines.find((l) => lineKey(l.productId, l.selection) === key)
  if (existing) {
    const quantity = existing.quantity + input.quantity
    if (quantity > maxQuantity) {
      return { ok: false, error: `Limite de ${maxQuantity} unidades por item. Para quantidades maiores, fale com a confeitaria.` }
    }
    return { ok: true, lines: lines.map((l) => (l === existing ? { ...l, quantity } : l)) }
  }
  return { ok: true, lines: [...lines, { productId: product.id, selection: resolved.selection, quantity: input.quantity }] }
}

export function setLineQuantity(lines: CartLine[], key: string, quantity: number, maxQuantity: number): CartResult {
  if (!isValidQuantity(quantity, maxQuantity)) return { ok: false, error: quantityError(maxQuantity) }
  if (!lines.some((l) => lineKey(l.productId, l.selection) === key)) return { ok: false, error: 'Item não encontrado no carrinho.' }
  return { ok: true, lines: lines.map((l) => (lineKey(l.productId, l.selection) === key ? { ...l, quantity } : l)) }
}

export function removeLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((l) => lineKey(l.productId, l.selection) !== key)
}

/**
 * Reconstrói o carrinho salvo, descartando itens inexistentes, indisponíveis, sob orçamento,
 * com opções inválidas ou quantidades fora do limite. Linhas repetidas são unificadas.
 */
export function sanitizeLines(raw: unknown, lookup: ProductLookup, maxQuantity: number): CartLine[] {
  if (!Array.isArray(raw)) return []
  let lines: CartLine[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const { productId, selection, quantity } = item as Record<string, unknown>
    if (typeof productId !== 'string' || typeof quantity !== 'number') continue
    const safeSelection =
      selection && typeof selection === 'object' && !Array.isArray(selection)
        ? Object.fromEntries(Object.entries(selection).filter((e): e is [string, string] => typeof e[1] === 'string'))
        : {}
    const result = addLine(lines, { productId, selection: safeSelection, quantity }, lookup, maxQuantity)
    if (result.ok) lines = result.lines
  }
  return lines
}

export function detailLines(lines: CartLine[], lookup: ProductLookup): CartLineDetail[] {
  return lines.flatMap((line) => {
    const product = lookup(line.productId)
    if (!product || !isPurchasable(product)) return []
    const price = unitPrice(product, line.selection)
    return [
      {
        ...line,
        key: lineKey(line.productId, line.selection),
        product,
        unitPrice: price,
        subtotal: multiplyCents(price, line.quantity),
        selectionLabels: describeSelection(product, line.selection),
      },
    ]
  })
}

export interface CartTotals {
  itemCount: number
  subtotal: Cents
  discount: Cents
  couponCode: string | null
  couponError: string | null
  /** `null` quando o valor do frete depende do atendimento. */
  shipping: Cents | null
  /** Total conhecido (sem frete a confirmar). */
  total: Cents
  shippingPending: boolean
}

export function computeTotals(
  details: CartLineDetail[],
  options: { couponCode?: string | null; coupons: Coupon[]; fulfillment?: FulfillmentOption | null },
): CartTotals {
  const subtotal = sumCents(details.map((d) => d.subtotal))
  const itemCount = details.reduce((acc, d) => acc + d.quantity, 0)

  let discount = 0
  let couponCode: string | null = null
  let couponError: string | null = null
  if (options.couponCode) {
    const result = evaluateCoupon(options.couponCode, subtotal, options.coupons)
    if (result.ok) {
      discount = result.discount
      couponCode = result.coupon.code
    } else {
      couponError = result.error
    }
  }

  const fee = options.fulfillment ? options.fulfillment.fee : 0
  const shipping = fee
  const shippingPending = fee === null
  const total = subtotal - discount + (fee ?? 0)

  return { itemCount, subtotal, discount, couponCode, couponError, shipping, total, shippingPending }
}
