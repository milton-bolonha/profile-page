---
title: "Super Prompt Next.js Completo: do Zero ao Deploy"
publishDate: "2025-09-09T10:30:00Z"
author: "Assistente IA"
categories: ["Desenvolvimento", "Tutorial"]
tags: ["nextjs", "boilerplate", "markdown", "tailwind", "shadcn"]
featuredImage: "/images/posts/cover.jpg"
featuredPost: false
draft: false
excerpt: "Guia prático para usar o Super Prompt e gerar um sistema Next.js completo com blog e tema dinâmico."
readTime: "10 min"
---

## Visão Geral

Este tutorial mostra como usar o Super Prompt para gerar, do zero, um sistema Next.js completo: blog em Markdown, páginas estáticas, tema light/dark com `next-themes`, Tailwind v4 e UI moderna (shadcn). No final, você terá um boilerplate pronto para landing pages, blogs e sites corporativos.

## Pré-requisitos

- Node.js 18+ e npm
- Windows PowerShell (ou outro terminal)
- Acesso à internet

## Passo a passo

1. Criar projeto Next.js com Tailwind:

```bash
npx create-next-app@latest io-landing --javascript --eslint false --tailwind --no-src-dir --no-app --no-turbopack
```

2. Entrar na pasta e instalar dependências:

```bash
cd io-landing
npm install next-themes react-icons gray-matter remark remark-html date-fns @fontsource-variable/inter
```

3. Inicializar shadcn (CLI novo):

```bash
npx shadcn@latest init -y
```

4. Configurar tema e fontes:

- Em `pages/_app.js`: envolva com `ThemeProvider` e importe `@fontsource-variable/inter`.
- Em `styles/globals.css`: defina `font-family: 'Inter Variable', sans-serif;` em `body`.
- Em `pages/_document.js`: ajuste `<Html lang="pt-BR">`.
- Adicione estilos CSS para posts (h1-h6, p, ul, ol, code, blockquote, etc.) com suporte a dark mode.

5. Estrutura de conteúdo:

- `content/posts/*.md` (posts)
- `content/pages/*.md` (páginas estáticas)
- `content/settings/*.json` (configs do site/tema)

6. Libs:

- `lib/markdown.js` (parse Markdown)
- `lib/posts.js`, `lib/pages.js` (fonte de dados)
- `lib/settings.js` (leitura dos JSONs)
- `lib/utils.js` (datas e helpers)

7. Rotas principais:

- `/` (home com hero + posts)
- `/posts` e `/posts/[slug]`
- `/pages/[slug]`
- `/linktree` e `/playground`

8. Estilos CSS para posts:

Adicione no `styles/globals.css` estilos completos para tipografia:

```css
/* Estilos para posts e páginas */
.prose h1 {
  @apply text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 mt-8;
  line-height: 1.2;
}

.prose h2 {
  @apply text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-5 mt-7;
  line-height: 1.3;
}

.prose p {
  @apply text-gray-700 dark:text-gray-300 mb-4 leading-relaxed;
  line-height: 1.7;
}

.prose code {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono;
}

.prose blockquote {
  @apply border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-r;
}
```

## Super Prompt Completo

Aqui está o Super Prompt completo que você pode usar para gerar todo o sistema automaticamente:

# Super Prompt - Sistema Next.js Completo

## Comando de Inicialização

```bash
npx create-next-app@latest io-landing --javascript --eslint false --tailwind --no-src-dir --no-app --no-turbopack
```

## Dependências Necessárias

```bash
npm install next-themes react-icons gray-matter remark remark-html date-fns
npm install @fontsource-variable/inter
npm install react-icons --save
npx shadcn-ui@latest init
```

## Estrutura de Arquivos

