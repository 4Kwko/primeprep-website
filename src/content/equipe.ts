import type { Disciplina, Professor } from "@/types/content";

/** Somente credenciais fornecidas pelo cliente. Não acrescentar por inferência. */
export const professores: Professor[] = [
  {
    slug: "joao-vitor-melo-montagner",
    nome: "João Vitor Mello Montagner",
    papeis: ["Professor de Inglês", "Coordenação administrativa"],
    disciplinas: ["ingles"],
    credenciais: ["MET C1", "ECPE C2", "Graduando em Análise e Desenvolvimento de Sistemas"],
    retrato: null,
  },
  // Na versão pública do repositório, nome e formação dos outros professores
  // foram omitidos: são dados de terceiros publicados sem consentimento verificado.
  {
    slug: "professor-matematica-fisica",
    nome: "Professor de Matemática e Física",
    papeis: ["Professor de Matemática", "Professor de Física"],
    disciplinas: ["matematica", "fisica"],
    credenciais: ["Nome e formação omitidos na versão pública"],
    retrato: null,
  },
  {
    slug: "professora-portugues",
    nome: "Professora de Português",
    papeis: ["Professora de Português"],
    disciplinas: ["portugues"],
    credenciais: ["Nome e formação omitidos na versão pública"],
    retrato: null,
  },
];

export const disciplinas: Disciplina[] = [
  { slug: "matematica", nome: "Matemática" },
  { slug: "fisica", nome: "Física" },
  { slug: "portugues", nome: "Português" },
  { slug: "ingles", nome: "Inglês" },
];
