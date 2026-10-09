import { fixedCake, optionCake, quoteCake } from '@/test/fixtures'
import type { PurchasableProduct } from '@/types'
import { describeSelection, resolveSelection, startingPrice, unitPrice } from '../pricing'

describe('pricing', () => {
  it('preço fixo ignora opções', () => {
    expect(unitPrice(fixedCake as PurchasableProduct, {})).toBe(8990)
  })
  it('soma acréscimos explícitos das opções', () => {
    const p = optionCake as PurchasableProduct
    expect(unitPrice(p, { tamanho: 'padrao' })).toBe(10000)
    expect(unitPrice(p, { tamanho: 'grande' })).toBe(15000)
  })
  it('completa seleção com padrão e rejeita escolhas inválidas', () => {
    expect(resolveSelection(optionCake, {})).toEqual({ ok: true, selection: { tamanho: 'padrao' } })
    expect(resolveSelection(optionCake, { tamanho: 'gigante' }).ok).toBe(false)
    expect(resolveSelection(optionCake, { cor: 'azul' }).ok).toBe(false)
    expect(resolveSelection(fixedCake, { tamanho: 'grande' }).ok).toBe(false)
  })
  it('preço inicial e orçamento', () => {
    expect(startingPrice(optionCake)).toBe(10000)
    expect(startingPrice(quoteCake)).toBeNull()
  })
  it('descreve seleção', () => {
    expect(describeSelection(optionCake, { tamanho: 'grande' })).toEqual([{ group: 'Tamanho', choice: 'Grande' }])
  })
})
