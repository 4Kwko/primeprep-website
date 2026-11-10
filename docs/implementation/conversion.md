# Arquitetura de Conversão

Especificação para a Fase 3. Configuração em [`src/content/conversion.ts`](../../src/content/conversion.ts).
**Nenhum componente foi construído** — este documento define as regras que a implementação vai seguir.

---

## 1. Canais oficiais

Quatro **intenções**, dois **transportes**.

| Intenção | Perfil do usuário | Peso padrão | Destino real |
|---|---|---|---|
| **Matrícula** | decidido a entrar | primário | ⚠️ pendente → WhatsApp contextualizado |
| **Pedido de bolsa** | interessado em auxílio financeiro | contextual | ⚠️ pendente → WhatsApp contextualizado |
| **WhatsApp** | dúvida rápida, quer conversar | secundário | ✅ `wa.me` |
| **Instagram Direct** | já acompanha nas redes | terciário | ✅ `ig.me/m/primeprep.sg` |

Matrícula e bolsa **não têm fluxo próprio definido**. Enquanto não tiverem, `resolveIntent()` as encaminha ao WhatsApp com a mensagem já contextualizada — a intenção do usuário é preservada e nada é simulado. Quando houver fluxo real, preencher `href` em `conversion.ts`: **nenhum componente muda**.

> **Não existe formulário genérico** — nem "Fale Conosco", nem nome+email+mensagem, nem newsletter, nem lead gen. Se um fluxo futuro exigir formulário específico, é decisão separada.

---

## 2. Hierarquia de CTA

Regras duras:

1. **Nunca os quatro canais com o mesmo peso.**
2. **No máximo um CTA primário visível por dobra.**
3. WhatsApp e Instagram **não aparecem lado a lado** em toda seção.
4. A interface deve deixar claro que *falar com atendimento*, *conversar no Instagram*, *iniciar matrícula* e *pedir bolsa* são coisas diferentes.

| Página | Primário | Secundário | Outros |
|---|---|---|---|
| Home | Matrícula | WhatsApp | — |
| Metodologia | Matrícula | WhatsApp | — |
| Hub de concursos | Matrícula | WhatsApp | — |
| Página de concurso | "Quero me preparar para a *SIGLA*" | "Falar sobre *SIGLA* no WhatsApp" | — |
| Bolsas | "Quero saber sobre bolsas" | Falar com atendimento | — |
| Contato | WhatsApp | Instagram Direct | Matrícula, Bolsa |
| Footer | Matrícula | WhatsApp | Instagram, Bolsa |

Codificada em `ctaHierarchy`.

### Onde o WhatsApp pode aparecer
Header, hero, seções de conversão, páginas de concurso, FAQ, footer, fechamento de jornada. **Com moderação** — o site não é uma sequência de botões de WhatsApp.

### Onde o Instagram pode aparecer
Footer, área de contato, páginas institucionais, bloco "fale com a gente", navegação secundária. **Nunca com o peso do CTA primário.**

---

## 3. CTAs contextuais

Verbo claro e ação específica. **`SAIBA MAIS` é proibido.**

| Contexto | Rótulo |
|---|---|
| Página EsPCEx | "Quero me preparar para a EsPCEx" |
| Página AFA | "Quero me preparar para a AFA" |
| Página EEAR | "Quero me preparar para a EEAR" |
| Página EFOMM | "Quero me preparar para a EFOMM" |
| Seção de bolsas | "Quero saber sobre bolsas" |
| Metodologia | "Quero conhecer a preparação" |
| Genérico | "Iniciar matrícula" · "Falar no WhatsApp" |

> Os quatro concursos ativos são EsPCEx, AFA, EEAR e EFOMM. **ESA está fora do site** por decisão do cliente (D-19) — não criar CTA para ela.

### Mensagens iniciais
Centralizadas em `conversionMessages`. **Nunca hardcode mensagem em componente.**

Linguagem objetiva, sem urgência artificial. Nenhuma mensagem afirma que existe vaga, que a bolsa será concedida ou que a matrícula está confirmada.

**Proibido**: "Últimas vagas!", "Garanta agora!", "Não perca essa oportunidade!", contador regressivo, "vagas acabando".

---

## 4. Regras do pedido de bolsa

Bolsa **não é** matrícula. São fluxos separados e não podem ser apresentados como a mesma ação.

A comunicação diz apenas o que é verdade e já foi confirmado:
- existem possibilidades de bolsa;
- podem existir critérios de desempenho e/ou socioeconômicos;
- as regras específicas dependem de definição oficial.

