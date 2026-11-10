# Marca real e profundidade

Rodada de ajuste visual sobre o site já implementado e auditado. Sem features novas, sem páginas novas.

---

## 1. Problema inicial

**A identidade não estava presente.** A marca era uma composição tipográfica temporária (losango + "Prime Prep" em Cinzel), montada porque o asset real não havia sido localizado. O site inteiro dependia de tipografia para dizer quem era.

**O site estava plano.** As superfícies funcionavam como troca cromática, não espacial. Fundo e conteúdo viviam no mesmo plano; nada parecia estar à frente de nada.

---

## 2. A marca real

O arquivo original foi localizado no disco do cliente (`b&w eagle.png`, 2000×2000, arte preta sobre branco) e preservado em `docs/references/brand/logo-original-bw.png` no repositório privado de desenvolvimento. Ele não faz parte desta versão pública: os recortes em `public/assets/brand/logo/` são os arquivos usados pelo site.

### O que foi feito com ele
Análise do perfil de linhas identificou três bandas separadas por faixas vazias: a águia (y 649–943), o wordmark PRIME (980–1138) e o livro (1189–1346). Cada banda foi recortada no seu bbox real e exportada.

**Nada foi redesenhado, vetorizado à mão ou reconstruído.** As quatro variações são recortes do mesmo arquivo.

### Máscara alfa em vez de duas cores
O site tem três superfícies, o que normalmente exigiria uma versão branca e uma navy de cada variação. Em vez disso cada arquivo é exportado como **máscara alfa** (`alpha = 255 − luminância`, o que preserva o antialiasing das penas sem halo) e pintado com `background-color: currentColor`.

Resultado: a marca herda a cor da superfície automaticamente. Um arquivo por variação, e nunca sai com a cor errada.

### Variações e onde cada uma vive

| Variação | Proporção | Arquivo | Aplicação |
|---|---|---|---|
| `completa` | 2.06:1 | 75KB | footer, com a assinatura abaixo |
| `aguia` | 4.86:1 | 65KB | header; marca d'água do hero e das internas |
| `wordmark` | 2.08:1 | 39KB | reserva para onde a águia não cabe |
| `livro` | 4.56:1 | 9KB | assinatura de fecho no CTA final |

**A Regra da Variação:** a marca não se repete idêntica na mesma tela. A águia abre, o livro fecha, a completa assina.

Resoluções calibradas ao uso real, não ao arquivo de origem: 196KB no total, e cada página baixa só o que usa.

### Ponto único de troca
Tudo passa por [`Wordmark.tsx`](../../src/components/layout/Wordmark.tsx), que expõe `<Marca variacao altura>` e `<Wordmark>`. Quando o SVG chegar, é esse arquivo que muda. **Nenhuma página precisa ser tocada.**

---

## 3. Hero

Reconstruído como composição em três planos, mantendo a direção tipografia + campo gráfico. Sem fotografia.

**Plano 1.** Campo de filetes com máscara radial e gradiente de profundidade. O campo **dissolve** em vez de terminar numa linha, então parece continuar atrás do conteúdo.

**Plano 2.** A águia real em `opacity: 0.055`, sangrando pela borda direita e passando por trás do painel. É o que coloca a identidade no midground em vez de repetir a marca do header.

**Plano 3.** Eyebrow, título, lead e CTAs, com `z-index` explícito. **O texto não está dentro de um card** — a profundidade vem da composição.

### O painel que atravessa a costura
O gesto mais forte da rodada: o painel "Concursos atendidos" é ancorado à base da grade (`lg:items-end`) e puxado 11rem para baixo, terminando **64px dentro da seção seguinte**. Metade sobre navy, metade sobre pergaminho.

A primeira tentativa falhou por medição: com a grade em `items-start`, o painel terminava 312px acima da costura, porque a coluna de texto é bem mais alta. Só a ancoragem à base resolveu.

---

## 4. Sistema de profundidade

