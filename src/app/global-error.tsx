"use client";

import { useEffect } from "react";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * FRONTEIRA DE ERRO DA RAIZ. O último recurso.
 *
 * Só entra em cena quando o próprio layout raiz falha, o que significa que
 * `Header`, `Footer` e tudo mais já se foram. Por isso ele renderiza o próprio
 * `<html>` e o próprio `<body>`: não há layout acima dele para fazer isso.
 *
 * A REGRA AQUI É DEPENDER DE QUASE NADA. Ele não importa componente do site,
 * porque um componente quebrado pode ter sido justamente a causa da queda, e uma
 * tela de erro que quebra é pior que nenhuma. Sobra o CSS de tokens (que é
 * estático e não executa) e duas constantes. O WhatsApp é montado à mão, com o
 * mesmo número de `site.ts`, porque `resolveIntent()` viria de um módulo que
 * pode estar entre os que falharam. É a única exceção à regra 12, e ela existe
 * pela mesma razão de todo o resto deste arquivo.
 *
 * As variáveis de fonte vão no `<html>`, como no layout normal. Se não forem,
 * quebram em silêncio (D-22) e a tela de erro sai em Times New Roman.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[prime-prep] erro fatal no layout raiz:", error);
  }, [error]);

  const whatsapp = `https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`;

  return (
    <html lang={site.locale} data-surface="navy" className={fontVariables}>
      <body>
        <main className="flex min-h-screen items-center bg-canvas">
          <div className="container-content py-24">
            <p className="text-inscription text-accent">{site.name}</p>

            <h1 className="mt-7 max-w-[18ch] text-[length:var(--text-h1)] leading-[1.05]">
              O site caiu por completo.
            </h1>

            <p className="mt-7 max-w-[52ch] text-[length:var(--text-body-lg)] text-fg-muted">
              Não foi você. Recarregar costuma resolver. Se não resolver, o WhatsApp continua
              atendendo normalmente, e é o caminho mais rápido para falar com a gente.
            </p>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button type="button" onClick={reset} className="btn-base btn-primary">
                Recarregar
              </button>

              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-base btn-secondary"
              >
                Falar no WhatsApp
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </div>

            {error.digest ? (
              <p className="mt-12 text-[length:var(--text-caption)] text-fg-subtle">
                Código da ocorrência:{" "}
                <span data-selecionavel className="text-inscription text-fg">
                  {error.digest}
                </span>
              </p>
            ) : null}
          </div>
        </main>
      </body>
    </html>
  );
}
