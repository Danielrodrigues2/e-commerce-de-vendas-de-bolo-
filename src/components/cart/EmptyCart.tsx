import { ButtonLink } from '../ui/Button'
import { Icon } from '../ui/Icon'

export function EmptyCart() {
  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-blush text-rose-ink">
        <Icon name="cart" className="size-7" />
      </span>
      <h2 className="mt-5 text-3xl">Seu carrinho está vazio</h2>
      <p className="mt-2 text-choco-soft">Escolha um dos nossos bolos ou solicite um bolo personalizado.</p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink to="/bolos">Ver nossos bolos</ButtonLink>
        <ButtonLink to="/encomendas" variant="secondary">
          Personalize seu bolo
        </ButtonLink>
      </div>
    </div>
  )
}
