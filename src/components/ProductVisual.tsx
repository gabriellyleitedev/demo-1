// esse componente é responsável por renderizar a visualização do produto: a imagem real, com uma entrada sutil, e a categoria sobreposta.

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

      <div className="absolute bottom-5 left-5 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-xs font-medium backdrop-blur-md">
        {product.category}
      </div>
    </div>
  )
}
