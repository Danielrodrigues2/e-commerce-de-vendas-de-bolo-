import { screen, within } from '@testing-library/react'
import { storeConfig } from '@/config/store'
import { CART_STORAGE_KEY } from '@/context/CartProvider'
import { renderApp } from './renderApp'

beforeAll(() => {
  // jsdom não implementa scrollTo
  window.scrollTo = () => {}
})

describe('carrinho integrado', () => {
  it('adiciona produto com opções, mantém após recarregar e calcula totais', async () => {
    const first = renderApp('/bolos/bolo-red-velvet')
    const { user } = first
    await user.click(screen.getByRole('radio', { name: /Grande/ }))
    expect(screen.getByRole('button', { name: /Adicionar ao carrinho · R\$ 209,90/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Aumentar quantidade/ }))
    await user.click(screen.getByRole('button', { name: /Adicionar ao carrinho/ }))
    expect(screen.getByText(/2 × Bolo Red Velvet adicionado/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Carrinho com 2 itens' })).toBeInTheDocument()

    const stored = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY)!)
    expect(stored.lines).toEqual([{ productId: 'bolo-red-velvet', selection: { tamanho: 'grande', acabamento: 'naked' }, quantity: 2 }])

    // "Recarrega" a aplicação: novo provider lendo o localStorage.
    first.unmount()
    const { user: user2 } = renderApp('/carrinho')
    expect(screen.getByRole('heading', { name: 'Bolo Red Velvet' })).toBeInTheDocument()
    expect(screen.getByText('Tamanho: Grande')).toBeInTheDocument()
    expect(screen.getByText('R$ 419,80', { selector: 'dd span' })).toBeInTheDocument()

    await user2.click(screen.getByRole('button', { name: /Diminuir quantidade/ }))
    expect(screen.getByText('R$ 209,90', { selector: 'dd span' })).toBeInTheDocument()

    await user2.click(screen.getByRole('button', { name: /Remover Bolo Red Velvet/ }))
    expect(screen.getByRole('heading', { name: 'Seu carrinho está vazio' })).toBeInTheDocument()
  })

  it('aplica somente cupons configurados', async () => {
    const { user } = renderApp('/bolos/bolo-de-chocolate-belga')
    await user.click(screen.getByRole('button', { name: /Adicionar ao carrinho/ }))
    await user.click(screen.getByRole('link', { name: 'Ver carrinho' }))
    await user.type(screen.getByLabelText('Cupom de desconto'), 'INVENTADO')
    await user.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Cupom inválido')

    const code = storeConfig.coupons[0]!.code
    await user.clear(screen.getByLabelText('Cupom de desconto'))
    await user.type(screen.getByLabelText('Cupom de desconto'), code.toLowerCase())
    await user.click(screen.getByRole('button', { name: 'Aplicar' }))
    expect(screen.getByText(`Desconto (${code})`)).toBeInTheDocument()
    expect(screen.getByText('−R$ 12,99')).toBeInTheDocument()
  })

  it('não permite adicionar produto indisponível nem produto sob orçamento', () => {
    renderApp('/bolos/bolo-de-prestigio')
    expect(screen.getByRole('button', { name: 'Indisponível' })).toBeDisabled()
  })

  it('produto sob orçamento leva ao formulário de encomenda', async () => {
    const { user, router } = renderApp('/bolos/bolo-personalizado')
    expect(screen.queryByRole('button', { name: /Adicionar ao carrinho/ })).not.toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /Solicitar orçamento/ }))
    expect(router.state.location.pathname).toBe('/encomendas')
  })
})

describe('catálogo integrado', () => {
  it('combina pesquisa, categoria e preço sem perder a pesquisa', async () => {
    const { user, router } = renderApp('/bolos?q=brigadeiro')
    expect(screen.getByRole('heading', { name: /3 bolos encontrados/ })).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Chocolates' }))
    expect(router.state.location.search).toContain('q=brigadeiro')
    expect(screen.getByRole('heading', { name: /2 bolos encontrados/ })).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Até R$ 100' }))
    const results = screen.getByRole('heading', { name: /1 bolo encontrado/ }).closest('section')!
    expect(within(results).getByRole('link', { name: 'Bolo de Brigadeiro' })).toBeInTheDocument()
    expect(new URLSearchParams(router.state.location.search).get('q')).toBe('brigadeiro')

    await user.click(screen.getByRole('radio', { name: 'Acima de R$ 130' }))
    expect(screen.getByRole('heading', { name: 'Nenhum bolo encontrado' })).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /Limpar filtros/ })[0]!)
    expect(screen.getByRole('heading', { name: /8 bolos encontrados/ })).toBeInTheDocument()
  })
})

