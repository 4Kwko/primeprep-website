# PROJECT CONTEXT — Site Prime Prep

```
CURRENT PHASE: IMPLEMENTATION
```

Contexto rápido para novas sessões. Detalhes em `docs/planning/` (Fase 1) e `docs/setup/` (Fase 2).

---

## 1. O que é

Curso preparatório para concursos militares em **São Gabriel/RS**. Instagram: **@primeprep.sg**.

**Concursos:** EsPCEx, AFA, EEAR, EFOMM · **Disciplinas:** Matemática, Física, Português, Inglês.
*(ESA fora do site por decisão do cliente — revisível, ver D-19.)*

**Posicionamento:** sério, confiável, disciplinado, especializado, próximo do aluno, orientado por desempenho, premium sem ser elitista, moderno sem perder formalidade.

**Equipe:** João Vitor Melo Montagner (Inglês + coordenação administrativa) · professor de Matemática e Física · professora de Português (nomes omitidos na versão pública). Credenciais em `src/content/equipe.ts`.

**Objetivo do site:** institucional, comercial e informacional — não é landing page. Verdade de produto completa em [`PRODUCT.md`](PRODUCT.md).

**Audiência:** o **responsável** primeiro (credibilidade, método, acompanhamento); o **aluno** (16–18) nas páginas de concurso.

---

## 2. Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict estendido · Tailwind CSS v4 (tokens CSS-first) · `lenis` · `next/font` · ESLint + Prettier · Vitest · npm.

Quatro dependências de runtime, contando `next` e `react`. A biblioteca de animação foi removida (D-56).

Detalhes e alternativas descartadas: [`docs/setup/stack.md`](docs/setup/stack.md).

---

## 3. Arquitetura

```
src/app/         rotas, metadata, robots, sitemap  (só compõe, não desenha)
src/components/  ui · layout · sections · decorative · motion
src/content/     conteúdo institucional tipado (fonte única de menu/sitemap/páginas)
src/lib/         site, fonts, metadata, schema, og, cores-literais, cn
src/styles/      tokens.css · base.css · utilities.css
src/types/       tipos compartilhados
```

Site estático (SSG). Sem banco, sem auth. Server Components por padrão.
Ver [`docs/setup/architecture.md`](docs/setup/architecture.md) e [`docs/setup/project-structure.md`](docs/setup/project-structure.md).

---

## 4. Design system

**North Star: "O Diário de Bordo"** — registro disciplinado de uma travessia. Sistema completo em [`DESIGN.md`](DESIGN.md) (formato DESIGN.md com frontmatter de tokens) + sidecar [`.impeccable/design.json`](.impeccable/design.json).

**Marca:** o asset real (águia + PRIME + livro) vive em `public/assets/brand/logo/` como **máscaras alfa**, pintadas por `currentColor`, então herda a cor da superfície. Quatro variações (`completa`, `aguia`, `wordmark`, `livro`), aplicadas por papel: águia abre, livro fecha, completa assina. Ponto único: [`Wordmark.tsx`](src/components/layout/Wordmark.tsx).

**Matéria:** as superfícies pintam três camadas pelo mesmo escopo `data-surface`: cor, grão de papel (ruído gerado, média 128, mesclado em `overlay` para não deslocar a cor) e luz de cima em navy e ink. Onde duas superfícies diferentes se encontram há costura. Ver [`materia-e-luz.md`](docs/implementation/materia-e-luz.md) e D-57. Onde uma marca é cortada por uma borda, a densidade cai na direção do corte, então ela lê como passando por baixo da página em vez de colada nela (D-59).

**Profundidade:** três planos (`.plano-fundo` / `.plano-meio` / `.plano-frente`) com `z-index` de token. Em superfície escura a profundidade vem de **elevação tonal** antes de sombra, e `--shadow-*` é redefinido por superfície. Na Home o painel do hero atravessa a costura para a seção seguinte; nas seções de leitura a profundidade vem do numeral de registro no plano intermediário. Ver [`brand-depth-pass.md`](docs/implementation/brand-depth-pass.md).

**Assinatura estrutural:** toda seção de conteúdo é um `LogEntry` — número da entrada, rótulo e filete no trilho de margem, conteúdo à direita. É o que impede o empilhamento de seções centralizadas. O trilho gruda ao rolar a partir de `lg` (precisa de `align-self: start`, ver D-40), e a coluna de margem tem duas marcas: a **régua** contínua, que diz onde ela fica, e o **filete** dourado curto, que gruda com o trilho e diz onde se está dentro da entrada (D-60).

**Header e footer são os dois extremos do mesmo sistema.** O header tem superfície própria (`canvas-alt`, um degrau mais escuro que o conteúdo), dois estados de altura e elevação, e **nenhum blur**. O footer é a mesma marca solta: versão completa em escala de assinatura, águia sangrando pela borda esquerda, duas faixas em vez de quatro colunas. Ver [`antislop-ui-refactor.md`](docs/implementation/antislop-ui-refactor.md).

