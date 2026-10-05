# Orçamento digital para esquadrias — demo

## O que é

Uma experiência digital para empresas de esquadrias que transforma o pedido de
orçamento do cliente em um processo visual, organizado e estruturado.

Não é um "site bonito". É uma **ferramenta de entrada de orçamento**: o
cliente monta o pedido sozinho e a empresa recebe tudo pronto para vender.

## A dor

Hoje, para pedir um orçamento, o cliente geralmente precisa:

> mandar mensagem → explicar o que quer → responder perguntas → mandar
> medidas → mandar foto → esperar → responder mais perguntas

Isso é ruim para os dois lados:

- **Cliente:** fricção, idas e vindas, demora.
- **Empresa:** pedido desorganizado, tempo do vendedor perdido e oportunidades
  que esfriam no caminho.

A solução organiza o pedido **antes** de ele chegar no vendedor.

## O que vendemos

Não vendemos código. Vendemos uma **experiência de orçamento digital
personalizada para a empresa**:

> cliente entra no site → escolhe o produto → configura → informa medidas →
> deixa contato → envia a solicitação → empresa recebe tudo organizado

## Por que pagariam

Porque reduz a fricção para o cliente pedir orçamento e entrega uma
solicitação muito mais estruturada para a empresa comercializar.

Se isso economiza tempo do vendedor e/ou aumenta a conversão de contatos em
orçamentos, tem valor financeiro. **Essa é a hipótese que o demo testa.**

## O demo

```
Catálogo
  ↓
Produto
  ↓
Configuração   (medidas, quantidade, material, cor, cidade, fotos de referência)
  ↓
Dados          (nome, WhatsApp, e-mail)
  ↓
Revisão
  ↓
Solicitar orçamento
  ↓
Empresa recebe uma solicitação estruturada no WhatsApp
```

Ao enviar, o cliente vê a confirmação com o número do protocolo, e o WhatsApp
abre com a mensagem pronta para a empresa, por exemplo:

```
*Nova solicitação de orçamento — EP-4K2QZ*

*Produto:* Janela de correr (Janelas)
*Medidas:* 1.200 × 1.000 mm
*Quantidade:* 02 unidades
*Material:* Alumínio
*Cor:* Preto
*Cidade:* Campinas

*Contato*
Nome: Maria Souza
WhatsApp: (19) 99999-0000
```

As fotos de referência aparecem no site, mas o link do WhatsApp não consegue
anexá-las: a mensagem informa só quantas foram enviadas.

## Rodando localmente

```bash
npm install
npm run dev
```

### Número da empresa

Defina o WhatsApp que recebe as solicitações num arquivo `.env.local`, só com
dígitos e o DDI:

```bash
VITE_WHATSAPP_NUMBER=5519999990000
```

Sem essa variável, o WhatsApp abre e pede para escolher o contato. Isso
funciona para apresentar, mas não para uso real.

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion e Lucide.
