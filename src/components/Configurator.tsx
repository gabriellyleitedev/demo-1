// Configurador de projeto: abre em tela cheia sobre o catálogo, mantém o
// produto escolhido sempre visível e conduz o cliente por configuração,
// dados de contato, revisão e confirmação. Tudo em estado local (demo); no
// envio, a solicitação estruturada segue para a empresa pelo WhatsApp.

import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  Minus,
  Plus,
  X,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import type { Product } from '../data/products'

type ConfiguratorProps = {
  product: Product
  onClose: () => void
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

type Reference = {
  name: string
  url: string
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

const steps = ['Configuração', 'Seus dados', 'Revisão']

const materials = ['Alumínio', 'PVC', 'Madeira']

const colors = [
  { name: 'Preto', swatch: '#1c1c1e' },
  { name: 'Branco', swatch: '#f4f4f2' },
  { name: 'Natural', swatch: '#c8c4bb' },
  { name: 'Bronze', swatch: '#6e5644' },
]

const subjectByCategory: Record<string, string> = {
  Janelas: 'sua janela',
  Portas: 'sua porta',
  Banheiro: 'seu box',
}

const MAX_REFERENCES = 3

const ease = [0.22, 1, 0.36, 1] as const

const pad = (value: number) => String(value).padStart(2, '0')

const digits = (value: string) => value.replace(/\D/g, '')

function formatPhone(value: string) {
  const d = digits(value).slice(0, 11)

  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`

  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const formatMeasure = (value: string) =>
  value ? Number(value).toLocaleString('pt-BR') : '—'

// número da empresa que recebe as solicitações (só dígitos, com DDI).
// Sem ele, o WhatsApp abre para escolher o contato.
const COMPANY_WHATSAPP = digits(import.meta.env.VITE_WHATSAPP_NUMBER ?? '')

const whatsappLink = (text: string) =>
  `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(text)}`

export function Configurator({ product, onClose }: ConfiguratorProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [references, setReferences] = useState<Reference[]>([])
  const [attempted, setAttempted] = useState(false)
  const [protocol, setProtocol] = useState<string | null>(null)

  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const referencesRef = useRef<Reference[]>([])
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
    referencesRef.current = references
  })

  // trava o scroll da página por trás e permite fechar com Esc
  useEffect(() => {
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    html.style.overflow = 'hidden'

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onCloseRef.current()
    }

    window.addEventListener('keydown', handleKey)

    return () => {
      html.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
      referencesRef.current.forEach((reference) =>
        URL.revokeObjectURL(reference.url),
      )
    }
  }, [])

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function scrollToTop() {
    overlayRef.current?.scrollTo({ top: 0 })
    panelRef.current?.scrollTo({ top: 0 })
  }

  function goTo(next: number) {
    setStep(next)
    setAttempted(false)
    scrollToTop()
  }

  const missing: Partial<Record<keyof FormData, boolean>> =
    step === 0
      ? { width: !Number(form.width), height: !Number(form.height) }
      : step === 1
        ? {
            name: !form.name.trim(),
            phone: digits(form.phone).length < 10,
          }
        : {}

  const hasMissing = Object.values(missing).some(Boolean)
  const isInvalid = (field: keyof FormData) =>
    attempted && Boolean(missing[field])

  function handleContinue() {
    if (hasMissing) {
      setAttempted(true)
      return
    }

    goTo(step + 1)
  }

  // a solicitação chega para a empresa já organizada, pronta para o vendedor
  function buildRequestMessage(code: string) {
    const lines = [
      `*Nova solicitação de orçamento — ${code}*`,
      '',
      `*Produto:* ${product.name} (${product.category})`,
      `*Medidas:* ${measures}`,
      `*Quantidade:* ${units}`,
      `*Material:* ${form.material}`,
      `*Cor:* ${form.color}`,
      `*Cidade:* ${form.city || '—'}`,
    ]

    if (references.length > 0)
      lines.push(`*Referências:* ${references.length} foto(s) anexadas no site`)
    if (form.notes) lines.push(`*Observações:* ${form.notes}`)

    lines.push(
      '',
      '*Contato*',
      `Nome: ${form.name}`,
      `WhatsApp: ${form.phone}`,
    )
    if (form.email) lines.push(`E-mail: ${form.email}`)

    return lines.join('\n')
  }

  function handleSubmit() {
    const suffix = Date.now().toString(36).slice(-5).toUpperCase()
    const code = `EP-${suffix}`

    // abre dentro do clique para não ser barrado pelo bloqueador de pop-up
    window.open(whatsappLink(buildRequestMessage(code)), '_blank', 'noopener')

    setProtocol(code)
    scrollToTop()
  }

  function handleReferences(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    const room = MAX_REFERENCES - references.length

    const added = files.slice(0, room).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }))

    setReferences((current) => [...current, ...added])
    event.target.value = ''
  }

  function removeReference(url: string) {
    URL.revokeObjectURL(url)
    setReferences((current) =>
      current.filter((reference) => reference.url !== url),
    )
  }

  const subject = subjectByCategory[product.category] ?? 'seu projeto'
  const measures = `${formatMeasure(form.width)} × ${formatMeasure(form.height)} mm`
  const units = `${pad(form.quantity)} ${form.quantity === 1 ? 'unidade' : 'unidades'}`

  const summary = [
    { label: 'Medidas', value: measures },
    { label: 'Quantidade', value: units },
    { label: 'Acabamento', value: `${form.material} · ${form.color}` },
    { label: 'Cidade', value: form.city || '—' },
  ]

  // na revisão, cada especificação ganha sua própria linha
  const reviewRows = [
    { label: 'Dimensões', value: measures },
    { label: 'Quantidade', value: units },
    { label: 'Material', value: form.material },
    { label: 'Cor', value: form.color },
    { label: 'Cidade', value: form.city || '—' },
  ]

  /* ---------------------------------------------------------------- */
  /* Etapa 01 — configuração                                          */
  /* ---------------------------------------------------------------- */

  const configStep = (
    <>
      <StepIntro
        eyebrow="Etapa 01"
        title={`Vamos configurar ${subject}.`}
        text="As medidas podem ser aproximadas. Nossa equipe confirma tudo antes do orçamento final."
      />

      <Block number="01" title="Dimensões" text="Largura e altura do vão.">
        <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <MeasureInput
                label="Largura"
                value={form.width}
                placeholder="1800"
                invalid={isInvalid('width')}
                onChange={(value) => updateField('width', value)}
              />

              <MeasureInput
                label="Altura"
                value={form.height}
                placeholder="1200"
                invalid={isInvalid('height')}
                onChange={(value) => updateField('height', value)}
              />
            </div>

            <div>
              <FieldLabel>Quantidade</FieldLabel>

              <div className="mt-3 flex w-fit items-center gap-2 rounded-full bg-white p-1.5 ring-1 ring-black/5">
                <StepperButton
                  label="Diminuir quantidade"
                  disabled={form.quantity <= 1}
                  onClick={() =>
                    updateField('quantity', Math.max(1, form.quantity - 1))
                  }
                >
                  <Minus size={15} />
                </StepperButton>

                <span className="w-12 text-center text-lg font-medium tabular-nums">
                  {pad(form.quantity)}
                </span>

                <StepperButton
                  label="Aumentar quantidade"
                  disabled={form.quantity >= 99}
                  onClick={() =>
                    updateField('quantity', Math.min(99, form.quantity + 1))
                  }
                >
                  <Plus size={15} />
                </StepperButton>
              </div>
            </div>
          </div>

          <DimensionPreview
            width={Number(form.width)}
            height={Number(form.height)}
            split={product.accent === 'window' || product.accent === 'sliding-door'}
          />
        </div>
      </Block>

      <Block number="02" title="Acabamento" text="Material e cor dos perfis.">
        <FieldLabel>Material</FieldLabel>

        <div className="mt-3 flex w-fit rounded-full bg-white p-1 ring-1 ring-black/5">
          {materials.map((material) => (
            <button
              key={material}
              type="button"
              onClick={() => updateField('material', material)}
              className={`relative rounded-full px-5 py-2.5 text-sm transition-colors duration-300 ${
                form.material === material
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-950'
              }`}
            >
              {form.material === material && (
                <motion.span
                  layoutId="material-pill"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-zinc-950"
                />
              )}
              <span className="relative">{material}</span>
            </button>
          ))}
        </div>

        <FieldLabel className="mt-8">Cor</FieldLabel>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colors.map((color) => {
            const active = form.color === color.name

            return (
              <button
                key={color.name}
                type="button"
                onClick={() => updateField('color', color.name)}
                aria-pressed={active}
                className={`group flex items-center gap-3 rounded-2xl bg-white p-3 text-left text-sm ring-1 transition-all duration-300 ${
                  active
                    ? 'ring-2 ring-zinc-950'
                    : 'ring-black/5 hover:ring-black/20'
                }`}
              >
                <span
                  className="h-8 w-8 shrink-0 rounded-full ring-1 ring-inset ring-black/10 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: color.swatch }}
                />
                <span className="font-medium">{color.name}</span>
                {active && <Check size={15} className="ml-auto" />}
              </button>
            )
          })}
        </div>
      </Block>

      <Block number="03" title="Local do projeto" text="Cidade onde será feita a instalação.">
        <LineInput
          value={form.city}
          placeholder="São Paulo - SP"
          onChange={(value) => updateField('city', value)}
        />
      </Block>

      <Block
        number="04"
        title="Alguma referência?"
        text="Fotos do local ou de inspirações ajudam nossa equipe. Opcional."
      >
        <div className="grid grid-cols-3 gap-3">
          {references.map((reference) => (
            <motion.div
              key={reference.url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-zinc-200"
            >
              <img
                src={reference.url}
                alt={reference.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeReference(reference.url)}
                aria-label={`Remover ${reference.name}`}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-zinc-950 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 max-lg:opacity-100"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}

          {references.length < MAX_REFERENCES && (
            <label
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-4 text-center text-zinc-500 transition-colors hover:border-zinc-950 hover:text-zinc-950 ${
                references.length === 0
                  ? 'col-span-3 py-10'
                  : 'aspect-square'
              }`}
            >
              <ImagePlus size={22} strokeWidth={1.5} />
              <span className="text-sm font-medium">Adicionar imagem</span>
              {references.length === 0 && (
                <span className="text-xs text-zinc-400">
                  JPG ou PNG · até {MAX_REFERENCES} imagens
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleReferences}
                className="sr-only"
              />
            </label>
          )}
        </div>

        <FieldLabel className="mt-8">Observações</FieldLabel>

        <textarea
          value={form.notes}
          onChange={(event) => updateField('notes', event.target.value)}
          placeholder="Ex.: vão voltado para a varanda, preciso de vidro fumê…"
          rows={3}
          className="mt-3 w-full resize-none rounded-2xl bg-white px-5 py-4 text-sm leading-6 outline-none ring-1 ring-black/5 transition placeholder:text-zinc-400 focus:ring-zinc-950"
        />
      </Block>
    </>
  )

  /* ---------------------------------------------------------------- */
  /* Etapa 02 — dados de contato                                      */
  /* ---------------------------------------------------------------- */

  const contactStep = (
    <>
      <StepIntro
        eyebrow="Etapa 02"
        title="Para onde enviamos o retorno?"
        text="Usamos esses dados apenas para dar continuidade ao seu orçamento."
      />

      <div className="mt-14 space-y-10">
        <div>
          <FieldLabel>Nome</FieldLabel>
          <LineInput
            value={form.name}
            placeholder="Seu nome"
            autoComplete="name"
            invalid={isInvalid('name')}
            onChange={(value) => updateField('name', value)}
          />
        </div>

        <div>
          <FieldLabel>WhatsApp</FieldLabel>
          <LineInput
            value={form.phone}
            placeholder="(11) 99999-9999"
            inputMode="tel"
            autoComplete="tel"
            invalid={isInvalid('phone')}
            onChange={(value) => updateField('phone', formatPhone(value))}
          />
        </div>

        <div>
          <FieldLabel>
            E-mail <span className="normal-case tracking-normal text-zinc-400">(opcional)</span>
          </FieldLabel>
          <LineInput
            value={form.email}
            placeholder="voce@email.com"
            type="email"
            autoComplete="email"
            onChange={(value) => updateField('email', value)}
          />
        </div>
      </div>
    </>
  )

  /* ---------------------------------------------------------------- */
  /* Etapa 03 — revisão                                               */
  /* ---------------------------------------------------------------- */

  const reviewStep = (
    <>
      <StepIntro
        eyebrow="Etapa 03"
        title="Confira seu projeto."
        text="É exatamente isso que nossa equipe vai receber."
      />

      <div className="mt-12 overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_100px_-50px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
        <div className="relative aspect-[16/9] overflow-hidden bg-zinc-200">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-5 left-5 rounded-full bg-white/85 px-4 py-2 text-xs font-medium backdrop-blur-md">
            {product.category}
          </span>
        </div>

        <div className="p-7 sm:p-10">
          <div className="flex items-start justify-between gap-6">
            <h3 className="text-3xl font-semibold tracking-[-0.04em]">
              {product.name}
            </h3>
            <EditButton onClick={() => goTo(0)} />
          </div>

          <dl className="mt-8 divide-y divide-zinc-100 border-y border-zinc-100">
            {reviewRows.map((item) => (
              <ReviewRow key={item.label} label={item.label} value={item.value} />
            ))}

            {references.length > 0 && (
              <ReviewRow
                label="Referências"
                value={
                  <span className="flex justify-end gap-2">
                    {references.map((reference) => (
                      <img
                        key={reference.url}
                        src={reference.url}
                        alt={reference.name}
                        className="h-9 w-9 rounded-lg object-cover"
                      />
                    ))}
                  </span>
                }
              />
            )}

            {form.notes && (
              <ReviewRow label="Observações" value={form.notes} />
            )}
          </dl>

          <div className="mt-8 flex items-start justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Contato
              </p>
              <p className="mt-3 font-medium">{form.name}</p>
              <p className="mt-1 text-sm text-zinc-500">{form.phone}</p>
              {form.email && (
                <p className="mt-1 text-sm text-zinc-500">{form.email}</p>
              )}
            </div>
            <EditButton onClick={() => goTo(1)} />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="group mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-zinc-950 py-4 text-sm font-medium text-white transition-colors duration-300 hover:bg-zinc-800"
          >
            Solicitar orçamento
            <ArrowRight
              size={16}
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </button>

          <p className="mt-4 text-center text-xs text-zinc-400">
            Sem compromisso. O retorno chega pelo WhatsApp informado.
          </p>
        </div>
      </div>
    </>
  )

  /* ---------------------------------------------------------------- */
  /* Confirmação                                                      */
  /* ---------------------------------------------------------------- */

  const confirmation = (
    <div className="pt-4 lg:pt-10">
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-white"
      >
        <Check size={24} />
      </motion.div>

      <p className="mt-10 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
        Protocolo {protocol}
      </p>

      <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
        Seu projeto foi recebido.
      </h2>

      <p className="mt-6 max-w-md text-base leading-7 text-zinc-500">
        Recebemos as informações da sua solicitação. Nossa equipe entrará em
        contato para continuar o orçamento.
      </p>

      {/* representação compacta do projeto enviado */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease }}
        className="mt-12 flex items-center gap-5 rounded-[1.5rem] bg-white p-4 ring-1 ring-black/5"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-24 w-24 shrink-0 rounded-2xl object-cover sm:h-28 sm:w-32"
        />
        <div className="min-w-0">
          <p className="font-semibold tracking-[-0.02em]">{product.name}</p>
          <p className="mt-1 text-sm text-zinc-500">
            {measures} · {units}
          </p>
          <p className="mt-0.5 text-sm text-zinc-500">
            {form.material} · {form.color}
            {form.city && ` · ${form.city}`}
          </p>
        </div>
      </motion.div>

      <motion.ol
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-12 border-t border-zinc-200"
      >
        {[
          ['Agora', 'Sua solicitação está com nossa equipe.'],
          ['Em breve', `Falamos com você pelo WhatsApp ${form.phone}.`],
          ['Depois', 'Confirmamos as medidas e enviamos o orçamento final.'],
        ].map(([when, what], index) => (
          <li
            key={when}
            className="flex gap-6 border-b border-zinc-200 py-4 text-sm"
          >
            <span
              className={`w-20 shrink-0 ${index === 0 ? 'font-medium text-zinc-950' : 'text-zinc-400'}`}
            >
              {when}
            </span>
            <span className="text-zinc-600">{what}</span>
          </li>
        ))}
      </motion.ol>

      {protocol && (
        <p className="mt-8 text-sm text-zinc-500">
          O WhatsApp não abriu?{' '}
          <a
            href={whatsappLink(buildRequestMessage(protocol))}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-950 underline underline-offset-4"
          >
            Enviar a solicitação novamente
          </a>
        </p>
      )}

      <button
        type="button"
        onClick={onClose}
        className="group mt-12 inline-flex items-center gap-3 text-sm font-medium"
      >
        <ArrowLeft
          size={16}
          className="transition-transform duration-500 group-hover:-translate-x-1"
        />
        Voltar ao catálogo
      </button>
    </div>
  )

  const content = protocol
    ? confirmation
    : [configStep, contactStep, reviewStep][step]

  const progress = protocol ? 1 : (step + 1) / steps.length

  return (
    <motion.div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Configurar ${product.name}`}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: 0.9, ease }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#f5f5f3] text-zinc-950 lg:overflow-hidden"
    >
      <div className="flex min-h-full flex-col lg:h-full">
        {/* Barra superior */}
        <header className="sticky top-0 z-20 shrink-0 border-b border-black/5 bg-[#f5f5f3]/90 backdrop-blur-xl lg:static">
          <div className="flex h-16 items-center justify-between px-6 lg:px-8">
            <span className="text-base font-semibold tracking-[-0.03em]">
              Esquadrias<span className="text-zinc-400">Prime</span>
            </span>

            <ol className="hidden items-center gap-8 md:flex">
              {steps.map((label, index) => {
                const done = protocol !== null || index < step
                const active = protocol === null && index === step

                return (
                  <li
                    key={label}
                    className={`flex items-center gap-2.5 text-xs font-medium transition-colors duration-500 ${
                      active || done ? 'text-zinc-950' : 'text-zinc-400'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] transition-all duration-500 ${
                        active
                          ? 'bg-zinc-950 text-white'
                          : done
                            ? 'bg-zinc-950/10'
                            : 'ring-1 ring-zinc-300'
                      }`}
                    >
                      {done ? <Check size={12} /> : pad(index + 1)}
                    </span>
                    {label}
                  </li>
                )
              })}
            </ol>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar e voltar ao catálogo"
              className="group flex items-center gap-3 text-sm text-zinc-500 transition-colors hover:text-zinc-950"
            >
              <span className="hidden sm:inline">Fechar</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-black/5 transition-transform duration-500 group-hover:rotate-90">
                <X size={16} />
              </span>
            </button>
          </div>

          <div className="h-px bg-black/5">
            <motion.div
              className="h-full origin-left bg-zinc-950"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress }}
              transition={{ duration: 0.8, ease }}
            />
          </div>
        </header>

        <div className="grid flex-1 lg:min-h-0 lg:grid-cols-12 lg:grid-rows-1">
          {/* Produto sempre presente */}
          <aside
            className={`p-4 lg:col-span-5 lg:h-full lg:p-6 lg:pr-0 ${
              protocol || step === 2 ? 'max-lg:hidden' : ''
            }`}
          >
            <div className="relative isolate flex flex-col overflow-hidden rounded-[2rem] bg-zinc-900 text-white lg:h-full">
              {/* a própria foto, desfocada, preenche o painel sem cortar o produto */}
              <img
                src={product.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-10 h-full w-full scale-125 object-cover opacity-70 blur-3xl"
              />

              <div className="flex h-56 min-h-0 flex-none items-center justify-center p-3 sm:h-72 lg:h-auto lg:flex-1 lg:p-5">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  initial={{ scale: 1.08, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease }}
                  className="max-h-full max-w-full rounded-[1.5rem] object-contain shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease }}
                className="mx-3 mb-3 shrink-0 rounded-[1.25rem] bg-black/25 px-5 py-4 ring-1 ring-white/15 backdrop-blur-xl lg:mx-5 lg:mb-5"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-xl font-semibold tracking-[-0.03em]">
                    {product.name}
                  </h2>
                  <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                    Seu projeto
                  </p>
                </div>

                <dl className="mt-3 hidden grid-cols-4 gap-4 border-t border-white/15 pt-3 lg:grid">
                  {summary.map((item) => (
                    <div key={item.label} className="min-w-0">
                      <dt className="text-[10px] uppercase tracking-[0.15em] text-white/50">
                        {item.label}
                      </dt>
                      <motion.dd
                        key={item.value}
                        initial={{ opacity: 0.3, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-0.5 truncate text-xs font-medium"
                        title={item.value}
                      >
                        {item.value}
                      </motion.dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </div>
          </aside>

          {/* Etapas */}
          <section
            ref={panelRef}
            className="flex flex-col lg:col-span-7 lg:h-full lg:overflow-y-auto"
          >
            <div className="mx-auto w-full max-w-2xl flex-1 px-6 pb-16 pt-10 lg:px-12 lg:pt-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={protocol ? 'done' : step}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease }}
                >
                  {content}
                </motion.div>
              </AnimatePresence>
            </div>

            {!protocol && (
              <footer className="sticky bottom-0 z-10 border-t border-black/5 bg-[#f5f5f3]/90 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-6 py-4 lg:px-12">
                  <button
                    type="button"
                    onClick={() => (step === 0 ? onClose() : goTo(step - 1))}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950"
                  >
                    <ArrowLeft
                      size={16}
                      className="transition-transform duration-500 group-hover:-translate-x-1"
                    />
                    {step === 0 ? 'Catálogo' : 'Voltar'}
                  </button>

                  <AnimatePresence>
                    {attempted && hasMissing && (
                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="hidden text-xs text-red-600 sm:block"
                      >
                        Preencha os campos destacados.
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {step < 2 && (
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="group inline-flex items-center gap-3 rounded-full bg-zinc-950 py-2 pl-6 pr-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-zinc-800"
                    >
                      Continuar
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-950 transition-transform duration-500 group-hover:translate-x-1">
                        <ArrowRight size={15} />
                      </span>
                    </button>
                  )}
                </div>
              </footer>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Peças de interface                                                 */
/* ------------------------------------------------------------------ */

function StepIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
        {eyebrow}
      </p>
      <h3 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
        {title}
      </h3>
      <p className="mt-5 max-w-md text-base leading-7 text-zinc-500">
        {text}
      </p>
    </div>
  )
}

function Block({
  number,
  title,
  text,
  children,
}: {
  number: string
  title: string
  text: string
  children: ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease }}
      className="mt-16 border-t border-zinc-200 pt-8"
    >
      <div className="mb-8 flex items-baseline gap-4">
        <span className="text-xs tabular-nums text-zinc-400">{number}</span>
        <div>
          <h4 className="text-lg font-semibold tracking-[-0.02em]">{title}</h4>
          <p className="mt-1 text-sm text-zinc-500">{text}</p>
        </div>
      </div>
      {children}
    </motion.section>
  )
}

function FieldLabel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 ${className}`}
    >
      {children}
    </p>
  )
}

