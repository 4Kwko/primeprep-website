import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LogEntry } from "@/components/layout/LogEntry";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Cta } from "@/components/ui/Cta";
import { Reveal } from "@/components/motion/Reveal";
import { Lozenge } from "@/components/decorative/Ornament";
import { LaurelIcon } from "@/components/decorative/icons";

export const metadata: Metadata = {
  title: "Bolsas",
  description:
    "A Prime Prep concede bolsas por desempenho, com possibilidade de critérios socioeconômicos. As regras dependem de definição oficial e são tratadas caso a caso.",
  alternates: { canonical: "/bolsas" },
  openGraph: {
    title: "Bolsas · Prime Prep",
    description: "Existem possibilidades de bolsa. Converse com a gente para entender o seu caso.",
    url: "/bolsas",
  },
};

/**
 * PÁGINA DE BOLSAS — a mais sensível do site.
 *
 * O processo NÃO está definido. Não existe percentual, número de bolsas, prazo,
 * critério detalhado, documento exigido, forma de classificação nem garantia de
 * concessão — e nada disso pode ser inventado.
 *
 * A página afirma apenas o que foi confirmado: que existem possibilidades, que
 * podem envolver desempenho e/ou critérios socioeconômicos, e que as regras
 * dependem de definição oficial. O restante é dito explicitamente como ainda
 * não definido, o que é mais honesto — e mais útil — do que silêncio.
 *
 * Fluxo SEPARADO de matrícula: o CTA primário aqui é `bolsa`, não `matricula`.
 */
export default function BolsasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Bolsas"
        titulo="Desempenho e situação de vida entram na conta."
        lead="A Prime Prep concede bolsas por desempenho, e há possibilidade de critérios socioeconômicos. Se o custo é o que está no caminho, vale conversar antes de desistir."
      >
        {/* Coluna direita do cabeçalho em lg (ver PageHeader). */}
        <div className="mt-9 lg:mt-0">
          <Cta
            intent="bolsa"
            variant="primary"
            label="Quero saber sobre bolsas"
            section="cabecalho-bolsas"
          />
        </div>
      </PageHeader>

      <section data-surface="bone" className="section">
        <div className="container-wide">
          <LogEntry numero="01" rotulo="O que existe">
            <Reveal>
              <LaurelIcon className="size-8 text-accent" />
              <h2 className="mt-6 max-w-[22ch] text-[length:var(--text-h2)]">
                Dois caminhos possíveis.
              </h2>

              {/* GLOSSÁRIO, NÃO CARTÕES. São duas definições de duas palavras
                  cada, e antes cada uma vinha dentro de um cartão elevado
                  idêntico ao outro: dois objetos flutuando para dizer duas
                  frases. Termo à esquerda, definição à direita, régua entre as
                  duas. A forma agora corresponde ao conteúdo, e é `<dl>` de
                  verdade, então também corresponde para quem usa leitor de tela. */}
              <dl className="mt-10 border-t border-border">
                <div className="grid gap-3 border-b border-hairline py-8 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-12">
                  <dt className="text-[length:var(--text-h4)] leading-snug">
                    Bolsa por desempenho
                  </dt>
                  <dd className="max-w-[62ch] text-fg-muted">
                    Concedida com base no desempenho do aluno. É o reconhecimento de quem sustenta
                    um resultado ao longo da preparação, e é coerente com o método: aqui o
                    desempenho já é registrado e acompanhado de qualquer forma.
                  </dd>
                </div>

                <div className="grid gap-3 border-b border-hairline py-8 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-12">
                  <dt className="text-[length:var(--text-h4)] leading-snug">
                    Critérios socioeconômicos
                  </dt>
                  <dd className="max-w-[62ch] text-fg-muted">
                    Existe a possibilidade de bolsas considerando a situação socioeconômica da
                    família. Casos assim são tratados individualmente, em conversa direta.
                  </dd>
                </div>
              </dl>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <section data-surface="navy" className="section">
        <div className="container-wide">
          <LogEntry numero="02" rotulo="O que ainda não está definido">
            <Reveal>
              <h2 className="max-w-[24ch] text-[length:var(--text-h2)]">
                Prefiro dizer o que não sei.
              </h2>
              <p className="mt-6 max-w-[62ch] text-[length:var(--text-body-lg)] text-fg-muted">
                As regras específicas dependem de definição oficial e ainda não estão fechadas. Em
                vez de publicar um número que pode mudar, esta página lista o que está em aberto, e
                o convite é conversar sobre o seu caso concreto.
              </p>

              <ul className="mt-10 flex flex-col">
                {[
                  "Percentual de desconto",
                  "Quantidade de bolsas disponíveis",
                  "Prazos e período de inscrição",
                  "Critérios exatos de concessão e de classificação",
                  "Documentos exigidos",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 border-t border-hairline py-4 last:border-b"
                  >
                    <Lozenge className="shrink-0 text-[0.5rem] text-fg-subtle" />
                    <span className="text-fg-muted">{item}</span>
                    <span className="ml-auto text-label-caps text-[0.625rem] text-fg-subtle">
                      A definir
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-8 max-w-[66ch] text-[length:var(--text-caption)] text-fg-subtle">
                Nenhuma informação desta página garante a concessão de bolsa. A avaliação é feita
                caso a caso e depende das regras que vierem a ser definidas.
              </p>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <section data-surface="bone" className="section-sm">
        <div className="container-wide">
          <LogEntry numero="03" rotulo="Como pedir">
            <Reveal>
              <h2 className="max-w-[24ch] text-[length:var(--text-h3)]">
                Uma mensagem, e a conversa começa.
              </h2>
              <p className="mt-5 max-w-[58ch] text-fg-muted">
                Não há formulário nem processo burocrático. Você manda uma mensagem dizendo que tem
                interesse em bolsa, conta a sua situação, e a gente responde o que dá para fazer.
              </p>
              <div className="mt-8">
                <Cta
                  intent="bolsa"
                  variant="primary"
                  label="Quero saber sobre bolsas"
                  section="bolsas-como-pedir"
                />
              </div>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <CtaFinal
        titulo="Bolsa e matrícula são conversas diferentes."
        lead="Se você já decidiu entrar, comece pela matrícula. Se o que pesa é o custo, comece pela bolsa. Os dois caminhos levam à mesma equipe."
        section="fechamento-bolsas"
      />
    </>
  );
}
