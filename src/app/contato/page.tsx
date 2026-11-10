import type { Metadata } from "next";
import { site } from "@/lib/site";
import { whatsappLink, conversionMessages } from "@/content/conversion";
import { PageHeader } from "@/components/layout/PageHeader";
import { LogEntry } from "@/components/layout/LogEntry";
import { Cta } from "@/components/ui/Cta";
import { Reveal } from "@/components/motion/Reveal";
import { InstagramIcon, WhatsAppIcon } from "@/components/decorative/icons";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Prime Prep pelo WhatsApp ou pela DM do Instagram. Atendimento, matrícula e informações sobre bolsas.",
  alternates: { canonical: "/contato" },
  openGraph: {
    title: "Contato · Prime Prep",
    description: "WhatsApp e Instagram Direct, sem formulário e sem espera.",
    url: "/contato",
  },
};

/**
 * PÁGINA DE CANAIS — não de formulário.
 *
 * O site não tem e não terá formulário genérico (D-18/D-20). Esta página
 * organiza os dois canais reais por *intenção*, para que a pessoa caia na
 * conversa certa já com o assunto declarado na primeira mensagem.
 *
 * Aqui a hierarquia se inverte em relação ao resto do site: o CTA primário é o
 * WhatsApp, porque quem chega nesta página já quer falar — não decidir.
 *
 * Endereço, telefone fixo e horário NÃO existem e não aparecem. Sem placeholder,
 * sem "em breve".
 */
const intencoes = [
  {
    titulo: "Tenho uma dúvida",
    corpo:
      "Sobre os concursos, as turmas, como funciona a preparação, ou qualquer outra coisa antes de decidir.",
    mensagem: conversionMessages.duvida,
    rotulo: "Tirar uma dúvida",
  },
  {
    titulo: "Quero me matricular",
    corpo:
      "Diga qual concurso você quer prestar e há quanto tempo está estudando. A conversa já começa no lugar certo.",
    mensagem: conversionMessages.matricula,
    rotulo: "Iniciar matrícula",
  },
  {
    titulo: "Quero saber sobre bolsas",
    corpo:
      "Bolsas por desempenho e possibilidade de critérios socioeconômicos. Cada caso é tratado individualmente.",
    mensagem: conversionMessages.bolsa,
    rotulo: "Perguntar sobre bolsas",
  },
];

