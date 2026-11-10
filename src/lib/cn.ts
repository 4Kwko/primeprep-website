/**
 * Concatenação condicional de classes.
 * Deliberadamente sem `clsx`/`tailwind-merge`: o design system evita utilitários
 * conflitantes por construção (tokens semânticos + poucos utilitários de
 * assinatura), então não há necessidade de resolver colisões em runtime.
 * Se a Fase 3 provar o contrário, trocar por tailwind-merge e documentar.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
