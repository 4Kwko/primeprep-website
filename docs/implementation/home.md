# Home

[`src/app/page.tsx`](../../src/app/page.tsx) · seções em [`src/components/sections/`](../../src/components/sections/)

---

## 1. Estrutura e jornada

A Home é um **diário de bordo**: entradas numeradas, cada uma respondendo a uma pergunta que o visitante realmente traz. A ordem segue a decisão de produto D-17 — **credibilidade para o responsável primeiro**, o aluno conquistado nas entradas de concurso e metodologia.

| # | Seção | Superfície | Pergunta que responde | CTA |
|---|---|---|---|---|
| — | **Hero** | navy | Quem é a Prime Prep e o que ela prepara? | Matrícula (primário) + WhatsApp (fantasma) |
| 01 | **Credibilidade** | bone | Por que confiar? | — |
| 02 | **Concursos** | bone | Quais concursos, e qual serve para mim? | link para o hub |
| 03 | **Metodologia** | navy | Como funciona? Como seria estudar aqui? | — |
| 04 | **Professores** | bone | Quem ensina? | — |
| 05 | **Bolsas** | bone | E se eu não puder pagar? | Bolsa (secundário) |
| — | **Fechamento** | navy | Como eu começo? | Matrícula + WhatsApp + Bolsa |
| — | Footer | ink | — | Matrícula + Bolsa + canais |

**Ritmo cromático:** navy → bone → bone → navy → bone → bone → navy → ink. A alternância é o que dá respiro à página longa — o motor do dinamismo, não a saturação.

---

## 2. Seções em detalhe

### Hero
Composição assimétrica em duas colunas (`1.15fr / 0.85fr`). **Deliberadamente não segue** badge → H1 central → parágrafo → dois botões → mockup.

- **Esquerda:** eyebrow inscricional ("Curso Preparatório Militar · São Gabriel/RS"), H1 em três linhas compostas (quebras manuais só em `lg+`; abaixo disso quebra natural), lead com os quatro concursos e o mecanismo, e um CTA primário com um fantasma ao lado.
- **Direita:** `<aside>` "Concursos atendidos" — **não é mockup decorativo**. Lista os quatro concursos reais com o losango na cor de contexto da força e o nome da força à direita. Funciona como sumário navegável e como prova de escopo.
- **Fundo:** `GraphicField` (grade de filetes em máscara radial, feita só de tokens) + `texture-linen`.
- **Server Component, sem motion:** o conteúdo acima da dobra aparece imediatamente, sem esperar JavaScript.

### 01 · Credibilidade
Quatro pilares em **lista com filete**, não em grade de cartões — é uma declaração, não um catálogo. Cada pilar: título com losango + explicação em coluna à direita (`1fr / 1.4fr` em `sm+`).

**Sem métrica alguma.** Não há número de aprovações, de alunos nem de anos de mercado fornecido, e inventá-los é proibido. A credibilidade vem do **mecanismo**: planilha individual, correção individual inclusive de redação, professores dedicados, ritmo que se ajusta ao resultado.

### 02 · Concursos
Quatro **linhas de rota**, não quatro cartões clones. Cada uma traz: barra vertical na cor de contexto, losango, sigla em Cinzel, nome por extenso em itálico editorial, nome da força, resumo e ficha em `<dl>` de pares rótulo/valor (idade, escolaridade, onde, prova).

- Desktop: `minmax(0,15rem) 1fr` — identidade à esquerda, ficha à direita, alinhadas verticalmente para comparação.
- Mobile: empilha; a `<dl>` vira 2 colunas. **Nunca scroll horizontal.**
- A cor **nunca informa sozinha**: sigla e nome da força sempre presentes em texto.
- Nota de rodapé explícita: os dados são referência (`verifiedAt: null`), confirme no edital.

### 03 · Metodologia
Explicitamente **não é grade de seis cartões com ícone**. É o **ciclo** em quatro momentos encadeados numa linha vertical com marcos: Ponto de partida → Rotina → Medição → Ajuste. A pessoa entende *como seria estudar aqui*.

Depois, "O que está incluído": os oito diferenciais em lista de duas colunas com filete. Os ícones aparecem uma vez, pequenos, e cada um carrega significado (bússola = rumo individual, régua graduada = planilha de desempenho, pena = correção, alvo = simulados). Nenhum é enfeite de preenchimento.

### 04 · Professores
Três cartões elevados. Somente as credenciais fornecidas — nada acrescentado por inferência.

**Sem fotografias.** O lugar do retrato é um **monograma** em Cinzel sobre superfície rebaixada. Sem banco de imagens, sem rosto gerado.

> **PONTO DE SUBSTITUIÇÃO:** quando houver retratos, trocar a `div` do monograma por `next/image` e a altura fixa `h-40` por `aspect-[4/5]`.

### 05 · Bolsas
Bloco em superfície rebaixada, fluxo **separado** de matrícula. Linguagem deliberadamente cuidadosa: afirma apenas que existem possibilidades, que podem envolver desempenho e/ou critérios socioeconômicos, e que as regras dependem de definição oficial.

**Nada de percentual, número de bolsas, prazo, critério, documento ou garantia.**

### Fechamento
Centralizado (a única seção que é — o hero e as entradas são assimétricos, então a simetria aqui *fecha* a página em vez de repetir um padrão). Divisor ornamental, H2, lead, Matrícula + WhatsApp lado a lado, e Bolsa como fantasma abaixo. Instagram **não compete** aqui — vive no footer logo em seguida.

Sem urgência artificial.

---

## 3. Decisões visuais principais

