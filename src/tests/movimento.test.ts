import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A REGRA 18, VERIFICADA.
 *
 * "Animação nunca é o que torna o conteúdo visível" custou caro para ser
 * aprendida, duas vezes. Primeiro por JavaScript: o `motion` escrevia
 * `opacity: 0` no HTML do servidor, e sem JS o conteúdo revelado não existia
 * (D-21). Depois por CSS: a transição de rota partia de `opacity: 0` com
 * `fill-mode: both`, e num navegador com a renderização suspensa a medição
 * devolveu `animationPlayState: "running"`, `currentTime: 0`, `opacity: "0"`.
 * A página inteira invisível, esperando um quadro que não vinha (D-39).
 *
 * As duas vezes o defeito passou por typecheck, lint e build sem uma reclamação.
 * Este arquivo é a terceira linha de defesa, e a primeira automática.
 *
 * Analisa o CSS FONTE, não o compilado: o teste precisa rodar sem build, e é no
 * fonte que alguém escreve a regra errada.
 */

const raiz = join(process.cwd(), "src", "styles");
const utilities = readFileSync(join(raiz, "utilities.css"), "utf8");
const base = readFileSync(join(raiz, "base.css"), "utf8");

/** Extrai cada bloco `@keyframes nome { ... }` com o corpo. */
function keyframes(css: string): Map<string, string> {
  const mapa = new Map<string, string>();
  const re = /@keyframes\s+([\w-]+)\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    // Varre contando chaves, porque keyframes têm blocos aninhados.
    let profundidade = 1;
    let i = re.lastIndex;
    while (i < css.length && profundidade > 0) {
      if (css[i] === "{") profundidade++;
      else if (css[i] === "}") profundidade--;
      i++;
    }
    mapa.set(m[1]!, css.slice(re.lastIndex, i - 1));
  }
  return mapa;
}

const quadros = keyframes(utilities);

describe("regra 18: nenhuma animação decide se o conteúdo existe", () => {
  it("encontra os keyframes do projeto", () => {
    expect(quadros.size).toBeGreaterThanOrEqual(5);
    for (const nome of quadros.keys()) {
      expect(nome, "keyframe do projeto usa prefixo pp-").toMatch(/^pp-/);
    }
  });

  /**
   * NÃO HÁ EXCEÇÃO, e não deve voltar a haver.
   *
   * Chegou a existir uma, para o painel do menu mobile e seus itens, com a
   * justificativa de que eles só existem depois de um clique e portanto teriam
   * JavaScript e quadros de animação garantidos. **A justificativa estava
   * errada.** Medido num navegador com a renderização suspensa: o painel abriu
   * com `animationPlayState: "running"` e `opacity: 0`, e ficou assim. Ter
   * JavaScript não garante quadro de animação.
   *
   * As duas animações passaram a ser só deslocamento, como todo o resto, e a
   * lista de exceções morreu junto. É o melhor desfecho possível para uma regra:
   * ela não precisa de nenhuma.
   */
  it.each([...quadros.keys()])("`%s` não parte de opacidade zero", (nome) => {
    const corpo = quadros.get(nome)!;
    const de = /from\s*\{([^}]*)\}/.exec(corpo)?.[1] ?? /0%\s*\{([^}]*)\}/.exec(corpo)?.[1] ?? "";
    expect(de, `${nome} esconderia conteúdo até o primeiro quadro chegar`).not.toMatch(
      /opacity\s*:\s*0(?!\.)/,
    );
  });

  it("a transição de rota anima só deslocamento", () => {
    // É a que cobre a página INTEIRA. Se ela esconder, esconde tudo.
    const corpo = quadros.get("pp-entrada-rota")!;
    expect(corpo).toMatch(/transform/);
    expect(corpo, "opacity na transição de rota é o defeito da D-39").not.toMatch(/opacity/);
  });

  it("a entrada do hero anima só deslocamento", () => {
    // O hero é o que está na tela quando a página abre. Nada acima da dobra
    // pode depender de quadro de animação para ser lido.
    const corpo = quadros.get("pp-assenta")!;
    expect(corpo).toMatch(/transform/);
    expect(corpo).not.toMatch(/opacity/);
  });
});

