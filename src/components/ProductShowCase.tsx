import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '../data/products'
import { ProductVisual } from './ProductVisual'

type ProductShowcaseProps = {
  products: Product[]
  onSelect: (product: Product) => void
}

export function ProductShowcase({
  products,
  onSelect,
}: ProductShowcaseProps) {
  return (
    <section id="produtos" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Catálogo
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Escolha o ponto de partida.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500">
            Cada projeto começa com uma escolha. Selecione o modelo que mais
            combina com o seu espaço.
          </p>
        </motion.div>

        <div className="mt-20 space-y-32">
          {products.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{
                opacity: 0,
                y: 80,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: '-120px',
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.04,
              }}
              className={`grid gap-10 lg:grid-cols-2 lg:items-center ${
                index % 2 !== 0 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <ProductVisual product={product} large />

              <div className="max-w-lg">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  0{index + 1} / {product.category}
                </span>

                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  {product.name}
                </h3>

                <p className="mt-5 text-base leading-7 text-zinc-500">
                  {product.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {product.details.map((detail) => (
                    <span
                      key={detail}
                      className="rounded-full border border-zinc-200 px-3.5 py-2 text-xs text-zinc-600"
                    >
                      {detail}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onSelect(product)}
                  className="group mt-9 inline-flex items-center gap-3 text-sm font-semibold"
                >
                  Configurar este projeto

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:translate-x-1">
                    <ArrowRight size={15} />
                  </span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}