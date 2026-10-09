# Doce Encanto Confeitaria — loja virtual

Loja virtual para bolos artesanais, bolos de aniversário e encomendas personalizadas. O cliente monta o pedido no site e o envia pelo **WhatsApp**. Não há backend: o site não registra pedidos, não processa pagamentos e não armazena dados pessoais.

## Stack

- React 19 + TypeScript 5.9 + Vite 8
- Tailwind CSS 4 (tema com a paleta da marca em `src/index.css`)
- React Router 7 (`createBrowserRouter`, URLs legíveis)
- Fontes locais via Fontsource (Cormorant Garamond + Manrope), com fontes de sistema como alternativa
- Vitest + Testing Library (unitários e integração), Playwright (E2E desktop e mobile), ESLint

## Comandos

```bash
npm install           # instala dependências
npm run dev           # servidor de desenvolvimento (http://localhost:5173)
npm run build         # checagem de tipos + build de produção em dist/
npm run preview       # serve o build
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm test              # testes unitários e de integração (Vitest)
npm run test:e2e      # testes E2E (Playwright; faz build e sobe o preview)
npm run images        # regenera as ilustrações SVG em public/images
```

Para o E2E, instale o navegador uma vez (`npx playwright install chromium`) ou aponte `CHROMIUM_PATH` para um Chromium já instalado.

## Configuração da loja

| O quê | Onde |
| --- | --- |
| **Número do WhatsApp** | `.env` → `VITE_WHATSAPP_NUMBER=55DDDNUMERO` (só dígitos; veja `.env.example`). Sem ele, o checkout explica que o número não está configurado e oferece copiar a mensagem. |
| Nome, horários, e-mail, redes sociais, endereço de retirada, área de entrega | `src/config/store.ts` (valores `null`/vazios são omitidos do site) |
| Entrega e retirada (taxa fixa ou `null` = a confirmar) | `storeConfig.fulfillment` |
| Antecedência mínima e limite por item | `storeConfig.minLeadDays`, `storeConfig.maxQuantityPerItem` |
| Cupons | `storeConfig.coupons` (somente códigos listados são aceitos) |
| Avisos de “valores demonstrativos” | `storeConfig.demoMode` |
| Produtos, preços (em centavos), opções e disponibilidade | `src/data/products.ts` |
| Categorias | `src/data/categories.ts` |
| Opções do formulário de bolo personalizado | `src/config/customOrder.ts` |
| Benefícios, ocasiões, depoimentos | `src/data/content.ts` (a seção de depoimentos só aparece se houver depoimentos reais) |

### ⚠️ Valores de demonstração, para revisar antes de publicar

- **Preços** dos produtos e **acréscimos das opções** (tamanho Grande, acabamento coberto) são demonstrativos.
- O cupom **`BEMVINDO10`** (10% acima de R$ 100) é um exemplo marcado com `demo: true`. Remova-o ou confirme com a confeitaria.
- O **Bolo de Prestígio** está como indisponível só para demonstrar esse estado (`available: false`).
- Não há número de WhatsApp, endereço, horários ou redes sociais definidos. Nenhum desses dados foi inventado.
- **Imagens:** as fotos de bolos são **ilustrações SVG locais** geradas por `scripts/generate-illustrations.mjs`. Bancos de imagens externos não estavam acessíveis no ambiente de desenvolvimento, então não foi possível verificar URLs. Para usar fotos reais, coloque os arquivos em `public/images/products/` e troque `src` em `src/data/products.ts`. Se uma imagem falhar, o componente `ProductImage` exibe `public/images/placeholder.svg`.

## Funcionalidades

- **Página inicial**: banner, categorias, destaques, benefícios, galeria de ocasiões, “como funciona” e chamada final.
- **Catálogo** (`/bolos`): pesquisa por nome, descrição e tags (sem diferenciar acentos), filtros de categoria e faixa de preço combinados, ordenação, estado vazio e produto indisponível. Os filtros ficam na URL (`?q=&categoria=&preco=&ordem=`) e alterar um não apaga os outros.
- **Produto** (`/bolos/:slug`): três tipos de preço:
  - `fixed`: preço fixo;
  - `options`: preço base + `priceDelta` explícito por escolha;
  - `quote`: sob orçamento, sem preço; leva ao formulário de encomenda.
