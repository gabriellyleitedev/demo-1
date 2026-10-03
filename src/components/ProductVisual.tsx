// esse componente é responsável por renderizar a visualização do produto, incluindo o fundo, o objeto arquitetônico e a categoria do produto. Quando o produto tem imagem real, ela substitui o objeto arquitetônico em CSS.

import { motion } from 'framer-motion'
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
      className={`product-visual group relative overflow-hidden rounded-[2rem] bg-zinc-100 ${
        large ? 'aspect-[1.1/1]' : 'aspect-[4/3]'
      }`}
    >
      {product.image ? (
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          initial={{ scale: 1.05, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <>
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
        </>
      )}

      <div className="absolute bottom-5 left-5 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-xs font-medium backdrop-blur-md">
        {product.category}
      </div>
    </div>
  )
}
