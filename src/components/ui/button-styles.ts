export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'light'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-out select-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-ink ' +
  'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-choco text-white shadow-soft hover:bg-choco-deep hover:shadow-lift active:translate-y-px enabled:hover:-translate-y-px',
  secondary: 'border border-choco/25 bg-white text-choco hover:border-choco/60 hover:bg-blush/40 active:translate-y-px',
  ghost: 'text-choco hover:bg-blush/60',
  light: 'bg-white text-choco shadow-soft hover:bg-cream hover:shadow-lift',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-4 text-sm',
  md: 'min-h-11 px-6 text-sm',
  lg: 'min-h-13 px-8 text-base',
}

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = ''): string {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(' ')
}
