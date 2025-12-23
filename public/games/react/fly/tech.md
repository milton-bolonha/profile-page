# Tech Documentation - Neon Flight Game

## Visão Geral

Este documento fornece um inventário completo das funções, componentes, bibliotecas e mecânicas do jogo Neon Flight Game, um protótipo de voo 3D construído com React e Three.js.

## Estrutura de Arquivos

```
src/
├── components/
│   └── NeonFlightGame.js  # Componente principal do jogo
├── lib/
│   └── SimpleNoise.js     # Classe para geração de ruído (usada em efeitos visuais)
├── utils/                 # Pasta para utilitários adicionais (atualmente vazia)
├── config/                # Pasta para configurações (atualmente vazia)
├── App.js                 # Componente raiz que renderiza o jogo e seções estáticas
└── index.js               # Ponto de entrada da aplicação
```

## Componentes

### 1. NeonFlightGame (src/components/NeonFlightGame.js)

Componente React principal que contém toda a lógica do jogo.

- **Props**: Nenhuma
- **Estado**: Gerenciado via useRef para UI e variáveis locais no useEffect
- **Renderiza**: Canvas Three.js, overlays de UI (intro, pause, HUD), estilos inline

### 2. App (src/App.js)

Componente raiz da aplicação.

- **Props**: Nenhuma
- **Estado**: Nenhum
- **Renderiza**: NeonFlightGame + seções estáticas (descrição e "END OF PROTOTYPE")

## Bibliotecas e Utilitários

### 1. SimpleNoise (src/lib/SimpleNoise.js)

Classe para geração de ruído procedural 3D, usada em efeitos visuais como tubos de turbo.

- **Métodos**:
  - `constructor()`: Inicializa gradientes e permutações
  - `dot(g, x, y, z)`: Produto escalar
  - `mix(a, b, t)`: Interpolação linear
  - `fade(t)`: Função de fade para suavização
  - `noise3D(x, y, z)`: Gera ruído 3D

## Inventário de Funções (NeonFlightGame)

### Inicialização e Setup

- `loadGLBModel()`: Carrega modelo 3D do avião via GLTFLoader
- `initSpaceLevel()`: Inicializa cena com estrelas, túneis, partículas e corpos planetários
- `initTurboEffects()`: Cria efeitos visuais de turbo (tubos e linhas de velocidade)
- `createPlayerMesh()`: Cria mesh do jogador (avião) com partículas de motor e trilhas

### Sistema de Partículas

- `createEngineParticles()`: Cria partículas para motores
- `updateEngineParticles()`: Atualiza posição das partículas dos motores
- `spawnConfetti(pos, count)`: Gera confetes em explosões
- `updateConfetti()`: Atualiza e remove confetes expirados

### Mecânicas de Jogo

- `fireWeapon()`: Dispara projéteis
- `spawnSpaceObstacle()`: Gera obstáculos espaciais aleatoriamente
- `updateProjectiles()`: Move projéteis e verifica colisões
- `updateSpaceObstacles(moveSpeed)`: Move obstáculos e verifica colisões com jogador
- `resetPhysics()`: Reseta estado físico do jogador
- `startGame()`: Inicia o jogo após carregamento
- `startCountdown()`: Mostra contagem regressiva
- `endGame()`: Finaliza jogo e mostra tela de agradecimento
- `togglePause()`: Pausa/despausa o jogo
- `resumeGame()`: Retoma jogo pausado
- `resetToMenu()`: Volta ao menu inicial

### Efeitos Visuais

- `toggleTurboVisuals(active)`: Ativa/desativa efeitos de turbo
- `updateTurboVisuals()`: Anima efeitos de turbo
- `spawnPlanetaryBodies()`: Cria planetas e anéis
- `spawnSpaceDebris(zPos)`: Gera detritos espaciais
- `updateSpaceLevel(gameSpeed)`: Move elementos da cena (estrelas, partículas, planetas, detritos)

### Helpers e UI

- `setCursor(style)`: Altera cursor do mouse
- `showFloatingScore(amount, type)`: Mostra pontuação flutuante
- `updateTurboUI()`: Atualiza status do turbo na HUD

### Loop de Update

- `updatePhysics()`: Atualiza física, colisões, energia, pontuação
- `updateCamera()`: Move câmera baseada na posição do jogador
- `updateTrails()`: Atualiza trilhas do avião
- `animate()`: Loop principal de renderização

### Eventos

- `handleKeyDown(e)`: Processa entrada de teclado
- `handleKeyUp(e)`: Processa liberação de teclas
- `handleMouseMove(e)`: Processa movimento do mouse
- `handleResize()`: Ajusta canvas ao redimensionar janela
- `handlePointerDown(e)`: Processa cliques para disparar

## Mecânicas do Jogo

### Controles

- **Movimento**: Mouse (pitch/yaw) + WASD (direção)
- **Turbo**: Espaço (boost de velocidade, drena energia mais rápido)
- **Manobras**: F (giro), C (loop aéreo)
- **Ação**: Z ou clique (disparar projéteis)
- **Sistema**: P (pausar), Esc (pausar)

### Sistema de Energia

- Energia começa em 100
- Drena constantemente (0.025/s normal, 0.1/s turbo)
- Recarrega em loops (energia baseada em progresso do loop)
- Jogo termina se energia = 0

### Pontuação

- +1 por segundo voando
- +5 por segundo em turbo
- +500 por destruir obstáculo
- +800 por completar loop

### Obstáculos

- Caixas rotativas aparecem aleatoriamente
- Dano ao colidir (perde 15 energia)
- Destrutíveis com tiros (pontos + confetes)

### Efeitos Visuais

- Estrelas e partículas no fundo
- Trilhas do avião
- Partículas de motor
- Efeitos de turbo (tubos e linhas)
- Confetes em explosões
- HUD com velocidade, pontuação, energia

### Estados do Jogo

- Menu inicial
- Contagem regressiva
- Jogo ativo
- Pausado
- Game over (tela de agradecimento)

## Dependências

- **React**: Framework UI
- **Three.js**: Biblioteca 3D
- **@types/three**: Tipos TypeScript para Three.js

## Notas Técnicas

- O código usa TypeScript-like syntax em arquivos .js (type assertions e annotations)
- Modelo 3D carregado de URL externa (GitHub)
- Canvas Three.js integrado ao DOM via ref
- Eventos globais anexados à window
- Fog e iluminação customizados para atmosfera neon
