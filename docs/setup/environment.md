# Variáveis de Ambiente

Arquivo de referência: [`.env.example`](../../.env.example) (versionado, sem valores).
Arquivo real: `.env.local` — **não versionado**, não existe ainda.

## Variáveis

### `NEXT_PUBLIC_SITE_URL`
URL canônica pública. Alimenta `metadataBase`, `sitemap.xml` e `robots.txt`.

- **Formato**: origem completa sem barra final (`https://exemplo.com.br`).
- **Dev**: pode ficar vazia — o fallback é `http://localhost:3000`.
- **Produção**: obrigatória. Sem ela, canonical e Open Graph apontam para localhost.
- **Status**: pendente — depende do domínio (pendência E-20 em `open-questions.md`).

### `NEXT_PUBLIC_ALLOW_INDEXING`
Interruptor de indexação. **Só o valor exato `true` libera.**

- Vazia ou qualquer outro valor: `robots.txt` emite `Disallow: /` e a metadata marca `noindex`.
- **Padrão deliberado: bloqueado.** Liberar é ação consciente no deploy — um site em construção indexado é dano difícil de reverter.

> **Não existe variável de formulário.** A conversão acontece exclusivamente por
> WhatsApp e pela DM do Instagram (decisão do cliente no `init`). Sem backend,
> sem armazenamento de dados pessoais, sem LGPD de formulário.

### `NEXT_PUBLIC_ANALYTICS_ID` *(reservada)*
**Não configurar sem decisão explícita do cliente.** O briefing veta analytics real nesta fase. Envolve LGPD e provavelmente banner de consentimento.

## Regras

1. `NEXT_PUBLIC_` **expõe a variável ao browser**. Nunca usar esse prefixo para chave de API, token ou segredo.
2. Nenhum valor real entra em `.env.example` — só a chave e o comentário.
3. `.env*` está no `.gitignore`, com exceção explícita `!.env.example`.
4. Variável nova é documentada aqui **e** em `.env.example`, na mesma mudança.
5. Credenciais não são inventadas nem geradas. Vêm do cliente ou do provedor.

## Configuração local

```bash
cp .env.example .env.local
```

Para desenvolvimento, os dois valores podem ficar vazios — os padrões seguros já funcionam.
