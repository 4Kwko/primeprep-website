import { describe, it, expect } from "vitest";
import { site } from "@/lib/site";
import { concursos } from "./concursos";
import {
  channels,
  resolveIntent,
  whatsappLink,
  conversionMessages,
  type ConversionIntent,
} from "./conversion";

/**
 * `conversion.ts` é o caminho por onde passa a única coisa que o site precisa
 * fazer acontecer: virar conversa. Um destino errado aqui não quebra a página,
 * quebra o negócio, e em silêncio.
 *
 * O que estes testes protegem, além do óbvio:
 * - que `href: null` NUNCA chegue à interface como link vazio ou "#";
 * - que o `fallback` declarado no canal seja de fato lido, e não decoração;
 * - que a mensagem inicial não afirme nada que não foi confirmado (vaga, preço,
 *   bolsa concedida, matrícula efetivada).
 */

const intents = Object.keys(channels) as ConversionIntent[];
const numeroLimpo = site.contact.whatsapp.replace(/\D/g, "");

describe("configuração dos canais", () => {
  it("declara as quatro intenções, e o `event` casa com o `intent`", () => {
    expect(intents.sort()).toEqual(["bolsa", "instagram", "matricula", "whatsapp"]);
    for (const intent of intents) {
      expect(channels[intent].intent).toBe(intent);
      expect(channels[intent].event).toBe(`cta_${intent}`);
    }
  });

  it("todo canal sem destino próprio declara para onde cair", () => {
    for (const intent of intents) {
      const canal = channels[intent];
      if (canal.href === null) {
        expect(
          canal.fallback,
          `${intent} sem href e sem fallback ficaria sem destino`,
        ).not.toBeNull();
      }
    }
  });

  it("nenhum href é placeholder", () => {
    // O risco real não é o campo vazio, é alguém preenchê-lo com "#" ou "/em-breve"
    // para "não deixar quebrado". Isso é link morto, que a R-24 proíbe.
    for (const intent of intents) {
      const href = channels[intent].href;
      if (href === null) continue;
      expect(href).toMatch(/^https?:\/\//);
      expect(href).not.toMatch(/^#|placeholder|em-breve|todo|example\.com/i);
    }
  });

  it("matrícula e bolsa seguem sem fluxo próprio, e isso é estado conhecido", () => {
    // Se um dia deixarem de ser null, este teste falha de propósito: é o lembrete
    // de atualizar a documentação de pendências junto.
    expect(channels.matricula.href).toBeNull();
    expect(channels.bolsa.href).toBeNull();
  });
});

describe("resolveIntent", () => {
  it("sempre devolve um destino utilizável, para qualquer intenção", () => {
    for (const intent of intents) {
      const r = resolveIntent(intent);
      expect(r.href, intent).toMatch(/^https?:\/\//);
      expect(r.label.trim().length, intent).toBeGreaterThan(0);
      expect(r.event, intent).toBe(`cta_${intent}`);
    }
  });

  it("marca como fallback exatamente quem não tem destino próprio", () => {
    for (const intent of intents) {
      expect(resolveIntent(intent).isFallback, intent).toBe(channels[intent].href === null);
    }
  });

  it("o fallback LÊ o campo declarado no canal", () => {
    // O comentário em conversion.ts avisa que `fallback` não é documentação
    // decorativa. Isto verifica que continua sendo verdade: matrícula declara
    // "whatsapp", e o destino resolvido é mesmo o wa.me.
    expect(channels.matricula.fallback).toBe("whatsapp");
    expect(resolveIntent("matricula").href).toContain(`wa.me/${numeroLimpo}`);
  });

  it("preserva a intenção do visitante dentro da mensagem", () => {
    const matricula = decodeURIComponent(resolveIntent("matricula").href);
    expect(matricula).toMatch(/matricular/i);

    const bolsa = decodeURIComponent(resolveIntent("bolsa").href);
    expect(bolsa).toMatch(/bolsa/i);
    // Bolsa e matrícula são fluxos separados e não podem se confundir (D-20).
    expect(bolsa).not.toMatch(/matricular/i);
  });

  it("contextualiza rótulo e mensagem por concurso", () => {
    for (const c of concursos) {
      const r = resolveIntent("matricula", { concurso: c });
      expect(r.label, c.sigla).toContain(c.sigla);
      expect(decodeURIComponent(r.href), c.sigla).toContain(c.sigla);
    }
  });

  it("sem concurso, usa o rótulo padrão do canal", () => {
    expect(resolveIntent("matricula").label).toBe(channels.matricula.label);
  });

  it("canais com destino próprio vão direto, sem inventar mensagem", () => {
    expect(resolveIntent("instagram").href).toBe(channels.instagram.href);
    expect(resolveIntent("whatsapp").href).toBe(channels.whatsapp.href);
  });
});

describe("whatsappLink", () => {
  it("usa o número real, só com dígitos", () => {
    expect(whatsappLink("oi")).toBe(`https://wa.me/${numeroLimpo}?text=oi`);
    expect(numeroLimpo).toMatch(/^\d{12,13}$/);
  });

  it("codifica a mensagem, inclusive acento e quebra", () => {
    const link = whatsappLink("Olá! Preparação & dúvida\nsegunda linha");
    expect(link).not.toMatch(/[\s&\n]/);
    expect(decodeURIComponent(link.split("?text=")[1]!)).toBe(
      "Olá! Preparação & dúvida\nsegunda linha",
    );
  });
});

describe("as mensagens iniciais", () => {
  const fixas = [
    conversionMessages.matricula,
    conversionMessages.bolsa,
    conversionMessages.duvida,
    conversionMessages.diagnosticoSemResultado,
    conversionMessages.matriculaConcurso("EEAR"),
    conversionMessages.diagnostico(["EEAR"]),
    conversionMessages.diagnostico(["EsPCEx", "AFA"]),
    conversionMessages.diagnostico(["EsPCEx", "AFA", "EFOMM"]),
  ];

  it("nenhuma afirma o que não foi confirmado", () => {
    // Sem urgência artificial, sem prometer vaga, preço, bolsa ou matrícula feita.
    const proibido =
      /últimas vagas|garanta|desconto|promoção|matrícula (confirmada|efetivada)|bolsa (garantida|aprovada)|R\$/i;
    for (const m of fixas) expect(m, m).not.toMatch(proibido);
  });

  it("nenhuma usa travessão (D-32)", () => {
    for (const m of fixas) expect(m, m).not.toMatch(/[—–]/);
  });

  it("todas começam com saudação e terminam em ponto final", () => {
    for (const m of fixas) {
      expect(m, m).toMatch(/^Olá!/);
      expect(m.trim(), m).toMatch(/[.?]$/);
    }
  });

  it("lista os concursos com vírgula e um `e` antes do último", () => {
    expect(conversionMessages.diagnostico(["EsPCEx", "AFA", "EFOMM"])).toContain(
      "EsPCEx, AFA e EFOMM",
    );
    expect(conversionMessages.diagnostico(["EsPCEx", "AFA"])).toContain("EsPCEx e AFA");
    expect(conversionMessages.diagnostico(["EEAR"])).toContain("a EEAR");
  });
});
