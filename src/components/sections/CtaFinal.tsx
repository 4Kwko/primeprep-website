import type { Concurso } from "@/types/content";
import { site } from "@/lib/site";
import { Cta } from "@/components/ui/Cta";
import { OrnamentRule } from "@/components/decorative/Ornament";
import { Marca } from "@/components/layout/Wordmark";
import { Reveal } from "@/components/motion/Reveal";

/**
 * FECHAMENTO — alta intenção. Encerra a Home e cada página interna.
 *
 * Hierarquia fixa: matrícula (primário) > WhatsApp (secundário) > bolsa
 * (fantasma). O Instagram NÃO compete aqui — vive no footer, logo abaixo.
 *
 * Sem urgência artificial. O convite é para uma conversa porque é literalmente
 * o que acontece: matrícula e bolsa ainda desembocam no WhatsApp com a intenção
 * declarada na mensagem.
 */
export function CtaFinal({
  titulo = "O primeiro passo é uma conversa.",
  lead,
  concurso,
  labelPrimario,
  section = "fechamento",
  mostrarBolsa = true,
}: {
  titulo?: string;
  lead?: string;
  /** Contextualiza a mensagem inicial e o rótulo do CTA primário. */
  concurso?: Pick<Concurso, "sigla">;
  labelPrimario?: string;
  section?: string;
  mostrarBolsa?: boolean;
}) {
  const leadPadrao = `Diga qual concurso está no seu horizonte e onde você está hoje. O plano é montado a partir daí, presencialmente em ${site.city}/${site.state}.`;

  return (
    <section data-surface="navy" className="secao-composta section">
      {/* PLANO 2 — a águia como assinatura de fecho, centrada atrás do título.
          O livro NUNCA aparece isolado (ver Wordmark.tsx).
          Sem `parallax-centrado`: essa variante não existe mais, porque o
          Tailwind centraliza pela propriedade `translate` e o keyframe usa
          `transform`. As duas se somam, então `pp-parallax` sozinho já convive
          com a centralização. Repetir o -50% no keyframe deslocava a marca
          100% da própria largura para a esquerda. */}
      <Marca
        variacao="aguia"
        altura="6rem"
        className="parallax-meio plano-meio left-1/2 -translate-x-1/2 text-fg marca-dagua"
        style={{ top: "13%" }}
      />

      <div className="plano-frente container-content text-center">
        <Reveal>
          <OrnamentRule className="mx-auto max-w-sm" />

          <h2 className="mx-auto mt-10 max-w-[20ch] text-[length:var(--text-h2)]">{titulo}</h2>

          <p className="mx-auto mt-6 max-w-[52ch] text-[length:var(--text-body-lg)] text-fg-muted">
            {lead ?? leadPadrao}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Cta
              intent="matricula"
              variant="primary"
              section={section}
              {...(concurso ? { concurso } : {})}
              {...(labelPrimario ? { label: labelPrimario } : {})}
            />
            <Cta intent="whatsapp" variant="secondary" section={section} />
          </div>

          {mostrarBolsa ? (
            <p className="mt-7">
              <Cta
                intent="bolsa"
                variant="ghost"
                size="sm"
                label="Ou pergunte sobre bolsas"
                section={section}
              />
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
