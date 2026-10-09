import { PageHeader } from '@/components/ui/PageHeader'
import { Seo } from '@/components/ui/Seo'
import { storeConfig } from '@/config/store'

export function PrivacyPage() {
  return (
    <>
      <Seo title="Política de privacidade" description="Como a Doce Encanto Confeitaria trata os dados informados no site, conforme a LGPD." />
      <PageHeader eyebrow="LGPD" title="Política de privacidade">
        <p>Explicamos de forma simples quais dados este site usa e por quê.</p>
      </PageHeader>
      <article className="container-page max-w-3xl space-y-8 py-12 leading-relaxed text-choco-soft [&_h2]:text-3xl [&_h2]:text-choco">
        <section className="space-y-3">
          <h2>Quais dados são coletados</h2>
          <p>
            Para montar o pedido ou a solicitação de orçamento, pedimos nome, telefone, forma de recebimento, endereço (somente para entrega),
            data desejada e observações. Pedimos apenas o necessário para atender ao seu pedido.
          </p>
        </section>
        <section className="space-y-3">
          <h2>Como os dados são usados</h2>
          <p>
            Este site não possui servidor de pedidos nem banco de dados. Os dados digitados nos formulários são usados somente no seu
            navegador para compor a mensagem que <strong>você</strong> decide enviar pelo WhatsApp. Eles não são enviados a nenhum servidor
            nosso e não ficam salvos no site.
          </p>
          <p>
            Ao enviar a mensagem pelo WhatsApp, as informações passam a ser tratadas pela {storeConfig.name} exclusivamente para atender
            ao seu pedido. O WhatsApp é um serviço de terceiros, com política de privacidade própria.
          </p>
        </section>
        <section className="space-y-3">
          <h2>Armazenamento local</h2>
          <p>
            O conteúdo do carrinho (produtos, opções, quantidades e cupom) é guardado no armazenamento local do seu navegador para não se
            perder ao recarregar a página. Nenhum dado pessoal é salvo nesse armazenamento. Você pode apagá-lo esvaziando o carrinho ou
            limpando os dados do site no navegador.
          </p>
          <p>Este site não utiliza cookies de rastreamento, ferramentas de análise ou publicidade.</p>
        </section>
        <section className="space-y-3">
          <h2>Seus direitos</h2>
          <p>
            Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar confirmação, acesso, correção ou exclusão
            dos dados compartilhados com a confeitaria pelo mesmo canal de atendimento utilizado no pedido
            {storeConfig.email ? (
              <>
                {' '}
                ou pelo e-mail <a href={`mailto:${storeConfig.email}`}>{storeConfig.email}</a>
              </>
            ) : null}
            .
          </p>
        </section>
      </article>
    </>
  )
}
