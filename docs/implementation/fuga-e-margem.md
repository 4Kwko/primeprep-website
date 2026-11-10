# Fuga e margem

Segunda rodada de efeitos visuais, e a primeira em que o navegador voltou a
medir. Nada de conteúdo novo, nenhum arquivo novo, nenhuma dependência.

O tema é o mesmo da rodada anterior: papel. A diferença é onde ela mexeu.
`materia-e-luz.md` tratou da **superfície**; esta trata do que acontece na
**borda** dela, e da coluna de margem que a composição tinha na grade e não
tinha na página.

---

## 1. Onde a tinta acaba

Duas marcas do site são cortadas por uma borda, e as duas terminavam num corte
reto.

### A águia

Ela sangra para fora da seção, e o `overflow-x: clip` a guilhotinava no meio da
asa. Agora a densidade cai na direção do sangramento: a marca lê como passando
**por baixo** da página em vez de colada em cima dela.

**Só onde o corte é assimétrico**, e a precisão custou uma segunda medição. As
três aplicações que sangram para um lado (hero, cabeçalho de página interna,
rodapé) recebem a direção da borda que as corta, e o teste falha se alguém
aplicar fuga no CTA final.

A águia do CTA é centralizada, e a primeira versão desta regra dizia que ela
"nunca é cortada". **Está errado abaixo de 500px**, onde ela tem 467px de
largura e passa dos dois lados. Simulado em 320px, com fuga dos dois lados e
sem: quase indistinguíveis, porque o corte cai na ponta da asa, que é a parte
que já afina sozinha. Fuga ali seria custo sem efeito, e nas larguras grandes
seria assimetria sem causa. A conclusão não mudou; a razão dela mudou.

**O início em 60% é medido, não escolhido.** A cabeça da águia fica em torno de
63% da largura do recorte, e é ela que carrega o reconhecimento. Começar antes
disso apagava a identidade para resolver a borda: a primeira tentativa começava
em 55% e a cabeça saía visivelmente mais fraca. Renderizado lado a lado, a
diferença é clara.

### O numeral de registro

A densidade cai da cabeça para a base.

**Vale por contraste antes de valer por matéria.** O numeral começa 2,75rem
**acima** do conteúdo, então a metade de baixo dele é exatamente onde o texto o
cruza. Tirar tinta ali só pode melhorar o pior par medido do site, nunca
piorá-lo. A metade de cima, que fica na margem vazia, mantém a densidade de
sempre.

---

## 2. Duas armadilhas que só o CSS compilado mostrou

Esta rodada teve um método novo, e ele pagou duas vezes: **ler o CSS de produção
depois do build**, não só o fonte.

### O Lightning congela `var()` ao emitir fallback de `color-mix`

A primeira versão do numeral pintava o texto com um gradiente recortado por
`background-clip: text`. Compilado, virou isto:

```css
.numeral-registro {
  background-image: linear-gradient(to bottom, var(--color-fg) 30%, #0c1c4033);
}
@supports (color: color-mix(in lab, red, red)) {
  .numeral-registro {
    background-image: linear-gradient(to bottom, var(--color-fg) 30%, color-mix(...));
  }
}
```

O `#0c1c4033` é navy. Para gerar o fallback, o compilador resolveu
`var(--color-fg)` **no `:root`**, e o numeral vive nas três superfícies: em navy
e ink o fallback desbotaria para a cor errada.

A correção não foi ajustar o fallback, foi **trocar de mecanismo**: máscara em
vez de recorte de texto. Máscara não pinta nada, só remove alfa, então a cor
continua vindo de `color: var(--color-fg)` e resolve no elemento, como manda a
D-34. De quebra some o `color: transparent` (que faria `currentColor` resolver
para transparente ali dentro) e some a necessidade de `@supports`: navegador que
não entende a máscara mostra o numeral chapado, que é o de hoje.

A régua de margem tinha o mesmo problema e recebeu a mesma cura, por outro
caminho: `opacity` no pseudo-elemento em vez de `color-mix` na cor.

### `background-image` cobre `background-color`

A marca é máscara alfa pintada por baixo. A pintura era `background-color:
currentColor`, e trocá-la por um gradiente com parte transparente não funcionava:
`background-image` é desenhado **por cima** do `background-color`, então a cor
chapada aparecia por baixo do gradiente e a fuga não existia.

