import type { Metadata } from "next";
import Link from "next/link";
import { ciclo } from "@/content/metodologia";
import { diferenciais } from "@/content/diferenciais";
import { disciplinas } from "@/content/equipe";
import { PageHeader } from "@/components/layout/PageHeader";
import { LogEntry } from "@/components/layout/LogEntry";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Lozenge } from "@/components/decorative/Ornament";
import { IconeDiferencial } from "@/components/decorative/IconeDiferencial";

export const metadata: Metadata = {
  title: "Metodologia: acompanhamento individual medido",
  description:
    "Planilha individual de desempenho, correção individual de questões, simulados e redações, e reforço quando o resultado pede. Como funciona a preparação da Prime Prep.",
  alternates: { canonical: "/metodologia" },
  openGraph: {
    title: "Metodologia · Prime Prep",
    description: "Um ciclo de medir, corrigir e ajustar, com uma planilha de desempenho por aluno.",
    url: "/metodologia",
  },
};

export default function MetodologiaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Metodologia"
        titulo="Preparação que se mede, não que se promete."
        lead="Todo preparatório diz que acompanha o aluno de perto. A diferença está em conseguir mostrar onde isso acontece, e o que muda quando o número cai."
      />

      <section data-surface="bone" className="section">
        <div className="container-wide">
          <LogEntry numero="01" rotulo="O ciclo">
            <Reveal>
              <h2 className="max-w-[22ch] text-[length:var(--text-h2)]">
                Medir, corrigir, ajustar e repetir até a prova.
              </h2>
              <p className="mt-6 max-w-[62ch] text-[length:var(--text-body-lg)] text-fg-muted">
                O ano não é uma sequência de aulas até acabar o conteúdo. É um ciclo que volta ao
                começo com informação nova a cada volta.
              </p>
            </Reveal>

            <RevealGroup as="ol" className="mt-14 flex flex-col">
              {ciclo.map((etapa, i) => (
                <RevealItem
                  as="li"
                  key={etapa.momento}
                  className="relative grid gap-4 border-l border-border pb-14 pl-8 last:pb-0 lg:grid-cols-[minmax(0,12rem)_1fr] lg:gap-10 lg:pl-10"
                >
                  <span aria-hidden className="absolute top-1.5 left-0 h-px w-4 bg-accent lg:w-6" />

                  <div>
                    <span className="text-inscription text-[0.8125rem] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-2 text-label-caps text-fg-subtle">{etapa.momento}</p>
                  </div>

                  <div>
                    <h3 className="text-[length:var(--text-h3)] leading-snug">{etapa.titulo}</h3>
                    <p className="mt-4 max-w-[60ch] text-[length:var(--text-body-lg)] text-fg-muted">
                      {etapa.corpo}
                    </p>

                    <ul className="mt-6 flex flex-col gap-3">
                      {etapa.detalhe.map((d) => (
                        <li key={d} className="flex items-baseline gap-3 text-fg-muted">
                          <Lozenge className="shrink-0 translate-y-[-1px] text-[0.5rem] text-accent" />
                          <span className="max-w-[60ch]">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </LogEntry>
        </div>
      </section>

      <section data-surface="navy" className="section">
        <div className="container-wide">
          <LogEntry numero="02" rotulo="A planilha">
            <Reveal>
              <h2 className="max-w-[22ch] text-[length:var(--text-h2)]">
                O documento que sustenta tudo o resto.
              </h2>
              <div className="mt-8 flex max-w-[62ch] flex-col gap-5 text-[length:var(--text-body-lg)] text-fg-muted">
                <p>
                  Cada aluno tem uma planilha individual de desempenho. Ela começa no primeiro
                  simulado e acompanha o ano inteiro.
                </p>
                <p>
                  É ela que torna o acompanhamento verificável: dá para ver em que disciplina o
                  aluno avançou, onde estagnou e quando o reforço passou a ser necessário. Sem ela,
                  &ldquo;acompanhamento individual&rdquo; é só uma frase.
                </p>
                <p>
                  É também o que permite conversar com o responsável sobre fatos, e não sobre
                  impressões.
                </p>
              </div>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <section data-surface="bone" className="section">
        <div className="container-wide">
          <LogEntry numero="03" rotulo="O que está incluído">
            <Reveal>
              <h2 className="max-w-[22ch] text-[length:var(--text-h2)]">
                Tudo isso faz parte da preparação.
              </h2>
            </Reveal>

            <RevealGroup as="ul" className="mt-10 grid gap-x-12 sm:grid-cols-2">
              {diferenciais.map((d) => {
                return (
                  <RevealItem
                    as="li"
                    key={d.slug}
                    className="flex items-start gap-4 border-b border-hairline py-5"
                  >
                    <IconeDiferencial nome={d.icone} className="mt-0.5 shrink-0 text-accent" />
                    <div className="min-w-0">
                      <h3 className="font-medium">{d.titulo}</h3>
                      <p className="mt-1.5 text-[length:var(--text-body-sm)] text-fg-subtle">
                        {d.descricao}
                      </p>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </LogEntry>
        </div>
      </section>

      <section data-surface="bone" className="section-sm">
        <div className="container-wide">
          <LogEntry numero="04" rotulo="As disciplinas">
            <Reveal>
              <h2 className="max-w-[24ch] text-[length:var(--text-h3)]">
                Quatro disciplinas, professores dedicados a cada uma.
              </h2>
              <ul className="mt-8 flex flex-wrap gap-3">
                {disciplinas.map((d) => (
                  <li
                    key={d.slug}
                    className="inline-flex items-center gap-2.5 card-surface px-4 py-3 text-label-caps"
                  >
                    <Lozenge className="text-[0.5rem] text-accent" />
                    {d.nome}
                  </li>
                ))}
              </ul>
              <p className="mt-8">
                <Link
                  href="/professores"
                  data-touch-target
                  className="link-filete inline-flex items-center gap-2.5 text-label-caps text-accent transition-colors duration-[var(--duration-fast)] hover:text-accent-hover"
                >
                  <Lozenge className="text-[0.625rem]" />
                  Conhecer quem ensina
                </Link>
              </p>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <CtaFinal
        titulo="Quer ver isso aplicado ao seu caso?"
        lead="O ciclo é o mesmo para todo mundo; o que ele mede é só seu. Comece dizendo onde você está hoje."
        section="fechamento-metodologia"
      />
    </>
  );
}
