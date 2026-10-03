// esse componente é responsável por renderizar a visualização do produto, incluindo o fundo, o objeto arquitetônico e a categoria do produto. Ele utiliza classes CSS para estilizar os elementos e aplicar efeitos visuais, como gradientes e desfoque de fundo.

import type { Product } from '../data/products'

type ProductVisualProps = {
  product: Product
  large?: boolean
}

export function ProductVisual({
  product,
  large = false,
}: ProductVisualProps) {
  return (
    <div
      className={`product-visual relative overflow-hidden rounded-[2rem] bg-zinc-100 ${
        large ? 'aspect-[1.1/1]' : 'aspect-[4/3]'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%)]" />

      <div
        className={`architectural-object architectural-${product.accent}`}
      >
        <div className="object-frame">
          <div className="object-glass" />
          <div className="object-line vertical" />
          <div className="object-line horizontal" />
        </div>
      </div>

      <div className="absolute bottom-5 left-5 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-xs font-medium backdrop-blur-md">
        {product.category}
      </div>
    </div>
  )
}