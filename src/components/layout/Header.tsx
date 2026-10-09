import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useCart } from '@/context/cart-context'
import { Icon } from '../ui/Icon'
import { Logo } from './Logo'
import { mainNav } from './navigation'
import { SearchForm } from './SearchForm'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `relative py-2 text-sm font-medium transition hover:text-rose-ink ${
    isActive ? 'text-choco after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-rose' : 'text-choco-soft'
  }`

export function Header() {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Fecha o menu ao navegar (ajuste de estado durante a renderização, sem efeito extra).
  const [lastLocationKey, setLastLocationKey] = useState(location.key)
  if (lastLocationKey !== location.key) {
    setLastLocationKey(location.key)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('input, a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const cartLabel = itemCount === 0 ? 'Carrinho vazio' : `Carrinho com ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/90 backdrop-blur-md supports-[backdrop-filter]:bg-cream/80">
      <div className="container-page flex h-18 items-center gap-4 lg:gap-8">
        <Logo />
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchForm id="busca-desktop" className="hidden w-56 md:block xl:w-64" />
          <Link
            to="/carrinho"
            className="relative grid size-11 place-items-center rounded-full text-choco transition hover:bg-blush"
            aria-label={cartLabel}
          >
            <Icon name="cart" className="size-6" />
            {itemCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-0.5 right-0 grid min-w-5 place-items-center rounded-full bg-rose-ink px-1 text-[11px] leading-5 font-bold text-white tabular-nums"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="grid size-11 place-items-center rounded-full text-choco transition hover:bg-blush lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} className="size-6" />
            <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line/70 bg-cream lg:hidden"
      >
        <div className="container-page space-y-6 py-6">
          <SearchForm id="busca-mobile" className="md:hidden" />
          <nav aria-label="Menu móvel">
            <ul className="divide-y divide-line/70">
              {mainNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between py-4 font-serif text-2xl ${isActive ? 'text-rose-ink' : 'text-choco'}`
                    }
                  >
                    {item.label}
                    <Icon name="arrowRight" className="size-5" />
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to="/carrinho" className="flex items-center justify-between py-4 font-serif text-2xl text-choco">
                  Carrinho {itemCount > 0 && `(${itemCount})`}
                  <Icon name="cart" className="size-5" />
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
