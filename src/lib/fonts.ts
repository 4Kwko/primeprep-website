import { Cinzel, Fraunces, Inter } from "next/font/google";

/**
 * ARQUITETURA TIPOGRÁFICA — 3 papéis, 3 famílias.
 * Justificativa completa em docs/setup/typography.md
 *
 * Todas as famílias são variáveis: um arquivo por família cobre toda a faixa
 * de pesos, o que mantém o custo de rede baixo apesar de serem três.
 */

/** INSCRIPTION — herda o wordmark das peças (serifada capitular romana).
 *  Uso restrito: marca, eyebrows e rótulos de até ~4 palavras em caixa alta.
 *  Não é pré-carregada: nunca aparece acima da dobra em corpo de texto. */
export const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  /* Um peso só: `text-inscription` nunca é usado em negrito — auditoria da
     Etapa 3 confirmou zero ocorrências. O 600 era um arquivo baixado à toa. */
  weight: ["400"],
  preload: false,
});

/** DISPLAY — títulos e subtítulos editoriais.
 *  Variável com eixos de peso e optical size: permite títulos grandes de alto
 *  contraste e títulos pequenos ainda legíveis, resolvendo o risco levantado no
 *  planejamento (serifada fina quebrando em telas pequenas). */
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  /* Só `opsz`. O eixo SOFT engordava o arquivo variável e nunca era variado —
     nenhum `font-variation-settings` no projeto o utiliza. */
  axes: ["opsz"],
  style: ["normal"],
});

/** DISPLAY ITÁLICO — o "nome por extenso" das peças de concurso.
 *
 *  CHAMADA SEPARADA, e o motivo é peso, não organização. Declarado junto com o
 *  romano, o itálico entrava na mesma precarga: medido, três fontes
 *  precarregadas somando 193KB, e o itálico era 66KB deles. Só que ele nunca
 *  aparece acima da dobra — vive no nome por extenso dos concursos, na tabela
 *  comparativa e na ressalva do rodapé, todos abaixo.
 *
 *  Separado e com `preload: false`, ele sai da rajada de precarga. Medido em
 *  produção: as duas fontes precarregadas começam a ser buscadas em 7ms e 8ms, e
 *  o itálico só em 12ms, junto com o Cinzel. Nenhum pixel muda.
 *
 *  O QUE ISTO **NÃO** FAZ, e vale registrar para não virar promessa falsa: o
 *  arquivo continua sendo baixado em toda página. Medido numa rota sem um único
 *  elemento itálico, ele é buscado assim mesmo, com `initiatorType: "css"`. O
 *  `next/font` dá o MESMO nome de família (`Fraunces`) às duas chamadas, e o
 *  navegador acaba buscando as duas faces quando a família entra em uso. O ganho
 *  é de ORDEM, não de bytes: os 113KB que o texto precisa primeiro deixam de
 *  disputar a primeira conexão com 193KB.
 *
 *  A variável PRECISA ser outra (`--font-fraunces-italico`): apontar
 *  `text-editorial-italic` para a família romana faria o navegador SINTETIZAR um
 *  itálico falso, inclinando o desenho romano, que numa serifada de display é
 *  visivelmente errado. */
export const frauncesItalico = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces-italico",
  display: "swap",
  axes: ["opsz"],
  style: ["italic"],
  preload: false,
});

/** SANS — corpo, interface, formulários, tabelas, navegação. */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const fontVariables = [
  cinzel.variable,
  fraunces.variable,
  frauncesItalico.variable,
  inter.variable,
].join(" ");
