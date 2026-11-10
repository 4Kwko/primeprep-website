# SEO Técnico — Fundação

## Configurado

### Metadata base — `src/lib/metadata.ts`
- `metadataBase` a partir de `NEXT_PUBLIC_SITE_URL`.
- Template de título: `%s · Prime Prep`; padrão `Prime Prep — Curso Preparatório Militar`.
- Open Graph (`type`, `locale: pt_BR`, `siteName`, `url`) e Twitter card (`summary_large_image`).
- `formatDetection` desligado para telefone/endereço/e-mail — evita que o iOS transforme números em links e quebre a tipografia.
- Helper `pageMetadata({ title, description, path })` para cada página, já emitindo `canonical`.

### Indexação bloqueada por padrão
`robots` e a metadata só liberam indexação quando `NEXT_PUBLIC_ALLOW_INDEXING === "true"`.

Razão: um site em construção indexado é dano difícil de reverter. A liberação é uma ação deliberada no deploy, não o padrão.

### `robots.ts` e `sitemap.ts`
Ambos derivam de `plannedRoutes` em `src/content/navigation.ts` — a mesma fonte do menu. Uma rota nova aparece automaticamente nos três lugares.

### Estrutura semântica
`lang="pt-BR"`, `<main>` com id de âncora, skip link. Headings em ordem e landmarks reais entram com os componentes na Fase 3.

### Convenções de URL
- Minúsculas, hífens, sem acentos: `/concursos/espcex`.
- Hierarquia refletindo a navegação: `/concursos` → `/concursos/afa`.
- Sem sufixo de extensão, sem parâmetro de query em rota canônica.
- Slugs em `src/content/concursos.ts` — **estáveis**. Mudar um slug depois do lançamento exige redirect.

## Deliberadamente NÃO feito

### Metadata final de página
O briefing é explícito: não escrever metadata inventada para página cujo conteúdo não existe. Cada página recebe `title` e `description` reais na Fase 3, junto com o conteúdo que eles descrevem.

### Structured data (JSON-LD)
A fundação está pronta, os dados não. O que está previsto:

| Schema | Onde | Bloqueio |
|---|---|---|
| `EducationalOrganization` | root | falta endereço, telefone, CNPJ, horário |
| `Course` | páginas de concurso | falta definição de oferta/preço |
| `FAQPage` | FAQ | FAQ ainda não redigido |
| `BreadcrumbList` | páginas internas | nenhum — pode entrar na Fase 3 |

**Nada será publicado com dado inventado.** Structured data falso é penalizado e é mentira institucional.

### SEO local
A Prime Prep atua em São Gabriel/RS, então SEO local é relevante. A arquitetura está preparada — `src/lib/site.ts` já tem os campos, todos `null`:

```ts
address: null,  postalCode: null,  phone: null,
openingHours: null,  geo: null
```

Quando o cliente fornecer, entram no `EducationalOrganization` com `address` e `areaServed`. Até lá permanecem ausentes. A cidade e o estado (que **são** conhecidos) já aparecem na description base.

Fora de escopo aqui: Google Business Profile é ação do cliente, não do site.

### Analytics
Nada instalado. O briefing veta explicitamente analytics real nesta fase. `NEXT_PUBLIC_ANALYTICS_ID` está reservado e vazio em `.env.example`.

## Checklist para o lançamento

- [ ] `NEXT_PUBLIC_SITE_URL` com o domínio real
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING=true`
- [ ] `title` e `description` reais em toda página
- [ ] imagem Open Graph em `public/assets/og/`
- [ ] favicon substituído
- [ ] JSON-LD com dados confirmados
- [ ] `/dev/foundation` removida ou bloqueada
- [ ] sitemap validado no Search Console
