# Pendências de Conteúdo e Assets

**Do lado técnico a implementação está encerrada.** Tudo nesta lista depende de material, informação ou decisão da Prime Prep — nada aqui é trabalho de código pendente.

Cada item diz **onde entra** e **o que muda quando chegar**, para que a inserção seja mecânica.

---

## Bloqueia publicação

Sem estes o site não deve ir ao ar.

### 1. Logo em SVG
A marca real do cliente já está em uso: o arquivo raster vive em `public/assets/brand/logo/` como máscaras alfa, pintadas pela cor da superfície, em quatro recortes do mesmo original (`completa`, `aguia`, `wordmark`, `livro`). Não é mais placeholder, e nada aqui foi redesenhado nem vetorizado, o que o briefing proíbe.

**O que falta é o SVG**, e o motivo é escala, não ausência: raster não acompanha densidade de tela nem tamanho pequeno sem custo. Somando as quatro máscaras, hoje são 190KB em PNG e 54KB em AVIF; em SVG seriam alguns KB e nítidos em qualquer tamanho.

**Necessário:** as mesmas quatro variações em SVG, monocromáticas (a cor vem do CSS).
**Entra em:** [`src/components/layout/Wordmark.tsx`](../../src/components/layout/Wordmark.tsx) e as classes de máscara em `utilities.css` — **dois lugares**. Nenhuma página muda.

### 2. Símbolo isolado, para o ícone de aba
O ícone genérico do scaffold já saiu: `scripts/gerar-assets-marca.mjs` gera os ícones a partir dos recortes que existem, recolorindo e enquadrando, sem redesenhar.

**O limite é geométrico, e foi medido.** Os três recortes foram renderizados em 16 e 32px e comparados ampliados:

| recorte | proporção | 32px | 16px |
|---|---|---|---|
| `completa` | 2.06:1 | "PRIME" ilegível sob a águia | borrão |
| `wordmark` | 2.08:1 | **"PRIME" nítido** | textura |
| `aguia` | 4.86:1 | silhueta limpa, sem o nome | asa reconhecível |

O ícone de aba passou a usar a `wordmark`, que é a regra da marca aplicada e não uma exceção a ela: "quando o espaço não comporta a águia, use wordmark". Os tamanhos grandes (180, 192, 512) continuam com a `completa`.

**A 16px nenhum recorte de 2:1 se lê**, porque a marca ocupa metade da altura do quadrado por definição. Isso só se resolve com um símbolo **quadrado**, e recortar um dos existentes para chegar nele seria mexer na silhueta, que é o que não se faz aqui.

**Necessário:** um símbolo isolado, quadrado ou próximo disso.
**Entra em:** `scripts/gerar-assets-marca.mjs`, na tabela de ícones.

### 3. Domínio + liberação de indexação
Sem `NEXT_PUBLIC_SITE_URL`, canonical, Open Graph e sitemap apontam para `localhost`.
**Entra em:** `.env` do ambiente de produção. `NEXT_PUBLIC_ALLOW_INDEXING=true` libera a indexação, hoje bloqueada por decisão (D-10).

### 4. Valor correto da EFOMM
O material do cliente diverge: a tabela final do carrossel indica **~R$ 13 mil**; o slide individual indica **R$ 15.000 a R$ 24.000**.

O site usa o valor do slide, em **um único lugar** ([`src/content/concursos.ts`](../../src/content/concursos.ts) → `efomm.remuneracaoInicial`), consumido pela tabela comparativa e pela ficha técnica. Corrigir é editar uma linha.

**Por que bloqueia:** é um número financeiro publicado. Errado, compromete a credibilidade que o site inteiro tenta construir.

---

## Recomendado antes da publicação

Não impedem o lançamento, mas o site fica mensuravelmente melhor com eles.

### 5. Geografia e História na EsPCEx
A prova cobra seis frentes; o corpo docente informado cobre quatro. As páginas de concurso **declaram a lacuna abertamente** ("Conteúdo do edital", com nota explicativa) em vez de escondê-la.

