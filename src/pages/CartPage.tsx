import { CartLineItem } from '@/components/cart/CartLineItem'
import { CouponForm } from '@/components/cart/CouponForm'
import { EmptyCart } from '@/components/cart/EmptyCart'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Seo } from '@/components/ui/Seo'
import { storeConfig } from '@/config/store'
import { useCart } from '@/context/cart-context'

export function CartPage() {
  const { lines, totals } = useCart()

  return (
    <>
      <Seo title="Carrinho" description="Revise os bolos escolhidos antes de enviar seu pedido." noIndex />
      <PageHeader eyebrow="Sua seleção" title="Carrinho">
        <p>O carrinho fica salvo apenas neste navegador e ainda não é um pedido registrado na confeitaria.</p>
      </PageHeader>

      <div className="container-page py-10">
        {lines.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
            <section aria-labelledby="titulo-itens">
              <h2 id="titulo-itens" className="sr-only">
                Itens do carrinho
              </h2>
              <ul className="divide-y divide-line border-y border-line">
                {lines.map((line) => (
                  <CartLineItem key={line.key} line={line} />
                ))}
              </ul>
              <ButtonLink to="/bolos" variant="ghost" className="mt-6 -ml-2">
                <Icon name="arrowLeft" className="size-4" />
                Continuar comprando
              </ButtonLink>
            </section>

            <aside aria-labelledby="titulo-resumo" className="lg:sticky lg:top-28 lg:self-start">
              <div className="space-y-6 rounded-3xl border border-line/70 bg-white p-6 shadow-soft sm:p-8">
                <h2 id="titulo-resumo" className="text-3xl">
                  Resumo
                </h2>
                {storeConfig.coupons.length > 0 && <CouponForm />}
                <OrderSummary totals={totals} shippingLabel="Escolha na próxima etapa" />
                <ButtonLink to="/finalizar" size="lg" className="w-full">
                  Revisar pedido
                  <Icon name="arrowRight" className="size-4" />
                </ButtonLink>
                <p className="text-xs leading-relaxed text-choco-soft">
                  Valores {storeConfig.demoMode ? 'demonstrativos e ' : ''}sujeitos à confirmação. Entrega e pagamento são combinados com a
                  confeitaria pelo WhatsApp.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
