import Link from "next/link";
import { footerNav } from "@/content/navigation";
import { site } from "@/lib/site";
import { Cta } from "@/components/ui/Cta";
import { Marca } from "@/components/layout/Wordmark";
import { Lozenge, OrnamentRule } from "@/components/decorative/Ornament";
import { InstagramIcon, WhatsAppIcon } from "@/components/decorative/icons";

/**
 * Footer — última entrada do diário, e o outro extremo do header.
 *
 * Superfície `ink`: o contraste máximo do sistema, usado aqui e em nenhum outro
 * lugar da Home (DESIGN.md § Colors). Fecha a página com o mesmo peso
 * institucional com que o hero a abre.
 *
 * OS DOIS EXTREMOS DO MESMO SISTEMA. O header é a marca comprimida: uma faixa,
 * uma linha, a águia a 26px, tudo espremido para caber sobre a leitura. O footer
 * é a mesma marca solta: a versão completa em escala de assinatura, a águia
 * sangrando pela borda ESQUERDA (o hero sangra pela direita, no alto) e ar em
 * volta. Um abre apertado, o outro fecha aberto, e é a mesma identidade.
 *
 * NÃO É UMA GRADE DE QUATRO COLUNAS. Antes era: marca | Institucional |
 * Concursos | Fale com a gente, quatro colunas de mesmo peso, que é a forma
 * genérica de rodapé e enterrava a conversão como se fosse mais uma lista de
 * links. Agora são duas faixas: em cima o que importa (quem somos, como falar),
 * embaixo o índice do site, separados por régua.
 *
 * Campos inexistentes (endereço, CNPJ, telefone fixo, horário) simplesmente não
 * aparecem — não há placeholder nem "em breve".
 */
export function Footer() {
  const ano = new Date().getFullYear();

  // `overflow-clip` nos dois eixos, e não só o `overflow-x` de `secao-composta`:
  // a águia sangra pela borda de baixo e o curso da paralaxe a levaria para fora
  // do rodapé, o que aumentaria a altura rolável da página. Nada atravessa a
  // costura do rodapé (ele é o fim), então recortar Y é de graça.
  return (
    <footer data-surface="ink" className="secao-composta overflow-clip section-sm">
      {/* PLANO 2 — a águia sangrando pela borda esquerda, baixa. É o espelho do
          hero: lá ela entra pela direita no alto e abre o site; aqui sai pela
          esquerda embaixo e o fecha. Some abaixo de lg, onde não haveria largura
          para o gesto e ela só faria peso atrás do texto. */}
      <Marca
        variacao="aguia"
        altura="9rem"
        className="parallax-marca plano-meio hidden text-fg marca-dagua marca-fuga-esquerda lg:block"
        style={{ bottom: "-1.5rem", left: "-8rem" }}
      />

      <div className="plano-frente container-wide">
        <OrnamentRule className="mb-12" />

        {/* FAIXA 1 — assinatura e conversa. */}
        <div className="grid gap-12 lg:grid-cols-[1.55fr_1fr] lg:items-start lg:gap-20">
          <div>
            <Marca variacao="completa" altura="5rem" className="text-fg" />
            <p className="mt-5 text-label-caps text-[0.625rem] text-fg-subtle">{site.tagline}</p>
            <p className="mt-6 max-w-[38ch] text-[length:var(--text-body-lg)] text-fg-muted">
              Preparação para concursos militares em {site.city}/{site.state}, com acompanhamento
              individual do primeiro simulado à prova.
            </p>
          </div>

          <div>
            <h2 className="text-label-caps text-fg-subtle">Fale com a gente</h2>

            <div className="mt-6 flex flex-col items-start gap-3">
              <Cta intent="matricula" variant="primary" size="sm" section="footer" />
              <Cta intent="bolsa" variant="ghost" size="sm" section="footer" />
            </div>

            <ul className="mt-8 flex flex-col gap-3 border-t border-hairline pt-7">
              <li>
                <a
                  href={`https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-touch-target
                  data-cta="cta_whatsapp"
                  data-cta-section="footer"
                  className="inline-flex items-center gap-2.5 text-fg-muted transition-colors duration-[var(--duration-fast)] hover:text-accent"
                >
                  <WhatsAppIcon className="size-5 shrink-0" />
                  <span data-selecionavel>{site.contact.whatsappDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-touch-target
                  data-cta="cta_instagram"
                  data-cta-section="footer"
                  className="inline-flex items-center gap-2.5 text-fg-muted transition-colors duration-[var(--duration-fast)] hover:text-accent"
                >
                  <InstagramIcon className="size-5 shrink-0" />
                  <span data-selecionavel>{site.social.instagramHandle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* FAIXA 2 — o índice do site. Duas listas porque o site tem duas
            famílias de página, não porque um rodapé "tem quatro colunas". */}
        <div className="mt-14 grid gap-10 border-t border-hairline pt-12 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.35fr] lg:gap-16">
          {footerNav.map((grupo) => (
            <nav key={grupo.titulo} aria-label={grupo.titulo}>
              <h2 className="text-label-caps text-fg-subtle">{grupo.titulo}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {grupo.itens.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      data-touch-target
                      className="group inline-flex items-center gap-2 text-fg-muted transition-colors duration-[var(--duration-fast)] hover:text-accent"
                    >
                      <Lozenge className="text-[0.5rem] opacity-40 transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* A nota de referência sai do rodapé de crédito e vem para cá, onde
              tem largura para ser lida. Ela é uma ressalva de conteúdo, não
              letra miúda de copyright. */}
          <p className="max-w-[46ch] text-editorial-italic text-[length:var(--text-body-sm)] leading-relaxed text-fg-subtle sm:col-span-2 lg:col-span-1 lg:pt-1">
            Dados de concursos publicados aqui são referência. Confirme sempre no edital oficial
            vigente antes de qualquer decisão.
          </p>
        </div>

        <div className="mt-12 border-t border-hairline pt-7 text-[length:var(--text-caption)] text-fg-subtle">
          <p>
            © {ano} {site.name} · {site.city}/{site.state}
          </p>
        </div>
      </div>
    </footer>
  );
}