```
/
├── components/
│   ├── ui/
│   │   ├── PageSection.js
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── TopRibbon.js
│   │   ├── PostCard.js
│   │   ├── PostTemplate.js
│   │   ├── PageTemplate.js
│   │   └── LinkTreeCard.js
│   └── layout/
│       └── Layout.js
├── containers/
│   ├── HeaderContainer.js
│   ├── FooterContainer.js
│   ├── PostsContainer.js
│   ├── PagesContainer.js
│   └── PlaygroundContainer.js
├── pages/
│   ├── index.js (homepage)
│   ├── sobre.js
│   ├── mentoria.js
│   ├── planos.js
│   ├── contato.js
│   ├── posts/
│   │   ├── index.js (lista de posts)
│   │   └── [slug].js (post individual)
│   ├── pages/
│   │   └── [slug].js (páginas estáticas)
│   ├── linktree.js
│   ├── playground.js
│   └── draft/
│       └── [slug].js (posts em modo rascunho)
├── content/
│   ├── posts/
│   │   ├── primeiro-post.md
│   │   ├── segundo-post.md
│   │   └── terceiro-post.md
│   ├── pages/
│   │   └── exemplo-pagina.md
│   └── settings/
│       ├── business.json
│       ├── general.json
│       ├── integrations.json
│       ├── linkTree.json
│       ├── logos.json
│       ├── mainMenu.json
│       ├── theme.json
│       └── version.json
├── lib/
│   ├── markdown.js
│   ├── posts.js
│   ├── pages.js
│   ├── settings.js
│   └── utils.js
├── styles/
│   └── globals.css
├── README.md
└── report.md
```

## Configuração de Fontes

### Remover fontes padrão do Next.js e configurar Inter Variable:

1. **No \_app.js**, adicionar:

```javascript
import "@fontsource-variable/inter";
```

2. **No globals.css**, adicionar:

```css
body {
  font-family: "Inter Variable", sans-serif;
}

/* Estilos para posts e páginas */
.prose {
  @apply max-w-none;
}

.prose h1 {
  @apply text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 mt-8;
  line-height: 1.2;
}

.prose h2 {
  @apply text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-5 mt-7;
  line-height: 1.3;
}

.prose h3 {
  @apply text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-6;
  line-height: 1.4;
}

.prose h4 {
  @apply text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-5;
  line-height: 1.4;
}

.prose h5 {
  @apply text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4;
  line-height: 1.5;
}

.prose h6 {
  @apply text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4;
  line-height: 1.5;
}

.prose p {
  @apply text-gray-700 dark:text-gray-300 mb-4 leading-relaxed;
  line-height: 1.7;
}

.prose strong {
  @apply font-semibold text-gray-900 dark:text-gray-100;
}

.prose em {
  @apply italic;
}

.prose ul {
  @apply mb-4 pl-6;
}

.prose ol {
  @apply mb-4 pl-6;
}

.prose li {
  @apply mb-2 text-gray-700 dark:text-gray-300 leading-relaxed;
  line-height: 1.6;
}

.prose ul li {
  @apply list-disc;
}

.prose ol li {
  @apply list-decimal;
}

.prose blockquote {
  @apply border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-r;
}

.prose code {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono;
}

.prose pre {
  @apply bg-gray-900 dark:bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4;
}

.prose pre code {
  @apply bg-transparent p-0 text-gray-100;
}

.prose a {
  @apply text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline;
}

.prose img {
  @apply rounded-lg shadow-sm mb-4;
}

.prose table {
  @apply w-full border-collapse mb-4;
}

.prose th {
  @apply border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-800 font-semibold text-left;
}

.prose td {
  @apply border border-gray-300 dark:border-gray-600 px-4 py-2;
}

.prose hr {
  @apply border-gray-300 dark:border-gray-600 my-8;
}
```

3. **Remover** quaisquer importações de fontes do Google Fonts que o Next.js cria por padrão

## Sistema de Configurações (content/settings/)

### Implementar sistema de configurações baseado em arquivos JSON:

### business.json

