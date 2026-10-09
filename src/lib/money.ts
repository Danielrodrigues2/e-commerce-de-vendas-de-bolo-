import type { Cents } from '@/types'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** Formata centavos como moeda brasileira, com espaço comum (ex.: "R$ 89,90"). */
export function formatBRL(cents: Cents): string {
  if (!Number.isInteger(cents)) throw new Error(`Valor monetário deve ser inteiro em centavos: ${cents}`)
  return brl.format(cents / 100).replace(/\s/g, ' ')
}

export function multiplyCents(cents: Cents, quantity: number): Cents {
  if (!Number.isInteger(cents) || !Number.isInteger(quantity)) {
    throw new Error('Multiplicação monetária exige inteiros')
  }
  return cents * quantity
}

export function sumCents(values: Cents[]): Cents {
  return values.reduce((acc, v) => acc + v, 0)
}

/** Percentual inteiro aplicado sobre centavos, arredondado para o centavo mais próximo. */
export function percentOf(cents: Cents, percent: number): Cents {
  return Math.round((cents * percent) / 100)
}
