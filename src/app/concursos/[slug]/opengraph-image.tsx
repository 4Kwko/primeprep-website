import { concursos, concursosBySlug, forcaLabels } from "@/content/concursos";
import { imagemOg, tamanhoOg, tipoOg } from "@/lib/og";
import { corLiteralDoToken } from "@/lib/cores-literais";

export const alt = "Concurso militar atendido pela Prime Prep";
export const size = tamanhoOg;
export const contentType = tipoOg;

/**
 * Só os quatro slugs de `concursos.ts` existem. Sem isto, o Next tenta renderizar
 * qualquer slug sob demanda, e o endpoint de imagem de uma rota inexistente
 * respondia 200 com o cartão genérico enquanto a página dela respondia 404.
 * Além da incoerência, cada slug inventado disparava uma renderização.
 */
export const dynamicParams = false;

/** Uma imagem por concurso, pré-gerada no build junto com as páginas. */
export function generateStaticParams() {
  return concursos.map((c) => ({ slug: c.slug }));
}

/**
 * A página de concurso é a que mais circula em conversa, porque é a resposta a
 * "qual é o teu?". O cartão dela carrega a sigla e a cor de contexto daquela
 * força, então o link já chega dizendo de qual escola se trata.
 *
 * Sem `generateImageMetadata`: ela existe para gerar VÁRIAS imagens por rota, e
 * aqui é uma só. Usá-la só acrescentava um segmento `/padrao` na URL e um
 * segundo lugar para o tipo de `params` divergir.
 */
export default async function Imagem({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = concursosBySlug.get(slug);

  if (!c) return imagemOg({ titulo: "Concursos militares atendidos" });

  // Pelo `accentToken` do concurso, e não pela força: AFA e EEAR são as duas da
  // Aeronáutica e usam tokens diferentes. `exactOptionalPropertyTypes` não
  // aceita passar `undefined` a um campo opcional, então ou a cor existe e vai,
  // ou a propriedade não é passada e o padrão (ouro) vale.
  const cor = corLiteralDoToken[c.accentToken];

  return imagemOg({
    eyebrow: `${c.sigla} · ${forcaLabels[c.forca]}`,
    titulo: c.nomeCompleto,
    ...(cor ? { cor } : {}),
  });
}
