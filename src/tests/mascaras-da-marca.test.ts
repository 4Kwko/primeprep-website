import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * O FALLBACK DA MÁSCARA, TRAVADO.
 *
 * A marca é máscara alfa pintada com a cor corrente. Sem
 * `mask-image`, o elemento não some: ele vira um RETÂNGULO SÓLIDO da cor do
 * texto, no lugar onde deveria estar a marca. O modo de falhar é visível e feio,
 * e por isso o fallback importa mais aqui do que na maioria dos lugares.
 *
 * A primeira tentativa foi cascata (`mask-image: url(png)` seguido de
 * `mask-image: image-set(...)`). NÃO FUNCIONA neste projeto: o Lightning CSS,
 * que compila o Tailwind v4, considera a primeira declaração redundante e a
 * APAGA. Verificado no CSS compilado, sobrava só a `image-set`.
 *
 * `@supports` resolve porque o compilador não pode colapsar regras que vivem em
 * contextos condicionais diferentes. Estes testes garantem que a estrutura
 * continue sendo essa, e não volte a ser cascata numa refatoração distraída.
 *
 * Sem expressão regular de propósito: a versão anterior deste arquivo usava
 * `new RegExp` montada com template literal, e o próprio template comeu as
 * barras (`\\s` virou `s`), então o teste passava a casar com outra coisa.
 * Recortar o bloco e procurar substring é mais chato de escrever e não mente.
 */

const css = readFileSync(join(process.cwd(), "src", "styles", "utilities.css"), "utf8");
const logo = join(process.cwd(), "public", "assets", "brand", "logo");
const variacoes = ["completa", "aguia", "wordmark", "livro"];

/** Recorta um bloco `{ ... }` balanceado a partir de uma posição. */
function blocoEm(i: number): string {
  let j = css.indexOf("{", i);
  const inicio = j;
  let profundidade = 0;
  do {
    if (css[j] === "{") profundidade++;
    else if (css[j] === "}") profundidade--;
    j++;
  } while (j < css.length && profundidade > 0);
  return css.slice(inicio, j);
}

/** Recorta o bloco que começa num marcador textual. */
function bloco(marcador: string): string {
  const i = css.indexOf(marcador);
  expect(i, `marcador ausente: ${marcador}`).toBeGreaterThan(-1);
  return blocoEm(i);
}

/**
 * O `@supports` DA MÁSCARA, não o primeiro do arquivo. O arquivo tem outros
 * três, das animações de rolagem, e procurar por "@supports (" pegava o da
 * paralaxe. Foi o que fez a primeira versão destes testes falhar medindo o
 * bloco errado.
 */
const inicioCondicional = (() => {
  let i = css.indexOf("@supports (");
  while (i >= 0) {
    if (blocoEm(i).includes("marca-fonte-")) return i;
    i = css.indexOf("@supports (", i + 1);
  }
  return -1;
})();

expect(inicioCondicional, "@supports das máscaras ausente").toBeGreaterThan(-1);
const condicional = blocoEm(inicioCondicional);

