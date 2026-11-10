import type { Metadata } from "next";
import Link from "next/link";
import { concursos, forcaLabels } from "@/content/concursos";
import { disciplinas } from "@/content/equipe";
import { PageHeader } from "@/components/layout/PageHeader";
import { LogEntry } from "@/components/layout/LogEntry";
import { TabelaConcursos } from "@/components/sections/TabelaConcursos";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Lozenge } from "@/components/decorative/Ornament";

export const metadata: Metadata = {
  title: "Concursos militares: EsPCEx, AFA, EEAR e EFOMM",
  description:
    "Compare EsPCEx, AFA, EEAR e EFOMM: cargo, idade, escolaridade, local e disciplinas cobradas. Preparação em São Gabriel/RS.",
  alternates: { canonical: "/concursos" },
  openGraph: {
    title: "Concursos militares atendidos · Prime Prep",
    description: "Compare EsPCEx, AFA, EEAR e EFOMM lado a lado e descubra qual serve para você.",
    url: "/concursos",
  },
};

export default function ConcursosPage() {
  return (
    <>
      {/* Único cabeçalho com quatro marcadores: esta é a página cujo assunto é
          o conjunto, e as quatro cores de força anunciam isso antes do título.
          Nas páginas de concurso o marcador é um só, na cor daquela força. */}
      <PageHeader
        eyebrow="Concursos"
        marcadores={concursos.map((c) => `var(${c.accentToken})`)}
        titulo="Quatro caminhos para a carreira militar."
        lead="Cada escola forma um profissional diferente, com idade, escolaridade e prova próprias. Compare os quatro e descubra qual é o seu. Depois entre na página do concurso para ver a preparação em detalhe."
      >
        {/* Comparar cinco colunas exige saber o que comparar. Quem chega sem
            saber precisa de uma porta antes da tabela, e é ela que ocupa a
            coluna direita do cabeçalho aqui. */}
        <div className="mt-9 lg:mt-0">
          <p className="max-w-[30ch] text-[length:var(--text-body-sm)] text-fg-muted">
            Ainda não sabe por onde começar?
          </p>
          <Link href="/diagnostico" data-touch-target className="mt-4 btn-base btn-secondary">
            Responder quatro perguntas
          </Link>
        </div>
      </PageHeader>

      <section data-surface="bone" className="section">
        <div className="container-wide">
          <LogEntry numero="01" rotulo="Comparativo">
            <Reveal>
              <h2 className="max-w-[20ch] text-[length:var(--text-h2)]">
                Lado a lado, a escolha fica mais simples.
              </h2>
              <p className="mt-6 mb-12 max-w-[62ch] text-[length:var(--text-body-lg)] text-fg-muted">
                A diferença entre as escolas não é de dificuldade, é de destino. Comece por onde
                você quer chegar.
              </p>
            </Reveal>

            <TabelaConcursos />
          </LogEntry>
        </div>
      </section>

      <section data-surface="navy" className="section">
        <div className="container-wide">
          <LogEntry numero="02" rotulo="As escolas">
            <Reveal>
              <h2 className="max-w-[22ch] text-[length:var(--text-h2)]">
                O que cada uma forma, e o que cada uma cobra.
              </h2>
            </Reveal>

            <RevealGroup as="ul" className="mt-12 grid gap-5 lg:grid-cols-2">
              {concursos.map((c) => (
                <RevealItem as="li" key={c.slug} className="h-full">
                  <Link
                    href={`/concursos/${c.slug}`}
                    data-touch-target
                    className="flex h-full card-interactive flex-col card-surface p-6 sm:p-7"
                    style={{ ["--concurso" as string]: `var(${c.accentToken})` }}
                  >
                    <span className="flex items-center gap-2.5">
                      <Lozenge className="text-[0.875rem]" style={{ color: "var(--concurso)" }} />
                      <h3 className="text-inscription text-[1.25rem] text-fg">{c.sigla}</h3>
                      <span className="ml-auto text-label-caps text-[0.625rem] text-fg-subtle">
                        {forcaLabels[c.forca]}
                      </span>
                    </span>

                    <p className="mt-2.5 text-editorial-italic text-[length:var(--text-body)] leading-snug text-fg-muted">
                      {c.nomeCompleto}
                    </p>

                    {c.resumo ? (
                      <p className="mt-4 text-[length:var(--text-body-sm)] text-fg-muted">
                        {c.resumo}
                      </p>
                    ) : null}

                    {c.disciplinasProva ? (
                      <p className="mt-5 border-t border-hairline pt-4 text-[length:var(--text-body-sm)] text-fg-subtle">
                        <span className="text-label-caps text-[0.625rem]">Prova</span>
                        <br />
                        {c.disciplinasProva.valor.join(" · ")}
                      </p>
                    ) : null}

                    <span className="mt-6 inline-flex items-center gap-2 text-label-caps text-accent">
                      <Lozenge className="text-[0.5rem]" />
                      Ver a preparação para {c.sigla}
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </LogEntry>
        </div>
      </section>

      <section data-surface="bone" className="section-sm">
        <div className="container-wide">
          <LogEntry numero="03" rotulo="O que estudamos">
            <Reveal>
              <h2 className="max-w-[24ch] text-[length:var(--text-h3)]">
                Quatro disciplinas cobrem as quatro provas.
              </h2>
              <p className="mt-5 max-w-[58ch] text-fg-muted">
                As bancas variam na ênfase, não no núcleo. É por isso que dá para preparar-se para
                mais de um concurso dentro do mesmo ciclo.
              </p>

              <ul className="mt-8 flex flex-wrap gap-3">
                {disciplinas.map((d) => (
                  <li
                    key={d.slug}
                    className="inline-flex items-center gap-2.5 rounded-[var(--radius-sm)] border border-border px-4 py-2.5 text-label-caps"
                  >
                    <Lozenge className="text-[0.5rem] text-accent" />
                    {d.nome}
                  </li>
                ))}
              </ul>

              <p className="mt-8">
                <Link
                  href="/metodologia"
                  data-touch-target
                  className="link-filete inline-flex items-center gap-2.5 text-label-caps text-accent transition-colors duration-[var(--duration-fast)] hover:text-accent-hover"
                >
                  <Lozenge className="text-[0.625rem]" />
                  Como funciona a preparação
                </Link>
              </p>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <CtaFinal
        titulo="Já sabe qual é o seu?"
        lead="Se ainda estiver em dúvida entre dois, melhor ainda: dá para preparar-se para os dois no mesmo ano. Conte seu caso."
      />
    </>
  );
}
