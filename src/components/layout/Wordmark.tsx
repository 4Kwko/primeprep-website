import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

/**
 * A MARCA DA PRIME PREP. Ponto único de aplicação da identidade.
 *
 * COMO FUNCIONA
 * O asset real é raster monocromático (arte preta sobre branco). Em vez de
 * publicar uma versão branca e outra navy de cada variação, cada arquivo é
 * exportado como **máscara alfa** e pintado com `background-color`. Consequência:
 * a marca herda a cor corrente da superfície em que está, então funciona em bone,
 * navy e ink sem duplicar asset e sem nunca sair com a cor errada.
 *
 * VARIAÇÕES (recortes do MESMO arquivo original, nada redesenhado)
 * - `completa`  águia + PRIME + livro. Assinatura institucional.
 * - `aguia`     só a águia. Espaço horizontal apertado ou marca d'água.
 * - `wordmark`  PRIME + livro. Onde a águia já apareceu ou não cabe.
 * - `livro`     só o livro. RESERVADA: ver a regra abaixo.
 *
 * REGRA DA MARCA (obrigatória)
 * O livro NUNCA é usado sozinho. Ele é o pé da composição, não uma marca
 * autônoma: isolado, não identifica a Prime Prep e lê como ícone genérico.
 * A variação `livro` permanece no mapa por ser um recorte legítimo do original,
 * mas não deve ser aplicada. Quando o espaço não comporta a águia, use
 * `wordmark` (PRIME + livro), que é a menor composição que ainda é a marca.
 *
 * PONTO DE SUBSTITUIÇÃO
 * Quando a marca em SVG chegar, troque os arquivos em
 * `public/assets/brand/logo/` (ou o mecanismo de máscara por `<svg>` inline).
 * Nenhuma página muda: todas consomem este componente.
 * Original preservado em `docs/references/brand/logo-original-bw.png`.
 */

/**
 * A URL da máscara NÃO mora aqui. Ela vive em `utilities.css`, numa classe por
 * variação, porque servir AVIF com fallback de PNG exige `image-set()` com duas
 * declarações em cascata, e isso não cabe em `style` inline. As máscaras caíram
 * de 190KB para 54KB com essa troca. Ver a seção "Máscaras da marca" lá.
 *
 * O que sobra aqui é a proporção, que é o que define a largura a partir da
 * altura pedida, e é por isso que a marca nunca distorce.
 */
const variacoes = {
  completa: { classe: "marca-fonte-completa", ratio: 2.06 },
  aguia: { classe: "marca-fonte-aguia", ratio: 4.86 },
  wordmark: { classe: "marca-fonte-wordmark", ratio: 2.08 },
  livro: { classe: "marca-fonte-livro", ratio: 4.56 },
} as const;

export type VariacaoMarca = keyof typeof variacoes;

/**
 * A marca como máscara pintada pela cor corrente.
 * `altura` define o tamanho; a largura vem da proporção real do recorte, então
 * a marca nunca distorce. A máscara em si vem da classe da variação.
 */
export function Marca({
  variacao = "completa",
  altura,
  className,
  style,
}: {
  variacao?: VariacaoMarca;
  /** Altura em CSS, ex.: "2.25rem". A largura é calculada pela proporção. */
  altura: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { classe, ratio } = variacoes[variacao];

  return (
    <span
      aria-hidden
      className={cn("block shrink-0 mascara-marca", classe, className)}
      style={{
        height: altura,
        width: `calc(${altura} * ${ratio})`,
        ...style,
      }}
    />
  );
}

/**
 * A marca como link para a home. `aria-label` carrega o nome, já que a marca em
 * si é decorativa para o leitor de tela.
 */
export function Wordmark({
  variacao = "aguia",
  altura = "1.75rem",
  className,
  comAssinatura = false,
}: {
  variacao?: VariacaoMarca;
  altura?: string;
  className?: string;
  /** Acrescenta "Curso Preparatório Militar" abaixo da marca. */
  comAssinatura?: boolean;
}) {
  return (
    <Link
      href="/"
      data-touch-target
      aria-label={`${site.name}, página inicial`}
      className={cn("inline-flex flex-col items-start justify-center gap-2", className)}
    >
      <Marca variacao={variacao} altura={altura} />
      {comAssinatura ? (
        <span className="text-label-caps text-[0.5625rem] whitespace-nowrap text-fg-subtle">
          {site.tagline}
        </span>
      ) : null}
    </Link>
  );
}
