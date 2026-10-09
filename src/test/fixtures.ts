import type { Coupon } from '@/config/store'
import type { Product } from '@/types'

export const fixedCake: Product = {
  id: 'fixo',
  slug: 'fixo',
  name: 'Bolo Fixo',
  categoryId: 'classicos',
  pricing: 'fixed',
  price: 8990,
  shortDescription: 'Bolo de cenoura',
  description: 'Bolo simples',
  images: [{ src: '/x.svg', alt: 'x' }],
  available: true,
}

export const optionCake: Product = {
  id: 'opcoes',
  slug: 'opcoes',
  name: 'Bolo com Opções',
  categoryId: 'especiais',
  pricing: 'options',
  price: 10000,
  shortDescription: 'Morango',
  description: 'Bolo com opções',
  images: [{ src: '/x.svg', alt: 'x' }],
  available: true,
  options: [
    {
      id: 'tamanho',
      label: 'Tamanho',
      defaultChoiceId: 'padrao',
      choices: [
        { id: 'padrao', label: 'Padrão', priceDelta: 0 },
        { id: 'grande', label: 'Grande', priceDelta: 5000 },
      ],
    },
  ],
}

export const quoteCake: Product = {
  id: 'orcamento',
  slug: 'orcamento',
  name: 'Bolo sob Orçamento',
  categoryId: 'personalizados',
  pricing: 'quote',
  shortDescription: 'Personalizado',
  description: 'Personalizado',
  images: [{ src: '/x.svg', alt: 'x' }],
  available: true,
}

export const unavailableCake: Product = { ...fixedCake, id: 'indisponivel', slug: 'indisponivel', available: false }

export const testProducts = [fixedCake, optionCake, quoteCake, unavailableCake]
export const lookup = (id: string) => testProducts.find((p) => p.id === id)

export const testCoupons: Coupon[] = [
  { code: 'DEZ', description: '10%', type: 'percent', value: 10, minSubtotal: 10000 },
  { code: 'CINCO', description: 'R$ 5', type: 'fixed', value: 500 },
]
