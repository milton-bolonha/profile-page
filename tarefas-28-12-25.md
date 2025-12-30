# Tarefas - 28/12/2025

## 📋 Visão Geral

Este documento contém o plano de implementação para as seguintes melhorias no site:

1. **Refatoração da Seção Experience/Showcase** - Tornar componente reutilizável com configuração flexível
2. **Navegador Flutuante** - Implementar navegador lateral direito com controle JSON
3. **Migração da Seção de Contatos** - Mover seção de contatos para antes do rodapé na index
4. **Correção do Scroll da Timeline** - Ajustar pontos de parada do scroll hijacking

---

## 1️⃣ Refatoração da Seção Experience/Showcase

### Objetivo
Transformar a seção "Experience/Showcase" (atualmente hardcoded em `index.tsx` linhas 169-313) em um componente reutilizável e configurável.

### Estrutura do Novo Componente

#### Arquivo: `src/components/Home/ExperienceShowcase.tsx`

**Props Interface:**
```typescript
interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  content: TabContent;
}

interface TabContent {
  type: 'slideshow' | 'game' | 'placeholder';
  // Para slideshow
  slides?: Array<{
    bg: string;
    fg: string;
  }>;
  paragraph?: string; // Novo parágrafo antes da imagem principal
  buttons?: Array<{
    text: string;
    link?: string;
    onClick?: () => void;
    variant: 'primary' | 'secondary';
    icon?: React.ComponentType<any>;
  }>;
  // Para game
  gameComponent?: React.ComponentType<any>;
  // Para placeholder
  placeholderIcon?: React.ComponentType<any>;
  placeholderTitle?: string;
  placeholderDescription?: string;
}

interface ExperienceShowcaseProps {
  badge?: string;
  title: string;
  description: string;
  tabs: Tab[];
  defaultTab?: string;
}
```

### Funcionalidades

- [x] **Configuração via Props**: Todas as abas, conteúdos, imagens, botões e ícones configuráveis
- [x] **Suporte a Children**: Componentes de jogo passados como `children` via prop `gameComponent`
- [x] **Parágrafo Adicional**: Campo `paragraph` para texto antes da imagem principal
- [x] **Botões Flexíveis**: Array de botões com texto, links, ícones e variantes customizáveis
- [x] **Controle de Estado do Jogo**: Prop `isGameActive` controlada externamente se necessário

### Implementação

#### Passo 1: Criar Componente Base
- [ ] Criar arquivo `src/components/Home/ExperienceShowcase.tsx`
- [ ] Implementar interface de props
- [ ] Migrar lógica de estado (activeTab, isGameActive, currentSlide, isPageVisible)
- [ ] Migrar lógica de slideshow com useEffect

#### Passo 2: Componentizar Conteúdo das Abas
- [ ] Criar subcomponente `SlideshowContent` para tipo 'slideshow'
- [ ] Criar subcomponente `GameContent` para tipo 'game'
- [ ] Criar subcomponente `PlaceholderContent` para tipo 'placeholder'
- [ ] Adicionar renderização condicional do parágrafo antes da imagem

#### Passo 3: Refatorar Botões
- [ ] Criar componente `ActionButton` reutilizável
- [ ] Implementar variantes (primary/secondary)
- [ ] Suportar ícones dinâmicos
- [ ] Integrar com `MagneticButton`

#### Passo 4: Integrar na Index
- [ ] Importar novo componente em `src/pages/index.tsx`
- [ ] Criar configuração de dados para as abas
- [ ] Substituir código hardcoded (linhas 169-313) pela chamada do componente
- [ ] Passar `NeonFlightGame` como children/gameComponent

#### Passo 5: Criar Segunda Instância de Teste
- [ ] Logo abaixo da primeira instância, adicionar segunda chamada do componente
- [ ] Usar valores diferentes (título, descrição, imagens, botões)
- [ ] Validar que ambas as instâncias funcionam independentemente

---

## 2️⃣ Navegador Flutuante Lateral

### Objetivo
Implementar um navegador flutuante fixo no lado direito do site, controlado por arquivo JSON.

### Estrutura

#### Arquivo de Configuração: `public/content/navegador.json`

```json
{
  "enabled": true,
  "position": "right",
  "items": [
    {
      "id": "inicio",
      "label": "Início",
      "icon": "home",
      "href": "#inicio"
    },
    {
      "id": "sobre",
      "label": "Sobre",
      "icon": "user",
      "href": "#sobre"
    },
    {
      "id": "projetos",
      "label": "Projetos",
      "icon": "briefcase",
      "href": "#projetos"
    },
    {
      "id": "contato",
      "label": "Contato",
      "icon": "mail",
      "href": "#contato"
    }
  ],
  "style": {
    "backgroundColor": "rgba(0, 0, 0, 0.7)",
    "activeColor": "#ffffff",
    "inactiveColor": "rgba(255, 255, 255, 0.5)"
  }
}
```

