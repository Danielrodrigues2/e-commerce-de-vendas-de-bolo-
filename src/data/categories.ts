import type { Category } from '@/types'

export const categories: Category[] = [
  {
    id: 'classicos',
    slug: 'classicos',
    name: 'Clássicos',
    description: 'Sabores afetivos que nunca saem de moda.',
    image: { src: '/images/products/bolo-de-cenoura-com-brigadeiro.svg', alt: 'Bolo de cenoura com cobertura de brigadeiro' },
  },
  {
    id: 'chocolates',
    slug: 'chocolates',
    name: 'Chocolates',
    description: 'Para quem não abre mão de um chocolate intenso.',
    image: { src: '/images/products/bolo-de-chocolate-belga.svg', alt: 'Bolo de chocolate com ganache' },
  },
  {
    id: 'especiais',
    slug: 'especiais',
    name: 'Especiais',
    description: 'Combinações delicadas para celebrar em grande estilo.',
    image: { src: '/images/products/bolo-de-ninho-com-morango.svg', alt: 'Bolo de leite Ninho com morangos' },
  },
  {
    id: 'personalizados',
    slug: 'personalizados',
    name: 'Personalizados',
    description: 'Criados com você, do sabor à decoração.',
    image: { src: '/images/products/bolo-personalizado.svg', alt: 'Bolo personalizado de dois andares' },
  },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
