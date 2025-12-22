# Análise: Wave2D para Blocos de Água no Stranger Craft

## 📋 Resumo Executivo

A biblioteca `lib/wave2d` é uma implementação sofisticada de **simulação de ondas 2D em tempo real** usando GPU computing (via `gpu-io`) e Three.js para renderização 3D. Ela implementa a equação de onda discreta com efeitos visuais avançados incluindo **cáusticas realistas** (padrões de luz refratada).

**Viabilidade**: ✅ **SIM, é possível integrar**, mas com adaptações significativas devido às diferenças arquiteturais.

---

## 🔍 Análise Técnica da Biblioteca Wave2D

### Componentes Principais

#### 1. **Simulação Física** ([index.js](file:///c:/Users/milto/Documents/stranger-craft/lib/wave2d/index.js#L248-L300))
```javascript
// Equação de onda discreta 2D
// Usa operador Laplaciano discreto para propagar ondas
waveProgram = new GPUProgram({
  fragmentShader: `
    // Laplaciano: n + s + e + w - 4.0 * current
    // Equação: (1-DECAY) * (u_alpha * laplacian + 2.0 * current - last)
  `,
  uniforms: [
    u_alpha: (c * DT / DX)² // Controla velocidade de propagação
  ]
})
```

**Parâmetros relevantes**:
- `c = 0.15`: Velocidade de propagação da onda
- `DT = 1, DX = 1`: Time step e grid spacing
- `DECAY = 0.005`: Fator de amortecimento (0.5%)
- `TEXTURE_DIM = [100, 100]`: Resolução da simulação

#### 2. **Triple Buffering** ([index.js](file:///c:/Users/milto/Documents/stranger-craft/lib/wave2d/index.js#L199-L208))
```javascript
const height = new GPULayer({
  numBuffers: 3, // currentState + lastState + próximo estado
  // Necessário porque a equação de onda precisa de t e t-1
})
```

#### 3. **Sistema de "Drops"** ([index.js](file:///c:/Users/milto/Documents/stranger-craft/lib/wave2d/index.js#L408-L435))
```javascript
function addDrop() {
  // Cria perturbação circular com falloff
  // altura = 1.0 - 2.0 * length(vector_from_center)
  composer.stepCircle({
    program: dropProgram,
    diameter: DROP_DIAMETER,
    position: [random_x, random_y]
  })
}
```

#### 4. **Renderização 3D com Mesh Deformável** ([index.js](file:///c:/Users/milto/Documents/stranger-craft/lib/wave2d/index.js#L119-L142))
```javascript
// Vertex shader que lê textura de altura GPU-side
vertexShader: `
  vec2 uv = getTextureUV(gl_VertexID, u_heightDimensions);
  position.y += 3.0 * texture(u_height, uv).x; // Escala altura
`
```

#### 5. **Caustics Realtime** ([index.js](file:///c:/Users/milto/Documents/stranger-craft/lib/wave2d/index.js#L320-L396))
```javascript
// Refrata luz através da superfície usando lei de Snell
vec3 refractVector = refract(incident, normal, 1.0/1.33);
// Mede distorção da malha para calcular intensidade luminosa
float amplitude = oldArea / newArea * 0.75;
```

---

## 🎮 Implementação Atual de Água no Stranger Craft

### Arquitetura

