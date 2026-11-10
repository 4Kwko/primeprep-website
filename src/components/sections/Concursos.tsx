import Link from "next/link";
import { concursos, forcaLabels } from "@/content/concursos";
import { LogEntry } from "@/components/layout/LogEntry";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Lozenge } from "@/components/decorative/Ornament";

/**
 * ENTRADA 02 — concursos atendidos.
 *
 * Não são quatro cartões clones. Cada concurso é uma LINHA DE ROTA: barra de cor
 * de contexto, sigla, nome por extenso em itálico editorial, e a ficha real
 * (idade, escolaridade, onde, o que cai). O leitor compara verticalmente, que é
 * exatamente a pergunta que ele traz — "qual desses serve para mim?".
 *
 * Desktop: grade de colunas alinhadas, lendo-se como tabela sem ser uma.
 * Mobile: empilha em pares rótulo/valor. Nunca scroll horizontal.
 *
 * Todo dado tem `verifiedAt: null`, então cada linha carrega o aviso de que é
 * referência e não substitui o edital.
 */
function Ficha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-label-caps text-[0.6875rem] text-fg-subtle">{rotulo}</dt>
      <dd className="mt-1 text-[length:var(--text-body-sm)]">{valor}</dd>
    </div>
  );
}

export function Concursos() {
  return (
    <section data-surface="bone" className="section">
      <div className="container-wide">
        <LogEntry numero="02" rotulo="Concursos">
          <Reveal>
            <h2 className="max-w-[20ch] text-[length:var(--text-h2)]">
              Quatro caminhos. O primeiro passo é saber qual é o seu.
            </h2>
            <p className="mt-6 max-w-[62ch] text-[length:var(--text-body-lg)] text-fg-muted">
              Cada escola tem idade, escolaridade, local e prova diferentes. A preparação muda
              conforme o alvo, e é possível preparar-se para mais de um no mesmo ano.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 flex flex-col gap-4">
            {concursos.map((c) => (
              <RevealItem as="li" key={c.slug}>
                <article
                  className="card-interactive card-surface p-6 sm:p-8"
                  style={{ ["--concurso" as string]: `var(${c.accentToken})` }}
                >
                  {/* O losango é o único portador de cor do cartão. Antes havia
                      também uma barra colorida na borda esquerda, o que duplicava
                      a mesma informação a 8px de distância: dois acentos no mesmo
                      objeto. A sigla ao lado mantém o significado em texto, então
                      a cor nunca informa sozinha. */}
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-10">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <Lozenge className="text-[0.875rem]" style={{ color: "var(--concurso)" }} />
                        <h3 className="text-inscription text-[1.25rem] text-fg">{c.sigla}</h3>
                      </div>
                      <p className="mt-2 text-editorial-italic text-[length:var(--text-body)] leading-snug text-fg-muted">
                        {c.nomeCompleto}
                      </p>
                      <p className="mt-3 text-label-caps text-[0.6875rem] text-fg-subtle">
                        {forcaLabels[c.forca]}
                      </p>
                    </div>

                    <div>
                      {c.resumo ? (
                        <p className="mb-6 max-w-[58ch] text-fg-muted">{c.resumo}</p>
                      ) : null}

                      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                        {c.faixaEtaria ? (
                          <Ficha rotulo="Idade" valor={c.faixaEtaria.valor} />
                        ) : null}
                        {c.escolaridade ? (
                          <Ficha rotulo="Escolaridade" valor={c.escolaridade.valor} />
                        ) : null}
                        {c.local ? <Ficha rotulo="Onde" valor={c.local.valor} /> : null}
                        {c.disciplinasProva ? (
                          <Ficha rotulo="Prova" valor={c.disciplinasProva.valor.join(", ")} />
                        ) : null}
                      </dl>
                    </div>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal>
            <p className="mt-8 max-w-[70ch] text-[length:var(--text-caption)] text-fg-subtle">
              Informações reunidas a partir de material institucional, para orientação inicial.
              Idade, escolaridade, local e conteúdo da prova mudam a cada edição. Confirme sempre no
              edital oficial vigente.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-10">
              <Link
                href="/concursos"
                data-touch-target
                className="link-filete inline-flex items-center gap-2.5 text-accent transition-colors duration-[var(--duration-fast)] hover:text-accent-hover"
              >
                <Lozenge className="text-[0.625rem]" />
                <span className="text-label-caps">Ver todos os concursos</span>
              </Link>

              {/* Para quem leu as quatro fichas e continua sem saber qual é o
                  seu, que é a situação mais comum de quem chega pelo Instagram. */}
              <Link
                href="/diagnostico"
                data-touch-target
                className="link-filete inline-flex items-center gap-2.5 text-accent transition-colors duration-[var(--duration-fast)] hover:text-accent-hover"
              >
                <Lozenge className="text-[0.625rem]" />
                <span className="text-label-caps">Descobrir qual é o meu</span>
              </Link>
            </div>
          </Reveal>
        </LogEntry>
      </div>
    </section>
  );
}
