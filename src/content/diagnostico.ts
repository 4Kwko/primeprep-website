import type { Concurso } from "@/types/content";
import { concursos } from "./concursos";

/**
 * DIAGNÓSTICO — "qual concurso serve para você".
 *
 * O Princípio 5 do produto diz que o visitante não pensa "quero um cursinho",
 * pensa "quero passar na EEAR". Só que boa parte dele chega sem saber qual é o
 * seu, e até aqui o site esperava que já soubesse. Isto resolve isso.
 *
 * NADA É INVENTADO, E ISSO É A PARTE IMPORTANTE. Toda a lógica abaixo lê
 * `concursos.ts`, que é a fonte única. Não existe tabela paralela de idade, de
 * força ou de disciplina: se um dado mudar lá, o diagnóstico muda junto. Foi por
 * isso que a patente e a faixa etária são DERIVADAS dos campos existentes em vez
 * de redigitadas aqui.
 *
 * NÃO É FORMULÁRIO. Nada é enviado, nada é armazenado, nada sai do navegador.
 * Não há nome, e-mail nem telefone. É uma calculadora que termina numa conversa
 * de WhatsApp com o resultado já escrito na mensagem, o que mantém a D-18 de pé:
 * o site continua sem formulário e sem backend.
 *
 * OS DADOS SÃO REFERÊNCIA. `faixaEtaria` tem `verifiedAt: null`, como todo dado
 * de edital do site. O resultado por isso NUNCA afirma elegibilidade: ele diz o
 * que a faixa de referência sugere e manda conferir no edital vigente. Regra de
 * idade muda por edição e depende da data de corte.
 */

/** Patente a que o concurso leva. Derivada de `voceVira`, não redigitada. */
export type Patente = "oficial" | "graduado";

export function patenteDe(c: Concurso): Patente | null {
  const valor = c.voceVira?.valor.toLowerCase();
  if (!valor) return null;
  if (valor.startsWith("oficial")) return "oficial";
  if (valor.startsWith("sargento")) return "graduado";
  return null;
}

/**
 * Faixa etária em números, extraída de `faixaEtaria` ("17 a 22 anos").
 *
 * Falha ABERTA de propósito: se o texto mudar de formato e o padrão não casar, a
 * função devolve `null` e o concurso deixa de ter restrição de idade em vez de
 * ser eliminado. Eliminar alguém por causa de um regex que quebrou seria o pior
 * resultado possível aqui.
 */
export function faixaEmNumeros(c: Concurso): { min: number; max: number } | null {
  const texto = c.faixaEtaria?.valor;
  if (!texto) return null;
  const m = /(\d{2})\s*a\s*(\d{2})/.exec(texto);
  if (!m?.[1] || !m[2]) return null;
  return { min: Number(m[1]), max: Number(m[2]) };
}

/** Uma das quatro perguntas. `null` como valor = "tanto faz", que não pontua. */
export type IdIntencao = "idade" | "forca" | "patente" | "prova";

export type Opcao = {
  valor: string;
  rotulo: string;
  /** Frase curta abaixo do rótulo. Só onde a escolha precisa de contexto. */
  nota?: string;
};

export type Pergunta = {
  id: IdIntencao;
  enunciado: string;
  /** Explicação curta do porquê da pergunta. Nunca decorativa. */
  ajuda?: string;
  opcoes: Opcao[];
};

/**
 * As perguntas. São quatro porque quatro bastam para separar quatro concursos:
 * força, patente e disciplina já os distinguem dois a dois, e a idade é a única
 * restrição dura. Uma quinta pergunta seria conversa, não diagnóstico.
 */
