import Link from "next/link";
import { concursos, forcaLabels } from "@/content/concursos";
import { Lozenge } from "@/components/decorative/Ornament";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/motion/Reveal";

/**
 * TABELA COMPARATIVA — o ativo de conteúdo mais forte do material do cliente
 * (a tela final do carrossel "Você quer ser militar?").
 *
 * Responde à única pergunta que o visitante realmente traz ao hub: *qual desses
 * serve para mim?* Por isso é comparação lado a lado, não quatro fichas soltas.
 *
 * - `≥ md`: `<table>` de verdade, com `<th scope>` — é dado tabular, o elemento
 *   semântico correto. Cabeçalho navy, linhas zebradas.
 * - `< md`: converte em cartões com pares rótulo/valor. **Não é scroll
 *   horizontal**: rolar lateralmente uma tabela de cinco colunas esconde
 *   informação e é o pior caminho no celular, que é o caso base aqui.
 *
 * Todo dado tem `verifiedAt: null`, então a nota de referência é obrigatória.
 */
const colunas = [
  { chave: "voceVira", rotulo: "Você vira" },
  { chave: "faixaEtaria", rotulo: "Idade" },
  { chave: "escolaridade", rotulo: "Escolaridade" },
  { chave: "local", rotulo: "Onde" },
  { chave: "remuneracaoInicial", rotulo: "Remuneração inicial" },
] as const;

function valorDe(c: (typeof concursos)[number], chave: (typeof colunas)[number]["chave"]) {
  return c[chave]?.valor ?? null;
}

export function TabelaConcursos() {
  return (
    <Reveal>
      {/* Desktop: tabela real. */}
      {/* `overflow-x-auto`, nunca `hidden`: se algum conteúdo futuro não couber,
          ele rola dentro do bloco em vez de sumir. `table-fixed` + colgroup
          garante que as colunas respeitem o container e o texto quebre —
          layout automático já produziu uma tabela de 1536px dentro de 974px. */}
      <div className="hidden overflow-x-auto rounded-[var(--radius-lg)] border border-border md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[16%]" />
            <col className="w-[11%]" />
            <col className="w-[17%]" />
            <col className="w-[19%]" />
            <col className="w-[22%]" />
          </colgroup>
          <caption className="sr-only">
            Comparativo entre EsPCEx, AFA, EEAR e EFOMM: cargo, idade, escolaridade, local e
            remuneração inicial.
          </caption>
          <thead data-surface="navy">
            <tr className="bg-canvas">
              <th scope="col" className="px-5 py-4 text-label-caps text-fg-subtle">
                Concurso
              </th>
              {colunas.map((col) => (
                <th
                  key={col.chave}
                  scope="col"
                  className="px-5 py-4 text-label-caps text-fg-subtle"
                >
                  {col.rotulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {concursos.map((c, i) => (
              <tr
                key={c.slug}
                className={cn("linha-tabela", i % 2 === 1 && "bg-surface-sunken/50")}
                style={{ ["--concurso" as string]: `var(${c.accentToken})` }}
              >
                <th
                  scope="row"
                  className="border-t border-hairline px-5 py-5 align-top font-normal"
                >
                  <Link
                    href={`/concursos/${c.slug}`}
                    className="group inline-flex flex-col gap-1 transition-colors duration-[var(--duration-fast)] hover:text-accent"
                  >
                    <span className="flex items-center gap-2.5">
                      <Lozenge className="text-[0.6875rem]" style={{ color: "var(--concurso)" }} />
                      <span className="text-inscription text-[1rem]">{c.sigla}</span>
                    </span>
                    <span className="text-[length:var(--text-caption)] text-fg-subtle">
                      {forcaLabels[c.forca]}
                    </span>
                  </Link>
                </th>
                {colunas.map((col) => (
                  <td
                    key={col.chave}
                    className="border-t border-hairline px-5 py-5 align-top text-[length:var(--text-body-sm)] text-fg-muted"
                  >
                    {valorDe(c, col.chave) ?? "não informado"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cartões. Mesma informação, sem scroll lateral. */}
      <ul className="flex flex-col gap-4 md:hidden">
        {concursos.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/concursos/${c.slug}`}
              data-touch-target
              className="block card-interactive card-surface p-5"
              style={{ ["--concurso" as string]: `var(${c.accentToken})` }}
            >
              <span className="flex items-baseline gap-2.5">
                <Lozenge className="text-[0.8125rem]" style={{ color: "var(--concurso)" }} />
                <span className="text-inscription text-[1.125rem] text-fg">{c.sigla}</span>
                <span className="ml-auto text-[length:var(--text-caption)] text-fg-subtle">
                  {forcaLabels[c.forca]}
                </span>
              </span>

              <dl className="mt-4 flex flex-col">
                {colunas.map((col) => {
                  const valor = valorDe(c, col.chave);
                  if (!valor) return null;
                  return (
                    <div
                      key={col.chave}
                      className="flex flex-col gap-0.5 border-t border-hairline py-2.5 last:pb-0"
                    >
                      <dt className="text-label-caps text-[0.625rem] text-fg-subtle">
                        {col.rotulo}
                      </dt>
                      <dd className="text-[length:var(--text-body-sm)] text-fg-muted">{valor}</dd>
                    </div>
                  );
                })}
              </dl>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-[72ch] text-[length:var(--text-caption)] text-fg-subtle">
        Informações reunidas a partir de material institucional, para orientação inicial. Idade,
        escolaridade, local, remuneração e conteúdo da prova mudam a cada edição.{" "}
        <strong className="font-semibold">Confirme sempre no edital oficial vigente.</strong>
      </p>
    </Reveal>
  );
}