```json
{
  "brandName": "XXXXX",
  "brandDescription": "XXXX is here to deliver tips and tricks to live a better life.",
  "brandEmail": "general@xxxx.com",
  "brandKeywords": ["Modern Tips", "news", "boilerplate", "nextjs", "theme"],
  "brandPhone": "+1"
}
```

### general.json

```json
{
  "siteUrl": "https://site.com",
  "footerText": "Disclaimer: The content provided on this site is intended for general information purposes only and should not be considered a replacement for .... All materials, including text, graphics, images, and information, are subject to change without prior notice...",
  "postsToShow": 9,
  "homeCategory": "Health",
  "cookieConsent": false,
  "darkModeSwitcher": false,
  "feedbackEmail": "general@site.com",
  "publishedDate": "2024-01-01 23:44:00",
  "i18n": "en-us",
  "errorMessage": "Hmm... something is wrong, try again later or e-mail us: general@site.com"
}
```

### integrations.json

```json
{
  "cloudinaryIntegration": {
    "cloudApiKey": "00000000000",
    "cloudName": "dj00000",
    "folderName": "foderName"
  },
  "googleIntegration": {
    "adsClientID": "ca-pub-000000",
    "adsSlot": "000000000000",
    "gaID": "G-XXXXX",
    "adsAccount": "sites-xxxx"
  }
}
```

### linkTree.json

```json
{
  "linkTree": [
    {
      "href": "https://www.instagram.com/getmoderntips/",
      "label": "Instagram"
    },
    {
      "href": "https://web.facebook.com/mymoderntips",
      "label": "Facebook"
    }
  ]
}
```

### logos.json

```json
{
  "faviconLogo": "images/faviconLogo.png",
  "mainLogo": "images/mainLogo.png",
  "markLogo": "images/markLogo.png",
  "cardLogo": "images/cardLogo.png",
  "postAuthorLogo": "images/postAuthorLogo.png",
  "mainLogoWH": "183x50"
}
```

### mainMenu.json

```json
{
  "mainMenu": [
    {
      "label": "About Us",
      "href": "about-us"
    },
    {
      "label": "Advertising Disclosure",
      "href": "advertising-disclosure"
    },
    {
      "label": "Terms and Conditions",
      "href": "terms-and-conditions"
    },
    {
      "label": "Privacy Policy",
      "href": "privacy-policy"
    }
  ]
}
```

### theme.json

```json
{
  "postsSettings": {
    "postsToShow": 9,
    "postMaxW": "520",
    "leftColumn": true,
    "rightColumn": true,
    "bottomRow": true,
    "adsInsidePost": false,
    "postStyleVariation": "0"
  },
  "pagesSettings": {
    "pageBottomPadding": 30,
    "pageHeaderPadding": 22,
    "pageMaxW": "1100"
  },
  "header": {
    "logoAlign": "left",
    "headerHeight": 60,
    "bottomMainMenu": true,
    "headerMainMenu": "right",
    "headerMainMenuType": "category"
  },
  "themeColors": {
    "brand_color": "#3cb8ff",
    "ctaColor": "#3cb8ff",
    "background_color": "#ffffff",
    "darkBrandColor": "#3cb8ff",
    "secondaryColor": "#0c0f1e",
    "darkBackgroundColor": "#000"
  },
  "generalThemeSettings": {
    "themeStyle": "0"
  }
}
```

### version.json

```json
{
  "gitRepo": "mt",
  "nextVersion": "1.1.0",
  "message": "No updates.",
  "update": false,
  "gitEmail": "xxxxx@gmail.com",
  "beta": false,
  "version": "1.0.0",
  "gitUser": "xxxxxxx",
  "automaticUpdates": false,
  "customNextSource": ""
}
```

### lib/settings.js

Criar funções helper para ler essas configurações:

- `getBusinessSettings()`
- `getGeneralSettings()`
- `getIntegrations()`
- `getLinkTreeData()`
- `getLogos()`
- `getMainMenu()`
- `getThemeSettings()`
- `getVersionInfo()`