**Cartão precisa se justificar.** Cartão é para objeto discreto (uma pessoa, um concurso, um alvo de navegação), não para parágrafo, e cartão não interativo é plano. `card-raised` foi removido do sistema (D-38).


**Três camadas**: primitivas → tokens semânticos → escopos de superfície (`data-surface="bone|navy|ink"`). Um bloco declara sua superfície e todos os tokens abaixo dele mudam — é o que produz o ritmo cromático alternado sem props de tema.

**Paleta policromática de cinco famílias** (revisão da Fase 1, pedida pelo usuário):

| | | |
|---|---|---|
| Navy `#0f2350` | autoridade, marca | |
| Bone `#f6f3ec` | leitura, respiro | pergaminho **quente** — quebra a monocromia |
| Gold `#c8a24b` | mérito | acento, **≤5% da área** |
| Crimson `#8e2f3c` | ênfase heráldica | |
| Steel `#5b6b8c` | estrutura, texto secundário | |

Mais **cinco cores de contexto por concurso**, derivadas de Marinha / Aeronáutica / Exército, sensíveis à superfície.

**Tipografia**: Cinzel (inscricional, uso restrito) · Fraunces (display, variável, itálico) · Inter (corpo/UI). Escala fluida por `clamp()`.

**Contraste auditado**: todos os pares semânticos passam AA nas três superfícies.

Especificação: [`docs/setup/design-system-foundation.md`](docs/setup/design-system-foundation.md) · [`docs/setup/typography.md`](docs/setup/typography.md).

---

## 5. Conversão

Quatro **intenções**, dois **transportes**. **Sem formulário genérico**, sem backend.

| Intenção | Peso padrão | Destino |
|---|---|---|
| **Matrícula** | primário | ⚠️ pendente → WhatsApp contextualizado |
| **Pedido de bolsa** | contextual | ⚠️ pendente → WhatsApp contextualizado |
| **WhatsApp** | secundário | ✅ `wa.me` |
| **Instagram Direct** | terciário | ✅ `ig.me/m/primeprep.sg` |

**Diagnóstico** (`/diagnostico`): quatro perguntas que apontam entre os quatro concursos. É **calculadora, não formulário** — nada enviado, nada armazenado, nada pedido; a conta acontece no navegador e o resultado vai dentro da mensagem do WhatsApp. Toda a lógica deriva de `concursos.ts`. Ver [`diagnostico.md`](docs/implementation/diagnostico.md) e D-45.

Fonte única: [`src/content/conversion.ts`](src/content/conversion.ts). Componentes usam `resolveIntent()` — **nenhum monta URL de WhatsApp por conta própria**. Bolsa e matrícula são fluxos separados. Nunca os quatro canais com o mesmo peso; um primário por dobra.

Spec completa: [`docs/implementation/conversion.md`](docs/implementation/conversion.md).

---

## 6. Convenções

1. **Nada inventado**: preço, endereço, telefone, aprovações, depoimentos, CNPJ, edital. Campos não confirmados são `null`.
2. **Dado de edital usa `DadoReferencia<T>`** — `verifiedAt: null` obriga a UI a marcar como referência.
3. **Só tokens semânticos** — nenhum valor hardcoded de cor, espaço, raio ou duração.
4. **Ouro ≤5%** da área de qualquer tela.
5. **Mobile é o caso base** — valide em 375px.
6. **Sem formulário genérico.** Nem "Fale Conosco", nem newsletter, nem lead gen.
7. Alias `@/*` → `src/*`. Conteúdo em português; identificadores técnicos em inglês.
8. Dependência nova exige registro em `docs/setup/setup-decisions.md`.

Regras completas em [`AGENTS.md`](AGENTS.md).

---

## 6.1 Testes

**156 testes**, rodados por `npm run check`. Eles verificam as regras do `AGENTS.md`, não só o código: inventar um dado, marcar edital como confirmado sem data, usar travessão na copy pública ou aplicar o livro sozinho **quebra o check**.

Sem `jsdom`, e é decisão (D-46): comportamento de interface é medido no DOM renderizado do navegador, que é onde os defeitos deste projeto realmente apareceram.

**Auditoria de interface não usa iframe.** O `frame-ancestors 'none'` do CSP bloqueia (D-52). Emule o viewport na aba e navegue.

---

## 7. Comandos

```bash
npm run dev      # desenvolvimento
npm run check    # typecheck + lint + format  ← portão antes de entregar
npm run build    # build de produção
```

---

## 8. Implementado

**Shell global**: root layout, header (nav derivada de `navigation.ts`, menu mobile com foco preso), footer em superfície `ink`, skip link. Ver [`docs/implementation/global-shell.md`](docs/implementation/global-shell.md).

**Home completa**: hero + 5 entradas numeradas + fechamento. Ver [`docs/implementation/home.md`](docs/implementation/home.md).

