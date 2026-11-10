import type { Concurso } from "@/types/content";
import { type ConversionIntent, resolveIntent } from "@/content/conversion";
import { cn } from "@/lib/cn";
import { ExternalIcon } from "@/components/decorative/icons";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  /** Intenção de conversão. O destino vem de conversion.ts — nunca do componente. */
  intent: ConversionIntent;
  variant?: Variant;
  size?: "md" | "sm";
  /** Sobrescreve o rótulo padrão quando o contexto pede algo mais específico. */
  label?: string;
  /** Contextualiza a mensagem inicial com o concurso. */
  concurso?: Pick<Concurso, "sigla">;
  className?: string;
  /** Onde este CTA está — vai para o dataset, base do tracking futuro. */
  section?: string;
};

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

/**
 * Único caminho para um CTA de conversão no site.
 *
 * Todos os quatro canais abrem serviço externo, então o componente sempre
 * emite `target`/`rel` corretos e um aviso acessível — exigência de a11y
 * registrada em docs/implementation/conversion.md § 6.
 *
 * `data-cta`/`data-cta-section` existem para que ligar analytics depois seja
 * acrescentar um handler, não refatorar CTAs. Nenhum tracking está ativo.
 */
export function Cta({
  intent,
  variant = "primary",
  size = "md",
  label,
  concurso,
  className,
  section,
}: Props) {
  const resolved = concurso ? resolveIntent(intent, { concurso }) : resolveIntent(intent);
  const text = label ?? resolved.label;

  return (
    <a
      href={resolved.href}
      target="_blank"
      rel="noopener noreferrer"
      data-touch-target
      data-cta={resolved.event}
      data-cta-section={section}
      className={cn("btn-base", variantClass[variant], size === "sm" && "btn-sm", className)}
    >
      {text}
      <ExternalIcon className="size-3.5 shrink-0 opacity-70" />
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}
