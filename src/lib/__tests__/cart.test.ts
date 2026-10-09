import { fixedCake, lookup, optionCake, testCoupons } from '@/test/fixtures'
import { addLine, computeTotals, detailLines, lineKey, removeLine, sanitizeLines, setLineQuantity, type CartLine } from '../cart'

const MAX = 10
function add(lines: CartLine[], productId: string, quantity = 1, selection = {}) {
  const r = addLine(lines, { productId, quantity, selection }, lookup, MAX)
  if (!r.ok) throw new Error(r.error)
  return r.lines
}

describe('carrinho', () => {
  it('adiciona um produto', () => {
    const lines = add([], 'fixo')
    expect(lines).toEqual([{ productId: 'fixo', selection: {}, quantity: 1 }])
  })

  it('soma quantidade ao adicionar o mesmo produto com as mesmas opções', () => {
    const lines = add(add([], 'fixo', 2), 'fixo', 3)
    expect(lines).toHaveLength(1)
    expect(lines[0]!.quantity).toBe(5)
  })

  it('mantém configurações diferentes em linhas separadas', () => {
    let lines = add([], 'opcoes', 1, { tamanho: 'padrao' })
    lines = add(lines, 'opcoes', 1, { tamanho: 'grande' })
    lines = add(lines, 'opcoes', 1, {}) // padrão implícito agrupa com "padrao"
    expect(lines).toHaveLength(2)
    expect(lines[0]!.quantity).toBe(2)
  })

  it('altera quantidade e remove itens', () => {
    const lines = add([], 'fixo')
    const key = lineKey('fixo', {})
    const updated = setLineQuantity(lines, key, 4, MAX)
    expect(updated.ok && updated.lines[0]!.quantity).toBe(4)
    expect(removeLine(lines, key)).toEqual([])
  })

  it('impede quantidades inválidas', () => {
    for (const q of [0, -1, 1.5, NaN, 11]) {
      expect(addLine([], { productId: 'fixo', quantity: q }, lookup, MAX).ok).toBe(false)
    }
    const lines = add([], 'fixo', 9)
    expect(addLine(lines, { productId: 'fixo', quantity: 2 }, lookup, MAX).ok).toBe(false)
    expect(setLineQuantity(lines, lineKey('fixo', {}), 0, MAX).ok).toBe(false)
  })

  it('impede itens indisponíveis, sob orçamento ou inexistentes', () => {
    expect(addLine([], { productId: 'indisponivel', quantity: 1 }, lookup, MAX).ok).toBe(false)
    expect(addLine([], { productId: 'orcamento', quantity: 1 }, lookup, MAX).ok).toBe(false)
    expect(addLine([], { productId: 'nao-existe', quantity: 1 }, lookup, MAX).ok).toBe(false)
  })

  it('calcula subtotais e total em centavos', () => {
    let lines = add([], 'fixo', 3) // 3 x 89,90 = 269,70
    lines = add(lines, 'opcoes', 2, { tamanho: 'grande' }) // 2 x 150,00 = 300,00
    const details = detailLines(lines, lookup)
    expect(details.map((d) => d.subtotal)).toEqual([26970, 30000])
    const totals = computeTotals(details, { coupons: [] })
    expect(totals).toMatchObject({ subtotal: 56970, discount: 0, total: 56970, itemCount: 5 })
  })

  it('aplica apenas cupons configurados', () => {
    const details = detailLines(add([], 'opcoes', 2), lookup) // 200,00
    expect(computeTotals(details, { couponCode: 'dez', coupons: testCoupons })).toMatchObject({ discount: 2000, total: 18000, couponCode: 'DEZ' })
    const invalid = computeTotals(details, { couponCode: 'QUALQUER', coupons: testCoupons })
    expect(invalid.discount).toBe(0)
    expect(invalid.couponError).toMatch(/inválido/)
  })

  it('respeita subtotal mínimo do cupom', () => {
    const details = detailLines(add([], 'fixo'), lookup) // 89,90 < 100,00
    const t = computeTotals(details, { couponCode: 'DEZ', coupons: testCoupons })
    expect(t.discount).toBe(0)
    expect(t.couponError).toMatch(/a partir de/)
  })

  it('soma taxa de entrega fixa e sinaliza taxa a confirmar', () => {
    const details = detailLines(add([], 'fixo'), lookup)
    const base = { id: 'delivery' as const, label: 'Entrega', description: '', enabled: true, requiresAddress: true }
    expect(computeTotals(details, { coupons: [], fulfillment: { ...base, fee: 1000 } })).toMatchObject({ total: 9990, shippingPending: false })
    expect(computeTotals(details, { coupons: [], fulfillment: { ...base, fee: null } })).toMatchObject({ total: 8990, shippingPending: true })
  })

  it('sanitiza carrinho salvo descartando itens inválidos', () => {
    const raw = [
      { productId: 'fixo', selection: {}, quantity: 2 },
      { productId: 'fixo', selection: {}, quantity: 1 },
      { productId: 'indisponivel', selection: {}, quantity: 1 },
      { productId: 'opcoes', selection: { tamanho: 'inexistente' }, quantity: 1 },
      { productId: 'fixo', quantity: -3 },
      'lixo',
      null,
    ]
    expect(sanitizeLines(raw, lookup, MAX)).toEqual([{ productId: 'fixo', selection: {}, quantity: 3 }])
    expect(sanitizeLines('não é lista', lookup, MAX)).toEqual([])
  })

  it('recalcula preços a partir do catálogo', () => {
    const [d] = detailLines([{ productId: fixedCake.id, selection: {}, quantity: 1 }], lookup)
    expect(d!.unitPrice).toBe(8990)
    expect(detailLines([{ productId: optionCake.id, selection: { tamanho: 'grande' }, quantity: 1 }], lookup)[0]!.unitPrice).toBe(15000)
  })
})
