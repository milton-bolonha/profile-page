# 🎮 Stranger Craft

Um clone de Minecraft inspirado em Stranger Things, desenvolvido com Three.js e Rapier Physics. Explore dois mundos paralelos, construa estruturas incríveis e sobreviva a criaturas hostis!

## ✨ Features Principais

### 🌍 Sistema de Mundo
- **Geração Procedural Infinita**: Mundo gerado com ruído Perlin em tempo real
- **Chunks Otimizados**: Sistema de chunks 16x64x16 com renderização por distância
- **Dois Biomas Completos**:
  - **Mundo Normal**: Grama, árvores, água cristalina e cidades procedurais
  - **Mundo Invertido**: Dimensão sombria com criaturas hostis e ambiente corrupto
- **Cavernas Naturais**: Sistema de cavernas geradas proceduralmente
- **Física de Blocos**: Areia e blocos com gravidade caem naturalmente

### 🏗️ Sistema de Construção
- **20 Tipos de Blocos Diferentes**:
  - Naturais: Grama, Terra, Pedra, Areia, Água
  - Madeira: Tronco, Tábuas, Folhas
  - Cidade: Concreto, Asfalto, Tijolos, Escritório, Lâmpada
  - Especiais: Bedrock, Obsidiana
  - Corrompidos: Versões do Mundo Invertido
  
- **Modo Arquiteto (Blueprints)**:
  - 🏠 Casa Simples (5x5x5)
  - 🏰 Torre de Vigia (3x12x3)
  - 🧱 Muralha Defensiva (5x4x1)
  - ⛲ Fonte Decorativa (5x3x5)
  - Construção instantânea com preview em wireframe
  - Detecção de colisão com player

### 🏙️ Cidades Procedurais
- **Geração Automática**: Cidades aparecem em grids de 32x32 chunks
- **Arquitetura Variada**:
  - Centro: Arranha-céus de 15-40 blocos de altura
  - Residencial: Casas de 4-10 blocos
  - Industrial: Estruturas de obsidiana
- **Infraestrutura Completa**:
  - Ruas de asfalto com marcações
  - Iluminação pública com lâmpadas
  - Edifícios ocos com múltiplos andares
  - Portas e janelas

###  NPCs e Entidades
- **Builder (Construtor)**:
  - Constrói vilas automaticamente
  - 3 tipos de casas (simples, alta, grande)
  - Foge de cidades
  - Interação com tecla F
  - Navegação inteligente com pathfinding

- **Inimigos (Mundo Invertido)**:
  - **Zombie**: Persegue o player, pula obstáculos
  - **Mutant Zombie**: 1.5x maior, mais rápido, pulos gigantes
  - Sistema de spawn dinâmico
  - Dano progressivo por proximidade

