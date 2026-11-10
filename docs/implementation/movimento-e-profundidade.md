# Movimento e profundidade

Rodada curta sobre o site já refatorado. Quatro pedidos: mais animação, mais
profundidade, rolagem suave e texto não selecionável.

Diais: **ENERGY 2 · RHYTHM 3 · MOTION 3**. O MOTION subiu de 2 para 3 nesta
rodada, a pedido, e a mudança está declarada aqui porque o briefing anterior
fixava 2. O que subiu foi a quantidade de gestos, não a amplitude: nenhum
deslocamento passa de 120px e nada pisca, gira ou quica.

---

## 1. A ideia: profundidade parada é meia profundidade

O sistema de três planos já dizia o que está na frente do quê. Parado, porém, ele
depende de opacidade e de sobreposição para comunicar isso, e sobreposição só
funciona onde os elementos se cruzam.

Em movimento a leitura fica inequívoca. Enquanto uma seção atravessa a janela:

| Plano | Curso | Sentido |
|---|---|---|
| Campo gráfico (grade de filetes) | 40px | a favor da rolagem |
| Marca d'água que sangra pela borda | 120px | a favor |
| Ornamento e numeral de registro | 56px | **contra** |
| Conteúdo (texto, listas, tabelas) | 0 | parado |
| Painel do hero | 32px | **contra** |

Não é a distância que o olho lê, é a **diferença** entre as distâncias. Por isso
os valores são pequenos: acima de uns 120px o efeito deixa de ser profundidade e
vira elemento voando pela tela.

O plano de conteúdo nunca entra. Texto que anda sozinho durante a leitura é
defeito, não profundidade. A única exceção é o painel do hero, que é bloco curto
sem leitura corrida, e é justamente ele que fecha a escala pelo lado de cá: anda
contra a rolagem, então parece vir na direção de quem lê.

### Zero JavaScript

`animation-timeline: view()` amarra a animação à posição do elemento na janela,
nativamente. Nada de listener de scroll, nada de `requestAnimationFrame`, nada de
biblioteca de parallax, e o trabalho fica na thread do compositor.

**Três portas antes de qualquer coisa se mover:**

1. `@supports (animation-timeline: view())`. Sem suporte (Safari e Firefox hoje),
   a regra inteira nem existe. Isto não é detalhe: sem a guarda, o navegador
   ignoraria só a linha do `animation-timeline` e rodaria a animação na linha do
   tempo do **documento**, fazendo tudo deslizar uma vez no carregamento e parar
   no lugar errado.
2. `prefers-reduced-motion: no-preference`.
3. Só fundo e midground, mais a exceção declarada acima.

### O bug que isto revelou

`.plano-fundo` usava `overflow: hidden`. `hidden` cria um container de
**rolagem**, e `view()` se amarra ao container de rolagem mais próximo. A
paralaxe da grade nascia amarrada a uma div que não rola nunca: timeline inativa,
campo parado para sempre.

Medido: a `source` da ViewTimeline vinha como `DIV`, enquanto a de todos os
outros vinha como `HTML`.

Trocado por `overflow: clip`, que recorta sem criar container. É a mesma lição da
D-35, chegando por outro caminho: neste projeto, `clip` é quase sempre o certo.

Depois da correção, os cinco elementos animados da Home resolvem para `HTML`.

### O segundo bug: `translate` e `transform` se somam

A marca d'água do fecho é centrada com `-translate-x-1/2`. Achei que o keyframe
da paralaxe fosse sobrescrever essa centralização, e criei uma variante que
repetia o `-50%` dentro do próprio keyframe.

Errado. O Tailwind v4 centraliza pela propriedade **`translate`**, não por
`transform`: `-translate-x-1/2` compila para `translate: calc(1/2 * 100% * -1)`.
São propriedades independentes, e as duas **se somam**. O -50% do keyframe
entrava por cima do -50% do Tailwind e a marca ficava deslocada 100% da própria
largura para a esquerda, visível a olho nu.

A variante foi apagada. `pp-parallax` sozinho já convive com qualquer
centralização feita por `translate`. Medido depois da correção: marca, título e
seção com o mesmo centro, desvio de 0px.

A lição vale além deste caso: em Tailwind v4, `translate`, `rotate` e `scale` são
propriedades próprias, aplicadas antes de `transform`. Um keyframe de `transform`
compõe com elas em vez de substituí-las.

---

## 2. Rolagem suave

A rolagem nativa do desktop é discreta: cada clique da roda salta um bloco fixo.
Isso é o oposto do que a paralaxe precisa, porque ela depende de posições
intermediárias. Com salto, o olho vê dois quadros e nenhuma distância.

`lenis`, montado em [`RolagemSuave.tsx`](../../src/components/motion/RolagemSuave.tsx).
Única dependência de runtime além de `next`, `react` e `motion`. Registrada em
D-42, como manda a regra 6.

**O que ela não mexe:**

- **Toque.** Segue nativo. O celular já tem inércia do sistema, e ela é melhor
  que qualquer reimplementação.
- **Teclado e barra de rolagem.** Nativos.
- **`position: sticky`, `scroll-padding-top`, `animation-timeline`.** O Lenis
  escreve a posição real com `behavior: "instant"`, então tudo que depende da
  posição de rolagem continua funcionando sem ajuste.

`html.lenis` recebe `scroll-behavior: auto`, senão uma navegação por âncora
dispararia uma rolagem suave **nativa** por cima da dele, e aí sim as duas
disputariam. Com o Lenis desligado a regra some e o `scroll-behavior: smooth`
volta a valer sozinho.

