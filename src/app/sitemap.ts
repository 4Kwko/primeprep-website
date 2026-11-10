import type { MetadataRoute } from "next";
import { plannedRoutes } from "@/content/navigation";
import { site } from "@/lib/site";

/**
 * Derivado de `plannedRoutes`, que é a mesma lista que alimenta o menu e o
 * rodapé. Rota nova entra aqui sozinha; rota de desenvolvimento nunca entra,
 * e há teste que garante isso.
 *
 * SEM `lastModified`, E ISSO É DECISÃO. A versão anterior usava `new Date()`, o
 * que carimbava o instante do build em TODAS as URLs. Ou seja: a cada deploy o
 * sitemap afirmava que as doze páginas tinham mudado ao mesmo tempo, o que é
 * falso quase sempre. Um `lastmod` que sempre muda é pior que nenhum, porque o
 * buscador aprende a ignorar o campo, e aí ele deixa de valer justamente no dia
 * em que uma página muda de verdade.
 *
 * Não há fonte confiável para preencher isso hoje: `mtime` de arquivo vira a
 * data do checkout em qualquer CI, e data de commit exigiria rodar git no build.
 * Omitir é a resposta honesta. Quando houver conteúdo com data real (um edital
 * verificado, por exemplo), ela entra a partir do próprio dado.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return plannedRoutes.map((route) => ({
    url: new URL(route, site.url).toString(),
    // A home muda quando muda a oferta; as internas acompanham edital, que é
    // anual. Google ignora estes dois campos, mas nem todo buscador ignora.
    changeFrequency: route === "/" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