**Confirmar:** essas disciplinas são atendidas de outra forma? Há professor não informado? O aluno estuda por conta?
**Entra em:** [`src/content/equipe.ts`](../../src/content/equipe.ts) (novo professor/disciplina) e o texto da seção 02 em [`src/app/concursos/[slug]/page.tsx`](../../src/app/concursos/[slug]/page.tsx).

### 6. Fotografias
Sem fotos, os professores aparecem com monograma tipográfico e o hero se sustenta em tipografia e campo gráfico. Funciona — mas foto real de professor converte melhor com responsável.

**Necessário:** retrato dos três professores (recorte 4:5) e, se houver, foto do espaço.
**Entra em:** `public/assets/photos/`; trocar a `div` do monograma por `next/image` em `Professores.tsx` (Home e página) — a altura fixa `h-40`/`h-44` volta a `aspect-[4/5]`.

### 7. Imagem Open Graph
Sem ela, links compartilhados no WhatsApp e no Instagram aparecem sem imagem — justamente nos dois canais de conversão do site.
**Entra em:** `public/assets/og/` ou gerada com `next/og` a partir dos tokens.

### 8. Decisão sobre valores
Hoje o site diz que valores são informados no atendimento — coerente e honesto. Se houver decisão de publicar preços, é uma página nova.
**Nada no site implica preço ou condição não confirmada.**

---

## Pode ser adicionado depois

### 9. FAQ
O planejamento previa; o conteúdo não existe e **não foi inventado**.
**Estrutura recomendada quando chegar:** `src/content/faq.ts` com `FaqItem[]` (o tipo já existe em [`src/types/content.ts`](../../src/types/content.ts)), consumido por um acordeão em `/o-curso` ou em rota própria. Perguntas devem sair do que o chatbot do Instagram mais recebe — a fonte mais honesta disponível.

### 10. JSON-LD local
`EducationalOrganization` + `Course` + `BreadcrumbList` estão previstos mas **não implementados**: dependem de **endereço, telefone e horário de funcionamento**, que não existem. Structured data com dado inventado é penalizado e é mentira institucional.
**Entra em:** `src/lib/site.ts` (campos hoje `null`) e depois um bloco `<script type="application/ld+json">` no layout.

### 11. Brasões das escolas
As páginas de concurso funcionam sem eles — a cor de contexto e a sigla já identificam. Brasões em alta resolução ou SVG acrescentariam autoridade visual.
**Entra em:** `public/assets/brand/brasoes/`; campo `brasao` em `concursos.ts` já existe, hoje `null` para os quatro.

### 12. Números institucionais
Nenhuma métrica é exibida — não há aprovações, número de alunos ou tempo de mercado fornecidos, e o briefing proíbe inventá-los. Se existirem números **verificáveis**, viram uma faixa de destaque.

### 13. Fluxo próprio de matrícula e de bolsa
Hoje as duas intenções resolvem para WhatsApp com mensagem contextualizada — nada é simulado. Se ganharem página ou sistema, basta preencher `href` em [`src/content/conversion.ts`](../../src/content/conversion.ts). **Nenhum componente muda.**

### 14. Analytics
Não instalado, por decisão. Os CTAs já carregam `data-cta` e `data-cta-section`; ligar a medição é acrescentar um handler. Envolve LGPD e provavelmente banner de consentimento.

### 15. Paleta e fontes oficiais
Os valores atuais são interpretação documentada das peças. Se existir manual de marca com hex e famílias oficiais, a troca é local: `src/styles/tokens.css` e `src/lib/fonts.ts`.

---

## Checklist de lançamento

- [ ] Logo SVG em `Wordmark.tsx`
- [ ] Favicon definitivo substituindo o do scaffold
- [ ] `NEXT_PUBLIC_SITE_URL` com o domínio real
- [ ] Valor da EFOMM confirmado
- [ ] Imagem Open Graph
- [ ] `/dev/foundation` removida ou bloqueada no deploy
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING=true`
- [ ] Sitemap validado no Search Console
