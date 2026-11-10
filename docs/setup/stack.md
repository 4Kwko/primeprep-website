# Stack — Prime Prep

## Escolha

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.3.4 |
| Runtime UI | React | 19.2.8 |
| Linguagem | TypeScript (strict estendido) | ^5 |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) | ^4 |
| Motion | `motion` (Motion for React) | ^13.2.0 |
| Fontes | `next/font/google` (self-hosted no build) | — |
| Lint | ESLint 9 flat config + `eslint-config-next` | ^9 |
| Format | Prettier + `prettier-plugin-tailwindcss` | ^3.9 |
| Gerenciador | npm (lockfile v3) | 11.17 |
| Node | 24.x | — |

## Por que Next.js

O briefing pede explicitamente "não é só uma landing page": site institucional, comercial e informacional, com páginas individuais de concursos e capacidade de expansão.

- **SEO**: renderização estática/servidor por padrão, API de `metadata`, `sitemap.ts` e `robots.ts` nativos. Um SPA client-side seria um erro estrutural para um site cuja principal função é ser encontrado.
- **Páginas de concurso**: rotas dinâmicas com `generateStaticParams` a partir de `src/content/concursos.ts` — hoje 5 páginas, amanhã 12, sem mudança de arquitetura.
- **Expansão**: se o cliente quiser depois formulário com envio server-side, área do aluno ou CMS, o caminho existe (Route Handlers, Server Actions) sem migração de framework.
- **Imagens**: `next/image` resolve AVIF/WebP, dimensionamento e lazy loading — relevante para brasões e futuras fotos.
- **Fontes**: `next/font` faz self-hosting no build e injeta `size-adjust`, eliminando CLS de fonte, que é o risco de performance nº 1 de um site tipográfico como este.

## Alternativas consideradas

**Astro** — tecnicamente o menor bundle para um site majoritariamente estático e foi o concorrente mais forte. Descartado porque: (a) o briefing pede motion refinado e coeso em várias seções, o que empurraria boa parte do site para ilhas React de qualquer forma, anulando parte da vantagem; (b) qualquer funcionalidade dinâmica futura (formulário com backend, área do aluno) exigiria adaptador e retrabalho. O ganho de performance não compensa o teto mais baixo.

**WordPress / Webflow / Framer** — descartados: a direção visual depende de um design system tipográfico e cromático próprio e de motion controlado; construtores empurram para estética de template, exatamente o que o planejamento proíbe.

**Vite + React SPA** — descartado por SEO. Inegociável para um curso que precisa aparecer em busca local.

## Por que Tailwind v4 (e não CSS Modules)

A decisão real não é "Tailwind vs. CSS": é onde os tokens vivem. O v4 declara os tokens em CSS (`@theme`) e gera os utilitários a partir deles, então **existe uma única fonte de verdade** (`src/styles/tokens.css`) que serve tanto `bg-canvas` quanto `var(--color-canvas)` escrito à mão. Isso é o que permite o sistema de superfícies (`data-surface`) trocar o tema de uma subárvore inteira sem prop drilling e sem duplicar classes.

Trade-off aceito: className longos em markup. Mitigado por utilitários de assinatura (`card-surface`, `rule-ornament`, `section`) que encapsulam os padrões recorrentes.

## Por que `motion` e não CSS puro

O planejamento pede reveal por scroll orquestrado e transições entre seções. `IntersectionObserver` na mão é viável mas vira código repetido; `motion` resolve com `whileInView`, respeita `useReducedMotion()` e tem tree-shaking. É a única dependência de runtime adicionada além do framework.

## Trade-offs conhecidos

- **Três famílias tipográficas** (Cinzel, Fraunces, Inter) é acima da média. Justificado em `typography.md`; mitigado por fontes variáveis e por não pré-carregar a Cinzel.
- **Next 16 é recente**: `eslint-config-next` 16 e Turbopack como padrão. Superfície de bug maior que uma LTS, compensado por estar alinhado com a documentação atual.
- **npm** em vez de pnpm: menos eficiente em disco, mas zero configuração e nenhuma fricção de deploy.

## Deploy previsto

**Vercel** (build zero-config para Next, preview por branch, domínio + TLS automáticos). **Nada foi configurado ou publicado** — depende de domínio e de decisão explícita do cliente. Alternativa viável: Netlify ou qualquer host Node.
