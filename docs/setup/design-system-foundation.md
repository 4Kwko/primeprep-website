# Fundação do Design System — Prime Prep

Arquivos: [`src/styles/tokens.css`](../../src/styles/tokens.css) · [`src/styles/base.css`](../../src/styles/base.css) · [`src/styles/utilities.css`](../../src/styles/utilities.css) · [`src/lib/motion.ts`](../../src/lib/motion.ts)

---

## 1. Arquitetura em três camadas

```
CAMADA 1  primitivas      --color-navy-600, --color-gold-500, --text-h1, --duration-base
          (valores brutos; NUNCA usadas direto em componente)
                 ↓
CAMADA 2  semânticas      --color-canvas, --color-fg, --color-accent, --color-border
          (o que o componente consome — via bg-canvas OU var(--color-canvas))
                 ↓
CAMADA 3  superfícies     [data-surface="bone" | "navy" | "ink"]
          (redefine a camada 2 para a subárvore inteira)
```

### Por que `@theme` e não `@theme inline`

Decisão testada e corrigida durante o Setup. Com `@theme` normal, `bg-canvas` compila para `background-color: var(--color-canvas)` e a variável é **resolvida no elemento** — é isso que permite a um `[data-surface="navy"]` reescrever o tema de tudo abaixo dele. Com `@theme inline`, a resolução aconteceria no `:root` e os escopos não trocariam nada em CSS escrito à mão (a primeira versão tinha esse bug; ver `setup-decisions.md`, D-04).

Consequência prática: **existe um único nome por token**, válido tanto em utilitário Tailwind quanto em `var()`.

---

## 2. Cor

### O problema que a paleta resolve

A Fase 1 tinha proposto um sistema essencialmente navy + ouro. Isso é monocromático e não sustenta um site longo. A paleta foi expandida para uma **harmonia de cinco famílias que se explicam mutuamente**:

| Família | Papel semântico | Por que existe |
|---|---|---|
| **Navy** `#0f2350` | autoridade, marca | é a cor da instituição |
| **Bone** `#f6f3ec` | leitura, respiro | pergaminho quente — é o que quebra a frieza e evita a fadiga do escuro em página longa |
| **Gold** `#c8a24b` | mérito, distinção | acento estratégico, ≤5% da área |
| **Crimson** `#8e2f3c` | ênfase heráldica | fita/brasão; dá calor onde o ouro seria excessivo |
| **Steel** `#5b6b8c` | estrutura, texto secundário | neutro frio que não é cinza morto |

Bone é a decisão que mais muda o resultado: um off-white **quente** contra um navy **frio** cria tensão cromática sem introduzir uma cor "de enfeite".

### Cores de contexto por concurso

Cinco tokens derivados das instituições reais, usados para codificar concursos — nunca como decoração livre:

| Token | Concurso | Claro | Escuro |
|---|---|---|---|
| `--color-arma-marinha` | EFOMM | `#1b5e72` | `#63b8cd` |
| `--color-arma-aero` | AFA | `#1f6fa8` | `#6cb0e0` |
| `--color-arma-aero-light` | EEAR | `#26708f` | `#9ed3e6` |
| `--color-arma-exercito` | ESA | `#4e6a45` | `#9cbb90` |
| `--color-arma-cadete` | EsPCEx | `#8e2f3c` | `#e6949f` |

São **sensíveis à superfície** como o resto do sistema: os escopos escuros redefinem os mesmos nomes, então `var(--color-arma-efomm)` sempre atinge AA onde estiver. É isso que dá dinamismo cromático ao site sem inventar cores arbitrárias — cada cor tem uma razão institucional.

O verde do Exército é usado **exclusivamente** como código de concurso. Nunca como cor de tema (a restrição anti-caricatura do planejamento continua valendo).

### Superfícies

- **bone** — padrão do documento. Conteúdo longo, metodologia, FAQ, páginas de concurso.
- **navy** — hero, faixas de afirmação, CTA final, footer.
- **ink** — contraste máximo. Uso pontual, no máximo 1–2 seções no site inteiro.

Superfícies são **aninháveis**: um bloco `bone` dentro de um `navy` volta ao tema claro corretamente.

### Contraste — auditado, não estimado

Todos os pares semânticos foram medidos nas três superfícies. Resultado: **todos passam AA**, a maioria com folga AAA.

| Par | bone | navy | ink | mínimo |
|---|---|---|---|---|
| fg / canvas | 15.09 | 14.61 | 18.31 | 4.5 |
| fg-muted / canvas | 7.58 | 9.45 | 8.26 | 4.5 |
| fg-subtle / canvas | 4.11 | 4.21 | 3.58 | 3.0 |
| accent / canvas | 4.88 | 7.50 | 9.40 | 4.5 |
| primary-fg / primary | 14.61 | 7.50 | 8.28 | 4.5 |
| secondary-fg / secondary | 7.67 | 4.59 | 4.59 | 4.5 |
| focus / canvas | 10.52 | 9.36 | 11.74 | 3.0 |

