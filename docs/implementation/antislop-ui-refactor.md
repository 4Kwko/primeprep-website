# Refactor visual e de UX: header, profundidade e navegação

Rodada de refactor sobre o site já implementado, auditado e com a marca real
aplicada. Sem features novas, sem páginas novas, sem dependências novas.

Filtro: **antislop, Modo 1 (durante)**. Direção: `DESIGN.md`.
Diais declarados: **ENERGY 2 · RHYTHM 3 · MOTION 2**, mantidos como pedidos no
briefing. Nenhum foi alterado, então não há justificativa de desvio a registrar.

---

## 1. O problema principal: o header não era uma camada

O header usava `bg-canvas`, o mesmo navy do hero. Resultado: ao carregar a Home,
ele não existia como interface. Era o topo da abertura, e a navegação parecia
perdida dentro da arte em vez de estar apoiada sobre ela.

### A correção é composicional, não `background` mais `box-shadow`

O header ganhou **superfície própria**: `--color-canvas-alt`, um degrau tonal
mais escuro que o conteúdo. Medido no navegador: header `rgb(12, 28, 64)` contra
hero `rgb(15, 35, 80)`. É pouco, e é o suficiente: o olho lê dois planos.

Sobre isso, luz no topo (`--shadow-inset-top`) e filete na base. Nada de blur:
glassmorphism está vetado na direção da marca, e não é ele que resolveria o
problema de qualquer forma, porque blur não separa planos, funde.

### Dois estados

| | Altura (mobile / xl) | Base | Elevação |
|---|---|---|---|
| **No topo** | 64px / 80px | filete `hairline` | nenhuma |
| **Após rolar** | 56px / 64px | filete `border` | `--shadow-raise` |

A altura é a única coisa que muda de layout, e como o header é `fixed`, o
conteúdo abaixo não salta. Medido a 1440: 80px no topo, 64px após rolar, sombra
resolvida em `rgba(3,7,18,0.4) 0 2px 4px` e `rgba(3,7,18,0.7) 0 10px 28px -14px`.

Com o menu mobile aberto o header **não comprime**. O painel ancora em `top-16`,
e um header de 56px deixaria uma fresta de 8px mostrando a página atrás.

### Um falso defeito que quase virou correção errada

A primeira medição do estado rolado devolveu altura 80px (não comprimiu) e duas
sombras `rgba(0,0,0,0)` (elevação transparente), com a classe correta aplicada.
Parecia dois bugs. Era um só, e nem era bug: a medição pegou a **transição em
voo**. O CSS interpola listas de sombra de tamanhos diferentes preenchendo a
menor com `0 0 0 0 transparent`, e a altura estava no primeiro quadro dos 260ms.

Lição para a próxima medição: propriedade em transição precisa de tempo de
assentamento antes de ser lida, senão o instrumento inventa o defeito.

---

## 2. Estado ativo de navegação

O item ativo tinha um losango de 10px abaixo do rótulo. Em uso real era
imperceptível: um ponto pequeno, na cor de acento, competindo com seis rótulos.

Agora é um **filete de 2px** que corre sob o rótulo inteiro e cresce a partir da
esquerda, no vocabulário de trilho do Diário de Bordo. É o mesmo gesto do
`log-rail`, aplicado à navegação. No hover ele aparece a 35% de opacidade, então
o alvo responde antes do clique sem fingir que está ativo.

Medido em `/metodologia`: só o item "Metodologia" com `transform: scaleX(1)`,
`opacity: 1`, `backgroundColor: rgb(211, 178, 99)`. Os outros cinco em
`opacity: 0`. O `aria-current="page"` continua sendo o portador semântico; a cor
nunca informa sozinha.

---

## 3. A águia do hero subiu

Estava a `58%` da altura da seção, ou seja, no rodapé do hero. Chegava tarde
demais para abrir a composição e ainda disputava espaço com os CTAs.

Agora está a `13%`, na faixa do eyebrow e do início do título, que é o único
vazio real do hero. O sangramento passou de 7rem para 9rem no mesmo movimento.

