import type { Concurso } from "@/types/content";
import { site } from "@/lib/site";

/**
 * ARQUITETURA DE CONVERSÃO — fonte única.
 *
 * Quatro INTENÇÕES, dois TRANSPORTES.
 *
 * O site não tem formulário genérico e não terá. Matrícula e bolsa ainda não
 * possuem fluxo próprio definido, então hoje ambas desembocam em WhatsApp com a
 * mensagem já contextualizada — a intenção do usuário é preservada, nada é
 * simulado. Quando houver fluxo real (`matricula.href`/`bolsa.href`), basta
 * preencher aqui: nenhum componente precisa mudar.
 *
 * Especificação completa: docs/implementation/conversion.md
 */

/** Intenções de conversão, em ordem de intenção declarada (alta → baixa). */
export type ConversionIntent = "matricula" | "bolsa" | "whatsapp" | "instagram";

/** Nome do evento de analytics. Tracking real NÃO está ativo (ver D-10). */
export type ConversionEvent = `cta_${ConversionIntent}`;

type ChannelConfig = {
  intent: ConversionIntent;
  event: ConversionEvent;
  /** Rótulo padrão. CTAs contextuais sobrescrevem — ver helpers abaixo. */
  label: string;
  /**
   * Destino próprio. `null` = ainda não existe; o canal cai no `fallback`.
   * NUNCA preencher com placeholder.
   */
  href: string | null;
  /**
   * Para onde a intenção vai enquanto `href` for null. `resolveIntent` LÊ este
   * campo — não é documentação decorativa: mudar aqui muda o destino real.
   */
  fallback: "whatsapp" | "instagram" | null;
};

export const channels: Record<ConversionIntent, ChannelConfig> = {
  matricula: {
    intent: "matricula",
    event: "cta_matricula",
    label: "Iniciar matrícula",
    href: null, // PENDENTE: fluxo de matrícula não definido
    fallback: "whatsapp",
  },
  bolsa: {
    intent: "bolsa",
    event: "cta_bolsa",
    label: "Quero saber sobre bolsas",
    href: null, // PENDENTE: processo de bolsa não definido
    fallback: "whatsapp",
  },
  whatsapp: {
    intent: "whatsapp",
    event: "cta_whatsapp",
    label: "Falar no WhatsApp",
    href: `https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`,
    fallback: null,
  },
  instagram: {
    intent: "instagram",
    event: "cta_instagram",
    label: "Conversar no Instagram",
    href: site.contact.instagramDm,
    fallback: null,
  },
};

/**
 * Mensagens iniciais por intenção. Centralizadas de propósito: o briefing proíbe
 * espalhar mensagem hardcoded pelos componentes.
 *
 * Linguagem objetiva, sem urgência artificial. Nada afirma que a bolsa existe
 * para aquele aluno, que há vagas ou que a matrícula está confirmada.
 */
const messages = {
  matricula: "Olá! Tenho interesse em me matricular na Prime Prep.",
  matriculaConcurso: (sigla: string) =>
    `Olá! Quero me preparar para a ${sigla} e tenho interesse em me matricular na Prime Prep.`,
  bolsa: "Olá! Gostaria de saber como funcionam as bolsas da Prime Prep.",
  duvida: "Olá! Gostaria de saber mais sobre a Prime Prep.",
  /**
   * Fecho do diagnóstico. A conversa começa com o resultado já dentro dela, que
   * é o ponto de existir um diagnóstico: a pessoa chega no WhatsApp sabendo o
   * que quer perguntar, e quem atende sabe do que se trata antes de responder.
   */
  diagnostico: (siglas: string[]) =>
    siglas.length === 1
      ? `Olá! Fiz o diagnóstico no site e o resultado apontou a ${siglas[0]}. Quero saber como funciona a preparação.`
      : `Olá! Fiz o diagnóstico no site e o resultado apontou ${siglas.slice(0, -1).join(", ")} e ${siglas[siglas.length - 1]}. Quero ajuda para decidir.`,
  diagnosticoSemResultado:
    "Olá! Fiz o diagnóstico no site mas ainda estou em dúvida sobre qual concurso prestar. Pode me ajudar a decidir?",
} as const;

export const conversionMessages = messages;

/** Monta um link de WhatsApp com mensagem inicial contextualizada. */
export function whatsappLink(message: string): string {
  const numero = site.contact.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

/**
 * Resolve o destino de uma intenção.
 *
 * Se o canal tem fluxo próprio (`href`), vai direto. Se não tem, cai no
 * `fallback` declarado no próprio canal, levando a mensagem contextualizada —
 * a intenção do usuário nunca se perde no caminho.
 *
 * Hoje matrícula e bolsa não têm fluxo próprio e caem no WhatsApp. Quando
 * tiverem, basta preencher `href`: nenhum componente muda.
 */
export function resolveIntent(
  intent: ConversionIntent,
  options?: { concurso?: Pick<Concurso, "sigla"> },
): { href: string; label: string; event: ConversionEvent; isFallback: boolean } {
  const channel = channels[intent];
  const sigla = options?.concurso?.sigla;

  const label =
    intent === "matricula" && sigla ? `Quero me preparar para a ${sigla}` : channel.label;

  if (channel.href !== null) {
    return { href: channel.href, label, event: channel.event, isFallback: false };
  }

  const message =
    intent === "bolsa"
      ? messages.bolsa
      : sigla
        ? messages.matriculaConcurso(sigla)
        : messages.matricula;

  // O destino do fallback é declarado no canal, não fixado aqui.
  const href =
    channel.fallback === "instagram"
      ? (channels.instagram.href ?? whatsappLink(message))
      : whatsappLink(message);

  return { href, label, event: channel.event, isFallback: true };
}