**Nunca inventar**: percentuais, número de bolsas, datas, critérios exatos, documentos exigidos, forma de classificação, ou qualquer garantia de concessão.

Rótulos aceitos: "Tenho interesse em bolsa" · "Quero saber sobre bolsas" · "Solicitar informações sobre bolsa".

---

## 5. Configuração central

Tudo em [`src/content/conversion.ts`](../../src/content/conversion.ts):

| Export | Papel |
|---|---|
| `channels` | os quatro canais: rótulo, peso, evento, `href`, `fallback` |
| `conversionMessages` | mensagens iniciais contextualizadas |
| `whatsappLink(message)` | monta `wa.me` com texto codificado |
| `resolveIntent(intent, { concurso })` | resolve destino + rótulo + evento; aplica fallback |
| `ctaHierarchy` | peso por página |

Componentes consomem `resolveIntent()`. **Nenhum componente monta URL de WhatsApp por conta própria.**

### URLs
| Canal | Estado |
|---|---|
| WhatsApp | ✅ `+55 55 99945-1204` — do cartão de contato institucional |
| Instagram Direct | ✅ `ig.me/m/primeprep.sg` |
| Matrícula | ⚠️ **pendente** — `href: null` |
| Bolsa | ⚠️ **pendente** — `href: null` |

`href: null` é estado válido e explícito. **Nenhum placeholder aparece na interface.**

---

## 6. Acessibilidade

Todo CTA precisa:

- texto claro — **ícone sozinho não basta** para ação importante;
- estado de foco visível (anel por superfície, já na fundação);
- funcionar por teclado, na ordem visual;
- área de toque ≥ 44×44px em ponteiro grosso;
- `aria-label` quando o texto visível não bastar;
- **indicar que abre serviço externo** — todos os quatro canais abrem: `rel="noopener noreferrer"`, `target="_blank"`, e indicação textual ou ícone com rótulo acessível.

Um ícone de WhatsApp ou Instagram sozinho nunca é um CTA de conversão — só é aceitável como link social secundário no footer, com `aria-label`.

---

## 7. Responsividade

No mobile, priorizar a **intenção**, não o catálogo de canais. **Nunca quatro botões empilhados** de forma permanente.

Se houver CTA persistente no mobile:
- **uma única** ação principal;
- não bloqueia conteúdo;
- não ocupa área excessiva;
- respeita safe areas (`env(safe-area-inset-bottom)`);
- não é barra intrusiva.

**Proibido**: pop-up agressivo, modal automático, chat fake, dark pattern, esconder informação para forçar contato.

---

## 8. Tracking — preparado, não ativo

Analytics **não está implementado** e não será sem decisão explícita do cliente. A arquitetura apenas não atrapalha a medição futura.

Eventos previstos: `cta_whatsapp` · `cta_instagram` · `cta_matricula` · `cta_bolsa`.

Contexto previsto (`ConversionContext`): `page`, `section`, `concurso?`.

Cada `channel` já carrega seu `event`, e `resolveIntent()` o devolve junto com o destino — ligar o tracking depois é acrescentar um handler, não refatorar CTAs.

---

## 9. Validação (Fase 3)

- [ ] Nenhum formulário genérico existe no projeto
- [ ] WhatsApp centralizado — nenhuma URL montada em componente
- [ ] Instagram aponta para `@primeprep.sg`
- [ ] Matrícula tratada como intenção alta
- [ ] Bolsa separada de matrícula, com linguagem cuidadosa
- [ ] Hierarquia respeitada: um primário por dobra, nunca quatro iguais
- [ ] CTAs contextuais, nenhum "Saiba mais"
- [ ] Nenhum dado inventado; pendências visíveis como pendências
- [ ] Mobile sem sobrecarga de CTA
- [ ] Foco, teclado, toque e aviso de link externo corretos
- [ ] Eventos nomeados e com contexto, sem tracking ativo

---

## 10. Pendências

1. **Fluxo de matrícula** — não definido. Hoje cai no WhatsApp contextualizado.
2. **Processo de bolsa** — não definido. Sem critérios, percentuais ou prazos.
3. **Número oficial de WhatsApp** — o número em uso é o do cartão de contato da coordenação administrativa (`+55 55 99945-1204`). Confirmar se é o canal institucional ou se haverá um número próprio do curso.
4. **Forma de apresentar o chatbot da DM** — link direto, bloco próprio, ou ambos. Decisão de UI (pergunta 17 do planejamento).
