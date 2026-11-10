"use client";

import { useState } from "react";
import Link from "next/link";
import {
  perguntas,
  diagnosticar,
  completo,
  type Respostas,
  type ResultadoConcurso,
  type IdIntencao,
  type Diagnostico as ResultadoDiagnostico,
} from "@/content/diagnostico";
import { forcaLabels } from "@/content/concursos";
import { whatsappLink, conversionMessages } from "@/content/conversion";
import { Lozenge, OrnamentRule } from "@/components/decorative/Ornament";
import { WhatsAppIcon } from "@/components/decorative/icons";
import { cn } from "@/lib/cn";

/**
 * DIAGNÓSTICO — as quatro perguntas e o resultado.
 *
 * TUDO NUMA TELA, sem passo a passo. Um assistente de quatro etapas seria mais
 * "produto" e pior de usar: obriga a avançar para trocar de ideia, esconde
 * quanto falta e quebra para quem navega por teclado ou leitor de tela. Quatro
 * grupos de rádio numa página só respondem-se mais rápido no celular, que é
 * onde este link vai ser aberto.
 *
 * SEM BOTÃO DE ENVIAR. O resultado aparece sozinho quando a quarta resposta
 * entra, porque não há nada para enviar: a conta acontece aqui, no navegador.
 * Um botão "calcular" seria um controle que não faz nada além do que a última
 * resposta já fez.
 *
 * NADA SAI DAQUI. Sem `fetch`, sem armazenamento, sem nome, e-mail ou telefone.
 * O estado morre quando a aba fecha. É o que mantém a D-18 de pé: continua sem
 * formulário, sem backend e sem dado pessoal.
 */
