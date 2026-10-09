import type { Cents, FulfillmentMethod } from '@/types'

/**
 * Configuração central da loja.
 *
 * Todos os dados comerciais ficam aqui. Valores marcados como DEMONSTRAÇÃO precisam ser
 * revisados pela confeitaria antes da publicação. Não espalhe essas informações pelo código.
 */

export interface Coupon {
  code: string
  description: string
  /** 'percent' => value em pontos percentuais inteiros (10 = 10%). 'fixed' => value em centavos. */
  type: 'percent' | 'fixed'
  value: number
  /** Subtotal mínimo em centavos para o cupom valer. */
  minSubtotal?: Cents
  /** Cupons de demonstração devem ser removidos ou confirmados antes da publicação. */
  demo?: boolean
}

export interface FulfillmentOption {
  id: FulfillmentMethod
  label: string
  description: string
  enabled: boolean
  /** Taxa fixa em centavos. `null` = valor a confirmar pelo atendimento (depende do endereço). */
  fee: Cents | null
  requiresAddress: boolean
}

export interface StoreConfig {
  name: string
  shortName: string
  tagline: string
  /** Número com DDI + DDD, apenas dígitos. Vazio = não configurado. */
  whatsappNumber: string
  email: string
  social: { label: string; url: string }[]
  /** Texto livre. `null` = não informado (o site orienta a consultar pelo WhatsApp). */
  businessHours: string[] | null
  /** Endereço de retirada. `null` = informado pelo atendimento após a confirmação. */
  pickupAddress: string | null
  serviceArea: string | null
  fulfillment: FulfillmentOption[]
  /** Antecedência mínima, em dias, sugerida para a data desejada do pedido. */
  minLeadDays: number
  maxQuantityPerItem: number
  coupons: Coupon[]
  /** Exibe avisos de que preços e algumas informações são demonstrativos. */
  demoMode: boolean
  siteUrl: string
}

function readWhatsappFromEnv(): string {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER
  return typeof raw === 'string' ? raw.replace(/\D/g, '') : ''
}

export const storeConfig: StoreConfig = {
  name: 'Doce Encanto Confeitaria',
  shortName: 'Doce Encanto',
  tagline: 'Bolos artesanais para momentos especiais',
  // Defina VITE_WHATSAPP_NUMBER no arquivo .env (veja .env.example).
  whatsappNumber: readWhatsappFromEnv(),
  email: '',
  social: [],
  businessHours: null,
  pickupAddress: null,
  serviceArea: null,
  fulfillment: [
    {
      id: 'pickup',
      label: 'Retirada na confeitaria',
      description: 'O endereço e o horário de retirada são confirmados pelo atendimento.',
      enabled: true,
      fee: 0,
      requiresAddress: false,
    },
    {
      id: 'delivery',
      label: 'Entrega',
      description: 'A taxa depende do endereço e é confirmada pelo atendimento no WhatsApp.',
      enabled: true,
      fee: null,
      requiresAddress: true,
    },
  ],
  minLeadDays: 2,
  maxQuantityPerItem: 10,
  coupons: [
    {
      code: 'BEMVINDO10',
      description: '10% de desconto em pedidos a partir de R$ 100,00',
      type: 'percent',
      value: 10,
      minSubtotal: 10000,
      demo: true,
    },
  ],
  demoMode: true,
  siteUrl: '',
}
