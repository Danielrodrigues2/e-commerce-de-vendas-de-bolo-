/** Move o foco para o primeiro campo inválido de um formulário (após a renderização dos erros). */
export function focusFirstInvalid(form: HTMLFormElement | null): void {
  if (!form) return
  requestAnimationFrame(() => {
    form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  })
}
