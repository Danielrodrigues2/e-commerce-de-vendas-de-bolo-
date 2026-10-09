/** Valores monetários são sempre centavos inteiros (ex.: R$ 89,90 => 8990). */
export type Cents = number

export interface ProductImage {
  src: string
  alt: string
}

export interface OptionChoice {
  id: string
  label: string
  /** Acréscimo explícito em centavos sobre o preço base. 0 quando não altera o preço. */
  priceDelta: Cents
  description?: string
}

export interface OptionGroup {
  id: string
  label: string
  choices: OptionChoice[]
  /** Escolha aplicada quando o cliente não altera a opção. */
  defaultChoiceId: string
}

interface ProductBase {
  id: string
  slug: string
  name: string
  categoryId: string
  shortDescription: string
  description: string
  images: ProductImage[]
  available: boolean
  /** Exibido quando o produto está indisponível. */
  unavailableReason?: string
  featured?: boolean
  tags?: string[]
}

/** Preço fixo, sem opções que alterem o valor. */
export interface FixedProduct extends ProductBase {
  pricing: 'fixed'
  price: Cents
}

/** Preço base + opções com acréscimos explícitos. */
export interface ConfigurableProduct extends ProductBase {
  pricing: 'options'
  price: Cents
  options: OptionGroup[]
}

/** Depende de análise da confeitaria: não entra no carrinho, segue para orçamento. */
export interface QuoteProduct extends ProductBase {
  pricing: 'quote'
}

export type Product = FixedProduct | ConfigurableProduct | QuoteProduct
export type PurchasableProduct = FixedProduct | ConfigurableProduct

export interface Category {
  id: string
  slug: string
  name: string
  description: string
  image: ProductImage
}

/** Mapeamento grupo de opção -> escolha selecionada. */
export type OptionSelection = Record<string, string>

export type FulfillmentMethod = 'pickup' | 'delivery'
