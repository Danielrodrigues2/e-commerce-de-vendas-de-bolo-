import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { Icon } from '@/components/ui/Icon'
import { Notice } from '@/components/ui/Notice'
import { PageHeader } from '@/components/ui/PageHeader'
import { Seo } from '@/components/ui/Seo'
import { WhatsappAction } from '@/components/ui/WhatsappAction'
import { customOrderOptions as opts } from '@/config/customOrder'
import { storeConfig } from '@/config/store'
import { addDays, formatDateBR, toISODate } from '@/lib/dates'
import { focusFirstInvalid } from '@/lib/forms'
import { emptyCustomOrderForm, validateCustomOrder, type CustomOrderForm, type FieldErrors } from '@/lib/validation'
import { buildCustomOrderMessage } from '@/lib/whatsapp'

export function CustomOrderPage() {
  const [form, setForm] = useState<CustomOrderForm>(emptyCustomOrderForm)
  const [errors, setErrors] = useState<FieldErrors<CustomOrderForm>>({})
  const [step, setStep] = useState<'form' | 'review'>('form')
  const formRef = useRef<HTMLFormElement>(null)
  const reviewRef = useRef<HTMLHeadingElement>(null)

  const today = toISODate(new Date())
  const minDate = addDays(today, storeConfig.minLeadDays)

  useEffect(() => {
    if (step === 'review') {
      window.scrollTo({ top: 0 })
      reviewRef.current?.focus()
    }
  }, [step])

  const set = (field: keyof CustomOrderForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validateCustomOrder(form, { today, minLeadDays: storeConfig.minLeadDays, maxGuests: opts.maxGuests })
    setErrors(found)
    if (Object.keys(found).length > 0) {
      focusFirstInvalid(formRef.current)
      return
    }
    setStep('review')
  }

  const errorCount = Object.keys(errors).length
  const summary: [string, string][] = [
    ['Ocasião', form.occasion],
    ['Quantidade de pessoas', form.guests],
    ['Tamanho', form.size],
    ['Massa', form.dough],
    ['Recheio', form.filling],
    ['Cobertura', form.frosting],
    ['Tema / decoração', form.theme],
    ['Data desejada', formatDateBR(form.date)],
    ['Referência', form.reference],
    ['Observações', form.notes],
    ['Nome', form.name],
    ['Telefone', form.phone],
  ]

  return (
    <>
      <Seo
        title="Bolo personalizado"
        description="Solicite o orçamento de um bolo personalizado: escolha ocasião, sabores, cobertura e tema. Resposta pelo WhatsApp."
      />
      <PageHeader eyebrow="Encomendas" title="Personalize seu bolo">
        <p>Conte os detalhes da sua comemoração. A confeitaria analisa o pedido e responde com proposta, valor e disponibilidade.</p>
      </PageHeader>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_22rem]">
        {step === 'form' ? (
          <form ref={formRef} onSubmit={submit} noValidate className="space-y-10">
            <p className="text-sm text-choco-soft">
              Campos marcados com <span className="text-rose-ink">*</span> são obrigatórios.
            </p>
            {errorCount > 0 && (
              <Notice tone="error" role="alert" title="Revise os campos destacados">
                {errorCount === 1 ? 'Há 1 campo a corrigir.' : `Há ${errorCount} campos a corrigir.`}
              </Notice>
            )}

            <fieldset className="space-y-5">
              <legend className="font-serif text-3xl font-semibold">Sobre a ocasião</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="Tipo de ocasião" name="occasion" required options={opts.occasions} value={form.occasion} onChange={set('occasion')} error={errors.occasion} />
                <TextField
                  label="Quantidade de pessoas"
                  name="guests"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={opts.maxGuests}
                  step={1}
                  required
                  value={form.guests}
                  onChange={set('guests')}
                  error={errors.guests}
                  hint="Um número aproximado já ajuda."
                />
                <SelectField label="Tamanho desejado" name="size" options={opts.sizes} value={form.size} onChange={set('size')} error={errors.size} />
                <TextField
                  label="Data pretendida"
                  name="date"
                  type="date"
                  min={minDate}
                  required
                  value={form.date}
                  onChange={set('date')}
                  error={errors.date}
                  hint={`A partir de ${formatDateBR(minDate)}. Sujeita à confirmação.`}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="font-serif text-3xl font-semibold">Sabores e acabamento</legend>
              <div className="grid gap-5 sm:grid-cols-3">
                <SelectField label="Massa" name="dough" required options={opts.doughs} value={form.dough} onChange={set('dough')} error={errors.dough} />
                <SelectField label="Recheio" name="filling" required options={opts.fillings} value={form.filling} onChange={set('filling')} error={errors.filling} />
                <SelectField label="Cobertura" name="frosting" required options={opts.frostings} value={form.frosting} onChange={set('frosting')} error={errors.frosting} />
              </div>
              <TextField
                label="Tema ou decoração"
                name="theme"
                maxLength={200}
                placeholder="Ex.: jardim com flores em tons de rosa, tema de super-herói…"
                value={form.theme}
                onChange={set('theme')}
                error={errors.theme}
              />
              <TextField
                label="Imagem de referência"
                name="reference"
                maxLength={300}
                placeholder="Cole um link (Pinterest, Instagram…) ou descreva a referência"
                value={form.reference}
                onChange={set('reference')}
                error={errors.reference}
                hint="Este site não armazena arquivos. Se tiver uma foto, envie-a diretamente na conversa do WhatsApp após abrir o pedido."
              />
              <TextAreaField
                label="Observações"
                name="notes"
                maxLength={800}
                placeholder="Restrições alimentares, mensagem no bolo, cores, horário…"
                value={form.notes}
                onChange={set('notes')}
                error={errors.notes}
              />
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="font-serif text-3xl font-semibold">Seu contato</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Nome" name="name" autoComplete="name" required value={form.name} onChange={set('name')} error={errors.name} />
                <TextField
                  label="Telefone ou WhatsApp"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(11) 91234-5678"
                  required
                  value={form.phone}
                  onChange={set('phone')}
                  error={errors.phone}
                />
              </div>
            </fieldset>

            <div className="border-t border-line pt-8">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Revisar solicitação
                <Icon name="arrowRight" className="size-4" />
              </Button>
            </div>
          </form>
        ) : (
          <section aria-labelledby="titulo-revisao-encomenda" className="space-y-6">
            <h2 id="titulo-revisao-encomenda" ref={reviewRef} tabIndex={-1} className="text-4xl focus:outline-none">
              Revise sua solicitação
            </h2>
            <div className="rounded-3xl border border-line/70 bg-white p-6 shadow-soft sm:p-8">
              <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[12rem_1fr]">
                {summary
                  .filter(([, v]) => v.trim())
                  .map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-choco-soft">{k}</dt>
                      <dd className="whitespace-pre-line">{v}</dd>
                    </div>
                  ))}
              </dl>
              <Button variant="secondary" className="mt-6" onClick={() => setStep('form')}>
                <Icon name="arrowLeft" className="size-4" /> Editar informações
              </Button>
            </div>
            <Notice title="Importante">
              Esta é uma solicitação de orçamento. Data, preço final e disponibilidade dependem da confirmação da confeitaria.
            </Notice>
            <WhatsappAction
              message={buildCustomOrderMessage(storeConfig.name, form)}
              label="Enviar solicitação pelo WhatsApp"
              afterOpenText="Envie a mensagem na conversa e, se tiver, anexe a imagem de referência. A confeitaria responderá com a proposta; a encomenda só está confirmada após esse retorno."
            />
          </section>
        )}

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl bg-blush p-6 sm:p-8">
            <h2 className="text-3xl">Como funciona</h2>
            <ol className="mt-5 space-y-4 text-sm">
              {[
                'Preencha os detalhes da sua comemoração.',
                'Revise o resumo e abra o WhatsApp com a mensagem pronta.',
                'Envie a mensagem e, se quiser, fotos de referência.',
                'A confeitaria retorna com proposta, valor e disponibilidade.',
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white font-semibold text-rose-ink">{i + 1}</span>
                  <span className="pt-0.5">{t}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="px-2 text-xs leading-relaxed text-choco-soft">
            Usamos seus dados apenas para montar a mensagem enviada por você ao WhatsApp. Nada é armazenado neste site.
          </p>
        </aside>
      </div>
    </>
  )
}
