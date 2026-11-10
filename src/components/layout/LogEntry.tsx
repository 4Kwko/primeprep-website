import { cn } from "@/lib/cn";

/**
 * ENTRADA DE DIÁRIO — o componente estrutural do site.
 *
 * Toda seção de conteúdo é um registro numerado, com trilho de margem à esquerda
 * (número + rótulo + filete vertical, grudado ao rolar) e conteúdo à direita.
 * Abaixo de `lg` o trilho colapsa em uma linha horizontal acima do conteúdo.
 *
 * Existe para tornar impossível o empilhamento de seções centralizadas que
 * caracteriza landing pages geradas. Ver DESIGN.md § Layout.
 *
 * PROFUNDIDADE
 * O número da entrada aparece duas vezes, em dois planos: pequeno e nítido no
 * trilho (plano frontal, é o rótulo que se lê) e grande e apagado atrás do
 * conteúdo (plano intermediário, é o registro no papel). O numeral grande cria a
 * distância entre o campo e o texto sem exigir cartão nem sombra, e reforça a
 * metáfora do diário exatamente onde ela vive: na numeração.
 *
 * O numeral é `aria-hidden` e só existe a partir de `lg`: no mobile ele
 * competiria com a leitura em vez de recuar.
 */
export function LogEntry({
  numero,
  rotulo,
  children,
  className,
}: {
  /** Número da entrada, ex.: "01". */
  numero: string;
  /** Rótulo curto — máximo 4 palavras (A Regra das Quatro Palavras). */
  rotulo: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("log-entry", className)}>
      <div className="log-rail">
        <span className="text-inscription text-accent" aria-hidden>
          {numero}
        </span>
        <span className="text-label-caps text-fg-subtle">{rotulo}</span>
      </div>

      <div className="relative min-w-0">
        {/* Curso NEGATIVO: o numeral sobe enquanto o campo e a marca descem.
            Andando junto com o texto ele continuaria parecendo colado nele;
            andando ao contrário, ele se descola e vira fundo de verdade. */}
        <span aria-hidden className="parallax-contra numeral-registro">
          {numero}
        </span>
        <div className="plano-frente">{children}</div>
      </div>
    </div>
  );
}
