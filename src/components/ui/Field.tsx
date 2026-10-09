import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

const controlBase =
  'block w-full rounded-xl border bg-white px-4 py-3 text-base text-choco placeholder:text-choco-soft/70 ' +
  'transition focus:border-rose-ink focus:ring-2 focus:ring-rose/30 focus:outline-none ' +
  'disabled:cursor-not-allowed disabled:bg-cream'

function controlClasses(hasError: boolean) {
  return `${controlBase} ${hasError ? 'border-red-700' : 'border-line'}`
}

interface FieldShellProps {
  id: string
  label: string
  required?: boolean
  hint?: ReactNode
  error?: string
  children: ReactNode
}

function FieldShell({ id, label, required, hint, error, children }: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-choco">
        {label}
        {required ? (
          <span className="text-rose-ink" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-choco-soft"> (opcional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-choco-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm font-medium text-red-800">
          <span aria-hidden="true">•</span>
          {error}
        </p>
      )}
    </div>
  )
}

function describedBy(id: string, hint?: ReactNode, error?: string) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

type Common = { label: string; hint?: ReactNode; error?: string; name: string }

export function TextField({ label, hint, error, required, id: idProp, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId()
  const id = idProp ?? `${rest.name}-${autoId}`
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClasses(Boolean(error))}
        {...rest}
      />
    </FieldShell>
  )
}

export function TextAreaField({ label, hint, error, required, id: idProp, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const autoId = useId()
  const id = idProp ?? `${rest.name}-${autoId}`
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <textarea
        id={id}
        rows={4}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClasses(Boolean(error))}
        {...rest}
      />
    </FieldShell>
  )
}

interface SelectFieldProps extends Common, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  options: readonly string[]
  placeholder?: string
}

export function SelectField({ label, hint, error, required, options, placeholder = 'Selecione', id: idProp, ...rest }: SelectFieldProps) {
  const autoId = useId()
  const id = idProp ?? `${rest.name}-${autoId}`
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${controlClasses(Boolean(error))} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%2355352F'%20stroke-width='2'%3E%3Cpath%20d='m6%209%206%206%206-6'/%3E%3C/svg%3E")] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}