export const perguntas: Pergunta[] = [
  {
    id: "idade",
    enunciado: "Que idade você terá na data da prova?",
    ajuda: "A idade é o único critério que pode deixar um concurso fora de alcance.",
    opcoes: [
      { valor: "ate16", rotulo: "16 anos ou menos" },
      { valor: "17a22", rotulo: "Entre 17 e 22" },
      { valor: "23", rotulo: "23 anos" },
      { valor: "24", rotulo: "24 anos" },
      { valor: "25mais", rotulo: "25 anos ou mais" },
    ],
  },
  {
    id: "forca",
    enunciado: "Onde você se imagina trabalhando?",
    opcoes: [
      { valor: "exercito", rotulo: "No Exército", nota: "Carreira em terra." },
      { valor: "aeronautica", rotulo: "Na Força Aérea", nota: "Aviação e tecnologia aeronáutica." },
      {
        valor: "marinha",
        rotulo: "Embarcado, na Marinha Mercante",
        nota: "Navios comerciais e plataformas. É carreira civil, não militar.",
      },
      { valor: "", rotulo: "Ainda não sei" },
    ],
  },
  {
    id: "patente",
    enunciado: "Você quer comandar ou ser o especialista técnico?",
    opcoes: [
      { valor: "oficial", rotulo: "Seguir como oficial", nota: "Carreira de comando e gestão." },
      {
        valor: "graduado",
        rotulo: "Seguir como sargento",
        nota: "Especialista técnico, mão na operação e na manutenção.",
      },
      { valor: "", rotulo: "Tanto faz" },
    ],
  },
  {
    id: "prova",
    enunciado: "Na prova, com o que você se dá melhor?",
    ajuda: "As quatro cobram Português, Matemática e Inglês. A diferença está no resto.",
    opcoes: [
      { valor: "fisica", rotulo: "Física" },
      { valor: "humanas", rotulo: "Geografia e História" },
      { valor: "", rotulo: "Tanto faz" },
    ],
  },
];

export type Respostas = Partial<Record<IdIntencao, string>>;

export type ResultadoConcurso = {
  concurso: Concurso;
  pontos: number;
  /** Por que este concurso apareceu. Uma frase por critério que casou. */
  motivos: string[];
  /** A faixa de referência não comporta a idade informada. */
  foraDaFaixa: boolean;
};

export type Diagnostico = {
  /** Os que melhor casam. Mais de um quando empatam: empate é informação. */
  recomendados: ResultadoConcurso[];
  /** Os demais, em ordem, para quem quiser comparar. */
  demais: ResultadoConcurso[];
  /** Nenhuma resposta pontuou: o visitante não declarou preferência. */
  semPreferencia: boolean;
  /** A idade sozinha já reduziu o campo, sem nenhuma preferência declarada. */
  restringidoPorIdade: boolean;
  /** Qual pergunta, se respondida, mais afinaria o resultado. */
  perguntaQueAfina: IdIntencao | null;
  /** A idade informada está fora de todas as faixas de referência. */
  todosForaDaFaixa: boolean;
  /** Ainda não tem idade mínima, mas terá. */
  aindaJovem: boolean;
};

/** Idade representativa de cada opção, para comparar com a faixa. */
const idadePorOpcao: Record<string, number | null> = {
  ate16: 16,
  "17a22": 20,
  "23": 23,
  "24": 24,
  "25mais": 25,
};

/**
 * Pesos. A força é o sinal mais forte porque é uma escolha de vida; a patente
 * vem depois porque separa carreiras dentro da mesma força; a disciplina é
 * desempate, não decisão. "Tanto faz" não pontua e não penaliza.
 */
const PESO_FORCA = 3;
const PESO_PATENTE = 2;
const PESO_PROVA = 1;

