# Arquitetura

## Visão geral

Site estático renderizado no build (SSG). Não há banco de dados, autenticação nem estado de servidor. O conteúdo institucional vive em módulos TypeScript tipados; as páginas os consomem em tempo de build.

```
src/content/*.ts  ──┐
   (dados)          ├──► src/app/**/page.tsx ──► HTML estático
src/components/* ───┘         (composição)
   (apresentação)
                    └──► sitemap.ts / robots.ts (derivados dos mesmos dados)
```

## Limites entre camadas

| Camada | Pode | Não pode |
|---|---|---|
| `content/` | exportar dados tipados | importar React, conhecer estilo |
| `types/` | descrever formas de dado | conter lógica |
| `lib/` | utilidades puras e configuração | renderizar |
| `components/ui`, `decorative` | renderizar a partir de props | importar de `content/` |
| `components/sections` | importar de `content/` e compor `ui`/`decorative` | conter regra de roteamento |
| `app/` | rotear, definir metadata, compor seções | desenhar |

A regra que mais importa: **`sections` conhece o conteúdo, `ui` não.** Isso mantém as primitivas reutilizáveis e testáveis.

## Estratégia de conteúdo

Módulos TS em vez de Markdown ou CMS, porque:
- o conteúdo é **estruturado** (fichas de concurso com campos fixos), não editorial livre;
- ganha checagem de tipo — um concurso sem `sigla` não compila;
- `DadoReferencia<T>` força cada dado de edital a declarar `verifiedAt`, tornando impossível exibir um dado não verificado como se fosse definitivo sem passar pelo tipo.

Se a Fase 3 introduzir conteúdo editorial de fato (blog, artigos), a decisão correta será MDX ou um CMS headless — **não** empilhar prosa dentro destes arquivos. Ver pendência D-16 em `open-questions.md`.

## Renderização

- **Server Components por padrão.** Zero JS enviado para seções puramente informativas.
- `"use client"` apenas onde há estado, evento ou animação orquestrada, e o mais fundo possível na árvore: um acordeão é client, a seção que o contém não precisa ser.
- Páginas de concurso serão rotas dinâmicas com `generateStaticParams` a partir de `concursos.ts` — todas pré-renderizadas, nenhuma requisição em runtime.

## Sistema de superfícies

O mecanismo central da UI. Em vez de props de tema ou variantes por componente, cada bloco declara sua superfície:

```tsx
<section data-surface="navy" className="section">…</section>
```

Todos os tokens semânticos abaixo dele mudam. Um `Card` escrito uma única vez funciona corretamente em pergaminho, navy e ink, sem prop de variante, sem duplicação de classe.

É o que permite o **ritmo cromático alternado** que a direção visual exige, sem custo de complexidade.

## Estratégia de assets

Assets de produção em `public/assets/`, servidos estaticamente. Referências de marca em `docs/references/` — **fora de `public/`**, para que seja impossível publicá-las por acidente. Ver [`assets.md`](./assets.md).

## Expansões previstas (não implementadas)

| Expansão | Caminho | Impacto arquitetural |
|---|---|---|
| ~~Formulário com envio~~ | — | **descartado**: conversão é só WhatsApp + DM do Instagram |
| Blog / conteúdo editorial | MDX ou CMS headless | médio — nova camada de conteúdo |
| Área do aluno | auth + banco | alto — decisão de produto, não técnica |
| Analytics | script no root layout | baixo — aguarda decisão do cliente |
| i18n | `next-intl` | alto — não previsto (site é pt-BR) |
