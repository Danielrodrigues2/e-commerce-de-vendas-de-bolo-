import type { IconName } from '@/components/ui/Icon'

/** Conteúdo institucional da página inicial (editável). Não inclua dados que a confeitaria não confirmou. */

export const benefits: { icon: IconName; title: string; text: string }[] = [
  { icon: 'whisk', title: 'Feitos artesanalmente', text: 'Cada bolo é preparado sob encomenda, com atenção a cada camada.' },
  { icon: 'heart', title: 'Ingredientes selecionados', text: 'Sabor de verdade, do recheio cremoso à finalização.' },
  { icon: 'sparkle', title: 'Do seu jeito', text: 'Escolha sabores, tamanho e tema para criar um bolo único.' },
  { icon: 'whatsapp', title: 'Pedido simples', text: 'Monte seu pedido no site e finalize a conversa pelo WhatsApp.' },
]

export const occasions = [
  { slug: 'aniversario', title: 'Aniversários', text: 'Velas, confeitos e o sabor favorito de quem celebra.' },
  { slug: 'casamento', title: 'Casamentos', text: 'Andares elegantes para um dia inesquecível.' },
  { slug: 'cha-de-bebe', title: 'Chá de bebê', text: 'Tons delicados para receber quem está chegando.' },
  { slug: 'datas-especiais', title: 'Datas especiais', text: 'Para adoçar conquistas, encontros e surpresas.' },
] as const

/**
 * Depoimentos reais de clientes, quando fornecidos pela confeitaria (com autorização).
 * Enquanto a lista estiver vazia, a seção não é exibida.
 */
export const testimonials: { quote: string; author: string; context?: string }[] = []
