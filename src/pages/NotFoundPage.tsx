import { ButtonLink } from '@/components/ui/Button'
import { Seo } from '@/components/ui/Seo'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Página não encontrada" description="A página procurada não existe ou foi removida." noIndex />
      <section className="container-page py-24 text-center">
        <p className="eyebrow">Erro 404</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">Esta página não está no cardápio</h1>
        <p className="mx-auto mt-4 max-w-md text-choco-soft">O endereço pode ter mudado ou não existir mais. Que tal ver nossos bolos?</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink to="/bolos">Ver nossos bolos</ButtonLink>
          <ButtonLink to="/" variant="secondary">
            Voltar ao início
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
