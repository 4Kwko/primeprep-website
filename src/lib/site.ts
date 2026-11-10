/**
 * Configuração central do site.
 *
 * REGRA: campos ainda não confirmados pelo cliente ficam como `null` e são
 * tratados como ausentes na UI. Nada aqui pode ser inventado.
 * Pendências rastreadas em docs/planning/open-questions.md
 */

export const site = {
  name: "Prime Prep",
  legalName: null as string | null, // pendente: razão social / CNPJ
  tagline: "Curso Preparatório Militar",
  locale: "pt-BR",
  city: "São Gabriel",
  state: "RS",
  country: "BR",

  /** Definido em NEXT_PUBLIC_SITE_URL; o fallback só vale em dev. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  social: {
    instagram: "https://www.instagram.com/primeprep.sg/",
    instagramHandle: "@primeprep.sg",
  },

  /**
   * CANAIS DE CONVERSÃO — decisão do cliente (init, Fase 2).
   * Somente os dois canais que já existem. **Não haverá formulário de contato**,
   * portanto não há backend, armazenamento de dados pessoais nem LGPD de
   * formulário. Todo CTA do site aponta para um destes dois.
   */
  conversion: {
    primary: "whatsapp",
    secondary: "instagram-dm",
  },

  /** Contato: apenas o que foi fornecido explicitamente pelo cliente. */
  contact: {
    /** Número do cartão de contato institucional (coordenação administrativa). */
    whatsapp: "+5555999451204",
    whatsappDisplay: "+55 55 99945-1204",
    email: "jvmontagner@gmail.com",
    /** DM do Instagram — o chatbot já em operação atende por aqui. */
    instagramDm: "https://ig.me/m/primeprep.sg",
    /** Pendentes — não inventar. */
    address: null as string | null,
    postalCode: null as string | null,
    phone: null as string | null,
    openingHours: null as string | null,
    geo: null as { lat: number; lng: number } | null,
  },
} as const;
