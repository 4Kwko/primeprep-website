import type { Metadata } from "next";
import { concursos } from "@/content/concursos";
import { PageHeader } from "@/components/layout/PageHeader";
import { LogEntry } from "@/components/layout/LogEntry";
import { Diagnostico } from "@/components/sections/Diagnostico";
import { CtaFinal } from "@/components/sections/CtaFinal";

export const metadata: Metadata = {
  title: "Qual concurso militar serve para você",
  description:
    "Quatro perguntas rápidas sobre idade, força, carreira e prova, e o resultado aponta entre EsPCEx, AFA, EEAR e EFOMM. Sem cadastro.",
  alternates: { canonical: "/diagnostico" },
  openGraph: {
    title: "Qual concurso militar serve para você · Prime Prep",
    description: "Quatro perguntas, e você descobre por onde começar. Sem cadastro.",
    url: "/diagnostico",
  },
};

/**
 * DIAGNÓSTICO — a porta de entrada de quem ainda não sabe qual concurso quer.
 *
 * O Princípio 5 do produto diz que a pessoa não pensa "quero um cursinho",
 * pensa "quero passar na EEAR". Boa parte do público chega antes disso, sabendo
 * só que quer carreira militar, e até aqui o site oferecia a ela uma tabela
 * comparativa e boa sorte. Comparar cinco colunas exige saber o que comparar.
 *
 * ROTA PRÓPRIA, E NÃO SEÇÃO. Precisa ser um link que se cola na bio do Instagram
 * e se manda numa conversa. É o caminho mais curto entre o alcance que a Prime
 * Prep já tem e uma conversa com contexto.
 *
 * FORA DO MENU PRINCIPAL, DE PROPÓSITO. A barra já pede 1029px numa caixa de
 * 944px em 1024 (ver D-28), e um sétimo item a quebraria. Entra pelo hub de
 * concursos, pela Home e pelo rodapé, que é por onde alguém em dúvida passa.
 */
export default function DiagnosticoPage() {
  const siglas = concursos.map((c) => c.sigla).join(", ");

  return (
    <>
      <PageHeader
        eyebrow="Diagnóstico"
        titulo="Qual desses é o seu?"
        lead={`Quatro perguntas sobre idade, área, carreira e prova. No fim, o resultado aponta entre ${siglas}, com o motivo de cada indicação. Sem cadastro e sem e-mail: a conta acontece aqui mesmo, no seu navegador.`}
      />

      <section data-surface="bone" className="section">
        <div className="container-wide">
          <LogEntry numero="01" rotulo="Quatro perguntas">
            <Diagnostico />
          </LogEntry>
        </div>
      </section>

      <CtaFinal
        titulo="Decidir junto costuma ser mais rápido."
        lead="Se o resultado deixou dúvida, ou se você ficou entre dois caminhos, é exatamente o tipo de conversa que a gente tem todo dia."
        section="fechamento-diagnostico"
      />
    </>
  );
}
