import { lookup, testCoupons } from '@/test/fixtures'
import { addLine, computeTotals, detailLines } from '../cart'
import { emptyCheckoutForm, emptyCustomOrderForm } from '../validation'
import { buildCustomOrderMessage, buildOrderMessage, buildWhatsappUrl, getWhatsappStatus } from '../whatsapp'

function sampleOrder(fee: number | null = null) {
  let lines = addLine([], { productId: 'opcoes', selection: { tamanho: 'grande' }, quantity: 2 }, lookup, 10)
  if (!lines.ok) throw new Error()
  lines = addLine(lines.lines, { productId: 'fixo', quantity: 1 }, lookup, 10)
  if (!lines.ok) throw new Error()
  const details = detailLines(lines.lines, lookup)
  const fulfillment = { id: 'delivery' as const, label: 'Entrega', description: '', enabled: true, requiresAddress: true, fee }
  const totals = computeTotals(details, { couponCode: 'DEZ', coupons: testCoupons, fulfillment })
  const form = {
    ...emptyCheckoutForm,
    name: 'Ana & Cia',
    phone: '(11) 91234-5678',
    fulfillment: 'delivery' as const,
    address: 'Rua das Flores, 10',
    neighborhood: 'Centro',
    city: 'São Paulo',
    complement: 'Apto 2',
    date: '2026-10-15',
    notes: 'Escrever "Parabéns, Lia!" #1',
  }
  return buildOrderMessage({ storeName: 'Doce Encanto Confeitaria', lines: details, totals, form, fulfillmentLabel: 'Entrega' })
}

describe('WhatsApp', () => {
  it('gera mensagem consistente com o carrinho', () => {
    const msg = sampleOrder()
    expect(msg).toContain('1. Bolo com Opções (Tamanho: Grande)')
    expect(msg).toContain('2 x R$ 150,00 = R$ 300,00')
    expect(msg).toContain('2. Bolo Fixo')
    expect(msg).toContain('1 x R$ 89,90 = R$ 89,90')
    expect(msg).toContain('Subtotal: R$ 389,90')
    expect(msg).toContain('Desconto (cupom DEZ): -R$ 38,99')
    expect(msg).toContain('Entrega: valor a confirmar pelo atendimento')
    expect(msg).toContain('Total estimado: R$ 350,91 + taxa de entrega')
    expect(msg).toContain('Endereço: Rua das Flores, 10, Centro, São Paulo (Apto 2)')
    expect(msg).toContain('Data desejada: 15/10/2026')
    expect(msg).not.toMatch(/confirmado|pago/i)
  })

  it('inclui frete quando há regra fixa', () => {
    expect(sampleOrder(1500)).toContain('Entrega: R$ 15,00')
    expect(sampleOrder(1500)).toContain('Total estimado: R$ 365,91')
  })

  it('codifica a mensagem na URL', () => {
    const msg = sampleOrder()
    const url = buildWhatsappUrl('55 (11) 99999-0000', msg)!
    expect(url.startsWith('https://wa.me/5511999990000?text=')).toBe(true)
    const encoded = url.split('?text=')[1]!
    expect(encoded).not.toMatch(/[\s&#"]/)
    expect(decodeURIComponent(encoded)).toBe(msg)
  })

  it('trata ausência ou número inválido', () => {
    expect(getWhatsappStatus('')).toMatchObject({ ok: false })
    expect(getWhatsappStatus(undefined)).toMatchObject({ ok: false })
    expect(getWhatsappStatus('12345')).toMatchObject({ ok: false })
    expect(buildWhatsappUrl('', 'oi')).toBeNull()
    expect(getWhatsappStatus('5511999990000')).toEqual({ ok: true, number: '5511999990000' })
  })

  it('gera resumo da encomenda personalizada', () => {
    const msg = buildCustomOrderMessage('Doce Encanto', {
      ...emptyCustomOrderForm,
      name: 'Ana',
      phone: '11912345678',
      occasion: 'Aniversário',
      guests: '30',
      dough: 'Massa branca',
      filling: 'Brigadeiro',
      frosting: 'Chantilly',
      date: '2026-10-20',
    })
    expect(msg).toContain('Ocasião: Aniversário')
    expect(msg).toContain('Quantidade de pessoas: 30')
    expect(msg).toContain('Data desejada: 20/10/2026')
    expect(msg).not.toContain('Tema') // campos vazios não aparecem
    expect(msg).toContain('dependem da confirmação da confeitaria')
  })
})
