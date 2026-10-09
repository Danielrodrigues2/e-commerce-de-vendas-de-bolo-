import { useState, type ImgHTMLAttributes } from 'react'

export const FALLBACK_IMAGE = '/images/placeholder.svg'

interface ProductImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string
  alt: string
  /** Imagens acima da dobra carregam imediatamente; as demais usam carregamento tardio. */
  priority?: boolean
}

/** Imagem com dimensões reservadas, carregamento tardio e substituição em caso de erro. */
export function ProductImage({ src, alt, priority = false, className = '', width = 800, height = 1000, ...rest }: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  return (
    <img
      src={failed ? FALLBACK_IMAGE : src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      onError={() => setFailed(true)}
      className={`bg-blush object-cover ${className}`}
      {...rest}
    />
  )
}
