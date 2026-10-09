import { ButtonLink } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { Seo } from '@/components/ui/Seo'
import { storeConfig } from '@/config/store'
import { formatBRL } from '@/lib/money'

export function HowToBuyPage() {
  const options = storeConfig.fulfillment.filter((o) => o.enabled)
  const sections = [
    {
      title: 'Como fazer um pedido',
      body: (
        <ol className="list-decimal space-y-2 pl-5">
          <li>Escolha os bolos no catálogo, selecione as opções e adicione ao carrinho.</li>
          <li>No carrinho, revise as quantidades e, se tiver, aplique um cupom válido.</li>
          <li>Informe seus dados, a forma de recebimento e a data desejada.</li>
          <li>Revise o resumo e abra o WhatsApp com a mensagem pronta. Envie a mensagem para a confeitaria.</li>
          <li>Aguarde a confirmação de disponibilidade, valores finais e forma de pagamento.</li>
        </ol>
      ),
    },
    {
      title: 'Entrega e retirada',
      body: (
        <ul className="space-y-3">
          {options.map((o) => (
            <li key={o.id}>
              <strong>{o.label}:</strong> {o.description}{' '}
              {o.fee === null ? '' : o.fee === 0 ? 'Sem custo adicional.' : `Taxa: ${formatBRL(o.fee)}.`}
            </li>
          ))}
          {storeConfig.serviceArea && <li>Área de entrega: {storeConfig.serviceArea}.</li>}
        </ul>
      ),
    },
    {
      title: 'Prazos',
      body: (
        <p>
          Os bolos são produzidos sob encomenda. Sugerimos fazer o pedido com pelo menos {storeConfig.minLeadDays} dias de antecedência. A
          data só é garantida após a confirmação da confeitaria.
        </p>
      ),
    },
    {
      title: 'Pagamento',
      body: (
        <p>
          Nenhum pagamento é realizado neste site e nenhum dado de cartão é solicitado. As formas de pagamento são informadas pela
          confeitaria durante o atendimento no WhatsApp.
        </p>
      ),
    },
    {
      title: 'Bolos personalizados',
      body: (
        <p>
          Encomendas personalizadas funcionam por orçamento: envie os detalhes pelo formulário e a confeitaria retornará com proposta,
          valor e disponibilidade. Imagens de referência podem ser enviadas diretamente na conversa do WhatsApp.
        </p>
      ),
    },
    {
      title: 'Alterações e cancelamentos',
      body: (
        <p>
          Condições para alterar ou cancelar um pedido são combinadas diretamente com a confeitaria no momento da confirmação. Em caso de
          dúvida, pergunte antes de confirmar.
        </p>
      ),
    },
  ]

  return (
    <>
      <Seo title="Como comprar" description="Saiba como fazer seu pedido, prazos, entrega, retirada e pagamento na Doce Encanto Confeitaria." />
      <PageHeader eyebrow="Ajuda" title="Como comprar">
        <p>Tudo o que você precisa saber para encomendar o seu bolo.</p>
      </PageHeader>
      <div className="container-page grid gap-6 py-12 md:grid-cols-2">
        {sections.map((s) => (
          <section key={s.title} className="rounded-3xl border border-line/70 bg-white p-7 shadow-soft">
            <h2 className="text-3xl">{s.title}</h2>
            <div className="mt-4 text-sm leading-relaxed text-choco-soft">{s.body}</div>
          </section>
        ))}
      </div>
      <div className="container-page flex flex-col gap-3 sm:flex-row">
        <ButtonLink to="/bolos">Ver nossos bolos</ButtonLink>
        <ButtonLink to="/encomendas" variant="secondary">
          Personalize seu bolo
        </ButtonLink>
      </div>
    </>
  )
}
