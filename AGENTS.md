<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Prime Prep — convenções do projeto

Leia `PROJECT_CONTEXT.md` e `DESIGN.md` primeiro. Documentação completa em `docs/planning/` (Fase 1), `docs/setup/` (Fase 2) e `docs/implementation/` (Fase 3).

## Regras invioláveis

1. **Não inventar dados.** Preço, endereço, telefone, aprovações, depoimentos, CNPJ e dados de edital só entram com fonte fornecida pelo cliente. Campos não confirmados são `null` em `src/lib/site.ts` e `src/content/`.
2. **Dado de edital usa `DadoReferencia<T>`.** Com `verifiedAt: null`, a UI é obrigada a marcar como referência, nunca como definitivo.
3. **Nunca use valor hardcoded de cor, espaço, raio ou duração.** Só tokens semânticos (`bg-canvas`, `text-fg`, `var(--color-accent)`, `--space-section`).
4. **Ouro ≤ 5% da área de qualquer tela.** Nunca em parágrafo, nunca em texto < 18px sobre navy, nunca como fundo de bloco grande.
5. **Superfície define tema.** Use `data-surface="bone|navy|ink"` no bloco; não crie props de variante de tema em componentes.
6. **Nenhuma dependência nova sem registrar em `docs/setup/setup-decisions.md`.**
7. **Server Component por padrão.** `"use client"` só com estado, evento ou animação orquestrada, e o mais fundo possível na árvore.
8. **Sem estética de template**: nada de hero com badge + dois botões + mockup, glow, glassmorphism, bento grid, gradient text, blobs, pills em excesso, ícones genéricos de preenchimento.
9. **Militar com maturidade**: sem camuflagem, estêncil, armas, HUD tático ou verde militar como tema. O verde do Exército é exclusivamente código de concurso.
10. **Mobile é o caso base.** Valide em 375px antes de qualquer outra largura.
11. **Toda seção de conteúdo usa `LogEntry`** (número + rótulo no trilho de margem). Nada de empilhar títulos centralizados.
12. **CTA só via `<Cta>` / `resolveIntent()`.** Nenhum componente monta URL de WhatsApp.
13. **Animação é CSS.** Não há biblioteca de animação no projeto, e não deve voltar a haver (D-56): a última custava 46KB comprimidos em toda página por uma animação de menu. Reveal por scroll usa `data-reveal` + `Reveal`; paralaxe usa `animation-timeline`; o resto é keyframe. Ver D-21.
14. **Variáveis de fonte ficam no `<html>`.** No `<body>` elas quebram silenciosamente. Ver D-22.
15. **A marca só entra por `Wordmark.tsx`.** Nunca referencie um arquivo de logo direto, nunca redesenhe nem vetorize. Varie a aplicação por papel; não repita a mesma variação na mesma tela.
16. **Profundidade vem da composição**, não de `box-shadow` em todo cartão: planos sobrepostos, campo que continua atrás do conteúdo, painel que atravessa a costura. Em superfície escura, elevação tonal antes de sombra. Ver D-33.
17. **Sem travessão na copy pública.** Nada de em dash (—) ou en dash (–) em texto visível, `title` ou `description`. Use vírgula, dois-pontos, ponto-e-vírgula, parênteses ou uma frase nova. Ver D-32.
18. **Animação nunca é o que torna o conteúdo visível.** Nenhuma animação de entrada de conteúdo parte de `opacity: 0`. Se o navegador adiar o primeiro quadro, a página fica invisível esperando algo que pode não vir. Anime `transform`. Esconder por opacidade só onde o estado visível é o padrão do HTML e o esconder vive sob condição de JavaScript. Ver D-21 e D-39.
19. **Asset derivado da marca sai de `scripts/gerar-assets-marca.mjs`**, nunca editado à mão. Ele só recolore e enquadra recortes existentes; não redesenha nem recorta silhueta. Ver D-48.
20. **Dado estruturado segue a regra 1, e com mais rigor.** JSON-LD só declara campo com origem. `address`, `telephone`, `aggregateRating` e `priceRange` não existem e não podem aparecer: ali o buscador os trata como declaração formal da organização. Ver D-50.

## Antes de entregar

```bash
npm run check
```

Roda typecheck + lint + format:check + **test**. Precisa passar.

Os testes não são cerimônia: eles verificam as regras acima. Inventar um dado, marcar um edital como confirmado sem data, usar travessão na copy pública ou aplicar o livro sozinho **quebra o `check`**.

## Como verificar interface

Medindo o DOM renderizado no navegador, não lendo código e não em DOM simulado. Os defeitos que mais custaram neste projeto passavam por typecheck, lint e build sem reclamar:

- um token `--container-*` sombreando a utilidade `w-full` do Tailwind (D-24);
- `.log-rail` com `position: sticky` que **nunca grudou**, por ser item de grade esticado (D-40);
- paralaxe amarrada a um `overflow: hidden` que não rola, então nascia inativa (D-43);
- `translate` do Tailwind somando com `transform` do keyframe e deslocando a marca em 100% da largura.

Emule o viewport na aba e navegue; **não** carregue as rotas em iframe, porque o `frame-ancestors 'none'` do CSP bloqueia (D-52).