Medido a 1024, que é o caso apertado: a linha mais longa do `h1` termina em
x=333 e a águia começa em x=492. Folga de 159px, medida sobre os retângulos de
texto reais (`Range.getClientRects`), não sobre a caixa do `h1`, que é bem mais
larga que o texto e produzia um falso positivo de colisão.

**O que se perdeu, e por que tudo bem:** lá embaixo a águia passava por trás do
painel, e a oclusão é um cue forte de profundidade. Aqui em cima não há o que
ocluir. A profundidade passa a vir da opacidade e do corte na borda direita. Foi
uma troca deliberada, porque o pedido de subir a marca é hierárquico e a oclusão
era circunstancial.

---

## 4. A nova regra da marca

> **O livro nunca é usado sozinho.**

Ele é o pé da composição, não uma marca autônoma. Isolado, não identifica a
Prime Prep e lê como ícone genérico. A variação `livro` continua no mapa de
`Wordmark.tsx` por ser um recorte legítimo do original, mas está marcada como
**RESERVADA** e não deve ser aplicada. Onde a águia não couber, use `wordmark`
(PRIME mais livro), que é a menor composição que ainda é a marca.

Consequência imediata: o fecho do `CtaFinal`, que usava o livro isolado como
assinatura, passou a usar `wordmark` a 4.5rem. A Regra da Variação continua
valendo: a águia abre (header e hero), o wordmark fecha, a completa assina o
footer.

---

## 5. Rolagem e âncoras

O `html { scroll-behavior: smooth }` já existia. Faltava a outra metade:

```css
:where([id]) {
  scroll-margin-top: 6rem;
}
```

O `scroll-padding-top` no container cobre navegação por link e por teclado; o
`scroll-margin-top` no alvo cobre `scrollIntoView` vindo de qualquer origem. Em
`:where()` para ficar com especificidade zero e nunca disputar com um componente
que precise de outro recuo. 6rem são os 4rem do header comprimido mais folga de
leitura. Sem biblioteca, sem interceptar clique no JS, e
`prefers-reduced-motion` devolve o salto instantâneo.

---

## 6. Transição de rota, e o defeito que ela quase introduziu

A troca de página num site estático é instantânea, e instantâneo demais lê como
corte seco: o olho percebe que a tela piscou, não que o conteúdo mudou. Uma
entrada curta resolve. Sem cortina, sem spinner, sem espera: a rota é pintada
quando o Next termina de resolvê-la, e a animação só acompanha essa pintura.

**A primeira versão estava errada, de um jeito grave.** Era
`animation: pp-entrada-rota 420ms both` com `from { opacity: 0 }`. Medido num
navegador real com a renderização suspensa (janela atrás de outra):

```
animationPlayState: "running"   currentTime: 0   opacity: "0"
```

A página inteira invisível, esperando um quadro que não vinha. Trocar o
`fill-mode` para `none` não resolveu: com a animação já na fase ativa, o keyframe
vale de qualquer jeito.

É exatamente o defeito da **D-21**, só que por CSS em vez de por JS. A lição é a
mesma: *o conteúdo não pode depender de um quadro de animação para existir.*

Correção: a transição anima **só `transform`**, nunca opacidade. O pior caso
possível passou a ser uma página 14px mais baixa. Ninguém perde texto por causa
de uma transição de rota.

O `key={pathname}` no wrapper existe porque animação CSS não reinicia sozinha
quando só o conteúdo do nó muda.

---

## 7. O trilho de margem nunca grudou

Achado colateral, e o mais antigo desta lista. O `.log-rail` declarava
`position: sticky; top: 7rem` desde a Etapa 1, e **nunca funcionou**.

O trilho é item de grade, e item de grade estica por padrão. A caixa dele tinha
exatamente a altura da entrada inteira, então `sticky` não tinha para onde
correr. Medido: o topo do trilho acompanhava o topo da entrada em qualquer
posição de rolagem, de -264px a -1669px. O comportamento documentado em
`LogEntry.tsx` ("grudado ao rolar") descrevia algo que não acontecia.

`align-self: start` resolve: a caixa passa a ter o tamanho do conteúdo (44px em
vez da altura da entrada) e o trilho gruda em 112px enquanto a entrada rola de
-561 a -1161.

