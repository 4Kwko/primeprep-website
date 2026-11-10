import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
import { corLiteral } from "@/lib/cores-literais";

/**
 * IMAGEM DE OPEN GRAPH — a primeira coisa que alguém vê do site.
 *
 * Não é detalhe de SEO. Os dois canais de conversão da Prime Prep são WhatsApp e
 * DM do Instagram (D-18), e é exatamente ali que um link colado aparece como
 * cartão. Sem imagem, o cartão sai como uma tira de texto cinza, no momento em
 * que alguém está recomendando o curso para outra pessoa.
 *
 * A COMPOSIÇÃO É A DO SITE, não um cartão genérico: campo navy, marca à
 * esquerda, régua de ouro, e a águia sangrando pela borda direita em opacidade
 * baixa, que é literalmente o gesto do hero. O cartão escurece na direção dessa
 * borda, então a asa se dissolve em vez de ser cortada: é a mesma fuga da
 * D-59.
 *
 * SOBRE A TIPOGRAFIA. O Satori não tem as fontes do site, e buscá-las na rede
 * durante o build tornaria a build dependente de conexão para um resultado
 * cosmético. A saída não é um problema, é a solução certa: a marca COMPLETA já
 * contém o wordmark "PRIME" como arte, então a tipografia da identidade está na
 * imagem sem fonte nenhuma. O que sobra é texto de apoio, e texto de apoio em
 * sans neutra é mais adequado do que em serifada de display.
 *
 * As cores vêm de `cores-literais.ts`, que é o lugar único onde valor de cor
 * aparece escrito fora de `tokens.css`, e que tem teste garantindo que cada um
 * continua igual ao token de origem. O Satori não resolve `var(--color-*)`.
 */

/**
 * Fora de `public/`, de propósito. Estes PNGs só são lidos AQUI, em tempo de
 * build, para virar data URI dentro da imagem gerada. Em `public/` eles seriam
 * servidos publicamente e baixados por ninguém: 172KB de peso morto no deploy,
 * mais uma cópia da marca acessível por URL crua sem passar por `Wordmark.tsx`.
 */
const DERIVADOS = join(process.cwd(), "assets", "brand", "derivados");

/**
 * `#rrggbb` para `rgba(r, g, b, a)`.
 *
 * Existe porque o Satori erra `transparent` dentro de `linear-gradient`. Medido
 * na imagem gerada: com `linear-gradient(to right, transparent, X)` o degrau
 * escurecia até o meio da caixa e CLAREAVA de volta na borda, igual em toda
 * altura, ou seja, não era ângulo. Com as duas pontas escritas em `rgba()` e as
 * paradas em porcentagem explícita, o degrau chega onde deve.
 *
 * A cor continua vindo de `cores-literais.ts`: isto só reescreve a mesma cor
 * noutra notação, então não há segunda fonte de verdade.
 */