## 1. PageSection Component (Dumb)

### Props:

- `isBoxed`: boolean - aplica container limitado
- `bgImage`: string - URL da imagem de fundo
- `bgColor`: string - cor de fundo (Tailwind classes)
- `numColumns`: number (1-4) - número de colunas no grid
- `gap`: string - espaçamento entre elementos
- `maxWidth`: string - largura máxima da seção
- `hPadding`: string - padding horizontal
- `vPadding`: string - padding vertical
- `title`: string - título da seção
- `subtitle`: string - subtítulo da seção
- `ctaBtnText`: string - texto do botão principal
- `ctaBtnLink`: string - link do botão principal
- `ctaContrastBtnText`: string - texto do botão secundário
- `ctaContrastBtnLink`: string - link do botão secundário
- `ctaContrastBtnPosition`: "left" | "right" | "center"
- `children`: ReactNode - conteúdo da seção

### Regras:

- Grid responsivo mobile-first (1 col mobile, 2-4 cols desktop)
- Fallbacks para todos os props (valores padrão seguros)
- Suporte a tema light/dark
- Background image com overlay opcional
- Botões com hover states e animações

## 2. Header Component (Dumb + Container)

### Props:

- `logoImage`: string - URL da imagem do logo
- `logoText`: string - texto do logo (fallback se sem imagem)
- `logoFontStyle`: string - classes de estilo da fonte
- `logoAlign`: "left" | "center" (default: left)
- `showMainMenu`: boolean - exibe/oculta menu principal
- `headerHeight`: string - altura do header (50px-90px, default: 60px)
- `isTransparent`: boolean - header transparente
- `stickyHeader`: boolean - header fixo no scroll

### Regras:

- **Menu items**: Home, Quem Somos, Nossa Mentoria, Planos, Contato
- **CTAs fixos**:
  - Login (botão normal)
  - Ir Pra Loja (outline, borda + texto mesma cor)
- Menu colapsa em mobile com hamburger (react-icons)
- Suporte a scroll spy (destaca item ativo)
- Tema integrado via next-themes
- Container separado para lógica de estado

## 3. Footer Component (Dumb)

### Props:

- `logomark`: string - URL da imagem do logo
- `companyName`: string - nome da empresa
- `description`: string - parágrafo descritivo
- `copyright`: string - texto de copyright
- `socialLinks`: object - links das redes sociais
- `menuColumns`: array - colunas de menu do footer
- `showNewsletter`: boolean - exibe formulário de newsletter

### Regras:

- **Menu estrutura**: mesma do header, mas organizado em colunas
- **Social icons**: Facebook, Instagram, LinkedIn, GitHub, YouTube, Twitter
- Grid responsivo (4 cols desktop, 1-2 cols mobile)
- Links organizados por categorias (Empresa, Produtos, Suporte, Legal)

## 4. TopRibbon Component (Dumb)

### Props:

- `messages`: array de strings - mensagens rotativas
- `bgColor`: string - cor de fundo
- `textColor`: string - cor do texto
- `speed`: number - velocidade da animação
- `pauseOnHover`: boolean - pausa animação no hover
- `showCloseButton`: boolean - permite fechar a ribbon

### Regras:

- Animação marquee CSS (sem JavaScript adicional)
- Suporte a múltiplas mensagens rotativas
- Responsivo em todos os breakpoints
- Fallback para ribbon vazia (não renderiza)

## 5. Sistema de Tema (next-themes)

### Configuração:

- Provider no `_app.js`
- Suporte a light/dark/system
- Persistência no localStorage
- Transições suaves entre temas
- Classes CSS custom properties para cores dinâmicas

### Implementação:

- Toggle theme no header
- Cores adaptáveis em todos os componentes
- Ícones que mudam com o tema
- Imagens com versões para cada tema

## 6. Homepage (index.js)

