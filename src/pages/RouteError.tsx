import { isRouteErrorResponse, useRouteError } from 'react-router'

/** Exibido quando ocorre um erro inesperado na renderização de uma rota. */
export function RouteError() {
  const error = useRouteError()
  const detail = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : null
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-serif text-5xl">Algo não saiu como esperado</h1>
      <p className="mt-4 text-choco-soft">Recarregue a página ou volte ao início. Se o problema continuar, fale com a confeitaria.</p>
      {detail && <p className="mt-2 text-sm text-choco-soft">{detail}</p>}
      <a href="/" className="mt-8 inline-block rounded-full bg-choco px-6 py-3 font-semibold text-white">
        Voltar ao início
      </a>
    </main>
  )
}
