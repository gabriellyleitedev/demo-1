import { ArrowDownRight, ArrowRight } from 'lucide-react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion'
import { useRef } from 'react'
import type { Product } from '../data/products'
import { ProductVisual } from './ProductVisual'

type ProductShowcaseProps = {
  products: Product[]
  onSelect: (product: Product) => void
}

const ease = [0.22, 1, 0.36, 1] as const

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

const pad = (value: number) => String(value).padStart(2, '0')

export function ProductShowcase({
  products,
  onSelect,
}: ProductShowcaseProps) {
  return (
    <section id="produtos" className="bg-white">
      {/* Abertura do catálogo: índice navegável dos modelos */}
      <div className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-36">
          <motion.div
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-5"
          >
            <motion.p
              variants={item}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500"
            >
              Catálogo
            </motion.p>

            <motion.h2
              variants={item}
              className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl"
            >
              Escolha o ponto de partida.
            </motion.h2>

            <motion.p
              variants={item}
              className="mt-6 max-w-md text-base leading-7 text-zinc-400"
            >
              Cada projeto começa com uma escolha. Percorra os modelos e
              configure aquele que mais combina com o seu espaço.
            </motion.p>
          </motion.div>

          <motion.ol
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="border-t border-white/10 lg:col-span-6 lg:col-start-7 lg:self-end"
          >
            {products.map((product, index) => (
              <motion.li
                key={product.id}
                variants={item}
                className="border-b border-white/10"
              >
                <a
                  href={`#produto-${product.id}`}
                  className="group flex items-center gap-6 py-5 transition-colors"
                >
                  <span className="w-6 text-xs tabular-nums text-zinc-600 transition-colors group-hover:text-zinc-400">
                    {pad(index + 1)}
                  </span>

                  <span className="flex-1 text-lg font-medium tracking-[-0.02em] text-zinc-300 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-white sm:text-xl">
                    {product.name}
                  </span>

                  <span className="hidden text-xs uppercase tracking-[0.2em] text-zinc-600 sm:block">
                    {product.category}
                  </span>

                  <ArrowDownRight
                    size={18}
                    className="text-zinc-600 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:text-white"
                  />
                </a>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>

      {/* Capítulos: um por produto, alternando o lado da imagem */}
      <div className="mx-auto max-w-7xl space-y-32 px-6 py-28 lg:space-y-48 lg:px-8 lg:py-40">
        {products.map((product, index) => (
          <ProductChapter
            key={product.id}
            product={product}
            index={index}
            total={products.length}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}

type ProductChapterProps = {
  product: Product
  index: number
  total: number
  onSelect: (product: Product) => void
}

function ProductChapter({
  product,
  index,
  total,
  onSelect,
}: ProductChapterProps) {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // imagem e texto se deslocam em velocidades diferentes, criando profundidade
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [70, -70],
  )
  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [30, -30],
  )

  const reversed = index % 2 !== 0
  const number = pad(index + 1)

  return (
    <article
      ref={ref}
      id={`produto-${product.id}`}
      className="relative scroll-mt-28"
    >
      {/* Linha de capítulo */}
      <motion.div
        variants={group}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="flex items-end gap-6 pb-6">
          <motion.span
            variants={item}
            className="text-6xl font-light leading-none tracking-[-0.05em] text-zinc-300 tabular-nums sm:text-7xl"
          >
            {number}
          </motion.span>

          <motion.div
            variants={item}
            className="flex flex-1 items-center justify-between pb-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400"
          >
            <span>{product.category}</span>
            <span className="tabular-nums">
              {number} / {pad(total)}
            </span>
          </motion.div>
        </div>

        <motion.div
          variants={{
            hidden: { scaleX: 0 },
            show: { scaleX: 1, transition: { duration: 1.4, ease } },
          }}
          className="h-px origin-left bg-zinc-200"
        />
      </motion.div>

      <div className="mt-10 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-16">
        <motion.div
          style={{ y: imageY }}
          className={`lg:col-span-7 ${reversed ? 'lg:order-2' : ''}`}
        >
          {/* revela a imagem abrindo a "moldura" de dentro para fora */}
          <motion.div
            initial={{ clipPath: 'inset(10% 6% 10% 6% round 2rem)' }}
            whileInView={{ clipPath: 'inset(-10% -10% -10% -10% round 0rem)' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.4, ease }}
          >
            <ProductVisual product={product} large />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: textY }}
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className={`lg:col-span-5 ${reversed ? 'lg:order-1' : ''}`}
        >
          <motion.h3
            variants={item}
            className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl"
          >
            {product.name}
          </motion.h3>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-base leading-7 text-zinc-500"
          >
            {product.description}
          </motion.p>

          <motion.ul
            variants={item}
            className="mt-10 border-t border-zinc-200"
          >
            {product.details.map((detail, detailIndex) => (
              <li
                key={detail}
                className="flex items-center justify-between border-b border-zinc-200 py-4 text-sm"
              >
                <span className="text-zinc-800">{detail}</span>
                <span className="text-xs tabular-nums text-zinc-400">
                  {pad(detailIndex + 1)}
                </span>
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item}>
            <button
              onClick={() => onSelect(product)}
              className="group mt-10 inline-flex items-center gap-4 rounded-full bg-zinc-950 py-2 pl-6 pr-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-zinc-800"
            >
              Configurar projeto
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-950 transition-transform duration-500 group-hover:translate-x-1">
                <ArrowRight size={16} />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </article>
  )
}
