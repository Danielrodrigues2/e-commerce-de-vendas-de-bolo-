import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  children?: ReactNode
}

export function PageHeader({ eyebrow, title, children }: PageHeaderProps) {
  return (
    <header className="border-b border-line/70 bg-blush/50">
      <div className="container-page py-10 sm:py-14">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 text-4xl sm:text-5xl">{title}</h1>
        {children && <div className="mt-3 max-w-2xl text-base text-choco-soft sm:text-lg">{children}</div>}
      </div>
    </header>
  )
}
