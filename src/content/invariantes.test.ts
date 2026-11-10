import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { site } from "@/lib/site";
import { concursos, concursosBySlug, forcaLabels } from "./concursos";
import { professores, disciplinas } from "./equipe";
import { diferenciais } from "./diferenciais";
import { ciclo } from "./metodologia";
import { mainNav, footerNav, plannedRoutes } from "./navigation";
import { diferencialIcons } from "@/components/decorative/icons";

/**
 * AS REGRAS INVIOLÁVEIS, VERIFICADAS.
 *
 * O `AGENTS.md` lista dezessete regras que o projeto se impôs, e até aqui todas
 * viviam como convenção: valiam enquanto alguém lembrasse. Este arquivo pega as
 * que dá para verificar mecanicamente e as torna executáveis.
 *
 * A que mais importa é a primeira. "Não inventar dados" é fácil de respeitar num
 * dia calmo e fácil de furar às duas da manhã, preenchendo um campo vazio para
 * "não deixar feio". Aqui, furar quebra o `check`.
 */

const raizConteudo = join(process.cwd(), "src", "content");

/** Um dado de edital marcado como confirmado sem fonte é pior que ausente. */
type Referencia = { valor: unknown; verifiedAt: string | null } | null;

function camposDeReferencia(c: (typeof concursos)[number]): [string, Referencia][] {
  return [
    ["voceVira", c.voceVira],
    ["faixaEtaria", c.faixaEtaria],
    ["escolaridade", c.escolaridade],
    ["local", c.local],
    ["remuneracaoInicial", c.remuneracaoInicial],
    ["disciplinasProva", c.disciplinasProva],
  ];
}

