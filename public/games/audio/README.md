Peço desculpas! Você está certo. Vou fazer apenas o **INVENTÁRIO COMPLETO** do sistema sem modificar nada.

---

# 📋 INVENTÁRIO COMPLETO - Pixel Audio DAW 16.1

## 🎨 1. INTERFACE GRÁFICA (UI/UX)

### **1.1 Header (Barra Superior)**

- **Logo/Título**: "PIXEL DAW 16.1" com ícone
- **Transport Controls**:
  - LCD Display (formato `bar:beat:sixteenth`)
  - Input BPM (40-240)
  - Botão STOP (■)
  - Botão PLAY (▶) - toggleable
  - Botão EXPORT (●) - abre modal de gravação
- **File Management**:
  - Dropdown "Demos" (Classic Hit, Speed Run)
  - Botão AI (abre modal de geração)
  - Botão PNG (exporta canvas como imagem)
  - Botão JSON (salva projeto)
  - Botão Upload (carrega arquivo .json)

### **1.2 Painel Esquerdo (Mixer & Tracks)**

- **Master Track Card**:
  - Label "MASTER OUTPUT"
  - Ícone de sliders
  - Clicável para selecionar (borda destaca quando ativo)
- **Seção de Pistas**:

  - Header com contador + botão "+ ADD"
  - Lista scrollável de Track Cards
  - **Empty State**: Mensagem "Nenhuma pista..."

- **Track Card** (por pista):
  - **Drag Handle**: Ícone de grip (reorganizar via drag & drop)
  - **Color Picker**: Input `<color>` para cor da pista
  - **Track Info**:
    - Nome editável (inline input)
    - Tipo de instrumento (label pequeno)
  - **Controles**:
    - Botão **M** (Mute) - amarelo quando ativo
    - Botão **S** (Solo) - azul quando ativo
    - Botão **ARP** (Arpeggiator) - vermelho quando ativo
    - **Knob Volume** (rotativo, -60db a +6db)
    - **Knob Pan** (rotativo, -1 a +1)
    - Botão **Lixeira** (deletar pista)
    - Botão **Borracha** (limpar notas)

### **1.3 Painel Central (Sequencer)**

- **Canvas 640x640px**:
  - Grid 32x32 (1 pixel = 1 step horizontal × 1 nota vertical)
  - Background com padrão radial-gradient
  - Renderização via Canvas API 2D
  - Cursor de playback (linha branca vertical animada)
- **Coordenadas Display**: Canto inferior direito (X:Y)

- **Timeline Bar** (barra inferior):
  - Botões numerados `[1] [2] [3] ... [+]`
  - Botão ativo = verde (bar atual)
  - Botão tocando = borda branca pulsante
  - Botão `[+]` = adiciona novo compasso

### **1.4 Painel Direito (Inspector)**

- **Context-Sensitive**:
  - Se **nada selecionado**: Mensagem placeholder
  - Se **Master selecionado**:
    - Slider Volume Master
    - Slider Global Filter (100-20000 Hz)
    - Slider Reverb Mix (0-1)
  - Se **Pista selecionada**:
    - Nome + Tipo
    - Status do Arpeggiator (ON/OFF)
    - Botão "Configurar" (abre modal ARP)

### **1.5 Modals (Janelas Flutuantes)**

**Modal: AI Generator**

- Campo "Descreva sua música"
- TextArea com Prompt de Sistema (copiável)
- TextArea para colar JSON da IA
- Botões: Cancelar | 🎲 Gerar Local | Carregar

**Modal: Export Audio**

- Status de gravação
- Botões: Fechar | ● Iniciar Render | ■ Finalizar

**Modal: Add Track**

- Dropdown de instrumentos (3 categorias)
- Campo URL (apenas se tipo = "sampler")
- Color Picker + Nome
- Botões: Cancelar | Criar

**Modal: Arpeggiator**

- Dropdown Velocidade (8n/16n/32n)
- Dropdown Padrão (up/down/upDown)
- Botões: Fechar | Aplicar

---

## ⚙️ 2. FUNCIONALIDADES DE CÓDIGO

### **2.1 Audio Engine (Tone.js)**

**Sintetizadores Disponíveis**:

