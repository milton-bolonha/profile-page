# Relatório do Projeto

- Implementações principais: blog em Markdown, páginas estáticas, tema light/dark, componentes UI (Header, Footer, TopRibbon, PageSection, PostCard, PostTemplate, PageTemplate, LinkTreeCard) e containers.
- Estrutura de conteúdo: `content/posts`, `content/pages`, `content/settings` com JSONs de configuração.
- Libs: `lib/markdown`, `lib/posts`, `lib/pages`, `lib/settings`, `lib/utils`.
- Decisões: usar `<img>` em vez de `next/image`; Inter Variable local; shadcn v4 compatível com Tailwind 4.
- Performance: lazy loading de imagens via `loading="lazy"`; construção estática; CSS utilitário.
- Melhorias futuras: RSS, sitemap, categorias/tags dinâmicas, busca e paginação avançadas, breadcrumbs e JSON-LD.
- Limitações: sem formulário de contato, sem comentários integrados.
- Manutenção: adicionar novos `.md` e rodar `next build`/`next start`.
