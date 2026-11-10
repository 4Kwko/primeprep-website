import { ciclo } from "@/content/metodologia";
import { diferenciais } from "@/content/diferenciais";
import { LogEntry } from "@/components/layout/LogEntry";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { IconeDiferencial } from "@/components/decorative/IconeDiferencial";

/**
 * ENTRADA 03 — metodologia.
 *
 * O briefing pede explicitamente para NÃO virar uma grade de seis cartões com
 * ícone. A seção é narrativa e processual: o ciclo de estudo contado em quatro
 * momentos encadeados, para que a pessoa entenda como SERIA estudar aqui.
 *
 * A lista de diferenciais entra depois, como "o que está incluído" — uma lista
 * com filete, não cartões. Os ícones aparecem uma vez, em escala pequena, e cada
 * um carrega significado (bússola = rumo individual, régua = planilha de
 * desempenho); nenhum é enfeite de preenchimento.
 */

export function Metodologia() {
  return (
    <section data-surface="navy" className="section">
      <div className="container-wide">
        <LogEntry numero="03" rotulo="Metodologia">
          <Reveal>
            <h2 className="max-w-[20ch] text-[length:var(--text-h2)]">
              Um ciclo que se repete até a prova e se corrige a cada volta.
            </h2>
            <p className="mt-6 max-w-[62ch] text-[length:var(--text-body-lg)] text-fg-muted">
              Estudar na Prime Prep é ter posição conhecida o tempo todo. O ano não é uma sequência
              de aulas: é um ciclo de medir, corrigir e ajustar.
            </p>
          </Reveal>

          {/* Ciclo: linha vertical com marcos numerados. Narrativa, não grade. */}
          <RevealGroup as="ol" className="mt-14 flex flex-col">
            {ciclo.map((etapa, i) => (
              <RevealItem
                as="li"
                key={etapa.momento}
                className="relative grid gap-3 border-l border-border pb-12 pl-8 last:pb-0 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-8 sm:pl-10"
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

          {/* O que está incluído — lista com filete, não cartões. */}
          <Reveal className="mt-16">
            <h3 className="text-label-caps text-fg-subtle">O que está incluído</h3>
            <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
              {diferenciais.map((d) => {
                return (
                  <li key={d.slug} className="flex items-start gap-4 border-b border-hairline py-4">
                    <IconeDiferencial nome={d.icone} className="mt-0.5 shrink-0 text-accent" />
                    <div className="min-w-0">
                      <p className="font-medium">{d.titulo}</p>
                      <p className="mt-1 text-[length:var(--text-body-sm)] text-fg-subtle">
                        {d.descricao}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </LogEntry>
      </div>
    </section>
  );
}