**A entrada de diário.** Toda seção usa `LogEntry` com número e rótulo no trilho de margem. É a decisão que sozinha impede a Home de virar uma pilha de blocos centralizados — o padrão de landing gerada que o briefing veta.

**Nenhuma repetição de forma.** Lista com filete (01) → linhas de rota (02) → linha do tempo vertical + lista de duas colunas (03) → cartões (04) → bloco único (05) → composição centralizada (fechamento). Cartão aparece em exatamente duas seções.

**Ouro abaixo de 5%.** Aparece em: eyebrow, "até a prova" no H1, números de entrada, losangos, ícones, fundo do CTA primário e bordas de foco. Em nenhum parágrafo.

**Cores de contexto contidas.** Só no hero (losango) e na entrada 02 (barra + losango). Não vazam para o resto da página, então não disputam com a identidade da Prime Prep.

---

## 4. Conversão

Todos os CTAs passam por `resolveIntent()` de [`conversion.ts`](../../src/content/conversion.ts). **Nenhum componente monta URL de WhatsApp.**

Distribuição verificada na página: **matrícula 4 · WhatsApp 4 · bolsa 3 · Instagram 1**. A hierarquia se sustenta e o Instagram fica onde deve.

Matrícula e bolsa ainda não têm fluxo próprio: resolvem para WhatsApp com mensagem contextualizada. Nenhuma tela simula matrícula concluída e não existe formulário — verificado: **zero elementos `<form>`, `<input>` ou `<textarea>` na página**.

Cada CTA carrega `data-cta` (`cta_matricula`, `cta_whatsapp`, `cta_bolsa`, `cta_instagram`) e `data-cta-section`. **Tracking não está ativo** — ligar depois é acrescentar um handler.

---

## 5. Motion

**Decisão D-21: o reveal é CSS, não `motion`.**

A primeira implementação usava `motion` com `whileInView`. Verificado no HTML servido: saía `opacity:0;transform:translateY(14px)` **no SSR** — ou seja, sem JavaScript todo o conteúdo revelado ficava invisível. Defeito grave num site cuja função é ser lido e encontrado.

A implementação atual:
- estado padrão do HTML: **visível**;
- o estado inicial escondido vive dentro de `@media (scripting: enabled)` — só existe onde há JS para revelá-lo;
- um `IntersectionObserver` marca `data-revealed`, e a transição é CSS;
- dispara **uma única vez** (`unobserve` no primeiro cruzamento);
- escalonamento para de crescer no 5º filho, para não atrasar a leitura;
- `prefers-reduced-motion` neutraliza deslocamento e atraso.

Sem script inline, sem mismatch de hidratação, **zero JavaScript de animação no bundle da página**.

O `motion` roda em um único lugar: a transição do painel do menu mobile, que não existe sem JS de qualquer forma.

---

## 6. Responsividade

Validada por medição (não por olho) em 390 · 768 · 1280 · 1366. `scrollWidth === clientWidth` em todas.

| Elemento | Mobile | Desktop |
|---|---|---|
| Trilho da entrada | linha horizontal acima | coluna sticky de 13rem |
| H1 | quebra natural | três linhas compostas (`lg+`) |
| Ficha de concurso | 2 colunas | 4 colunas |
| Professores | 1 coluna | 2 (`sm`) → 3 (`lg`) |
| Diferenciais | 1 coluna | 2 colunas |
| Bolsas | empilhado | texto + CTA lado a lado |

---

## 7. Acessibilidade

- H1 único; hierarquia H1 → H2 → H3 sem pular nível (auditada).
- Landmarks reais; `<dl>` para pares rótulo/valor; `<ol>` para o ciclo; `<ul>` para listas.
- Alvos de toque ≥ 44px em `pointer: coarse` — só o skip link fica abaixo, e ele cresce ao focar.
- 12 de 12 links externos com `rel="noopener noreferrer"` e aviso "(abre em nova aba)".
- Ornamentos e o campo gráfico com `aria-hidden`.
- Cor de contexto nunca sozinha.

---

## 8. SEO

Metadata própria da Home: título com marca + assinatura + cidade, description com os quatro concursos e o mecanismo. Sem keyword stuffing e sem dado inventado. Open Graph próprio. Indexação segue bloqueada por `NEXT_PUBLIC_ALLOW_INDEXING`.

JSON-LD ainda não entra: depende de endereço, telefone e horário, que não existem.

---

## 9. Assets

**Em produção:** nenhum arquivo. A Home inteira é tipografia, SVG inline e tokens — sem uma única requisição de imagem.

**Temporários, com ponto de substituição documentado:**

| O que | Onde | Substituir por |
|---|---|---|
| Wordmark tipográfico | `Wordmark.tsx` | águia + wordmark em SVG |
| `GraphicField` no hero | `Ornament.tsx` | águia em marca d'água, ou fotografia real com overlay navy |
| Monograma dos professores | `Professores.tsx` | `next/image` com retrato (`aspect-[4/5]`) |
| Sem brasões nas linhas de rota | `Concursos.tsx` | brasão da escola ao lado da sigla |

---

## 10. Pendências

1. **Logo em SVG** — bloqueia header, footer e favicon.
2. **Brasões** das quatro escolas.
3. **Fotografias** dos professores.
4. **Rotas internas ainda não existem** (`/o-curso`, `/metodologia`, `/concursos`, `/professores`, `/bolsas`, `/contato`): os links do menu e o "Ver todos os concursos" levam a 404 até a próxima etapa.
5. **Fluxo de matrícula e processo de bolsa** — hoje ambos caem no WhatsApp contextualizado.
6. **`/dev/foundation`** precisa sair (ou ficar bloqueada) antes do deploy público.
