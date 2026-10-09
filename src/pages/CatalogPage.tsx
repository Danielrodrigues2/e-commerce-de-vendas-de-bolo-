import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ProductCard } from '@/components/product/ProductCard'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Seo } from '@/components/ui/Seo'
import { storeConfig } from '@/config/store'
import { categories, getCategoryBySlug } from '@/data/categories'
import { products } from '@/data/products'
import { filterProducts, isSortId, priceRanges, sortOptions, type SortId } from '@/lib/catalog'

const chip = (active: boolean) =>
  `inline-flex min-h-10 cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rose-ink ${
    active ? 'border-choco bg-choco text-white' : 'border-line bg-white text-choco hover:border-choco/50'
  }`

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const query = params.get('q') ?? ''
  const category = getCategoryBySlug(params.get('categoria') ?? '')
  const priceRangeId = priceRanges.some((r) => r.id === params.get('preco')) ? params.get('preco') : null
  const rawSort = params.get('ordem')
  const sort: SortId = isSortId(rawSort) ? rawSort : 'relevancia'

  const results = useMemo(
    () => filterProducts(products, { query, categoryId: category?.id ?? null, priceRangeId, sort }),
    [query, category, priceRangeId, sort],
  )

  /** Atualiza um parâmetro preservando todos os outros (pesquisa e filtros combinados). */
  const update = (key: string, value: string | null, replace = false) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace, preventScrollReset: true },
    )
  }

  const activeCount = [query, category, priceRangeId].filter(Boolean).length
  const clearAll = () => setParams(sort !== 'relevancia' ? { ordem: sort } : {}, { preventScrollReset: true })

  const title = category ? `Bolos ${category.name.toLowerCase()}` : 'Nossos bolos'

  return (
    <>
      <Seo
        title={title}
        description="Catálogo de bolos artesanais da Doce Encanto: brigadeiro, ninho com morango, red velvet, chocolate belga e bolos personalizados."
      />
      <PageHeader eyebrow="Catálogo" title={title}>
        <p>Pesquise, filtre por categoria e faixa de preço e escolha o bolo ideal para a sua ocasião.</p>
      </PageHeader>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[17rem_1fr]">
        {/* Filtros */}
        <aside aria-label="Filtros do catálogo">
          <Button
            variant="secondary"
            className="w-full lg:hidden"
            aria-expanded={filtersOpen}
            aria-controls="painel-filtros"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <Icon name="filter" className="size-4" />
            {filtersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
            {activeCount > 0 && ` (${activeCount})`}
          </Button>

          <div id="painel-filtros" className={`${filtersOpen ? 'mt-6 block' : 'hidden'} space-y-8 lg:sticky lg:top-28 lg:mt-0 lg:block`}>
            <div>
              <label htmlFor="busca-catalogo" className="text-sm font-semibold">
                Pesquisar
              </label>
              <div className="relative mt-2">
                <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-choco-soft" />
                <input
                  id="busca-catalogo"
                  type="search"
                  value={query}
                  onChange={(e) => update('q', e.target.value || null, true)}
                  placeholder="Nome ou sabor"
                  className="h-11 w-full rounded-full border border-line bg-white pr-4 pl-10 text-sm focus:border-rose-ink focus:ring-2 focus:ring-rose/30 focus:outline-none"
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-sm font-semibold">Categoria</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                <label className={chip(!category)}>
                  <input type="radio" name="categoria" className="sr-only" checked={!category} onChange={() => update('categoria', null)} />
                  Todas
                </label>
                {categories.map((c) => (
                  <label key={c.id} className={chip(category?.id === c.id)}>
                    <input
                      type="radio"
                      name="categoria"
                      className="sr-only"
                      checked={category?.id === c.id}
                      onChange={() => update('categoria', c.slug)}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold">Faixa de preço</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                <label className={chip(!priceRangeId)}>
                  <input type="radio" name="preco" className="sr-only" checked={!priceRangeId} onChange={() => update('preco', null)} />
                  Qualquer preço
                </label>
                {priceRanges.map((r) => (
                  <label key={r.id} className={chip(priceRangeId === r.id)}>
                    <input type="radio" name="preco" className="sr-only" checked={priceRangeId === r.id} onChange={() => update('preco', r.id)} />
                    {r.label}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-choco-soft">Considera o menor preço de cada bolo. Itens sob orçamento não entram neste filtro.</p>
            </fieldset>

            {activeCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <Icon name="close" className="size-4" /> Limpar filtros
              </Button>
            )}
          </div>
        </aside>

        {/* Resultados */}
        <section aria-labelledby="titulo-resultados">
          <div className="flex flex-col gap-4 border-b border-line/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="titulo-resultados" className="font-sans text-sm font-medium text-choco-soft" aria-live="polite">
              {results.length === 1 ? '1 bolo encontrado' : `${results.length} bolos encontrados`}
              {query && (
                <>
                  {' '}
                  para “<span className="text-choco">{query}</span>”
                </>
              )}
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="ordenacao" className="text-sm text-choco-soft">
                Ordenar por
              </label>
              <select
                id="ordenacao"
                value={sort}
                onChange={(e) => update('ordem', e.target.value === 'relevancia' ? null : e.target.value)}
                className="h-10 rounded-full border border-line bg-white px-4 text-sm focus:border-rose-ink focus:ring-2 focus:ring-rose/30 focus:outline-none"
              >
                {sortOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {results.length > 0 ? (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p, i) => (
                <li key={p.id}>
                  <ProductCard product={p} priority={i < 3} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
              <Icon name="search" className="mx-auto size-10 text-rose" />
              <h3 className="mt-4 text-3xl">Nenhum bolo encontrado</h3>
              <p className="mx-auto mt-2 max-w-md text-choco-soft">
                Tente outro termo de pesquisa ou remova algum filtro. Se você procura algo especial, podemos criar um bolo personalizado.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Button variant="secondary" onClick={clearAll}>
                  Limpar filtros
                </Button>
                <ButtonLink to="/encomendas">Personalize seu bolo</ButtonLink>
              </div>
            </div>
          )}

          {storeConfig.demoMode && (
            <p className="mt-10 text-xs text-choco-soft">
              Preços demonstrativos, sujeitos à confirmação da confeitaria no momento do pedido.
            </p>
          )}
        </section>
      </div>
    </>
  )
}