- `classic`: PolySynth Sine (ataque suave, release longo)
- `speed`: PolySynth Triangle (ataque rápido, 8-bit style)
- `bass` / `bass_guitar`: MonoSynth Square (filtro envelope)
- `pad`: PolySynth Triangle (ataque lento 0.5s)
- `acoustic_guitar`: PolySynth Triangle (decay curto)
- `bell`: PolySynth MetalSynth (harmonicity alta)
- `organ`: PolySynth Pulse (sustain alto)
- `cello`: PolySynth Sawtooth (ataque lento)
- `drums`: PolySynth MembraneSynth (4 faixas de altura)
- `sampler`: Sampler com URL customizável
- `silent`: Marcador visual (não produz som)

**Cadeia de Processamento Master**:

```
Instrument → Panner → Channel → Master Channel →
Filter (lowpass) → BitCrusher → Delay (8n) →
Reverb → Limiter (-0.5db) → Destination
```

**Efeitos Globais**:

- **Filter**: Lowpass 20kHz (ajustável)
- **BitCrusher**: 4-bit (wet 0-1)
- **Delay**: Feedback 0.2, tempo 8n
- **Reverb**: Decay 2.5s, wet 0.1

### **2.2 Sequenciador**

**Especificações**:

- **Grid**: 32 linhas (notas) × dinâmico (compassos × 32 steps)
- **Resolução**: 16th notes
- **Escala**: Pentatônica (C, D, E, G, A) × 7 oitavas
- **Mapeamento**: Linha 0 = nota alta | Linha 31 = nota baixa
- **Loop**: Infinito com modulo por `totalBars × STEPS_PER_BAR`

**Lógica de Reprodução** (`playStep`):

1. Calcula step atual (modulo do total)
2. Identifica bar atual
3. Atualiza UI (timeline + LCD)
4. Para cada track não mutado:
   - Detecta células ativas no step atual
   - **Se drums ou ARP**: Dispara nota imediatamente
   - **Se melódico**: Calcula duração (sustain lookahead até próximo gap)
5. Incrementa `DAW.step`

**Sustain Logic**:

- Verifica se nota anterior estava ativa
- Se nova nota: calcula duração olhando próximos 32 steps
- Se nota contínua: não retriggera

### **2.3 Sistema de Edição**

**Ferramentas de Desenho**:

- **Mouse Esquerdo**: Pinta pixel (valor = 1)
- **Mouse Direito**: Apaga pixel (valor = 0)
- **Drag Painting**: Mantém botão pressionado e arrasta
- **Coordinate Tracking**: Display X:Y atualiza em tempo real

**Navegação Multi-Bar**:

- Timeline mostra todos os compassos disponíveis
- Clique em número muda página visual (offset no canvas)
- Grid permanece consistente (acesso global via offset)

### **2.4 Undo System**

**Implementação**:

- Stack de 20 estados máximo (FIFO)
- Trigger: Antes de qualquer operação destrutiva (paint, clear, delete)
- Salva: Deep copy JSON do grid + metadados
- Restaura: Substitui grids atuais pelo snapshot
- **Atalho**: Ctrl+Z / Cmd+Z

### **2.5 Drag & Drop (Reordenar Pistas)**

**Fluxo**:

1. `dragstart` → Armazena índice da pista
2. `dragover` → Adiciona classe visual `.drag-over`
3. `drop` → Chama `moveTrack(from, to)`
4. `moveTrack` → Remove do índice antigo, insere no novo
5. Atualiza seleção se necessário
6. Re-renderiza lista

### **2.6 Arpeggiator**

**Modos**:

- `up`: Nota base + transposição +4 semitons
- `down`: Similar, invertido
- `upDown`: Nota base + 4st + 7st (tríade)

**Rates**: 8n / 16n / 32n

**Aplicação**: Triggerado em `playNote()` quando `track.arp.enabled === true`

---

## 💾 3. PERSISTÊNCIA & I/O

### **3.1 Save/Load Project (JSON)**

**Estrutura do Arquivo**:

```json
{
  "bpm": 120,
  "totalBars": 4,
  "master": { "vol": 0 },
  "fx": { "filter": 20000, "reverb": 0.1, "crusher": 0 },
  "tracks": [
    {
      "name": "Bass",
      "type": "bass",
      "color": "#00aaff",
      "grid": [[0,1,0,...], ...],  // 32 arrays de steps
      "volume": -6,
      "pan": 0,
      "arp": { "enabled": false, "rate": "16n", "type": "up" }
    }
  ]
}
```

### **3.2 Export Audio (MediaRecorder)**

**Processo**:

1. Cria `MediaStreamDestination` conectado ao Limiter
2. Inicializa `MediaRecorder` com stream de áudio
3. Coleta chunks via evento `ondataavailable`
4. Ao parar: Converte chunks em Blob (audio/webm)
5. Download via `<a>` temporário