Nota: `--color-accent` é o **ouro escuro** (`gold-700`) sobre bone e o **ouro claro** (`gold-400`) sobre navy/ink. Sem essa troca o ouro reprovaria em texto sobre pergaminho — é a razão de o acento ser um token semântico e não um valor fixo.

### Regra do ouro (não negociável)

Máximo ~5% da área de qualquer tela. Papéis permitidos: borda/fundo de CTA primário, ícones, hairlines, eyebrow, item ativo de navegação, marcador de lista, losango. **Proibido**: parágrafos, texto abaixo de 18px sobre navy, fundo de bloco grande, gradiente.

---

## 3. Tipografia

Detalhamento em [`typography.md`](./typography.md). Resumo:

| Papel | Família | Uso |
|---|---|---|
| Inscription | **Cinzel** | wordmark, eyebrows, rótulos de até ~4 palavras em caixa alta |
| Display | **Fraunces** (variável, eixos `opsz` + `SOFT`, itálico) | h1–h4, números de destaque, nomes de concurso em itálico |
| Sans | **Inter** (variável) | corpo, UI, formulários, tabelas, navegação |

Escala **fluida por `clamp()`** (`--text-caption` … `--text-display`), sem breakpoints manuais. A razão abre de ~1.25 no mobile para ~1.333 no desktop: a hierarquia fica mais dramática em tela grande e mais compacta no celular, que é onde o público realmente chega.

---

## 4. Espaçamento

- Base **4px** (`--spacing: 0.25rem`), que alimenta toda a escala do Tailwind.
- Ritmo vertical de seção em três intensidades fluidas: `--space-section-sm` (48→72px), `--space-section` (72→128px), `--space-section-lg` (96→176px), expostas como `.section-sm` / `.section` / `.section-lg`.
- Gutter lateral responsivo único: `--gutter` (20→40px).
- Containers: `prose` 44rem (medida de leitura ~68ch), `content` 68rem, `wide` 82rem, `full` 96rem.

Nenhum valor de espaçamento arbitrário deve aparecer em componente. Se um caso pedir um valor novo, ele entra na escala.

---

## 5. Forma

Raio contido e consistente: `xs 2px` · `sm 4px` · `md 8px` · `lg 12px` · `xl 16px`. Nada de pill ou blob — a referência é cartão institucional, não SaaS.

**Hierarquia por borda, não por sombra.** Cartões usam `1px` de `--color-border` sobre `--color-surface`. É o que reproduz o rigor das peças da marca.

Divisores: `.rule-hairline` (filete simples) e `.rule-ornament` (filete interrompido por losango — máximo 1 por dobra).

---

## 6. Sombras

Quatro tokens, todos tingidos de navy (nunca cinza puro): `--shadow-hairline`, `--shadow-raise`, `--shadow-lift`, `--shadow-inset-top`.

Elevação principal vem de **borda + valor de fundo**. Sombra é reforço, não estrutura. Nada de card flutuando com glow — é a estética explicitamente vetada no briefing.

---

## 7. Motion

Tokens em `tokens.css`, presets em [`src/lib/motion.ts`](../../src/lib/motion.ts).

**Durações**: `instant 90ms` · `fast 160ms` · `base 260ms` · `slow 420ms` · `reveal 640ms`.
**Easings**: `--ease-out-quart` (entradas), `--ease-in-out-quint` (transições de página), `--ease-standard` (micro-interações).
**Deslocamento de entrada**: `--motion-rise: 14px`. Curto e decidido. Sem spring, sem bounce.

Princípios:
1. Reveal por scroll dispara **uma vez** e no nível do **bloco**, não elemento a elemento.
2. Stagger no máximo 4–6 filhos, 60ms entre eles.
3. Hover muda **borda e cor**, não escala.
4. Se a animação não ajuda a entender ou orientar, ela sai.

`prefers-reduced-motion` é tratado em duas frentes: globalmente em `base.css` (neutraliza toda transição/animação CSS) e, para animações orquestradas por JS, via `useReducedMotion()` do `motion`.

---

## 8. Utilitários de assinatura

Poucos, cada um carregando um traço concreto da identidade extraída das peças:

| Utilitário | O que é |
|---|---|
| `.mark-lozenge` | o losango de 4 pontas do ornamento da marca, como forma pura (`clip-path`) |
| `.rule-ornament` | filete duplo com losango central |
| `.text-inscription` | Cinzel caixa alta, tracking `0.18em` |
| `.text-label-caps` | sans caixa alta, tracking `0.14em` |
| `.text-editorial-italic` | Fraunces itálico — nome por extenso de concursos |
| `.card-surface` / `.card-interactive` | cartão hairline + hover de borda dourada |
| `.texture-linen` | textura de linho procedural em SVG inline (sem requisição, sem raster), opacidade 0.05 |
| `.container-*`, `.section*` | containers e ritmo vertical |
| `.sr-only-focusable` | skip link |

**Critério para entrar aqui**: o padrão precisa aparecer em pelo menos duas seções. Nada preventivo.

---

## 9. O que ainda NÃO existe (é Fase 3)

Botão, input, badge, acordeão, tabela comparativa, header, footer, cards de concurso e de professor. A fundação define **como** eles vão parecer; a construção é da fase seguinte.
