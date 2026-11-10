import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { site } from "@/lib/site";

/**
 * Fica em `src/tests/` e não colocado ao lado do arquivo porque `src/app/` é a
 * árvore de rotas: um `.test.tsx` ali seria varrido pelo build do Next junto com
 * as páginas. Os testes de conteúdo ficam colocados; só os de `app/` saem.
 *
 * A tela de erro global é a mais difícil de exercitar de verdade, porque exige
 * derrubar o layout raiz. Foi tentado: o Next recusa subir um segundo servidor de
 * desenvolvimento para o mesmo projeto, e a build estática nem reexecuta o layout
 * em tempo de requisição. Então o que dá para garantir é o CONTRATO da marcação,
 * que é justamente onde ela pode falhar em silêncio: sem `<html>` próprio ela não
 * renderiza, sem as variáveis de fonte sai em Times New Roman (D-22), e sem o
 * link de WhatsApp a pessoa fica sem saída num momento em que o site caiu.
 *
 * `next/font/google` precisa de mock porque é uma transformação de BUILD: fora do
 * compilador do Next, `Cinzel` não é função nenhuma. O mock devolve a mesma forma
 * que o carregador real devolve, então o que o teste verifica continua sendo o
 * caminho real das variáveis de fonte até a tag `<html>`.
 */
vi.mock("next/font/google", () => {
  const carregador = (nome: string) => () => ({
    variable: `--font-${nome.toLowerCase()}-mock ${nome.toLowerCase()}-variable`,
    className: `${nome.toLowerCase()}-class`,
    style: { fontFamily: nome },
  });
  return {
    Cinzel: carregador("Cinzel"),
    Fraunces: carregador("Fraunces"),
    Inter: carregador("Inter"),
  };
});

const { default: GlobalError } = await import("@/app/global-error");

const html = renderToStaticMarkup(
  <GlobalError
    error={Object.assign(new Error("mensagem interna que nao pode vazar"), { digest: "abc123" })}
    reset={() => {}}
  />,
);

const semTags = html.replace(/<[^>]*>/g, " ");

describe("global-error: o último recurso", () => {
  it("renderiza o próprio documento, porque não há layout acima dele", () => {
    expect(html).toMatch(/<html[^>]*>/);
    expect(html).toContain("<body>");
    expect(html).toMatch(/<main[^>]*>/);
    expect(html).toMatch(/<h1[^>]*>/);
  });

  it("declara idioma e superfície no <html>", () => {
    expect(html).toMatch(new RegExp(`<html[^>]*lang="${site.locale}"`));
    expect(html).toMatch(/<html[^>]*data-surface="navy"/);
  });

  it("leva as variáveis de fonte no <html>, não no <body> (D-22)", () => {
    const abertura = html.slice(0, html.indexOf(">") + 1);
    for (const familia of ["cinzel", "fraunces", "inter"]) {
      expect(abertura.toLowerCase(), `${familia} ausente na tag <html>`).toContain(familia);
    }
    // E não podem estar no body, que é onde quebram em silêncio.
    const corpo = html.slice(html.indexOf("<body"), html.indexOf(">", html.indexOf("<body")) + 1);
    expect(corpo).not.toMatch(/fraunces/i);
  });

  it("oferece as duas saídas: recarregar e WhatsApp", () => {
    expect(html).toContain("Recarregar");
    expect(html).toContain(`wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(semTags).toMatch(/abre em nova aba/i);
  });

  it("mostra o digest, selecionável, e não vaza a mensagem do erro", () => {
    expect(html).toMatch(/data-selecionavel[^>]*>abc123/);
    expect(html, "mensagem de exceção nunca vai para a tela").not.toContain(
      "mensagem interna que nao pode vazar",
    );
  });

  it("não usa travessão na copy (D-32)", () => {
    expect(semTags).not.toMatch(/[—–]/);
  });

  it("não depende de componente do site", () => {
    // Um componente quebrado pode ter sido a causa da queda. A tela de erro que
    // o importasse cairia junto, e o visitante ficaria sem nada.
    const fonte = readFileSync("src/app/global-error.tsx", "utf8");
    const imports = [...fonte.matchAll(/^import[^;]*from\s+"([^"]+)"/gm)].map((m) => m[1]!);
    expect(imports.length).toBeGreaterThan(0);
    for (const i of imports) {
      expect(i, `global-error importa ${i}`).not.toMatch(/@\/components/);
    }
  });
});

describe("error: a fronteira da árvore de rotas", () => {
  const fonte = readFileSync("src/app/error.tsx", "utf8");

  it("é componente cliente, como o App Router exige", () => {
    expect(fonte.trimStart().startsWith('"use client"')).toBe(true);
  });

  it("usa `reset` e oferece o WhatsApp como segunda saída", () => {
    expect(fonte).toMatch(/onClick=\{reset\}/);
    expect(fonte).toMatch(/intent="whatsapp"/);
  });

  it("registra o erro em algum lugar, em vez de engoli-lo", () => {
    expect(fonte).toMatch(/console\.error/);
  });

  it("não imprime a mensagem nem a pilha do erro na tela", () => {
    // `error.message` e `error.stack` podem carregar caminho de arquivo. Só o
    // `digest` vai para a tela, porque é curto e serve para achar no log.
    expect(fonte).not.toMatch(/\{\s*error\.message\s*\}/);
    expect(fonte).not.toMatch(/\{\s*error\.stack\s*\}/);
    expect(fonte).toMatch(/error\.digest/);
  });
});
