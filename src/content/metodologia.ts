/**
 * O CICLO DE PREPARAÇÃO.
 *
 * Conteúdo compartilhado entre a Home (versão curta) e /metodologia (versão
 * longa). Fonte única: mudar aqui muda nos dois lugares.
 *
 * Todos os fatos vêm do planejamento e do PRODUCT.md. `detalhe` é a expansão
 * usada só na página dedicada — não acrescenta fato novo, aprofunda o mesmo.
 */
export type EtapaCiclo = {
  momento: string;
  titulo: string;
  corpo: string;
  /** Expansão para /metodologia. */
  detalhe: string[];
};

export const ciclo: EtapaCiclo[] = [
  {
    momento: "Ponto de partida",
    titulo: "Descobrir onde o aluno está",
    corpo:
      "Antes de acelerar, é preciso saber a posição. O desempenho inicial é registrado na planilha individual do aluno, o mesmo documento que vai acompanhar o ano inteiro.",
    detalhe: [
      "Cada aluno tem uma planilha própria, e não uma linha em uma lista de turma.",
      "O registro começa no primeiro simulado e continua até a prova, então a evolução é comparável ao longo do ano.",
      "A conversa sobre o que precisa melhorar parte de um dado registrado, não de uma impressão.",
    ],
  },
  {
    momento: "Rotina",
    titulo: "Aula dirigida ao concurso, não ao vestibular",
    corpo:
      "Matemática, Física, Português e Inglês trabalhadas do jeito que caem nas provas militares, com professores dedicados a cada uma.",
    detalhe: [
      "As quatro disciplinas cobrem o que é cobrado em EsPCEx, AFA, EEAR e EFOMM.",
      "Cada concurso pesa as matérias de forma diferente, então a preparação considera qual é o alvo do aluno.",
      "É possível preparar-se para mais de um concurso dentro do mesmo ciclo anual.",
    ],
  },
  {
    momento: "Medição",
    titulo: "Simulados periódicos, corrigidos individualmente",
    corpo:
      "Simulados ao longo do ano, intensificados na aproximação das provas. Questões, simulados e redações voltam corrigidos um a um, com devolutiva, não apenas com a nota.",
    detalhe: [
      "Os simulados acontecem periodicamente e ficam mais frequentes conforme as provas se aproximam.",
      "A correção é individual em três frentes: questões, simulados e redações.",
      "A devolutiva explica o erro. Uma nota sozinha não diz o que estudar em seguida.",
    ],
  },
  {
    momento: "Ajuste",
    titulo: "Reforço onde o resultado apontar",
    corpo:
      "Quando a planilha mostra uma queda, o plano muda: reforço fora do horário regular, inclusive aos finais de semana, na matéria que precisa.",
    detalhe: [
      "O reforço é uma resposta ao desempenho registrado, não um pacote fixo vendido de antemão.",
      "Acontece aos finais de semana quando necessário.",
      "O ciclo então recomeça: nova medição, novo ajuste.",
    ],
  },
];
