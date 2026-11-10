import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { concursos, concursosBySlug, forcaLabels } from "@/content/concursos";
import { disciplinas } from "@/content/equipe";
import { ciclo } from "@/content/metodologia";
import { PageHeader } from "@/components/layout/PageHeader";
import { LogEntry } from "@/components/layout/LogEntry";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Cta } from "@/components/ui/Cta";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Lozenge } from "@/components/decorative/Ornament";
import { DadosEstruturados } from "@/components/layout/DadosEstruturados";
import { trilha } from "@/lib/schema";

type Params = { slug: string };

/**
 * Só os quatro slugs de `concursos.ts` existem. Sem isto, o Next tenta renderizar
 * qualquer slug sob demanda, e o endpoint de imagem de uma rota inexistente
 * respondia 200 com o cartão genérico enquanto a página dela respondia 404.
 * Além da incoerência, cada slug inventado disparava uma renderização.
 */
export const dynamicParams = false;

/** As quatro páginas são pré-renderizadas no build a partir de concursos.ts. */
export function generateStaticParams(): Params[] {
  return concursos.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = concursosBySlug.get(slug);
  if (!c) return {};

  const descricao = c.resumo
    ? `${c.nomeCompleto}. ${c.resumo} Preparação em São Gabriel/RS com acompanhamento individual.`
    : `${c.nomeCompleto}. Preparação em São Gabriel/RS com acompanhamento individual.`;

  return {
    title: `${c.sigla}: ${c.nomeCompleto}`,
    description: descricao,
    alternates: { canonical: `/concursos/${c.slug}` },
    openGraph: {
      title: `${c.sigla} · Prime Prep`,
      description: descricao,
      url: `/concursos/${c.slug}`,
    },
  };
}

/** Uma linha da ficha técnica. Campo ausente simplesmente não é renderizado. */
function FichaItem({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="border-t border-hairline py-4">
      <dt className="text-label-caps text-[0.6875rem] text-fg-subtle">{rotulo}</dt>
      <dd className="mt-1.5 text-[length:var(--text-body)]">{valor}</dd>
    </div>
  );
}