function comAlfa(hex: string, alfa: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alfa})`;
}

/** Lê um PNG do disco e devolve como data URI, que é o que o Satori aceita. */
function comoDataUri(arquivo: string): string {
  const bin = readFileSync(join(DERIVADOS, arquivo));
  return `data:image/png;base64,${bin.toString("base64")}`;
}

export const tamanhoOg = { width: 1200, height: 630 };
export const tipoOg = "image/png";

export type ConteudoOg = {
  /** Rótulo curto acima do título. Em caixa alta na imagem. */
  eyebrow?: string;
  /** A frase principal. Curta: acima de ~60 caracteres o cartão fica ilegível. */
  titulo: string;
  /** Cor de contexto do concurso, quando houver. Padrão: ouro. */
  cor?: string;
};

export function imagemOg({ eyebrow, titulo, cor = corLiteral.ouro }: ConteudoOg) {
  const completa = comoDataUri("completa-bone.png");
  const aguia = comoDataUri("aguia-bone.png");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: corLiteral.navy,
        padding: "72px 80px",
        position: "relative",
      }}
    >
      {/* Plano intermediário: a águia sangrando pela direita, como no hero.
          `<img>` puro, e não `next/image`: isto não é HTML de página, é a árvore
          que o Satori converte em PNG. Ele entende um punhado de elementos e
          `next/image` não está entre eles. A regra do ESLint fala de LCP, que
          aqui não existe: a imagem é gerada no build e servida pronta. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={aguia}
        width={980}
        height={202}
        alt=""
        style={{ position: "absolute", top: 150, right: -190, opacity: 0.1 }}
      />

      {/* A FUGA, e ela faz dois trabalhos com uma coisa só.
          O cartão escurece na direção da borda por onde a águia sai, então a
          asa se dissolve em vez de ser guilhotinada pelo corte de 1200px, que é
          a mesma regra que vale no site (D-59). E o degrau tonal continua
          existindo, agora sem aresta.

          O QUE ESTAVA AQUI ANTES era um retângulo de `navyEscuro` cobrindo 42%
          da direita. Renderizado, ele não lia como plano: lia como uma emenda
          vertical no meio do cartão, cortando a águia ao meio. Costura sem
          filete é troca de cor abrupta, e foi o que a D-58 consertou no site.
          Aqui não havia nem o que a costura separasse, porque os dois lados são
          a mesma composição. Era enfeite que parecia defeito.

          POR QUE 30% E NÃO MAIS. Com 62% o degrau começava antes da cabeça da
          águia e apagava justamente o que identifica a marca: sobrava uma asa
          solta no meio do cartão. É a mesma regra da fuga no site, onde a queda
          só começa em 60% da largura do recorte porque a cabeça fica em 63%.
          Aqui a cabeça cai em torno de x=880, e o degrau começa em x=840.

          DUAS COISAS MEDIDAS SOBRE O SATORI, porque nenhuma está na
          documentação e as duas custaram uma rodada cada:

          1. `transparent` dentro de `linear-gradient` sai errado. Com
             `to right, transparent, X` o degrau escurecia até o meio da caixa e
             CLAREAVA de volta na borda, igual em toda altura, ou seja, não era
             ângulo. Com as duas pontas em `rgba()` o degrau fica monótono, e o
             maior salto entre pixels vizinhos é de 2 níveis.

          2. O degrau satura em torno de meio caminho entre `navy` e
             `navyEscuro`, e não no `navyEscuro` cheio, mesmo com a parada final
             em alfa 1. Medido: 12,28,64 contra os 9,21,49 pedidos. Não é defeito
             para corrigir aqui, porque com a águia já em 10% de opacidade meio
             degrau dissolve o bastante; fica registrado para quem vier depois
             não perder a mesma tarde.

          Depois da imagem da águia, de propósito: no Satori quem vem depois
          pinta por cima, e é isso que faz o degrau apagar a asa. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "30%",
          display: "flex",
          background: `linear-gradient(90deg, ${comAlfa(corLiteral.navyEscuro, 0)} 0%, ${comAlfa(
            corLiteral.navyEscuro,
            1,
          )} 100%)`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={completa} width={232} height={113} alt="" />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 4,
              color: cor,
              textTransform: "uppercase",
              marginBottom: 22,
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            fontSize: titulo.length > 44 ? 58 : 68,
            lineHeight: 1.12,
            color: corLiteral.bone,
            maxWidth: 900,
          }}
        >
          {titulo}
        </div>

        {/* Régua de fecho, no vocabulário do ornamento do site. */}
        <div
          style={{ display: "flex", height: 2, width: 132, background: cor, margin: "34px 0 26px" }}
        />

        <div
          style={{ display: "flex", fontSize: 26, color: corLiteral.boneMudo, letterSpacing: 1 }}
        >
          {site.tagline} · {site.city}/{site.state}
        </div>
      </div>
    </div>,
    tamanhoOg,
  );
}
