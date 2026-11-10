import type { Concurso } from "@/types/content";

/**
 * CONCURSOS ATENDIDOS PELA PRIME PREP.
 *
 * Origem dos dados: carrossel institucional "Você quer ser militar?" fornecido
 * pelo cliente. NENHUM dado foi obtido de edital oficial nesta fase, portanto
 * todos os campos estão com `verifiedAt: null` e a UI deve exibi-los como
 * referência, com link para o edital vigente.
 *
 * ESA: retirada do site por decisão do cliente (init da Fase 2). Constava no
 * briefing inicial mas não nas peças, e não havia dados para preenchê-la.
 * Decisão revisível — para reintroduzir, basta acrescentar a entrada aqui:
 * menu, sitemap e páginas derivam desta lista.
 */
export const concursos: Concurso[] = [
  {
    slug: "espcex",
    sigla: "EsPCEx",
    nomeCompleto: "Escola Preparatória de Cadetes do Exército",
    forca: "exercito",
    accentToken: "--color-arma-cadete",
    voceVira: { valor: "Oficial do Exército", verifiedAt: null },
    resumo: "Porta de entrada para a carreira de oficial de carreira do Exército.",
    faixaEtaria: { valor: "17 a 22 anos", verifiedAt: null },
    escolaridade: { valor: "Ensino médio completo", verifiedAt: null },
    local: { valor: "Campinas (SP) e Resende (RJ)", verifiedAt: null },
    remuneracaoInicial: {
      valor: "cerca de R$ 7,9 mil ao se formar aspirante a oficial",
      verifiedAt: null,
    },
    disciplinasProva: {
      valor: ["Português", "Matemática", "Inglês", "Geografia", "História", "Redação"],
      verifiedAt: null,
    },
    brasao: null,
  },
  {
    slug: "afa",
    sigla: "AFA",
    nomeCompleto: "Academia da Força Aérea",
    forca: "aeronautica",
    accentToken: "--color-arma-aero",
    voceVira: { valor: "Oficial da Força Aérea", verifiedAt: null },
    resumo: "Forma os oficiais de carreira da FAB: aviadores, intendentes e de infantaria.",
    faixaEtaria: { valor: "17 a 22 anos", verifiedAt: null },
    escolaridade: { valor: "Ensino médio completo", verifiedAt: null },
    local: { valor: "Pirassununga (SP)", verifiedAt: null },
    remuneracaoInicial: { valor: "entre R$ 7.988 e R$ 10.400", verifiedAt: null },
    disciplinasProva: {
      valor: ["Português", "Matemática", "Inglês", "Física", "Redação"],
      verifiedAt: null,
    },
    brasao: null,
  },
  {
    slug: "eear",
    sigla: "EEAR",
    nomeCompleto: "Escola de Especialistas de Aeronáutica",
    forca: "aeronautica",
    accentToken: "--color-arma-aero-light",
    voceVira: { valor: "Sargento da Força Aérea", verifiedAt: null },
    resumo:
      "Forma sargentos da Força Aérea, atuando na manutenção de aeronaves, no controle de tráfego aéreo e na tecnologia da FAB.",
    faixaEtaria: { valor: "17 a 24 anos", verifiedAt: null },
    escolaridade: { valor: "Ensino médio completo", verifiedAt: null },
    local: { valor: "Guaratinguetá (SP)", verifiedAt: null },
    remuneracaoInicial: { valor: "entre R$ 5.125 e R$ 5.950", verifiedAt: null },
    disciplinasProva: { valor: ["Matemática", "Português", "Física", "Inglês"], verifiedAt: null },
    brasao: null,
  },
  {
    slug: "efomm",
    sigla: "EFOMM",
    nomeCompleto: "Escola de Formação de Oficiais da Marinha Mercante",
    forca: "marinha",
    accentToken: "--color-arma-marinha",
    voceVira: { valor: "Oficial da Marinha Mercante", verifiedAt: null },
    resumo:
      "Forma oficiais de náutica e de máquinas para embarcações comerciais e plataformas pelo mundo.",
    faixaEtaria: { valor: "17 a 23 anos", verifiedAt: null },
    escolaridade: { valor: "Ensino médio completo", verifiedAt: null },
    local: { valor: "Rio de Janeiro (RJ) e Belém (PA)", verifiedAt: null },
    remuneracaoInicial: { valor: "entre R$ 15.000 e R$ 24.000", verifiedAt: null },
    disciplinasProva: {
      valor: ["Português", "Redação", "Inglês", "Matemática", "Física"],
      verifiedAt: null,
    },
    brasao: null,
  },
];

export const concursosBySlug = new Map(concursos.map((c) => [c.slug, c]));

/** Nome da força, para exibição. Acompanha sempre a sigla ou a cor de contexto. */
export const forcaLabels: Record<Concurso["forca"], string> = {
  exercito: "Exército",
  aeronautica: "Força Aérea",
  marinha: "Marinha Mercante",
};