describe('checkout e WhatsApp', () => {
  const original = storeConfig.whatsappNumber
  afterEach(() => {
    storeConfig.whatsappNumber = original
  })

  async function fillCheckout() {
    const ctx = renderApp('/bolos/bolo-de-brigadeiro')
    const { user } = ctx
    await user.click(screen.getByRole('button', { name: /Adicionar ao carrinho/ }))
    await user.click(screen.getByRole('link', { name: 'Ver carrinho' }))
    await user.click(screen.getByRole('link', { name: /Revisar pedido/ }))

    await user.click(screen.getByRole('button', { name: /Revisar pedido/ }))
    expect(screen.getByRole('alert')).toHaveTextContent('Há 4 campos a corrigir')
    expect(screen.getByText('Informe seu nome.')).toBeInTheDocument()
    expect(screen.getByLabelText(/^Nome/)).toHaveAttribute('aria-invalid', 'true')

    await user.type(screen.getByLabelText(/^Nome/), 'Ana Souza')
    await user.type(screen.getByLabelText(/Telefone ou WhatsApp/), '(11) 91234-5678')
    await user.click(screen.getByRole('radio', { name: /Entrega/ }))
    await user.click(screen.getByRole('button', { name: /Revisar pedido/ }))
    // Entrega exige endereço.
    expect(screen.getByText('Informe rua e número para entrega.')).toBeInTheDocument()
    await user.type(screen.getByLabelText(/Rua e número/), 'Rua das Flores, 10')
    await user.type(screen.getByLabelText(/^Bairro/), 'Centro')
    await user.type(screen.getByLabelText(/^Cidade/), 'São Paulo')
    const date = new Date()
    date.setDate(date.getDate() + 5)
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    await user.type(screen.getByLabelText(/Data desejada/), iso)
    await user.click(screen.getByRole('button', { name: /Revisar pedido/ }))
    expect(screen.getByRole('heading', { name: 'Confira seu pedido' })).toBeInTheDocument()
    return ctx
  }

  it('sem número configurado, explica e não gera link', async () => {
    storeConfig.whatsappNumber = ''
    await fillCheckout()
    expect(screen.getByText(/ainda não foi configurado/)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Enviar pedido pelo WhatsApp/ })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Copiar mensagem/ })).toBeInTheDocument()
  })

  it('com número configurado, abre o WhatsApp apenas pelo clique e não afirma confirmação', async () => {
    storeConfig.whatsappNumber = '5511999990000'
    const { user } = await fillCheckout()
    const link = screen.getByRole('link', { name: /Enviar pedido pelo WhatsApp/ })
    const href = link.getAttribute('href')!
    expect(href).toMatch(/^https:\/\/wa\.me\/5511999990000\?text=/)
    const text = decodeURIComponent(href.split('?text=')[1]!)
    expect(text).toContain('1 x R$ 89,90 = R$ 89,90')
    expect(text).toContain('Recebimento: Entrega')
    expect(text).toContain('Endereço: Rua das Flores, 10, Centro, São Paulo')
    expect(link).toHaveAttribute('target', '_blank')

    link.addEventListener('click', (e) => e.preventDefault())
    await user.click(link)
    expect(screen.getByText(/só estará confirmado quando a confeitaria responder/)).toBeInTheDocument()
  })
})

describe('encomenda personalizada', () => {
  it('valida, mostra resumo e só então oferece o envio', async () => {
    storeConfig.whatsappNumber = '5511999990000'
    const { user } = renderApp('/encomendas')
    await user.click(screen.getByRole('button', { name: /Revisar solicitação/ }))
    expect(screen.getByRole('alert')).toHaveTextContent('Há 8 campos a corrigir')

    await user.selectOptions(screen.getByLabelText(/Tipo de ocasião/), 'Aniversário')
    await user.type(screen.getByLabelText(/Quantidade de pessoas/), '30')
    await user.selectOptions(screen.getByLabelText(/^Massa/), 'Massa branca')
    await user.selectOptions(screen.getByLabelText(/^Recheio/), 'Brigadeiro')
    await user.selectOptions(screen.getByLabelText(/^Cobertura/), 'Chantilly')
    await user.type(screen.getByLabelText(/Tema ou decoração/), 'Jardim')
    const d = new Date()
    d.setDate(d.getDate() + 10)
    await user.type(
      screen.getByLabelText(/Data pretendida/),
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    )
    await user.type(screen.getByLabelText(/^Nome/), 'Ana')
    expect(screen.queryByRole('link', { name: /WhatsApp/ })).not.toBeInTheDocument()
    await user.type(screen.getByLabelText(/Telefone ou WhatsApp/), '11912345678')
    await user.click(screen.getByRole('button', { name: /Revisar solicitação/ }))

    expect(screen.getByRole('heading', { name: 'Revise sua solicitação' })).toBeInTheDocument()
    expect(screen.getByText('Jardim')).toBeInTheDocument()
    expect(screen.getByText(/dependem da confirmação da confeitaria/)).toBeInTheDocument()
    const href = screen.getByRole('link', { name: /Enviar solicitação pelo WhatsApp/ }).getAttribute('href')!
    expect(decodeURIComponent(href)).toContain('Tema / decoração: Jardim')
    storeConfig.whatsappNumber = ''
  })
})

describe('navegação', () => {
  it('todos os links internos levam a páginas existentes', async () => {
    const visited = new Set<string>()
    const queue = ['/']
    while (queue.length) {
      const path = queue.shift()!
      if (visited.has(path)) continue
      visited.add(path)
      const { unmount, container } = renderApp(path)
      expect(screen.queryByRole('heading', { name: /não está no cardápio/ }), `404 em ${path}`).not.toBeInTheDocument()
      for (const a of container.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')) {
        const href = a.getAttribute('href')!
        if (!visited.has(href)) queue.push(href)
      }
      unmount()
    }
    expect(visited.size).toBeGreaterThan(15)
    expect(visited).toContain('/bolos/bolo-de-ninho-com-morango')
    expect(visited).toContain('/privacidade')
  })

  it('rota desconhecida mostra página 404', () => {
    renderApp('/nao-existe')
    expect(screen.getByRole('heading', { name: /não está no cardápio/ })).toBeInTheDocument()
  })
})
