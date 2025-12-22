# 📋 INVENTÁRIO COMPLETO - PixelForge Studio v5.7

## 🎨 1. INTERFACE GRÁFICA (UI/UX)

### **1.1 Header (Barra Superior)**

- **Logo/Branding**:

  - Ícone de cubo (fa-cube)
  - Texto "PIXELFORGE" (roxo + azul highlight)
  - Botão Undo (Ctrl+Z)

- **Barra de Ferramentas (Centro)**:

  - **Pencil** (P) - Lápis para desenhar
  - **Eraser** (E) - Borracha
  - **Bucket** (B) - Balde de tinta (flood fill)
  - **Stamp** (S) - Carimbo de blocos/patterns
  - **Picker** (Alt) - Conta-gotas (eyedropper)

- **Controles de Visualização (Direita)**:
  - **Zoom Controls**: Botões +/- com display percentual
  - **Brush Size**: Slider 1-64px com display "Xpx"
  - **Color Picker**: Botão quadrado com modal flutuante
    - Native color picker (HTML5)
    - Input HEX manual
    - Ícone X para fechar
  - **Onion Skin Toggle**: Botão com ícone de camadas
  - **Grid Toggle**: Botão border-all (toggle linhas de grade)
  - **Export Menu**: Dropdown com opções:
    - GIF Animado
    - PNG (Frame Atual)

### **1.2 Área Central (Canvas & Viewport)**

**Canvas Viewport**:

