import { LogEntry } from "@/components/layout/LogEntry";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Lozenge } from "@/components/decorative/Ornament";

/**
 * ENTRADA 01 — credibilidade.
 *
 * Primeira coisa que o responsável lê. Vem cedo por decisão de produto (D-17).
 *
 * Sem métrica: não existe número de aprovações, de alunos ou de anos de mercado
 * fornecido pelo cliente, e o briefing proíbe inventá-los. A credibilidade é
 * construída sobre o MECANISMO — o que a Prime Prep faz que um curso de turma
 * grande não pode fazer — e não sobre estatística.
 *
 * Formato de lista com filete, não grade de cartões: é uma declaração, não um
 * catálogo de features.
 */
const pilares = [
  {
    titulo: "Cada aluno tem uma planilha própria",
    corpo:
      "O desempenho é registrado individualmente e acompanhado ao longo de toda a preparação. A conversa sobre o que melhorar parte de um dado, não de uma impressão.",
  },
  {
    titulo: "A correção é individual, inclusive a redação",
    corpo:
      "Questões, simulados e redações são corrigidos um a um, com devolutiva. É o oposto de gabarito projetado na parede.",
  },
  {
    titulo: "Professores dedicados às matérias que caem",
    corpo:
      "Matemática, Física, Português e Inglês, com professores que preparam especificamente para concurso militar.",
  },
  {
    titulo: "O ritmo se ajusta ao resultado",
    corpo:
      "Simulados periódicos ao longo do ano, intensificados perto das provas, e reforço aos finais de semana quando o desempenho indica necessidade.",
  },
];

export function Credibilidade() {
  return (
    // Padding extra em lg: o painel do hero desce 9rem sobre esta seção.
    <section data-surface="bone" className="section lg:pt-[calc(var(--space-section)+7rem)]">
      <div className="container-wide">
        <LogEntry numero="01" rotulo="Por que confiar">
          <Reveal>
            <h2 className="max-w-[18ch] text-[length:var(--text-h2)]">
              Acompanhamento individual não é slogan aqui, é o método.
            </h2>
            <p className="mt-6 max-w-[62ch] text-[length:var(--text-body-lg)] text-fg-muted">
              Todo preparatório promete atenção individual. A diferença está em conseguir mostrar
              onde ela acontece.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-12 flex flex-col">
            {pilares.map((p) => (
              <RevealItem
                as="li"
                key={p.titulo}
                className="grid gap-2 border-t border-hairline py-7 last:border-b sm:grid-cols-[1fr_1.4fr] sm:gap-10"
              >
                <h3 className="flex items-baseline gap-3 text-[length:var(--text-h4)] leading-snug">
                  <Lozenge className="translate-y-[-2px] text-[0.625rem] text-accent" />
                  {p.titulo}
                </h3>
                <p className="max-w-[54ch] text-fg-muted">{p.corpo}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </LogEntry>
      </div>
    </section>
  );
}
