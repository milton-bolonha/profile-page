# 📋 Documentação Técnica Completa

## Minecraft Clone - Modo Arquiteto (Otimizado)

---

## 🎮 Informações do Projeto

**Nome:** Minecraft Clone - Modo Arquiteto  
**Tipo:** Jogo de Sobrevivência e Construção 3D  
**Plataforma:** Web Browser (HTML5)  
**Linguagem:** JavaScript (ES6+)  
**Versão:** Otimizada com Web Workers

---

## 🛠️ Stack Tecnológico

### Bibliotecas Principais

- **Three.js v0.160.0** - Motor gráfico 3D
- **Rapier3D v0.11.2** - Motor de física realista
- **PointerLockControls** - Controle de câmera FPS

### Tecnologias Web

- **Web Workers** - Processamento paralelo para geração de terreno
- **Canvas API** - Geração procedural de texturas
- **RequestAnimationFrame** - Loop de renderização otimizado
- **ES6 Modules** - Importação modular

### Padrões de Design

- **Programação Orientada a Objetos** - Sistema de entidades
- **Factory Pattern** - Geração de chunks e blueprints
- **Observer Pattern** - Sistema de eventos do DOM

---

## 📊 Estatísticas do Código

### Inventário Geral

- **Total de Funções:** ~55 funções principais
- **Classes:** 7 (Entity, Zombie, MutantZombie, Builder, Skeleton, Loot, Projectile)
- **Constantes Globais:** 40+
- **Event Listeners:** 10
- **Web Workers:** 1 (geração de terreno)
- **Módulos:** 11 arquivos JavaScript
- **Configurações:** 5 arquivos JSON

### Distribuição por Categoria

| Categoria            | Quantidade | Percentual |
| -------------------- | ---------- | ---------- |
| Geração de Mundo     | 8          | 15%        |
| Renderização         | 7          | 13%        |
| Física e Colisão     | 6          | 11%        |
| Sistema de Entidades | 15         | 27%        |
| Interface do Usuário | 8          | 15%        |
| Interação do Jogador | 11         | 19%        |

### Novos Recursos (v2.0)

- **Sistema de Save/Load**: Persistência de modificações do mundo
- **Inimigo Skeleton**: IA de distanciamento com ataques à distância
- **Sistema de Loot**: Recompensas ao derrotar inimigos
- **3 Novos Blueprints**: Ponte, Piscina, Bunker
- **Refatoração**: CSS externo, dados inline em JSON

### Distribuição por Categoria

| Categoria            | Quantidade | Percentual |
| -------------------- | ---------- | ---------- |
| Geração de Mundo     | 8          | 18%        |
| Renderização         | 6          | 13%        |
| Física e Colisão     | 5          | 11%        |
| Sistema de Entidades | 10         | 22%        |
| Interface do Usuário | 7          | 16%        |
| Interação do Jogador | 9          | 20%        |

---

## 📑 Table of Contents

### 1. [Configurações e Constantes](#configurações)

### 2. [Sistema de Geração de Terreno](#geração-terreno)

### 3. [Sistema de Física](#física)

### 4. [Sistema de Entidades](#entidades)

### 5. [Sistema de Renderização](#renderização)

### 6. [Sistema de Blueprints](#blueprints)

### 7. [Interação do Jogador](#jogador)

### 8. [Interface do Usuário](#ui)

### 9. [Ambiente e Iluminação](#ambiente)

---

## <a id="configurações"></a>1. 🎛️ Configurações e Constantes

### Constantes de Mundo

```javascript
CHUNK_SIZE = 16; // Tamanho do chunk (16x16 blocos)
CHUNK_HEIGHT = 64; // Altura máxima do mundo
RENDER_DISTANCE = 4; // Distância de renderização em chunks
PHYSICS_DISTANCE = 2; // Distância para física ativa
WATER_LEVEL = 7; // Nível do mar
```

### Tipos de Blocos (19 tipos)

**BLOCKS:** Enumeração com IDs de blocos

- Básicos: AIR, GRASS, DIRT, STONE, SAND
- Madeira: LOG, LEAVES, PLANKS
- Líquidos: WATER, CORRUPTED_WATER
- Especiais: BEDROCK, OFFICE, OBSIDIAN, CONCRETE, ASPHALT, BRICKS, LAMP

