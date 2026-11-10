"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Reveal de BLOCO ao entrar na viewport. Dispara uma única vez.
 *
 * POR QUE NÃO `motion` AQUI (decisão D-21):
 * a primeira implementação usava `motion` com `whileInView`. O `motion` escreve
 * o estado `initial` no HTML DO SERVIDOR — verificado: `opacity:0` saía no SSR.
 * Consequência: sem JavaScript, ou se a hidratação falhar, TODO o conteúdo
 * revelado fica invisível. Defeito grave para um site cuja função é ser lido e
 * encontrado.
 *
 * A implementação abaixo é segura por construção:
 * - o estado padrão do HTML é VISÍVEL;
 * - o estado inicial escondido vive dentro de `@media (scripting: enabled)`,
 *   então só existe onde há JavaScript para revelá-lo — sem script inline e sem
 *   mismatch de hidratação;
 * - o IntersectionObserver apenas marca `data-revealed`; a transição é CSS.
 *
 * Efeito colateral bom: zero JavaScript de animação no bundle da página, e
 * `prefers-reduced-motion` já é tratado globalmente em base.css.
 */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sem suporte a IntersectionObserver: revela imediatamente.
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-revealed", "");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target); // dispara uma única vez
        }
      },
      { rootMargin: "-12% 0px -12% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

type Tag = "div" | "section" | "li" | "article" | "ul" | "ol";

export function Reveal({
  children,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  as?: Tag;
  className?: string;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag ref={ref as never} data-reveal className={cn(className)}>
      {children}
    </Tag>
  );
}

/**
 * Escalona a entrada dos filhos. Máximo recomendado: 4–6 filhos — o escalonamento
 * para de crescer depois do sexto para não atrasar a leitura.
 */
export function RevealGroup({
  children,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  as?: Tag;
  className?: string;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag ref={ref as never} data-reveal-group className={cn(className)}>
      {children}
    </Tag>
  );
}

/** Filho direto de um `RevealGroup`. */
export function RevealItem({
  children,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  as?: Tag;
  className?: string;
}) {
  return (
    <Tag data-reveal-item className={cn(className)}>
      {children}
    </Tag>
  );
}