#### Componente: `src/components/commons/FloatingNavigator.tsx`

**Funcionalidades:**
- [x] Posição fixa no lado direito
- [x] Scroll spy para detectar seção ativa
- [x] Smooth scroll ao clicar
- [x] Ícones dinâmicos baseados no JSON
- [x] Estilos configuráveis
- [x] Responsivo (ocultar em mobile se necessário)

### Implementação

#### Passo 1: Criar Estrutura de Diretórios
- [ ] Criar diretório `public/content/` se não existir
- [ ] Criar arquivo `public/content/navegador.json` com configuração inicial

#### Passo 2: Criar Componente
- [ ] Criar `src/components/commons/FloatingNavigator.tsx`
- [ ] Implementar interface TypeScript para o JSON
- [ ] Criar hook `useNavigatorConfig` para carregar JSON
- [ ] Implementar scroll spy com IntersectionObserver
- [ ] Adicionar smooth scroll behavior

#### Passo 3: Mapear Ícones
- [ ] Criar mapeamento de strings para componentes de ícones (react-icons)
- [ ] Suportar ícones: home, user, briefcase, code, mail, etc.

#### Passo 4: Estilização
- [ ] Implementar estilos com Tailwind
- [ ] Adicionar backdrop blur e glassmorphism
- [ ] Implementar hover effects
- [ ] Adicionar indicador de seção ativa

#### Passo 5: Integração
- [ ] Importar em `src/pages/index.tsx`
- [ ] Adicionar antes do fechamento do `ScrollContainer`
- [ ] Testar navegação e scroll spy

---

## 3️⃣ Migração da Seção de Contatos

### Objetivo
Transportar toda a seção de contatos da página `/contatos` para antes do rodapé na página inicial (`index.tsx`).

### Análise Atual

**Página de Contatos (`src/pages/contatos.tsx`):**
- Linhas 61-130: Seção completa de contatos
- Inclui: lista de contatos, formulário de envio
- Usa componente `CopyButton`

**Página Index (`src/pages/index.tsx`):**
- Linha 351-353: Seção CTA atual (antes do rodapé)
- Rodapé vem após esta seção

### Implementação

#### Passo 1: Criar Componente de Contatos
- [ ] Criar `src/components/Home/ContactSection.tsx`
- [ ] Extrair código das linhas 61-130 de `contatos.tsx`
- [ ] Adaptar para receber props de configuração
- [ ] Manter funcionalidade do formulário (API Netlify)

#### Passo 2: Criar Interface de Props
```typescript
interface Contact {
  name: string;
  link: string;
  isMail?: boolean;
}

interface ContactSectionProps {
  contacts: Contact[];
  title?: string;
  formTitle?: string;
}
```

#### Passo 3: Integrar na Index
- [ ] Importar `ContactSection` em `index.tsx`
- [ ] Adicionar nova seção antes da linha 351 (antes do CTA)
- [ ] Passar dados de contatos via props
- [ ] Ajustar espaçamento e padding

#### Passo 4: Atualizar Dados
- [ ] Verificar se dados de contatos estão em `home.json` ou criar novo arquivo
- [ ] Atualizar links (atualmente apontam para Guilherme Cirelli, devem apontar para Milton Bolonha)

#### Passo 5: Manter Página de Contatos
- [ ] Decidir se mantém página `/contatos` separada ou redireciona para `/#contato`
- [ ] Se mantiver, usar o mesmo componente `ContactSection`

---

## 4️⃣ Correção do Scroll da Timeline

### Objetivo
Ajustar os pontos de parada do scroll hijacking na seção `NewTimelineSection` para melhor UX.

### Problema Atual

**Scroll Down:**
- Para em posição aleatória/estranha
- Precisa encontrar elemento mais abaixo como limite

**Scroll Up:**
- Precisa parar no ano ou acima da barra de anos
- Comportamento inconsistente

### Análise do Código Atual

**Arquivo:** `src/components/Home/NewTimelineSection.tsx`

**IntersectionObserver (linhas 134-145):**
- Observa `yearNavRef` (linha 226)
- Threshold: `[0.5, 0.6, 0.7, 0.8]`
- Ativa scroll lock quando `intersectionRatio > 0.7`

**Problema Identificado:**
- O observer está correto ao observar `yearNavRef`
- Mas o threshold pode não estar ideal para ambas as direções

### Solução Proposta

#### Estratégia para Scroll Down:
1. Encontrar elemento mais abaixo na seção (ex: conteúdo detalhado ou ícone)
2. Usar esse elemento como limite inferior
3. Ajustar threshold para ativar quando esse elemento estiver visível

