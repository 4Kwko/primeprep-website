import type { NextConfig } from "next";

/**
 * CABEÇALHOS DE SEGURANÇA.
 *
 * O site é estático, público e sem formulário, então a superfície de ataque é
 * pequena. Isso não é razão para deixá-la aberta: os cabeçalhos abaixo custam
 * nada, não mudam nada visível, e fecham as portas que um site institucional
 * não tem motivo para manter abertas.
 *
 * O que cada um resolve, em vez de "é boa prática":
 *
 * - `frame-ancestors 'none'` impede que o site seja embutido em iframe. Para um
 *   preparatório, o risco concreto é alguém enquadrar a página dentro de outra e
 *   colar o próprio WhatsApp por cima. Substitui `X-Frame-Options`, que é o
 *   equivalente antigo e menos expressivo.
 * - `base-uri 'self'` impede que uma injeção de `<base>` reescreva o destino de
 *   TODOS os links relativos da página de uma vez, inclusive os CTAs.
 * - `form-action 'none'` porque o site não tem formulário e não terá (D-18).
 *   Se um aparecer sem passar por decisão, ele quebra, que é o comportamento
 *   desejado.
 * - `X-Content-Type-Options: nosniff` impede o navegador de adivinhar o tipo de
 *   um arquivo servido, que é como um upload inocente vira script.
 * - `Referrer-Policy` mantém o referer dentro do próprio site e envia só a
 *   origem para fora. Importa aqui: a pessoa sai deste site para o WhatsApp, e
 *   o caminho que ela percorreu antes não precisa viajar junto.
 * - `Permissions-Policy` desliga câmera, microfone e geolocalização. O site não
 *   usa nenhum dos três, então qualquer pedido é sinal de que algo foi injetado.
 *
 * NÃO HÁ CSP DE SCRIPT, e isso é decisão, não esquecimento. Uma
 * `script-src` séria no App Router exige nonce por requisição, o que obriga a
 * renderização dinâmica e derrubaria o site inteiro de estático para SSR. A
 * troca não compensa num site sem sessão, sem formulário e sem dado de usuário.
 * Fica registrado como consciente, para não ser "descoberto" depois.
 */
const cabecalhos = [
  {
    key: "Content-Security-Policy",
    value: ["frame-ancestors 'none'", "base-uri 'self'", "form-action 'none'"].join("; "),
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  /** Remove o `X-Powered-By: Next.js`. Anunciar o framework e a versão só serve
   *  a quem está procurando alvo por versão conhecida. */
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: cabecalhos }];
  },
};

export default nextConfig;