Sob `prefers-reduced-motion: reduce` o Lenis não chega a ser instanciado, e a
consulta é reavaliada em tempo real: mudar a preferência do sistema liga ou
desliga sem recarregar.

---

## 3. Os gestos novos

| Gesto | Por que existe |
|---|---|
| **Entrada do hero**, escalonada em 4 tempos de 60ms | o hero é a única coisa já na tela quando a página abre, então nunca teve entrada: reveal por scroll chegaria tarde demais |
| **Linha de leitura** na base do header | as páginas são longas; o filete responde "quanto falta", que é a pergunta de quem está rolando |
| **Filete que se desenha** nos links de próximo passo | marcação à régua na escala do parágrafo, em vez de só trocar a cor do texto |
| **Linha de registro** que desliza no hover | o conteúdo anda um fio para a direita, como quem puxa a ficha para fora do fichário |

### A entrada do hero é só `transform`

Nunca `opacity`. Se o navegador adiar o primeiro quadro, o pior caso é o hero
nascer 18px mais baixo e assentar; nenhuma palavra fica invisível esperando
animação. É a D-39 aplicada ao conteúdo acima da dobra, que é onde ela mais
importa.

### A linha de leitura não é desligada por `prefers-reduced-motion`

Ela não se move sozinha: reflete o que a pessoa já está fazendo. Desligá-la
removeria informação, não movimento. `animation-timeline: scroll(root block)`,
também sem JavaScript, e sem suporte no navegador ela simplesmente não existe,
em vez de aparecer parada pela metade.

---

## 4. A linha inteira virou o alvo em `/contato`

Consequência de ter escrito o utilitário de hover: se a linha responde ao
ponteiro, ela tem que ser clicável, senão o feedback mente.

O assunto, a explicação e a ação levam todos ao mesmo lugar, então dividir isso
em "texto morto mais botãozinho" só encolhia a área de toque sem separar nada. O
botão continua visível como âncora do olho, mas virou `<span>`: elemento
interativo dentro de outro seria HTML inválido. O `group-hover` faz o botão
reagir junto com a linha, senão a âncora do olho ficaria inerte.

Medido: o alvo passou de um botão de ~180×44 para a linha inteira, **1009×168**.

---

## 5. Texto não selecionável

`user-select: none` no `body`, a pedido. A intenção é que o site leia como
interface, não como documento.

**Com duas exceções, e elas não são negociáveis.** O número do WhatsApp e o @ do
Instagram continuam selecionáveis, porque copiar o contato é literalmente a ação
que o site inteiro existe para provocar. Travar ali seria trocar estética por
conversão. Campos de formulário entram na mesma isenção por precaução: hoje não
existem, e se um dia existirem já nascem funcionando.

O custo conhecido, registrado para não ser redescoberto como bug: ninguém copia
um trecho de texto do site para mandar a outra pessoa. É reversível em uma regra.

---

## 6. Verificação

### Varredura responsiva
72 combinações (8 larguras por 9 rotas): **zero scroll horizontal**, **zero
falhas AA** em 6.584 nós de texto.

A paralaxe não custou altura de página: a Home mede os mesmos 8.636px de antes. O
rodapé recebeu `overflow: clip` nos dois eixos porque a águia sangra pela borda
de baixo e o curso da paralaxe a levaria para fora, empurrando a altura rolável.

### Timelines
Os cinco elementos animados da Home e os quatro de uma página interna resolvem a
timeline para `HTML`, o rolador da janela. Nenhum ficou preso num container
intermediário.

### Guardas
Conferidas no CSS compilado, não no fonte: paralaxe sob `@supports` mais
`prefers-reduced-motion: no-preference`; entrada do hero desligada em
`reduce`; linha de leitura sob `@supports`; `html.lenis` com
`scroll-behavior: auto`.

### Seleção
`body` em `none`, `h1` em `none`, os quatro pontos de contato em `text`.

### `/contato`
Três linhas clicáveis, `data-touch-target` em todas, focáveis, e **zero**
elementos interativos aninhados.

### Cadeia técnica
`typecheck` ✅ · `lint` ✅ · `format:check` ✅ · `build` ✅ 17 rotas.

---

## 7. O que ficou sem verificação visual

O painel de navegador desta sessão não estava desenhando quadros, e isso tem
consequência concreta: **a paralaxe e a linha de leitura não foram vistas em
movimento**, só medidas.

O que dá para afirmar: as timelines estão ligadas ao rolador certo, as guardas
compilaram como esperado, os cursos e sentidos estão nos tokens, e nada disso
gera scroll horizontal nem altura extra.

O que não dá para afirmar: se a quantidade de movimento está boa aos olhos. Os
cursos vivem em quatro tokens (`--parallax-fundo`, `--parallax-meio`,
`--parallax-marca`, `--parallax-contra`, `--parallax-frente`) exatamente para
isso: calibrar é mudar um número, não mexer em componente.

Como isolei ambiente de defeito, já que a distinção decidiu uma correção real:
uma `ScrollTimeline` construída à mão reportava `7.53%`, mas uma animação ligada
**a essa mesma timeline** reportava `progress: null`. O objeto calcula sob
demanda; a animação precisa do pipeline. Foi isso que permitiu concluir que a
grade tinha um bug de verdade (source `DIV`) enquanto os outros estavam certos.