describe("movimento reduzido é respeitado", () => {
  it("toda animação de entrada é desligada ou vive sob `no-preference`", () => {
    // Duas formas válidas: declarar dentro de `no-preference` (aí só existe para
    // quem aceita movimento) ou declarar solta e desligar num bloco `reduce`.
    const classes = [...utilities.matchAll(/^\.([\w-]+)\s*\{/gm)].map((m) => m[1]!);
    const comAnimacao = classes.filter((c) => {
      const i = utilities.indexOf(`.${c} {`);
      const bloco = utilities.slice(i, utilities.indexOf("}", i));
      return /animation:\s*pp-/.test(bloco);
    });

    expect(comAnimacao.length, "nenhuma classe animada encontrada").toBeGreaterThan(0);

    for (const c of comAnimacao) {
      const desligada = new RegExp(
        `@media \\(prefers-reduced-motion: reduce\\)[^@]*?\\.${c}\\b[^}]*animation:\\s*none`,
        "s",
      ).test(utilities);
      expect(desligada, `.${c} não é desligada sob prefers-reduced-motion`).toBe(true);
    }
  });

  it("a paralaxe só existe sob `no-preference` e com `@supports`", () => {
    // Sem a guarda de `@supports`, o navegador ignoraria apenas a linha do
    // `animation-timeline` e rodaria tudo na linha do tempo do DOCUMENTO: os
    // planos deslizariam uma vez no carregamento e parariam no lugar errado.
    for (const classe of ["parallax-marca", "parallax-fundo", "parallax-frente"]) {
      const i = utilities.indexOf(`.${classe}`);
      expect(i, `${classe} ausente`).toBeGreaterThan(-1);
      const antes = utilities.slice(0, i);
      const supports = antes.lastIndexOf("@supports (animation-timeline: view())");
      const noPreference = antes.lastIndexOf("prefers-reduced-motion: no-preference");
      expect(supports, `${classe} fora de @supports`).toBeGreaterThan(-1);
      expect(noPreference, `${classe} fora de no-preference`).toBeGreaterThan(supports);
    }
  });

  it("o reveal por scroll continua com o estado visível como padrão", () => {
    // O esconder vive dentro de `scripting: enabled`, então só existe onde há
    // JavaScript para revelar. Sem JS, nada é escondido. É a D-21.
    const i = base.indexOf("[data-reveal]");
    const antes = base.slice(0, i);
    expect(antes.lastIndexOf("@media (scripting: enabled)")).toBeGreaterThan(-1);
  });

  it("`prefers-reduced-motion: reduce` zera transição e animação globalmente", () => {
    const bloco = /@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n  \}/.exec(base)?.[1];
    expect(bloco).toBeTruthy();
    expect(bloco).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
    expect(bloco).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
    expect(bloco).toMatch(/scroll-behavior:\s*auto/);
  });

  it("a rolagem suave não é instanciada sob movimento reduzido", () => {
    const fonte = readFileSync(
      join(process.cwd(), "src", "components", "motion", "RolagemSuave.tsx"),
      "utf8",
    );
    expect(fonte).toMatch(/matchMedia\("\(prefers-reduced-motion: reduce\)"\)/);
    // E reavalia em tempo real, em vez de decidir uma vez no carregamento.
    expect(fonte).toMatch(/addEventListener\("change"/);
    expect(fonte).toMatch(/destroy\(\)/);
  });
});

describe("impressão não herda o esconder do reveal", () => {
  /**
   * ISTO É DEFEITO, NÃO ACABAMENTO.
   *
   * O reveal esconde por opacidade sob `scripting: enabled`, e nada revela o que
   * nunca entrou na janela. Medido em `/metodologia` recém-carregada: as SETE
   * entradas de reveal estavam com `opacity: 0`. Imprimir ali produzia um
   * documento com quase todo o conteúdo em branco, e nada na tela denunciava.
   *
   * É a regra 18 num terceiro disfarce: a primeira vez foi JavaScript ausente
   * (D-21), a segunda foi quadro de animação que não veio (D-39), e a terceira
   * é um meio que não rola. Por isso o teste mora aqui.
   */
  const print = /@media print\s*\{([\s\S]*)\}/.exec(base)?.[1] ?? "";

  it("existe uma folha de impressão", () => {
    expect(print.length, "sem @media print, a página imprime pela metade").toBeGreaterThan(200);
  });

  it("tudo que o reveal esconde volta a aparecer", () => {
    expect(print).toContain("[data-reveal]");
    // `!important` é obrigatório: a regra do reveal também é `opacity: 0` numa
    // media query, e sem ele a ordem de cascata decidiria por sorte.
    expect(print).toMatch(/opacity:\s*1\s*!important/);
    expect(print).toMatch(/transform:\s*none\s*!important/);
  });

  it("superfície escura recupera tinta escura", () => {
    // Em navy e ink o texto é osso. Sobre papel branco, osso é invisível: sem
    // isto, as seções escuras imprimiriam vazias mesmo estando reveladas.
    const i = print.indexOf('[data-surface="navy"]');
    expect(i, "sem regra para superfície escura na impressão").toBeGreaterThan(-1);
    const bloco = print.slice(i, print.indexOf("}", i));
    expect(bloco).toContain('[data-surface="ink"]');
    for (const token of [
      "--color-fg:",
      "--color-fg-muted:",
      "--color-fg-subtle:",
      "--color-accent:",
    ]) {
      expect(bloco, `${token} não é restaurado na impressão`).toContain(token);
    }
  });

  it("a superfície não pinta fundo no papel", () => {
    const i = print.indexOf("[data-surface] {");
    expect(i).toBeGreaterThan(-1);
    const bloco = print.slice(i, print.indexOf("}", i));
    expect(bloco).toContain("--color-canvas: transparent");
    expect(bloco, "grão, luz e costura são background-image").toContain("background-image: none");
  });
});