**BLOCK_PROPS:** Array com propriedades de cada bloco

- `name`: Nome do bloco
- `color`: Cor base (hex)
- `solid`: Se é sólido (true/false)
- `transparent`: Se é transparente
- `fluid`: Se é líquido
- `gravity`: Se sofre gravidade

---

## <a id="geração-terreno"></a>2. 🌍 Sistema de Geração de Terreno

### Funções de Ruído (3 funções)

#### `getLayeredNoise(x, z, octaves, persistence, scale)`

- **Propósito:** Gera ruído Perlin em camadas (octaves)
- **Parâmetros:**
  - `x, z`: Coordenadas do mundo
  - `octaves`: Número de camadas de detalhe
  - `persistence`: Fator de amplitude entre octaves
  - `scale`: Escala do ruído
- **Retorno:** Valor de ruído normalizado (-1 a 1)

#### `getTerrainHeight(gx, gz, dimension)`

- **Propósito:** Calcula altura do terreno em uma posição
- **Parâmetros:**
  - `gx, gz`: Coordenadas globais
  - `dimension`: 'NORMAL' ou 'UPSIDE_DOWN'
- **Retorno:** Objeto `{height, biome}`
- **Características:**
  - Aplica curva de potência para perfis diferentes
  - Normal: `n^2.0` (mais plano)
  - Invertido: `n^1.5` (mais acidentado)

#### `getCaveDensity(x, y, z)`

- **Propósito:** Determina densidade de cavernas
- **Parâmetros:** Coordenadas 3D
- **Retorno:** Valor de densidade
- **Threshold:** >0.35 (normal), >0.45 (invertido) = caverna

### Sistema de Cidades (1 função)

#### `getCityInfo(cx, cz)`

- **Propósito:** Determina se existe cidade em chunk
- **Algoritmo:**
  - Grade de 32x32 chunks
  - Semente pseudo-aleatória por célula
  - 30% de chance de cidade por célula
- **Retorno:** `{exists, worldX, worldZ, radius}`
- **Raio de Cidade:** 120 blocos

### Web Worker (1 worker)

#### `generationWorker`

- **Execução:** Thread paralela
- **Entrada:** `{cx, cz, dimension}`
- **Saída:** `{cx, cz, data[16][64][16]}`
- **Processamento:**
  1. Gera terreno base com ruído
  2. Aplica cavernas
  3. Gera estruturas de cidade
  4. Coloca árvores (2% normal, 1.5% invertido)

---

## <a id="física"></a>3. ⚛️ Sistema de Física

### Inicialização (1 função)

#### `initPhysics()`

- **Propósito:** Inicializa motor Rapier
- **Ações:**
  - Cria mundo com gravidade -80.0
  - Cria corpo do jogador (cápsula)
  - Define propriedades de colisão
  - Spawna entidade Builder inicial
  - Inicia loop de animação

**Propriedades do Jogador:**

- **Forma:** Cápsula (raio 0.35, altura 1.0)
- **CCD:** Continuous Collision Detection ativado
- **Rotação:** Travada
- **Damping:** Linear 5.0, Angular 1.0

### Funções de Colisão (3 funções)

#### `getBlock(x, y, z)`

- **Propósito:** Obtém tipo de bloco nas coordenadas
- **Processo:**
  1. Converte para coordenadas de chunk
  2. Verifica se chunk está carregado
  3. Retorna ID do bloco ou AIR

#### `isSolid(x, y, z)`

- **Propósito:** Verifica se bloco é sólido
- **Critérios:** Não é AIR, WATER, GLASS, LEAVES, CORRUPTED_WATER

#### `setBlock(x, y, z, type)`

- **Propósito:** Define bloco e atualiza física
- **Ações:**
  1. Modifica array de dados do chunk
  2. Marca chunk como dirty
  3. Marca chunks vizinhos se na borda
  4. Chama `checkBlockPhysics` para bloco acima

### Física de Blocos (1 função)

#### `checkBlockPhysics(x, y, z)`

