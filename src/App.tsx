import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProductShowcase } from './components/ProductShowCase'
import { Configurator } from './components/Configurator'
import { products, type Product } from './data/products'

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const closeConfigurator = useCallback(() => setSelectedProduct(null), [])

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <Header />

      <main>
        <Hero />

        <ProductShowcase
          products={products}
          onSelect={setSelectedProduct}
        />

        <section
          id="processo"
          className="border-y border-zinc-200 bg-[#f5f5f3]"
        >
          <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
                Como funciona
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Do primeiro clique ao orçamento.
              </h2>

              <p className="mt-5 leading-7 text-zinc-500">
                Um processo simples para que você consiga apresentar o que
                precisa sem transformar o atendimento em uma sequência
                interminável de mensagens.
              </p>
            </div>

            <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-200 md:grid-cols-3">
              {[
                ['01', 'Escolha', 'Encontre o produto que corresponde ao seu projeto.'],
                ['02', 'Configure', 'Informe medidas, material, acabamento e quantidade.'],
                ['03', 'Solicite', 'Revise as informações e envie sua solicitação.'],
              ].map(([number, title, description]) => (
                <div key={number} className="bg-white p-8 sm:p-10">
                  <span className="text-xs font-semibold text-zinc-400">
                    {number}
                  </span>

                  <h3 className="mt-12 text-xl font-semibold">{title}</h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="orcamento" className="bg-zinc-950 text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-10 px-6 py-28 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-36">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                Solicitar orçamento
              </p>

              <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Seu projeto começa pela escolha do modelo.
              </h2>

              <p className="mt-6 max-w-md leading-7 text-zinc-400">
                Escolha um produto no catálogo e configure medidas e
                acabamento em poucos minutos.
              </p>
            </div>

            <a
              href="#produtos"
              className="group inline-flex shrink-0 items-center gap-4 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-medium text-zinc-950 transition-colors duration-300 hover:bg-zinc-200"
            >
              Ver catálogo
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white transition-transform duration-500 group-hover:translate-x-1">
                <ArrowRight size={16} />
              </span>
            </a>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <Configurator
            key={selectedProduct.id}
            product={selectedProduct}
            onClose={closeConfigurator}
          />
        )}
      </AnimatePresence>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl justify-between px-6 py-8 text-xs text-zinc-400 lg:px-8">
          <span>Esquadrias Prime</span>
          <span>Projeto demonstrativo</span>
        </div>
      </footer>
    </div>
  )
}

export default App