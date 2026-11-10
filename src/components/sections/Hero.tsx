import { concursos, forcaLabels } from "@/content/concursos";
import { site } from "@/lib/site";
import { Cta } from "@/components/ui/Cta";
import { GraphicField, Lozenge } from "@/components/decorative/Ornament";
import { Marca } from "@/components/layout/Wordmark";

/**
 * HERO — abertura do diário de bordo.
 *
 * Composição assimétrica em duas colunas: a declaração institucional à esquerda,
 * o "registro de rota" à direita. Deliberadamente NÃO segue o padrão
 * badge → H1 central → parágrafo → dois botões → mockup.
 *
 * A coluna direita não é um mockup decorativo: lista os quatro concursos reais
 * com a cor de contexto de cada força, funcionando como sumário navegável da
 * página. Cada cor vem acompanhada da sigla em texto (A Regra do Duplo Portador).
 *
 * Server component — nenhum motion aqui: o conteúdo acima da dobra aparece
 * imediatamente, sem espera por JavaScript.
 */
export function Hero() {
  return (
    <section
      data-surface="navy"
      className="texture-linen secao-composta pt-28 pb-[var(--space-section)] lg:pt-40 lg:pb-28"
    >
      {/* PLANO 1 — campo de fundo. Fica atrás de tudo e não termina onde o
          texto começa: a máscara radial faz a grade dissolver, não cortar. */}
      <div className="plano-fundo">
        <GraphicField className="static" />
      </div>

      {/* PLANO 2 — a águia real em marca d'água, sangrando pela borda direita e
          passando POR TRÁS do painel. É o que coloca a identidade no midground
          em vez de repetir a marca do header. A largura vem da proporção real
          (4.86:1), então a altura é pequena de propósito. Some abaixo de lg,
          onde só disputaria espaço com o texto.

          POSIÇÃO: alta, na faixa do eyebrow e do início do título. Antes vivia a
          58% da altura, ou seja, no rodapé da seção, onde chegava tarde demais
          para abrir a composição e ainda disputava espaço com os CTAs. Agora ela
          entra junto com a primeira linha lida, no quadrante superior direito,
          que é o único vazio real do hero. O sangramento cresceu de 7rem para
          9rem no mesmo movimento, para que a asa não encoste no título em 1024.
          A profundidade aqui vem da opacidade e do corte na borda, não de
          oclusão: o painel fica abaixo dela e não a cobre mais. */}
      <Marca
        variacao="aguia"
        altura="8.5rem"
        className="parallax-marca plano-meio hidden text-fg marca-dagua marca-fuga-direita lg:block"
        style={{ top: "13%", right: "-9rem" }}
      />

      <div className="plano-frente container-wide grid items-start gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20">
        {/* ENTRADA ESCALONADA. O hero é a única coisa já na tela quando a página
            abre, então nunca teve entrada nenhuma: reveal por scroll chegaria
            tarde demais. Aqui os quatro blocos assentam na ordem de leitura.
            Só `transform`, nunca `opacity` (ver D-39): se o primeiro quadro
            atrasar, o pior caso é o hero nascer 18px mais baixo, e nenhuma
            palavra fica invisível esperando animação. */}
        <div className="entrada-hero">
          <p
            className="text-inscription text-accent"
            style={{ "--pp-i": 0 } as React.CSSProperties}
          >
            {site.tagline} · {site.city}/{site.state}
          </p>

          <h1
            className="mt-7 text-[length:var(--text-h1)] leading-[1.03]"
            style={{ "--pp-i": 1 } as React.CSSProperties}
          >
            Um plano por aluno,
            <br className="hidden lg:inline" /> do primeiro simulado
            <br className="hidden lg:inline" /> <span className="text-accent">até a prova.</span>
          </h1>

          <p
            className="mt-8 max-w-[46ch] text-[length:var(--text-body-lg)] text-fg-muted"
            style={{ "--pp-i": 2 } as React.CSSProperties}
          >
            A Prime Prep prepara para EsPCEx, AFA, EEAR e EFOMM com acompanhamento individual:
            desempenho registrado aluno por aluno, correção individual de questões, simulados e
            redações, e reforço quando o resultado pede.
          </p>

          <div
            className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
            style={{ "--pp-i": 3 } as React.CSSProperties}
          >
            <Cta intent="matricula" variant="primary" section="hero" />
            <Cta intent="whatsapp" variant="ghost" label="Tirar uma dúvida" section="hero" />
          </div>
        </div>

        {/* Registro de rota — sumário dos concursos atendidos. */}
        {/* PLANO 3 — painel suspenso. Em lg ele desce para atravessar a costura
            com a seção seguinte: metade sobre navy, metade sobre pergaminho.
            É o gesto que mais comunica "o conteúdo está à frente do fundo". */}
        <aside
          aria-labelledby="hero-rota"
          /* Curso NEGATIVO: o painel anda contra a rolagem, então parece vir na
             direção de quem lê. Fecha a escala de profundidade do hero: a grade
             percorre 40px a favor, a águia 120px a favor, o texto fica parado e
             o painel faz 32px contra. É bloco curto e sem leitura corrida, que é
             a única condição em que conteúdo pode receber paralaxe. */
          className="parallax-frente relative z-[var(--layer-flutuante)] painel-suspenso p-6 sm:p-8 lg:mb-[-11rem]"
        >
          <h2 id="hero-rota" className="text-label-caps text-fg-subtle">
            Concursos atendidos
          </h2>

          <ul className="mt-6 flex flex-col">
            {concursos.map((c) => (
              <li
                key={c.slug}
                className="flex items-baseline gap-3.5 border-b border-hairline py-3.5 last:border-b-0 last:pb-0"
              >
                <Lozenge
                  className="translate-y-[-1px] text-[0.6875rem]"
                  style={{ color: `var(${c.accentToken})` }}
                />
                <span className="shrink-0 text-inscription text-[0.9375rem] text-fg">
                  {c.sigla}
                </span>
                <span className="ml-auto text-right text-editorial-italic text-[length:var(--text-body-sm)] leading-snug text-fg-subtle">
                  {forcaLabels[c.forca]}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[length:var(--text-caption)] text-fg-subtle">
            Preparação simultânea para mais de um concurso dentro do mesmo ciclo.
          </p>
        </aside>
      </div>
    </section>
  );
}