Nenhuma suíte pegaria isto. `typecheck`, `lint` e `build` passavam, o CSS estava
sintaticamente correto e a propriedade estava computada como `sticky`. Só medir
o retângulo em várias posições de rolagem mostra.

---

## 8. Descartonização

A pergunta aplicada bloco a bloco: **isto realmente precisa ser um cartão?**

### `card-raised` foi removido do sistema

Era sombra de repouso em cartão **não clicável**, aplicada em oito lugares
(contato, bolsas, professores da Home e da página). Contradizia uma regra que o
próprio sistema já tinha escrito: *"só o que é alvo de navegação recebe sombra"*.
Somadas, as oito produziam o efeito de página inteira flutuando, no qual
elevação deixa de significar coisa alguma.

Cartão estático agora é borda mais superfície. Quem sobe é `card-interactive`,
porque ali a sombra responde a estado.

### `/contato`, seção 01

Três cartões elevados idênticos para três assuntos. Era a forma que faz uma
escolha simples parecer um catálogo. Viraram **linhas de um registro**: régua,
assunto, explicação, ação. O que separa um item do outro é espaço em branco e
filete, e a única coisa que se destaca é o botão, que é o que a pessoa veio
fazer.

### `/contato`, seção 02

Dois cartões idênticos lado a lado, para dois canais que o próprio texto declara
desiguais: um é "canal principal", o outro é onde a conversa continua se já
existe. O WhatsApp foi para um **painel elevado**, com o número em escala de
leitura e o CTA primário. O Instagram ficou na margem, apoiado só num filete, em
escala e tom de nota.

### `/bolsas`, seção 01

Dois cartões elevados para duas definições de duas palavras cada. Viraram um
`<dl>` de verdade: termo à esquerda, definição à direita, régua entre as duas. A
forma passou a corresponder ao conteúdo, e também a corresponder para quem usa
leitor de tela.

### Onde o cartão ficou

`/professores` e o hub `/concursos`: pessoa e concurso são objetos discretos, e o
cartão dos concursos é alvo de navegação. Os de professor perderam só a sombra.

---

## 9. O footer como o outro extremo do header

Antes: marca, Institucional, Concursos, Fale com a gente. Quatro colunas de mesmo
peso, que é a forma genérica de rodapé, e que enterrava a conversão como se fosse
mais uma lista de links.

Agora são **duas faixas**:

1. **Assinatura e conversa.** A marca completa a 5rem, a tagline, a linha
   institucional, e ao lado o bloco de contato com os CTAs e os dois canais.
2. **O índice do site.** As duas famílias de página, mais a ressalva sobre dados
   de edital, que saiu da letra miúda de copyright e ganhou largura para ser lida.

E a águia sangrando pela **borda esquerda**, embaixo. É o espelho do hero: lá ela
entra pela direita no alto e abre o site; aqui sai pela esquerda embaixo e o
fecha. Um extremo é a marca comprimida (uma faixa, uma linha, a águia a 26px), o
outro é a mesma marca solta. É a mesma identidade em dois regimes de espaço.

---

## 10. Movimento

MOTION 2: presente, curto, sempre ligado a significado. O que entrou nesta
rodada:

| Gesto | Por que existe |
|---|---|
| Header comprime ao rolar | sinal mais legível de "isto é a barra, não a página" |
| Filete do item ativo cresce da esquerda | marcação feita à régua, vocabulário do trilho |
| Régua ornamental se desenha ao revelar | o gesto da marca virando movimento, em vez de mais um fade |
| Menu mobile escalonado (0 a 300ms) | os seis itens chegam na ordem em que serão lidos |
| Entrada de rota (só `transform`) | a página nova entra, a antiga não espera |
| Losango do footer acende no hover | o alvo responde antes do clique |

Nada de flutuação contínua, parallax, bounce ou scale. Tudo em `transform` ou
`opacity`, tudo com desligamento em `prefers-reduced-motion`.

A régua ornamental vive sob `@media (scripting: enabled)` pela mesma razão do
reveal: sem JavaScript o `data-revealed` nunca chega, e o ornamento ficaria em
`scaleX(0)`, ou seja, invisível.

---

