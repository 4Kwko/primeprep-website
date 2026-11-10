import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { baseMetadata } from "@/lib/metadata";
import { corLiteral } from "@/lib/cores-literais";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TransicaoRota } from "@/components/motion/TransicaoRota";
import { RolagemSuave } from "@/components/motion/RolagemSuave";
import { DadosEstruturados } from "@/components/layout/DadosEstruturados";
import { organizacao, website } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = baseMetadata;

/**
 * `themeColor` pinta a barra do sistema no celular. O navegador lê esse valor
 * antes de qualquer folha de estilo, então ele não pode ser `var(--color-*)`.
 * Os literais vêm de `cores-literais.ts`, que tem teste garantindo que
 * continuam iguais aos tokens de origem.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: corLiteral.bone },
    { media: "(prefers-color-scheme: dark)", color: corLiteral.navy },
  ],
};

/**
 * Shell global. O header é fixo, então `<main>` compensa a altura dele —
 * exceto no hero, que sobe sob o header de propósito (ver Hero).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // As variáveis de fonte precisam estar no <html>: `@theme` compõe
    // `--font-display: var(--font-fraunces)` no `:root`, então a variável de
    // origem tem de existir nesse mesmo nível — no <body> ela ficaria abaixo.
    <html lang="pt-BR" data-surface="bone" className={fontVariables}>
      <body>
        {/* A organização e o site, uma vez só, no layout. Páginas acrescentam a
            própria trilha; nenhuma redeclara a organização. */}
        <DadosEstruturados nos={[organizacao(), website()]} />

        <a href="#conteudo" className="sr-only-focusable">
          Pular para o conteúdo
        </a>
        <RolagemSuave />
        <Header />
        <main id="conteudo">
          <TransicaoRota>{children}</TransicaoRota>
        </main>
        <Footer />
      </body>
    </html>
  );
}
