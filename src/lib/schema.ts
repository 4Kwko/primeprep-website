import { site } from "./site";
import { concursos } from "@/content/concursos";

/**
 * DADOS ESTRUTURADOS (JSON-LD).
 *
 * Existe por um motivo concreto: a Prime Prep é um curso PRESENCIAL numa cidade
 * específica, e quem procura "curso preparatório militar São Gabriel" precisa
 * encontrá-la. Dado estruturado é como o buscador entende que o site é de uma
 * organização de ensino que atende aquela região, em vez de uma página qualquer
 * que menciona concursos.
 *
 * A REGRA 1 VALE AQUI TAMBÉM, E É MAIS PERIGOSA. Declarar `address`,
 * `telephone`, `aggregateRating` ou `priceRange` que não existem seria inventar
 * dado com cara de estrutura, o que é pior que inventar no texto: o buscador
 * trata como fato declarado pela própria organização. Por isso este arquivo só
 * emite campo com origem, e todo campo pendente simplesmente não é emitido.
 *
 * O que NÃO está aqui, e por quê:
 * - `address` / `geo`: nunca fornecidos (`site.contact.address` é null).
 * - `telephone`: só existe WhatsApp, que não é telefone fixo de atendimento.
 * - `aggregateRating` / `review`: não há avaliação real. Inventar é o exemplo de
 *   manual de dado estruturado enganoso, e rende penalização.
 * - `Course` por concurso: `Course` pede `hasCourseInstance` com data e
 *   modalidade para valer alguma coisa, e as datas dependem de edital. Sem isso
 *   seria marcação vazia.
 */

/** Um nó JSON-LD já pronto para `<script type="application/ld+json">`. */
export type NoJsonLd = Record<string, unknown>;

/** Remove chaves nulas ou vazias, para nunca emitir campo sem origem. */
function limpar(no: NoJsonLd): NoJsonLd {
  return Object.fromEntries(
    Object.entries(no).filter(([, v]) => {
      if (v === null || v === undefined) return false;
      if (typeof v === "string" && v.trim() === "") return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    }),
  );
}

/** URL absoluta a partir de um caminho interno. */
export function absoluta(caminho: string): string {
  return new URL(caminho, site.url).toString();
}

/**
 * A organização. `EducationalOrganization` e não `LocalBusiness`: sem endereço
 * confirmado, `LocalBusiness` ficaria incompleto justamente no campo que o
 * define, e o que descreve a Prime Prep é ensinar, não ter um ponto comercial.
 */
export function organizacao(): NoJsonLd {
  return limpar({
    "@type": "EducationalOrganization",
    "@id": absoluta("/#organizacao"),
    name: site.name,
    alternateName: `${site.name} ${site.tagline}`,
    url: site.url,
    logo: absoluta("/icon2.png"),
    image: absoluta("/opengraph-image"),
    description: `Curso preparatório para concursos militares em ${site.city}/${site.state}, com acompanhamento individual do primeiro simulado à prova.`,
    sameAs: [site.social.instagram],
    areaServed: {
      "@type": "City",
      name: site.city,
      containedInPlace: { "@type": "State", name: "Rio Grande do Sul" },
    },
    // O que a escola de fato prepara. São os concursos reais de `concursos.ts`,
    // não uma lista de palavras-chave.
    knowsAbout: concursos.map((c) => c.nomeCompleto),
  });
}

/** O site em si, ligado à organização. */
export function website(): NoJsonLd {
  return limpar({
    "@type": "WebSite",
    "@id": absoluta("/#site"),
    url: site.url,
    name: site.name,
    inLanguage: site.locale,
    publisher: { "@id": absoluta("/#organizacao") },
  });
}

/**
 * Trilha de navegação. Derivada do caminho, então nunca diverge da rota real.
 * Serve ao buscador e, principalmente, ao leitor: é a linha de contexto que
 * aparece embaixo do resultado no lugar da URL crua.
 */
export function trilha(itens: { nome: string; caminho: string }[]): NoJsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: itens.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      item: absoluta(item.caminho),
    })),
  };
}

/** Empacota os nós num único grafo, que é como o Google prefere receber. */
export function grafo(...nos: NoJsonLd[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nos });
}
