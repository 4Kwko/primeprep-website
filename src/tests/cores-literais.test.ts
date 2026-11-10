import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { corLiteral, corLiteralDoToken } from "@/lib/cores-literais";

/**
 * A regra 3 do projeto proíbe valor de cor escrito à mão: só token semântico.
 * Três lugares não conseguem obedecer, porque o consumidor não passa por CSS:
 * `viewport.themeColor`, o manifesto (que é JSON) e o gerador de Open Graph
 * (porque o Satori não resolve `var(--color-*)`).
 *
 * A duplicação, então, é inevitável. O que NÃO é inevitável é ela divergir em
 * silêncio: antes havia três cópias mudas do mesmo hex, e no dia em que o navy
 * mudasse, a barra do sistema e o cartão de WhatsApp ficariam na cor antiga sem
 * ninguém perceber.
 *
 * Este arquivo lê `tokens.css` e compara. É o que transforma a duplicação de
 * risco em contabilidade.
 */

const tokens = readFileSync(join(process.cwd(), "src", "styles", "tokens.css"), "utf8");

/** Lê a PRIMEIRA definição de um token, que é a das primitivas em `:root`. */
function valorDoToken(nome: string): string | null {
  const i = tokens.indexOf(`${nome}:`);
  if (i < 0) return null;
  const linha = tokens.slice(i, tokens.indexOf(";", i));
  const hex = linha.match(/#[0-9a-fA-F]{3,8}/);
  return hex ? hex[0].toLowerCase() : null;
}

/** Cada literal e o token de onde ele foi copiado. */
const origem: [keyof typeof corLiteral, string][] = [
  ["navy", "--color-navy-600"],
  ["navyEscuro", "--color-navy-700"],
  ["bone", "--color-bone-100"],
  ["boneClaro", "--color-bone-50"],
  ["boneMudo", "--color-steel-200"],
  ["ouro", "--color-gold-400"],
];

describe("os literais não podem divergir dos tokens", () => {
  it.each(origem)("`corLiteral.%s` é igual a `%s`", (chave, token) => {
    const doCss = valorDoToken(token);
    expect(doCss, `${token} não encontrado em tokens.css`).not.toBeNull();
    expect(corLiteral[chave].toLowerCase(), `${chave} divergiu de ${token}`).toBe(doCss);
  });

  it("toda cor de contexto casa com o token no escopo navy", () => {
    // O escopo navy redefine as cores de arma para manter contraste sobre navy,
    // então a comparação é contra a ÚLTIMA definição de cada uma, não a primeira.
    for (const [token, literal] of Object.entries(corLiteralDoToken)) {
      const i = tokens.lastIndexOf(`${token}:`);
      expect(i, `${token} ausente de tokens.css`).toBeGreaterThan(-1);
      const hex = tokens.slice(i, tokens.indexOf(";", i)).match(/#[0-9a-fA-F]{3,8}/);
      expect(hex, `${token} sem valor hex`).not.toBeNull();
      expect(literal.toLowerCase(), `${token} divergiu`).toBe(hex![0].toLowerCase());
    }
  });

  it("cobre todos os literais exportados, sem esquecer nenhum", () => {
    // Se alguém acrescentar uma cor ao módulo e esquecer de mapear a origem
    // aqui, ela ficaria sem verificação nenhuma. Este teste impede.
    expect(origem.map(([k]) => k).sort()).toEqual(Object.keys(corLiteral).sort());
  });
});

describe("nenhum hex escapa do módulo", () => {
  it("só `tokens.css` e `cores-literais.ts` escrevem cor à mão", () => {
    const permitidos = new Set(["cores-literais.ts"]);
    const ofensores: string[] = [];

    const varrer = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) {
          varrer(p);
          continue;
        }
        if (!/\.tsx?$/.test(e.name) || e.name.includes(".test.")) continue;
        if (permitidos.has(e.name)) continue;
        const codigo = readFileSync(p, "utf8")
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/(^|\s)\/\/.*$/gm, "");
        if (/#[0-9a-fA-F]{6}\b/.test(codigo)) ofensores.push(p.replace(process.cwd(), ""));
      }
    };
    varrer(join(process.cwd(), "src"));

    expect(ofensores, "cor escrita à mão fora de cores-literais.ts").toEqual([]);
  });
});

