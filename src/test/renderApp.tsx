import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { CartProvider } from '@/context/CartProvider'
import { routes } from '@/routes'

export function renderApp(path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const user = userEvent.setup()
  const utils = render(
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>,
  )
  return { ...utils, router, user }
}
