import type { RouteObject } from 'react-router'
import { Layout } from './components/layout/Layout'
import { CartPage } from './pages/CartPage'
import { CatalogPage } from './pages/CatalogPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { CustomOrderPage } from './pages/CustomOrderPage'
import { HomePage } from './pages/HomePage'
import { HowToBuyPage } from './pages/HowToBuyPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { ProductPage } from './pages/ProductPage'
import { RouteError } from './pages/RouteError'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'bolos', element: <CatalogPage /> },
      { path: 'bolos/:slug', element: <ProductPage /> },
      { path: 'carrinho', element: <CartPage /> },
      { path: 'finalizar', element: <CheckoutPage /> },
      { path: 'encomendas', element: <CustomOrderPage /> },
      { path: 'como-comprar', element: <HowToBuyPage /> },
      { path: 'privacidade', element: <PrivacyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
