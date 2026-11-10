# Tooling & Qualidade

## Scripts

```bash
npm run dev           # servidor de desenvolvimento (Turbopack)
npm run build         # build de produção
npm run start         # serve o build
npm run lint          # ESLint
npm run lint:fix      # ESLint com correção automática
npm run format        # Prettier — escreve
npm run format:check  # Prettier — só verifica
npm run typecheck     # tsc --noEmit
npm run check         # typecheck + lint + format:check  ← o portão
```

`npm run check` é o comando que precisa passar antes de qualquer entrega.

## TypeScript

Além de `strict`, foram ligadas:

| Flag | O que impede |
|---|---|
| `noUncheckedIndexedAccess` | tratar `array[i]` como sempre definido — relevante porque quase todo conteúdo é lista |
| `exactOptionalPropertyTypes` | confundir "propriedade ausente" com "propriedade `undefined`" |
| `noImplicitOverride` | sobrescrita acidental de método |
| `noFallthroughCasesInSwitch` | `case` sem `break` |
| `verbatimModuleSyntax` | import de tipo virando import de runtime |

`target` elevado para `ES2022`.

Custo real: `noUncheckedIndexedAccess` obriga a tratar o caso de índice inexistente. Em um site que renderiza listas de concursos e professores, é exatamente onde um erro apareceria em produção. Aceito.

## ESLint

Flat config (`eslint.config.mjs`) com `eslint-config-next/core-web-vitals` (que já traz `jsx-a11y`) + `eslint-config-next/typescript` + `eslint-config-prettier` para desligar regras de formatação.

`.claude/**` está em `globalIgnores`: o ferramental do Impeccable é código de terceiro, não fonte do projeto. Sem isso, `npm run lint` reprova em `live-browser.js` e `modern-screenshot.umd.js`.

Duas regras adicionadas:
- `@typescript-eslint/no-unused-vars` com escape por prefixo `_`.
- `@typescript-eslint/consistent-type-imports` — `import type` inline, exigido por `verbatimModuleSyntax`.

## Prettier

`printWidth: 100`, aspas duplas, `trailingComma: all`. Plugin `prettier-plugin-tailwindcss` ordena as classes automaticamente — o que resolve o principal problema de legibilidade do Tailwind sem esforço manual.

`.md` está no `.prettierignore`: a documentação usa formatação intencional que o Prettier reescreveria.

## Testes

**Nenhum runner instalado — decisão consciente.**

O projeto é um site institucional estático, sem lógica de negócio, sem estado de servidor, sem transformação de dado. Um runner agora testaria `cn()` e a forma de arrays literais: teste sem valor, com custo de manutenção real.

O que efetivamente valida a Fase 2: `tsc` (os dados batem com os tipos), ESLint e o build de produção.

Reavaliar quando aparecer: formulário com validação, filtro/busca em concursos, ou qualquer cálculo. Aí o caminho é **Vitest** (unit) + **Playwright** (E2E do fluxo de contato e a11y automatizada com `axe-core`).

## Git

Repositório local inicializado pelo scaffold. **Nenhum commit foi feito** e **nenhum remote foi configurado** — commit, push e publicação exigem pedido explícito.

`.gitignore` verificado:
- `node_modules`, `.next/`, `/out`, `/build`, `coverage` — ignorados.
- `.env*` ignorado, com exceção explícita `!.env.example` adicionada (o exemplo **precisa** ser versionado).
- `*.pem`, `.vercel`, `*.tsbuildinfo` — ignorados.
- `.claude/skills/`, `.claude/agents/` e `.claude/settings.local.json` — ignorados. A instalação do Impeccable traz um binário de 15MB específico de plataforma; é reinstalável com `npx impeccable install --providers=claude --scope=project -y`.
- Nenhum secret no repositório: `.env.local` não existe e `.env.example` tem só chaves vazias.

## Não configurado (e por quê)

| Item | Motivo |
|---|---|
| CI (GitHub Actions) | não há remote nem decisão de hospedagem de código |
| Husky / lint-staged | equipe pequena; `npm run check` cobre. Reavaliar se o time crescer |
| Commitlint | overhead sem ganho neste estágio |
| Bundle analyzer | sem componentes, não há bundle para analisar |
| Dependabot / Renovate | depende de remote |
