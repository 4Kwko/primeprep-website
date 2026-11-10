# Assets

## Classificação

A distinção que mais importa neste projeto:

| Classe | Significado | Onde vive |
|---|---|---|
| **Produção** | é servido ao usuário final | `public/assets/` |
| **Referência** | orienta o design, nunca é publicado | `docs/references/` |

As **quatro peças enviadas pelo cliente** (cartão institucional, cartão de contato, carrossel de concursos, peça do chatbot) são **referência**, não produção. Elas informam a identidade; não viram imagem de site. Por isso `docs/references/social/` fica **fora de `public/`** — é impossível publicá-las por acidente.

## Estado atual

### Presentes
Nenhum asset de marca em produção. Os SVGs de exemplo do `create-next-app` (`next.svg`, `vercel.svg`, etc.) foram **removidos**.

### Estrutura criada (vazia, aguardando material)

```
public/assets/
├─ brand/logo/      logo em produção
├─ brand/brasoes/   brasões das escolas militares
├─ icons/           família de ícones outline própria
├─ textures/        texturas raster (se alguma vier a ser necessária)
├─ photos/          fotografias reais
└─ og/              imagens Open Graph
```

## Assets ausentes — bloqueiam a Fase 3

### Logo (crítico)

Necessário em **SVG** (vetor, fundo transparente). Variações:

| Variação | Uso | Status |
|---|---|---|
| Horizontal (águia + wordmark lado a lado) | header desktop | ausente |
| Vertical / empilhada | hero, footer | ausente |
| Símbolo isolado (só a águia) | favicon, header mobile, marca d'água | ausente |
| Monocromática clara | sobre navy/ink | ausente |
| Monocromática escura | sobre pergaminho | ausente |

Hoje só existem versões **rasterizadas dentro das peças de social media**, com fundo azul chapado. Não servem: não escalam, não têm transparência e não permitem inversão.

**Não redesenhar a logo.** Se o vetor original não existir, a decisão (vetorizar a partir do raster ou contratar) é do cliente.

### Favicon
Depende do símbolo isolado em SVG. Formatos a gerar depois: `favicon.ico`, `icon.svg`, `apple-icon.png` (180×180). O `favicon.ico` genérico do scaffold segue no lugar e **deve ser substituído**.

### Brasões das escolas
ESA, EsPCEx, AFA, EEAR, EFOMM. Aparecem nas peças em baixa resolução. Precisam vir em PNG transparente de alta resolução ou SVG, com tamanho normalizado entre si. Campo `brasao` em `src/content/concursos.ts` está `null` para todos.

### Fotografias
Nenhuma disponível. Afeta cards de professores (`retrato: null` nos três) e qualquer seção com imagem.

Decisão a tomar com o cliente: **site tipográfico/vetorial** (recomendado — coerente com a identidade e evita banco de imagens genérico) ou fotografia real produzida.

### Imagem Open Graph
A gerar quando a identidade estiver em produção. Pode ser feita programaticamente com `next/og` a partir dos tokens, o que garante consistência — decisão da Fase 3.

## Ícones

A identidade usa **ícones de linha, traço fino uniforme, monocromáticos** — uma família coerente já visível nas peças (WhatsApp, Instagram, e-mail, relógio, alvo).

Decisão: **não** adotar biblioteca genérica (Lucide/Heroicons) como padrão. O briefing veta explicitamente "ícones Lucide em cada linha apenas para preencher espaço", e uma família própria de 8–12 ícones desenhados no mesmo traço é o que separa este site de um template. Serão SVGs inline como componentes React, em `src/components/decorative/icons/`.

Exceção pragmática: ícones de marca de terceiros (WhatsApp, Instagram) usam os glifos oficiais.

## Regras

1. Nada duplicado. Um asset, um lugar.
2. SVG para tudo que for vetor; nunca PNG de logo em produção.
3. Imagens raster sempre via `next/image` (AVIF/WebP, dimensionamento, lazy).
4. Nenhum asset das peças de social media entra em `public/`.
5. Todo asset novo é registrado neste documento.
