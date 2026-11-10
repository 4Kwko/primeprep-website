/**
 * OS ÚNICOS VALORES DE COR ESCRITOS FORA DE `tokens.css`.
 *
 * A regra 3 diz que nada de valor fixo de cor: só token semântico. Existem três
 * lugares onde ela não tem como valer, porque o consumidor não passa por CSS:
 *
 * 1. `viewport.themeColor` no layout. O navegador lê esse valor antes de
 *    qualquer folha de estilo, para pintar a barra do sistema.
 * 2. O manifesto do aplicativo, que é JSON.
 * 3. O gerador de Open Graph, porque o Satori não resolve `var(--color-*)`.
 *
 * Antes, cada um desses lugares tinha o seu hex copiado à mão. Três cópias
 * mudas do mesmo valor, sem nada garantindo que continuassem iguais ao token:
 * o dia em que o navy mudasse, a barra do sistema e o cartão de WhatsApp
 * ficariam na cor antiga, e ninguém perceberia até alguém reparar.
 *
 * Aqui elas viram uma cópia só, com nome, e **existe um teste que lê
 * `tokens.css` e falha se qualquer valor daqui divergir do token de origem**.
 * A duplicação continua existindo, porque é inevitável; o que deixou de existir
 * é a possibilidade de ela divergir em silêncio.
 *
 * Ao acrescentar algo aqui, acrescente também a linha correspondente no teste.
 */

/** Cada entrada guarda o valor e o token de onde ele foi copiado. */
export const corLiteral = {
  /** `--color-navy-600`. O navy institucional, canvas da superfície navy. */
  navy: "#0f2350",
  /** `--color-navy-700`. Degrau tonal: header, e o campo direito do cartão. */
  navyEscuro: "#0c1c40",
  /** `--color-bone-100`. A superfície de leitura. */
  bone: "#f6f3ec",
  /** `--color-bone-50`. O texto sobre navy. */
  boneClaro: "#fbfaf6",
  /** `--color-steel-200`. Texto secundário sobre navy. */
  boneMudo: "#c3ccdd",
  /** `--color-gold-400`. O acento sobre navy. */
  ouro: "#d3b263",
} as const;

/**
 * Cores de contexto por concurso, no ESCOPO NAVY, que é a superfície dos cartões
 * de Open Graph. Não são as mesmas do escopo bone: cada superfície calibra a sua
 * para manter o contraste (DESIGN.md § Colors).
 *
 * A chave é o `accentToken` do concurso, e não a força, porque força não basta:
 * AFA e EEAR são as duas da Aeronáutica e usam tokens diferentes
 * (`--color-arma-aero` e `--color-arma-aero-light`). Mapear por força dava a
 * mesma cor às duas, apagando no cartão uma distinção que o site inteiro faz.
 */
export const corLiteralDoToken: Record<string, string> = {
  "--color-arma-cadete": "#e6949f", // EsPCEx, Exército
  "--color-arma-aero": "#6cb0e0", // AFA, Força Aérea
  "--color-arma-aero-light": "#9ed3e6", // EEAR, Força Aérea
  "--color-arma-marinha": "#63b8cd", // EFOMM, Marinha Mercante
  "--color-arma-exercito": "#9cbb90", // reservado, sem concurso hoje
};