function MeasureInput({
  label,
  value,
  placeholder,
  invalid,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  invalid: boolean
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative mt-2">
        <input
          value={value}
          onChange={(event) => onChange(digits(event.target.value).slice(0, 5))}
          placeholder={placeholder}
          inputMode="numeric"
          aria-invalid={invalid}
          className={`w-full border-b bg-transparent pb-2 pr-10 text-4xl font-light tracking-[-0.03em] tabular-nums outline-none transition-colors duration-300 placeholder:text-zinc-300 ${
            invalid
              ? 'border-red-500 placeholder:text-red-300'
              : 'border-zinc-300 focus:border-zinc-950'
          }`}
        />
        <span className="absolute bottom-3 right-0 text-sm text-zinc-400">
          mm
        </span>
      </div>
    </label>
  )
}

function LineInput({
  value,
  placeholder,
  invalid = false,
  type = 'text',
  inputMode,
  autoComplete,
  onChange,
}: {
  value: string
  placeholder: string
  invalid?: boolean
  type?: string
  inputMode?: 'text' | 'tel' | 'email' | 'numeric'
  autoComplete?: string
  onChange: (value: string) => void
}) {
  return (
    <input
      value={value}
      type={type}
      inputMode={inputMode}
      autoComplete={autoComplete}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-invalid={invalid}
      className={`mt-2 w-full border-b bg-transparent pb-3 text-2xl font-light tracking-[-0.02em] outline-none transition-colors duration-300 placeholder:text-zinc-300 ${
        invalid
          ? 'border-red-500 placeholder:text-red-300'
          : 'border-zinc-300 focus:border-zinc-950'
      }`}
    />
  )
}

function StepperButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition-all duration-300 hover:bg-zinc-950 hover:text-white active:scale-90 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 text-xs font-medium text-zinc-400 underline-offset-4 transition-colors hover:text-zinc-950 hover:underline"
    >
      Editar
    </button>
  )
}

function ReviewRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 text-sm">
      <dt className="shrink-0 text-zinc-400">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}

// Planta esquemática: desenha o vão na proporção das medidas digitadas.
function DimensionPreview({
  width,
  height,
  split,
}: {
  width: number
  height: number
  split: boolean
}) {
  const empty = !width || !height
  const ratio = Math.min(3, Math.max(0.33, empty ? 1.4 : width / height))

  const box = 150
  const w = ratio >= 1 ? box : box * ratio
  const h = ratio >= 1 ? box / ratio : box
  const x = 20 + (box - w) / 2
  const y = 20 + (box - h) / 2

  const spring = { type: 'spring', stiffness: 160, damping: 22 } as const

  return (
    <div className="mx-auto w-full max-w-[240px] rounded-[1.5rem] bg-white p-4 ring-1 ring-black/5">
      <svg
        viewBox="0 0 232 210"
        className={`w-full transition-opacity duration-500 ${empty ? 'opacity-40' : ''}`}
        aria-hidden="true"
      >
        <motion.rect
          initial={false}
          animate={{ attrX: x, attrY: y, width: w, height: h }}
          transition={spring}
          fill="#eef3f4"
          stroke="#18181b"
          strokeWidth={5}
        />

        {split && (
          <motion.line
            animate={{ x1: x + w / 2, x2: x + w / 2, y1: y, y2: y + h }}
            transition={spring}
            stroke="#18181b"
            strokeWidth={3}
          />
        )}

        {/* cota horizontal */}
        <motion.line
          animate={{ x1: x, x2: x + w, y1: y + h + 14, y2: y + h + 14 }}
          transition={spring}
          stroke="#a1a1aa"
          strokeWidth={1}
        />
        <motion.text
          initial={false}
          animate={{ attrX: x + w / 2, attrY: y + h + 30 }}
          transition={spring}
          textAnchor="middle"
          className="fill-zinc-500 text-[11px]"
        >
          {empty ? 'L' : width.toLocaleString('pt-BR')}
        </motion.text>

        {/* cota vertical */}
        <motion.line
          animate={{ x1: x + w + 14, x2: x + w + 14, y1: y, y2: y + h }}
          transition={spring}
          stroke="#a1a1aa"
          strokeWidth={1}
        />
        <motion.text
          initial={false}
          animate={{ attrX: x + w + 20, attrY: y + h / 2 + 4 }}
          transition={spring}
          className="fill-zinc-500 text-[11px]"
        >
          {empty ? 'A' : height.toLocaleString('pt-BR')}
        </motion.text>
      </svg>
    </div>
  )
}
