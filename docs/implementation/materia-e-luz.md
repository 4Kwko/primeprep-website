# Matéria e luz

Rodada de efeitos visuais. Nada de conteúdo novo, nada de composição nova: o alvo
é a superfície em si, que era cor chapada num site cujo north star é papel.

Sem dependência nova. Custo total: **2,5KB**, dois arquivos de textura.

---

## 1. O método importou mais que os efeitos

O painel de navegador desta sessão não desenha, então nenhuma captura de tela
funcionou. A saída foi **simular cada efeito com os valores reais**, renderizar em
PNG e olhar o arquivo.

Isso mudou o resultado três vezes, e nas três a versão que eu tinha escrito
estava errada:

| O que eu tinha feito | O que a simulação mostrou |
|---|---|
| Costura com `spread: -16px` | A sombra sumia; a transição voltava a ser troca de cor |
| Luz de cima também no pergaminho | Clareava o topo da folha **justo onde a costura deveria escurecer** |
| Gradiente no losango | No tamanho real (7 a 8px) é indistinguível do chapado |
| Subdivisão na grade do hero | Inverte a hierarquia e vira papel milimetrado |

Os dois últimos foram revertidos por inteiro. **A diferença entre os efeitos que
ficaram e os que saíram não é de gosto, é de terem sido olhados.**

---

## 2. Grão de papel

O north star é um diário de bordo, e as superfícies eram cor chapada. O grão dá
matéria à folha.

### Por que um PNG gerado e não `feTurbulence`

A tentativa óbvia é ruído procedural em SVG embutido, que seria zero arquivo.
**Não serve aqui**, e o motivo é medível: `feTurbulence` é implementado de forma
diferente por cada renderizador, e a calibragem depende de números exatos.

No rasterizador local, a média do ruído saía em **187, não em 128**. Composto por
cima, isso empurrava toda superfície para o cinza: o pergaminho **escurecia 16
níveis** de luminância e o navy **clareava 19**. Ou seja, o grão mudava a paleta.

Calibrar contra um renderizador e servir para outro não é calibrar. Um PNG gerado
tem média exata e o mesmo resultado em toda parte.

### `overlay` é o que torna seguro

O ruído tem média **exatamente 128**, e em `overlay` cinza médio é a identidade.
O grão adiciona variação sem deslocar a cor.

Medido depois da correção: deslocamento de **0,25 nível**, desvio de **2**, que é
o grão.

### O tamanho

64×64 com cinco níveis quantizados, **1,26KB cada**. Ruído puro não comprime, então
o tamanho veio de reduzir ladrilho e níveis, e nenhum dos dois se percebe nessa
amplitude. Dois arquivos, porque `overlay` amplifica muito mais sobre fundo
escuro: o mesmo ruído que dá grão discreto no pergaminho vira sujeira no navy.

---

## 3. Luz de cima, e só onde ela rende

Um decaimento curto na borda superior de navy e ink.

**Existe para o site inteiro concordar com uma coisa só.** O relevo do botão, o
filete claro no topo do header e a sombra de costura já diziam "a luz vem de
cima", cada um sozinho, contra um fundo que não dizia nada.

**No pergaminho não há luz**, e isso foi corrigido depois de ver. Numa superfície
quase branca ela não acrescenta quase nada, e o pouco que acrescenta briga com a
costura.

**A altura é travada em 240px**, e é isso que a mantém sendo luz. Com
`background-size: auto` o decaimento se estica na altura do elemento: numa seção
de 2000px a transição levaria 900px e o resultado seria uma lavagem cromática,
que é exatamente o fundo em gradiente que a regra 8 veta.

---

## 4. Costura

Onde duas superfícies diferentes se encontram havia só uma troca abrupta de cor.
Agora a folha de cima projeta na de baixo: um filete na borda superior de quem
recebe, e uma sombra interna curta abaixo dele.

Quem **recebe** define a cor da projeção, pela mesma razão da D-34: sombra tingida
de navy sobre navy é invisível.

### Duas armadilhas de CSS

**As seis combinações estão escritas uma a uma.** CSS não compara o valor de um
atributo entre irmãos, então `[data-surface] + [data-surface]` pegaria também bone
depois de bone, que é a **mesma folha**: costura ali seria uma linha no meio do
papel.

**O rodapé precisou de seletor próprio.** Ele não é irmão das seções (elas vivem
dentro de `<main>` e ele fica fora), então o seletor de irmão adjacente não
enxerga essa costura. Medido: era a única das cinco transições da Home que ficava
sem.

---

## 5. Relevo no botão primário

É o elemento mais clicado do site e o ouro da marca, que no sistema significa
mérito. Era um retângulo de cor chapada.

Três camadas fazem o relevo, e **nenhuma delas é brilho**: um gradiente vertical
curto, um filete interno claro na borda de cima e um escuro na de baixo.
Pressionado, a luz inverte, que é o que acontece quando uma peça afunda.