- Container scrollável com fundo escuro (#0f0f13)
- Canvas centralizado com box-shadow
- **3 Camadas de Canvas**:
  1. **onion-canvas**: Camada de Onion Skin (opacidade 40%, pointer-events: none)
  2. **main-canvas**: Canvas principal de desenho (z-10, cursor crosshair)
  3. **preview-canvas**: Preview do brush em tempo real (z-30, pointer-events: none)

**Background Pattern**:

- **Checkerboard de Transparência**: Grid branco/cinza (conic-gradient 2x2px)
- **Sincronizado com Zoom**: Escala dinamicamente com `2*zoom`

**Grid Overlay**:

- Div absoluto sobreposto
- Linear-gradient para linhas de 1px
- Toggle via botão (class `.visible`)
- Sincronizado com zoom (`background-size: zoom × zoom`)

### **1.3 Barra de Timeline (Frames)**

**Layout**:

- Altura 32 (128px total com controls)
- Dividida em 2 seções lado a lado:

**Seção Frames (Esquerda)**:

- Header:
  - Label "Frames"
  - Botão "Play" (verde)
  - Display FPS + Slider (1-24 FPS)
- Container scrollável horizontal
- **Frame Thumbnails**:
  - Quadrados 32×32px (8×8 ratio)
  - Background com preview do frame
  - Número do frame (canto inferior direito)
  - Border azul quando ativo
  - Botão + (dashed) para duplicar frame

**Seção Synth (Direita)**:

- Largura fixa 192px (w-48)
- Header:
  - Label "SYNTH"
  - Botão "Audio" (inicializa Tone.js)
- Grid 16×5 (80 células)
- Células clicáveis que alternam cor roxa

### **1.4 Sidebar Direita**

**Estrutura em 2 Painéis**:

**Painel Superior (35% altura) - CAMADAS**:

- Header com botão + (adicionar camada)
- Lista scrollável de Layer Items
- **Layer Item**:
  - Ícone olho/olho-riscado (toggle visibilidade)
  - Nome da camada (truncado)
  - Ícone lixeira (deletar)
  - Borda esquerda azul quando ativa
  - Ordem inversa (última no topo)

**Painel Inferior (65% altura) - TABS**:

**Sistema de Abas** (3 tabs):

1. **TAB CORES** (Ativa por padrão):

   - Grid 6 colunas de color swatches
   - 19 cores pré-definidas (PALETTE)
   - Clique para selecionar cor

2. **TAB BLOCOS**:

   - Botão "Salvar Bloco" (dashed border)
   - Lista de blocos disponíveis:
     - 6 blocos default (Grama, Terra, Pedra, Areia, Madeira, Água)
     - Blocos customizados salvos (localStorage)
   - Cada bloco:
     - Preview 24×24px (com noise se aplicável)
     - Nome
     - Selecionável (border azul)
   - Botão "Deselecionar Bloco" (aparece quando selecionado)

3. **TAB ATLAS / MAPA**:
   - **Estado Inicial**: Upload Zone
     - Label com ícone de mapa
     - Input file (hidden)
     - Texto "Carregar Atlas / Imagem"
     - Descrição "Isso define o tamanho do projeto"
   - **Estado Carregado**: Mini-map
     - Header com label "NAVEGADOR" + dimensões
     - Canvas minimap (aspect-ratio 1:1)
     - Viewport retangular sobreposto
     - Clicável para navegar
     - Arrasto para scroll

---

## ⚙️ 2. FUNCIONALIDADES DE CÓDIGO

### **2.1 Gestão de Projeto (ProjectManager)**

**Propriedades do Estado**:

```javascript
AppState = {
  width: 32, // Largura do canvas (dinâmica via Atlas)
  height: 32, // Altura (dinâmica)
  zoom: 15, // Nível de zoom (1-100)
  currentTool: "pencil",
  primaryColor: "#000000",
  brushSize: 1, // 1-64px
  activeBlock: null, // Bloco selecionado
  activeBlockPattern: null, // CanvasPattern do bloco
  activeBlockImage: null, // Image do bloco
  isDrawing: false,
  currentFrameIndex: 0,
  currentLayerIndex: 0,
  onionSkinEnabled: false,
  gridEnabled: true,
  isPlaying: false,
  fps: 8,
  frames: [], // Array de { layers: [...] }
  history: [], // Undo stack (JSON strings)
  customBlocks: [], // Blocos salvos no localStorage
  audioContextStarted: false,
  currentStep: 0,
};
```

**Métodos Principais**:

- `resizeCanvas(w, h)`: Redimensiona todos os canvas + atualiza zoom
- `createLayer(name)`: Cria objeto { name, canvas, ctx, visible }
- `addFrame()`: Adiciona frame com 1 camada default
- `addLayer(name)`: Adiciona camada ao frame atual
- `deleteLayer(idx)`: Remove camada (mínimo 1)
- `duplicateFrame(idx)`: Clona frame com todas as camadas
- `restoreState(state)`: Restaura snapshot do history
- `loadAtlas(file)`: Carrega imagem e redimensiona projeto
- `saveCurrentAsBlock()`: Salva frame atual como bloco custom

### **2.2 Sistema de Blocos & Patterns**

**Blocos Default** (6 tipos):

```javascript
[
  { name: "Grama", color: "#567d46", noise: true },
  { name: "Terra", color: "#5d4037", noise: true },
  { name: "Pedra", color: "#757575", noise: true },
  { name: "Areia", color: "#e0c097", noise: true },
  { name: "Madeira", color: "#4e342e", noise: true },
  { name: "Água", color: "#4fc3f7", noise: false },
];
```

**Geração de Pattern**:

1. Canvas 32×32px
2. Preenche com cor base
3. Se `noise: true`: Pinta 40 pixels aleatórios com transparência 0-20%
4. Converte para DataURL
5. Cria `CanvasPattern` com `createPattern(img, 'repeat')`

**Uso**:

- Ferramenta **Pencil**: Pinta com pattern contínuo
- Ferramenta **Stamp**: "Carimba" imagem em tamanho escalado

**Persistência**:

- `localStorage.getItem('pixelForge_blocks_v5')`
- Array JSON de `{ name, type: 'custom', data: dataURL }`

### **2.3 Ferramentas de Desenho**

**getPos(e)**: Converte coordenada do mouse para pixel do canvas

```javascript
{
  x: Math.floor((clientX - rect.left) / zoom),
  y: Math.floor((clientY - rect.top) / zoom)
}
```

**Comportamento por Ferramenta**:

1. **Pencil**:

   - Pinta quadrado `brushSize × brushSize`
   - Usa `activeBlockPattern` se bloco selecionado, senão `primaryColor`
   - Offset: `Math.floor(size/2)` para centralizar

2. **Eraser**:

   - `ctx.clearRect()` com mesmo tamanho do brush
   - Remove pixels (transparência)

3. **Bucket (Flood Fill)**:

   - Algoritmo stack-based
   - Se pattern (não string): Preenche canvas inteiro
   - Se cor sólida: Flood fill tradicional com comparação RGBA
   - Para após 1 clique (`isDrawing = false`)

4. **Stamp**:

   - Calcula multiplicador: `Math.max(1, Math.floor(brushSize/4)+1)`
   - Desenha imagem do bloco em `32×mult` pixels
   - Centralizado no cursor

5. **Picker (Eyedropper)**:
   - `getImageData(x, y, 1, 1)` para ler pixel
   - Converte RGBA para HEX
   - Seta como `primaryColor`
   - Volta automaticamente para Pencil

**Preview Canvas**:

- Atualiza em `onmousemove`
- Mostra preview do brush/stamp antes de pintar
- Stroke branco para contorno

### **2.4 Sistema de Camadas & Frames**

**Estrutura de Dados**:

```javascript
frames: [
  {
    layers: [
      {
        name: "Layer 1",
        canvas: <HTMLCanvasElement>,
        ctx: <Context2D>,
        visible: true
      }
    ]
  }
]
```

**Rendering Compositing**:

1. Limpa `main-canvas` e `onion-canvas`
2. Se Onion Skin ativo: Desenha frame anterior em `onion-canvas`
3. Itera camadas do frame atual (ordem correta)
4. Se `visible === true`: `drawImage(layer.canvas, 0, 0)`

**Layer Controls**:

- **Visibilidade**: Toggle com ícone olho
- **Seleção**: Clique na layer item
- **Deleção**: Ícone lixeira (mínimo 1 camada)
- **Ordem**: Visual invertida (última camada = topo da lista)

### **2.5 Sistema de Undo**

**Implementação**:

```javascript
saveState() {
  if(history.length > 20) history.shift();  // FIFO
  const state = {
    w, h,
    frames: [
      { layers: [{ name, visible, data: canvas.toDataURL() }] }
    ]
  };
  history.push(JSON.stringify(state));
}

undo() {
  const state = JSON.parse(history.pop());
  project.restoreState(state);
}
```

**Triggers**:

- Antes de qualquer `mousedown` no canvas
- Antes de deletar/duplicar frames
- Antes de adicionar camadas
- Antes de carregar Atlas

**Limitações**:

- Stack de 20 estados (manual memory management)
- Deep copy via JSON (serialização/deserialização)
- Imagens como DataURL (alto uso de memória)

### **2.6 Zoom & Viewport**

**Sistema de Zoom**:

```javascript
updateZoom(val) {
  zoom = clamp(val, 1, 100);
  const w = width × zoom;
  const h = height × zoom;
  container.style.width = w + 'px';
  container.style.height = h + 'px';

  // Sync backgrounds
  container.style.backgroundSize = `${2*zoom}px ${2*zoom}px`;
  gridOverlay.style.backgroundSize = `${zoom}px ${zoom}px`;
}
```

**Controles**:

- Botões +/- (incrementa/decrementa 1)
- Scroll com Ctrl (wheel event)
- Display atualizado: `Math.round(zoom * 100 / 10) + '%'`

**Auto-Fit (ao carregar Atlas)**:

```javascript
const fitW = (viewport.width - 40) / img.width;
const fitH = (viewport.height - 40) / img.height;
const bestFit = Math.floor(Math.min(fitW, fitH));
AppState.zoom = Math.max(1, bestFit);
```

### **2.7 Mini-map & Navegação**

**Minimap Canvas**:

- Dimensões = `width × height` do projeto
- Renderiza todas as camadas visíveis do frame atual
- Fundo branco (#ffffff) antes de compor

**Viewport Rectangle**:

```javascript
const pctW = Math.min(1, viewportWidth / (width × zoom));
const pctH = Math.min(1, viewportHeight / (height × zoom));
const scrollX = viewport.scrollLeft / (width × zoom);
const scrollY = viewport.scrollTop / (height × zoom);

rect.style.width = (pctW × 100) + '%';
rect.style.left = (scrollX × 100) + '%';
// ... (análogo para height/top)
```

**Interação**:

- Clique no minimap: Centraliza viewport naquele ponto
- Arrasto: Navegação contínua
- Sincronização: `onscroll` do viewport atualiza rect

**Cálculo de Centralização**:

```javascript
const pctX = clickX / minimapRect.width;
viewport.scrollLeft = (contentWidth × pctX) - (viewportWidth / 2);
```

### **2.8 Grid Overlay**

**Implementação**:

- Div absoluto com `pointer-events: none`
- Background: `linear-gradient` para linhas verticais/horizontais
- Linha de 1px física: `rgba(0,0,0,0.1) 1px, transparent 1px`
- Tamanho do tile: `zoom × zoom`

**Sincronização**:

```javascript
gridOverlay.style.backgroundSize = `${zoom}px ${zoom}px`;
gridOverlay.style.backgroundImage = `
  linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
  linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
`;
```

---

## 💾 3. PERSISTÊNCIA & I/O

### **3.1 Custom Blocks (localStorage)**

**Chave**: `pixelForge_blocks_v5`

**Estrutura**:

```json
[
  {
    "name": "Custom Block 1",
    "type": "custom",
    "data": "data:image/png;base64,..."
  }
]
```

**Operações**:

- **Load**: `JSON.parse(localStorage.getItem(...))`
- **Save**: `JSON.stringify(customBlocks)` → `localStorage.setItem(...)`
- **Add**: Captura frame atual, redimensiona para 32×32, converte para DataURL

### **3.2 Export GIF**

**Biblioteca**: gifshot v0.3.2 (CDN)

**Processo**:

```javascript
const imgs = frames.map((frame) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff"; // Fundo branco
  ctx.fillRect(0, 0, width, height);
  frame.layers.forEach((layer) => {
    if (layer.visible) ctx.drawImage(layer.canvas, 0, 0);
  });
  return canvas.toDataURL();
});

gifshot.createGIF(
  {
    images: imgs,
    gifWidth: width,
    gifHeight: height,
    interval: 1 / fps,
    sampleInterval: 10,
  },
  (obj) => {
    if (!obj.error) {
      const a = document.createElement("a");
      a.download = "anim.gif";
      a.href = obj.image;
      a.click();
    }
  }
);
```

**Configurações**:

- `interval`: Baseado no FPS slider (1-24 FPS)
- `sampleInterval: 10`: Qualidade da geração
- Fundo branco forçado para evitar transparência

### **3.3 Export PNG**

**Processo**:

```javascript
const canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");

// Compõe apenas camadas visíveis do frame atual
frames[currentFrameIndex].layers.forEach((layer) => {
  if (layer.visible) ctx.drawImage(layer.canvas, 0, 0);
});

const a = document.createElement("a");
a.download = "frame.png";
a.href = canvas.toDataURL();
a.click();
```

**Nota**: Exporta apenas o frame ativo, não toda a animação.

### **3.4 Load Atlas/Image**

**FileReader API**:

```javascript
reader.onload = (e) => {
  const img = new Image();
  img.onload = () => {
    // Auto-fit zoom
    // Resize canvas to img.width × img.height
    // Create 2 layers: "Ref (Atlas)" + "Pintura"
    // Draw image on first layer
    // Select second layer for editing
  };
  img.src = e.target.result;
};
reader.readAsDataURL(file);
```

**Mudanças no Estado**:

- `AppState.width/height` = dimensões da imagem
- `totalBars = 1` (reseta frames)
- Cria frame com 2 camadas automaticamente
- Layer 0: Referência (Atlas)
- Layer 1: Camada de pintura (ativa)
- Oculta upload zone, mostra minimap
- Troca para tab "Atlas"

---

## 🎵 4. SISTEMA DE ÁUDIO (SYNTH)

### **4.1 Tone.js Integration**

**Versão**: v14.8.49 (CDN Cloudflare)

**Inicialização**:

```javascript
document.getElementById("audio-start-btn").onclick = async () => {
  await Tone.start();
  if (Tone.context.state === "suspended") {
    await Tone.context.resume();
  }
  AppState.audioContextStarted = true;
};
```

**Nota**: Requer interação do usuário devido a políticas de autoplay.

### **4.2 Sequencer Grid**

**Estrutura**:

- Grid 16×5 (80 células)
- Células: `<div>` com classes Tailwind
- Toggle state: `.bg-[#bb9af7]` (roxo)

**Estado**:

- Não há conexão funcional com Tone.js no código atual
- Grid é puramente visual/interativo
- **Bug/Feature Missing**: Sem lógica de playback implementada

**Implementação Sugerida** (não presente):

```javascript
// Hipotético
cells.forEach((cell, idx) => {
  cell.onclick = () => {
    const row = Math.floor(idx / 16);
    const col = idx % 16;
    sequencerData[row][col] = !sequencerData[row][col];
  };
});
```

---

## 🔧 5. ARQUITETURA & FLUXO DE DADOS

### **5.1 Hierarquia de Classes**

**ProjectManager**:

- Singleton instanciado como `project`
- Responsável por CRUD de frames/layers
- Gerencia persistência (blocks)
- Controla resize do canvas

**AppState** (Objeto Global):

- Armazena todo o estado da aplicação
- Métodos utilitários (`switchTab`, `clearBlockSelection`, `undo`, `saveState`, `updateZoom`)
- Não é uma classe, apenas object literal

**render** (Objeto de Funções):

- Namespace para funções de renderização
- Métodos:
  - `all()`: Chama todos os renders
  - `canvas()`: Composita layers em main-canvas
  - `grid()`: Atualiza visibilidade do grid overlay
  - `minimap()`: Renderiza minimap canvas
  - `minimapViewport()`: Atualiza posição do rect
  - `layers()`: Renderiza lista de camadas
  - `frames()`: Renderiza thumbnails de frames
  - `blocks()`: Renderiza lista de blocos
  - `palette()`: Renderiza paleta de cores
  - `tools()`: Atualiza estado visual das ferramentas

### **5.2 Event Flow**

**Mouse Events no Canvas**:

1. `onmousedown` → `saveState()` → `isDrawing = true` → `handleDraw()`
2. `onmousemove` → Preview canvas update + conditional `handleDraw()`
3. `window.onmouseup` → `isDrawing = false`

**Tool-Specific Logic**:

- Pencil/Eraser: Contínuo enquanto `isDrawing`
- Bucket: Single-shot (`isDrawing = false` após fill)
- Stamp: Contínuo (carimbos múltiplos)
- Picker: Single-shot + tool switch

**Viewport Scroll**:

1. `viewport.onscroll` → `render.minimapViewport()`
2. Atualiza posição do rect baseado em `scrollLeft/scrollTop`

**Minimap Navigation**:

1. `mmWrapper.onmousedown` → `isNavigating = true` → `moveViewportTo()`
2. `window.mousemove` → conditional `moveViewportTo()`
3. `window.mouseup` → `isNavigating = false`

**Wheel Zoom**:

```javascript
viewport.addEventListener(
  "wheel",
  (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      AppState.updateZoom(zoom + (deltaY < 0 ? 1 : -1));
    }
  },
  { passive: false }
);
```

---

## 🐛 6. BUGS & LIMITAÇÕES IDENTIFICADAS

### **6.1 Sequencer Grid Não Funcional**

- **Problema**: Grid visual sem lógica de playback
- **Causa**: Nenhuma conexão com Tone.js além do `audioStart`
- **Sintoma**: Células alternam cor mas não tocam sons

### **6.2 Frame Animation Playback Missing**

- **Problema**: Botão "Play" não implementado
- **Causa**: `anim-play` button sem event listener
- **Sintoma**: FPS slider funciona, mas animação nunca executa

### **6.3 Onion Skin Toggle Sem Funcionalidade**

- **Problema**: Botão `btn-onion` não atualiza estado
- **Causa**: Event listener ausente
- **Sintoma**: Onion skin sempre desabilitado

### **6.4 Memory Leak Potencial**

- **Problema**: DataURL storage no undo history
- **Causa**: Base64 strings crescem rapidamente
- **Sintoma**: Uso de memória alto com muitos undos
- **Localização**: `saveState()` armazena imagens completas

### **6.5 Brush Size em Stamp Não Escala Linearmente**

- **Problema**: Multiplicador `Math.floor(size/4)+1` não intuitivo
- **Causa**: Lógica de escalamento complexa
- **Sintoma**: Tamanhos de brush pequenos (1-3) produzem stamps idênticos

### **6.6 Grid Overlay Pode Desalinhar em Zooms Extremos**

- **Problema**: Arredondamento de pixels em zooms muito baixos
- **Causa**: `background-size` calculado pode não dividir perfeitamente
- **Sintoma**: Linhas não alinham exatamente com pixels em zoom < 3

### **6.7 Custom Blocks Sem Validação**

- **Problema**: Aceita qualquer nome/data do localStorage
- **Causa**: Sem try/catch ou schema validation
- **Sintoma**: Pode crashar se data corrompido

---

## 📊 7. PALETA DE CORES

**19 Cores Pré-definidas**:

```javascript
[
  "#000000",
  "#1D2B53",
  "#7E2553",
  "#008751",
  "#AB5236",
  "#5F574F",
  "#C2C3C7",
  "#FFF1E8",
  "#FF004D",
  "#FFA300",
  "#FFEC27",
  "#00E436",
  "#29ADFF",
  "#83769C",
  "#FF77A8",
  "#FFCCAA",
  "#24283b",
  "#ffffff",
  "#5c6370",
];
```

**Inspiração**: PICO-8 palette expandida + tons custom

---

## 🎯 8. DEPENDÊNCIAS EXTERNAS

- **Tailwind CSS**: v3+ (CDN)
- **Font Awesome**: v6.4.0 (CDN Cloudflare)
- **Tone.js**: v14.8.49 (CDN Cloudflare)
- **gifshot.js**: v0.3.2 (CDN Cloudflare)

---

## ⚡ 9. PERFORMANCE & CONSTRAINTS

### **Limites Práticos**:

- **Canvas máximo**: Limitado por memória do browser (teoricamente 32k×32k, praticamente ~8k×8k)
- **Frames**: Sem limite hard, limitado por memória (cada frame = N layers × W × H × 4 bytes)
- **Layers por Frame**: Sem limite
- **Undo Stack**: 20 estados (manual cap)
- **Custom Blocks**: Limitado por localStorage (5-10MB típico)

### **Otimizações**:

- `image-rendering: pixelated` em todos os canvas
- Compositing apenas de layers visíveis
- Minimap renderizado apenas quando tab ativa
- Preview canvas separado (não re-renderiza main)

### **Pontos de Melhoria**:

- Implementar Web Workers para GIF generation
- IndexedDB para blocos custom (supera 5MB)
- Lazy loading de frames (carregar sob demanda)
- OffscreenCanvas para preview (melhor performance)

---

**Total**: ~1100 linhas de código HTML/CSS/JS inline, aplicação single-page completa para pixel art & animation. 🎨✨
