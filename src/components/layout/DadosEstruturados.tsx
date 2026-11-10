import { grafo, type NoJsonLd } from "@/lib/schema";

/**
 * Injeta um grafo JSON-LD no documento.
 *
 * Server component: o buscador precisa do dado no HTML servido, não depois da
 * hidratação. `type="application/ld+json"` faz o navegador ignorar o conteúdo,
 * então isto não executa nada e não custa nada em tempo de renderização.
 *
 * O `JSON.stringify` de `grafo()` já escapa o conteúdo; o `</script>` continua
 * sendo o único risco real, e ele não aparece em nome de escola nem de cidade.
 * Ainda assim a substituição abaixo fecha essa porta, porque o dado passa a vir
 * de `concursos.ts` e nada garante o que entra ali daqui a um ano.
 */
export function DadosEstruturados({ nos }: { nos: NoJsonLd[] }) {
  const json = grafo(...nos).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // O conteúdo é gerado aqui, a partir de módulos do próprio projeto, e já
      // vem escapado. Não há entrada de usuário em nenhum ponto do caminho.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