### Seções obrigatórias:

- **Hero Section**: título, subtítulo, 2 CTAs principais
- **Featured Posts**: 3 posts em destaque (Featured Post: true)
- **About Preview**: prévia da seção "Quem Somos"
- **Services/Products**: prévia dos serviços/produtos
- **Testimonials**: depoimentos de clientes (conteúdo estático)
- **Recent Posts**: últimos 6 posts do blog

### Funcionalidades:

- Scroll suave entre seções
- Lazy loading de imagens
- Animações on-scroll (fade-in, slide-up)
- SEO otimizado com meta tags dinâmicas

## 7. Sistema de Posts (Markdown)

### Estrutura do arquivo .md:

```yaml
---
title: "Título do Post"
publishDate: "2025-01-15T10:30:00Z"
author: "Nome do Autor"
authorImage: "/images/authors/autor.jpg"
categories: ["Categoria1", "Categoria2"]
tags: ["tag1", "tag2", "tag3"]
featuredImage: "/images/posts/imagem-destaque.jpg"
featuredPost: true
draft: false
excerpt: "Breve descrição do post para SEO e previews"
readTime: "5 min"
seoTitle: "Título para SEO (opcional)"
seoDescription: "Descrição para SEO (opcional)"
---
Conteúdo do post em **Markdown**...
```

### Funcionalidades:

- **Lista de posts** (`/posts`): paginação, filtros, busca
- **Post individual** (`/posts/[slug]`): navegação prev/next, related posts
- **Posts em destaque**: carrossel na homepage
- **Categorias e tags**: páginas de arquivo automáticas
- **Modo rascunho**: `/draft/[slug]` para preview
- **RSS feed**: geração automática
- **Sitemap**: atualização automática
- **Breadcrumbs**: navegação hierárquica

## 8. Sistema de Páginas Estáticas

### Estrutura do arquivo .md:

```yaml
---
title: "Título da Página"
publishDate: "2025-01-15T10:30:00Z"
description: "Descrição da página"
seoTitle: "Título para SEO"
seoDescription: "Descrição para SEO"
showInMenu: true
menuOrder: 1
template: "default" # default, full-width, landing
---
Conteúdo da página em **Markdown**...
```

### Páginas obrigatórias:

- **Quem Somos** (`/sobre`): história, missão, equipe
- **Nossa Mentoria** (`/mentoria`): serviços, metodologia
- **Planos** (`/planos`): pricing table, comparação
- **Contato** (`/contato`): informações de contato (sem formulário)
- **Política de Privacidade** (`/pages/politica-privacidade`)
- **Termos de Uso** (`/pages/termos-uso`)

## 9. Página LinkTree (`/linktree`)

### Funcionalidades:

- **Profile section**: foto, nome, bio, localização
- **Links principais**: botões estilizados para redes sociais
- **Links secundários**: projetos, portfólio, contatos
- **Tema personalizável**: cores, fontes, background
- **Analytics**: contagem de cliques (opcional)
- **QR Code**: para compartilhamento fácil

### Props do LinkTreeCard:

- `title`: string - título do link
- `description`: string - descrição opcional
- `url`: string - URL de destino
- `icon`: string - ícone do react-icons
- `color`: string - cor do cartão
- `featured`: boolean - destaque visual

## 10. Templates de Post e Page

### PostTemplate.js:

- **Header**: título, autor, data, tempo de leitura, categorias
- **Featured image**: imagem em destaque responsiva
- **Content**: renderização do markdown com syntax highlighting
- **Footer**: tags, compartilhamento social, autor bio
- **Related posts**: posts relacionados por categoria/tag
- **Comments**: integração opcional (Disqus, etc.)

### PageTemplate.js:

- **Header simples**: título, breadcrumb
- **Content**: renderização do markdown
- **Sidebar opcional**: menu de navegação, CTAs
- **Footer**: informações de atualização

## 11. Playground/Builder (`/playground`)