export function diagnosticar(respostas: Respostas): Diagnostico {
  // `?? null` porque `noUncheckedIndexedAccess` faz o acesso indexado devolver
  // `undefined` também. Chave desconhecida vira "sem idade informada", que é o
  // comportamento seguro: não elimina ninguém.
  const idade = (respostas.idade ? idadePorOpcao[respostas.idade] : null) ?? null;
  const aindaJovem = respostas.idade === "ate16";

  const avaliados: ResultadoConcurso[] = concursos.map((concurso) => {
    const motivos: string[] = [];
    let pontos = 0;

    if (respostas.forca && concurso.forca === respostas.forca) {
      pontos += PESO_FORCA;
      motivos.push(`Forma para a área que você escolheu.`);
    }

    const patente = patenteDe(concurso);
    if (respostas.patente && patente && patente === respostas.patente) {
      pontos += PESO_PATENTE;
      if (concurso.voceVira) motivos.push(`Você se forma ${concurso.voceVira.valor}.`);
    }

    const disciplinas = concurso.disciplinasProva?.valor ?? [];
    const temFisica = disciplinas.includes("Física");
    const temHumanas = disciplinas.includes("Geografia") || disciplinas.includes("História");
    if (respostas.prova === "fisica" && temFisica) {
      pontos += PESO_PROVA;
      motivos.push("A prova cobra Física, que é onde você se dá melhor.");
    }
    if (respostas.prova === "humanas" && temHumanas) {
      pontos += PESO_PROVA;
      motivos.push("É a única das quatro que cobra Geografia e História.");
    }

    const faixa = faixaEmNumeros(concurso);
    // `aindaJovem` não elimina ninguém: quem tem 16 vai ter 17.
    const foraDaFaixa =
      !aindaJovem && idade !== null && faixa !== null && (idade < faixa.min || idade > faixa.max);

    return { concurso, pontos, motivos, foraDaFaixa };
  });

  const dentro = avaliados.filter((a) => !a.foraDaFaixa);
  const fora = avaliados.filter((a) => a.foraDaFaixa);
  const todosForaDaFaixa = dentro.length === 0;

  const ordenar = (lista: ResultadoConcurso[]) => [...lista].sort((a, b) => b.pontos - a.pontos);
  const ordenados = ordenar(dentro);
  const melhor = ordenados[0]?.pontos ?? 0;
  const semPreferencia = melhor === 0;

  // A idade sozinha já é resposta. Se ninguém pontuou mas a faixa eliminou
  // alguém, o que sobrou É o resultado, e o motivo é a própria idade. Sem isto,
  // quem tem 24 anos e responde "tanto faz" em tudo ouviria "não apontou um
  // caminho", quando na prática só a EEAR está ao alcance dele.
  const restringidoPorIdade = semPreferencia && dentro.length > 0 && fora.length > 0;

  // Empate é informação, não problema a resolver: se duas escolas servem igual,
  // dizer as duas com o motivo é mais honesto que sortear uma.
  const recomendados: ResultadoConcurso[] = restringidoPorIdade
    ? ordenados.map((r) => ({
        ...r,
        motivos: ["A faixa de referência comporta a idade que você informou."],
      }))
    : semPreferencia
      ? []
      : ordenados.filter((r) => r.pontos === melhor);

  const naoRecomendados = ordenados.filter((r) => !recomendados.includes(r));
  const demais = restringidoPorIdade
    ? ordenar(fora)
    : semPreferencia
      ? [...ordenados, ...ordenar(fora)]
      : [...naoRecomendados, ...ordenar(fora)];

  // Quando sobra mais de um caminho, dizer qual pergunta o afinaria vale mais
  // que repetir "converse com a gente": é a única saída acionável sozinha.
  const perguntaQueAfina: IdIntencao | null =
    recomendados.length > 1 || semPreferencia
      ? !respostas.forca
        ? "forca"
        : !respostas.patente
          ? "patente"
          : !respostas.prova
            ? "prova"
            : null
      : null;

  return {
    recomendados,
    demais,
    semPreferencia,
    restringidoPorIdade,
    todosForaDaFaixa,
    aindaJovem,
    perguntaQueAfina,
  };
}

/** Terminou de responder as quatro. */
export function completo(respostas: Respostas): boolean {
  return perguntas.every((p) => respostas[p.id] !== undefined);
}
