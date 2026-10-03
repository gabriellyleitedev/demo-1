import { ArrowDown, ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-screen overflow-hidden bg-[#f5f5f3]"
    >
      <motion.div
        style={{ opacity }}
        className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-32 lg:px-8"
      >
        <div className="grid w-full gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div style={{ y: textY }} className="max-w-xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
              Esquadrias sob medida
            </p>

            <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950 sm:text-6xl lg:text-7xl">
              O detalhe que transforma um espaço.
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-zinc-600 sm:text-lg">
              Escolha seu projeto, informe as medidas e solicite um orçamento
              de forma simples, visual e organizada.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#produtos"
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Explorar produtos
                <ArrowRight size={17} />
              </a>

              <a
                href="#processo"
                className="rounded-full border border-black/15 bg-white/60 px-6 py-3.5 text-sm font-medium backdrop-blur-sm transition hover:bg-white"
              >
                Como funciona
              </a>
            </div>
          </motion.div>

          <motion.div
            style={{
              y: imageY,
              scale: imageScale,
            }}
            className="relative"
          >
            <div className="hero-architecture">
              <div className="hero-window">
                <div className="hero-glass" />
                <div className="hero-frame hero-frame-1" />
                <div className="hero-frame hero-frame-2" />
                <div className="hero-frame hero-frame-3" />
              </div>

              <div className="hero-shadow" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-400"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.25em]">
          Scroll
        </span>

        <ArrowDown size={16} className="animate-bounce" />
      </motion.div>
    </section>
  )
}