### Funcionalidades:

- **Preview simples**: visualização das seções criadas
- **Props testing**: formulário básico para testar props dos componentes
- **Responsive preview**: teste mobile/desktop
- **Component showcase**: mostra todos os componentes disponíveis

### Seções disponíveis:

- PageSection (com todas as variações)
- Header (diferentes estilos)
- Footer (layouts variados)
- TopRibbon (mensagens customizadas)

## 12. Funcionalidades Extras

### SEO e Performance:

- **Meta tags dinâmicas**: título, descrição, OG tags
- **JSON-LD**: structured data para posts e páginas
- **Lazy loading**: componentes e imagens usando tag `<img>` padrão
- **IMPORTANTE**: NÃO usar next/image, utilizar tags `<img>` normais

### Acessibilidade:

- **ARIA labels**: em todos os componentes interativos
- **Keyboard navigation**: navegação por teclado
- **Focus management**: indicadores de foco visíveis
- **Screen reader**: compatibilidade básica
- **Color contrast**: conformidade WCAG 2.1

## 13. Configurações e Utilitários

### lib/markdown.js:

- Processamento de arquivos markdown
- Extração de frontmatter
- Renderização HTML com remark
- Syntax highlighting para código
- Plugin de imagens otimizadas

### lib/utils.js:

- Formatação de datas
- Geração de slugs
- Validação de dados
- Helpers de responsive
- Funções de SEO

### Configuração de Tema:

```js
// tailwind.config.js - configuração customizada
// globals.css - variáveis CSS para temas
// _app.js - provider de tema
```

## 14. Comandos de Desenvolvimento

### Scripts package.json:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "export": "next export"
}
```

### Variáveis de ambiente (.env.local):

```
NEXT_PUBLIC_SITE_URL=https://seudominio.com
CONTACT_EMAIL=contato@seudominio.com
```

## Criação de Conteúdo Inicial

### Criar 3 posts de exemplo em `content/posts/`:

**primeiro-post.md:**

```yaml
---
title: "Como Começar com Next.js: Guia Completo para Iniciantes"
publishDate: "2025-01-15T10:30:00Z"
author: "Equipe Desenvolvimento"
authorImage: "/images/authors/equipe.jpg"
categories: ["Desenvolvimento", "Tutorial"]
tags: ["nextjs", "react", "javascript", "tutorial"]
featuredImage: "/images/posts/nextjs-guide.jpg"
featuredPost: true
draft: false
excerpt: "Aprenda os fundamentos do Next.js e crie sua primeira aplicação moderna com este guia passo a passo."
readTime: "8 min"
---
Next.js é um framework React que revolucionou o desenvolvimento web moderno. Neste guia completo, você aprenderá desde os conceitos básicos até técnicas avançadas...
```

**segundo-post.md:**

```yaml
---
title: "10 Dicas de Produtividade para Desenvolvedores em 2025"
publishDate: "2025-01-12T14:15:00Z"
author: "João Silva"
categories: ["Produtividade", "Desenvolvimento"]
tags: ["produtividade", "tips", "desenvolvimento", "carreira"]
featuredImage: "/images/posts/productivity-tips.jpg"
featuredPost: true
draft: false
excerpt: "Descubra as melhores práticas e ferramentas que todo desenvolvedor deve conhecer para ser mais produtivo."
readTime: "6 min"
---
A produtividade é fundamental para qualquer desenvolvedor que quer se destacar no mercado. Aqui estão 10 dicas essenciais que podem transformar sua rotina...
```

**terceiro-post.md:**

```yaml
---
title: "Tendências de Design Web para 2025: O Que Esperar"
publishDate: "2025-01-10T09:00:00Z"
author: "Maria Santos"
categories: ["Design", "Tendências"]
tags: ["design", "ui", "ux", "trends", "2025"]
featuredImage: "/images/posts/design-trends.jpg"
featuredPost: false
draft: false
excerpt: "Explore as principais tendências de design que dominarão a web em 2025 e como aplicá-las em seus projetos."
readTime: "7 min"
---
O mundo do design web está em constante evolução. Em 2025, veremos tendências que combinam estética moderna com funcionalidade prática...
```

### Criar 1 página de exemplo em `content/pages/`:

**exemplo-pagina.md:**

```yaml
---
title: "Sobre Nossa Empresa"
publishDate: "2025-01-01T00:00:00Z"
description: "Conheça nossa história, missão e valores que nos guiam no desenvolvimento de soluções digitais inovadoras."
seoTitle: "Sobre Nós - Empresa de Desenvolvimento Web"
seoDescription: "Somos uma equipe especializada em criar soluções digitais modernas e eficientes. Conheça nossa história e nossos valores."
showInMenu: true
menuOrder: 1
template: "default"
---

