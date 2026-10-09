import type { OptionGroup, Product } from '@/types'

/**
 * Catálogo inicial (editável).
 *
 * ATENÇÃO: os preços abaixo são DEMONSTRATIVOS e precisam ser confirmados pela confeitaria.
 * Valores em centavos inteiros. Acréscimos de opções são definidos explicitamente em `priceDelta`.
 * Para usar fotografias reais, coloque os arquivos em `public/images/products/` e troque `src`.
 */

const img = (slug: string, alt: string) => [{ src: `/images/products/${slug}.svg`, alt }]

/** Grupo de tamanho reutilizado por produtos configuráveis. Acréscimos demonstrativos. */
const sizeOptions = (largeDelta: number): OptionGroup => ({
  id: 'tamanho',
  label: 'Tamanho',
  defaultChoiceId: 'padrao',
  choices: [
    { id: 'padrao', label: 'Padrão', priceDelta: 0, description: 'Tamanho padrão da casa.' },
    { id: 'grande', label: 'Grande', priceDelta: largeDelta, description: 'Versão maior do mesmo bolo.' },
  ],
})

export const products: Product[] = [
  {
    id: 'bolo-de-brigadeiro',
    slug: 'bolo-de-brigadeiro',
    name: 'Bolo de Brigadeiro',
    categoryId: 'chocolates',
    pricing: 'fixed',
    price: 8990,
    shortDescription: 'Massa de chocolate fofinha, recheio cremoso de brigadeiro e confeitos.',
    description:
      'Um clássico das festas brasileiras: massa de chocolate macia, recheio generoso de brigadeiro cremoso e cobertura finalizada com brigadeiros enrolados à mão e granulado.',
    images: img('bolo-de-brigadeiro', 'Bolo de brigadeiro coberto com brigadeiros enrolados'),
    available: true,
    featured: true,
    tags: ['chocolate', 'brigadeiro', 'aniversário'],
  },
  {
    id: 'bolo-de-ninho-com-morango',
    slug: 'bolo-de-ninho-com-morango',
    name: 'Bolo de Ninho com Morango',
    categoryId: 'especiais',
    pricing: 'options',
    price: 11990,
    options: [sizeOptions(6000)],
    shortDescription: 'Massa branca, creme de leite Ninho e morangos frescos.',
    description:
      'Camadas de massa branca intercaladas com creme de leite Ninho e pedaços de morango. Leve, delicado e perfeito para celebrações durante o dia.',
    images: img('bolo-de-ninho-com-morango', 'Bolo de massa branca com recheio de Ninho e morangos no topo'),
    available: true,
    featured: true,
    tags: ['ninho', 'morango', 'frutas'],
  },
  {
    id: 'bolo-red-velvet',
    slug: 'bolo-red-velvet',
    name: 'Bolo Red Velvet',
    categoryId: 'especiais',
    pricing: 'options',
    price: 13990,
    options: [
      sizeOptions(7000),
      {
        id: 'acabamento',
        label: 'Acabamento',
        defaultChoiceId: 'naked',
        choices: [
          { id: 'naked', label: 'Naked (camadas aparentes)', priceDelta: 0 },
          { id: 'coberto', label: 'Coberto com cream cheese', priceDelta: 1500 },
        ],
      },
    ],
    shortDescription: 'Massa aveludada de cacau com recheio de cream cheese.',
    description:
      'Massa red velvet com leve toque de cacau, recheio e acabamento de creme de cream cheese. Elegante, equilibrado e marcante no visual.',
    images: img('bolo-red-velvet', 'Bolo red velvet com camadas vermelhas e recheio claro'),
    available: true,
    featured: true,
    tags: ['red velvet', 'cream cheese'],
  },
  {
    id: 'bolo-de-chocolate-belga',
    slug: 'bolo-de-chocolate-belga',
    name: 'Bolo de Chocolate Belga',
    categoryId: 'chocolates',
    pricing: 'fixed',
    price: 12990,
    shortDescription: 'Ganache de chocolate belga, massa úmida e raspas de chocolate.',
    description:
      'Para os apaixonados por chocolate: massa úmida de cacau, recheio e cobertura de ganache de chocolate belga, finalizado com raspas de chocolate.',
    images: img('bolo-de-chocolate-belga', 'Bolo de chocolate com ganache escorrendo e raspas de chocolate'),
    available: true,
    featured: true,
    tags: ['chocolate', 'ganache'],
  },
  {
    id: 'bolo-de-cenoura-com-brigadeiro',
    slug: 'bolo-de-cenoura-com-brigadeiro',
    name: 'Bolo de Cenoura com Brigadeiro',
    categoryId: 'classicos',
    pricing: 'fixed',
    price: 5990,
    shortDescription: 'O bolo da casa da avó, com cobertura farta de brigadeiro.',
    description:
      'Massa de cenoura fofinha e bem dourada com cobertura cremosa de brigadeiro e granulado. Ideal para o café da tarde ou para adoçar o dia.',
    images: img('bolo-de-cenoura-com-brigadeiro', 'Bolo de cenoura com cobertura de brigadeiro escorrendo'),
    available: true,
    tags: ['cenoura', 'brigadeiro', 'café da tarde'],
  },
  {
    id: 'bolo-de-prestigio',
    slug: 'bolo-de-prestigio',
    name: 'Bolo de Prestígio',
    categoryId: 'classicos',
    pricing: 'fixed',
    price: 9990,
    shortDescription: 'Chocolate e coco cremoso em camadas generosas.',
    description:
      'Massa de chocolate com recheio cremoso de coco e cobertura de chocolate finalizada com coco ralado. A combinação clássica em versão de festa.',
    images: img('bolo-de-prestigio', 'Bolo de chocolate com recheio de coco e coco ralado no topo'),
    // Exemplo de produto indisponível: altere para `true` quando voltar a ser produzido.
    available: false,
    unavailableReason: 'Indisponível no momento.',
    tags: ['coco', 'chocolate'],
  },
  {
    id: 'bolo-de-dois-amores',
    slug: 'bolo-de-dois-amores',
    name: 'Bolo de Dois Amores',
    categoryId: 'chocolates',
    pricing: 'options',
    price: 10990,
    options: [sizeOptions(5500)],
    shortDescription: 'Brigadeiro preto e brigadeiro branco no mesmo bolo.',
    description:
      'Massa de chocolate com dois recheios: brigadeiro tradicional e brigadeiro branco. Finalizado com brigadeiros dos dois sabores.',
    images: img('bolo-de-dois-amores', 'Bolo de chocolate com recheios de brigadeiro branco e preto'),
    available: true,
    tags: ['brigadeiro', 'brigadeiro branco', 'chocolate'],
  },
  {
    id: 'bolo-personalizado',
    slug: 'bolo-personalizado',
    name: 'Bolo Personalizado',
    categoryId: 'personalizados',
    pricing: 'quote',
    shortDescription: 'Você escolhe tema, sabores e decoração. Orçamento sob consulta.',
    description:
      'Conte para nós a ocasião, o número de convidados, os sabores e o tema. A confeitaria analisa a solicitação e retorna com proposta, valor e disponibilidade de data.',
    images: img('bolo-personalizado', 'Bolo personalizado de dois andares decorado com flores'),
    available: true,
    featured: true,
    tags: ['personalizado', 'aniversário', 'casamento', 'tema'],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
