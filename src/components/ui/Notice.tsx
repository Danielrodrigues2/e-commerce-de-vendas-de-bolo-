import type { ReactNode } from 'react'
import { Icon } from './Icon'

const tones = {
  info: { box: 'border-line bg-white', icon: 'info' as const, iconColor: 'text-rose-ink' },
  warning: { box: 'border-amber-300 bg-amber-50', icon: 'alert' as const, iconColor: 'text-amber-800' },
  success: { box: 'border-emerald-300 bg-emerald-50', icon: 'check' as const, iconColor: 'text-emerald-800' },
  error: { box: 'border-red-300 bg-red-50', icon: 'alert' as const, iconColor: 'text-red-800' },
}

interface NoticeProps {
  tone?: keyof typeof tones
  title?: string
  children: ReactNode
  className?: string
  role?: 'status' | 'alert'
}

export function Notice({ tone = 'info', title, children, className = '', role }: NoticeProps) {
  const t = tones[tone]
  return (
    <div role={role} className={`flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed ${t.box} ${className}`}>
      <Icon name={t.icon} className={`mt-0.5 size-5 shrink-0 ${t.iconColor}`} />
      <div className="space-y-1 text-choco">
        {title && <p className="font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  )
}
