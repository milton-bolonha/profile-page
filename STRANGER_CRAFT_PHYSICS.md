# Stranger Craft - Physics & Movement Engine Architecture

Este documento descreve as soluções de engenharia implementadas para garantir movimentação fluida, colisão robusta e física estável no ambiente Voxel do Stranger Craft.

## 1. Core Loop Architecture (Game Loop)

Para resolver problemas de instabilidade e vibração ("stutter") comuns em jogos que rodam em monitores de alta frequência (144Hz+), adotamos uma arquitetura híbrida de **Fixed Timestep** com **Interpolção Visual**.

### 1.1 Fixed Timestep Physics (60Hz)
O motor de física (Rapier3D) roda estritamente a 60 passos por segundo (16.6ms).
*   **Por que?:** Motores de física perdem precisão com passos de tempo variáveis ou muito pequenos (comuns em framerates altos). Passos variáveis causam "tunneling" (atravessar chão) e instabilidade em colisões de malha.
*   **Implementação:** Usamos um padrão "Accumulator". O tempo de frame é acumulado e consumido em fatias fixas de `1/60`.

```typescript
// Exemplo Conceitual
accumulator += frameDt;
while (accumulator >= FIXED_STEP) {
    physicsWorld.step(FIXED_STEP);
    updateGameLogic(FIXED_STEP);
    accumulator -= FIXED_STEP;
}
```

### 1.2 Visual Interpolation (Smoothing)
O renderizador roda na taxa máxima do monitor (ex: 144Hz).
*   **Problema:** Se a câmera seguir estritamente o corpo físico (que atualiza apenas a 60Hz), o jogo parecerá "travado" a 60fps.
*   **Solução:** A posição da câmera é **Interpolada (Lerp)** a cada frame de renderização em direção à posição física atual.
*   **Resultado:** Movimento visualmente "manteiga" (144Hz+) escondendo completamente os "ticks" da física e quaisquer micro-vibrações de colisão.

```typescript
// Render Loop (144Hz)
camera.position.lerp(targetPos, opacityFactor); // Suavização Frame-Rate Independent
```

---

## 2. Collision System (Sistema de Colisão)

A colisão em um mundo de blocos (Voxels) apresenta desafios únicos, principalmente o problema de "Ghost Collisions" (tropeçar em arestas invisíveis).

### 2.1 Player Collider: Capsule
Utilizamos uma **Cápsula** (arredondada nas pontas) para o jogador.
*   **Vantagem:** O fundo arredondado permite deslizar suavemente sobre pequenas imperfeições ou junções entre chunks, onde um cilindro de fundo chato (box) poderia "enganchar".

### 2.2 Vertex Welding (Soldagem de Vértices)
Ao gerar a malha de física (`ColliderDesc.trimesh`) para o terreno:
*   Não criamos cubos individuais.
*   **Soldamos** matematicamente os vértices compartilhados entre faces adjacentes.
*   **Efeito:** O motor de física enxerga uma superfície contínua e lisa, eliminando arestas internas onde o jogador poderia prender.

### 2.3 Correct Winding Order (Ordem dos Vértices)
Garantimos que os triângulos da malha de física sigam a ordem **Anti-Horária (CCW)**.
*   **Importância:** O Rapier usa a ordem dos vértices para determinar a "frente" da face (Normal). Se invertido, o motor acha que o jogador está "dentro" do chão e aplica forças de expulsão violentas (pulos fantasmas).

---

## 3. Movement Logic (Movimentação)

A movimentação foi ajustada para ter a sensação de um FPS moderno ("Tight Control") mas com inércia física.

### 3.1 Horizon-Locked Forward Vector
Apertar **W** sempre move o jogador em direção ao horizonte, ignorando a inclinação da câmera (Pitch).
*   **Cálculo:** Pegamos o vetor `getWorldDirection()`, zeramos o eixo Y (`v.y = 0`) e normalizamos.
*   **Benefício:** Impede que o jogador seja "empurrado contra o chão" ao olhar para baixo, o que causava "pulos" e atrito indesejado.

### 3.2 Linear Damping (Inércia)
Ao soltar as teclas, não paramos o jogador instantaneamente (`vel = 0`).
*   Aplicamos uma desaceleração linear rápida (`velocity -= damping * dt`).
*   Isso cria uma sensação sutil de "peso" e deslizamento, vitais para o "game feel", sem parecer que o jogador está no gelo.

### 3.3 Dynamic Physics LOD
Para performance:
*   Chunks próximos ao jogador têm coliders de física de alta precisão.
*   Chunks distantes são apenas visuais e têm seus coliders descarregados.
*   Isso permite render distances maiores sem explodir o custo de CPU da física.

---

## 4. Known Issues & Optimization Roadmap (Problemas Conhecidos)

### 4.1 "Travadinha" (Stutter) ao Carregar/Modificar Blocos
*   **Causa:** A geração de malha (`buildChunk`) e a atualização de física (`ColliderDesc.trimesh`) ocorrem **Sincronamente na Thread Principal**.
*   **Sintoma:** Queda breve de quadros (stutter) ao andar para novos chunks ou ao colocar/quebrar blocos.
*   **Solução Futura:** Mover a geração de geometria e física para **WebWorkers**. Isso deixaria o jogo 100% fluido, mas exige refatoração complexa da engine.

### 4.2 Interação de Clique (Raycast)
*   **Problema:** Ocasionalmente o clique para quebrar blocos falha ou "pega" o próprio jogador.
*   **Causa:** Como a câmera é interpolada, ela pode estar ligeiramente "atrás" do corpo físico em movimentos rápidos, fazendo o raio nascer dentro do colider do jogador.
*   **Fix Atual:** Offset do raio (`origin + dir * 0.5`) e exclusão explícita do RigidBody do jogador no Raycast.
