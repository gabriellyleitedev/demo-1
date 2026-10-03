import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import type { Product } from '../data/products'

type ConfiguratorProps = {
  product: Product | null
}

type FormData = {
  width: string
  height: string
  quantity: number
  material: string
  color: string
  city: string
  name: string
  phone: string
  email: string
  notes: string
}

const initialForm: FormData = {
  width: '',
  height: '',
  quantity: 1,
  material: 'Alumínio',
  color: 'Preto',
  city: '',
  name: '',
  phone: '',
  email: '',
  notes: '',
}

export function Configurator({ product }: ConfiguratorProps) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initialForm)
  const [sent, setSent] = useState(false)

  if (!product) {
    return (
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-8">
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-zinc-500">
              Escolha um produto acima para começar sua configuração.
            </p>
          </div>
        </div>
      </section>
    )
  }

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function nextStep() {
    setStep((current) => Math.min(current + 1, 4))
  }

  function previousStep() {
    setStep((current) => Math.max(current - 1, 1))
  }

  function submitRequest() {
    setSent(true)
  }

  if (sent) {
    return (
      <section
        id="orcamento"
        className="border-t border-zinc-200 bg-zinc-50"
      >
        <div className="mx-auto max-w-3xl px-6 py-32 lg:px-8">
          <div className="rounded-[2rem] bg-white px-8 py-16 text-center shadow-sm sm:px-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 text-white">
              <Check size={28} />
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Solicitação enviada
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
              Recebemos seu projeto.
            </h2>

            <p className="mx-auto mt-5 max-w-lg leading-7 text-zinc-500">
              A equipe da Esquadrias Prime analisará as informações e entrará
              em contato para confirmar os detalhes do orçamento.
            </p>

            <div className="mx-auto mt-10 max-w-md rounded-2xl bg-zinc-50 p-6 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Resumo
              </p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Produto</span>
                  <span className="font-medium">{product.name}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Medidas</span>
                  <span className="font-medium">
                    {form.width || '—'} × {form.height || '—'} mm
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-zinc-500">Quantidade</span>
                  <span className="font-medium">{form.quantity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="orcamento"
      className="border-t border-zinc-200 bg-zinc-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-32">
        {/* Cabeçalho */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Solicitação de orçamento
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Vamos configurar seu projeto.
          </h2>

          <p className="mt-5 leading-7 text-zinc-500">
            Algumas informações são suficientes para nossa equipe entender o
            que você procura.
          </p>
        </div>

        {/* Indicador de etapas */}
        <div className="mx-auto mt-12 flex max-w-xl items-center justify-center">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition ${
                  item <= step
                    ? 'bg-black text-white'
                    : 'bg-white text-zinc-400 ring-1 ring-zinc-200'
                }`}
              >
                {item < step ? <Check size={15} /> : item}
              </div>

              {item < 4 && (
                <div
                  className={`h-px w-10 transition sm:w-20 ${
                    item < step ? 'bg-black' : 'bg-zinc-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-[2rem] bg-white p-7 shadow-sm sm:p-10">
          {/* ETAPA 1 */}
          {step === 1 && (
            <div>
              <p className="text-sm font-semibold">01 / Produto</p>

              <h3 className="mt-3 text-2xl font-semibold">
                O que você está procurando?
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Você selecionou este produto no catálogo.
              </p>

              <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Produto selecionado
                </p>

                <h4 className="mt-2 text-2xl font-semibold">
                  {product.name}
                </h4>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {product.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {product.details.map((detail) => (
                    <span
                      key={detail}
                      className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2 */}
          {step === 2 && (
            <div>
              <p className="text-sm font-semibold">02 / Configuração</p>

              <h3 className="mt-3 text-2xl font-semibold">
                Conte um pouco sobre o projeto.
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                As medidas podem ser aproximadas. A equipe confirma os
                detalhes posteriormente.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">
                    Largura (mm)
                  </span>

                  <input
                    value={form.width}
                    onChange={(event) =>
                      updateField('width', event.target.value)
                    }
                    placeholder="Ex.: 1200"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 outline-none transition focus:border-zinc-500 focus:bg-white"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium">
                    Altura (mm)
                  </span>

                  <input
                    value={form.height}
                    onChange={(event) =>
                      updateField('height', event.target.value)
                    }
                    placeholder="Ex.: 1500"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 outline-none transition focus:border-zinc-500 focus:bg-white"
                  />
                </label>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium">Material</span>

                  <select
                    value={form.material}
                    onChange={(event) =>
                      updateField('material', event.target.value)
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 outline-none"
                  >
                    <option>Alumínio</option>
                    <option>Madeira</option>
                    <option>PVC</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium">
                    Acabamento
                  </span>

                  <select
                    value={form.color}
                    onChange={(event) =>
                      updateField('color', event.target.value)
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 outline-none"
                  >
                    <option>Preto</option>
                    <option>Branco</option>
                    <option>Bronze</option>
                    <option>Natural</option>
                  </select>
                </label>
              </div>

              <div className="mt-7">
                <span className="text-sm font-medium">Quantidade</span>

                <div className="mt-3 flex w-fit items-center gap-5 rounded-full border border-zinc-200 px-3 py-2">
                  <button
                    onClick={() =>
                      updateField(
                        'quantity',
                        Math.max(1, form.quantity - 1),
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="min-w-5 text-center text-sm font-semibold">
                    {form.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateField('quantity', form.quantity + 1)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <label className="mt-7 block space-y-2">
                <span className="text-sm font-medium">Cidade</span>

                <input
                  value={form.city}
                  onChange={(event) =>
                    updateField('city', event.target.value)
                  }
                  placeholder="Ex.: São Paulo - SP"
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 outline-none transition focus:border-zinc-500 focus:bg-white"
                />
              </label>

              <label className="mt-7 block space-y-2">
                <span className="text-sm font-medium">
                  Observações
                </span>

                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    updateField('notes', event.target.value)
                  }
                  placeholder="Conte algo importante sobre o seu projeto..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 outline-none transition focus:border-zinc-500 focus:bg-white"
                />
              </label>
            </div>
          )}

          {/* ETAPA 3 */}
          {step === 3 && (
            <div>
              <p className="text-sm font-semibold">03 / Contato</p>

              <h3 className="mt-3 text-2xl font-semibold">
                Como podemos falar com você?
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Usaremos esses dados apenas para dar continuidade à sua
                solicitação.
              </p>

              <div className="mt-8 space-y-5">
                <label className="block space-y-2">
                  <span className="text-sm font-medium">Nome</span>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      updateField('name', event.target.value)
                    }
                    placeholder="Seu nome"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 outline-none transition focus:border-zinc-500 focus:bg-white"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium">WhatsApp</span>

                  <input
                    value={form.phone}
                    onChange={(event) =>
                      updateField('phone', event.target.value)
                    }
                    placeholder="(11) 99999-9999"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 outline-none transition focus:border-zinc-500 focus:bg-white"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium">
                    E-mail <span className="text-zinc-400">(opcional)</span>
                  </span>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField('email', event.target.value)
                    }
                    placeholder="voce@email.com"
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 outline-none transition focus:border-zinc-500 focus:bg-white"
                  />
                </label>
              </div>
            </div>
          )}

          {/* ETAPA 4 */}
          {step === 4 && (
            <div>
              <p className="text-sm font-semibold">04 / Revisão</p>

              <h3 className="mt-3 text-2xl font-semibold">
                Tudo certo?
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Revise as informações antes de enviar sua solicitação.
              </p>

              <div className="mt-8 divide-y divide-zinc-100 rounded-2xl border border-zinc-200">
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Produto
                  </p>

                  <p className="mt-2 font-semibold">{product.name}</p>
                </div>

                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-zinc-400">Medidas</p>

                    <p className="mt-1 text-sm font-medium">
                      {form.width || '—'} × {form.height || '—'} mm
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400">Quantidade</p>

                    <p className="mt-1 text-sm font-medium">
                      {form.quantity}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400">Material</p>

                    <p className="mt-1 text-sm font-medium">
                      {form.material}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400">Acabamento</p>

                    <p className="mt-1 text-sm font-medium">
                      {form.color}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-400">Cidade</p>

                    <p className="mt-1 text-sm font-medium">
                      {form.city || '—'}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs text-zinc-400">Contato</p>

                  <p className="mt-1 text-sm font-medium">
                    {form.name || '—'}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {form.phone || '—'}
                  </p>

                  {form.email && (
                    <p className="mt-1 text-sm text-zinc-500">
                      {form.email}
                    </p>
                  )}
                </div>

                {form.notes && (
                  <div className="p-5">
                    <p className="text-xs text-zinc-400">Observações</p>

                    <p className="mt-1 text-sm leading-6 text-zinc-600">
                      {form.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navegação */}
          <div className="mt-10 flex items-center justify-between border-t border-zinc-100 pt-7">
            {step > 1 ? (
              <button
                onClick={previousStep}
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-black"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={nextStep}
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Continuar
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={submitRequest}
                className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Enviar solicitação
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}