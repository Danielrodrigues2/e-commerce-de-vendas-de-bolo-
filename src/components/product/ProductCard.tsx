import { Link } from 'react-router'
import { getCategoryById } from '@/data/categories'
import { isPurchasable } from '@/lib/pricing'
import type { Product } from '@/types'
import { Icon } from '../ui/Icon'
import { PriceTag } from './PriceTag'
import { ProductImage } from './ProductImage'

interface ProductCardProps {
  product: Product
  priority?: boolean
  headingLevel?: 'h2' | 'h3'
}

export function ProductCard({ product, priority, headingLevel: Heading = 'h3' }: ProductCardProps) {
  const href = `/bolos/${product.slug}`
  const category = getCategoryById(product.categoryId)
  const action = !product.available ? 'Ver detalhes' : isPurchasable(product) ? 'Escolher' : 'Solicitar orçamento'

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line/70 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[4/5]">
        <ProductImage
          src={product.images[0]!.src}
          alt={product.images[0]!.alt}
          priority={priority}
          className={`size-full transition duration-500 group-hover:scale-[1.03] ${product.available ? '' : 'opacity-60 grayscale-[35%]'}`}
        />
        {!product.available && (
          <span className="absolute top-4 left-4 rounded-full bg-choco px-3 py-1 text-xs font-semibold text-white">Indisponível</span>
        )}
        {product.available && product.pricing === 'quote' && (
          <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-rose-ink backdrop-blur">
            Sob encomenda
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
        {category && <p className="eyebrow">{category.name}</p>}
        <Heading className="text-2xl leading-tight">
          {/* O link cobre todo o card para facilitar o toque em telas pequenas. */}
          <Link to={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {product.name}
          </Link>
        </Heading>
        <p className="line-clamp-2 text-sm leading-relaxed text-choco-soft">{product.shortDescription}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <PriceTag product={product} className="text-lg" />
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1 rounded-full bg-blush px-3 py-1.5 text-xs font-semibold text-choco transition group-hover:bg-choco group-hover:text-white"
          >
            {action}
            <Icon name="arrowRight" className="size-3.5" />
          </span>
        </div>
      </div>
      {/* Anel de foco visível para o card inteiro. */}
      <span className="pointer-events-none absolute inset-0 rounded-3xl ring-rose-ink ring-offset-2 group-has-[a:focus-visible]:ring-2" />
    </article>
  )
}