Não é glow: não há desfoque colorido para fora do elemento, que é o que a regra 8
veta. Tudo acontece dentro da caixa.

**Contraste medido**: a pior parada do gradiente dá **6,06:1** com o texto do
botão, contra 7,5 do chapado. O mínimo é 4,5.

---

## 6. Cor de contexto no que responde ao ponteiro

Os cartões de concurso já declaravam `--concurso` com a cor da força, e ela era
usada só no losango.

**Borda do cartão no hover.** Trazer a cor para ali transforma o realce em
informação: antes de clicar, a pessoa vê de qual escola é o cartão.

**Guia de leitura na tabela comparativa.** Seis colunas, e acompanhar uma linha até
o fim é onde se perde o dedo. O realce usa a cor daquela força, com alfa
baixíssimo e **sem mudança de cursor**, de propósito: a linha inteira não é
clicável, e realce forte prometeria um alvo que não existe. É apoio de leitura,
não afordância.

---

## 7. Barra de rolagem

Ela é uma superfície visível do site, e num site com rolagem suave a pessoa olha
para ela. Estava no cinza padrão do sistema, ao lado de uma paleta inteira
decidida. Agora usa a cor da superfície em que está.

`scrollbar-color` e não `::-webkit-scrollbar`: a propriedade padrão recolore sem
mexer na **largura** nem no comportamento, então quem precisa de um alvo grande
continua tendo o alvo do sistema. Navegador que não a conhece fica com a barra
padrão, que é um resultado perfeitamente aceitável.

---

## 8. A Regra da Área

Foi a lição desta rodada, e entrou no `DESIGN.md`.

Efeito sutil precisa de área. Um gradiente de 8px num losango e uma diferença de
cor numa borda de 1px são indistinguíveis do liso. As duas coisas foram tentadas,
renderizadas no tamanho real e descartadas.

Relevo só onde há espaço para ele acontecer, como no botão primário, que tem 52px
de altura e onde a diferença é clara.

---

## 9. Verificação

- **Contraste**: zero falhas AA nas rotas medidas, em 390 e 1280. O grão não
  desloca a cor da superfície (0,25 nível), então os pares semânticos continuam
  valendo.
- **Costura**: as cinco transições da Home recebem, e nenhuma transição entre
  seções da mesma superfície recebe.
- **Overflow**: zero.
- `typecheck` ✅ · `lint` ✅ · `format:check` ✅ · `test` ✅ 159 · `build` ✅

**O que não foi verificado**: nada disto foi visto no navegador de verdade. As
simulações usam os valores reais e reproduzem a matemática de `overlay`, de
gradiente e de sombra, mas são uma aproximação. O que elas garantem é que a cor
não se moveu e que os efeitos têm a amplitude pretendida; não substituem olhar a
página.

---

## 10. Depois: o grão, olhado

Numa rodada seguinte o ladrilho foi composto em `overlay` sobre as duas
superfícies, em tamanho real, com dez repetições na largura, e a imagem foi
olhada. Duas coisas que só assim se sabem:

- **não há emenda visível** entre ladrilhos, e não há padrão perceptível na
  repetição, que era o risco real de um ladrilho de 64px numa tela de 1920;
- o grão **lê como papel** no pergaminho e como um dente discreto no navy, que
  era a intenção declarada e até então não confirmada.

Medido no ladrilho, para fechar a dúvida de anisotropia: o desvio das médias por
COLUNA é 2,61 e por LINHA é 2,67 no grão claro (1,06 e 1,16 no escuro). Ou seja,
o ruído não tem direção, e as médias são 127,81 e 128,00.

### O ladrilho de 64px também é a razão de o grão existir em tela densa

A pergunta seguinte era se um ladrilho de 2x faria falta: num aparelho de 2 dppx
cada pixel do ruído vira um bloco de 2x2 pixels de tela, ou seja, o grão dobra de
tamanho aparente. Simulado dos dois jeitos, sobre navy:

- **ladrilho de 64px num aparelho 2x**: grão fino e perceptível;
- **ladrilho nativo de 128px**: superfície praticamente **lisa**.

Ou seja, o dobro de resolução nesta amplitude não deixa o grão mais fino, deixa
o grão invisível. O ladrilho de 64px não é uma limitação que a tela densa
expõe: é o que faz o efeito existir justamente onde a maioria vai vê-lo, que é
no celular (regra 10). Nada a mudar, e agora por medição em vez de por acaso.

**Uma armadilha no meio do caminho, e vale registrar.** A primeira simulação
mostrou o grão como um veludo cotelê de listras verticais, o que teria sido um
defeito grave. Não era o asset: era a simulação, que compunha o ladrilho com
`tile: true` e lia o resultado com contagem de canais errada, deslocando meio
pixel por linha. **A medição de coluna contra linha foi o que separou defeito de
artefato**, e é a mesma lição das transições paradas: antes de acreditar numa
imagem medida, confirme o que ela está medindo.
