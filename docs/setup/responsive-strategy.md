# Estratégia Responsiva

## Premissa

O público chega pelo Instagram, no celular. **Mobile não é adaptação — é o caso base.** Toda decisão de layout é validada primeiro em 375px.

## Breakpoints

Os padrões do Tailwind v4, sem customização:

| Nome | Largura | Realidade |
|---|---|---|
| *(base)* | < 640px | celular — **layout de referência** |
| `sm` | ≥ 640px | celular grande / retrato de tablet |
| `md` | ≥ 768px | tablet |
| `lg` | ≥ 1024px | laptop |
| `xl` | ≥ 1280px | desktop |
| `2xl` | ≥ 1536px | monitor grande |

Customizar breakpoints seria complexidade sem ganho: a escala fluida já cobre o que normalmente exigiria pontos intermediários.

## Fluido antes de breakpoint

O sistema evita breakpoints em tipografia e espaçamento usando `clamp()`:

- **Tipografia**: `--text-*` interpola continuamente. Não existe salto brusco de tamanho de fonte.
- **Ritmo de seção**: `--space-section*` interpola de 48px a 176px.
- **Gutter**: `--gutter` interpola de 20px a 40px.

Breakpoints ficam reservados para o que realmente muda de **forma**: número de colunas, direção de um flex, presença de um elemento.

## Comportamento por elemento

### Container
`.container-prose` (44rem) para leitura longa, `.container-content` (68rem) padrão, `.container-wide` (82rem) para grids largos. Todos com `--gutter` lateral e `margin-inline: auto`. **O body nunca rola horizontalmente.**

### Tipografia
Escala fluida. Títulos usam `text-wrap: balance` (evita a última linha órfã, especialmente visível em mobile). Tracking de rótulos reduzido em telas pequenas quando a linha ficar apertada.

### Navbar
- **< `lg`**: logo + botão de menu. Painel full-screen navy, itens em Fraunces em tamanho grande, CTA de WhatsApp fixo ao final. Foco preso no painel enquanto aberto; `Esc` fecha.
- **≥ `lg`**: barra horizontal, 5–6 itens, "Concursos" com dropdown, CTA à direita.

### Grids
Progressão padrão: **1 coluna → 2 (`sm`/`md`) → 3–4 (`lg`)**. Diferenciais e professores seguem isso. Nada de grid de 4 colunas espremido em tablet.

### Cards
Largura total no mobile, com o mesmo padding interno em toda a escala. Hover não existe em toque — o estado de foco precisa carregar a mesma informação visual (é por isso que `card-interactive` muda **borda**, não sombra).

### Hero
Centralizado e simétrico em todas as larguras. No mobile: título menor, um CTA primário visível, secundário abaixo (nunca lado a lado espremido). Marca d'água da águia reduzida ou removida abaixo de 768px.

### Tabela comparativa de concursos
O componente mais sensível do site.
- **≥ `md`**: tabela real (`<table>`), cabeçalho navy, linhas zebradas.
- **< `md`**: **converte em cards**, um por concurso, com pares rótulo/valor empilhados. Não é scroll horizontal — scroll lateral em tabela de 5 colunas é experiência ruim e esconde informação.
- Se em algum caso o scroll for inevitável, ele é contido em `overflow-x: auto` no próprio bloco, nunca no body.

### Seções longas
Ritmo vertical reduz proporcionalmente no mobile (48–72px contra 96–176px no desktop). Densidade nunca aumenta para "caber mais" — respiro é parte da identidade.

### CTAs
Um CTA primário visível por dobra em qualquer largura. No mobile, o CTA de WhatsApp se repete ao final de cada página.

### Ornamentos
Reduzidos ou removidos abaixo de 768px. Cantos ornamentais somem; o divisor com losango permanece (é compacto e legível em qualquer largura).

## Alvos de toque

Mínimo 44×44px em ponteiro grosso, garantido em `base.css` via `@media (pointer: coarse)` para `button`, `[role="button"]`, `input[type="submit"]` e links marcados com `data-touch-target`.

## Checklist de validação (toda tela, Fase 3)

- [ ] 375px sem rolagem horizontal
- [ ] nenhuma informação essencial perdida no mobile
- [ ] alvos de toque ≥ 44px
- [ ] tabelas convertidas, não espremidas
- [ ] hierarquia se sustenta sem hover
- [ ] testado também em 768px e 1440px
