import { formatBRL, multiplyCents, percentOf, sumCents } from '../money'

describe('money', () => {
  it('formata centavos em reais', () => {
    expect(formatBRL(8990)).toBe('R$ 89,90')
    expect(formatBRL(0)).toBe('R$ 0,00')
    expect(formatBRL(123456)).toBe('R$ 1.234,56')
  })
  it('rejeita valores não inteiros', () => {
    expect(() => formatBRL(89.9)).toThrow()
    expect(() => multiplyCents(10.5, 2)).toThrow()
  })
  it('soma sem erro de ponto flutuante', () => {
    // 0,10 + 0,20 em centavos
    expect(sumCents([10, 20])).toBe(30)
    expect(multiplyCents(11990, 3)).toBe(35970)
  })
  it('arredonda percentuais para o centavo', () => {
    expect(percentOf(11990, 10)).toBe(1199)
    expect(percentOf(999, 15)).toBe(150)
  })
})
