import { Link } from 'react-router'
import { storeConfig } from '@/config/store'

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className="group flex items-center gap-2.5" aria-label={`${storeConfig.name} — página inicial`}>
      <svg viewBox="0 0 40 40" className="size-10 shrink-0" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#F8E7E9" />
        <path d="M10 27h20v3a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1v-3Z" fill="#55352F" />
        <path d="M11 20h18v7H11z" fill="#C87983" />
        <path d="M11 20c2 2 4 2 6 0s4-2 6 0 4 2 6 0v-1a2 2 0 0 0-2-2H13a2 2 0 0 0-2 2v1Z" fill="#FFF8F0" />
        <path d="M20 9c-1.6 1.6-1.6 3.4 0 5 1.6-1.6 1.6-3.4 0-5Z" fill="#C87983" />
        <path d="M20 14v3" stroke="#55352F" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span className="block font-serif text-2xl font-semibold tracking-tight text-choco">Doce Encanto</span>
        <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.32em] text-rose-ink uppercase">Confeitaria</span>
      </span>
    </Link>
  )
}