- **Carrinho** (`/carrinho`):
  - valores em centavos inteiros;
  - itens identificados por produto + opções, então configurações diferentes ficam em linhas separadas;
  - quantidades inteiras de 1 até o limite configurado;
  - salvo no `localStorage`, ressanitizado contra o catálogo ao carregar e sincronizado entre abas;
  - preços sempre recalculados a partir do catálogo.
- **Checkout** (`/finalizar`):
  - dados de contato, retirada ou entrega (endereço só para entrega) e data com antecedência mínima;
  - revisão final e mensagem montada e codificada para `wa.me`;
  - o WhatsApp só abre com o clique do usuário;
  - nenhum texto afirma que o pedido foi enviado ou confirmado.
- **Encomenda personalizada** (`/encomendas`):
  - formulário validado, com resumo para revisão antes do envio;
  - aviso de que data, preço e disponibilidade dependem da confeitaria;
  - referência de imagem em texto (link ou descrição), com orientação para enviar a foto pelo WhatsApp. Não há upload fictício.
- **Como comprar** (`/como-comprar`), **Privacidade/LGPD** (`/privacidade`), **404**.
- **Acessibilidade**:
  - HTML semântico, link “pular para o conteúdo” e foco visível;
  - rótulos e `aria-invalid`/`aria-describedby` nos campos, com foco no primeiro erro;
  - mensagens em regiões `aria-live` e menu mobile com `aria-expanded` e fechamento por Esc;
  - respeito a `prefers-reduced-motion`.
- **SEO**:
  - título e descrição por página (metadados nativos do React 19);
  - `noindex` em carrinho e checkout e `robots.txt`;
  - imagens com `width`/`height` e `loading="lazy"` fora da primeira dobra.
  - Não há dados estruturados com informações inexistentes.

## Estrutura

```
src/
  config/        store.ts (configuração comercial), customOrder.ts
  data/          products.ts, categories.ts, content.ts
  lib/           money, pricing, cart, coupons, catalog, validation, whatsapp, dates, storage (+ __tests__)
  context/       CartProvider.tsx, cart-context.ts
  components/    layout/ (Header, Footer, Layout…), ui/ (Button, Field, Notice, WhatsappAction…), product/, cart/
  pages/         Home, Catalog, Product, Cart, Checkout, CustomOrder, HowToBuy, Privacy, NotFound
  routes.tsx     rotas compartilhadas por app e testes
  test/          setup, fixtures e testes de integração
e2e/             testes Playwright (desktop + mobile)
scripts/         gerador das ilustrações SVG
```

## Hospedagem

É uma SPA estática (`dist/`). O servidor precisa redirecionar rotas desconhecidas para `index.html`. Já estão incluídos `public/_redirects` (Netlify/Cloudflare Pages) e `vercel.json`.

## Limitações (dependem de backend ou serviços externos)

- O carrinho é **local ao navegador**. Pedidos **não ficam registrados** para a equipe: o pedido só existe depois que o cliente envia a mensagem pelo WhatsApp e a confeitaria confirma.
- Sem estoque em tempo real, painel administrativo, pagamento on-line, cálculo de frete por endereço ou upload de imagens.
- Os preços são validados apenas no cliente. A confirmação final cabe ao atendimento.

### Arquitetura sugerida para uma versão com backend

1. API com validação de esquema (ex.: Node + Zod) que **recalcula preços no servidor** a partir do catálogo no banco.
2. Banco de dados (ex.: PostgreSQL) com produtos, pedidos e estados do pedido (recebido → confirmado → em produção → pronto/entregue → cancelado).
3. Painel autenticado para a equipe gerenciar catálogo, disponibilidade e pedidos.
4. Pagamentos por provedor confiável (Pix/cartão via gateway) com webhooks. O site nunca manipula nem armazena dados de cartão.
5. Armazenamento de arquivos (ex.: S3) com URLs assinadas para imagens de referência.
6. Segredos em variáveis de ambiente **no servidor**. Nada sensível no bundle do navegador (`VITE_*` é público).
7. Proteção dos endpoints (rate limiting, CORS restrito, validação de entrada) e política de retenção de dados conforme a LGPD.
