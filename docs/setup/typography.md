# Tipografia — Prime Prep

Implementação: [`src/lib/fonts.ts`](../../src/lib/fonts.ts)

## O que as peças mostram

A análise da Fase 1 identificou três comportamentos tipográficos distintos e recorrentes:

1. **Wordmark e rótulos**: serifada capitular de traço inscricional, caixa alta, versaletes, tracking muito largo (`PRIME PREP`, `CURSO PREPARATÓRIO MILITAR`).
2. **Nomes por extenso**: itálico serifado (`Escola de Especialistas de Aeronáutica`).
3. **Corpo e dados**: sans-serif geométrica, legível em listas objetivas.

Não há manual de marca nem fontes oficiais declaradas (pendência A/B em `open-questions.md`). O que segue é uma escolha por **equivalência de estilo**, documentada e reversível.

## Escolha

### Cinzel — papel *inscription*

Fonte romana inscricional derivada das capitais de Trajano, que é exatamente a família do wordmark das peças. É caixa-alta por construção, o que a torna inadequada para texto corrido e ideal para o papel que ela ocupa.

**Uso permitido**: wordmark, eyebrows de seção, rótulos de até ~4 palavras, sigla de concurso.
**Uso proibido**: qualquer frase, qualquer parágrafo, qualquer label de formulário.
Pesos: 400, 600. **Não pré-carregada** — nunca aparece em corpo de texto acima da dobra.

### Fraunces — papel *display*

Serifada variável com eixos de **optical size** e **SOFT**. Escolhida especificamente para resolver o risco levantado no planejamento: serifada de alto contraste que se quebra em tamanhos pequenos. O eixo `opsz` reduz o contraste automaticamente em títulos menores, mantendo a legibilidade; em `--text-display` ela entrega o contraste editorial que a marca pede.

Tem itálico real, que assume o papel do "nome por extenso" das peças de concurso.

**Uso**: h1–h4, números de destaque, citações, `.text-editorial-italic`.
Pesos: variável (um arquivo cobre toda a faixa).

### Inter — papel *sans*

Sans-serif de interface com métricas desenhadas para tela, excelente em caixa alta espaçada (necessário para `.text-label-caps`) e em tabelas de dados — que é o componente mais importante do site (comparativo de concursos).

**Uso**: corpo, UI, navegação, formulários, tabelas, captions.
Peso: variável.

## Três famílias — justificativa

Três é acima da média e foi uma decisão consciente, não acidental. A alternativa era fundir os papéis 1 e 2 numa única serifada, mas isso perderia o contraste inscricional/editorial que é a assinatura mais reconhecível da marca nas peças.

Mitigações de custo:
- Todas as três são **variáveis**: um arquivo por família cobre toda a faixa de pesos.
- Cinzel usa apenas 2 pesos estáticos e **não é pré-carregada**.
- `next/font` faz self-hosting no build (zero requisição a terceiros) e injeta `size-adjust` calculado, eliminando CLS.
- Subset `latin` apenas.
- `display: swap` em todas.

## Escala

Fluida via `clamp()`, definida em `tokens.css`:

| Token | mobile → desktop |
|---|---|
| `--text-display` | 48 → 96px |
| `--text-h1` | 40 → 68px |
| `--text-h2` | 32 → 48px |
| `--text-h3` | 24 → 32px |
| `--text-h4` | 20 → 24px |
| `--text-body-lg` | 18 → 21px |
| `--text-body` | 16 → 18px |
| `--text-body-sm` | 15 → 16px |
| `--text-label` | 13 → 14px |
| `--text-caption` | 12 → 13px |

A razão abre de ~1.25 (mobile) para ~1.333 (desktop): hierarquia dramática em tela grande, compacta no celular.

**Corpo**: 16–18px, altura de linha 1.65, medida de leitura ~68ch (`.container-prose`).
**Tracking**: `--tracking-inscription` 0.18em (Cinzel), `--tracking-label` 0.14em (caps sans), `--tracking-tight` -0.02em (títulos display).

## Regras

1. Serifada nunca abaixo de 16px em peso leve.
2. Tracking largo só em rótulos de até 4 palavras — nunca em parágrafo.
3. Títulos usam `text-wrap: balance`; parágrafos usam `text-wrap: pretty` (ambos em `base.css`).
4. `font-synthesis-weight: none` — sem negrito sintético.
5. Hierarquia por **tamanho + cor + espaço**, nunca por caixa colorida.

## Se o cliente informar as fontes oficiais

A troca é local: `src/lib/fonts.ts` + os três tokens `--font-*` em `tokens.css`. Nenhum componente referencia nome de fonte diretamente. Se as oficiais não tiverem licença web, este documento registra as substitutas e a razão.
