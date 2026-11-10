import { cn } from "@/lib/cn";

/**
 * Losango de quatro pontas — a marcação de rota do diário de bordo.
 * `style` existe para receber a cor de contexto do concurso via
 * `var(--color-arma-*)`, que é resolvida por superfície.
 */
export function Lozenge({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <span aria-hidden style={style} className={cn("mark-lozenge", className)} />;
}

/** Divisor ornamental. Máximo um por dobra (DESIGN.md § Shapes). */
export function OrnamentRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("rule-ornament", className)}>
      <Lozenge className="text-[1rem]" />
    </div>
  );
}

/**
 * Campo gráfico do hero.
 *
 * Composição abstrata feita inteiramente de tokens — grade de filetes, losangos
 * em escalas variadas, gradiente de superfície. Existe porque NÃO há logo em SVG,
 * fotografia nem brasão disponíveis; o hero precisa de presença visual sem
 * recriar a marca, o que o briefing proíbe.
 *
 * SUBSTITUÍVEL: quando a águia em SVG chegar, este componente é o ponto de troca.
 */
export function GraphicField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {/* A GRADE ANDA, O GRADIENTE NÃO. A grade é o plano mais distante e faz o
          curso mais curto de todos (40px); o gradiente e o esmaecimento da base
          existem para amarrar o campo à superfície, então precisam ficar
          exatamente onde estão. O recuo vertical negativo dá material para a
          grade percorrer, e `.plano-fundo` (que já tem `overflow: hidden`) corta
          o que sobra, então nada vaza para a seção vizinha. */}
      <div className="parallax-fundo absolute inset-x-0 -inset-y-14 field-grid opacity-60" />
      {/* Gradiente de profundidade: o campo dissolve para o fundo em vez de
          terminar numa linha, então ele parece continuar atrás do conteúdo. */}
      <div className="absolute inset-0 campo-profundidade" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-canvas)] to-transparent" />
    </div>
  );
}
