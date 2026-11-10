---
name: Prime Prep
description: Curso preparatório militar em São Gabriel/RS — sistema visual editorial-institucional
colors:
  navy: "#0f2350"
  navy-deep: "#0c1c40"
  navy-elevated: "#1c3572"
  ink: "#0a0f1c"
  bone: "#f6f3ec"
  bone-raised: "#fbfaf6"
  bone-sunken: "#ece7db"
  rule: "#ddd5c3"
  gold: "#c8a24b"
  gold-light: "#d3b263"
  gold-deep: "#83661f"
  crimson: "#8e2f3c"
  crimson-light: "#b8515f"
  steel: "#5b6b8c"
  steel-light: "#c3ccdd"
  arma-marinha: "#1b5e72"
  arma-aero: "#1f6fa8"
  arma-aero-light: "#26708f"
  arma-cadete: "#8e2f3c"
typography:
  display:
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(3rem, 2.05rem + 4.75vw, 6rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2rem, 1.7rem + 1.5vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.5rem, 1.34rem + 0.8vw, 2rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  editorial:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.125rem, 1.07rem + 0.28vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.97rem + 0.18vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(0.8125rem, 0.79rem + 0.12vw, 0.875rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
  inscription:
    fontFamily: "Cinzel, 'Times New Roman', serif"
    fontSize: "clamp(0.8125rem, 0.79rem + 0.12vw, 0.875rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.18em"
rounded:
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "clamp(4.5rem, 3.3rem + 6vw, 8rem)"
  gutter: "clamp(1.25rem, 0.9rem + 1.75vw, 2.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.navy-deep}"
    rounded: "{rounded.sm}"
    padding: "16px 32px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.gold-light}"
    textColor: "{colors.navy-deep}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
    padding: "16px 32px"
    typography: "{typography.label}"
  button-secondary-hover:
    backgroundColor: "{colors.navy-elevated}"
    textColor: "{colors.bone}"
  card:
    backgroundColor: "{colors.bone-raised}"
    textColor: "{colors.navy-deep}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-hover:
    backgroundColor: "{colors.bone-raised}"
    textColor: "{colors.navy-deep}"
  panel-floating:
    backgroundColor: "{colors.navy-elevated}"
    textColor: "{colors.bone}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: Prime Prep

## Overview

**Creative North Star: "O Diário de Bordo"**

Um diário de bordo é o registro disciplinado de uma travessia. Nada nele é decorativo: cada entrada é datada, numerada e medida, porque alguém precisa saber exatamente onde a embarcação estava e para onde vai. É um objeto de papel — quente, manuseado, anotado à mão — que carrega informação rigorosamente técnica. Essa tensão entre **matéria humana e precisão institucional** é a Prime Prep inteira: um curso que promete acompanhamento individual e o prova com uma planilha de desempenho por aluno.

O sistema é, portanto, **editorial antes de institucional, e institucional antes de decorativo**. O fundo dominante é pergaminho quente, não branco clínico nem navy sólido: papel. O navy aparece onde a instituição fala em primeira pessoa — abertura e fechamento — como o mar e a noite ao redor do caderno. O ouro é a marcação de mérito e é escasso por doutrina, não por timidez.

A assinatura estrutural é a **entrada de diário**: cada seção da página é numerada (`01`, `02`, `03`), rotulada na margem e separada por um filete. Isso substitui o empilhamento de blocos centralizados que caracteriza landing pages geradas — a página se lê como um registro em sequência, não como um catálogo de features. Rejeições visuais confirmadas: camuflagem, estêncil, HUD tático, verde militar como tema, estética de infoproduto, glassmorphism, bento grid e gradient text.

**Key Characteristics:**
- Pergaminho quente como superfície de leitura; navy como voz institucional
- Seções numeradas com trilho de margem — composição assimétrica, nunca centralizada em série
- Ouro ≤5% da área de qualquer tela
- Par serifada display + sans de interface, com capitular inscricional em papel de rótulo
- Losango de quatro pontas como marcação de rota, repetido em toda a escala
- Cor de contexto por concurso, derivada da força militar real
- Componentes firmes e táteis: botão sólido com peso, cartão com elevação perceptível

## Colors

Uma paleta de cinco famílias em que cada cor tem função declarada — nenhuma existe por variedade.

### Primary
- **Navy Prime** (`#0f2350`): a voz da instituição. Hero, faixa de fechamento, footer, cabeçalho de tabela. Nunca é o fundo de conteúdo longo.
- **Navy Elevated** (`#1c3572`): superfície elevada e estados de hover dentro do navy.
- **Ink** (`#0a0f1c`): contraste máximo. Reservado para no máximo uma ou duas seções em todo o site.

### Secondary
- **Gold Prime** (`#c8a24b`): mérito, distinção, conquista. Fundo do CTA primário sobre navy, ícones, hairlines de destaque, o losango. Sobre pergaminho troca para **Gold Deep** (`#83661f`), único tom que atinge AA em texto ali.
- **Crimson Heráldico** (`#8e2f3c`): ênfase quente onde o ouro seria excessivo. Também é a cor de contexto da EsPCEx.

### Tertiary — cores de contexto por concurso
Derivadas das forças reais, não escolhidas por estética. Codificam qual concurso está em jogo.
- **Marinha** (`#1b5e72`) — EFOMM · **Aeronáutica** (`#1f6fa8`) — AFA · **Aeronáutica Clara** (`#26708f`) — EEAR · **Cadete** (`#8e2f3c`) — EsPCEx

### Neutral
- **Bone** (`#f6f3ec`): pergaminho. Fundo de leitura padrão. É o que impede o site de ser monocromático e frio.
- **Bone Raised** (`#fbfaf6`) e **Bone Sunken** (`#ece7db`): superfícies elevada e rebaixada sobre papel.
- **Rule** (`#ddd5c3`): filetes e bordas sobre papel.
- **Steel** (`#5b6b8c`) e **Steel Light** (`#c3ccdd`): texto secundário — frio sobre papel, claro sobre navy.

### Named Rules

**A Regra dos 5%.** O ouro ocupa no máximo 5% da área de qualquer tela. Sua raridade é o argumento. Proibido em parágrafo, em texto abaixo de 18px sobre navy, como fundo de bloco grande e em qualquer gradiente.

**A Regra da Superfície.** Nenhum componente escolhe sua própria cor. O bloco declara `data-surface="bone|navy|ink"` e todos os tokens semânticos abaixo dele mudam. Um cartão escrito uma vez funciona nas três superfícies sem variante.

**A Regra do Duplo Portador.** Cor de contexto nunca é o único portador de significado. Toda cor de concurso vem acompanhada da sigla em texto.

**A Regra do Verde.** O verde só existe como código de concurso do Exército. Nunca como cor de tema, de fundo ou de acento — essa é a fronteira entre autoridade militar e caricatura militar.

## Typography

**Display Font:** Fraunces (fallback Georgia, serif) — variável, eixos `opsz` e `SOFT`
**Body Font:** Inter (fallback system-ui) — variável
**Inscription Font:** Cinzel (fallback Times New Roman, serif)

**Character:** Uma serifada de contraste modulado que fica dramática em escala grande e ainda legível em escala pequena, contra uma sans neutra de tela. A Cinzel entra como terceira voz — capitular romana inscricional, a mesma família do wordmark da marca — e é usada como um carimbo, nunca como texto.

### Hierarchy
- **Display** (500, `clamp(3rem, 6rem)`, 1.05): abertura de hero. Uma vez por página.
- **Headline** (500, `clamp(2rem, 3rem)`, 1.1): título de seção.
- **Title** (500, `clamp(1.5rem, 2rem)`, 1.15): título de cartão e subseção.
- **Editorial** (400 itálico, `clamp(1.125rem, 1.3125rem)`, 1.4): nome por extenso de concursos, citações. Herança direta das peças da marca.
- **Body** (400, `clamp(1rem, 1.125rem)`, 1.65): corpo. Medida de leitura 62–72ch.
- **Label** (600, `clamp(0.8125rem, 0.875rem)`, tracking `0.14em`, caixa alta): rótulo de interface, botão, cabeçalho de tabela.
- **Inscription** (400, tracking `0.18em`, caixa alta): eyebrow, marca, número de entrada. Máximo 4 palavras.

### Named Rules

**A Regra das Quatro Palavras.** Tracking largo em caixa alta só existe em rótulos de até quatro palavras. Em frase, destrói a legibilidade.

**A Regra do Carimbo.** Cinzel nunca forma frase. É marca, rótulo ou número — nada mais.

**A Regra da Escala Fluida.** Nenhum tamanho de fonte muda por breakpoint. Toda a escala interpola por `clamp()`, com razão ~1.25 no mobile abrindo para ~1.333 no desktop.

## Layout

**Containers:** `prose` 44rem (leitura, ~68ch) · `content` 68rem (padrão) · `wide` 82rem (grids) · `full` 96rem. Gutter lateral fluido único (`clamp(1.25rem, 2.5rem)`). O body nunca rola horizontalmente.

**Grid:** 12 colunas conceituais. A progressão real é 1 → 2 (`sm`/`md`) → 3–4 (`lg`).

**Ritmo vertical:** três intensidades fluidas — `section-sm` (48→72px), `section` (72→128px), `section-lg` (96→176px). O ritmo alterna deliberadamente entre superfícies: navy → bone → bone → navy → bone → navy. Essa alternância é o que dá respiro a uma página longa e é o motor do dinamismo do site.

**A entrada de diário — assinatura estrutural.** Toda seção de conteúdo se organiza como um registro:

```
┌── 01 ──────────┬─────────────────────────────────┐
│ [nº da entrada]│ Título da seção                 │
│ [rótulo]       │ Corpo, listas, cartões          │
│ (trilho ≤14rem)│ (conteúdo)                      │
└────────────────┴─────────────────────────────────┘
```

No desktop o trilho de margem é uma coluna fixa à esquerda com o número da entrada, o rótulo inscricional e um filete vertical. Abaixo de `lg` o trilho colapsa para uma linha horizontal acima do conteúdo. Isso produz composição assimétrica por construção e torna impossível o empilhamento de títulos centralizados.

**Breakpoints:** padrões do Tailwind (`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536). Mobile é o caso base: toda decisão é validada em 375px antes de qualquer outra largura.

## Matéria e luz

As superfícies não são cor chapada. Cada uma pinta três camadas, todas pelo mesmo
escopo `data-surface`, e nenhum componente precisa saber que elas existem.

**Grão de papel.** Ruído gerado, ladrilhado, com média exatamente 128 e mesclado
em `overlay`, onde cinza médio é a identidade. É isso que permite dar matéria à
folha sem deslocar a cor: medido, o deslocamento é de 0,25 nível de luminância e
o desvio, que é o grão, fica em 2. Dois arquivos de 1,3KB, porque `overlay`
amplifica muito mais sobre fundo escuro.

**Luz de cima, e só onde ela rende.** Um decaimento de 240px na borda superior,
em navy e ink. **No pergaminho não há luz**: numa superfície quase branca ela não
acrescenta quase nada, e o pouco que acrescenta briga com a costura, clareando o
topo da folha justamente onde deveria haver sombra. A altura é fixa de propósito:
esticada na altura da seção, a luz vira lavagem cromática, que é o fundo em
gradiente que o sistema veta.

**Costura.** Onde duas superfícies diferentes se encontram, a de baixo recebe um
filete e uma sombra interna curta, como duas folhas empilhadas. Quem recebe define
a cor da projeção, pela mesma razão da Regra do Degrau Tonal.

### A Regra da Área

Efeito sutil precisa de área. Um gradiente de 8px num losango e uma diferença de
cor numa borda de 1px são **indistinguíveis** do liso: as duas coisas foram
tentadas, renderizadas no tamanho real e descartadas. Relevo só onde há espaço
para ele acontecer, como no botão primário, que tem 52px de altura e onde a
diferença é clara.

O corolário: **antes de acrescentar efeito, olhe para ele no tamanho em que ele
vai aparecer.** A diferença entre os efeitos que ficaram e os que saíram não é de
gosto, é de terem sido olhados.

E o efeito nem sempre falha por ser invisível: às vezes ele funciona e **piora**.
O baixo-relevo no numeral de registro tinha área de sobra (176px, em toda entrada
do site) e apareceu perfeitamente na simulação. Apareceu como contorno vazado:
perdeu a massa que faz o numeral funcionar como peso de margem, e ainda pôs duas
sombras atrás de texto. Foi recusado depois de visto, não antes.

### A fuga

Onde uma marca é cortada por uma borda, a densidade cai na direção do corte, em
vez de terminar reto. É o que a faz ler como passando **por baixo** da página em
vez de colada em cima dela. Vale para a marca d'água e para o numeral de
registro.

**Só onde o corte é assimétrico.** A águia do CTA final é centralizada: em tela
larga nada nela é cortado, e em tela estreita o corte é igual dos dois lados, na
ponta da asa, que já afina sozinha (simulado em 320px: com fuga e sem são quase
indistinguíveis). E a fuga nunca começa antes do que identifica a marca: na
águia, a cabeça fica em torno de 63% da largura do recorte, então a queda só
começa em 60%.

## Elevation & Depth

Sistema **híbrido, tátil por decisão**: a estrutura vem de borda e valor de fundo; a resposta física vem de sombra.

Superfícies em repouso são planas com borda de 1px. O que se move responde ao ponteiro: um cartão interativo ganha sombra real e sobe 2px; um botão primário nasce com sombra e **afunda** ao ser pressionado. A sombra é sempre tingida de navy — cinza puro lê como interface genérica, não como papel.

### Shadow Vocabulary
- **hairline** (`0 0 0 1px color-mix(in oklab, navy 12%, transparent)`): anel de contorno sem geometria própria.
- **raise** (`0 1px 2px rgba(9,21,49,.06), 0 8px 24px -12px rgba(9,21,49,.18)`): repouso de cartão elevado e do botão primário.
- **lift** (`0 2px 4px rgba(9,21,49,.08), 0 20px 48px -20px rgba(9,21,49,.28)`): hover de cartão e de CTA.
- **press** (`0 1px 0 rgba(9,21,49,.20)`): estado `:active`, acompanhado de `translateY(1px)`.
- **inset-top** (`inset 0 1px 0 rgba(255,255,255,.06)`): luz superior em superfícies navy, sugere material.

### Named Rules

**A Regra da Resposta Física.** Sombra comunica estado, não hierarquia. Hierarquia é borda, valor e espaço. Um elemento que não responde a ponteiro não ganha sombra por enfeite.

## Shapes

Raio contido e consistente: `xs 2px` · `sm 4px` · `md 8px` · `lg 12px` · `xl 16px`. **Nunca pill, nunca `rounded-3xl`, nunca blob.** A referência é cartão institucional impresso, não aplicativo.

Bordas de 1px são o instrumento estrutural primário. Filetes horizontais separam entradas; filetes verticais marcam o trilho de margem.

**Losango de quatro pontas** — a geometria de assinatura, extraída do ornamento da marca. Implementado em `clip-path`, sem imagem, dimensionável por `font-size`. Aparece como marcador de lista, centro de divisor ornamental e âncora de entrada. É a "marcação de rota" do diário de bordo.

**Divisor ornamental**: filete fino interrompido por losango central. Máximo um por dobra.

**Textura de linho**: ruído procedural SVG inline a 5% de opacidade. No máximo duas superfícies no site inteiro. Nunca combinada com ornamento e marca d'água na mesma seção.

## Components

### Buttons
- **Shape:** raio `sm` (4px). Rótulo em Label (caixa alta, tracking `0.14em`).
- **Primary:** fundo `gold` sólido, texto `navy-deep`, padding `16px 32px`, sombra `raise`. Hover: `gold-light` + sombra `lift` + `translateY(-1px)`. Active: sombra `press` + `translateY(1px)`.
- **Secondary:** contorno de 1px em `border-strong`, fundo transparente. Hover preenche com `surface-elevated`.
- **Ghost:** só texto, sublinhado em ouro no hover.
- **Focus:** anel de 2px em `--color-focus` com offset 2px — token de superfície, portanto sempre visível.
- Todo botão que abre serviço externo carrega ícone de link externo e texto acessível dizendo isso.

### Cards / Containers
Antes de estilizar qualquer cartão, a pergunta: **isto realmente precisa ser um
cartão?** Uma lista de assuntos é uma lista. Duas definições são um `<dl>`. Dois
canais de peso diferente não são dois cartões iguais. Cartão é para objeto
discreto: uma pessoa, um concurso, um alvo de navegação.

- **Corner:** raio `lg` (12px).
- **Background:** `surface`, borda 1px em `border`.
- **Shadow:** **cartão não interativo é plano.** Só o que é alvo de navegação
  recebe sombra: `contact` em repouso, `lift` no hover, `contact` de novo no
  `:active`.
- **Border no hover:** passa a `accent`.
- **Padding:** 24px (`lg`), 32px em cartões de destaque.

### Navigation
O header é uma **camada de interface**, não o topo da página. Ele tem superfície
própria: `canvas-alt`, um degrau tonal mais escuro que o conteúdo, com luz no
topo e filete na base. **Sem blur em nenhum estado** — blur funde planos, e o
problema que este header resolve é justamente falta de separação.

- **Dois estados.** No topo: 64px (mobile) / 80px (`xl`), base em `hairline`, sem
  elevação. Após rolar: 56px / 64px, base em `border`, elevação `raise`. A altura
  é a única coisa que muda de layout, e como o header é `fixed` nada salta.
- **Item ativo:** filete de 2px que corre sob o rótulo inteiro e cresce da
  esquerda, no vocabulário de trilho do `LogEntry`. No hover ele aparece a 35%.
  Nunca um ponto pequeno: estado ativo tem de ser lido de relance.
- Itens em Label caixa alta. `aria-current="page"` é o portador semântico.
- Um único CTA no header (matrícula, primário). WhatsApp só a partir de `2xl`.
- **Navegação desktop entra em `xl` (1280)**, não em `lg`: medido, em 1024 o
  header pedia 1029px numa caixa de 944px.
- **Mobile:** painel full-screen navy, itens em Fraunces em escala grande,
  entrada escalonada na ordem de leitura, foco preso, `Esc` fecha, foco volta ao
  gatilho. Com o painel aberto o header **não comprime**, senão sobra uma fresta.

### Footer
O outro extremo do mesmo sistema. O header é a marca comprimida (uma faixa, uma
linha, a águia a 26px); o footer é a mesma marca solta, em `ink`, com a versão
completa a 5rem e a águia sangrando pela borda **esquerda**, embaixo. O hero
entra pela direita no alto e abre; o footer sai pela esquerda embaixo e fecha.

Duas faixas, não quatro colunas: primeiro assinatura e conversa, depois o índice
do site. **Nunca** o rodapé genérico de quatro colunas de mesmo peso, que
enterra a conversão no meio de listas de links.

### Signature Component — Entrada de Diário (`LogEntry`)
O componente estrutural do site. Recebe número (`01`…), rótulo inscricional e título; renderiza o trilho de margem no desktop e a linha horizontal no mobile. Toda seção de conteúdo da Home é uma entrada. É o que impede a página de virar uma pilha de blocos centralizados.

**A régua e o filete.** Em `lg` a coluna de margem tem duas marcas, e a divisão
entre elas é o que as torna informação em vez de enfeite:

- a **régua** é contínua, do topo à base da entrada, e diz onde fica a coluna;
- o **filete** é curto, dourado, e gruda no topo enquanto se lê. Ele diz *onde
  estou dentro desta entrada*, e numa entrada de 1920px percorre 1876px.

É o mesmo vocabulário do marcador de item ativo do menu e da linha de leitura do
header, aplicado ao eixo da entrada. Os dois têm 1px, e é isso que os faz
alinharem na mesma coluna de pixel; em 2px o dourado passa a ler como barra
colorida de cartão, que está vetada.

**O meio de uma entrada é papel, e é para ser.** Medido em todas as rotas, seção
de leitura usa `numeral-registro`, `log-entry` e `parallax-contra`, e mais nada:
marca d'água, campo gráfico e ornamento vivem só na abertura e no fecho de cada
página. A resposta certa para uma seção longa sem estrutura é a régua e o filete
que viaja, não mais mobília.

### Signature Component — Cabeçalho Interno (`PageHeader`)
Duas composições, decididas pelo conteúdo e não pelo gosto. Sem carga extra: uma
coluna (rótulo, título, lead). Com carga (`children`: um CTA, a força do
concurso): duas colunas em `lg`, texto à esquerda e carga ancorada à base da
direita. Quem tem algo a mais para oferecer no cabeçalho ganha a coluna; quem não
tem, não ganha. É o que impede as seis internas de abrirem idênticas.

### Signature Component — Campo Gráfico (`GraphicField`)
Composição abstrata construída inteiramente com tokens — grade de filetes, losangos em escalas variadas, gradiente de superfície. Existe porque **não há logo em SVG, fotografia nem brasão**: o hero precisa de presença visual sem recriar a marca. É deliberadamente substituível quando os assets reais chegarem.


## Brand Mark

O asset real é raster monocromático. Cada variação é exportada como **máscara
alfa** e pintada com `background-color: currentColor`, então a marca herda a cor
da superfície em que está e funciona em bone, navy e ink sem duplicar arquivo e
sem nunca sair com a cor errada.

Todas as variações são recortes do **mesmo arquivo original**. Nada foi
redesenhado, vetorizado à mão ou reconstruído.

| Variação | Proporção | Onde |
|---|---|---|
| `completa` águia + PRIME + livro | 2.06:1 | footer (assinatura institucional) |
| `aguia` só a águia | 4.86:1 | header, marca d'água do hero e das internas |
| `wordmark` PRIME + livro | 2.08:1 | onde a águia já apareceu ou não cabe |
| `livro` só o livro | 4.56:1 | assinatura de fecho (CTA final) |

**A Regra da Variação.** A marca não se repete idêntica na mesma tela. A águia
abre (header e hero), o livro fecha (CTA final), a completa assina (footer). Uma
variação por papel; nunca a mesma duas vezes seguidas.

Ponto único de aplicação: `src/components/layout/Wordmark.tsx`. Trocar o raster
por SVG é editar esse arquivo, nada mais.

## Depth & Layers

O sistema tem **três planos**. Não é obrigatório existir três em toda seção: a
profundidade é usada nos momentos de maior importância, e a Home carrega a
aplicação mais forte.

**Plano 1 — campo de fundo** (`.plano-fundo`). Grade de filetes, gradiente de
profundidade, textura. Nunca disputa com o conteúdo. O campo **dissolve** com
máscara radial em vez de terminar numa linha, então parece continuar atrás.

**Plano 2 — midground** (`.plano-meio`). Ornamento e marca d'água. É onde a águia
real vive, em opacidade `0.055`, sangrando pela borda direita e passando por trás
do conteúdo. Escondido abaixo de `lg`, onde só disputaria espaço.

O **numeral de registro** (`.numeral-registro`) também vive aqui: o número da
entrada repetido em 11rem, opacidade `0.045`, atrás do início do conteúdo. É o
que dá profundidade às seções de leitura, onde cartão ou sombra seriam ruído, e
reforça a metáfora do diário no lugar em que ela de fato vive: a numeração.
Some abaixo de `lg`.

**Plano 3 — conteúdo** (`.plano-frente`). Título, texto, CTA, tabela. Precisa de
`z-index` explícito, senão disputa a pilha com o campo gráfico.

### O painel suspenso
O objeto que mais comunica profundidade (`.painel-suspenso`): superfície elevada,
borda, contato curto, difusa muito larga e luz no topo. Na Home ele **atravessa a
costura** entre o hero e a seção seguinte, ficando metade sobre navy e metade
sobre pergaminho.

### Named Rules

**A Regra do Degrau Tonal.** Em superfície escura a profundidade vem primeiro de
**elevação tonal**, e só depois de sombra. Uma sombra tingida de navy some sobre
navy — fundo e sombra têm quase a mesma luminância. Por isso `--shadow-*` é
redefinido em cada escopo de superfície, e os painéis usam `surface-elevated`.

**A Regra do Recorte.** Seção com plano de fundo usa `overflow-x: clip`, nunca
`overflow: hidden`. `clip` corta o sangramento lateral sem travar o eixo Y, então
o painel ainda pode atravessar a costura. `hidden` forçaria o outro eixo a `auto`
e mataria a sobreposição.

**A Regra do Contraste Elevado.** Token de texto sobre superfície escura é
calibrado contra a superfície **elevada**, não só contra o canvas. Um valor que
só passasse no canvas reprovaria dentro dos painéis. O mesmo vale para o que fica
atrás do texto: o numeral de registro escurece o fundo efetivo em 4,5%, e o pior
par ainda mede 4.62:1.

**A Regra da Camada de Interface.** O header não pode compartilhar a superfície
do conteúdo que ele cobre. Ele tem degrau tonal próprio, luz no topo e filete na
base, e muda de altura ao rolar. Separação é composicional; `backdrop-filter`
não é solução, é o oposto dela.

**A Regra do Quadro que Pode Não Vir.** Nenhuma animação de entrada de conteúdo
começa em `opacity: 0`. Se o navegador adiar o primeiro quadro (aba em segundo
plano, renderização suspensa), o conteúdo fica invisível esperando algo que pode
nunca chegar. Anime `transform`: o pior caso vira um deslocamento, não um
apagão. Esconder por opacidade só onde o estado visível é o padrão do HTML e o
esconder vive sob condição de JavaScript. Ver D-21 e D-39.

**A Regra do Cartão Justificado.** Cartão é para objeto discreto, não para
parágrafo. E cartão que não é clicável é plano: sombra responde a estado, e
quando tudo flutua, elevação não significa nada.

**A Regra do Curso Diferente.** Profundidade também é movimento. Enquanto uma
seção atravessa a janela, planos diferentes percorrem distâncias diferentes: o
campo faz 40px, a marca d'água 120px, o ornamento 56px ao contrário, e o conteúdo
não sai do lugar. O que o olho lê é a diferença, não a distância, e por isso os
valores são pequenos. **Plano de conteúdo não recebe paralaxe**, com a única
exceção de bloco curto sem leitura corrida; parágrafo nunca.

**A Regra do Recorte, segunda parte.** `overflow: clip` também importa para
movimento, não só para sangramento: `hidden` cria container de ROLAGEM, e
`animation-timeline: view()` se amarra ao container de rolagem mais próximo. Um
`hidden` no caminho amarra a animação a uma caixa que não rola e ela nasce morta.
Neste projeto, `clip` é quase sempre o certo. Ver D-35 e D-43.

**A Regra da Cor de Contexto.** Onde existe cor de concurso, ela é quem responde
ao ponteiro: a borda do cartão no hover e o realce da linha na tabela usam
`--concurso`, não o acento genérico. Assim o realce deixa de ser decoração e vira
informação, porque diz de qual escola é o alvo antes do clique.

**A Regra do Objeto Clicável.** Cartão que é alvo de navegação assenta na
superfície com sombra de **contato** em repouso e sobe com `lift` no hover. Um
alvo plano até o ponteiro chegar parece texto, não objeto. Cartão não interativo
segue plano.

### Shadow Vocabulary (atualizado)
- **contact** curto e escuro, assenta o objeto na superfície
- **raise** repouso de cartão elevado e de botão primário
- **lift** hover
- **float** contato + difusa larga: o par que cria distância real do fundo
- **overlay** painéis que cobrem conteúdo (menu mobile)
- **press** `:active`

Todos redefinidos por superfície: navy e ink usam base quase preta.

### Mobile
Abaixo de `lg` a profundidade recua: marcas d'água somem, o painel não atravessa
costura, offsets negativos não se aplicam. Sobra o essencial — elevação tonal,
borda e sombra de contato. Nenhum efeito de profundidade pode gerar scroll
horizontal nem cobrir texto.

## Do's and Don'ts

### Do:
- **Do** declarar a superfície no bloco (`data-surface`) e deixar os tokens semânticos fazerem o resto.
- **Do** usar `LogEntry` para toda seção de conteúdo — numeração e trilho de margem são a assinatura estrutural.
- **Do** manter o ouro abaixo de 5% da área e trocá-lo por `gold-deep` sobre pergaminho.
- **Do** alternar superfícies para criar ritmo: navy → bone → bone → navy.
- **Do** acompanhar toda cor de concurso da sigla em texto.
- **Do** animar apenas `transform` e `opacity`, com reveal de bloco disparando uma única vez.
- **Do** tratar ausência de dado como ausência — campo vazio custa menos que dado falso.
- **Do** validar em 375px antes de qualquer outra largura.
- **Do** consumir a marca só por `Wordmark.tsx`, variando a aplicação por papel.
- **Do** buscar profundidade na composição: planos que se sobrepõem, campo que
  continua atrás do conteúdo, painel que atravessa a costura entre seções.
- **Do** usar elevação tonal antes de sombra em superfície escura.
- **Do** dar cursos diferentes a planos diferentes, e nenhum ao conteúdo.
- **Do** guardar animação de scroll com `@supports` **e** `prefers-reduced-motion`.
- **Do** olhar um efeito no tamanho real antes de mantê-lo.
- **Do** perguntar, antes de cada bloco, se aquilo precisa mesmo ser um cartão.
- **Do** deixar o conteúdo visível sem depender de quadro de animação.
- **Do** variar a composição de abertura das internas conforme o que a página tem
  a oferecer, mantendo o sistema compartilhado.

### Don't:
- **Don't** empilhar seções de título centralizado — é o padrão de landing gerada que o `LogEntry` existe para evitar.
- **Don't** usar badge + H1 central + dois botões lado a lado + mockup.
- **Don't** usar gradient text, glow, glassmorphism, bento grid, blob ou `rounded-3xl`.
- **Don't** repetir grades de três ou seis cartões idênticos com um ícone cada.
- **Don't** inventar métrica, aprovação, depoimento, logo de parceiro ou dado de edital como definitivo.
- **Don't** usar camuflagem, estêncil, arma, HUD tático ou verde militar como tema.
- **Don't** criar urgência artificial: "últimas vagas", contador, "garanta agora".
- **Don't** montar URL de WhatsApp dentro de componente — usar `resolveIntent()`.
- **Don't** usar sombra para hierarquia; sombra é resposta a estado.
- **Don't** resolver profundidade espalhando `box-shadow` em todo cartão.
- **Don't** usar glassmorphism, backdrop blur decorativo, glow ou borda brilhante.
- **Don't** redesenhar, vetorizar à mão ou reconstruir a marca.
- **Don't** deixar marca d'água acima de `0.06` de opacidade ou sobre texto.
- **Don't** pôr gradiente ou relevo em elemento pequeno: abaixo de uns 20px não se vê.
- **Don't** deixar a luz de superfície esticar na altura da seção: vira lavagem.
- **Don't** dar luz de cima ao pergaminho: ela apaga a costura e não acrescenta.
- **Don't** usar `backdrop-filter` no header nem em lugar nenhum.
- **Don't** montar rodapé de quatro colunas de mesmo peso.
- **Don't** marcar item ativo com um ponto pequeno: se precisa procurar, não é estado.
- **Don't** animar `opacity` a partir de zero em conteúdo de página.
- **Don't** dar sombra de repouso a cartão que não é alvo de navegação.
- **Don't** pôr `overflow: hidden` entre um elemento com paralaxe e a janela.
- **Don't** mover parágrafo, tabela ou lista de leitura com a rolagem.
- **Don't** fazer a linha inteira reagir ao ponteiro sem que ela seja clicável.
