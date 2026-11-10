import Link from "next/link";
import { concursos } from "@/content/concursos";
import { PageHeader } from "@/components/layout/PageHeader";
import { Lozenge } from "@/components/decorative/Ornament";
import { Cta } from "@/components/ui/Cta";

/**
 * 404. Em vez de um beco sem saída, oferece as rotas que o visitante
 * provavelmente procurava — os concursos são a unidade de navegação do site.
 */
export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="Página não encontrada"
        titulo="Esta página não existe."
        lead="O endereço que você abriu não foi encontrado, ou deixou de existir. Abaixo estão os caminhos mais procurados."
      >
        <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link href="/" data-touch-target className="btn-base btn-secondary">
            Voltar para o início
          </Link>
          <Cta intent="whatsapp" variant="ghost" label="Tirar uma dúvida" section="404" />
        </div>
      </PageHeader>

      <section data-surface="bone" className="section-sm">
        <div className="container-wide">
          <h2 className="text-label-caps text-fg-subtle">Concursos atendidos</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {concursos.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/concursos/${c.slug}`}
                  data-touch-target
                  className="flex card-interactive items-center gap-2.5 card-surface px-4 py-3.5"
                >
                  <Lozenge
                    className="shrink-0 text-[0.5625rem]"
                    style={{ color: `var(${c.accentToken})` }}
                  />
                  <span className="text-inscription text-[0.9375rem]">{c.sigla}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