A pintura passou a ser gradiente **mesmo quando é chapada**
(`linear-gradient(currentColor 0 100%)`). Com a cor saindo de um lugar só,
`--marca-pintura` troca a pintura inteira.

---

## 3. A régua de margem do razão

O achado com mais área da rodada, e ele veio de medir e não de olhar.

O trilho tinha `border-left`, e ele deveria ser a régua de margem do diário.
**Medido: numa entrada de 1920px, o filete tinha 44px.** Dois por cento da
altura. `align-self: start`, que entrou para consertar o `sticky` (D-40),
encolheu a caixa do trilho para o tamanho do conteúdo, e o filete junto. A coluna
de margem existia na grade e não existia na página.

Agora são duas coisas, e **a divisão é o que torna isto informação e não
enfeite**:

| | O que é | O que responde |
|---|---|---|
| **Régua** | contínua, do topo à base da entrada, 1px em `--color-hairline` a 65% | onde fica a coluna de margem |
| **Filete** | curto, dourado, grudado no topo enquanto se lê | onde estou dentro desta entrada |

**Medido: numa entrada de 1920px o filete percorre 1876px sobre a régua.** É o
mesmo vocabulário do marcador de item ativo do menu e da linha de leitura do
header, aplicado ao eixo da entrada. O dourado amarra ao número do trilho, que
já era `text-accent`.

**1px nos dois**, e é isso que faz alinharem na mesma coluna de pixel (medido: o
trilho começa em x=0 da entrada). Em 2px, renderizado no tamanho real, o dourado
passa a ler como a barra colorida de cartão que a direção veta, e que já tinha
sido removida dos cartões de concurso de propósito.

Abaixo de lg não existe: ali o trilho é horizontal e a coluna de margem não é a
composição.

---

## 4. O resultado do diagnóstico assenta

É o **único conteúdo do site que aparece em resposta a uma ação**, e aparecia em
silêncio. Trocar uma resposta reescrevia o bloco no mesmo lugar sem nada avisar,
e quem está lendo o resultado não olha para o losango que acabou de marcar.

**A chave de remontagem é o texto que a pessoa lê, não as respostas.** Trocar uma
resposta que não muda a recomendação não replica a entrada; amarrar às respostas
faria o bloco inteiro assentar a cada toque, que é animação de template.

### A regra 18, provada em campo

O painel desta sessão suspende a renderização de vez em quando, que é exatamente
o cenário da D-39. Medido ali, com a animação parada em `currentTime: 0`:

```
opacity: 1
transform: matrix(1, 0, 0, 1, 0, 18)
```

O bloco fica 18px baixo e **inteiramente legível**. Se a animação partisse de
`opacity: 0`, o resultado do diagnóstico estaria invisível esperando um quadro
que não vem. É a diferença que a regra existe para garantir, e é raro conseguir
observá-la acontecendo.

---

## 5. Resposta ao toque

Em ponteiro grosso não existe hover, e o site é aberto majoritariamente no
celular (regra 10). Dois controles não davam sinal nenhum de terem recebido o
toque: o único retorno era a navegação acontecer.

- **`btn-ghost`** não tem fundo nem borda, então não havia o que mudar. Agora
  afunda 1px e escurece, igual ao secundário.
- **`link-filete`** desenha o filete também em `:active`. O mesmo traço que é a
  resposta do ponteiro passa a ser a resposta do dedo.

---

## 6. O que foi recusado, e por quê

**Baixo-relevo no numeral.** Era o candidato óbvio: 176px de altura, em toda
entrada do site, um dos poucos elementos com área para relevo. Renderizado no
tamanho real, vira **contorno vazado**: perde a massa que o faz funcionar como
peso de margem, e ainda põe duas sombras atrás de texto num elemento cuja
justificativa de existir é não atrapalhar a leitura. A Regra da Área outra vez, e
desta vez o efeito não era invisível, era pior.

