import { storeConfig } from '@/config/store'

interface SeoProps {
  title?: string
  description: string
  /** Use em páginas que não devem ser indexadas (carrinho, checkout). */
  noIndex?: boolean
}

/** Metadados por página. O React 19 move <title> e <meta> automaticamente para o <head>. */
export function Seo({ title, description, noIndex }: SeoProps) {
  const fullTitle = title ? `${title} | ${storeConfig.name}` : `${storeConfig.name} — ${storeConfig.tagline}`
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {noIndex && <meta name="robots" content="noindex" />}
    </>
  )
}
