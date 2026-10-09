import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router'
import { EmptyCart } from '@/components/cart/EmptyCart'
import { OrderSummary } from '@/components/cart/OrderSummary'
import { Button } from '@/components/ui/Button'
import { TextAreaField, TextField } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { Notice } from '@/components/ui/Notice'
import { PageHeader } from '@/components/ui/PageHeader'
import { Seo } from '@/components/ui/Seo'
import { WhatsappAction } from '@/components/ui/WhatsappAction'
import { storeConfig } from '@/config/store'
import { useCart } from '@/context/cart-context'
import { computeTotals } from '@/lib/cart'
import { addDays, formatDateBR, toISODate } from '@/lib/dates'
import { focusFirstInvalid } from '@/lib/forms'
import { formatBRL } from '@/lib/money'
import { emptyCheckoutForm, validateCheckout, type CheckoutForm, type FieldErrors } from '@/lib/validation'
import { buildOrderMessage } from '@/lib/whatsapp'

export function CheckoutPage() {
  const { lines, couponCode, clear } = useCart()
  const [form, setForm] = useState<CheckoutForm>(emptyCheckoutForm)
  const [errors, setErrors] = useState<FieldErrors<CheckoutForm>>({})
  const [step, setStep] = useState<'dados' | 'revisao'>('dados')
  const formRef = useRef<HTMLFormElement>(null)
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null)

  const today = toISODate(new Date())
  const minDate = addDays(today, storeConfig.minLeadDays)
  const fulfillmentOptions = storeConfig.fulfillment.filter((o) => o.enabled)
  const fulfillment = fulfillmentOptions.find((o) => o.id === form.fulfillment) ?? null

  const totals = computeTotals(lines, { couponCode, coupons: storeConfig.coupons, fulfillment })

  useEffect(() => {
    if (step === 'revisao') {
      window.scrollTo({ top: 0 })
      reviewHeadingRef.current?.focus()
    }
  }, [step])

  const set = (field: keyof CheckoutForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validateCheckout(form, { today, minLeadDays: storeConfig.minLeadDays, fulfillmentOptions })
    setErrors(found)
    if (Object.keys(found).length > 0) {
      focusFirstInvalid(formRef.current)
      return
    }
    setStep('revisao')
  }

  if (lines.length === 0) {
    return (
      <>
        <Seo title="Finalizar pedido" description="Revise e envie seu pedido pelo WhatsApp." noIndex />
        <PageHeader eyebrow="Pedido" title="Finalizar pedido" />
        <div className="container-page py-10">
          <EmptyCart />
        </div>
      </>
    )
  }

  const shippingLabel = !fulfillment
    ? 'Escolha abaixo'
    : fulfillment.fee === null
      ? 'A confirmar'
      : fulfillment.fee === 0
        ? 'Sem custo'
        : formatBRL(fulfillment.fee)

  const message = buildOrderMessage({
    storeName: storeConfig.name,
    lines,
    totals,
    form,
    fulfillmentLabel: fulfillment?.label ?? '',
  })

  const errorCount = Object.keys(errors).length

  return (
    <>
      <Seo title="Finalizar pedido" description="Revise e envie seu pedido pelo WhatsApp." noIndex />
      <PageHeader eyebrow={step === 'dados' ? 'Etapa 1 de 2' : 'Etapa 2 de 2'} title={step === 'dados' ? 'Dados do pedido' : 'Revisão final'}>
        <p>
          {step === 'dados'
            ? 'Informe como deseja receber o pedido. Seus dados são usados apenas para montar a mensagem do WhatsApp.'
            : 'Confira tudo antes de abrir o WhatsApp. O pedido só é confirmado após a resposta da confeitaria.'}
        </p>
      </PageHeader>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_24rem]">
        {step === 'dados' ? (
          <form ref={formRef} onSubmit={submit} noValidate className="space-y-10" aria-describedby="aviso-obrigatorios">
            <p id="aviso-obrigatorios" className="text-sm text-choco-soft">
              Campos marcados com <span className="text-rose-ink">*</span> são obrigatórios.
            </p>

            {errorCount > 0 && (
              <Notice tone="error" role="alert" title="Revise os campos destacados">
                {errorCount === 1 ? 'Há 1 campo a corrigir.' : `Há ${errorCount} campos a corrigir.`}
              </Notice>
            )}

            <fieldset className="space-y-5">
              <legend className="font-serif text-3xl font-semibold">Contato</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Nome" name="name" autoComplete="name" required value={form.name} onChange={set('name')} error={errors.name} />
                <TextField
                  label="Telefone ou WhatsApp"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="(11) 91234-5678"
                  required
                  value={form.phone}
                  onChange={set('phone')}
                  error={errors.phone}
                />
              </div>
            </fieldset>

            <fieldset aria-describedby={errors.fulfillment ? 'fulfillment-erro' : undefined}>
              <legend className="font-serif text-3xl font-semibold">
                Recebimento <span className="text-base text-rose-ink" aria-hidden="true">*</span>
              </legend>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {fulfillmentOptions.map((o) => {
                  const checked = form.fulfillment === o.id
                  return (
                    <label
                      key={o.id}
                      className={`flex cursor-pointer gap-3 rounded-2xl border bg-white p-5 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rose-ink ${
                        checked ? 'border-choco ring-1 ring-choco' : errors.fulfillment ? 'border-red-700' : 'border-line hover:border-choco/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        value={o.id}
                        checked={checked}
                        aria-invalid={errors.fulfillment ? true : undefined}
                        onChange={() => {
                          setForm((f) => ({ ...f, fulfillment: o.id }))
                          setErrors((errs) => ({ ...errs, fulfillment: undefined }))
                        }}
                        className="mt-1 accent-choco"
                      />
                      <span>
                        <span className="block font-semibold">{o.label}</span>
                        <span className="mt-1 block text-sm text-choco-soft">{o.description}</span>
                        <span className="mt-2 block text-sm font-medium">
                          {o.fee === null ? 'Taxa a confirmar' : o.fee === 0 ? 'Sem custo' : formatBRL(o.fee)}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
              {errors.fulfillment && (
                <p id="fulfillment-erro" className="mt-2 text-sm font-medium text-red-800">
                  {errors.fulfillment}
                </p>
              )}
              {fulfillment?.id === 'pickup' && storeConfig.pickupAddress && (
                <p className="mt-3 text-sm text-choco-soft">Endereço de retirada: {storeConfig.pickupAddress}</p>
              )}
            </fieldset>

            {fulfillment?.requiresAddress && (
              <fieldset className="space-y-5">
                <legend className="font-serif text-3xl font-semibold">Endereço de entrega</legend>
                <TextField
                  label="Rua e número"
                  name="address"
                  autoComplete="street-address"
                  required
                  value={form.address}
                  onChange={set('address')}
                  error={errors.address}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="Bairro" name="neighborhood" required value={form.neighborhood} onChange={set('neighborhood')} error={errors.neighborhood} />
                  <TextField label="Cidade" name="city" autoComplete="address-level2" required value={form.city} onChange={set('city')} error={errors.city} />
                </div>
                <TextField
                  label="Complemento ou ponto de referência"
                  name="complement"
                  value={form.complement}
                  onChange={set('complement')}
                  error={errors.complement}
                />
                <p className="text-sm text-choco-soft">A disponibilidade e a taxa de entrega para o seu endereço são confirmadas pelo atendimento.</p>
              </fieldset>
            )}

            <fieldset className="space-y-5">
              <legend className="font-serif text-3xl font-semibold">Data e observações</legend>
              <TextField
                label="Data desejada"
                name="date"
                type="date"
                min={minDate}
                required
                value={form.date}
                onChange={set('date')}
                error={errors.date}
                hint={`Sugerimos pelo menos ${storeConfig.minLeadDays} dias de antecedência (a partir de ${formatDateBR(minDate)}). A data é confirmada pela confeitaria.`}
              />
              <TextAreaField
                label="Observações"
                name="notes"
                maxLength={500}
                placeholder="Ex.: mensagem no topo, horário preferido, restrições alimentares…"
                value={form.notes}
                onChange={set('notes')}
                error={errors.notes}
              />
            </fieldset>

            <div className="flex flex-col-reverse gap-3 border-t border-line pt-8 sm:flex-row sm:justify-between">
              <Link to="/carrinho" className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-choco hover:underline">
                <Icon name="arrowLeft" className="size-4" /> Voltar ao carrinho
              </Link>
              <Button type="submit" size="lg">
                Revisar pedido
                <Icon name="arrowRight" className="size-4" />
              </Button>
            </div>
          </form>
        ) : (
          <section aria-labelledby="titulo-revisao" className="space-y-8">
            <h2 id="titulo-revisao" ref={reviewHeadingRef} tabIndex={-1} className="text-3xl focus:outline-none">
              Confira seu pedido
            </h2>

            <div className="rounded-3xl border border-line/70 bg-white p-6 shadow-soft">
              <h3 className="font-sans text-sm font-semibold tracking-[0.14em] text-rose-ink uppercase">Itens</h3>
              <ul className="mt-4 divide-y divide-line">
                {lines.map((l) => (
                  <li key={l.key} className="flex justify-between gap-4 py-3 text-sm">
                    <span>
                      <span className="font-semibold">
                        {l.quantity} × {l.product.name}
                      </span>
                      {l.selectionLabels.length > 0 && (
                        <span className="block text-choco-soft">{l.selectionLabels.map((s) => `${s.group}: ${s.choice}`).join(' · ')}</span>
                      )}
                      <span className="block text-choco-soft">{formatBRL(l.unitPrice)} cada</span>
                    </span>
                    <span className="font-semibold tabular-nums">{formatBRL(l.subtotal)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-line/70 bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-sans text-sm font-semibold tracking-[0.14em] text-rose-ink uppercase">Dados do pedido</h3>
                <button type="button" onClick={() => setStep('dados')} className="text-sm font-semibold text-choco underline-offset-2 hover:underline">
                  Editar dados
                </button>
              </div>
              <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[10rem_1fr]">
                <dt className="text-choco-soft">Nome</dt>
                <dd>{form.name}</dd>
                <dt className="text-choco-soft">Contato</dt>
                <dd>{form.phone}</dd>
                <dt className="text-choco-soft">Recebimento</dt>
                <dd>{fulfillment?.label}</dd>
                {fulfillment?.requiresAddress && (
                  <>
                    <dt className="text-choco-soft">Endereço</dt>
                    <dd>
                      {form.address}, {form.neighborhood}, {form.city}
                      {form.complement && ` (${form.complement})`}
                    </dd>
                  </>
                )}
                <dt className="text-choco-soft">Data desejada</dt>
                <dd>{formatDateBR(form.date)}</dd>
                {form.notes.trim() && (
                  <>
                    <dt className="text-choco-soft">Observações</dt>
                    <dd className="whitespace-pre-line">{form.notes}</dd>
                  </>
                )}
              </dl>
            </div>

            <details className="rounded-3xl border border-line/70 bg-white p-6 shadow-soft">
              <summary className="cursor-pointer text-sm font-semibold">Ver a mensagem que será enviada</summary>
              <pre className="mt-4 overflow-x-auto font-sans text-sm leading-relaxed whitespace-pre-wrap text-choco-soft">{message}</pre>
            </details>
          </section>
        )}

        <aside aria-labelledby="titulo-resumo-checkout" className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-6 rounded-3xl border border-line/70 bg-white p-6 shadow-soft sm:p-8">
            <h2 id="titulo-resumo-checkout" className="text-3xl">
              Resumo
            </h2>
            {step === 'dados' && (
              <ul className="space-y-2 text-sm">
                {lines.map((l) => (
                  <li key={l.key} className="flex justify-between gap-3">
                    <span className="text-choco-soft">
                      {l.quantity} × {l.product.name}
                    </span>
                    <span className="tabular-nums">{formatBRL(l.subtotal)}</span>
                  </li>
                ))}
              </ul>
            )}
            <OrderSummary totals={totals} shippingLabel={shippingLabel} />
            {totals.couponError && <p className="text-sm text-red-800">{totals.couponError}</p>}

            {step === 'revisao' && (
              <>
                <WhatsappAction
                  message={message}
                  label="Enviar pedido pelo WhatsApp"
                  afterOpenText="Envie a mensagem na conversa. Seu pedido só estará confirmado quando a confeitaria responder confirmando disponibilidade, valores e pagamento."
                />
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Deseja esvaziar o carrinho? Use esta opção depois de enviar a mensagem pelo WhatsApp.')) clear()
                  }}
                  className="w-full text-center text-sm text-choco-soft underline-offset-2 hover:text-choco hover:underline"
                >
                  Esvaziar carrinho
                </button>
              </>
            )}
            <p className="text-xs leading-relaxed text-choco-soft">
              Nenhum pagamento é feito no site. O carrinho é local ao seu navegador; o pedido não fica registrado até a confeitaria confirmar
              pelo WhatsApp.
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}