**Mobiliar as seções de leitura.** Medido em todas as rotas, toda seção de
leitura do site usa exatamente três coisas: `numeral-registro`, `log-entry` e
`parallax-contra`. O midground (marca d'água, campo gráfico, ornamento) vive só
na abertura e no fecho de cada página. A tentação é preencher.

**É para ser assim.** O meio de uma página de diário é papel com escrita e uma
régua de margem. Acrescentar mobília ali seria decoração sem função, que é o que
a regra 16 e o filtro vetam. A resposta certa para "seção de 1767px sem
estrutura" não era mais objeto, era a régua e o filete que viaja.

---

## 7. A folha de impressão, que começou como defeito

Esta rodada tinha um alvo, e no meio dela apareceu outro.

O reveal por scroll esconde por opacidade sob `scripting: enabled`, e **nada
revela o que nunca entrou na janela**. Medido em `/metodologia` recém-carregada:

```
[data-reveal] no documento: 7
sem data-revealed:          7
opacity computada:          0
```

Imprimir a página nesse estado produzia um documento com quase todo o conteúdo em
branco, e nada na tela denunciava. É a **regra 18 num terceiro disfarce**: a
primeira vez foi JavaScript ausente (D-21), a segunda foi quadro de animação que
não veio (D-39), e a terceira é um meio que não rola.

O resto da folha segue do mesmo princípio do site. É um diário de bordo, e um
diário imprime como documento:

- **A superfície é o papel.** Nenhuma superfície pinta fundo. Grão, luz de cima e
  costura saem juntos, porque os três são `background-image`.
- **A tinta volta a ser escura em navy e ink**, onde o texto é osso e sobre papel
  branco seria invisível. Os valores são os que o pergaminho já usa.
- **Sai o que não existe no papel**: cabeçalho, cenário (campo gráfico, marca
  d'água, numeral) e os CTAs. Botão impresso é controle morto, e o rótulo dele é
  a *mensagem* que seria enviada, não uma informação. O contato continua: o
  número e o @ estão em texto no rodapé.

### A armadilha da medição, de novo

A primeira leitura acusou o número do WhatsApp em **2,32:1**, o que teria sido o
pior defeito da rodada: o telefone é a coisa mais importante de uma folha
impressa deste site.

Era artefato. O painel suspende a renderização, e a `CSSTransition` de cor ficava
parada em `currentTime: 0`, ou seja, **na cor de origem**. Com a transição
desligada, que é o que a impressão faz de qualquer forma, a cor é navy-600, algo
como 13:1.

Foi o segundo falso positivo desta sessão com exatamente a mesma causa. A lição
já estava escrita e precisou ser aplicada de novo: **antes de acreditar numa
medição de cor, confirme que nada está em transição.**

---

## 8. Alto contraste forçado: as mesmas quatro marcas

O trabalho da impressão levou à pergunta seguinte: **que outros contextos o site
não trata?** O alto contraste forçado (Windows High Contrast e equivalentes) era
um, e o defeito tem a mesma forma.

O modo força `background-color` e `color` para as cores do sistema e ignora o
valor do autor, **exceto quando esse valor é ele mesmo uma cor de sistema**.
Quatro marcas deste site são desenhadas com `background-color`, e as quatro eram
pintadas com a cor do texto: passavam a ser pintadas com a cor do fundo, ou seja,
sumiam.

**A que importa é o losango.** No diagnóstico o rádio é `sr-only` e o losango é o
*único* sinal visual de qual opção está marcada. E a borda de todos os cartões é
forçada para a mesma cor, então "borda dourada na marcada" também deixa de
distinguir. Sem a regra, quem usa alto contraste **respondia o diagnóstico sem
ver o que tinha escolhido.** O leitor de tela nunca esteve em risco: o rádio é
real e `checked`.

`opacity` não é forçada, e é ela que continua separando marcado de não marcado
depois que a cor vira a mesma. Medido, com as transições desligadas: marcado 1,
não marcado 0,3.

### Um conserto que já tinha acontecido sem querer

A marca deixou de ser `background-color: currentColor` e passou a ser
`background-image` com gradiente (seção 2, e a razão de lá era outra).
`background-image` **não é forçada** pelo modo, então a marca continua sendo
pintada pela cor corrente, que ali é a do texto. Antes da troca ela virava um
retângulo da cor do fundo, isto é, desaparecia.

**Não observado no modo.** Não houve como emular alto contraste no navegador
desta sessão. O que está no código segue o comportamento especificado e a forma
documentada de lidar com ele, e o risco é limitado por construção: fora do modo,
nada disto existe.

---

## 9. Mais contraste, a pedido

O terceiro contexto não tratado, e o que rendeu mais.

`prefers-contrast: more` é alguém dizendo que a leitura está difícil. O site já
passava em AA em toda parte, então a pergunta certa era: **quanto falta para
AAA?** Medido por superfície (bone / navy / ink):

| | bone | navy | ink |
|---|---|---|---|
| `fg` | 15,09 | 14,61 | 18,31 |
| `fg-muted` | 7,58 | 9,45 | 8,26 |
| `fg-subtle` | **5,06** | **6,50** | **5,28** |
| `accent` | **4,88** | 7,50 | 9,40 |

Faltava pouco, e em lugares nomeáveis. O tom mais fraco sobe um degrau
(`fg-subtle` vira `fg-muted`), e o ouro sobre pergaminho ganha `gold-800`
(7,16:1), que não é cor nova de marca: é o mesmo tom da rampa, escurecido, e
existe só para este bloco.

### A regra do degrau tonal, e ela é simétrica

A primeira versão passou em sete rotas e falhou em duas, por 0,19 e por 0,15. As
duas falhas eram a mesma coisa vista de dois lados:

- na Home, a nota sobre bolsas fica num **painel afundado** (bone-200) e o
  `fg-muted` ali dava **6,81** em vez de 7,58;
- em `/concursos`, o cartão usa **`surface`** (#16295c, mais claro que o navy) e o
  `fg` ali dava **6,85** em vez de 14,61.

A primeira correção foi **colapsar** esses degraus na cor da superfície.
Funcionava para o contraste e cobrava caro: some o zebrado da tabela comparativa,
que é apoio de leitura de *linha*, exatamente o que alguém pedindo mais contraste
também precisa.

A regra final é **inverter, não apagar**: o degrau continua existindo, do mesmo
tamanho, e passa a **afastar** o fundo da cor do texto em vez de aproximá-lo. Em
papel o afundado vira o branco do cartão; em navy e ink o elevado vira o
afundado. O zebrado fica, a profundidade fica, e o contraste sobe.

**Os degraus que já apontavam para longe do texto não são tocados**, e isso
importa tanto quanto: em pergaminho o cartão branco e em navy o afundado escuro
já ajudavam. Mexer nos quatro teria piorado metade dos pares enquanto consertava
a outra metade, e o teste trava as duas metades.

### O que sai de trás do texto

Numeral de registro, marca d'água e campo gráfico. É o custo declarado da
profundidade, e quem pede mais contraste está dizendo que não quer pagá-lo. Grão
e luz saem junto, por serem `background-image`. A costura fica: ela é
`box-shadow`, e separa folhas em vez de sujar o papel.

**Resultado**: nove rotas, zero par abaixo de 7:1.

---

## 10. Verificação

Nove rotas, em 1280 e em 390, medindo o DOM renderizado:

- **Contraste**: zero falhas AA, incluindo o diagnóstico com resultado na tela.
  Composição real em canvas, nunca parser de cor feito à mão (que já produziu 14
  falsos negativos nesta sessão).
- **Overflow horizontal**: zero em todas.
- **Alvos de toque em 390**: nenhum abaixo de 44px, fora o link de pular
  conteúdo, que é `sr-only` até receber foco.
- **Direção da fuga**: confere com o sangramento em cada aplicação (hero e
  cabeçalho interno passam da borda direita; rodapé, da esquerda; CTA final está
  inteiro dentro e não recebe fuga).
- **Cor por superfície**: o numeral resolve para bone em navy e navy em bone, que
  é o que a troca de mecanismo foi consertar.
- **AAA a pedido**: nas nove rotas, com `prefers-contrast: more` forçado, zero par abaixo de 7:1 (4,5 para texto grande).
- **Impressão**: em quatro rotas, com as regras de `@media print` forçadas e as transições desligadas, zero falha de contraste, zero overflow, nove botões escondidos e todo reveal em `opacity: 1`.
- `typecheck` ✅ · `lint` ✅ · `format:check` ✅ · `test` ✅ 172 · `build` ✅

**O que não foi verificado**: as capturas de tela do painel continuam saindo em
branco ou compostas fora de ordem, então nada disto foi visto numa página
inteira. O que foi visto são as simulações em tamanho real, que reproduzem a
matemática dos gradientes e das máscaras com os valores medidos no navegador. Elas
decidiram três escolhas desta rodada (a curva da fuga, a espessura do filete e a
recusa do baixo-relevo), mas não substituem olhar a página.