**Formato**: WebM (codec padrão do browser)

### **3.3 Export Image (Canvas)**

**Método**: `canvas.toDataURL()` → PNG base64 → Download

### **3.4 AI Integration**

**Workflow**:

1. Usuário descreve música
2. Sistema gera prompt otimizado para LLM
3. Prompt explica:
   - Instrumentos disponíveis
   - Estrutura do JSON
   - Mapeamento de notas (rows/cols)
   - Boas práticas (minimalismo, ritmo claro)
4. Usuário copia prompt → Cola em Gemini/Claude
5. Usuário cola resposta JSON no campo
6. Sistema parseia e carrega via `loadFromData()`

**Gerador Local** (`generateRandomSong`):

- Cria bateria básica (kick 4/4, snare backbeat)
- Linha de baixo simples
- BPM aleatório 110-140

---

## 🐛 4. BUGS CONHECIDOS (IDENTIFICADOS NO CÓDIGO)

### **4.1 Grid Undersized (CRÍTICO)**

- **Problema**: Grid inicializado com `STEPS_PER_BAR * 16` colunas
- **Causa**: `totalBars` pode crescer além de 16
- **Sintoma**: Acesso a índices `undefined` quando bars > 16
- **Localização**: Construtor da classe `Track`, linha ~387

### **4.2 Boundary Checks Incompletos**

- **Problema**: `playStep()` só verifica `track.grid[0][currentStep]`
- **Causa**: Loop percorre todas as 32 linhas sem validação
- **Sintoma**: Erro se qualquer linha tiver tamanho diferente
- **Localização**: Função `playStep`, linha ~411

### **4.3 Sustain Lookahead Unsafe**

- **Problema**: Loop `for(let k=1; k<32; k++)` não valida bounds
- **Causa**: `currentStep+k` pode exceder tamanho do array
- **Sintoma**: Acesso a `undefined` em grids pequenos
- **Localização**: Função `playStep`, linha ~427

### **4.4 MediaRecorder Não Verifica Suporte**

- **Problema**: Assume `MediaRecorder` existe globalmente
- **Causa**: Browsers antigos ou ambientes sem API
- **Sintoma**: Crash ao tentar exportar áudio
- **Localização**: Função `initAudio`, linha ~379

### **4.5 Seletor CSS Incorreto**

- **HTML define**: `<div class="center-area">`
- **CSS define**: `.center-panel { ... }`
- **Sintoma**: Estilos não aplicados ao painel central

### **4.6 Drag Handlers Setup Race Condition**

- **Problema**: Event listeners atribuídos antes do DOM finalizar
- **Causa**: `innerHTML` recria elementos após attach
- **Sintoma**: Drag & drop intermitente

### **4.7 Knob Initial State**

- **Problema**: Knobs podem não refletir valores iniciais corretos
- **Causa**: `setupKnob` chamado com valores default da Track, não do estado atual
- **Sintoma**: Visual dessincroni zado com áudio

---

## 🎯 5. ARQUITETURA DE DADOS

### **5.1 Estado Global (DAW Object)**

```javascript
{
  tracks: Track[],           // Array de instâncias
  selection: {               // Seleção ativa
    type: 'none' | 'track' | 'master',
    index: number
  },
  isPlaying: boolean,
  bpm: number,
  step: number,              // Contador global de steps
  currentBarPage: number,    // Bar visível no canvas
  totalBars: number,         // Total de compassos
  recorder: MediaRecorder,
  audioChunks: Blob[],
  history: string[]          // JSON snapshots para undo
}
```

### **5.2 Classe Track**

```javascript
{
  id: number,
  name: string,
  type: string,              // 'drums', 'bass', etc.
  color: string,             // hex
  grid: number[][],          // [32 rows][dynamic cols]
  channel: Tone.Channel,
  panner: Tone.Panner,
  instrument: Tone.Instrument,
  arp: {
    enabled: boolean,
    rate: string,
    type: string
  }
}
```

---

## 🔌 6. DEPENDÊNCIAS EXTERNAS

- **Tone.js** v14.8.49 (CDN Cloudflare)
- **Lucide Icons** (unpkg, última versão)

---

## ⚡ 7. PERFORMANCE & LIMITAÇÕES

- **Grid máximo teórico**: 32 × (totalBars × 32) células
- **Tracks simultâneas**: Sem limite hard (limitado por CPU)
- **Undo stack**: 20 estados (gerenciamento manual de memória)
- **Canvas redraw**: A cada step durante playback + a cada interação

---

Esse é o inventário completo do sistema atual! 📦
