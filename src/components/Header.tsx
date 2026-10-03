import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <a
          href="#top"
          className="text-lg font-semibold tracking-[-0.03em]"
        >
          Esquadrias<span className="text-zinc-400">Prime</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#produtos"
            className="text-sm text-zinc-600 transition hover:text-black"
          >
            Produtos
          </a>

          <a
            href="#processo"
            className="text-sm text-zinc-600 transition hover:text-black"
          >
            Como funciona
          </a>

          <a
            href="#orcamento"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Solicitar orçamento
          </a>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-full p-2 md:hidden"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-black/10 bg-white px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            <a href="#produtos" onClick={() => setOpen(false)}>
              Produtos
            </a>

            <a href="#processo" onClick={() => setOpen(false)}>
              Como funciona
            </a>

            <a
              href="#orcamento"
              onClick={() => setOpen(false)}
              className="rounded-full bg-black px-5 py-3 text-center font-medium text-white"
            >
              Solicitar orçamento
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}