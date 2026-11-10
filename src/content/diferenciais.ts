import type { Diferencial } from "@/types/content";

/**
 * Diferenciais definidos no planejamento. O texto aqui é estruturado, não é a
 * redação final de copy — a Fase 3 pode refinar a redação, não os fatos.
 */
export const diferenciais: Diferencial[] = [
  {
    slug: "acompanhamento-individualizado",
    titulo: "Acompanhamento individualizado",
    descricao:
      "Cada aluno é acompanhado de perto, com atenção ao seu ponto de partida e ao seu ritmo.",
    icone: "compass",
  },
  {
    slug: "planilha-de-desempenho",
    titulo: "Planilha individual de desempenho",
    descricao: "A evolução do aluno é registrada e acompanhada ao longo de toda a preparação.",
    icone: "chart",
  },
  {
    slug: "correcao-individual",
    titulo: "Correção individual",
    descricao: "Questões, simulados e redações são corrigidos individualmente, com devolutiva.",
    icone: "quill",
  },
  {
    slug: "simulados-periodicos",
    titulo: "Simulados periódicos",
    descricao: "Simulados regulares ao longo do ano, intensificados na aproximação das provas.",
    icone: "target",
  },
  {
    slug: "reforcos",
    titulo: "Reforços aos finais de semana",
    descricao: "Reforço fora do horário regular sempre que o desempenho indicar necessidade.",
    icone: "clock",
  },
  {
    slug: "bolsas",
    titulo: "Bolsas por desempenho",
    descricao: "Bolsas concedidas por desempenho, com possibilidade de critérios socioeconômicos.",
    icone: "laurel",
  },
  {
    slug: "multiplos-concursos",
    titulo: "Vários concursos no mesmo ano",
    descricao:
      "Preparação simultânea para diferentes concursos militares dentro de um mesmo ciclo.",
    icone: "layers",
  },
  {
    slug: "professores-especializados",
    titulo: "Professores especializados",
    descricao: "Corpo docente dedicado às disciplinas cobradas nos concursos militares.",
    icone: "pulpito",
  },
];
