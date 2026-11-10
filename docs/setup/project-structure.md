# Estrutura do Projeto

```
primeprep site/
├─ docs/
│  ├─ planning/          Fase 1 — identidade, referências, princípios
│  ├─ setup/             Fase 2 — esta documentação
│  └─ references/social/ peças originais do cliente (REFERÊNCIA, não produção)
├─ public/
│  └─ assets/
│     ├─ brand/logo/     logo em produção (SVG) — PENDENTE
│     ├─ brand/brasoes/  brasões das escolas — PENDENTE
│     ├─ icons/          família de ícones outline própria
│     ├─ textures/       texturas raster, se alguma vier a ser necessária
│     ├─ photos/         fotografias reais — PENDENTE
│     └─ og/             imagens Open Graph — PENDENTE
├─ src/
│  ├─ app/               rotas (App Router), metadata, robots, sitemap
│  ├─ components/        componentes React (ver seção abaixo)
│  ├─ content/           conteúdo institucional estruturado (dados, não copy final)
│  ├─ hooks/             hooks de React reutilizáveis
│  ├─ lib/               utilidades e configuração (fonts, metadata, motion, site)
│  ├─ styles/            tokens.css, base.css, utilities.css
│  └─ types/             tipos compartilhados
├─ .env.example          variáveis documentadas, sem valores
├─ eslint.config.mjs
├─ tsconfig.json
└─ PROJECT_CONTEXT.md    contexto rápido para novas sessões
```

## Responsabilidade de cada diretório

### `src/app/`
Somente roteamento, metadata e composição de página. **Nenhuma lógica de apresentação vive aqui** — uma página monta seções, ela não desenha.

Atualmente: `page.tsx` (provisória), `dev/foundation/` (folha de referência interna), `robots.ts`, `sitemap.ts`.

### `src/components/`
Cinco pastas, cada uma com um critério de entrada claro:

| Pasta | O que entra | O que NÃO entra |
|---|---|---|
| `ui/` | primitivas reutilizáveis: `Button`, `Input`, `Card`, `Badge`, `Accordion` | nada específico de uma seção |
| `layout/` | `Header`, `Footer`, `Container`, `Section`, `SkipLink` | conteúdo |
| `sections/` | blocos de página completos: `HeroInstitucional`, `GradeDeDiferenciais`, `TabelaConcursos` | primitivas |
| `decorative/` | assinatura gráfica: `Lozenge`, `OrnamentRule`, `EagleWatermark`, `CornerFlourish` | qualquer coisa com conteúdo semântico |
| `motion/` | wrappers de animação: `Reveal`, `Stagger` | animação embutida em componente de conteúdo |

**Regra de abstração**: um componente só é criado quando o padrão aparece de fato, ou quando a reutilização é evidente pelo sitemap. Nada preventivo, nenhuma prop interface gigante, nenhum componente genérico "para tudo".

### `src/content/`
Conteúdo institucional como **dado tipado**, não hardcoded em JSX. Hoje: `concursos.ts`, `equipe.ts`, `diferenciais.ts`, `navigation.ts`.

Por quê: as páginas de concurso, o menu, o sitemap e a tabela comparativa derivam todos da mesma fonte. Acrescentar um concurso deve ser editar um arquivo, não seis componentes.

**Não é um CMS** e não deve virar um sem necessidade real declarada pelo cliente.

### `src/lib/`
- `site.ts` — dados institucionais e de contato. Campos não confirmados são `null` explicitamente.
- `fonts.ts` — carregamento das três famílias.
- `metadata.ts` — metadata base e helper `pageMetadata()`.
- `motion.ts` — presets e transitions.
- `cn.ts` — concatenação de classes.

### `src/styles/`
- `tokens.css` — as três camadas do design system.
- `base.css` — reset opinativo e defaults de acessibilidade. Nenhuma decisão de layout de página.
- `utilities.css` — utilitários de assinatura.

`src/app/globals.css` apenas importa esses três, nesta ordem.

### `src/types/`
`content.ts` — tipos do conteúdo institucional, incluindo `DadoReferencia<T>`, que força qualquer dado de edital a carregar a informação de quando (ou se) foi verificado.

## Convenções

- Import alias `@/*` → `src/*`. Nada de `../../..`.
- Nomes de arquivo de componente em `PascalCase.tsx`; utilidades em `camelCase.ts`.
- Conteúdo e comentários de código em **português**; identificadores em português quando são do domínio (`concursos`, `professores`), em inglês quando são técnicos (`pageMetadata`, `revealOnScroll`).
- Server Components por padrão. `"use client"` só onde houver estado, evento ou animação orquestrada — e o mais fundo possível na árvore.