describe("máscaras da marca: PNG na base, AVIF no @supports", () => {
  it.each(variacoes)("`marca-fonte-%s` declara o PNG fora de qualquer condicional", (v) => {
    const base = bloco(`@utility marca-fonte-${v} `);
    expect(base, `o fallback PNG de ${v} sumiu da regra base`).toContain(
      `mask-image: url("/assets/brand/logo/marca-${v}.png")`,
    );
    expect(base, `${v} não pode trazer AVIF na regra base`).not.toContain(".avif");
  });

  it.each(variacoes)("`marca-fonte-%s` só recebe AVIF dentro do @supports", (v) => {
    expect(condicional, `${v} ausente do bloco condicional`).toContain(`.marca-fonte-${v}`);
    expect(condicional).toContain(`marca-${v}.avif`);
  });

  it("nenhuma regra fora do @supports menciona AVIF", () => {
    // Se AVIF vazar para fora, o navegador que não o entende perde a máscara e
    // mostra um retângulo sólido.
    const antes = css.slice(0, inicioCondicional);
    expect(antes, "AVIF fora do @supports").not.toContain(".avif");
  });

  it("toda `image-set` traz o PNG como segunda opção", () => {
    const conjuntos = condicional.split("image-set(").slice(1);
    expect(conjuntos.length).toBeGreaterThanOrEqual(variacoes.length * 2);
    for (const c of conjuntos) {
      const ate = c.slice(0, c.indexOf(");"));
      expect(ate).toContain('type("image/avif")');
      expect(
        ate,
        "sem PNG dentro da image-set, quem não decodifica AVIF fica sem máscara",
      ).toContain('type("image/png")');
    }
  });

  it("prefixado e sem prefixo andam juntos", () => {
    // Safari só passou a entender `mask-image` sem prefixo na 15.4.
    for (const v of variacoes) {
      const base = bloco(`@utility marca-fonte-${v} `);
      expect(base).toContain("-webkit-mask-image:");
      expect(base).toContain("\n  mask-image:");
    }
    expect(condicional).toContain("-webkit-mask-image:");
  });

  it("a superfície da máscara é pintada pela cor corrente", () => {
    // É o que permite a mesma máscara servir bone, navy e ink (D-33).
    // A pintura é gradiente mesmo quando chapada, para que `--marca-pintura`
    // possa trocá-la inteira: `background-image` cobre `background-color`, e
    // uma pintura com parte transparente deixaria a cor chapada aparecer por
    // baixo. O que este teste protege é a COR, não o mecanismo.
    const b = bloco("@utility mascara-marca");
    expect(b).toContain("currentColor");
    expect(b, "a cor não pode ser fixa: a marca herda a superfície").not.toMatch(
      /background-(color|image):[^;]*#[0-9a-f]{3}/i,
    );
  });

  it("a fuga da marca d'água escurece na direção da borda, e só onde ela sangra", () => {
    // A fuga existe porque a seção corta a marca com `overflow-x: clip`, e ela
    // vale para o corte ASSIMÉTRICO. A águia do CTA final é centralizada: acima
    // de ~500px nada nela é cortado, e abaixo disso o corte é igual dos dois
    // lados, na ponta da asa, que já afina sozinha. Simulado em 320px, com fuga
    // e sem são quase indistinguíveis.
    for (const [util, direcao] of [
      ["marca-fuga-direita", "to right"],
      ["marca-fuga-esquerda", "to left"],
    ] as const) {
      const b = bloco(`@utility ${util}`);
      expect(b).toContain("--marca-pintura:");
      expect(b).toContain(direcao);
      expect(b, "a fuga tem que terminar mais fraca do que começa").toContain("transparent");
    }

    const cta = readFileSync(
      join(process.cwd(), "src", "components", "sections", "CtaFinal.tsx"),
      "utf8",
    );
    expect(cta, "a águia do CTA final é centralizada e não é cortada").not.toContain("marca-fuga");
  });
});

describe("os arquivos das máscaras", () => {
  it.each(variacoes)("marca-%s existe nos dois formatos", (v) => {
    expect(existsSync(join(logo, `marca-${v}.png`)), `PNG de ${v}`).toBe(true);
    expect(existsSync(join(logo, `marca-${v}.avif`)), `AVIF de ${v}`).toBe(true);
  });

  it("o AVIF é sempre menor que o PNG, senão não há motivo para existir", () => {
    for (const v of variacoes) {
      const png = statSync(join(logo, `marca-${v}.png`)).size;
      const avif = statSync(join(logo, `marca-${v}.avif`)).size;
      expect(avif, `AVIF de ${v} não é menor que o PNG`).toBeLessThan(png);
    }
  });

  it("o conjunto em AVIF pesa menos de um terço do conjunto em PNG", () => {
    const soma = (ext: string) =>
      variacoes.reduce((t, v) => t + statSync(join(logo, `marca-${v}.${ext}`)).size, 0);
    const png = soma("png");
    const avif = soma("avif");
    expect(avif / png, `AVIF em ${Math.round((avif / png) * 100)}% do PNG`).toBeLessThan(0.34);
  });
});

