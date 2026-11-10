/** Tipos do conteúdo institucional estruturado. Ver src/content/. */

export type Forca = "exercito" | "aeronautica" | "marinha";

export type DisciplinaSlug = "matematica" | "fisica" | "portugues" | "ingles";

/**
 * Dado de edital. NUNCA exibir como definitivo.
 * `verifiedAt: null` => a UI deve marcar como "referência, confirme no edital".
 */
export type DadoReferencia<T> = {
  valor: T;
  /** ISO date da última conferência no edital oficial. */
  verifiedAt: string | null;
};

export type Concurso = {
  slug: string;
  /** Sigla, como aparece na navegação. */
  sigla: string;
  /** Nome por extenso — renderizado em itálico editorial. */
  nomeCompleto: string;
  forca: Forca;
  /** Token de cor de contexto (var(--color-arma-*)). */
  accentToken: string;
  /** Cargo que o aprovado assume, como consta no material do cliente. */
  voceVira: DadoReferencia<string> | null;
  /** Resumo curto do que o aprovado se torna. */
  resumo: string | null;
  faixaEtaria: DadoReferencia<string> | null;
  escolaridade: DadoReferencia<string> | null;
  local: DadoReferencia<string> | null;
  remuneracaoInicial: DadoReferencia<string> | null;
  disciplinasProva: DadoReferencia<string[]> | null;
  /** Caminho do brasão em /public/assets/brand/brasoes/ — null = asset ausente. */
  brasao: string | null;
};

export type Professor = {
  slug: string;
  nome: string;
  papeis: string[];
  disciplinas: DisciplinaSlug[];
  credenciais: string[];
  /** Caminho do retrato — null enquanto não houver foto fornecida. */
  retrato: string | null;
};

export type Disciplina = {
  slug: DisciplinaSlug;
  nome: string;
};

export type Diferencial = {
  slug: string;
  titulo: string;
  descricao: string;
  /** Nome do ícone da família outline interna. */
  icone: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

/* REMOVIDO: `FaqItem`.
   O site não tem FAQ e não vai ter por acaso. Um tipo parado aqui sugere que a
   seção está planejada, e FAQ genérico ("meus dados estão seguros?", "posso
   cancelar quando quiser?") é justamente um dos padrões que a direção veta.
   Se um dia existirem perguntas reais, feitas por gente real, o tipo volta com
   elas. */