- **Propósito:** Simula gravidade em blocos (areia)
- **Algoritmo:**
  - Se bloco tem propriedade `gravity`
  - E bloco abaixo é vazio/líquido
  - Move bloco para baixo
  - Chama recursivamente (delay 100ms)

---

## <a id="entidades"></a>4. 👾 Sistema de Entidades

### Classe Base (1 classe)

#### `class Entity`

- **Propriedades:**
  - `mesh`: Group do Three.js (corpo + cabeça)
  - `rigidBody`: Corpo físico Rapier
  - `collider`: Colisor Rapier
  - `stuckTimer`: Timer anti-travamento

**Métodos:**

##### `constructor(x, y, z, color, scale=1)`

- Cria geometrias de corpo (box 0.6x1.8x0.6)
- Cria cabeça (box 0.5x0.5x0.5)
- Inicializa física com cápsula

##### `update(dt, playerPos)`

- Sincroniza posição mesh com física
- Rotaciona para olhar jogador
- Limita velocidade vertical (max 10)
- Sistema anti-travamento (4s)

##### `remove()`

- Remove mesh da cena
- **Dispose de geometrias e materiais** (otimização)
- Remove física do mundo

### Entidades Hostis (2 classes)

#### `class Zombie extends Entity`

- **Aparência:** Verde (#228b22), cabeça escura
- **Velocidade:** 6.0
- **Comportamento:**
  - Persegue jogador até 60m
  - Pula obstáculos automaticamente
  - Dano: 10/s ao tocar jogador
- **IA:**
  - Raycast para detectar chão
  - Raycast para detectar parede
  - Impulso de 12.0 para pular

#### `class MutantZombie extends Entity`

- **Aparência:** Dourado (#DAA520), 50% maior
- **Velocidade:** 9.0
- **Comportamento:**
  - Persegue até 80m
  - Pulo gigante (impulso 20.0)
  - Dano: 20/s (2x Zombie)
- **Diferencial:** Mais agressivo e rápido

### Entidade NPC (1 classe)

#### `class Builder extends Entity`

- **Aparência:** Azul com amarelo
- **Estados:** IDLE, MOVING, BUILDING, FLEEING
- **Sistema de IA:**

**Máquina de Estados:**

1. **IDLE:**

   - Espera 2-5s
   - Escolhe ponto aleatório ±15 blocos
   - Transição → MOVING

2. **MOVING:**

   - Move em direção ao alvo (velocidade 4.0)
   - Pula obstáculos (impulso 8.0)
   - Ao chegar → BUILDING
   - Se cidade próxima (<50m) → FLEEING

3. **BUILDING:**

   - Coloca blocos a cada 0.05s
   - Pula se ficar preso no próprio bloco
   - Ao terminar → IDLE (wait 5s)

4. **FLEEING:**
   - Foge de cidades (raio 50m)
   - Direção oposta ao centro
   - Ao distanciar → IDLE

**Métodos de Construção:**

##### `buildSimpleHouse(ox, oy, oz)`

- Tamanho: 7x5x7 blocos
- Base de pedra
- Paredes de madeira
- Teto de toras
- Porta frontal

##### `buildTallHouse(ox, oy, oz)`

- Tamanho: 7x9x7 blocos
- 3 andares (pisos a cada 4 blocos)
- Paredes de tijolos
- Janelas de vidro
- Escadas internas

##### `buildBigHouse(ox, oy, oz)`

- Tamanho: 9x6x9 blocos
- Base reforçada
- Pilares nos cantos
- Paredes de tijolos
- Estrutura maior

##### `interact()`

- Mostra diálogo por 3s
- Mensagem: "Estou construindo uma vila para você!"

### Novas Entidades (v2.0)

#### `class Skeleton extends Entity`

- **Aparência:** Branco (#FFFFFF), cabeça clara (#EEEEEE)
- **Velocidade:** 4.0
- **Vida:** 80 HP
- **Comportamento:**
  - Mantém distância ideal de 15 blocos
  - Ataque à distância com projéteis
  - IA de distanciamento (recua/aproxima/strafing)
- **Sistema de Ataque:**
  - Cooldown: 2 segundos
  - Alcance: 8-20 blocos
  - Cria projéteis com física
- **Spawn:** Apenas no Mundo Invertido (~30% chance)

#### `class Projectile`

- **Aparência:** Esfera amarela brilhante (raio 0.2)
- **Física:** RigidBody com gravidade reduzida (0.3)
- **Comportamento:**
  - Velocidade inicial: 15 unidades/s
  - Lifetime: 5 segundos
  - Dano ao player: 15 HP
  - Colisão com blocos: Remove projétil
- **Sensor:** Não colide fisicamente (atravessa entidades)

#### `class Loot`

- **Aparência:** Cubo verde brilhante (0.4x0.4x0.4)
- **Animações:**
  - Flutuação (bobbing): Senoidal, amplitude 0.2
  - Rotação: 2.0 rad/s
- **Coleta:**
  - Proximidade: 1.5 blocos
  - Efeito: +20 HP
  - Feedback: Mensagem "💚 +20 HP" por 1s
- **Spawn:** Ao derrotar inimigos (onDeath)

---

## <a id="renderização"></a>5. 🎨 Sistema de Renderização

### Geração de Texturas (1 função)

#### `createTextureAtlas()`

- **Propósito:** Gera atlas 256x320 (4x5 texturas)
- **Técnica:** Canvas 2D com ruído procedural
- **Blocos Texturizados:**
  - Linha 0: Grama (top/side), Terra, Pedra
  - Linha 1: Areia, Madeira (side/top), Folhas
  - Linha 2: Tábuas, Água, Bedrock, Escritório
  - Linha 3: Pedra Corrompida, Grama Morta, Madeira Podre, Água Sombria
  - Linha 4: Concreto, Asfalto, Tijolos, Lâmpada
- **Filtros:** NearestFilter (estilo pixelado)

### Mapeamento UV (2 constantes)

#### `UV_MAP`

- Define coordenadas (u, v) para cada face
- Suporta faces diferentes (top/side/bottom)
- Margem de 0.003 para evitar bleeding

#### `getFaceUVs(type, faceName)`

- **Entrada:** Tipo de bloco e nome da face
- **Saída:** Array de 8 coordenadas UV
- **Correção:** Inverte Y (OpenGL para WebGL)

### Construção de Malha (1 função principal)

#### `buildChunk(cx, cz)`

- **Algoritmo Greedy Meshing:**
  1. Itera todos os blocos do chunk
  2. Para cada face, verifica vizinho
  3. Se vizinho invisível/transparente → renderiza face
  4. Calcula Ambient Occlusion (AO)
  5. Separa geometrias opacas e transparentes

**Otimizações:**

- Dispose completo antes de reconstruir
- Limita a 2 chunks construídos por frame
- Física apenas dentro de PHYSICS_DISTANCE
- Culling de faces ocultas

**Cálculo de AO (1 função):**

#### `calculateAO(side1, side2, corner)`

- **Entrada:** 3 booleanos (vizinhos sólidos)
- **Saída:** Fator de oclusão (0.4 a 1.0)
- **Lógica:** Quanto mais vizinhos, mais escuro

### Gerenciamento de Chunks (2 funções)

#### `disposeChunk(chunk)`

- Remove meshes da cena
- **Dispose de geometrias** (libera GPU)
- Remove física (rigidBody e collider)
- **NÃO dispõe materiais** (reutilizados)

#### `markChunkDirty(cx, cz)`

- Marca chunk para reconstrução
- Usado quando vizinho muda

---

## <a id="blueprints"></a>6. 🏗️ Sistema de Blueprints

### Estrutura de Dados (1 array)

#### `BLUEPRINTS`

Array com 4 projetos de construção:

**1. Casa Simples**

- Ícone: 🏠
- Dimensões: 5x5x5
- Blocos: 125 total
- Recursos: Tábuas e madeira
- Características: Porta, janelas, teto

**2. Torre de Vigia**

- Ícone: 🏰
- Dimensões: 3x12x3
- Blocos: ~100 (oca)
- Material: Pedra e tábuas
- Características: Plataforma no topo, ameias

**3. Muralha**

- Ícone: 🧱
- Dimensões: 5x4x1
- Blocos: 20
- Material: Tijolos
- Características: Ameias decorativas

**4. Fonte**

- Ícone: ⛲
- Dimensões: 5x3x5
- Blocos: ~40
- Materiais: Pedra e água
- Características: Borda, pilar central

**5. Ponte** (v2.0)

- Ícone: 🌉
- Dimensões: 10x2x3
- Blocos: 36
- Material: Madeira (tábuas e troncos)
- Características: Piso plano, corrimões laterais

**6. Piscina** (v2.0)

- Ícone: 🏊
- Dimensões: 8x4x8
- Blocos: ~200
- Materiais: Pedra e água
- Características: Escavação, paredes, água interior

**7. Bunker** (v2.0)

- Ícone: 🛡️
- Dimensões: 7x5x7
- Blocos: ~150
- Material: Bedrock (indestrutível)
- Características: Interior oco, porta, iluminação

### Função de Construção

Cada blueprint tem método `build(x, y, z)`:

- **Entrada:** Coordenadas de origem
- **Saída:** Array de objetos `{x, y, z, type}`
- **Processo:** Calcula posição de cada bloco

### Sistema de Modos (2 variáveis)

#### `interactionMode`

- Valores: 'BLOCK' ou 'BLUEPRINT'
- Alternado com tecla **G**

#### `selectedBlueprintIndex`

- Índice do blueprint selecionado (0-3)
- Seleção com teclas **1-4**

---

## <a id="jogador"></a>7. 🎮 Interação do Jogador

### Movimento (1 função)

#### `updatePlayer(dt)`

- **Controles:**
  - WASD: Movimento
  - Shift: Correr (velocidade 13.0 vs 8.0)
  - Espaço: Pular (impulso 12.0)
  - Mouse: Rotação da câmera

**Sistemas Integrados:**

##### Detecção de Queda

- Calcula deltaY entre frames
- Se deltaY > 35 após velocidade < -25
- Dano = (deltaY - 35) / 2

##### Oxigênio

- Drena 20/s em água
- Recupera 30/s fora d'água
- Dano contínuo se O₂ = 0

##### Estamina

- Drena 15/s correndo ou pulando
- Recupera 10/s em repouso
- Bloqueia ações se = 0

##### Respawn

- Altura < -30 → troca dimensão
- Morte (HP = 0) → volta ao spawn
- Restaura todos os stats

### Seleção de Blocos (1 função)

#### `updateSelection()`

- **Raycaster:** Distância máxima 20 blocos
- **Modo BLOCK:**
  - Destaca bloco com wireframe
  - Armazena normal da face
- **Modo BLUEPRINT:**
  - Preview wireframe do projeto
  - Verde: Válido
  - Vermelho: Colidindo com jogador
  - Verifica caixa de colisão (margem 0.8)

### Ações (1 event listener)

#### `mousedown`

- **Clique Esquerdo:**
  - BLOCK: Remove bloco
  - BLUEPRINT: Constrói projeto
- **Clique Direito:**
  - BLOCK: Coloca bloco
  - Verifica colisão com jogador

### Dano (1 função)

#### `takeDamage(amount)`

- Reduz HP
- Efeito visual (overlay vermelho 0.1s)
- Morte:
  - Retorna ao spawn
  - Limpa entidades
  - Restaura stats

---

## <a id="ui"></a>8. 🖥️ Interface do Usuário

### HUD (5 elementos)

#### Barras de Status

- **Saúde:** Vermelha (#ff3333)
- **Estamina:** Amarela (#ffcc00)
- **Oxigênio:** Azul (#33ccff), só visível em água

#### Hotbar (1 função)

##### `updateHotbar()`

- **Modo BLOCK:** 9 slots com cores de blocos
- **Modo BLUEPRINT:** 4 slots com emojis
- Classe CSS especial `.blueprint` para estilo único

#### Informações (3 displays)

##### Block Info

- Mostra bloco/projeto selecionado
- Modo atual

##### City Radar

- Distância para cidade mais próxima
- Cores:
  - Verde: <200m
  - Amarelo: 200-500m
  - Vermelho: Sem sinal

##### Time Display

- Formato HH:MM
- Baseado em `gameState.time` (0-1)

### Overlays (2 elementos)

#### Damage Overlay

- Vermelho, opacity 0.5
- Fade out 0.1s

#### Dimension Label

- Mostra nome da dimensão
- Fade in/out 3s

### Diálogos (1 elemento)

#### Dialog Box

- Mensagens de NPCs
- Auto-fecha após 3s

---

## <a id="ambiente"></a>9. 🌅 Ambiente e Iluminação

### Ciclo Dia/Noite (1 função)

#### `updateEnvironment(dt)`

**Dimensão Normal:**

- Duração dia: 600s (10 min)
- Tempo avança automaticamente
- Fases:
  - 0.00-0.20: Noite (#050510)
  - 0.20-0.25: Amanhecer (transição)
  - 0.25-0.70: Dia (#87CEEB)
  - 0.70-0.75: Entardecer (transição)
  - 0.75-1.00: Noite

**Dimensão Invertida:**

- Tempo congelado
- Cor fixa: Vermelho escuro (#1a0505)
- Sistema de raios:
  - A cada 2-7s
  - Flash para roxo (#550055)
  - Duração: 100ms

### Partículas (1 sistema)

#### Sistema de Partículas

- **Quantidade:** 2000 pontos
- **Visível em:** Dimensão Invertida
- **Comportamento:**
  - Movimento aleatório lento
  - Seguem posição do jogador
- **Renderização:** THREE.Points com blending aditivo

### Névoa (fog)

- **Cor:** Sincronizada com céu
- **Distância:** (RENDER_DISTANCE × 16) - 5
- **Invertido:** Distância reduzida para 30

### Spawn de Entidades (1 função)

#### `updateSpawning(dt)`

- **Timer:** A cada 2s
- **Limite:** 10 entidades máximo
- **Lógica:**
  - Normal: 50% Builder (longe de cidades)
  - Invertido: 10% Mutante, 90% Zombie
- **Posição:** 15-40m do jogador
- **Validação:** Verifica chunk carregado

---

## 🔧 Otimizações Implementadas

### Performance

1. **Web Worker** para geração assíncrona
2. **Greedy Meshing** para reduzir polígonos
3. **Frustum Culling** automático do Three.js
4. **Dispose agressivo** de geometrias não usadas
5. **Limite de chunks construídos** por frame (2)
6. **Física seletiva** (apenas PHYSICS_DISTANCE)

### Memória

1. **Material reutilizado** (opaco e transparente)
2. **Despawn automático** (DESPAWN_DISTANCE)
3. **Limpeza ao trocar dimensão**
4. **Timer anti-travamento** de entidades

### Visual

1. **Ambient Occlusion** para profundidade
2. **Atlas de texturas** única (economia de draw calls)
3. **LOD implícito** via distância de render
4. **Particle system otimizado** (Points)

---

## 💾 Sistema de Save/Load (v2.0)

### Arquitetura
- **Armazenamento:** `localStorage` do navegador
- **Chave:** `strangercraft_saves`
- **Formato:** JSON stringificado

### Dados Persistidos
- Posição e rotação do jogador (com dimensão atual)
- Inventário e slot selecionado
- Status (HP, O2, Stamina)
- Modificações do terreno (Delta Compression)

---

## <a id="debug"></a>10. 🛡️ Sistema de Validação e Debug (v2.1)

### Módulo de Logging (`lib/debug.js`)
- **Níveis:** ERROR, WARN, INFO, DEBUG
- **Console:** Saída formatada com cores para fácil leitura
- **Rastreamento:** Erros críticos em Promises e Workers

### Validação de Integridade (`lib/validation.js`)
- **Configuração:** Verifica se JSONs essenciais (blocks, biomes) carregaram
- **Posição:** Detecta coordenadas inválidas/NaN
- **Inicialização:** Garante que física e terreno existem antes do spawn

### Proteção Contra Falhas
- **Inicialização Segura:** Jogo só inicia após geração e construção dos chunks ao redor do spawn
- **Void Fall Protection:**
  - Monitora posição Y do jogador
  - Se Y < -50 (void), teleporta para superfície
  - Aplica penalidade leve em vez de crash/loop infinito
- **Chunk Timeout:** Workers têm limite de 10s para responder antes de falhar
- **Fallback Síncrono:** Se workers falharem, main thread assume geração


O sistema salva apenas as **modificações** (delta) do mundo, não o mundo inteiro.

#### `class SaveLoadSystem`

**Módulo:** `lib/save-load.js`

**Propriedades:**
- `worldChanges`: Objeto `{ "x,y,z": blockType }`

**Métodos:**

##### `trackChange(x, y, z, blockType)`

- Registra modificação de bloco
- Formato de chave: `"${x},${y},${z}"`
- Sobrescreve mudanças anteriores na mesma posição

##### `getChange(x, y, z)`

- Retorna blockType se houver mudança salva
- Retorna `null` se não houver
- Usado por `getBlock()` antes de consultar chunk

##### `saveGame(playerBody, gameState)`

- Serializa `worldChanges` para JSON
- Salva em `localStorage` com chave `strangercraft_save`
- Inclui: worldChanges, playerPosition, dimension, timestamp
- **Retorno:** `{ success, count }` ou `{ success: false, error }`

##### `loadGame()`

- Lê de `localStorage`
- Restaura `worldChanges`
- Marca todos os chunks como dirty para re-renderizar
- **Retorno:** `{ success, count, playerPosition, dimension }`

##### `clearSave()`

- Remove save do localStorage
- Limpa objeto worldChanges

### Integração

**Modificações em funções existentes:**

1. **`getBlock(x, y, z)`**
   - Consulta `saveLoadSystem.getChange()` primeiro
   - Se retornar valor, usa ele
   - Caso contrário, consulta chunk normalmente

2. **`setBlock(x, y, z, type)`**
   - Chama `saveLoadSystem.trackChange()` após modificar chunk
   - Rastreia todas as mudanças automaticamente

3. **Listeners de teclado**
   - **Tecla P**: Chama `saveLoadSystem.saveGame()`
   - **Tecla L**: Chama `saveLoadSystem.loadGame()`

### Limitações

- **Tamanho:** localStorage tem limite de ~5-10MB
- **Escopo:** Apenas modificações do jogador (não salva entidades)
- **Persistência:** Específico por navegador/domínio

---

## 🎯 Sistemas Completos

### ✅ Implementado

- [x] Geração procedural infinita
- [x] Física realista (Rapier)
- [x] Sistema de dimensões (2)
- [x] Entidades com IA (3 tipos)
- [x] Sistema de blueprints (4 projetos)
- [x] Ciclo dia/noite
- [x] Sistema de cidades
- [x] Ambient Occlusion
- [x] Stats do jogador (HP, O₂, Stamina)
- [x] Gravidade de blocos (areia)

### 📋 Funcionalidades Principais

1. Sobrevivência (dano por queda, água, inimigos)
2. Construção (blocos e projetos)
3. Exploração (2 dimensões, cidades)
4. Interação (NPCs construtores)
5. Combate (fuga de inimigos)

---

## 📈 Complexidade do Código

### Algoritmos Notáveis

- **Simplex Noise:** O(1) por ponto
- **Greedy Meshing:** O(n³) por chunk
- **Raycast:** O(log n) com BVH
- **Pathfinding:** Básico (linha reta com pulos)

### Performance Esperada

- **FPS:** 60fps em hardware médio
- **Chunks carregados:** ~80 (RENDER_DISTANCE=4)
- **Draw calls:** ~160 (opaco + transparente)
- **Entidades:** Até 10 simultâneas

---

## 🐛 Pontos de Atenção

### Limitações Conhecidas

1. Sem salvamento persistente
2. Pathfinding simplificado
3. Sem sistema de inventário
4. Texturas procedurais (não pixel art real)
5. Física pode falhar em alta velocidade

### Possíveis Melhorias

1. Sistema de chunks infinitos (atualmente limitado)
2. Multiplayer
3. Mais tipos de entidades
4. Sistema de crafting
5. Estruturas maiores (dungeons, templos)

---

_Documentação gerada para inventário completo do sistema_
