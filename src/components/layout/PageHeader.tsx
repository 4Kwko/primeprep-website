import { cn } from "@/lib/cn";
import { GraphicField, Lozenge } from "@/components/decorative/Ornament";
import { Marca } from "@/components/layout/Wordmark";

/**
 * Abertura das páginas internas.
 *
 * A Home abre com o `Hero` (composição própria, assimétrica). As internas abrem
 * com este cabeçalho: mesma superfície navy, mesma linguagem, escala menor —
 * uma entrada de capítulo, não uma segunda capa. Isso mantém a Home como a
 * única página com peso de abertura total.
 *
 * DUAS COMPOSIÇÕES, DECIDIDAS PELO CONTEÚDO
 * Sem carga extra, o cabeçalho é uma coluna só: rótulo, título, lead. Com carga
 * (`children`: um CTA, a força do concurso, uma ficha), ele vira duas colunas em
 * `lg`, com o texto à esquerda e a carga ancorada à base da direita. Antes essa
 * carga era empilhada embaixo do lead, e o resultado era que as seis páginas
 * internas abriam exatamente iguais. O critério não é estético: quem tem algo a
 * mais para oferecer no cabeçalho ganha a coluna; quem não tem, não ganha.
 *
 * `marcadorCor` recebe a cor de contexto nas páginas de concurso; nas demais o
 * losango sai em ouro. `marcadores` recebe VÁRIAS cores e existe para o hub
 * `/concursos`, onde o cabeçalho anuncia as quatro forças de uma vez — é a única
 * página cujo assunto é o conjunto, e o rótulo mostra isso.
 */
export function PageHeader({
  eyebrow,
  titulo,
  lead,
  marcadorCor,
  marcadores,
  children,
  className,
}: {
  /** Rótulo inscricional curto — máximo 4 palavras. */
  eyebrow: string;
  titulo: React.ReactNode;
  lead?: string;
  /** `var(--color-arma-*)` nas páginas de concurso. */
  marcadorCor?: string;
  /** Várias cores de contexto, uma por losango. Usado no hub `/concursos`. */
  marcadores?: string[];
  /** Carga do cabeçalho (CTA, ficha). Presente, vira a coluna da direita. */
  children?: React.ReactNode;
  className?: string;
}) {
  const temAparte = Boolean(children);
  return (
    <section
      data-surface="navy"
      className={cn("secao-composta pt-28 pb-[var(--space-section-sm)] lg:pt-36", className)}
    >
      <div className="plano-fundo">
        <GraphicField className="static" />
      </div>

      {/* Marca no midground, bem menor que a do hero: as internas são páginas de
          leitura, e a Home é que carrega a aplicação mais forte da identidade. */}
      <Marca
        variacao="aguia"
        altura="5.5rem"
        className="parallax-marca plano-meio hidden text-fg marca-dagua marca-fuga-direita lg:block"
        style={{ top: "42%", right: "-4rem" }}
      />

      <div
        className={cn(
          "plano-frente container-wide",
          temAparte && "grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16",
        )}
      >
        <div>
          <p className="flex items-center gap-3 text-inscription text-accent">
            {marcadores ? (
              <span className="flex items-center gap-1.5">
                {marcadores.map((cor) => (
                  <Lozenge key={cor} className="text-[0.6875rem]" style={{ color: cor }} />
                ))}
              </span>
            ) : (
              <Lozenge
                className="text-[0.6875rem]"
                {...(marcadorCor ? { style: { color: marcadorCor } } : {})}
              />
            )}
            {eyebrow}
          </p>

          <h1 className="mt-6 max-w-[20ch] text-[length:var(--text-h1)] leading-[1.05]">
            {titulo}
          </h1>

          {lead ? (
            <p className="mt-7 max-w-[58ch] text-[length:var(--text-body-lg)] text-fg-muted">
              {lead}
            </p>
          ) : null}
        </div>

        {temAparte ? <div className="lg:pb-1.5">{children}</div> : null}
      </div>
    </section>
  );
}
