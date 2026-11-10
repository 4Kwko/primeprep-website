import type { NavItem } from "@/types/content";
import { concursos } from "./concursos";

/**
 * Fonte única da navegação. O sitemap, o header e o footer derivam daqui.
 *
 * ATENÇÃO: as rotas internas ainda NÃO existem (Etapa 1 da Fase 3 implementou
 * apenas o shell e a Home). Todos estes links levam a 404 até a Etapa 2.
 * A indexação está bloqueada por `NEXT_PUBLIC_ALLOW_INDEXING`, então nenhum
 * 404 é exposto a buscador enquanto isso.
 */
export const mainNav: NavItem[] = [
  { label: "O curso", href: "/o-curso" },
  { label: "Metodologia", href: "/metodologia" },
  {
    label: "Concursos",
    href: "/concursos",
    children: concursos.map((c) => ({
      label: c.sigla,
      href: `/concursos/${c.slug}`,
    })),
  },
  { label: "Professores", href: "/professores" },
  { label: "Bolsas", href: "/bolsas" },
  { label: "Contato", href: "/contato" },
];

/**
 * NOTA — /matricula não é item de menu.
 * Matrícula é o CTA primário do site, não uma página de navegação. Se ganhar
 * página própria (hoje o fluxo é pendente), ela entra em `plannedRoutes` sem
 * entrar no menu. Ver docs/implementation/conversion.md.
 */

export const footerNav: { titulo: string; itens: NavItem[] }[] = [
  {
    titulo: "Institucional",
    itens: [
      { label: "O curso", href: "/o-curso" },
      { label: "Metodologia", href: "/metodologia" },
      { label: "Professores", href: "/professores" },
      { label: "Bolsas", href: "/bolsas" },
    ],
  },
  {
    titulo: "Concursos",
    itens: [
      // O diagnóstico abre a lista porque é a porta de quem ainda não sabe qual
      // dos quatro quer. Fica fora do menu principal (a barra transborda com
      // sete itens, ver D-28), então o rodapé é onde ele tem lugar fixo.
      { label: "Qual é o seu?", href: "/diagnostico" },
      ...concursos.map((c) => ({ label: c.sigla, href: `/concursos/${c.slug}` })),
    ],
  },
];

/** Rotas previstas, usadas para gerar o sitemap enquanto as páginas não existem. */
export const plannedRoutes: string[] = [
  "/",
  "/o-curso",
  "/metodologia",
  "/diagnostico",
  "/concursos",
  ...concursos.map((c) => `/concursos/${c.slug}`),
  "/professores",
  "/bolsas",
  "/contato",
];
