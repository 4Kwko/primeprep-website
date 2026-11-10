import type { Metadata } from "next";
import { site } from "./site";

/**
 * Fundação de metadata. O que está aqui é o FALLBACK: cada página escreve o
 * próprio `title` e a própria `description`, e estes valores só aparecem onde
 * uma rota não declarou os seus.
 *
 * `robots` é o interruptor de publicação: enquanto `NEXT_PUBLIC_ALLOW_INDEXING`
 * não for "true", nada é indexado. É proposital, e sair do ar depende de uma
 * variável de ambiente, não de editar código.
 */

const titleTemplate = `%s · ${site.name}`;

export const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: ${site.tagline}`,
    template: titleTemplate,
  },
  description: `Curso preparatório para concursos militares em ${site.city}/${site.state}.`,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    // Enquanto o site não estiver publicado, nada deve ser indexado.
    index: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
    follow: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  },
  formatDetection: { telephone: false, address: false, email: false },
};

/* REMOVIDO: `pageMetadata`.
   Era um atalho para montar metadata de página, e NENHUMA das doze rotas o
   usava: todas escrevem o próprio objeto, porque cada uma tem `openGraph`
   diferente. Um atalho morto é pior que nenhum, porque a próxima pessoa o
   encontra, usa, e ganha um formato de metadata levemente diferente do resto
   do site sem perceber. */