export function Diagnostico() {
  const [respostas, setRespostas] = useState<Respostas>({});
  const pronto = completo(respostas);
  const resultado = pronto ? diagnosticar(respostas) : null;

  const responder = (id: keyof Respostas, valor: string) =>
    setRespostas((atual) => ({ ...atual, [id]: valor }));

  const respondidas = perguntas.filter((p) => respostas[p.id] !== undefined).length;

  return (
    <div>
      {/* Progresso como informação, não como enfeite: quem está no celular
          precisa saber que são quatro e não quarenta. */}
      <p className="text-inscription text-[0.8125rem] text-fg-subtle" aria-live="polite">
        {respondidas} de {perguntas.length} respondidas
      </p>

      <div className="mt-8 flex flex-col gap-10">
        {perguntas.map((pergunta, i) => (
          <fieldset key={pergunta.id} className="border-t border-hairline pt-7">
            <legend className="sr-only">{pergunta.enunciado}</legend>

            <div className="flex items-baseline gap-3.5">
              <span aria-hidden className="text-inscription text-[0.8125rem] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[length:var(--text-h4)] leading-snug" aria-hidden>
                {pergunta.enunciado}
              </p>
            </div>

            {pergunta.ajuda ? (
              <p className="mt-2.5 max-w-[56ch] pl-[2.25rem] text-[length:var(--text-body-sm)] text-fg-subtle">
                {pergunta.ajuda}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col gap-2.5 pl-[2.25rem]">
              {pergunta.opcoes.map((opcao) => {
                const marcada = respostas[pergunta.id] === opcao.valor;
                return (
                  <label
                    key={opcao.rotulo}
                    className={cn(
                      "flex cursor-pointer items-start gap-3.5 rounded-[var(--radius-sm)] border px-4 py-3.5 transition-colors duration-[var(--duration-fast)]",
                      // O radio real é `sr-only`, então o anel de foco do
                      // navegador cairia num elemento invisível e quem navega
                      // por teclado não veria onde está. `has-[:focus-visible]`
                      // traz o anel para a caixa que a pessoa realmente enxerga.
                      "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-focus)]",
                      marcada
                        ? "border-accent bg-surface-elevated"
                        : "border-border hover:border-fg-muted",
                    )}
                  >
                    <input
                      type="radio"
                      name={pergunta.id}
                      value={opcao.valor}
                      checked={marcada}
                      onChange={() => responder(pergunta.id, opcao.valor)}
                      className="sr-only"
                    />
                    {/* O losango é o próprio marcador de seleção: o vocabulário
                        do site já tem um, então não entra um radio de sistema. */}
                    <Lozenge
                      className={cn(
                        "mt-[0.45rem] shrink-0 text-[0.5rem] transition-opacity duration-[var(--duration-fast)]",
                        marcada ? "text-accent opacity-100" : "text-fg-subtle opacity-30",
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block">{opcao.rotulo}</span>
                      {opcao.nota ? (
                        <span className="mt-1 block text-[length:var(--text-body-sm)] text-fg-subtle">
                          {opcao.nota}
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {/* `aria-live` porque o resultado aparece sem que nada seja clicado: quem
          usa leitor de tela precisa ser avisado de que a página mudou. */}
      <div aria-live="polite">
        {resultado ? (
          <Resultado
            key={chaveDoResultado(resultado)}
            recomendados={resultado.recomendados}
            demais={resultado.demais}
            semPreferencia={resultado.semPreferencia}
            restringidoPorIdade={resultado.restringidoPorIdade}
            perguntaQueAfina={resultado.perguntaQueAfina}
            todosForaDaFaixa={resultado.todosForaDaFaixa}
            aindaJovem={resultado.aindaJovem}
            onRecomecar={() => setRespostas({})}
          />
        ) : null}
      </div>
    </div>
  );
}

/**
 * A chave que remonta o resultado, e com ela a animação de entrada.
 *
 * É o TEXTO QUE A PESSOA LÊ, não as respostas. Trocar uma resposta que não muda
 * a recomendação não replica a entrada: o movimento aqui avisa que o resultado
 * mudou, e o losango da opção já confirmou o clique. Amarrar às respostas faria
 * o bloco inteiro assentar de novo a cada toque, que é animação de template.
 */
function chaveDoResultado(r: ResultadoDiagnostico): string {
  return [
    r.recomendados.map((x) => x.concurso.slug).join(","),
    r.semPreferencia,
    r.restringidoPorIdade,
    r.todosForaDaFaixa,
    r.aindaJovem,
  ].join("|");
}

function Resultado({
  recomendados,
  demais,
  semPreferencia,
  restringidoPorIdade,
  perguntaQueAfina,
  todosForaDaFaixa,
  aindaJovem,
  onRecomecar,
}: {
  recomendados: ResultadoConcurso[];
  demais: ResultadoConcurso[];
  semPreferencia: boolean;
  restringidoPorIdade: boolean;
  perguntaQueAfina: IdIntencao | null;
  todosForaDaFaixa: boolean;
  aindaJovem: boolean;
  onRecomecar: () => void;
}) {
  const siglas = recomendados.map((r) => r.concurso.sigla);

  const mensagem =
    siglas.length > 0
      ? conversionMessages.diagnostico(siglas)
      : conversionMessages.diagnosticoSemResultado;

  // Título pela CONTAGEM, não por caso fixo. A primeira versão dizia "Duas
  // combinam igual" sempre que não fosse uma só, e o teste de todas as 180
  // combinações mostrou empates de três: quem responde "ainda não sei" na força
  // mas escolhe "oficial" casa com EsPCEx, AFA e EFOMM ao mesmo tempo.
  const lista = siglas.length > 1 ? `${siglas.slice(0, -1).join(", ")} e ${siglas.at(-1)}` : "";
  const titulo = todosForaDaFaixa
    ? "Pelas faixas de referência, nenhuma das quatro."
    : restringidoPorIdade
      ? siglas.length === 1
        ? `Pela idade, sobra a ${siglas[0]}.`
        : `Pela idade, sobram ${lista}.`
      : semPreferencia
        ? "Suas respostas não apontaram um caminho só."
        : siglas.length === 1
          ? `A ${siglas[0]} é a que mais combina.`
          : `Combinam igual: ${lista}.`;

  return (
    <section className="assenta mt-16" aria-labelledby="resultado-diagnostico">
      <OrnamentRule className="mb-10" />

      <p className="text-label-caps text-fg-subtle">Resultado</p>
      <h2
        id="resultado-diagnostico"
        className="mt-4 max-w-[22ch] text-[length:var(--text-h2)] leading-tight"
      >
        {titulo}
      </h2>

      {aindaJovem ? (
        <p className="mt-6 max-w-[60ch] text-[length:var(--text-body-lg)] text-fg-muted">
          As quatro começam aos 17 anos, então nenhuma está fora do seu alcance: você ainda vai
          chegar lá. Dá para começar a preparação antes, e é o que a maioria faz.
        </p>
      ) : null}

      {todosForaDaFaixa ? (
        <p className="mt-6 max-w-[60ch] text-[length:var(--text-body-lg)] text-fg-muted">
          As faixas que temos aqui são referência do material institucional, não do edital, e a
          regra de idade muda a cada edição e depende da data de corte. Se o seu caso está no
          limite, vale confirmar no edital vigente antes de descartar.
        </p>
      ) : semPreferencia ? (
        <p className="mt-6 max-w-[60ch] text-[length:var(--text-body-lg)] text-fg-muted">
          Você respondeu &ldquo;ainda não sei&rdquo; onde estava a decisão, e isso é uma resposta
          legítima: escolher força e carreira é o passo difícil. Abaixo estão as quatro, e a
          conversa serve exatamente para isso.
        </p>
      ) : (
        <ul className="mt-10 flex flex-col gap-6">
          {recomendados.map((r) => (
            <li key={r.concurso.slug}>
              <CartaoResultado resultado={r} destaque />
            </li>
          ))}
        </ul>
      )}

      {/* Sobrando mais de um caminho, dizer QUAL pergunta afinaria vale mais
          que repetir "fale com a gente": é a única saída que a pessoa resolve
          sozinha, ali mesmo, subindo a página. */}
      {perguntaQueAfina && !todosForaDaFaixa ? (
        <p className="mt-8 max-w-[58ch] text-[length:var(--text-body-sm)] text-fg-subtle">
          {perguntaQueAfina === "forca"
            ? "Se você decidir em qual área quer trabalhar, o resultado fica mais específico."
            : perguntaQueAfina === "patente"
              ? "Se você decidir entre oficial e sargento, o resultado fica mais específico."
              : "Se você escolher entre Física e Geografia com História, o resultado fica mais específico."}
        </p>
      ) : null}

      {demais.length > 0 ? (
        <div className="mt-14">
          <h3 className="text-label-caps text-fg-subtle">
            {semPreferencia || todosForaDaFaixa ? "As quatro escolas" : "As outras, para comparar"}
          </h3>
          <ul className="mt-6 flex flex-col gap-4">
            {demais.map((r) => (
              <li key={r.concurso.slug}>
                <CartaoResultado resultado={r} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-12 max-w-[64ch] text-[length:var(--text-caption)] text-fg-subtle">
        Isto é uma orientação inicial, montada a partir de material institucional, e não substitui o
        edital. Idade, escolaridade e conteúdo mudam a cada edição. Confirme sempre no edital
        oficial vigente.
      </p>

      <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <a
          href={whatsappLink(mensagem)}
          target="_blank"
          rel="noopener noreferrer"
          data-touch-target
          data-cta="cta_whatsapp"
          data-cta-section="diagnostico"
          className="btn-base btn-primary"
        >
          Conversar sobre esse caminho
          <WhatsAppIcon className="size-4 shrink-0 opacity-70" />
          <span className="sr-only">(abre o WhatsApp em nova aba)</span>
        </a>

        <button type="button" onClick={onRecomecar} className="btn-base btn-ghost btn-sm">
          Responder de novo
        </button>
      </div>
    </section>
  );
}

function CartaoResultado({
  resultado,
  destaque = false,
}: {
  resultado: ResultadoConcurso;
  destaque?: boolean;
}) {
  const { concurso: c, motivos, foraDaFaixa } = resultado;
  const cor = `var(${c.accentToken})`;

  return (
    <Link
      href={`/concursos/${c.slug}`}
      data-touch-target
      className={cn(
        "block card-interactive card-surface p-6 sm:p-7",
        destaque && "p-7 sm:p-9",
        foraDaFaixa && "opacity-70",
      )}
      style={{ ["--concurso" as string]: cor }}
    >
      <div className="flex items-center gap-2.5">
        <Lozenge className="text-[0.875rem]" style={{ color: "var(--concurso)" }} />
        <span
          className={cn(
            "text-inscription text-fg",
            destaque ? "text-[1.375rem]" : "text-[1.0625rem]",
          )}
        >
          {c.sigla}
        </span>
        <span className="ml-auto text-label-caps text-[0.625rem] text-fg-subtle">
          {forcaLabels[c.forca]}
        </span>
      </div>

      <p className="mt-2.5 text-editorial-italic leading-snug text-fg-muted">{c.nomeCompleto}</p>

      {destaque && motivos.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-2.5 border-t border-hairline pt-6">
          {motivos.map((m) => (
            <li key={m} className="flex items-baseline gap-3 text-fg-muted">
              <Lozenge className="shrink-0 translate-y-[-1px] text-[0.5rem] text-accent" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {foraDaFaixa && c.faixaEtaria ? (
        <p className="mt-4 text-[length:var(--text-body-sm)] text-fg-subtle">
          Faixa de referência: {c.faixaEtaria.valor}. Confirme no edital.
        </p>
      ) : null}
    </Link>
  );
}