### Três planos
`.plano-fundo` (campo, `z-index` 0) · `.plano-meio` (ornamento e marca d'água, 1) · `.plano-frente` (conteúdo, 2) · painel suspenso (3). Os índices são token (`--layer-*`), não número mágico. `.secao-composta` cria o contexto de empilhamento, então os planos de uma seção nunca vazam para outra.

### Elevação tonal antes de sombra
A descoberta que mudou a implementação: **sombra tingida de navy é invisível sobre navy**. Fundo e sombra têm quase a mesma luminância. A primeira versão do painel não flutuava.

Correção: `--shadow-*` passou a ser semântico por superfície. Em navy e ink a base vira quase preta (`rgba(3,7,18,·)` e `rgba(0,0,0,·)`), e o painel usa `surface-elevated` — o **degrau tonal** é o cue principal, a sombra reforça.

### Vocabulário de sombra
`contact` (assenta) · `raise` (repouso) · `lift` (hover) · `float` (contato + difusa larga: distância real) · `overlay` (painel que cobre) · `press` (`:active`).

### Recorte
`.secao-composta` usa `overflow-x: clip`, nunca `overflow: hidden`. `clip` corta o sangramento lateral da marca d'água sem travar o eixo Y, permitindo que o painel atravesse a costura. `hidden` forçaria o outro eixo a `auto` e mataria a sobreposição.

---

## 5. Onde a profundidade foi aplicada

| Superfície | Aplicação |
|---|---|
| **Hero (Home)** | completa: três planos, marca d'água, painel atravessando a costura |
| **PageHeader (internas)** | reduzida: campo + águia a 5.5rem no midground |
| **CTA final** | livro da marca no midground como assinatura de fecho |
| **Header** | `z-index` de token; painel mobile com sombra de overlay |
| **Cartões clicáveis** | sombra de contato em repouso, `lift` no hover (ver §11) |
| **Seções de leitura** | numeral de registro no midground (ver §11) |

### Onde deliberadamente NÃO foi aplicada
- **Cartões não interativos.** Só o que é alvo de navegação recebe sombra; a sombra não virou padrão de página.
- **A tabela comparativa em si.** Precisa de clareza tabular; a profundidade da seção vem do numeral atrás do título, não das linhas.
- **Mobile.** Ver abaixo.
- **Nenhum glassmorphism, backdrop blur decorativo, glow ou borda brilhante.**

---

## 6. Mobile

Abaixo de `lg` a profundidade recua por decisão: marcas d'água somem (`hidden lg:block`), o painel não atravessa costura, offsets negativos não se aplicam. Sobra elevação tonal, borda e sombra de contato.

A marca no header fica em **126×26px a 320px** de viewport: a águia continua legível, e é por isso que a variação `aguia` foi escolhida ali em vez da completa, que exigiria altura maior para o mesmo reconhecimento.

Medido em 320, 390, 430, 768, 1024, 1366 e 1440: **zero scroll horizontal em todas**.

---

## 7. Regressões que a rodada introduziu, e as correções

**Overflow de 97px.** Ao trocar `overflow-hidden` por `secao-composta`, a águia sangrando passou a gerar scroll horizontal. Corrigido com `overflow-x: clip`.

**Contraste dentro do painel.** O painel passou a usar `surface-elevated` (`#1c3572`), mais claro que o canvas, e `--color-fg-subtle` caiu para 4.03:1 ali. Corrigido calibrando o token contra a superfície elevada: `#8b98b5` → `#9caac3` (5.27 no canvas, 4.97 na elevada). Reverificado: zero falhas AA.

**Marca d'água larga demais.** A primeira versão usava altura 20rem que, na proporção 4.86:1, dava 1552px de largura e cruzava o título. Reduzida para 8.5rem e reposicionada ao midground direito.

---

## 8. Tokens adicionados

`--shadow-contact` · `--shadow-float` · `--shadow-overlay` (mais os já existentes, agora redefinidos por superfície)
`--layer-fundo` · `--layer-meio` · `--layer-frente` · `--layer-flutuante` · `--layer-header`

Utilitários: `.plano-fundo` · `.plano-meio` · `.plano-frente` · `.secao-composta` · `.painel-suspenso` · `.marca-dagua` · `.campo-profundidade` · `.numeral-registro`

---

## 9. Validação

`typecheck` ✅ · `lint` ✅ · `format:check` ✅ · `check` ✅ · `build` ✅ 16 rotas · `impeccable detect` ✅ sem achados

**Browser:** Home, concurso, metodologia, professores, contato e 404, em mobile e desktop.
**Contraste:** reverificado após a mudança de superfície do painel — zero falhas AA.
**Acessibilidade:** toda marca d'água e todo campo gráfico com `aria-hidden`; a marca do header carrega o nome no `aria-label` do link.
**Performance:** nenhuma dependência nova, nenhum canvas, nenhum vídeo. Só CSS, máscaras e transformações. 196KB de marca no total, carregada por variação.

---

## 10. Pendências

1. **SVG da marca.** O raster está em uso correto e proporcional, mas SVG escala melhor e pesaria menos. Troca em `Wordmark.tsx` apenas.
2. **Favicon.** Continua o do scaffold. Agora existe base: a variação `aguia` recortada serve de origem assim que o cliente confirmar.
3. **Fotografias.** Seguem ausentes; o hero se sustenta sem elas por decisão.
4. **Brasões.** Seguem ausentes.

Detalhe e classificação em [`content-pending.md`](./content-pending.md).

---

## 11. Segunda passagem: profundidade nas seções de leitura

A primeira passagem concentrou a profundidade no hero. Uma revisão da página
inteira mostrou o custo disso: **todas as seções bone ficaram planas**, e elas
são a maior parte do site, incluindo o hub de concursos, que é o principal ativo
de conteúdo. O hero flutuava; o resto era tinta chapada.

### O numeral de registro
O briefing sugeria "numeração no plano intermediário; texto principal no primeiro
plano". Era a peça que faltava.

O número da entrada agora aparece **duas vezes, em dois planos**: pequeno e nítido
no trilho de margem (é o rótulo que se lê) e grande e apagado atrás do início do
conteúdo (é o registro no papel). Isso cria a distância entre campo e texto sem
cartão e sem sombra, que seriam ruído numa seção de leitura, e reforça a metáfora
do diário exatamente onde ela vive.

`11rem`, Fraunces, opacidade `0.045`, herda `--color-fg` e por isso funciona nas
três superfícies. `aria-hidden`, e some abaixo de `lg`: no mobile competiria com
a leitura em vez de recuar.

**Contraste verificado sob ele**, já que fica atrás de texto: escurece o fundo
efetivo em 4,5%, e o pior par (`fg-subtle` sobre pergaminho) cai de 5.06 para
**4.62**, ainda AA. Medido também no DOM renderizado: zero falhas.

### Cartão clicável assenta
`card-interactive` era plano até o hover, o que fazia um alvo de navegação
parecer texto. Agora tem sombra de **contato** em repouso, `lift` no hover e volta
ao contato no `:active`. É "firme e tátil" aplicado a objeto pressionável, e a
sombra segue respondendo a estado, não decorando.

Cartões não interativos continuam planos. A sombra não virou padrão de página.

### Verificação responsiva
Numeral presente em 1024 e 1440, ausente em 768 e 390, sem scroll horizontal em
nenhuma das larguras.