**Blocos de água** ([terrain.js](file:///c:/Users/milto/Documents/stranger-craft/lib/terrain.js#L285)):
```javascript
// Geração de terreno
if (y > h) { 
  if (y <= WATER_LEVEL) block = biome.water; // BLOCKS.WATER
}
```

**Propriedades** ([config/blocks.json](file:///c:/Users/milto/Documents/stranger-craft/config/blocks.json)):
- Transparente (opacity 0.5)
- Não é sólido para colisão
- Renderizado com `materialTrans`

**Rendering** ([rendering.js](file:///c:/Users/milto/Documents/stranger-craft/lib/rendering.js)):
- Chunks estáticos com geometria BufferGeometry
- Blocos são cubos individuais agregados
- Sistema de AO (Ambient Occlusion) por vértice
- Sem deformação de malha

---

## ⚖️ Comparação: Wave2D vs. Implementação Atual

| Aspecto | Wave2D | Stranger Craft Atual | Compatibilidade |
|---------|--------|---------------------|-----------------|
| **Computação** | GPU (GPGPU via gpu-io) | CPU + Three.js geometria | ⚠️ Arquiteturas diferentes |
| **Malha** | Grid contínuo deformável | Blocos cúbicos discretos | ❌ Incompatível direto |
| **Simulação** | Equação de onda física | Estático | ✅ Pode adicionar |
| **Escala** | 100×100 grid | Chunks 16×16×64 | ⚠️ Precisa adaptar |
| **Performance** | Fragment shaders | Geometria por chunk | ⚠️ Overhead diferente |

---

## 💡 Abordagens de Integração

### Opção A: **GPGPU Híbrido** (Mais Fiel ao Wave2D)

**Descrição**: Usar `gpu-io` para simular ondas em camadas de água, aplicar deformação via vertex shader.

```javascript
// Pseudocódigo
class WaterSimulation {
  constructor(composer, waterBlocks) {
    this.height = new GPULayer({ dimensions: [chunkSize, chunkSize], numBuffers: 3 });
    this.waveProgram = new GPUProgram({ /* wave equation */ });
  }
  
  step() {
    // Simular ondas em GPU
    composer.step({ program: waveProgram, input: [height.currentState, height.lastState], output: height });
  }
  
  applyToMesh(mesh) {
    // Vertex shader lê textura de altura
    mesh.material.onBeforeCompile = (shader) => {
      shader.uniforms.u_heightMap = { value: this.height.texture };
      shader.vertexShader = injectHeightDeformation(shader.vertexShader);
    };
  }
}
```

**Prós**:
- ✅ Simulação física realista
- ✅ Performance excelente (GPU)
- ✅ Efeitos visuais impressionantes (caustics)

**Contras**:
- ❌ Requer `gpu-io` library (nova dependência ~100KB)
- ❌ Complexidade alta (shaders customizados)
- ❌ Difícil integrar com sistema de blocos discretos

---

### Opção B: **Vertex Displacement Simplificado** (Recomendada) 🌟

**Descrição**: Simular ondas com algoritmo simplificado em CPU/JS, aplicar via vertex shader sem GPGPU.

```javascript
class SimpleWaterWaves {
  constructor(chunkSize) {
    this.grid = new Float32Array(chunkSize * chunkSize * 2); // current + last
    this.params = { c: 0.12, decay: 0.002, dt: 1, dx: 1 };
  }
  
  step() {
    const { c, decay, dt, dx } = this.params;
    const alpha = (c * dt / dx) ** 2;
    
    for (let x = 1; x < size - 1; x++) {
      for (let z = 1; z < size - 1; z++) {
        const idx = x * size + z;
        const current = this.grid[idx];
        const last = this.grid[idx + size * size]; // segundo buffer
        
        // Laplaciano discreto (vizinhos N/S/E/W)
        const n = this.grid[(x-1) * size + z];
        const s = this.grid[(x+1) * size + z];
        const e = this.grid[x * size + (z+1)];
        const w = this.grid[x * size + (z-1)];
        const laplacian = n + s + e + w - 4 * current;
        
        // Equação de onda discreta
        const next = (1 - decay) * (alpha * laplacian + 2 * current - last);
        this.grid[idx] = next;
      }
    }
    
    // Swap buffers (current ↔ last)
    this.swapBuffers();
  }
  
  addDrop(x, z, strength = 1.0) {
    const radius = 3;
    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        const dist = Math.sqrt(i*i + j*j);
        if (dist <= radius) {
          const idx = (x+i) * size + (z+j);
          this.grid[idx] += strength * (1 - dist / radius);
        }
      }
    }
  }
}
```

**Aplicar ao Mesh**:
```javascript
// Modificar buildChunk() para criar malha de água deformável
function buildWaterMesh(chunk, waterBlocks, simulation) {
  const geometry = new PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, CHUNK_SIZE-1, CHUNK_SIZE-1);
  const positions = geometry.attributes.position.array;
  
  // Armazenar índices de grid para cada vértice
  geometry.setAttribute('gridIndex', new Float32BufferAttribute(gridIndices, 1));
  
  // Shader material customizado
  material.onBeforeCompile = (shader) => {
    shader.uniforms.heightData = { value: simulation.getTexture() };
    shader.uniforms.waveScale = { value: 0.15 }; // Amplitude visual
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      `
      float heightOffset = texelFetch(heightData, ivec2(gridIndex.xy), 0).r;
      transformed.y += waveScale * heightOffset;
      #include <project_vertex>
      `
    );
  };
}
```

**Prós**:
- ✅ Implementação mais simples (~200 linhas)
- ✅ Sem dependências externas
- ✅ Controle total do algoritmo
- ✅ Integração mais fácil com chunks

**Contras**:
- ⚠️ Performance inferior ao GPGPU (mas aceitável para ~400 blocos por chunk)
- ❌ Sem caustics (mas poderia adicionar depois)

---

### Opção C: **Shader-Only Animation** (Mais Simples)

**Descrição**: Ondas procedurais via noise functions no shader, sem simulação física.

```glsl
// Vertex Shader
uniform float time;
attribute vec3 position;

void main() {
  vec3 pos = position;
  
  // Múltiplas ondas sinusoidais com diferentes frequências
  float wave1 = sin(pos.x * 0.5 + time * 2.0) * 0.1;
  float wave2 = sin(pos.z * 0.7 - time * 1.5) * 0.08;
  float wave3 = sin((pos.x + pos.z) * 0.3 + time) * 0.05;
  
  pos.y += wave1 + wave2 + wave3;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

**Prós**:
- ✅ Extremamente simples (~30 linhas)
- ✅ Performance perfeita
- ✅ Visual agradável para água

**Contras**:
- ❌ Não reage a interações (jogador andando, blocos caindo)
- ❌ Não tem física realista

---

## 📊 Recomendação Final

### **Opção B: Vertex Displacement Simplificado**

Para o contexto do Stranger Craft, recomendo a **Opção B** pelos seguintes motivos:

1. **Equilíbrio**: Oferece física realista sem complexidade excessiva
2. **Interatividade**: Pode adicionar drops quando jogador entra na água, blocos caem, etc.
3. **Performance**: Aceitável para chunks (~5-10ms por frame para simulação)
4. **Evolutiva**: Pode migrar para GPGPU depois se necessário

---

## 🚀 MVP - Melhorias Rápidas (30 minutos)

### Quick Win 1: Ajustar Opacidade ⚪ (2 minutos)
**Objetivo**: Tornar água mais transparente e realista

**Implementação**:
```javascript
// Em index3.html / index.html, após criar materialTrans
materialTrans.opacity = 0.75; // Era 1.0, agora mais transparente
materialTrans.color.setHex(0x2196F3); // Azul oceano
```

**Resultado**: 
- ✅ Água mais transparente
- ✅ Cor azulada realista
- ✅ Zero impacto na performance

---

### Quick Win 2: Ondas Shader Simples 🌊 (20-30 minutos)
**Objetivo**: Adicionar movimento ondulante sem física complexa

**Implementação**:
```javascript
// Em index3.html, criar material customizado para água
const waterMaterial = new THREE.MeshBasicMaterial({
  map: textureAtlas,
  transparent: true,
  opacity: 0.75,
  alphaTest: 0.1,
  side: THREE.DoubleSide,
  vertexColors: true,
  color: 0x2196F3
});

// Adicionar shader de ondas
waterMaterial.onBeforeCompile = (shader) => {
  // Adicionar uniform de tempo
  shader.uniforms.time = { value: 0 };
  
  // Injetar uniform no vertex shader
  shader.vertexShader = shader.vertexShader.replace(
    'void main() {',
    `uniform float time;
    void main() {`
  );
  
  // Adicionar lógica de ondas ANTES da transformação final
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `#include <begin_vertex>
    // Ondas sinusoidais compostas
    float wave1 = sin(transformed.x * 0.5 + time * 2.0) * 0.08;
    float wave2 = sin(transformed.z * 0.7 - time * 1.5) * 0.06;
    float wave3 = sin((transformed.x + transformed.z) * 0.3 + time) * 0.04;
    transformed.y += wave1 + wave2 + wave3;`
  );
  
  // Guardar referência para atualização
  waterMaterial.userData.shader = shader;
};

// No loop de animação (dentro de animate()):
if (waterMaterial.userData.shader) {
  waterMaterial.userData.shader.uniforms.time.value = clock.getElapsedTime();
}
```

**Modificação em buildChunk()** ([rendering.js](file:///c:/Users/milto/Documents/stranger-craft/lib/rendering.js)):
```javascript
// Detectar blocos de água e usar material especial
if (type === BLOCKS.WATER || type === BLOCKS.CORRUPTED_WATER) {
  // Usar waterMaterial ao invés de materialTrans
  const waterMesh = /* criar mesh com waterMaterial */;
}
```

**Resultado**:
- ✅ Água com movimento ondulante realista
- ✅ Performance 60 FPS (shader GPU-side)
- ✅ Visual impressionante com esforço mínimo
- ✅ Sem dependências externas

---

### Comparação MVP

| Feature | Só Opacidade | + Shader Waves | 
|---------|--------------|----------------|
| Tempo | 2 min | 30 min total |
| Linhas de código | 2 | ~25 |
| Visual | ⭐⭐ Estático | ⭐⭐⭐⭐ Dinâmico |
| "Wow Factor" | Baixo | **Alto** |
| Performance | 100% | 99.9% |
| Complexidade | Trivial | Simples |

**Recomendação**: Fazer ambos! O combo leva 30 min e transforma água completamente.

---

### Roadmap de Implementação

#### **Fase 1: Core Simulation** (1-2 horas)
- [ ] Criar classe `WaterSimulation` em `lib/water-simulation.js` com algoritmo de onda
- [ ] Testar simulação isolada (desenhar grid 2D em canvas)
- [ ] Implementar sistema de drops

#### **Fase 2: Integration** (2-3 horas)
- [ ] Modificar `buildChunk()` em `lib/rendering.js` para detectar camadas de água
- [ ] Criar geometria de plano para cada camada Y com água
- [ ] Aplicar vertex shader com displacement
- [ ] Criar material customizado para água com shader modificado

#### **Fase 3: Polish** (1-2 horas)
- [ ] Adicionar triggers (jogador entra → drop, bloco cai → splash)
- [ ] Ajustar parâmetros visuais (amplitude, cores, transparência)
- [ ] Otimizar (limitar simulação a chunks visíveis)
- [ ] Adicionar animação de textura para efeito de brilho

#### **Fase 4: Advanced (Opcional)**
- [ ] Adicionar caustics usando técnica simplificada
- [ ] Implementar foam particles nas cristas
- [ ] Sons de água (splash, ondas)
- [ ] Interação com física (objetos flutuantes)

---

## 🔧 Arquivos a Modificar

1. **NOVO**: `lib/water-simulation.js` - Classe de simulação de ondas
2. **Modificar**: `lib/rendering.js` - Detectar água e criar mesh especial
3. **Modificar**: `index3.html` / `index.html` - Atualizar loop de animação para chamar water.step()
4. **Opcional**: `config/game.json` - Adicionar parâmetros de água configuráveis

---

## 📝 Exemplo de Uso Final

```javascript
// No loop de animação
const waterSim = new WaterSimulation(CHUNK_SIZE);

function animate() {
  // Atualizar física da água
  waterSim.step();
  
  // Quando jogador entra na água
  if (playerInWater) {
    const gridPos = worldToGrid(playerPos);
    waterSim.addDrop(gridPos.x, gridPos.z, 0.5);
  }
  
  // Renderização normal
  renderer.render(scene, camera);
}
```

---

## 🚀 Próximos Passos

Escolha a opção desejada:

1. **Implementar Opção B completa** (recomendado)
2. **Protótipo rápido Opção C** (teste visual)
3. **Análise de performance detalhada**
4. **Plano de implementação passo-a-passo**
