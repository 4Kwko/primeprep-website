# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primário: o responsável.** Pai, mãe ou responsável por um estudante de ensino médio em São Gabriel/RS e região, avaliando onde investir a preparação do filho para um concurso militar. Chega desconfiado — o mercado de preparatório é cheio de promessa vazia. Precisa de evidência de método, de acompanhamento real e de seriedade institucional antes de considerar o preço. É quem decide e quem paga.

**Secundário: o aluno**, entre 16 e 18 anos, que quer carreira militar e normalmente descobre a Prime Prep pelo Instagram, no celular. Ele traz o assunto para casa; o responsável fecha. Precisa entender rapidamente qual concurso serve para ele, o que a carreira oferece e que existe um caminho concreto.

O site abre estabelecendo credibilidade para o responsável; o aluno é conquistado nas páginas de concurso.

## Product Purpose

Preparar alunos para concursos militares com acompanhamento individual, e não em regime de turma anônima.

O site existe para: estabelecer a Prime Prep como referência regional em preparação militar; explicar o método e os diferenciais de forma verificável; informar sobre os concursos atendidos; e converter o visitante em conversa por WhatsApp ou pelo chatbot do Instagram.

Sucesso = um responsável que chega cético sai com contato iniciado, e um aluno que não sabia a diferença entre EEAR e AFA sai sabendo qual quer prestar.

## Positioning

O mecanismo é o **acompanhamento individual medido**: planilha individual de desempenho por aluno, correção individual de questões, simulados e redações, e reforço fora do horário regular quando o desempenho indicar necessidade.

Um preparatório de turma grande não pode copiar isso sem mudar seu modelo operacional — é limite de escala, não de discurso. É esta a diferença que o site precisa provar, não afirmar.

Reforço secundário: preparação simultânea para diferentes concursos militares dentro do mesmo ciclo anual, e bolsas por desempenho, com possibilidade de critérios socioeconômicos.

## Operating Context

Curso presencial em São Gabriel/RS.

- Descoberta acontece majoritariamente pelo **Instagram (@primeprep.sg)**, no celular.
- O primeiro contato acontece por **WhatsApp** ou pelo **chatbot de DM do Instagram**, que já existe e responde dúvidas sobre cursos, metodologia e professores. Matrícula e pedido de bolsa chegam pelos mesmos canais, com a intenção já declarada na mensagem.
- Simulados periódicos ao longo do ano, intensificados na aproximação das provas.
- Reforços aos finais de semana quando necessário.
- A evolução de cada aluno é registrada e acompanhada em planilha individual.

O ciclo é sazonal, ancorado nos editais e nas datas de prova das escolas militares.

## Capabilities and Constraints

**Concursos atendidos:** EsPCEx, AFA, EEAR, EFOMM.
**Disciplinas:** Matemática, Física, Português, Inglês.

**Equipe (três professores):**
- João Vitor Melo Montagner — Inglês e coordenação administrativa. MET C1, ECPE C2, ensina inglês desde os 18 anos, graduando em Análise e Desenvolvimento de Sistemas.
- Professor de Matemática e Física (nome e formação omitidos na versão pública).
- Professora de Português (nome e formação omitidos na versão pública).

**Conversão:** quatro intenções — **matrícula, pedido de bolsa, WhatsApp e Instagram Direct** — sobre dois transportes reais (WhatsApp e DM do Instagram). Matrícula e bolsa ainda não têm fluxo próprio: resolvem para WhatsApp com mensagem contextualizada, preservando a intenção. **Não haverá formulário genérico de contato**, portanto não há backend, armazenamento de dados pessoais nem LGPD de formulário. Bolsa e matrícula são fluxos separados e não podem ser apresentados como a mesma ação.

**Restrição dura — nada inventado.** Não existem, e não podem ser fabricados: preços, endereço, telefone fixo, horário de funcionamento, CNPJ, coordenadas, resultados, aprovações, depoimentos. Todo dado de edital é referência, nunca definitivo, e o modelo de dados (`DadoReferencia<T>`) obriga a UI a marcá-lo como tal.

**Explicitamente indecisos:** fluxo próprio de matrícula; processo e critérios de bolsa; ESA está fora do site por ora (decisão do cliente, revisível); página de valores; existência de blog ou área de conteúdo; domínio.

## Brand Commitments

Nome **Prime Prep**, assinatura **"Curso Preparatório Militar"**.

Símbolo: águia heráldica de asas abertas sobre livro aberto com marcador — força e vigilância sobre estudo. Wordmark em serifada capitular. Ornamento recorrente: losango de quatro pontas em filete fino.

Cor-âncora: azul-marinho profundo. Ouro como acento de mérito, escasso.

**Voz:** institucional e próxima ao mesmo tempo. Formal na forma, acolhedora no tom. Sem gíria, sem emoji, sem urgência artificial.

**Compromisso negativo, vinculante:** o aspecto militar aparece com maturidade — heráldica, ordem, rigor. Nunca camuflagem, estêncil, armas, HUD tático ou verde militar como tema. A Prime Prep é primeiro uma instituição de educação.

Referências visuais primárias: quatro peças gráficas do cliente, analisadas em `docs/planning/visual-identity-analysis.md`.

## Evidence on Hand

**Existe:** as quatro peças gráficas de identidade (referência, não asset de produção — em `docs/references/social/`); os dados de concurso do carrossel institucional, todos marcados `verifiedAt: null`; as credenciais dos três professores; o chatbot do Instagram em operação.

**Não existe, e futuras fases não podem fabricar:**
- logo em SVG com variações (horizontal, vertical, símbolo isolado, mono claro/escuro) — só há versões rasterizadas dentro das peças;
- brasões das escolas em alta resolução;
- fotografias dos professores, dos alunos ou da estrutura;
- qualquer aprovação, número de alunos, taxa de sucesso ou depoimento;
- endereço, telefone fixo, horário, preço.

Ausência é estado válido. A UI precisa tratar ausência com elegância, nunca preencher com genérico.

## Product Principles

1. **Provar, não afirmar.** "Acompanhamento individualizado" é slogan em todo preparatório. A planilha individual, a correção individual e o reforço sob demanda são o mecanismo — o site mostra o mecanismo.
2. **Ausência é preferível a invenção.** Um campo vazio custa menos que um dado falso. Isso vale para preço, aprovação, depoimento e edital.
3. **Duas audiências, uma página.** O responsável precisa de credibilidade; o aluno, de futuro concreto. A ordem é credibilidade primeiro, sem que o aluno perca o fio.
4. **Todo caminho termina em conversa.** O produto é uma relação de acompanhamento, não uma compra. O site não fecha venda — abre diálogo, no WhatsApp ou na DM, com a intenção do visitante (dúvida, matrícula ou bolsa) já explícita na mensagem.
5. **O concurso é a unidade de navegação.** O visitante não pensa "quero um cursinho", pensa "quero passar na EEAR". A arquitetura segue esse pensamento.

## Accessibility & Inclusion

Público adolescente e adulto, majoritariamente em celular e em rede móvel. Meta **WCAG 2.1 AA**, com AAA em corpo de texto onde a paleta permite.

Requisito específico do produto: as cores de contexto por concurso codificam informação, portanto **nunca podem ser o único portador de significado** — sempre acompanhadas da sigla em texto.

A Prime Prep concede bolsas com possibilidade de critérios socioeconômicos: o site é acessível em conexão lenta e em aparelho modesto por decisão, não por acaso.
