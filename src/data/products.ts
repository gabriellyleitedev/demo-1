// Catalogo de produtos da empresa, com informações detalhadas sobre cada item.

import windowSliding from '../assets/products/window-sliding.jpg'

export type Product = {
  id: number
  name: string
  category: string
  description: string
  details: string[]
  accent: string
  // opcional enquanto as imagens dos demais produtos não chegam
  image?: string
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Janela de correr',
    category: 'Janelas',
    description:
      'Uma solução elegante para ampliar a entrada de luz e aproveitar melhor os ambientes.',
    details: ['Abertura deslizante', 'Sob medida', 'Alumínio'],
    accent: 'window',
    image: windowSliding,
  },
  {
    id: 2,
    name: 'Janela Maxim-ar',
    category: 'Janelas',
    description:
      'Abertura projetante para ambientes que precisam de ventilação e praticidade.',
    details: ['Alta ventilação', 'Sob medida', 'Alumínio'],
    accent: 'awning',
  },
  {
    id: 3,
    name: 'Porta de correr',
    category: 'Portas',
    description:
      'Grandes vãos, linhas limpas e integração entre ambientes internos e externos.',
    details: ['Grandes vãos', 'Sob medida', 'Alumínio'],
    accent: 'sliding-door',
  },
  {
    id: 4,
    name: 'Porta de giro',
    category: 'Portas',
    description:
      'Uma solução clássica com acabamento contemporâneo para diferentes projetos.',
    details: ['Abertura tradicional', 'Sob medida', 'Alumínio'],
    accent: 'door',
  },
  {
    id: 5,
    name: 'Box para banheiro',
    category: 'Banheiro',
    description:
      'Projeto sob medida pensado para aproveitar o espaço com leveza e funcionalidade.',
    details: ['Vidro temperado', 'Sob medida', 'Acabamento premium'],
    accent: 'bathroom',
  },
]