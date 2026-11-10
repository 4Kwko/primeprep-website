"use client";

import { usePathname } from "next/navigation";

/**
 * TRANSIÇÃO DE ROTA — a página nova entra, a antiga não espera.
 *
 * Trocar de página num site estático é instantâneo, e instantâneo demais lê como
 * corte seco: o olho não percebe que o conteúdo mudou, só que a tela piscou.
 * Uma entrada curta resolve isso sem custo de percepção.
 *
 * O que isto NÃO é: não há saída animada, não há cortina, não há spinner e não
 * há espera. A rota nova é pintada quando o Next terminar de resolvê-la; a
 * animação só acompanha essa pintura. O `key` no pathname existe para reiniciar
 * a animação a cada navegação, já que uma animação CSS não reinicia sozinha
 * quando apenas o conteúdo do nó muda.
 *
 * É CSS (`@keyframes pp-entrada-rota`), não `motion`: assim o conteúdo nunca
 * depende de JavaScript para ficar visível, pela mesma razão da D-21. Com
 * `prefers-reduced-motion` a animação simplesmente não existe.
 */
export function TransicaoRota({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="transicao-rota">
      {children}
    </div>
  );
}