### 🎮 Mecânicas de Gameplay
- **Sistema de Sobrevivência**:
  - ❤️ Vida (100 HP)
  - 💨 Estamina (corrida e pulo)
  - 🫁 Oxigênio (debaixo d'água)
  - Dano por queda
  - Regeneração automática

- **Movimento Avançado**:
  - Corrida (Shift)
  - Pulo com física realista
  - Natação
  - Colisão precisa com Rapier Physics

- **Ciclo Dia/Noite**:
  - 10 minutos por ciclo completo
  - Iluminação dinâmica
  - Névoa atmosférica
  - Relógio em tempo real

### 🎨 Gráficos e Renderização
- **Texturas Procedurais**: Atlas de texturas 4x5 gerado em canvas
- **Ambient Occlusion**: Sombreamento realista entre blocos
- **Otimizações**:
  - Culling de faces ocultas
  - Renderização por distância (4 chunks)
  - Física limitada (2 chunks)
  - Geometria instanciada
- **Efeitos Visuais**:
  - Partículas atmosféricas no Mundo Invertido
  - Relâmpagos aleatórios
  - Transições suaves de cor do céu
  - Overlay de dano

### 🎯 Interface
- **HUD Completo**:
  - Crosshair centralizado
  - Hotbar com 9 slots
  - Barras de status (vida, estamina, oxigênio)
  - Indicador de tempo
  - Radar de civilização
  - Info de bloco/projeto selecionado

- **Modos de Interação**:
  - Modo Blocos (padrão)
  - Modo Projetos (tecla G)
  - Seleção visual com preview

## 🎮 Controles

### Movimento
- **W/A/S/D**: Mover
- **Shift**: Correr (consome estamina)
- **Espaço**: Pular
- **Mouse**: Olhar ao redor

### Construção
- **Clique Esquerdo**: Quebrar bloco / Construir projeto
- **Clique Direito**: Colocar bloco
- **1-9**: Selecionar bloco/projeto
- **G**: Alternar entre Modo Blocos e Modo Projetos

### Interação
- **F**: Interagir com NPCs
- **ESC**: Liberar mouse

### Especial
- **Cair no Void**: Troca de dimensão (Normal ↔ Invertido)

## 📊 Capacidades Técnicas

### Limites do Sistema
- **Chunks Ativos**: ~80 chunks simultâneos (RENDER_DISTANCE = 4)
- **Blocos por Chunk**: 16,384 blocos (16×64×16)
- **Total de Blocos Renderizados**: ~1,310,720 blocos
- **Blocos com Física**: ~327,680 blocos (PHYSICS_DISTANCE = 2)
- **Entidades Simultâneas**: Até 10 (com despawn automático)
- **Distância de Renderização**: 64 blocos
- **Altura Máxima**: 64 blocos
- **Profundidade Mínima**: Ilimitada (troca de dimensão)

### Performance
- **FPS Target**: 60 FPS
- **Otimizações**:
  - Greedy meshing para reduzir geometria
  - Frustum culling automático (Three.js)
  - Batch de chunks por frame (máx 4)
  - Despawn de entidades distantes (70 blocos)
  - Física limitada por distância

### Geração de Mundo
- **Seed Aleatória**: Cada sessão gera um mundo único
- **Biomas**: 2 dimensões completas
- **Cidades**: ~3% de chance por grid 32×32
- **Árvores**: 2% (Normal) / 1.5% (Invertido)
- **Cavernas**: Threshold de 0.35-0.45

## 🏗️ Arquitetura do Código

### Estrutura de Pastas
```
stranger-craft/
├── index.html          # HTML principal (~300 linhas)
├── config/             # Configurações JSON
│   ├── blocks.json     # Definições de blocos
│   ├── blueprints.json # Metadados de projetos
│   ├── biomes.json     # Configurações de biomas
│   └── game.json       # Constantes do jogo
└── lib/                # Módulos JavaScript
    ├── utils.js        # Utilitários e texturas
    ├── noise.js        # Ruído Perlin
    ├── terrain.js      # Geração de terreno
    ├── entities.js     # NPCs e inimigos
    ├── physics.js      # Inicialização Rapier
    ├── rendering.js    # Renderização de chunks
    ├── ui.js           # Interface do usuário
    └── blueprints.js   # Sistema de construção
```

### Tecnologias
- **Three.js 0.160.0**: Renderização 3D
- **Rapier3D 0.11.2**: Motor de física
- **Vanilla JavaScript**: ES6 Modules
- **HTML5 Canvas**: Geração de texturas

## 🚀 Como Executar

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd stranger-craft
```

2. **Inicie um servidor local**
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

3. **Abra no navegador**
```
http://localhost:8000
```

> ⚠️ **Importante**: O jogo precisa ser executado em um servidor HTTP devido aos ES6 modules. Não funciona abrindo o arquivo diretamente.

## 🎯 Roadmap Futuro

- [ ] Sistema de inventário
- [ ] Crafting de itens
- [ ] Mais tipos de inimigos
- [ ] Multiplayer
- [ ] Salvamento de mundo
- [ ] Mais biomas
- [ ] Sistema de quests
- [ ] Música e sons

## 📝 Notas de Desenvolvimento

Este é um **MVP (Minimum Viable Product)** funcional e estável. O código foi refatorado para:
- Melhor organização e manutenibilidade
- Separação de responsabilidades
- Configurações externalizadas em JSON
- Módulos reutilizáveis

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar!

## 🙏 Créditos

Desenvolvido com ❤️ inspirado em Minecraft e Stranger Things.

---

**Divirta-se explorando e construindo! 🎮✨**