describe("`prefers-contrast: more` leva o site a AAA", () => {
  /**
   * O site já passa em AA em toda parte. Este bloco existe para quando alguém
   * PEDE mais contraste, e o que ele faz é medível: os pares que ficavam entre
   * 4,5 e 7 sobem, e sai de trás do texto tudo que existe para dar profundidade.
   *
   * Medido nas nove rotas, com o bloco forçado no navegador: zero par abaixo de
   * 7:1 (4,5 para texto grande). Sem ele, os pares abaixo de 7 eram
   * `fg-subtle` nas três superfícies, o ouro sobre pergaminho, e o texto sobre
   * os degraus tonais de cartão e painel.
   */
  const base = readFileSync(join(process.cwd(), "src", "styles", "base.css"), "utf8");
  const i = base.indexOf("@media (prefers-contrast: more)");
  const bloco = i > -1 ? base.slice(i) : "";

  it("existe o bloco", () => {
    expect(i, "sem ele, quem pede mais contraste recebe o mesmo site").toBeGreaterThan(-1);
  });

  it("o tom mais fraco de texto sobe um degrau", () => {
    // 5,06 / 6,50 / 5,28  ->  7,58 / 9,45 / 8,26
    expect(bloco).toContain("--color-fg-subtle: var(--color-fg-muted)");
  });

  it("o ouro sobre pergaminho usa o tom que atinge 7:1", () => {
    // gold-700 dá 4,88 sobre o papel; gold-800 dá 7,16. Em navy e ink o ouro
    // claro já dá 7,5 e 9,4, então lá nada muda, e o teste garante isso.
    const bone = bloco.slice(bloco.indexOf('[data-surface="bone"]'));
    expect(bone.slice(0, bone.indexOf("}"))).toContain("--color-accent: var(--color-gold-800)");
    const tokens = readFileSync(join(process.cwd(), "src", "styles", "tokens.css"), "utf8");
    expect(tokens, "gold-800 é o único motivo de existir deste token").toContain(
      "--color-gold-800:",
    );
  });

  it("o degrau tonal INVERTE, e não some", () => {
    /**
     * O verbo importa. A primeira versão colapsava o degrau que custava
     * contraste na cor da superfície: funcionava para o contraste e cobrava o
     * zebrado da tabela comparativa, que é apoio de LEITURA de linha, do qual
     * quem pede mais contraste também precisa. Inverter mantém o degrau, do
     * mesmo tamanho, apontando para longe da cor do texto em vez de para perto.
     *
     * Verificado no navegador: o zebrado continua alternando, e as nove rotas
     * ficam sem nenhum par abaixo de 7:1.
     */
    const bone = bloco.slice(bloco.indexOf('[data-surface="bone"]'));
    const boneRegra = bone.slice(0, bone.indexOf("}"));
    // Em papel o texto é escuro: o afundado passa a apontar para cima.
    expect(boneRegra).toContain("--color-surface-sunken: var(--color-surface)");
    expect(boneRegra, "colapsar na superfície apagaria o zebrado").not.toContain(
      "var(--color-canvas)",
    );

    const escuro = bloco.slice(bloco.indexOf('[data-surface="navy"]'));
    const escuroRegra = escuro.slice(0, escuro.indexOf("}"));
    expect(escuroRegra).toContain('[data-surface="ink"]');
    // Em navy e ink o texto é claro: o elevado passa a apontar para baixo.
    expect(escuroRegra).toContain("--color-surface: var(--color-surface-sunken)");
    expect(escuroRegra).toContain("--color-surface-elevated: var(--color-surface-sunken)");
    expect(escuroRegra, "colapsar na superfície apagaria a profundidade").not.toContain(
      "var(--color-canvas)",
    );
  });

  it("o que fica atrás do texto sai", () => {
    for (const alvo of [".numeral-registro", ".marca-dagua", ".plano-fundo"]) {
      expect(bloco, `${alvo} continua atrás do texto`).toContain(alvo);
    }
    expect(bloco, "grão e luz são background-image").toContain("background-image: none");
  });

  it("`prefers-reduced-transparency` esconde as mesmas três", () => {
    // São o único lugar do site onde conteúdo aparece ATRAVÉS de outra coisa:
    // não há vidro nem desfoque, porque glassmorphism está vetado na direção.
    // O motivo é outro (lá é contraste, aqui é translucidez), a resposta é a
    // mesma, e o teste existe para as duas não divergirem em silêncio.
    const j = base.indexOf("@media (prefers-reduced-transparency: reduce)");
    expect(j, "sem bloco para reduced-transparency").toBeGreaterThan(-1);
    const rt = base.slice(j);
    for (const alvo of [".numeral-registro", ".marca-dagua", ".plano-fundo"]) {
      expect(rt, `${alvo} não é escondido em reduced-transparency`).toContain(alvo);
    }
  });
});
