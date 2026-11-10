# Performance — Fundação

## Metas (Core Web Vitals, mobile 4G)

| Métrica | Alvo |
|---|---|
| LCP | < 2.0s |
| INP | < 200ms |
| CLS | < 0.05 |
| JS na home | < 100KB comprimido |

## Decisões já tomadas

### Renderização estática
Todas as rotas são pré-renderizadas no build. Confirmado na saída: `/`, `/dev/foundation`, `/robots.txt`, `/sitemap.xml` — todas `○ (Static)`. Sem trabalho de servidor por requisição.

### Server Components por padrão
Seção informativa não envia JavaScript. `"use client"` só onde há estado, evento ou animação orquestrada, e o mais fundo possível na árvore — um acordeão é client, a seção que o contém não é.

### Fontes — o risco nº 1 deste projeto
Um site tipográfico com três famílias é onde CLS costuma nascer. Mitigações:

- `next/font/google` faz **self-hosting no build**: zero requisição a `fonts.googleapis.com`, zero conexão a terceiro, sem custo de DNS/TLS extra.
- `size-adjust` calculado automaticamente contra o fallback — a troca de fonte não desloca o layout.
- Todas as três são **variáveis**: um arquivo por família cobre a faixa de pesos.
- Subset `latin` apenas.
- **Cinzel não é pré-carregada** (`preload: false`) — nunca aparece acima da dobra em texto corrido.
- `font-synthesis-weight: none` evita negrito sintético.

### CSS
Tailwind v4 emite apenas o que é usado. A folha compilada de produção está em ~25KB não comprimido, incluindo o sistema de tokens completo e as três superfícies.

Nenhum CSS-in-JS: zero custo de runtime de estilo.

### Texturas e ornamentos sem custo de rede
`.texture-linen` usa `feTurbulence` em SVG **inline como data URI** — sem requisição, sem PNG raster, e escala em qualquer resolução. O losango usa `clip-path`, não imagem.

### Dependência de runtime: uma
Além de `next`/`react`/`react-dom`, só `motion`. Nenhuma biblioteca de componentes, de ícones, de utilidades de classe ou de datas.

`cn()` foi escrito à mão (5 linhas) em vez de trazer `clsx` + `tailwind-merge`. Ver `setup-decisions.md`, D-07.

### Imagens
`next/image` obrigatório para qualquer raster — AVIF/WebP, dimensionamento, lazy por padrão. SVG para logo e ícones.

## Regras para a Fase 3

1. **Nenhuma dependência nova sem justificativa escrita** em `setup-decisions.md`. Carrossel, biblioteca de ícones e utilitários de data são os pedidos previsíveis — todos têm solução nativa.
2. `"use client"` é uma decisão, não um reflexo. Se um componente virou client, perguntar se a parte interativa pode ser extraída.
3. Toda imagem acima da dobra com `priority`; todas as outras sem.
4. Reveal por scroll **uma vez** (`viewport: { once: true }`). Observer que fica ativo o tempo todo custa INP.
5. Animar apenas `transform` e `opacity`. Nunca `width`, `height`, `top` ou `box-shadow` em transição.
6. Nada de parallax dependente de evento de scroll.
7. Vídeo, se houver, nunca com autoplay e sempre `preload="none"`.

## Verificação prevista

Lighthouse (mobile, throttled) sobre o build de produção antes do deploy, e `@next/bundle-analyzer` pontualmente se o JS crescer. Não instalado agora — sem componentes, não há bundle para analisar.