export default async function ConcursoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = concursosBySlug.get(slug);
  if (!c) notFound();

  const cor = `var(${c.accentToken})`;

  // Disciplinas da prova que a Prime Prep ensina, e as que ficam por conta do aluno.
  const nossas = disciplinas.map((d) => d.nome);
  const daProva = c.disciplinasProva?.valor ?? [];
  const cobertas = daProva.filter((d) => nossas.includes(d));
  const naoCobertas = daProva.filter((d) => !nossas.includes(d));

  const temFicha = c.voceVira || c.faixaEtaria || c.escolaridade || c.local || c.remuneracaoInicial;

  return (
    <>
      {/* Trilha só aqui, onde existe profundidade de verdade. Uma trilha de dois
          níveis ("Início > Contato") não informa nada que a URL já não diga. */}
      <DadosEstruturados
        nos={[
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Concursos", caminho: "/concursos" },
            { nome: c.sigla, caminho: `/concursos/${c.slug}` },
          ]),
        ]}
      />

      <PageHeader
        eyebrow={c.sigla}
        marcadorCor={cor}
        titulo={<span className="text-editorial-italic">{c.nomeCompleto}</span>}
        {...(c.resumo ? { lead: c.resumo } : {})}
      >
        {/* A força e o CTA formam a coluna direita do cabeçalho em lg (ver
            PageHeader): as margens de topo só valem no empilhamento móvel. */}
        <p className="mt-8 text-label-caps text-fg-subtle lg:mt-0">{forcaLabels[c.forca]}</p>

        <div className="mt-8">
          <Cta
            intent="matricula"
            variant="primary"
            concurso={c}
            label={`Quero me preparar para a ${c.sigla}`}
            section="cabecalho-concurso"
          />
        </div>
      </PageHeader>

      {temFicha ? (
        <section data-surface="bone" className="section">
          <div className="container-wide">
            <LogEntry numero="01" rotulo="Ficha técnica">
              <Reveal>
                <h2 className="max-w-[20ch] text-[length:var(--text-h2)]">
                  O que a {c.sigla} exige, em números.
                </h2>

                <dl className="mt-10 grid gap-x-12 sm:grid-cols-2">
                  {c.voceVira ? <FichaItem rotulo="Você vira" valor={c.voceVira.valor} /> : null}
                  {c.faixaEtaria ? <FichaItem rotulo="Idade" valor={c.faixaEtaria.valor} /> : null}
                  {c.escolaridade ? (
                    <FichaItem rotulo="Escolaridade" valor={c.escolaridade.valor} />
                  ) : null}
                  {c.local ? <FichaItem rotulo="Onde" valor={c.local.valor} /> : null}
                  {c.remuneracaoInicial ? (
                    <FichaItem rotulo="Remuneração inicial" valor={c.remuneracaoInicial.valor} />
                  ) : null}
                </dl>

                <p className="mt-8 max-w-[70ch] border-t border-hairline pt-6 text-[length:var(--text-caption)] text-fg-subtle">
                  Dados reunidos a partir de material institucional, para orientação inicial. Eles
                  mudam a cada edição.{" "}
                  <strong className="font-semibold">
                    Confirme sempre no edital oficial vigente
                  </strong>
                  . A Prime Prep não é responsável pela realização do concurso.
                </p>
              </Reveal>
            </LogEntry>
          </div>
        </section>
      ) : null}

      {daProva.length > 0 ? (
        <section data-surface="bone" className="section">
          <div className="container-wide">
            <LogEntry numero="02" rotulo="A prova">
              <Reveal>
                <h2 className="max-w-[22ch] text-[length:var(--text-h2)]">
                  O que cai, e o que preparamos.
                </h2>
                <p className="mt-6 max-w-[62ch] text-[length:var(--text-body-lg)] text-fg-muted">
                  A prova da {c.sigla} cobra {daProva.length} frentes. A Prime Prep trabalha as
                  disciplinas do seu núcleo com professores dedicados a cada uma.
                </p>

                <ul className="mt-10 flex flex-col">
                  {daProva.map((d) => {
                    const coberta = cobertas.includes(d);
                    return (
                      <li
                        key={d}
                        className="flex items-center gap-4 border-t border-hairline py-4 last:border-b"
                      >
                        <Lozenge
                          className="shrink-0 text-[0.625rem]"
                          style={{ color: coberta ? cor : "var(--color-border-strong)" }}
                        />
                        <span className="text-[length:var(--text-body)]">{d}</span>
                        <span className="ml-auto text-label-caps text-[0.625rem] text-fg-subtle">
                          {coberta ? "Aula na Prime Prep" : "Conteúdo do edital"}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {naoCobertas.length > 0 ? (
                  <p className="mt-6 max-w-[66ch] text-[length:var(--text-caption)] text-fg-subtle">
                    {naoCobertas.join(", ")} {naoCobertas.length === 1 ? "consta" : "constam"} no
                    edital da {c.sigla} e não
                    {naoCobertas.length === 1 ? " está" : " estão"} entre as quatro disciplinas do
                    corpo docente atual. Fale com a gente para entender como isso entra no seu
                    plano.
                  </p>
                ) : null}
              </Reveal>
            </LogEntry>
          </div>
        </section>
      ) : null}

      <section data-surface="navy" className="section">
        <div className="container-wide">
          <LogEntry numero="03" rotulo="A preparação">
            <Reveal>
              <h2 className="max-w-[22ch] text-[length:var(--text-h2)]">
                Como é preparar-se para a {c.sigla} aqui.
              </h2>
              <p className="mt-6 max-w-[62ch] text-[length:var(--text-body-lg)] text-fg-muted">
                O mesmo ciclo vale para todos os concursos; o que muda é o alvo. Sua planilha de
                desempenho é montada em cima do que a {c.sigla} cobra.
              </p>
            </Reveal>

            <RevealGroup as="ol" className="mt-12 flex flex-col">
              {ciclo.map((etapa, i) => (
                <RevealItem
                  as="li"
                  key={etapa.momento}
                  className="relative grid gap-3 border-l border-border pb-10 pl-8 last:pb-0 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-8"
                >
                  <span aria-hidden className="absolute top-1.5 left-0 h-px w-4 bg-accent sm:w-6" />
                  <div>
                    <span className="text-inscription text-[0.8125rem] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-2 text-label-caps text-fg-subtle">{etapa.momento}</p>
                  </div>
                  <div>
                    <h3 className="text-[length:var(--text-h4)] leading-snug">{etapa.titulo}</h3>
                    <p className="mt-3 max-w-[58ch] text-fg-muted">{etapa.corpo}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal className="mt-10">
              <Link
                href="/metodologia"
                data-touch-target
                className="link-filete inline-flex items-center gap-2.5 text-label-caps text-accent transition-colors duration-[var(--duration-fast)] hover:text-accent-hover"
              >
                <Lozenge className="text-[0.625rem]" />
                Ver a metodologia completa
              </Link>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <section data-surface="bone" className="section-sm">
        <div className="container-wide">
          <LogEntry numero="04" rotulo="Outros concursos">
            <Reveal>
              <p className="max-w-[58ch] text-fg-muted">
                Ainda em dúvida? Dá para preparar-se para mais de um concurso dentro do mesmo ciclo.
              </p>
              <ul className="mt-6 flex flex-wrap gap-3">
                {concursos
                  .filter((o) => o.slug !== c.slug)
                  .map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/concursos/${o.slug}`}
                        data-touch-target
                        className="inline-flex card-interactive items-center gap-2.5 card-surface px-4 py-3 text-label-caps"
                      >
                        <Lozenge
                          className="text-[0.5rem]"
                          style={{ color: `var(${o.accentToken})` }}
                        />
                        {o.sigla}
                      </Link>
                    </li>
                  ))}
              </ul>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <CtaFinal
        titulo={`Vamos montar seu plano para a ${c.sigla}.`}
        lead={`Conte em que ponto você está: se já estudou, se está começando agora, quanto tempo falta para a prova. A partir daí a preparação é desenhada em cima do que a ${c.sigla} cobra.`}
        concurso={c}
        labelPrimario={`Quero me preparar para a ${c.sigla}`}
        section={`fechamento-${c.slug}`}
      />
    </>
  );
}
