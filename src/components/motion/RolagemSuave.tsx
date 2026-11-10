"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * ROLAGEM SUAVE — inércia na roda do mouse.
 *
 * A rolagem nativa do desktop é discreta: cada clique da roda salta um bloco
 * fixo. Isso é o oposto do que o resto do site faz, porque a paralaxe entre
 * planos depende de posições intermediárias para ser lida como profundidade.
 * Com salto, o olho vê dois quadros e nenhuma distância; com inércia, vê o
 * campo, a marca e o texto percorrerem cursos diferentes.
 *
 * O QUE ISTO NÃO MEXE
 * - **Toque.** O Lenis não sincroniza toque por padrão, e é assim que fica: o
 *   celular já tem inércia própria, do sistema, e ela é melhor que qualquer
 *   reimplementação.
 * - **Teclado e barra de rolagem.** Continuam nativos. A posição de rolagem
 *   real é atualizada a cada quadro, então `position: sticky`,
 *   `scroll-padding-top` e as linhas do tempo de `animation-timeline` seguem
 *   funcionando sem gambiarra.
 *
 * QUEM PEDE MENOS MOVIMENTO NÃO RECEBE NADA DISTO. Com
 * `prefers-reduced-motion: reduce` o Lenis nem chega a ser instanciado, e o
 * `scroll-behavior: smooth` do `base.css` continua sendo a única coisa em jogo.
 * A consulta é reavaliada em tempo real: mudar a preferência do sistema liga ou
 * desliga sem recarregar a página.
 *
 * O conteúdo não depende disto para nada. Sem JavaScript, a rolagem é a nativa,
 * que é exatamente o que se espera de uma página de texto.
 */
export function RolagemSuave() {
  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let quadro = 0;

    const ligar = () => {
      if (lenis) return;
      lenis = new Lenis({
        // Curto. Acima de ~1.2s a página passa a "escorregar" depois que a mão
        // parou, o que lê como atraso, não como suavidade.
        duration: 1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
      });

      const laco = (tempo: number) => {
        lenis?.raf(tempo);
        quadro = requestAnimationFrame(laco);
      };
      quadro = requestAnimationFrame(laco);
    };

    const desligar = () => {
      cancelAnimationFrame(quadro);
      lenis?.destroy();
      lenis = null;
    };

    const aplicar = () => (consulta.matches ? desligar() : ligar());

    aplicar();
    consulta.addEventListener("change", aplicar);

    return () => {
      consulta.removeEventListener("change", aplicar);
      desligar();
    };
  }, []);

  return null;
}