**Páginas internas**: `/concursos` (tabela comparativa) + as 4 páginas de concurso (SSG a partir de `concursos.ts`), `/diagnostico`, `/metodologia`, `/professores`, `/o-curso`, `/bolsas`, `/contato` e 404. Ver [`docs/implementation/paginas-internas.md`](docs/implementation/paginas-internas.md).

**Motion**: tudo em CSS, sem biblioteca de animação (D-56). Reveal por scroll usa `@media (scripting: enabled)` + IntersectionObserver. A paralaxe entre planos é `animation-timeline: view()`, nativa e sem JavaScript, guardada por `@supports` e por `prefers-reduced-motion` (D-43). A rolagem suave é `lenis`, só na roda do mouse, desligada sob movimento reduzido (D-42). Ver [`movimento-e-profundidade.md`](docs/implementation/movimento-e-profundidade.md). A transição de rota anima **só `transform`**, nunca opacidade, pela mesma razão levada ao CSS (D-39): se o navegador adiar o primeiro quadro, uma animação que parte de `opacity: 0` deixa a página invisível.

**Navegação desktop entra em `xl` (1280)**, não em `lg`: medido, em 1024 o header transbordava. De 1024 a 1279 ficam marca + CTA de matrícula + menu.

**Assets temporários** (pontos de substituição documentados): campo gráfico do hero e monograma dos professores. Ícones e imagens de Open Graph são derivados dos recortes da marca por `npm run assets:marca` (D-48), nunca editados à mão.

**Peso** (build de produção, Home): 465KB, sendo 207KB de fonte, 187KB de JS e 41KB de imagem. As máscaras da marca são AVIF com fallback de PNG por `@supports` (D-54).

---

## 9. Estado

- ✅ **Fase 1 — Planejamento** concluída (com adendo cromático da Fase 2).
- ✅ **Fase 2 — Setup** concluída: 17 de 18 critérios. Lint, typecheck e build passam.
- ✅ **Impeccable instalado e inicializado.** Hooks de detecção de design ativos (`PostToolUse` + `Stop`). `PRODUCT.md` criado. Ver [`docs/setup/impeccable.md`](docs/setup/impeccable.md).
- ⚠️ **Assets do cliente ausentes**: logo em SVG, brasões, fotografias. Bloqueiam parte da Fase 3.
- 🔄 **Fase 3 — Implementação: em andamento.**
  - ✅ Etapa 1: `DESIGN.md`, shell global e Home.
  - ✅ Etapa 2: todas as páginas internas. **16 rotas**.
  - ✅ Etapa 3: auditoria final, polimento e fechamento técnico.
  - ✅ Ajuste visual: marca real aplicada e sistema de profundidade.
  - ✅ Refactor visual e de UX: header como camada, estado ativo de navegação, âncoras, transição de rota, descartonização, footer e diferenciação das internas. Ver [`antislop-ui-refactor.md`](docs/implementation/antislop-ui-refactor.md).
  - ✅ Movimento e profundidade: paralaxe entre planos, rolagem suave, entrada do hero, linha de leitura e seleção de texto desativada. Ver [`movimento-e-profundidade.md`](docs/implementation/movimento-e-profundidade.md).
  - ✅ Diagnóstico de concurso: primeira funcionalidade interativa, sem backend e sem dado armazenado. **18 rotas.** Ver [`diagnostico.md`](docs/implementation/diagnostico.md).
  - ✅ Robustez e peso: suíte de testes, fronteiras de erro, favicon, Open Graph, dados estruturados, cabeçalhos de segurança e máscaras em AVIF. Ver [`robustez-e-peso.md`](docs/implementation/robustez-e-peso.md).
  - ✅ Matéria e luz: grão de papel, luz de superfície, costura entre folhas, relevo do botão e cor de contexto no hover. Ver [`materia-e-luz.md`](docs/implementation/materia-e-luz.md).
  - ✅ Fuga e margem: densidade que cai na borda que corta a marca, régua de margem contínua com filete que viaja com a leitura, entrada do resultado do diagnóstico, resposta ao toque, **folha de impressão** (sem ela a página imprimia quase em branco) alto contraste forçado (sem ele o diagnóstico não mostrava a opção marcada) e `prefers-contrast: more`, que leva o site a AAA nas nove rotas. Ver [`fuga-e-margem.md`](docs/implementation/fuga-e-margem.md).

**Do ponto de vista técnico a implementação está concluída.** Tudo que falta depende de conteúdo ou assets do cliente — centralizado em [`docs/implementation/content-pending.md`](docs/implementation/content-pending.md), com checklist de lançamento.

Achados e correções da auditoria: [`docs/implementation/final-audit.md`](docs/implementation/final-audit.md).

Nenhum deploy foi feito. `/dev/foundation` (folha de referência, `noindex`, fora do sitemap) precisa sair antes do deploy público.

**Pendências com o cliente**: [`docs/planning/open-questions.md`](docs/planning/open-questions.md) e a seção de bloqueios em [`docs/setup/setup-checklist.md`](docs/setup/setup-checklist.md).
