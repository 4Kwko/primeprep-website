# Checklist da Fase 2

## Critérios de conclusão

| # | Critério | Status |
|---|---|---|
| 1 | Planejamento lido e respeitado | ✅ |
| 2 | Stack definida e documentada | ✅ |
| 3 | Projeto inicializado | ✅ |
| 4 | `/impeccable init` executado | ✅ instalado e executado; `PRODUCT.md` criado |
| 5 | Impeccable entendido e documentado | ✅ hooks ativos, plano de uso da Fase 3 registrado |
| 6 | Identidade visual com fundação técnica | ✅ |
| 7 | Tokens base definidos | ✅ |
| 8 | Fontes preparadas | ✅ |
| 9 | Assets organizados | ⚠️ estrutura pronta, **material do cliente ausente** |
| 10 | Arquitetura de componentes definida | ✅ (definida; componentes são Fase 3) |
| 11 | Responsividade planejada tecnicamente | ✅ |
| 12 | Acessibilidade com fundação | ✅ |
| 13 | SEO técnico com fundação | ✅ |
| 14 | Tooling funcionando | ✅ |
| 15 | Lint passa | ✅ |
| 16 | Typecheck passa | ✅ |
| 17 | Build de produção passa | ✅ |
| 18 | Documentação atualizada | ✅ |

**17 de 18 completos. O único item parcial (assets) depende de material do cliente.**

---

## Detalhe

### Fundação técnica
- [x] Next.js 16 + React 19 + TypeScript
- [x] TypeScript estrito estendido (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, ...)
- [x] Tailwind v4 com tokens CSS-first
- [x] Alias `@/*` → `src/*`
- [x] ESLint flat config + `eslint-config-prettier`
- [x] Prettier + ordenação de classes Tailwind
- [x] Scripts: `dev`, `build`, `start`, `lint`, `format`, `typecheck`, `check`
- [x] `.gitignore` verificado, com `!.env.example`
- [x] `.env.example` documentado, sem valores
- [x] Nenhum secret versionado

### Design system
- [x] Arquitetura de três camadas (primitivas → semânticas → superfícies)
- [x] Paleta policromática de cinco famílias
- [x] Cinco cores de contexto por concurso, sensíveis à superfície
- [x] Três superfícies (`bone`, `navy`, `ink`), aninháveis
- [x] **Contraste auditado: todos os pares passam AA nas três superfícies**
- [x] Três famílias tipográficas com escala fluida
- [x] Escala de espaçamento base 4px + ritmo de seção em três intensidades
- [x] Raio, bordas, sombras
- [x] Tokens e presets de motion
- [x] Utilitários de assinatura (losango, divisor ornamental, textura de linho, cartão)

### Impeccable
- [x] Instalado (`npx impeccable install --providers=claude --scope=project -y`)
- [x] Hooks ativos (`PostToolUse` 5s + `Stop` 30s) e verificados em funcionamento
- [x] 4 subagentes instalados
- [x] `impeccable context` executado — projeto reconhecido como sistema visual incumbente
- [x] `/impeccable init` executado → `PRODUCT.md`
- [x] Ordem de precedência sobre a identidade documentada
- [ ] `/impeccable document` → `DESIGN.md` — primeiro passo recomendado da Fase 3

### Conteúdo e arquitetura
- [x] `concursos.ts` (**4 concursos** — ESA removida por decisão do cliente)
- [x] `equipe.ts` (3 professores, só credenciais fornecidas)
- [x] `diferenciais.ts` (8 diferenciais)
- [x] `navigation.ts` (fonte única de menu, footer e sitemap)
- [x] Tipos, incluindo `DadoReferencia<T>`
- [x] Pastas de componentes com critério de entrada documentado

### Acessibilidade
- [x] Contraste auditado e corrigido
- [x] Anel de foco por superfície
- [x] Skip link
- [x] `prefers-reduced-motion` em CSS e JS
- [x] Alvos de toque ≥ 44px em toque
- [x] `lang="pt-BR"`, landmark `<main>`
- [x] `scroll-padding-top` para header fixo

### SEO
- [x] Metadata base + helper `pageMetadata()`
- [x] Open Graph e Twitter card
- [x] `robots.ts` e `sitemap.ts` derivados de `navigation.ts`
- [x] **Indexação bloqueada por padrão**
- [x] Convenções de URL definidas
- [ ] JSON-LD — bloqueado por dados institucionais ausentes
- [ ] Metadata final por página — Fase 3

### Validação
- [x] `npm run typecheck` — sem erros
- [x] `npm run lint` — sem erros
- [x] `npm run format:check` — tudo conforme
- [x] `npm run build` — 5 rotas estáticas
- [x] `npm run dev` — servidor sobe e serve
- [x] Sistema de superfícies verificado no CSS compilado
- [x] Contraste verificado numericamente

---

## Bloqueios

### Material do cliente
- **Logo em SVG** com variações (horizontal, vertical, símbolo, mono claro/escuro) — bloqueia header, footer, favicon e hero.
- **Brasões** das cinco escolas em alta resolução.
- **Fotografias** dos professores e da estrutura, ou decisão de site tipográfico/vetorial.
- **Paleta e fontes oficiais**, se existirem — os valores atuais são interpretação documentada.

### Decisões resolvidas no `init`
- ✅ Audiência: responsável primeiro, aluno depois (D-17)
- ✅ Conversão: WhatsApp + chatbot da DM do Instagram, **sem formulário** (D-18)
- ✅ ESA fora do site por ora (D-19)

### Decisões ainda pendentes
Ver [`../planning/open-questions.md`](../planning/open-questions.md). As que mais afetam a Fase 3: página de valores (15), blog (16), nível de motion (9), domínio (20).
