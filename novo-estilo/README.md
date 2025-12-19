Projeto Next.js completo com blog (Markdown), páginas estáticas e tema dinâmico.

## Instalação

1. Node 18+ instalado
2. Instale dependências:

```bash
npm install
```

3. Rodar em desenvolvimento:

```bash
npm run dev
```

## Estrutura

- `content/` posts, páginas e configurações JSON
- `components/` UI e layout
- `containers/` componentes com estado
- `lib/` markdown e utilitários
- `pages/` rotas Next.js

## Conteúdo

- Adicione posts em `content/posts/*.md`
- Adicione páginas em `content/pages/*.md`
- Ajuste configs em `content/settings/*.json`

## Tema e fontes

- Inter Variable via `@fontsource-variable/inter`
- `next-themes` para light/dark/system

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "export": "next export"
}
```

## Deploy

- Compatível com Vercel/Netlify/etc.