describe("regra 1: nada inventado", () => {
  it("os campos de contato ainda não confirmados continuam nulos", () => {
    // Endereço, telefone fixo, horário e CNPJ nunca foram fornecidos. Se um
    // aparecer preenchido, ou o cliente confirmou (e a documentação precisa
    // acompanhar) ou alguém inventou.
    const contato = site.contact as Record<string, unknown>;
    for (const campo of ["endereco", "telefone", "horario"]) {
      if (campo in contato) expect(contato[campo], `site.contact.${campo}`).toBeNull();
    }
    expect(site.legalName, "razão social / CNPJ").toBeNull();
  });

  it("nenhum retrato de professor é inventado: ou existe o arquivo, ou é null", () => {
    for (const p of professores) {
      if (p.retrato === null) continue;
      const caminho = join(process.cwd(), "public", p.retrato.replace(/^\//, ""));
      expect(existsSync(caminho), `retrato de ${p.nome} apontando para arquivo inexistente`).toBe(
        true,
      );
    }
  });

  it("nenhum brasão é inventado: ou existe o arquivo, ou é null", () => {
    for (const c of concursos) {
      if (c.brasao === null) continue;
      const caminho = join(process.cwd(), "public", c.brasao.replace(/^\//, ""));
      expect(existsSync(caminho), `brasão da ${c.sigla} apontando para arquivo inexistente`).toBe(
        true,
      );
    }
  });

  it("o conteúdo não afirma aprovação, estatística nem depoimento", () => {
    // Varre os módulos de conteúdo em busca do vocabulário que a restrição dura
    // proíbe. É grosseiro de propósito: prefere um falso positivo, que se resolve
    // relendo a frase, a deixar passar um número inventado.
    const proibido: [RegExp, string][] = [
      [/\b\d+\s*(\+|mais)?\s*(alunos|aprovados|aprovações)\b/i, "número de alunos ou aprovações"],
      [/\btaxa de (aprovação|sucesso)\b/i, "taxa de aprovação"],
      [/\b\d+\s*%\s*(de\s*)?(aprovação|sucesso)\b/i, "percentual de aprovação"],
      [/\b(melhor|maior|nº ?1|numero 1|líder)\s+(curso|preparatório)\b/i, "superlativo de mercado"],
      [/\búltimas vagas|vagas limitadas|garanta (já|agora)\b/i, "urgência artificial"],
    ];

    for (const arquivo of readdirSync(raizConteudo).filter(
      (f) => f.endsWith(".ts") && !f.endsWith(".test.ts"),
    )) {
      const texto = readFileSync(join(raizConteudo, arquivo), "utf8");
      for (const [padrao, nome] of proibido) {
        expect(padrao.test(texto), `${arquivo} parece conter ${nome}`).toBe(false);
      }
    }
  });
});

describe("regra 2: dado de edital é referência", () => {
  it("todo campo de referência preenchido declara `verifiedAt`", () => {
    for (const c of concursos) {
      for (const [nome, campo] of camposDeReferencia(c)) {
        if (campo === null) continue;
        expect(campo, `${c.sigla}.${nome}`).toHaveProperty("verifiedAt");
        expect(campo, `${c.sigla}.${nome}`).toHaveProperty("valor");
      }
    }
  });

  it("`verifiedAt` é null ou uma data ISO real, nunca texto solto", () => {
    for (const c of concursos) {
      for (const [nome, campo] of camposDeReferencia(c)) {
        if (campo === null || campo.verifiedAt === null) continue;
        expect(campo.verifiedAt, `${c.sigla}.${nome}`).toMatch(/^\d{4}-\d{2}-\d{2}/);
        expect(Number.isNaN(Date.parse(campo.verifiedAt)), `${c.sigla}.${nome}`).toBe(false);
      }
    }
  });

  it("nenhum valor de referência é vazio ou placeholder", () => {
    for (const c of concursos) {
      for (const [nome, campo] of camposDeReferencia(c)) {
        if (campo === null) continue;
        const v = campo.valor;
        if (typeof v === "string") {
          expect(v.trim().length, `${c.sigla}.${nome} vazio`).toBeGreaterThan(0);
          expect(v, `${c.sigla}.${nome}`).not.toMatch(/^(lorem|todo|tbd|a definir|xxx|\?+)$/i);
        }
        if (Array.isArray(v)) {
          expect(v.length, `${c.sigla}.${nome} vazio`).toBeGreaterThan(0);
          for (const item of v) expect(String(item).trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("regra 17: sem travessão na copy pública", () => {
  it("nenhuma string de conteúdo usa em dash ou en dash", () => {
    // Comentário de código pode usar; texto que chega ao visitante, não. O teste
    // remove os comentários antes de varrer, que é exatamente a distinção da D-32.
    for (const arquivo of readdirSync(raizConteudo).filter(
      (f) => f.endsWith(".ts") && !f.endsWith(".test.ts"),
    )) {
      const bruto = readFileSync(join(raizConteudo, arquivo), "utf8");
      const semComentarios = bruto.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "");
      const linhas = semComentarios.split("\n");
      linhas.forEach((linha, i) => {
        expect(/[—–]/.test(linha), `${arquivo}:${i + 1} -> ${linha.trim()}`).toBe(false);
      });
    }
  });
});

describe("integridade do conteúdo", () => {
  it("slugs de concurso são únicos e em kebab-case", () => {
    const slugs = concursos.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s, s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("`concursosBySlug` cobre exatamente a lista", () => {
    expect(concursosBySlug.size).toBe(concursos.length);
    for (const c of concursos) expect(concursosBySlug.get(c.slug)).toBe(c);
  });

  it("toda força usada tem rótulo, e todo rótulo é usado", () => {
    const usadas = new Set(concursos.map((c) => c.forca));
    for (const f of usadas) expect(forcaLabels[f], `força ${f} sem rótulo`).toBeTruthy();
    for (const f of Object.keys(forcaLabels)) {
      expect(usadas.has(f as (typeof concursos)[number]["forca"]), `rótulo ${f} sem uso`).toBe(
        true,
      );
    }
  });

  it("ESA continua fora do site (D-19)", () => {
    // Decisão do cliente. Reintroduzir é acrescentar a entrada em concursos.ts, e
    // aí este teste falha de propósito, pedindo que a D-19 seja revista junto.
    expect(concursos.map((c) => c.sigla)).not.toContain("ESA");
  });

  it("professores têm slug único e ao menos uma disciplina existente", () => {
    const slugs = professores.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const validas = new Set(disciplinas.map((d) => d.slug));
    for (const p of professores) {
      expect(p.disciplinas.length, p.nome).toBeGreaterThan(0);
      for (const d of p.disciplinas) expect(validas.has(d), `${p.nome} -> ${d}`).toBe(true);
    }
  });

  it("toda disciplina tem ao menos um professor", () => {
    const cobertas = new Set(professores.flatMap((p) => p.disciplinas));
    for (const d of disciplinas) {
      expect(cobertas.has(d.slug), `disciplina ${d.slug} sem professor`).toBe(true);
    }
  });

  it("todo diferencial aponta para um ícone que existe", () => {
    for (const d of diferenciais) {
      expect(Object.keys(diferencialIcons), `${d.slug} -> ${d.icone}`).toContain(d.icone);
    }
  });

  it("o ciclo tem etapas em ordem, sem momento repetido", () => {
    expect(ciclo.length).toBeGreaterThanOrEqual(3);
    const momentos = ciclo.map((e) => e.momento);
    expect(new Set(momentos).size).toBe(momentos.length);
  });
});

describe("navegação", () => {
  const rotasDeArquivo = new Set(plannedRoutes);

  it("todo item do menu principal aponta para uma rota prevista", () => {
    for (const item of mainNav) {
      expect(rotasDeArquivo.has(item.href), `menu -> ${item.href}`).toBe(true);
      for (const filho of item.children ?? []) {
        expect(rotasDeArquivo.has(filho.href), `submenu -> ${filho.href}`).toBe(true);
      }
    }
  });

  it("todo item do rodapé aponta para uma rota prevista", () => {
    for (const grupo of footerNav) {
      expect(grupo.itens.length, `grupo ${grupo.titulo} vazio`).toBeGreaterThan(0);
      for (const item of grupo.itens) {
        expect(rotasDeArquivo.has(item.href), `rodapé -> ${item.href}`).toBe(true);
      }
    }
  });

  it("toda rota prevista existe como arquivo de página", () => {
    // Pega o caso inverso: rota no sitemap sem página é 404 indexado.
    for (const rota of plannedRoutes) {
      if (rota.startsWith("/concursos/") && rota !== "/concursos") {
        const slug = rota.split("/")[2]!;
        expect(concursosBySlug.has(slug), `${rota} sem concurso correspondente`).toBe(true);
        continue;
      }
      const dir = rota === "/" ? "" : rota.replace(/^\//, "");
      const caminho = join(process.cwd(), "src", "app", dir, "page.tsx");
      expect(existsSync(caminho), `${rota} sem page.tsx`).toBe(true);
    }
  });

  it("matrícula não é item de menu: é CTA", () => {
    const hrefs = mainNav.flatMap((i) => [i.href, ...(i.children ?? []).map((c) => c.href)]);
    expect(hrefs).not.toContain("/matricula");
  });

  it("nenhum href é vazio, `#` ou externo sem protocolo", () => {
    const todos = [
      ...mainNav.flatMap((i) => [i, ...(i.children ?? [])]),
      ...footerNav.flatMap((g) => g.itens),
    ];
    for (const item of todos) {
      expect(item.href, item.label).toMatch(/^\/[a-z0-9/-]*$/);
      expect(item.label.trim().length, item.href).toBeGreaterThan(0);
    }
  });

  it("o sitemap não lista rotas de desenvolvimento", () => {
    for (const rota of plannedRoutes) {
      expect(rota.startsWith("/dev"), `${rota} não pode ir para o sitemap`).toBe(false);
    }
  });
});

describe("marca", () => {
  it("toda variação declarada tem os dois arquivos em public/", () => {
    // A URL saiu do componente e foi para o CSS (ver mascaras-da-marca.test.ts).
    // O que se verifica aqui é que o mapa de variações do Wordmark e os arquivos
    // no disco continuam se correspondendo, um a um.
    const dir = join(process.cwd(), "public", "assets", "brand", "logo");
    const fonte = readFileSync(
      join(process.cwd(), "src", "components", "layout", "Wordmark.tsx"),
      "utf8",
    );
    const classes = [...fonte.matchAll(/classe:\s*"marca-fonte-([\w-]+)"/g)].map((m) => m[1]!);
    expect(classes.length).toBeGreaterThanOrEqual(3);
    for (const v of classes) {
      expect(existsSync(join(dir, `marca-${v}.png`)), `marca-${v}.png`).toBe(true);
      expect(existsSync(join(dir, `marca-${v}.avif`)), `marca-${v}.avif`).toBe(true);
    }
  });

  it("o livro nunca é aplicado sozinho: nenhum componente usa a variação `livro`", () => {
    // A regra da marca é mais forte que um comentário. Aqui ela é verificada.
    const dirs = [join(process.cwd(), "src", "components"), join(process.cwd(), "src", "app")];
    const ofensores: string[] = [];
    const varrer = (d: string) => {
      for (const entrada of readdirSync(d, { withFileTypes: true })) {
        const caminho = join(d, entrada.name);
        if (entrada.isDirectory()) varrer(caminho);
        else if (/\.tsx?$/.test(entrada.name) && !entrada.name.endsWith(".test.tsx")) {
          const texto = readFileSync(caminho, "utf8");
          if (/variacao=["']livro["']|variacao:\s*["']livro["']/.test(texto)) {
            ofensores.push(caminho);
          }
        }
      }
    };
    dirs.forEach(varrer);
    expect(ofensores, "o livro nunca é usado sozinho").toEqual([]);
  });
});