#### Estratégia para Scroll Up:
1. Garantir que para acima da barra de anos
2. Usar elemento do header da seção como limite superior
3. Desativar scroll lock quando sair da área

### Implementação

#### Passo 1: Investigação
- [ ] Adicionar logs para debug do IntersectionObserver
- [ ] Testar scroll down e identificar posição atual de parada
- [ ] Testar scroll up e identificar posição atual de parada
- [ ] Documentar comportamento atual vs. esperado

#### Passo 2: Ajustar Scroll Down
- [ ] Identificar elemento mais abaixo (sugestão: div do ícone, linha 294)
- [ ] Criar ref adicional para esse elemento
- [ ] Ajustar lógica do observer para considerar ambos os refs
- [ ] Testar e validar nova posição de parada

#### Passo 3: Ajustar Scroll Up
- [ ] Garantir que para no header ou acima da barra de anos
- [ ] Ajustar threshold ou adicionar observer separado
- [ ] Implementar lógica para desativar lock ao sair da seção
- [ ] Testar transição suave para seção anterior

#### Passo 4: Refinar Thresholds
- [ ] Experimentar com diferentes valores de threshold
- [ ] Considerar usar dois observers diferentes (um para cada direção)
- [ ] Adicionar debounce se necessário para evitar flickering

#### Passo 5: Validação Final
- [ ] Testar scroll down múltiplas vezes
- [ ] Testar scroll up múltiplas vezes
- [ ] Testar transições entre seções
- [ ] Validar em diferentes tamanhos de tela

---

## 📝 Ordem de Implementação Sugerida

1. **Navegador Flutuante** (mais simples, independente)
2. **Migração de Contatos** (impacto visual imediato)
3. **Refatoração Experience/Showcase** (mais complexo, mas fundamental)
4. **Correção Scroll Timeline** (requer testes iterativos)

---

## ✅ Checklist Geral

### Navegador Flutuante
- [ ] Criar estrutura de diretórios e JSON
- [ ] Implementar componente FloatingNavigator
- [ ] Integrar scroll spy
- [ ] Estilizar e testar responsividade
- [ ] Integrar na index

### Migração de Contatos
- [ ] Criar componente ContactSection
- [ ] Extrair lógica de contatos.tsx
- [ ] Integrar na index antes do rodapé
- [ ] Atualizar dados de contatos
- [ ] Testar formulário

### Refatoração Experience/Showcase
- [ ] Criar componente ExperienceShowcase
- [ ] Implementar props e interfaces
- [ ] Componentizar conteúdos (slideshow, game, placeholder)
- [ ] Refatorar sistema de botões
- [ ] Integrar na index
- [ ] Criar segunda instância de teste

### Correção Scroll Timeline
- [ ] Investigar comportamento atual
- [ ] Ajustar scroll down (elemento limite inferior)
- [ ] Ajustar scroll up (parar acima da barra)
- [ ] Refinar thresholds
- [ ] Validar em múltiplos cenários

---

## 🎯 Critérios de Sucesso

### Experience/Showcase
- ✅ Componente totalmente reutilizável
- ✅ Duas instâncias funcionando independentemente
- ✅ Parágrafo antes da imagem implementado
- ✅ Botões totalmente configuráveis
- ✅ Jogo integrado via children/props

### Navegador Flutuante
- ✅ Navegador visível e fixo no lado direito
- ✅ Scroll spy funcionando corretamente
- ✅ Configuração via JSON funcionando
- ✅ Smooth scroll ao clicar
- ✅ Responsivo (oculto em mobile)

### Migração de Contatos
- ✅ Seção de contatos visível antes do rodapé na index
- ✅ Formulário funcionando corretamente
- ✅ Links atualizados para Milton Bolonha
- ✅ Estilos consistentes com o resto do site

### Correção Scroll Timeline
- ✅ Scroll down para em posição consistente e visualmente agradável
- ✅ Scroll up para acima da barra de anos
- ✅ Transições suaves entre seções
- ✅ Sem flickering ou comportamento errático

---

## 📚 Referências

### Arquivos Principais
- `src/pages/index.tsx` - Página principal
- `src/pages/contatos.tsx` - Página de contatos
- `src/components/Home/NewTimelineSection.tsx` - Seção de timeline
- `src/components/ui/MagneticButton.tsx` - Botão magnético
- `src/components/commons/CopyButton.tsx` - Botão de copiar

### Dependências
- `framer-motion` - Animações
- `react-icons` - Ícones
- `lucide-react` - Ícones adicionais

### Padrões de Código
- TypeScript strict mode
- Tailwind CSS para estilos
- Componentes funcionais com hooks
- Props interfaces bem definidas