describe("Wordmark não volta a embutir a URL", () => {
  const fonte = readFileSync(
    join(process.cwd(), "src", "components", "layout", "Wordmark.tsx"),
    "utf8",
  );

  it("aplica a máscara por classe, não por `style` inline", () => {
    // `image-set()` com fallback não cabe em style inline: é o motivo de a URL
    // ter saído do componente.
    //
    // Compara o CÓDIGO, sem os comentários: o cabeçalho do arquivo cita o
    // caminho dos arquivos de propósito, para dizer onde trocar quando o SVG
    // chegar, e isso é documentação, não acoplamento.
    const codigo = fonte.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "");
    expect(codigo.toLowerCase(), "URL de máscara voltou para o style inline").not.toContain(
      "maskimage",
    );
    expect(codigo, "caminho de arquivo de volta no componente").not.toContain(
      "/assets/brand/logo/",
    );
    expect(codigo).toContain("mascara-marca");
  });

  it("cada variação aponta para a sua classe", () => {
    for (const v of variacoes) expect(fonte).toContain(`marca-fonte-${v}`);
  });

  it("continua sendo o ponto único de aplicação da marca", () => {
    // Nenhum outro componente pode referenciar a classe de máscara direto.
    const componentes = join(process.cwd(), "src", "components");
    const varrer = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = join(dir, e.name);
        if (e.isDirectory()) return varrer(p);
        if (!/\.tsx?$/.test(e.name) || e.name.endsWith(".test.tsx")) return [];
        return readFileSync(p, "utf8").includes("marca-fonte-") && !p.endsWith("Wordmark.tsx")
          ? [p]
          : [];
      });
    expect(varrer(componentes), "a marca só entra por Wordmark.tsx").toEqual([]);
  });
});

describe("alto contraste forçado não apaga as marcas", () => {
  /**
   * O modo força `background-color` para a cor do sistema e ignora o valor do
   * autor, EXCETO quando esse valor é ele mesmo uma cor de sistema. Quatro
   * marcas deste site são desenhadas com `background-color`, então as quatro
   * passavam a ser pintadas com a cor do FUNDO, ou seja, sumiam.
   *
   * A que importa é o losango. No diagnóstico o rádio é `sr-only` e o losango é
   * o único sinal visual de qual opção está marcada; a borda de todos os cartões
   * é forçada para a mesma cor, então ela também deixa de distinguir. Sem a
   * regra, quem usa alto contraste respondia sem ver o que tinha escolhido.
   */
  const base = readFileSync(join(process.cwd(), "src", "styles", "base.css"), "utf8");
  const i = base.indexOf("@media (forced-colors: active)");
  const bloco = i > -1 ? base.slice(i) : "";

  it("existe um bloco para o modo", () => {
    expect(
      i,
      "sem @media (forced-colors: active) as marcas somem no alto contraste",
    ).toBeGreaterThan(-1);
  });

  it("as marcas pintadas por `background-color` voltam com cor de sistema", () => {
    for (const marca of [".mark-lozenge", ".marcador-nav", ".link-filete::after"]) {
      expect(bloco, `${marca} não é restaurado`).toContain(marca);
    }
    // Cor do TEXTO. Qualquer cor do autor seria ignorada pelo modo.
    expect(bloco).toMatch(/background-color:\s*CanvasText/i);
  });

  it("o losango marcado continua se distinguindo por opacidade", () => {
    // `opacity` não é forçada pelo modo, e é o que sobra depois que a cor vira
    // a mesma nos dois. Medido no navegador: marcado 1, não marcado 0,3.
    const dx = readFileSync(
      join(process.cwd(), "src", "components", "sections", "Diagnostico.tsx"),
      "utf8",
    );
    expect(dx).toContain("opacity-100");
    expect(dx).toContain("opacity-30");
  });
});