## 11. Diferenciação das páginas internas

O sistema é compartilhado; a composição não deve ser. As seis internas abriam
**exatamente iguais**: mesmo `PageHeader`, mesma marca d'água na mesma posição,
carga empilhada abaixo do lead.

O corpo das páginas já era diferente (tabela comparativa em `/concursos`, linha
do tempo em `/metodologia`, registro de docentes em `/professores`, glossário em
`/bolsas`, linhas de assunto em `/contato`). O que faltava era a abertura.

**Duas composições de cabeçalho, decididas pelo conteúdo:**

- Sem carga: uma coluna só. Rótulo, título, lead.
- Com carga (`children`: um CTA, a força do concurso): **duas colunas** em `lg`,
  texto à esquerda, carga ancorada à base da direita.

O critério não é estético: quem tem algo a mais para oferecer no cabeçalho ganha
a coluna; quem não tem, não ganha. Hoje isso separa `/bolsas` e as quatro páginas
de concurso das demais. Medido a 1440: 672px mais 497px, CTA em x=832.

**Quatro marcadores em `/concursos`.** É a única página cujo assunto é o
conjunto, e o rótulo mostra isso: quatro losangos, um por cor de força, antes do
título. Nas páginas de concurso o marcador é um só, na cor daquela força.

---

## 12. Verificação

### Varredura responsiva

**72 combinações** (8 larguras por 9 rotas): 320, 390, 430, 768, 1024, 1280,
1366 e 1440 sobre Home, `/o-curso`, `/metodologia`, `/concursos`,
`/concursos/espcex`, `/professores`, `/bolsas`, `/contato` e 404.

- **Scroll horizontal: zero** em todas.
- **Contraste: zero falhas AA** em **6.584 nós de texto** medidos.

### O instrumento também tinha um bug

A primeira passada de contraste acusou 14 falhas na tabela comparativa, todas nas
linhas da AFA e da EFOMM, com razões de 1.95:1. Eram as linhas ímpares, as únicas
com `bg-surface-sunken/50`, que o Tailwind compila para `oklab(… / 0.5)`. O
parser de cor lia `[\d.]+` e pegava `0.928591` como canal vermelho.

Corrigido pintando a pilha de fundos numa tela `<canvas>` opaca, que resolve
`oklab`, `oklch`, `color()` e alfa sem interpretar sintaxe nenhuma. Depois disso:
zero falhas.

Vale registrar porque a conclusão errada seria "a tabela reprova em contraste" e
a correção errada seria mexer numa tabela que estava certa.

### Header

Medido nas 8 larguras: superfície `rgb(12,28,64)` constante, navegação entra em
1280, botão de menu 44 por 44 abaixo disso, folga mínima de 95px a 320. Sem
transbordo.

### Teclado

Tab real, não simulado. Primeira parada: skip link, que aparece a 217 por 52 com
anel visível. Nas paradas seguintes o anel adapta por superfície: sobre navy sai
em ouro, medido a **9.36:1** contra o campo.

### Ligações

As 11 rotas respondem 200, a inexistente responde 404. Zero `href` vazio ou `#`,
zero elemento interativo fora da ordem de tabulação. Todo alvo abaixo de 24px de
altura carrega `data-touch-target`, que aciona os 44px mínimos em ponteiro
grosso.

### Cadeia técnica

`typecheck` ✅ · `lint` ✅ · `format:check` ✅ · `build` ✅ 17 rotas · console limpo.

---

## 13. O que não foi feito, e por quê

- **Nada de parallax na marca d'água.** Exigiria JS de scroll e cairia no
  vocabulário de landing genérica que a direção veta.
- **Nada de saída animada na troca de rota.** Sairia como atraso, e o briefing
  proíbe atraso artificial.
- **Nada de blur no header.** Glassmorphism está vetado, e blur funde planos em
  vez de separá-los, que era justamente o problema a resolver.
- **A águia não voltou a passar por trás do painel.** Subir a marca era o pedido;
  a oclusão era o efeito colateral bonito da posição antiga.
- **Nenhuma dependência nova.** Tudo é CSS, tokens e um componente cliente de
  cerca de 30 linhas.
