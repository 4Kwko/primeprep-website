import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Configuração do Vitest.
 *
 * Sem ambiente de DOM de propósito. O que vale a pena testar aqui é lógica pura
 * (pontuação do diagnóstico, resolução de intenção, invariantes do conteúdo) e
 * contrato de marcação, e nada disso precisa de `jsdom`. Comportamento de
 * interface de verdade já é verificado onde ele existe de verdade: medindo o DOM
 * renderizado no navegador, que é o que pegou o `--container-full`, o trilho que
 * nunca grudou e a paralaxe amarrada ao container errado.
 *
 * `jsdom` traria três dependências para simular mal aquilo que a medição real já
 * faz bem. Quando algum teste precisar de DOM, ele entra com justificativa.
 */
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
