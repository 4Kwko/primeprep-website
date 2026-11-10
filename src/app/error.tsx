"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Cta } from "@/components/ui/Cta";

/**
 * FRONTEIRA DE ERRO da árvore de rotas.
 *
 * Antes disto, qualquer exceção em componente cliente derrubava a rota para a
 * tela padrão do Next: fundo branco, tipografia de sistema, nenhuma marca e
 * nenhuma saída. Quem chegasse ali via um site quebrado sem sequer um caminho de
 * volta, o que é pior que a falha em si — o visitante não perde a página, perde
 * a confiança que o site inteiro tenta construir.
 *
 * A recuperação tem duas portas, na ordem certa: `reset()` primeiro, porque a
 * maioria dos erros de renderização passa numa segunda tentativa, e o WhatsApp
 * depois, porque nenhuma falha de interface deve interromper a conversão. Se a
 * página quebrar, a pessoa ainda consegue falar com a Prime Prep.
 *
 * Não mostra a mensagem de erro nem a pilha: para o visitante isso é ruído, e
 * mensagem de exceção às vezes carrega caminho de arquivo. O `digest` aparece
 * porque é curto e é o que permite localizar a ocorrência no log do servidor.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sem serviço de monitoramento decidido (ver D-10, analytics desligado), o
    // console é o único destino honesto. Quando houver, é aqui que ele entra.
    console.error("[prime-prep] erro de renderização:", error);
  }, [error]);

  return (
    <>
      <PageHeader
        eyebrow="Erro"
        titulo="Alguma coisa quebrou aqui."
        lead="A falha é nossa, não sua. Tentar de novo costuma resolver, e se não resolver o WhatsApp continua funcionando normalmente."
      >
        <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <button type="button" onClick={reset} className="btn-base btn-primary">
            Tentar de novo
          </button>
          <Cta intent="whatsapp" variant="secondary" label="Falar no WhatsApp" section="erro" />
        </div>
      </PageHeader>

      <section data-surface="bone" className="section-sm">
        <div className="container-wide">
          <h2 className="text-label-caps text-fg-subtle">Enquanto isso</h2>
          <p className="mt-5 max-w-[58ch] text-[length:var(--text-body-lg)] text-fg-muted">
            O restante do site segue no ar. Pela{" "}
            <Link href="/" className="link-filete text-accent">
              página inicial
            </Link>{" "}
            você chega a tudo, e o{" "}
            <Link href="/diagnostico" className="link-filete text-accent">
              diagnóstico
            </Link>{" "}
            continua respondendo qual concurso serve para você.
          </p>

          {error.digest ? (
            <p className="mt-8 text-[length:var(--text-caption)] text-fg-subtle">
              Se for falar com a gente sobre isto, cite o código{" "}
              <span data-selecionavel className="text-inscription text-fg">
                {error.digest}
              </span>
              .
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
