import { LogEntry } from "@/components/layout/LogEntry";
import { Reveal } from "@/components/motion/Reveal";
import { Cta } from "@/components/ui/Cta";
import { LaurelIcon } from "@/components/decorative/icons";

/**
 * ENTRADA 05 — bolsas.
 *
 * Fluxo SEPARADO de matrícula, nunca apresentado como a mesma ação.
 *
 * Linguagem deliberadamente cuidadosa: o processo não está definido. Não há
 * percentual, número de bolsas, prazo, critério detalhado, documento exigido nem
 * garantia de concessão — e nada disso pode ser inventado. O texto afirma
 * apenas o que foi confirmado: que existem possibilidades, que podem envolver
 * desempenho e/ou critérios socioeconômicos, e que as regras dependem de
 * definição oficial.
 */
export function Bolsas() {
  return (
    <section data-surface="bone" className="section-sm">
      <div className="container-wide">
        <LogEntry numero="05" rotulo="Bolsas">
          <Reveal>
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface-sunken p-8 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-14">
                <div>
                  <LaurelIcon className="size-7 text-accent" />
                  <h2 className="mt-5 max-w-[22ch] text-[length:var(--text-h3)]">
                    Existem possibilidades de bolsa.
                  </h2>
                  <p className="mt-5 max-w-[58ch] text-fg-muted">
                    A Prime Prep concede bolsas por desempenho, e há possibilidade de critérios
                    socioeconômicos. As regras específicas dependem de definição oficial e são
                    tratadas caso a caso. O caminho é conversar.
                  </p>
                </div>

                <div className="lg:justify-self-end">
                  <Cta
                    intent="bolsa"
                    variant="secondary"
                    label="Quero saber sobre bolsas"
                    section="bolsas"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </LogEntry>
      </div>
    </section>
  );
}
