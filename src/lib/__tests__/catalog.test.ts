import { products } from '@/data/products'
import { filterProducts } from '../catalog'

const names = (list: { name: string }[]) => list.map((p) => p.name)

describe('catálogo', () => {
  it('pesquisa por nome e descrição, ignorando acentos', () => {
    expect(names(filterProducts(products, { query: 'red velvet' }))).toEqual(['Bolo Red Velvet'])
    expect(names(filterProducts(products, { query: 'cream cheese' }))).toContain('Bolo Red Velvet')
    expect(names(filterProducts(products, { query: 'PRESTIGIO' }))).toEqual(['Bolo de Prestígio'])
  })

  it('combina pesquisa, categoria e faixa de preço', () => {
    const r = filterProducts(products, { query: 'brigadeiro', categoryId: 'chocolates', priceRangeId: 'ate-100' })
    expect(names(r)).toEqual(['Bolo de Brigadeiro'])
    const r2 = filterProducts(products, { query: 'brigadeiro', categoryId: 'chocolates', priceRangeId: '100-a-130' })
    expect(names(r2)).toEqual(['Bolo de Dois Amores'])
    expect(filterProducts(products, { query: 'morango', categoryId: 'chocolates' })).toEqual([])
  })

  it('exclui produtos sob orçamento de filtros de preço', () => {
    const r = filterProducts(products, { priceRangeId: 'acima-de-130' })
    expect(names(r)).toEqual(['Bolo Red Velvet'])
    expect(names(filterProducts(products, { categoryId: 'personalizados' }))).toEqual(['Bolo Personalizado'])
  })

  it('ordena por preço com orçamento ao final e por nome', () => {
    const asc = filterProducts(products, { sort: 'menor-preco' })
    expect(asc[0]!.name).toBe('Bolo de Cenoura com Brigadeiro')
    expect(asc.at(-1)!.name).toBe('Bolo Personalizado')
    expect(filterProducts(products, { sort: 'maior-preco' })[0]!.name).toBe('Bolo Red Velvet')
    const az = names(filterProducts(products, { sort: 'nome-az' }))
    expect(az).toEqual([...az].sort((a, b) => a.localeCompare(b, 'pt-BR')))
  })

  it('mantém indisponíveis ao final nos destaques', () => {
    expect(filterProducts(products, {}).at(-1)!.available).toBe(false)
  })
})
