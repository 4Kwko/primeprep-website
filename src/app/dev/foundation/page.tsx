import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { concursos } from "@/content/concursos";

/**
 * FOLHA DE REFERÊNCIA DO DESIGN SYSTEM — ferramenta interna, não é página do site.
 * Serve para inspecionar tokens visualmente.
 *
 * NÃO EXISTE EM PRODUÇÃO. Antes ela dependia de alguém lembrar de apagá-la antes
 * do deploy, o que é o tipo de pendência que sobrevive ao lançamento: estava
 * `noindex` e fora do sitemap, mas continuava servida a quem digitasse a URL, e
 * uma folha de tokens exposta é a estrutura interna do projeto à mostra.
 *
 * Agora ela some sozinha. `notFound()` devolve o 404 normal do site, que é a
 * resposta honesta: em produção esta página realmente não existe. Para inspecioná-la
 * num ambiente publicado (uma prévia, por exemplo), basta `NEXT_PUBLIC_MOSTRAR_DEV=true`.
 */
const mostrarDev =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_MOSTRAR_DEV === "true";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const surfaces = ["bone", "navy", "ink"] as const;

const semanticColors = [
  "canvas",
  "surface",
  "fg",
  "fg-muted",
  "border",
  "primary",
  "accent",
] as const;

const typeScale = [
  ["display", "--text-display"],
  ["h1", "--text-h1"],
  ["h2", "--text-h2"],
  ["h3", "--text-h3"],
  ["body-lg", "--text-body-lg"],
  ["body", "--text-body"],
  ["label", "--text-label"],
] as const;

export default function FoundationPage() {
  if (!mostrarDev) notFound();

  return (
    <div>
      {surfaces.map((surface) => (
        <section key={surface} data-surface={surface} className="section">
          <div className="container-wide">
            <p className="text-inscription text-accent">Superfície</p>
            <h2 className="mt-3 text-[length:var(--text-h2)]">{surface}</h2>
            <div className="my-8 rule-ornament" />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {semanticColors.map((name) => (
                <div key={name} className="card-interactive card-surface p-3">
                  <div
                    className="h-14 w-full rounded-[var(--radius-sm)] border border-border"
                    style={{ background: `var(--color-${name})` }}
                  />
                  <p className="mt-2 text-[length:var(--text-caption)] text-fg-muted">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section data-surface="bone" className="texture-linen section">
        <div className="container-content">
          <p className="text-inscription text-accent">Escala tipográfica</p>
          <div className="my-8 rule-ornament" />
          <div className="space-y-6">
            {typeScale.map(([name, token]) => (
              <div key={name} className="border-b border-hairline pb-4">
                <p className="text-[length:var(--text-caption)] text-fg-subtle">{name}</p>
                <p
                  className="font-[family-name:var(--font-display)]"
                  style={{ fontSize: `var(${token})`, lineHeight: 1.15 }}
                >
                  Disciplina e desempenho
                </p>
              </div>
            ))}
            <p className="text-editorial-italic text-[length:var(--text-body-lg)]">
              Escola de Formação de Oficiais da Marinha Mercante
            </p>
          </div>
        </div>
      </section>

      <section data-surface="navy" className="section">
        <div className="container-wide">
          <p className="text-inscription text-accent">Cores de contexto por concurso</p>
          <div className="my-8 rule-ornament" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {concursos.map((c) => (
              <li key={c.slug} className="card-interactive card-surface p-5">
                <span
                  className="mark-lozenge text-[1.25rem]"
                  style={{ color: `var(${c.accentToken})` }}
                />
                <p className="mt-3 text-inscription">{c.sigla}</p>
                <p className="mt-1 text-editorial-italic text-[length:var(--text-body-sm)] text-fg-muted">
                  {c.nomeCompleto}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
