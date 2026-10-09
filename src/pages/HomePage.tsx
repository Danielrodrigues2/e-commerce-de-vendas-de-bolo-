import { Link } from 'react-router'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductImage } from '@/components/product/ProductImage'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Seo } from '@/components/ui/Seo'
import { categories } from '@/data/categories'
import { benefits, occasions, testimonials } from '@/data/content'
import { products } from '@/data/products'

const steps = [
  { title: 'Escolha', text: 'Navegue pelo catálogo e adicione seus bolos ao carrinho, ou solicite um bolo personalizado.' },
  { title: 'Revise', text: 'Confira itens, valores, data desejada e forma de recebimento antes de enviar.' },
  { title: 'Confirme no WhatsApp', text: 'Envie o resumo pela conversa. A confeitaria confirma disponibilidade, valores e pagamento.' },
]

export function HomePage() {
  const featured = products.filter((p) => p.featured && p.available).slice(0, 4)

  return (
    <>
      <Seo description="Bolos artesanais, bolos de aniversário e encomendas personalizadas. Escolha seu bolo e finalize o pedido pelo WhatsApp." />

      {/* Banner principal */}
      <section className="relative overflow-hidden bg-blush">
        <div className="container-page grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
          <div className="relative z-10 max-w-xl">
            <p className="eyebrow">Confeitaria artesanal</p>
            <h1 className="mt-4 text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
              Momentos especiais merecem bolos <em className="text-rose-ink">inesquecíveis.</em>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-choco-soft">
              Feitos com carinho, ingredientes selecionados e muito sabor para transformar qualquer ocasião em uma doce lembrança.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/bolos" size="lg">
                Ver nossos bolos
                <Icon name="arrowRight" className="size-4" />
              </ButtonLink>
              <ButtonLink to="/encomendas" size="lg" variant="secondary">
                Personalize seu bolo
              </ButtonLink>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-0 rounded-[3rem] bg-cream/60 blur-2xl" aria-hidden="true" />
            <img
              src="/images/hero.svg"
              alt="Dois bolos artesanais sobre boleiras: um de Ninho com morangos e outro de brigadeiro"
              width={1200}
              height={1000}
              fetchPriority="high"
              className="relative aspect-[6/5] w-full rounded-[2.5rem] object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section aria-labelledby="titulo-categorias" className="container-page py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Categorias</p>
            <h2 id="titulo-categorias" className="mt-2 text-4xl sm:text-5xl">
              Encontre o bolo perfeito
            </h2>
          </div>
          <Link to="/bolos" className="inline-flex items-center gap-1 text-sm font-semibold text-rose-ink hover:underline">
            Ver todo o catálogo <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                to={c.id === 'personalizados' ? '/encomendas' : `/bolos?categoria=${c.slug}`}
                className="group relative block overflow-hidden rounded-3xl"
              >
                <ProductImage src={c.image.src} alt="" className="aspect-[4/5] w-full transition duration-500 group-hover:scale-[1.04]" />
                <span className="absolute inset-0 bg-gradient-to-t from-choco/80 via-choco/10 to-transparent" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                  <span className="block font-serif text-2xl font-semibold sm:text-3xl">{c.name}</span>
                  <span className="mt-1 hidden text-sm text-white/85 sm:block">{c.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Destaques */}
      <section aria-labelledby="titulo-destaques" className="bg-white py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">Mais pedidos</p>
            <h2 id="titulo-destaques" className="mt-2 text-4xl sm:text-5xl">
              Produtos em destaque
            </h2>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Benefícios */}
      <section aria-labelledby="titulo-beneficios" className="container-page py-20">
        <h2 id="titulo-beneficios" className="sr-only">
          Por que escolher a Doce Encanto
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <li key={b.title} className="flex gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blush text-rose-ink">
                <Icon name={b.icon} className="size-6" />
              </span>
              <div>
                <h3 className="font-sans text-base font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-choco-soft">{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Ocasiões */}
      <section aria-labelledby="titulo-ocasioes" className="bg-blush/60 py-20">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-12">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow">Ocasiões</p>
              <h2 id="titulo-ocasioes" className="mt-2 text-4xl sm:text-5xl">
                Um bolo para cada celebração
              </h2>
              <p className="mt-4 text-choco-soft">
                Conte para nós o que você vai comemorar. A gente ajuda a escolher sabores, tamanho e decoração.
              </p>
              <ButtonLink to="/encomendas" className="mt-8">
                Solicitar orçamento
              </ButtonLink>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2">
              {occasions.map((o, i) => (
                <li key={o.slug} className={i % 2 === 1 ? 'sm:mt-12' : ''}>
                  <figure className="overflow-hidden rounded-3xl bg-white shadow-soft">
                    <ProductImage src={`/images/occasions/${o.slug}.svg`} alt="" width={800} height={600} className="aspect-[4/3] w-full" />
                    <figcaption className="p-5">
                      <span className="block font-serif text-2xl font-semibold">{o.title}</span>
                      <span className="mt-1 block text-sm text-choco-soft">{o.text}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section aria-labelledby="titulo-como-funciona" className="container-page py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Como funciona</p>
          <h2 id="titulo-como-funciona" className="mt-2 text-4xl sm:text-5xl">
            Do carrinho à mesa da festa
          </h2>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-3xl border border-line/70 bg-white p-7 shadow-soft">
              <span className="font-serif text-5xl text-rose" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-choco-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {testimonials.length > 0 && (
        <section aria-labelledby="titulo-depoimentos" className="bg-white py-20">
          <div className="container-page">
            <h2 id="titulo-depoimentos" className="text-4xl sm:text-5xl">
              Quem provou, conta
            </h2>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <li key={t.author}>
                  <figure className="h-full rounded-3xl bg-cream p-7">
                    <blockquote className="font-serif text-xl leading-snug">“{t.quote}”</blockquote>
                    <figcaption className="mt-4 text-sm font-semibold">
                      {t.author}
                      {t.context && <span className="font-normal text-choco-soft"> — {t.context}</span>}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Chamada final */}
      <section className="container-page">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-choco px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-rose/30 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-blush/20 blur-3xl" aria-hidden="true" />
          <h2 className="relative mx-auto max-w-2xl text-4xl text-cream sm:text-5xl">Qual vai ser a próxima doce lembrança?</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-cream/80">
            Escolha um dos nossos sabores ou peça um bolo feito especialmente para a sua comemoração.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to="/bolos" variant="light" size="lg">
              Ver nossos bolos
            </ButtonLink>
            <ButtonLink
              to="/encomendas"
              size="lg"
              className="border border-cream/40 bg-transparent text-cream shadow-none hover:bg-cream/10"
            >
              Personalize seu bolo
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
