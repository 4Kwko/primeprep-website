import type { Metadata } from "next";
import Link from "next/link";
import { disciplinas, professores } from "@/content/equipe";
import { PageHeader } from "@/components/layout/PageHeader";
import { LogEntry } from "@/components/layout/LogEntry";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Lozenge } from "@/components/decorative/Ornament";

export const metadata: Metadata = {
  title: "Professores",
  description:
    "Três professores para Matemática, Física, Português e Inglês. Quem dá a aula é quem corrige a redação e acompanha a planilha de desempenho.",
  alternates: { canonical: "/professores" },
  openGraph: {
    title: "Professores · Prime Prep",
    description: "Conheça quem ensina na Prime Prep.",
    url: "/professores",
  },
};

/**
 * ASSET PENDENTE: não há fotografias. O briefing proíbe banco de imagens e
 * rostos gerados, então o lugar do retrato é um monograma tipográfico.
 * PONTO DE SUBSTITUIÇÃO: trocar a div do monograma por `next/image` com
 * `aspect-[4/5]`. Ver docs/implementation/home.md § 9.
 */
function iniciais(nome: string) {
  const partes = nome.split(" ").filter((p) => p.length > 2);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? "") : "";
  return `${primeira}${ultima}`.toUpperCase();
}

export default function ProfessoresPage() {
  return (
    <>
      <PageHeader
        eyebrow="Quem ensina"
        titulo="Três professores. Quatro matérias. Nenhum intermediário."
        lead="Quem dá a aula é quem corrige a redação e quem acompanha a planilha. Numa estrutura pequena, o aluno sabe exatamente com quem está falando."
      />

      <section data-surface="bone" className="section">
        <div className="container-wide">
          <LogEntry numero="01" rotulo="O corpo docente">
            <RevealGroup as="ul" className="flex flex-col gap-6">
              {professores.map((p) => (
                <RevealItem as="li" key={p.slug}>
                  <article className="grid gap-7 card-surface p-6 sm:p-8 lg:grid-cols-[minmax(0,12rem)_1fr] lg:gap-12">
                    <div
                      aria-hidden
                      className="flex h-44 items-center justify-center rounded-[var(--radius-md)] border border-hairline bg-surface-sunken lg:h-full lg:min-h-52"
                    >
                      <span className="text-inscription text-[2.25rem] text-fg-subtle">
                        {iniciais(p.nome)}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-[length:var(--text-h3)] leading-snug">{p.nome}</h2>

                      <p className="mt-4 text-label-caps text-accent">
                        {p.disciplinas
                          .map((d) => disciplinas.find((x) => x.slug === d)?.nome)
                          .filter(Boolean)
                          .join(" · ")}
                      </p>

                      {p.papeis.length > 1 ? (
                        <p className="mt-2 text-[length:var(--text-body-sm)] text-fg-subtle">
                          {p.papeis.slice(1).join(" · ")}
                        </p>
                      ) : null}

                      <ul className="mt-6 flex flex-col gap-3 border-t border-hairline pt-6">
                        {p.credenciais.map((c) => (
                          <li key={c} className="flex items-baseline gap-3 text-fg-muted">
                            <Lozenge className="shrink-0 translate-y-[-1px] text-[0.5rem] text-accent" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          </LogEntry>
        </div>
      </section>

      <section data-surface="bone" className="section-sm">
        <div className="container-wide">
          <LogEntry numero="02" rotulo="Por que isso importa">
            <Reveal>
              <h2 className="max-w-[24ch] text-[length:var(--text-h3)]">
                Correção individual só existe em estrutura pequena.
              </h2>
              <p className="mt-6 max-w-[62ch] text-[length:var(--text-body-lg)] text-fg-muted">
                Corrigir questão, simulado e redação um a um, para cada aluno, é um limite de escala
                não de discurso. É por isso que um preparatório de turma grande não consegue
                prometer o mesmo sem mudar seu modelo.
              </p>
              <p className="mt-8">
                <Link
                  href="/metodologia"
                  data-touch-target
                  className="link-filete inline-flex items-center gap-2.5 text-label-caps text-accent transition-colors duration-[var(--duration-fast)] hover:text-accent-hover"
                >
                  <Lozenge className="text-[0.625rem]" />
                  Ver como funciona a preparação
                </Link>
              </p>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <CtaFinal
        titulo="Converse antes de decidir."
        lead="A coordenação administrativa atende pelo WhatsApp e conhece o trabalho de cada professor. Diga qual concurso você quer prestar e ela te situa."
        section="fechamento-professores"
      />
    </>
  );
}
