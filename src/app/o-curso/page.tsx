import type { Metadata } from "next";
import Link from "next/link";
import { concursos } from "@/content/concursos";
import { disciplinas, professores } from "@/content/equipe";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { LogEntry } from "@/components/layout/LogEntry";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Lozenge } from "@/components/decorative/Ornament";

export const metadata: Metadata = {
  title: "O curso",
  description:
    "Curso preparatório para concursos militares em São Gabriel/RS, com acompanhamento individual, planilha de desempenho por aluno e correção individual de questões, simulados e redações.",
  alternates: { canonical: "/o-curso" },
  openGraph: {
    title: "O curso · Prime Prep",
    description: "Quem é a Prime Prep e como ela prepara para concursos militares.",
    url: "/o-curso",
  },
};

/**
 * PÁGINA INSTITUCIONAL.
 *
 * Não existe história fundacional, ano de fundação, número de alunos, estrutura
 * física descrita nem qualquer resultado fornecido pelo cliente — e nada disso
 * pode ser inventado. A página se sustenta sobre o que É verificável: o
 * posicionamento, o mecanismo, o escopo e a equipe.
 */
export default function OCursoPage() {
  return (
    <>
      <PageHeader
        eyebrow="O curso"
        titulo="Preparação militar com nome e sobrenome de cada aluno."
        lead={`A Prime Prep é um curso preparatório especializado em concursos militares, em ${site.city}/${site.state}. Não é um cursinho generalista que também atende quem quer farda: é preparação dirigida a EsPCEx, AFA, EEAR e EFOMM.`}
      />

      <section data-surface="bone" className="section">
        <div className="container-wide">
          <LogEntry numero="01" rotulo="O que fazemos">
            <Reveal>
              <h2 className="max-w-[22ch] text-[length:var(--text-h2)]">
                Especialização é o ponto de partida, não um detalhe.
              </h2>
              <div className="mt-8 flex max-w-[62ch] flex-col gap-5 text-[length:var(--text-body-lg)] text-fg-muted">
                <p>
                  Concurso militar tem banca própria, calendário próprio e exigências que não são as
                  do vestibular. Preparar-se para a EEAR não é a mesma coisa que preparar-se para a
                  AFA, e nenhuma das duas é a mesma coisa que prestar ENEM.
                </p>
                <p>
                  A Prime Prep trabalha só esse recorte. As quatro disciplinas do corpo docente
                  (Matemática, Física, Português e Inglês) são as que sustentam as provas dos quatro
                  concursos atendidos.
                </p>
                <p>
                  É também por isso que dá para preparar-se para mais de um concurso dentro do mesmo
                  ciclo anual: o núcleo é comum, o que muda é a ênfase.
                </p>
              </div>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <section data-surface="navy" className="section">
        <div className="container-wide">
          {/* Esta seção NÃO repete o bloco de credibilidade da Home nem o ciclo de
              /metodologia. O mecanismo já é contado nos dois; aqui o assunto é
              quem está do outro lado — verdade de produto confirmada em
              PRODUCT.md § Users, e a única coisa que só esta página pode dizer. */}
          <LogEntry numero="02" rotulo="Para quem é">
            <Reveal>
              <h2 className="max-w-[24ch] text-[length:var(--text-h2)]">
                Duas pessoas decidem isso, e elas perguntam coisas diferentes.
              </h2>
              <p className="mt-6 max-w-[62ch] text-[length:var(--text-body-lg)] text-fg-muted">
                Quase sempre é o aluno que traz o assunto para casa e o responsável que fecha. As
                duas conversas são legítimas e a gente atende as duas.
              </p>
            </Reveal>

            <RevealGroup as="ul" className="mt-12 grid gap-6 lg:grid-cols-2">
              {[
                {
                  quem: "Para o aluno",
                  t: "Qual concurso serve para mim?",
                  d: "Entre EsPCEx, AFA, EEAR e EFOMM as carreiras são diferentes: oficial, sargento, aviação, mar. O primeiro trabalho é escolher o alvo; o segundo é montar a rotina que chega lá.",
                  href: "/concursos",
                  link: "Comparar os concursos",
                },
                {
                  quem: "Para o responsável",
                  t: "Como eu sei que está funcionando?",
                  d: "Pela planilha individual de desempenho do aluno. Ela existe desde o primeiro simulado e é o que transforma a conversa sobre o filho em fato registrado, não em impressão.",
                  href: "/metodologia",
                  link: "Ver como é medido",
                },
              ].map((item) => (
                <RevealItem as="li" key={item.quem} className="h-full">
                  <article className="flex h-full flex-col border-t border-border pt-7">
                    <p className="text-label-caps text-accent">{item.quem}</p>
                    <h3 className="mt-4 text-[length:var(--text-h4)] leading-snug">{item.t}</h3>
                    <p className="mt-4 max-w-[52ch] text-fg-muted">{item.d}</p>
                    <p className="mt-6">
                      <Link
                        href={item.href}
                        data-touch-target
                        className="link-filete inline-flex items-center gap-2.5 text-label-caps transition-colors duration-[var(--duration-fast)] hover:text-accent"
                      >
                        <Lozenge className="text-[0.5rem] text-accent" />
                        {item.link}
                      </Link>
                    </p>
                  </article>
                </RevealItem>
              ))}
            </RevealGroup>
          </LogEntry>
        </div>
      </section>

      <section data-surface="bone" className="section">
        <div className="container-wide">
          <LogEntry numero="03" rotulo="Escopo">
            <Reveal>
              <h2 className="max-w-[22ch] text-[length:var(--text-h2)]">
                O que está no alcance do curso.
              </h2>

              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div>
                  <h3 className="text-label-caps text-fg-subtle">Concursos atendidos</h3>
                  <ul className="mt-5 flex flex-col">
                    {concursos.map((c) => (
                      <li key={c.slug} className="border-t border-hairline last:border-b">
                        <Link
                          href={`/concursos/${c.slug}`}
                          data-touch-target
                          className="flex items-baseline gap-3 py-3.5 transition-colors duration-[var(--duration-fast)] hover:text-accent"
                        >
                          <Lozenge
                            className="shrink-0 text-[0.5625rem]"
                            style={{ color: `var(${c.accentToken})` }}
                          />
                          <span className="text-inscription text-[0.9375rem]">{c.sigla}</span>
                          <span className="ml-auto text-right text-editorial-italic text-[length:var(--text-body-sm)] leading-snug text-fg-subtle">
                            {c.nomeCompleto}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-label-caps text-fg-subtle">Disciplinas</h3>
                  <ul className="mt-5 flex flex-col">
                    {disciplinas.map((d) => {
                      const quem = professores
                        .filter((p) => p.disciplinas.includes(d.slug))
                        .map((p) => p.nome.split(" ").slice(0, 2).join(" "));
                      return (
                        <li
                          key={d.slug}
                          className="flex items-baseline gap-3 border-t border-hairline py-3.5 last:border-b"
                        >
                          <Lozenge className="shrink-0 text-[0.5rem] text-accent" />
                          <span>{d.nome}</span>
                          <span className="ml-auto text-[length:var(--text-caption)] text-fg-subtle">
                            {quem.join(", ")}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <p className="mt-10 max-w-[66ch] text-[length:var(--text-caption)] text-fg-subtle">
                Curso presencial em {site.city}/{site.state}. Endereço, horários e valores são
                informados no atendimento.
              </p>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <CtaFinal
        titulo="A melhor forma de conhecer é perguntar."
        lead="Horários, turmas, valores e o que mais você precisar saber: a coordenação responde direto pelo WhatsApp."
        section="fechamento-o-curso"
      />
    </>
  );
}