export default function ContatoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contato"
        titulo="Sem formulário. Só uma conversa."
        lead={`Atendemos pelo WhatsApp e pela DM do Instagram, os dois canais que a equipe realmente acompanha. Escolha o assunto abaixo e a mensagem já vai com o contexto.`}
      />

      <section data-surface="bone" className="section">
        <div className="container-wide">
          <LogEntry numero="01" rotulo="Por assunto">
            {/* SEM CARTÃO, DE PROPÓSITO. Isto é uma lista de três assuntos, não
                três objetos de peso equivalente competindo por atenção. Antes
                eram três cartões elevados idênticos, que é exatamente a forma
                que faz uma escolha simples parecer um catálogo. Aqui são linhas
                de um registro: filete, assunto, explicação, ação. O que separa
                um item do outro é o espaço em branco e a régua, e a única coisa
                que se destaca é o botão, que é o que a pessoa veio fazer.
                A linha inteira é clicável; ver o comentário abaixo. */}
            <Reveal>
              <ul className="border-t border-hairline">
                {intencoes.map((it) => (
                  <li key={it.titulo} className="border-b border-hairline">
                    {/* A LINHA INTEIRA É O ALVO, não só o botão. O assunto, a
                        explicação e a ação levam todos ao mesmo lugar, então
                        dividir isso em "texto morto mais botãozinho" só encolhia
                        a área de toque sem separar nada. O botão continua
                        visível como âncora do olho, mas virou `<span>`: um
                        elemento interativo dentro de outro seria HTML inválido. */}
                    <a
                      href={whatsappLink(it.mensagem)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-touch-target
                      data-cta="cta_whatsapp"
                      data-cta-section="contato-assunto"
                      className="group -mx-4 block linha-registro rounded-[var(--radius-sm)] px-4"
                    >
                      <div className="grid gap-6 py-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-14">
                        <div>
                          <h2 className="text-[length:var(--text-h4)] leading-snug">{it.titulo}</h2>
                          <p className="mt-3 max-w-[58ch] text-fg-muted">{it.corpo}</p>
                        </div>

                        {/* `group-hover` porque o hover verdadeiro está no link que
                            envolve a linha inteira: sem isto o fundo da linha
                            reagiria e o botão, que é a âncora do olho, ficaria
                            inerte, como se não fizesse parte do alvo. */}
                        <span className="btn-base btn-secondary justify-self-start btn-sm group-hover:border-fg-muted group-hover:bg-surface-elevated lg:justify-self-end">
                          {it.rotulo}
                          <WhatsAppIcon className="size-4 shrink-0 opacity-70" />
                          <span className="sr-only">(abre o WhatsApp em nova aba)</span>
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </LogEntry>
        </div>
      </section>

      <section data-surface="navy" className="section">
        <div className="container-wide">
          <LogEntry numero="02" rotulo="Os canais">
            <Reveal>
              <h2 className="max-w-[22ch] text-[length:var(--text-h2)]">Onde a gente responde.</h2>

              {/* OS DOIS CANAIS NÃO TÊM O MESMO PESO, ENTÃO NÃO TÊM A MESMA
                  FORMA. Antes eram dois cartões idênticos lado a lado, o que
                  contradizia o próprio texto: um é "canal principal", o outro é
                  onde a conversa continua se já existe. O WhatsApp fica num
                  painel elevado, com o número em escala de leitura; o Instagram
                  fica na margem, apoiado só num filete, no tom de nota. */}
              <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
                <article className="painel-suspenso p-7 sm:p-9">
                  <div className="flex items-center gap-3.5">
                    <WhatsAppIcon className="size-6 shrink-0 text-accent" />
                    <h3 className="text-[length:var(--text-h3)] leading-none">WhatsApp</h3>
                  </div>

                  <p className="mt-6 max-w-[42ch] text-[length:var(--text-body-lg)] text-fg-muted">
                    Canal principal de atendimento. Fala direto com a coordenação administrativa.
                  </p>

                  <p className="mt-7 text-inscription text-[length:var(--text-h4)] text-fg">
                    <span data-selecionavel>{site.contact.whatsappDisplay}</span>
                  </p>

                  <div className="mt-8">
                    <Cta intent="whatsapp" variant="primary" section="contato-canais" />
                  </div>
                </article>

                <article className="border-t border-hairline pt-8 lg:border-t-0 lg:border-l lg:pt-2 lg:pl-10">
                  <div className="flex items-center gap-3">
                    <InstagramIcon className="size-5 shrink-0 text-fg-subtle" />
                    <h3 className="text-label-caps text-fg-subtle">Instagram Direct</h3>
                  </div>

                  <p className="mt-5 max-w-[46ch] text-[length:var(--text-body-sm)] text-fg-muted">
                    Se você já acompanha a Prime Prep por lá, pode continuar a conversa na DM. Um
                    chatbot responde as dúvidas mais comuns sobre cursos, metodologia e professores.
                  </p>

                  <p className="mt-5 text-inscription text-fg">
                    <span data-selecionavel>{site.social.instagramHandle}</span>
                  </p>

                  <div className="mt-5">
                    <Cta intent="instagram" variant="ghost" size="sm" section="contato-canais" />
                  </div>
                </article>
              </div>

              <p className="mt-10 max-w-[62ch] text-[length:var(--text-caption)] text-fg-subtle">
                Curso presencial em {site.city}/{site.state}. Endereço, horário de atendimento e
                valores são informados na conversa.
              </p>
            </Reveal>
          </LogEntry>
        </div>
      </section>
    </>
  );
}
