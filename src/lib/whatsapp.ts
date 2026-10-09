import type { CartLineDetail, CartTotals } from './cart'
import { formatDateBR } from './dates'
import { formatBRL } from './money'
import type { CheckoutForm, CustomOrderForm } from './validation'

export type WhatsappStatus = { ok: true; number: string } | { ok: false; reason: string }

/** Número em formato internacional, apenas dígitos (DDI + DDD + número): 10 a 15 dígitos. */
export function getWhatsappStatus(rawNumber: string | null | undefined): WhatsappStatus {
  const number = (rawNumber ?? '').replace(/\D/g, '')
  if (!number) {
    return { ok: false, reason: 'O número de WhatsApp da confeitaria ainda não foi configurado.' }
  }
  if (number.length < 10 || number.length > 15) {
    return { ok: false, reason: 'O número de WhatsApp configurado é inválido. Use DDI + DDD + número, apenas dígitos.' }
  }
  return { ok: true, number }
}

/** Monta a URL do WhatsApp com a mensagem codificada. Retorna `null` se o número for inválido. */
export function buildWhatsappUrl(rawNumber: string | null | undefined, message: string): string | null {
  const status = getWhatsappStatus(rawNumber)
  if (!status.ok) return null
  return `https://wa.me/${status.number}?text=${encodeURIComponent(message)}`
}

const line = (label: string, value: string | undefined | null) => (value && value.trim() ? `${label}: ${value.trim()}` : null)

export interface OrderMessageInput {
  storeName: string
  lines: CartLineDetail[]
  totals: CartTotals
  form: CheckoutForm
  fulfillmentLabel: string
}

export function buildOrderMessage({ storeName, lines, totals, form, fulfillmentLabel }: OrderMessageInput): string {
  const items = lines.map((l, i) => {
    const opts = l.selectionLabels.map((s) => `${s.group}: ${s.choice}`).join('; ')
    return [
      `${i + 1}. ${l.product.name}${opts ? ` (${opts})` : ''}`,
      `   ${l.quantity} x ${formatBRL(l.unitPrice)} = ${formatBRL(l.subtotal)}`,
    ].join('\n')
  })

  const summary = [
    `Subtotal: ${formatBRL(totals.subtotal)}`,
    totals.discount > 0 ? `Desconto (cupom ${totals.couponCode}): -${formatBRL(totals.discount)}` : null,
    totals.shippingPending
      ? 'Entrega: valor a confirmar pelo atendimento'
      : totals.shipping
        ? `Entrega: ${formatBRL(totals.shipping)}`
        : null,
    totals.shippingPending
      ? `Total estimado: ${formatBRL(totals.total)} + taxa de entrega`
      : `Total estimado: ${formatBRL(totals.total)}`,
  ]

  const address =
    form.fulfillment === 'delivery'
      ? [form.address, form.neighborhood, form.city].map((s) => s.trim()).filter(Boolean).join(', ') +
        (form.complement.trim() ? ` (${form.complement.trim()})` : '')
      : null

  const customer = [
    line('Nome', form.name),
    line('Contato', form.phone),
    line('Recebimento', fulfillmentLabel),
    line('Endereço', address),
    line('Data desejada', formatDateBR(form.date)),
    line('Observações', form.notes),
  ]

  return [
    `Olá, ${storeName}! Gostaria de fazer um pedido pelo site.`,
    '',
    '*Itens*',
    ...items,
    '',
    '*Resumo*',
    ...summary,
    '',
    '*Dados do pedido*',
    ...customer,
    '',
    'Aguardo a confirmação de disponibilidade, valores finais e forma de pagamento.',
  ]
    .filter((l): l is string => l !== null)
    .join('\n')
}

export function buildCustomOrderMessage(storeName: string, form: CustomOrderForm): string {
  return [
    `Olá, ${storeName}! Gostaria de solicitar um orçamento de bolo personalizado.`,
    '',
    '*Encomenda*',
    line('Ocasião', form.occasion),
    line('Quantidade de pessoas', form.guests),
    line('Tamanho', form.size),
    line('Massa', form.dough),
    line('Recheio', form.filling),
    line('Cobertura', form.frosting),
    line('Tema / decoração', form.theme),
    line('Data desejada', formatDateBR(form.date)),
    line('Referência', form.reference),
    line('Observações', form.notes),
    '',
    '*Contato*',
    line('Nome', form.name),
    line('Telefone', form.phone),
    '',
    'Sei que valor, data e disponibilidade dependem da confirmação da confeitaria.',
  ]
    .filter((l): l is string => l !== null)
    .join('\n')
}
