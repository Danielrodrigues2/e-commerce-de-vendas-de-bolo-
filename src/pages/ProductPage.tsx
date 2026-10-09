import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductImage } from '@/components/product/ProductImage'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Notice } from '@/components/ui/Notice'
import { QuantityInput } from '@/components/ui/QuantityInput'
import { Seo } from '@/components/ui/Seo'
import { storeConfig } from '@/config/store'
import { useCart } from '@/context/cart-context'
import { getCategoryById } from '@/data/categories'
import { getProductBySlug, products } from '@/data/products'
import { formatBRL } from '@/lib/money'
import { defaultSelection, hasOptions, isPurchasable, unitPrice } from '@/lib/pricing'
import type { OptionSelection, Product } from '@/types'
import { NotFoundPage } from './NotFoundPage'

export function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)
  if (!product) return <NotFoundPage />
  // `key` reinicia o estado ao navegar entre produtos.
  return <ProductDetail key={product.id} product={product} />
}

type Feedback = { tone: 'success' | 'error'; text: string } | null

function ProductDetail({ product }: { product: Product }) {
  const { addItem, maxQuantity } = useCart()
  const [selection, setSelection] = useState<OptionSelection>(() => defaultSelection(product))
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const category = getCategoryById(product.categoryId)
  const image = product.images[0]!
  const related = products.filter((p) => p.id !== product.id && p.categoryId === product.categoryId && p.available).slice(0, 3)
  const fallbackRelated = related.length ? related : products.filter((p) => p.id !== product.id && p.featured && p.available).slice(0, 3)

  const handleAdd = () => {
    const result = addItem({ productId: product.id, selection, quantity })
    setFeedback(
      result.ok
        ? { tone: 'success', text: `${quantity} × ${product.name} adicionado ao carrinho.` }
        : { tone: 'error', text: result.error },
    )
  }

  return (
    <>
      <Seo title={product.name} description={product.shortDescription} />

      <div className="container-page py-8 sm:py-12">
        <nav aria-label="Trilha de navegação" className="text-sm text-choco-soft">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-choco hover:underline">
                Início
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/bolos" className="hover:text-choco hover:underline">
                Bolos
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to={`/bolos?categoria=${category.slug}`} className="hover:text-choco hover:underline">
                    {category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-choco">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] shadow-lift">
              <ProductImage src={image.src} alt={image.alt} priority className="aspect-[4/5] w-full" />
            </div>
          </div>

          <div>
            {category && <p className="eyebrow">{category.name}</p>}
            <h1 className="mt-2 text-5xl leading-none sm:text-6xl">{product.name}</h1>
            <p className="mt-5 text-lg leading-relaxed text-choco-soft">{product.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {product.available ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                  <span className="size-2 rounded-full bg-emerald-600" aria-hidden="true" /> Disponível para encomenda
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-choco/10 px-3 py-1 text-sm font-medium text-choco">
                  <span className="size-2 rounded-full bg-choco" aria-hidden="true" /> {product.unavailableReason ?? 'Indisponível'}
                </span>
              )}
            </div>

            <div className="mt-8 rounded-3xl border border-line/70 bg-white p-6 shadow-soft sm:p-8">
              {isPurchasable(product) ? (
                <PurchaseForm
                  product={product}
                  selection={selection}
                  onSelect={(groupId, choiceId) => {
                    setSelection((s) => ({ ...s, [groupId]: choiceId }))
                    setFeedback(null)
                  }}
                  quantity={quantity}
                  onQuantity={(q) => {
                    setQuantity(q)
                    setFeedback(null)
                  }}
                  maxQuantity={maxQuantity}
                  onAdd={handleAdd}
                />
              ) : (
                <div className="space-y-5">
                  <p className="font-serif text-3xl font-semibold text-rose-ink">Orçamento sob consulta</p>
                  <p className="text-choco-soft">
                    Bolos personalizados dependem de análise da confeitaria. Envie os detalhes e receba a proposta com valor e
                    disponibilidade de data.
                  </p>
                  <ButtonLink to="/encomendas" size="lg" className="w-full sm:w-auto">
                    Solicitar orçamento
                    <Icon name="arrowRight" className="size-4" />
                  </ButtonLink>
                </div>
              )}

              <div aria-live="polite" className="empty:hidden">
                {feedback && (
                  <Notice tone={feedback.tone} className="mt-5">
                    <span>{feedback.text}</span>
                    {feedback.tone === 'success' && (
                      <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <Link to="/carrinho" className="font-semibold underline">
                          Ver carrinho
                        </Link>
                        <Link to="/bolos" className="font-semibold underline">
                          Continuar comprando
                        </Link>
                      </span>
                    )}
                  </Notice>
                )}
              </div>
            </div>

            <ul className="mt-8 space-y-3 text-sm text-choco-soft">
              <li className="flex gap-2">
                <Icon name="calendar" className="size-5 shrink-0 text-rose-ink" />
                Feito sob encomenda. Sugerimos pedir com pelo menos {storeConfig.minLeadDays} dias de antecedência; a data é confirmada
                pelo atendimento.
              </li>
              <li className="flex gap-2">
                <Icon name="whatsapp" className="size-5 shrink-0 text-rose-ink" />
                O pedido é finalizado pelo WhatsApp, onde a confeitaria confirma valores, entrega e pagamento.
              </li>
            </ul>
          </div>
        </div>

        {fallbackRelated.length > 0 && (
          <section aria-labelledby="titulo-relacionados" className="mt-24">
            <h2 id="titulo-relacionados" className="text-4xl">
              Você também pode gostar
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fallbackRelated.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  )
}

interface PurchaseFormProps {
  product: Extract<Product, { pricing: 'fixed' | 'options' }>
  selection: OptionSelection
  onSelect: (groupId: string, choiceId: string) => void
  quantity: number
  onQuantity: (q: number) => void
  maxQuantity: number
  onAdd: () => void
}

function PurchaseForm({ product, selection, onSelect, quantity, onQuantity, maxQuantity, onAdd }: PurchaseFormProps) {
  const price = unitPrice(product, selection)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onAdd()
      }}
      className="space-y-7"
    >
      <div>
        <p className="text-sm text-choco-soft">Preço unitário</p>
        <p className="font-serif text-4xl font-semibold tabular-nums" aria-live="polite">
          {formatBRL(price)}
        </p>
        {storeConfig.demoMode && <p className="mt-1 text-xs text-choco-soft">Valor demonstrativo, sujeito à confirmação.</p>}
      </div>

      {hasOptions(product) &&
        product.options.map((group) => (
          <fieldset key={group.id} disabled={!product.available}>
            <legend className="text-sm font-semibold">{group.label}</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {group.choices.map((choice) => {
                const checked = selection[group.id] === choice.id
                return (
                  <label
                    key={choice.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rose-ink ${
                      checked ? 'border-choco bg-blush/40' : 'border-line hover:border-choco/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name={group.id}
                      value={choice.id}
                      checked={checked}
                      onChange={() => onSelect(group.id, choice.id)}
                      className="mt-1 accent-choco"
                    />
                    <span>
                      <span className="block font-medium">{choice.label}</span>
                      <span className="block text-sm text-choco-soft">
                        {choice.priceDelta > 0 ? `+ ${formatBRL(choice.priceDelta)}` : 'Sem acréscimo'}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        ))}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <QuantityInput label="Quantidade" value={quantity} onChange={onQuantity} max={maxQuantity} disabled={!product.available} />
        <Button type="submit" size="lg" className="flex-1" disabled={!product.available}>
          <Icon name="cart" className="size-5" />
          {product.available ? `Adicionar ao carrinho · ${formatBRL(price * quantity)}` : 'Indisponível'}
        </Button>
      </div>
    </form>
  )
}
