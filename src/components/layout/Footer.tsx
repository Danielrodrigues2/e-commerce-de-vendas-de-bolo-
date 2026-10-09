import { Link } from 'react-router'
import { storeConfig } from '@/config/store'
import { categories } from '@/data/categories'
import { Logo } from './Logo'

export function Footer() {
  const year = new Date().getFullYear()
  const { businessHours, social, email, serviceArea } = storeConfig
  return (
    <footer className="mt-24 bg-choco text-cream">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="inline-block rounded-2xl bg-cream px-4 py-3">
            <Logo />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-cream/80">
            Bolos artesanais, bolos de aniversário e encomendas personalizadas, feitos com carinho para cada ocasião.
          </p>
        </div>

        <nav aria-label="Bolos">
          <h2 className="font-sans text-sm font-semibold tracking-[0.18em] text-cream uppercase">Bolos</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link className="text-cream/80 hover:text-white hover:underline" to={`/bolos?categoria=${c.slug}`}>
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-cream/80 hover:text-white hover:underline" to="/encomendas">
                Encomenda personalizada
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Informações">
          <h2 className="font-sans text-sm font-semibold tracking-[0.18em] text-cream uppercase">Informações</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link className="text-cream/80 hover:text-white hover:underline" to="/como-comprar">
                Como comprar, entrega e retirada
              </Link>
            </li>
            <li>
              <Link className="text-cream/80 hover:text-white hover:underline" to="/privacidade">
                Política de privacidade
              </Link>
            </li>
            <li>
              <Link className="text-cream/80 hover:text-white hover:underline" to="/carrinho">
                Carrinho
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold tracking-[0.18em] text-cream uppercase">Atendimento</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
            <li>Pedidos e orçamentos pelo WhatsApp.</li>
            {businessHours ? (
              businessHours.map((h) => <li key={h}>{h}</li>)
            ) : (
              <li>Horários de atendimento informados pelo WhatsApp.</li>
            )}
            {serviceArea && <li>Área de entrega: {serviceArea}</li>}
            {email && (
              <li>
                <a className="hover:text-white hover:underline" href={`mailto:${email}`}>
                  {email}
                </a>
              </li>
            )}
            {social.map((s) => (
              <li key={s.url}>
                <a className="hover:text-white hover:underline" href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {storeConfig.name}.
          </p>
          {storeConfig.demoMode && (
            <p>Preços e informações comerciais exibidos são demonstrativos e estão sujeitos à confirmação da confeitaria.</p>
          )}
        </div>
      </div>
    </footer>
  )
}
