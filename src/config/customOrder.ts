/**
 * Opções do formulário de bolo personalizado (editáveis).
 * Não há preços aqui: o valor de encomendas personalizadas é definido pela confeitaria após análise.
 */
export const customOrderOptions = {
  occasions: ['Aniversário', 'Casamento', 'Noivado', 'Chá de bebê / revelação', 'Batizado', 'Formatura', 'Evento corporativo', 'Outra'],
  sizes: ['Não sei — quero uma sugestão', 'Pequeno', 'Médio', 'Grande', 'Dois ou mais andares'],
  doughs: ['Massa branca', 'Massa de chocolate', 'Massa red velvet', 'Massa de cenoura', 'Outra (descrever nas observações)'],
  fillings: [
    'Brigadeiro',
    'Brigadeiro branco',
    'Ninho com morango',
    'Doce de leite',
    'Cream cheese',
    'Coco cremoso',
    'Ganache de chocolate',
    'Outro (descrever nas observações)',
  ],
  frostings: ['Chantilly', 'Ganache', 'Buttercream', 'Naked (camadas aparentes)', 'Pasta americana', 'Não sei — quero uma sugestão'],
  maxGuests: 1000,
} as const