## Nossa História

Fundada em 2020, nossa empresa nasceu da paixão por criar soluções digitais que fazem a diferença na vida das pessoas e no sucesso dos negócios.

## Nossa Missão

Desenvolver aplicações web modernas, acessíveis e de alta performance que impulsionem o crescimento dos nossos clientes.

## Nossos Valores

- **Inovação**: Sempre buscamos as melhores tecnologias e práticas do mercado
- **Qualidade**: Cada linha de código é pensada para oferecer a melhor experiência
- **Transparência**: Mantemos comunicação clara e honesta em todos os projetos
- **Colaboração**: Trabalhamos em parceria com nossos clientes para alcançar os melhores resultados
```

## Documentação e Relatórios

### README.md

Criar um arquivo README.md detalhado com:

- Descrição do projeto
- Como instalar e executar
- Estrutura de arquivos
- Como adicionar conteúdo (posts e páginas)
- Como configurar temas e cores
- Como usar os componentes
- Como fazer deploy
- Comandos úteis de desenvolvimento

### report.md

Criar um arquivo report.md para documentar:

- Funcionalidades implementadas
- Componentes criados
- Estrutura do projeto
- Decisões de design e arquitetura
- Performance e otimizações
- Possíveis melhorias futuras
- Bugs conhecidos ou limitações
- Instruções de manutenção

## Regras Gerais de Implementação

1. **Componentes sempre funcionais**: hooks, não classes
2. **Props com fallbacks**: valores padrão para evitar quebras
3. **SEM TypeScript**: apenas JavaScript puro com comentários JSDoc se necessário
4. **Performance first**: lazy loading, code splitting
5. **Mobile first**: design responsivo desde o início
6. **Acessibilidade**: WCAG 2.1 compliance
7. **SEO otimizado**: meta tags, structured data, sitemap
8. **Tema dinâmico**: next-themes em todos os componentes
9. **Código limpo**: comentários claros
10. **Documentação**: README.md e report.md detalhados
11. **Imagens**: usar tags `<img>` normais, NÃO next/image
12. **Fontes**: usar Inter Variable via @fontsource-variable/inter
13. **I18n**: implementar suporte a internacionalização pt-br/en
14. **Shadcn/ui**: usar componentes shadcn quando necessário

## Resultado Final

Um sistema Next.js completo, modular e escalável que serve como boilerplate para qualquer tipo de website corporativo, blog ou landing page, com foco em performance, acessibilidade e experiência do usuário.

````

## Resultado esperado

- Home com hero, posts em destaque e recentes
- Blog Markdown compilado estaticamente
- Tema light/dark persistido com `next-themes`
- UI responsiva com Tailwind v4 e componentes shadcn

## Rodando o projeto

```bash
npm run dev
# acesse: http://localhost:3000
````

## Dicas

- Se `3000` estiver em uso, o Next usará outra porta (ex.: `3001`).
- Imagens de exemplo nos posts são caminhos demonstrativos. Substitua por URLs reais ou adicione os arquivos em `public/images/...`.
