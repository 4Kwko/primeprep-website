import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/site";
import { concursos } from "@/content/concursos";
import { organizacao, website, trilha, grafo, absoluta } from "@/lib/schema";

/**
 * Dado estruturado é o lugar mais perigoso para inventar, e o menos visível.
 * No texto, um dado falso é lido por uma pessoa e alguém percebe. No JSON-LD ele
 * é lido por máquina, como declaração formal da própria organização, e ninguém
 * olha. Endereço, telefone ou avaliação inventados ali não são só desonestos:
 * rendem penalização de busca.
 *
 * Estes testes existem para que a ausência continue sendo ausência.
 */

const org = organizacao();
const jsonCompleto = grafo(org, website());

describe("JSON-LD: o que NÃO pode aparecer", () => {
  const proibidos = [
    "address",
    "streetAddress",
    "postalCode",
    "telephone",
    "faxNumber",
    "geo",
    "latitude",
    "longitude",
    "aggregateRating",
    "ratingValue",
    "reviewCount",
    "review",
    "priceRange",
    "offers",
    "openingHours",
    "openingHoursSpecification",
    "foundingDate",
    "numberOfEmployees",
    "taxID",
    "vatID",
  ];

  it.each(proibidos)("não declara `%s`, porque não existe dado para ele", (campo) => {
    expect(jsonCompleto, `${campo} apareceu no grafo`).not.toContain(`"${campo}"`);
  });

  it("nenhum campo é emitido vazio ou nulo", () => {
    const varrer = (no: unknown): void => {
      if (Array.isArray(no)) return no.forEach(varrer);
      if (no === null || typeof no !== "object") return;
      for (const [chave, valor] of Object.entries(no)) {
        expect(valor, `${chave} nulo ou indefinido`).not.toBeNull();
        expect(valor, `${chave} indefinido`).not.toBeUndefined();
        if (typeof valor === "string") expect(valor.trim(), chave).not.toBe("");
        if (Array.isArray(valor)) expect(valor.length, chave).toBeGreaterThan(0);
        varrer(valor);
      }
    };
    varrer(JSON.parse(jsonCompleto));
  });
});

describe("JSON-LD: o que precisa aparecer", () => {
  it("descreve uma organização de ensino, com nome e URL reais", () => {
    expect(org["@type"]).toBe("EducationalOrganization");
    expect(org.name).toBe(site.name);
    expect(org.url).toBe(site.url);
  });

  it("aponta para as redes que de fato existem", () => {
    expect(org.sameAs).toEqual([site.social.instagram]);
  });

  it("declara a cidade atendida, que é o ponto do negócio ser presencial", () => {
    const area = org.areaServed as Record<string, unknown>;
    expect(area["@type"]).toBe("City");
    expect(area.name).toBe(site.city);
  });

  it("lista os concursos reais, não palavras-chave", () => {
    expect(org.knowsAbout).toEqual(concursos.map((c) => c.nomeCompleto));
  });

  it("o grafo é JSON válido, com contexto do schema.org", () => {
    const parsed = JSON.parse(jsonCompleto);
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(Array.isArray(parsed["@graph"])).toBe(true);
  });

  it("a trilha numera os itens a partir de 1, com URLs absolutas", () => {
    const t = trilha([
      { nome: "Início", caminho: "/" },
      { nome: "Concursos", caminho: "/concursos" },
    ]);
    const itens = t.itemListElement as { position: number; item: string }[];
    expect(itens.map((i) => i.position)).toEqual([1, 2]);
    for (const i of itens) expect(i.item).toMatch(/^https?:\/\//);
  });

  it("`absoluta` resolve contra a URL do site", () => {
    expect(absoluta("/icon2.png")).toBe(new URL("/icon2.png", site.url).toString());
  });
});

describe("assets de marca derivados", () => {
  const derivados = join(process.cwd(), "assets", "brand", "derivados");
  const app = join(process.cwd(), "src", "app");

  it("os ícones do aplicativo existem, nos quatro tamanhos", () => {
    for (const nome of ["icon.png", "icon1.png", "icon2.png", "apple-icon.png"]) {
      expect(existsSync(join(app, nome)), `${nome} ausente`).toBe(true);
    }
  });

  it("o favicon do scaffold foi removido", () => {
    // O ícone genérico do create-next-app passava por definitivo para quem
    // olhasse a aba. Se ele voltar, este teste avisa.
    expect(existsSync(join(app, "favicon.ico"))).toBe(false);
  });

  it("as marcas claras usadas pelo Open Graph existem", () => {
    for (const nome of ["aguia-bone.png", "completa-bone.png"]) {
      expect(existsSync(join(derivados, nome)), `${nome} ausente`).toBe(true);
    }
  });

  it("os derivados NÃO ficam em public/: são lidos só em build", () => {
    // Em `public/` eles seriam servidos publicamente e baixados por ninguém,
    // e ainda dariam uma cópia da marca acessível sem passar por Wordmark.tsx.
    const emPublic = join(process.cwd(), "public", "assets", "brand", "derivados");
    expect(existsSync(emPublic), "derivados voltaram para public/").toBe(false);
  });

  it("os derivados são gerados, não desenhados à mão", () => {
    // O script é a única origem legítima. Se alguém trocar um PNG na mão, a
    // regra 15 fica sem rastro; manter o script versionado é o que permite
    // reproduzir e auditar o que cada arquivo é.
    const script = join(process.cwd(), "scripts", "gerar-assets-marca.mjs");
    expect(existsSync(script)).toBe(true);
    const fonte = readFileSync(script, "utf8");
    expect(fonte).toContain("marca-completa.png");
    expect(fonte).toContain("marca-aguia.png");
  });
});

describe("rota de desenvolvimento fora da produção", () => {
  const pagina = readFileSync(
    join(process.cwd(), "src", "app", "dev", "foundation", "page.tsx"),
    "utf8",
  );

  it("a folha de tokens some em produção", () => {
    expect(pagina).toContain("notFound()");
    expect(pagina).toMatch(/NODE_ENV !== "production"/);
  });

  it("continua fora do sitemap e marcada como noindex", () => {
    const nav = readFileSync(join(process.cwd(), "src", "content", "navigation.ts"), "utf8");
    expect(nav).not.toContain("/dev/");
    expect(pagina).toMatch(/robots:\s*\{\s*index:\s*false/);
  });
});

describe("cabeçalhos de segurança", () => {
  it("declara o conjunto para todas as rotas", async () => {
    const { default: config } = await import("../../next.config");
    expect(config.poweredByHeader, "X-Powered-By anuncia framework e versão").toBe(false);

    const regras = await config.headers!();
    expect(regras).toHaveLength(1);
    expect(regras[0]!.source).toBe("/:path*");

    const porNome = Object.fromEntries(regras[0]!.headers.map((h) => [h.key, h.value]));
    expect(porNome["X-Content-Type-Options"]).toBe("nosniff");
    expect(porNome["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(porNome["Permissions-Policy"]).toMatch(/camera=\(\)/);

    const csp = porNome["Content-Security-Policy"]!;
    expect(csp, "iframe de terceiro poderia colar outro WhatsApp por cima").toContain(
      "frame-ancestors 'none'",
    );
    expect(csp, "<base> injetado reescreveria todos os links relativos").toContain(
      "base-uri 'self'",
    );
    // O site não tem formulário e não terá (D-18). Se um aparecer sem passar por
    // decisão, ele quebra, que é o comportamento desejado.
    expect(csp).toContain("form-action 'none'");
  });
});
