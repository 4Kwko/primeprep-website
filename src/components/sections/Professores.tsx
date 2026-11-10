import { disciplinas, professores } from "@/content/equipe";
import { LogEntry } from "@/components/layout/LogEntry";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Lozenge } from "@/components/decorative/Ornament";

/**
 * ENTRADA 04 — professores.
 *
 * ASSET PENDENTE: não há fotografias. O briefing proíbe banco de imagens e
 * rostos gerados, então o lugar do retrato é ocupado por um monograma
 * tipográfico em Cinzel sobre superfície rebaixada — coerente com a identidade e
 * honesto sobre a ausência.
 *
 * PONTO DE SUBSTITUIÇÃO: quando houver retratos, o bloco do monograma vira um
 * `next/image` — trocar a altura fixa `h-40` por `aspect-[4/5]` no mesmo lugar.
 * Ver docs/implementation/home.md.
 *
 * Somente credenciais fornecidas pelo cliente. Nada acrescentado por inferência.
 */
function iniciais(nome: string) {
  const partes = nome.split(" ").filter((p) => p.length > 2);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? "") : "";
  return `${primeira}${ultima}`.toUpperCase();
}

export function Professores() {
  return (
    <section data-surface="bone" className="section">
      <div className="container-wide">
        <LogEntry numero="04" rotulo="Quem ensina">
          <Reveal>
            <h2 className="max-w-[20ch] text-[length:var(--text-h2)]">
              Três professores. Quatro matérias. Nenhum intermediário.
            </h2>
            <p className="mt-6 max-w-[62ch] text-[length:var(--text-body-lg)] text-fg-muted">
              Quem dá a aula é quem corrige a redação e quem acompanha a planilha. O aluno sabe com
              quem está falando.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {professores.map((p) => (
              <RevealItem as="li" key={p.slug} className="h-full">
                <article className="flex h-full flex-col card-surface p-6">
                  {/* Monograma — substituto temporário do retrato. */}
                  <div
                    aria-hidden
                    className="flex h-40 items-center justify-center self-stretch rounded-[var(--radius-md)] border border-hairline bg-surface-sunken"
                  >
                    <span className="text-inscription text-[2rem] text-fg-subtle">
                      {iniciais(p.nome)}
                    </span>
                  </div>

                  <h3 className="mt-6 text-[length:var(--text-h4)] leading-snug">{p.nome}</h3>

                  <p className="mt-3 text-label-caps text-accent">
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

                  <ul className="mt-5 flex flex-col gap-2.5 border-t border-hairline pt-5">
                    {p.credenciais.map((c) => (
                      <li
                        key={c}
                        className="flex items-baseline gap-2.5 text-[length:var(--text-body-sm)] text-fg-muted"
                      >
                        <Lozenge className="shrink-0 translate-y-[-1px] text-[0.5rem] text-accent" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </LogEntry>
      </div>
    </section>
  );
}
