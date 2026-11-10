import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { corLiteral } from "@/lib/cores-literais";

/**
 * MANIFESTO DE APLICATIVO WEB.
 *
 * O público secundário do produto é um estudante de 16 a 18 anos que descobre a
 * Prime Prep pelo Instagram, no celular (PRODUCT.md § Users). Uma parte dessas
 * pessoas adiciona o site à tela inicial, e sem manifesto o atalho sai com o
 * nome truncado da aba e um ícone escolhido pelo sistema.
 *
 * `display: "browser"`, e não `"standalone"`. Standalone tira a barra de
 * endereço e faz o site fingir ser aplicativo, o que aqui é ruim por dois
 * motivos: some o botão de voltar, que é a navegação que essa pessoa usa; e some
 * a URL, que num site institucional é parte da credibilidade. Isto é um site
 * para ler, não um aplicativo para operar.
 *
 * Sem `screenshots`, sem `shortcuts` e sem `categories` inventadas: só o que
 * descreve o que o site é.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name}: ${site.tagline}`,
    short_name: site.name,
    description: `Preparação para concursos militares em ${site.city}/${site.state}, com acompanhamento individual do primeiro simulado à prova.`,
    lang: site.locale,
    start_url: "/",
    display: "browser",
    // Manifesto é JSON: não passa por CSS, então os literais vêm do módulo que
    // tem teste garantindo que continuam iguais aos tokens.
    background_color: corLiteral.bone,
    theme_color: corLiteral.navy,
    icons: [
      { src: "/icon.png", sizes: "32x32", type: "image/png" },
      { src: "/icon1.png", sizes: "192x192", type: "image/png" },
      { src: "/icon2.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
