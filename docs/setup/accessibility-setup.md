# Acessibilidade — Fundação

Meta: **WCAG 2.1 AA**, com AAA em texto de corpo onde a paleta já entrega.

## O que já está configurado

### Contraste — auditado, não estimado
Todos os pares semânticos foram medidos nas três superfícies durante o Setup. **Todos passam AA**; a maioria com folga AAA. Tabela completa em [`design-system-foundation.md`](./design-system-foundation.md#contraste--auditado-não-estimado).

Duas decisões nasceram dessa auditoria:
- `--color-accent` é **ouro escuro** sobre pergaminho e **ouro claro** sobre navy/ink. Um ouro único reprovaria em uma das superfícies.
- As cores de contexto por concurso ganharam variantes claras nos escopos escuros. Sem isso, o azul da EEAR ficava em 2.56:1 sobre pergaminho.

### Foco visível
Um único anel, definido em `base.css`: `2px solid var(--color-focus)` com `outline-offset: 2px`. Como `--color-focus` é token de superfície, o anel é sempre visível — ouro claro sobre navy, navy sobre pergaminho, ambos acima de 9:1.

`:focus:not(:focus-visible)` remove o anel para clique de mouse, mantendo-o para teclado.

### Skip link
`.sr-only-focusable` em `utilities.css`; instanciado no root layout apontando para `#conteudo`. Invisível até receber foco, aí aparece como botão sólido no canto superior esquerdo.

### Landmarks
O root layout já entrega `<main id="conteudo">`. `<header>`, `<nav>` e `<footer>` entram na Fase 3 como elementos semânticos reais.

### Movimento reduzido
Duas frentes:
- `base.css` neutraliza toda animação e transição CSS sob `prefers-reduced-motion: reduce`, e desliga `scroll-behavior: smooth`.
- Animações orquestradas por JS usam `useReducedMotion()` do `motion` (`src/lib/motion.ts`).

### Alvos de toque
Mínimo 44px de altura em ponteiro grosso, via `@media (pointer: coarse)` em `base.css`.

### Idioma e escala
`<html lang="pt-BR">`. `-webkit-text-size-adjust: 100%` sem bloquear zoom — nenhum `user-scalable=no`.

### Rolagem por âncora
`scroll-padding-top: 6rem` no `html`, para que o header fixo não cubra o destino de uma âncora.

## Regras para a Fase 3

### HTML semântico primeiro
ARIA compensa nada. `<button>` para ação, `<a>` para navegação, `<table>` para dados tabulares com `<th scope>`, `<nav>` para navegação, headings em ordem sem pular nível.

Um `<div onClick>` com `role="button"` e `tabIndex` é sempre erro — o elemento certo já existe.

### ARIA só quando necessário
Casos legítimos previstos: `aria-expanded` no menu mobile e no acordeão do FAQ, `aria-current="page"` no item ativo, `aria-label` em botão só-ícone, `aria-controls` ligando gatilho e painel.

### Formulários
- `<label>` real associado a cada campo. Placeholder **não** é label.
- Erro descrito em texto, ligado por `aria-describedby`, e nunca comunicado só por cor.
- Campo inválido com `aria-invalid`.
- Ordem de tabulação natural.
- `autocomplete` nos campos de contato.

### Teclado
- Todo elemento interativo alcançável por Tab, na ordem visual.
- Menu mobile: foco preso enquanto aberto, `Esc` fecha, foco volta ao gatilho.
- Acordeão: Enter/Espaço alternam.
- Dropdown de concursos: navegável por teclado, não só por hover.

### Imagens
- `alt` descritivo em imagem informativa; `alt=""` em decorativa.
- Brasões: `alt` com o nome da escola.
- Águia em marca d'água e ornamentos: decorativos, `aria-hidden`.

### Cor nunca sozinha
As cores de contexto por concurso codificam informação — sempre acompanhadas da sigla em texto. Um daltônico precisa ler "EFOMM", não distinguir azul-petróleo de azul-aeronáutica.

### Motion
Nada que pisque mais de 3×/s. Nenhuma animação essencial à compreensão.

## Verificação prevista

| Quando | Como |
|---|---|
| Durante a Fase 3 | navegação só por teclado em cada tela; zoom 200% |
| Antes do deploy | axe DevTools ou Lighthouse a11y; leitor de tela (NVDA) no fluxo principal |
| Contínuo | `eslint-plugin-jsx-a11y`, já incluído em `eslint-config-next` |

## Fora de escopo agora

Testes automatizados de a11y (`axe-core` + Playwright) — não há componente para testar. Devem ser adicionados quando os componentes existirem; registrado em [`tooling.md`](./tooling.md).
