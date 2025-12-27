# 📝 Plano de Implementação: Boilerplate do Jogo

Este documento define o plano para criar o `BoilerplateGame`, uma versão simplificada e estática do `NeonFlightGame`, servindo como base limpa ("engine only") para novos desenvolvimentos.

## 🎯 Objetivos
1.  Criar um componente React/Three.js limpo.
2.  Manter a capacidade de carregar modelos GLB e renderizar a cena.
3.  Remover lógicas de gameplay (física, colisão, loop infinito, input de controle).
4.  Inserir como uma seção temporária na Home para visualização.

---

## 🛠️ Passos de Execução

### 1. Duplicação e Limpeza (`BoilerplateGame.tsx`)
Criar o arquivo `src/components/games/fly/components/BoilerplateGame.tsx` baseado no jogo atual, mas aplicando as seguintes remoções:

#### ❌ O que será REMOVIDO:
*   **Sistemas de Gameplay**: `PhysicsSystem`, `InputSystem` (reduzido ou removido), `UISystem` (simplificado).
*   **Geração Infinita**: `updateSpaceLevel`, `spawnSpaceObstacle`, lógica de "treadmill" do cenário.
*   **Física do Jogador**: Movimentação, rotação baseada em mouse, velocidade, inércia.
*   **Efeitos de Dinâmica**: Turbo, trilhas (trails), partículas de colisão, projéteis, inimigos.
*   **Lógica de Loop**: `updateGameLogic` será drasticamente reduzido.
*   **Cinemática**: Intro cinematográfica de voo e contagem regressiva.

#### ✅ O que será MANTIDO:
*   **Estrutura React**: `useEffect` para inicialização e cleanup do Three.js.
*   **Setup da Cena Three.js**: Criação de `Scene`, `Camera`, `Renderer`, `Lights`.
*   **Loader de Assets**: `GLTFLoader` para carregar o avião (`space_plane.glb`).
*   **Render Loop**: `requestAnimationFrame` simples (apenas `renderer.render`).
*   **UI Básica**: Tela de "Start" (Overlay HTML) para iniciar o contexto do canvas.
*   **Posicionamento Estático**: O avião ficará parado (ex: `0, 0, 0` ou flutuando levemente com uma animação de "idle" simples via `Math.sin`).

---

### 2. Integração na Home (`index.tsx`)
Adicionar o novo componente como uma seção temporária abaixo do jogo atual.

*   **Importar**: `import BoilerplateGame from '../components/games/fly/components/BoilerplateGame';`
*   **Adicionar Seção**: Criar um `SectionWrapper` com ID `boilerplate-section`.
*   **Renderizar**: Colocar `<BoilerplateGame />` dentro desta seção.

---

## 📋 Checklist de Código (Mental)

```typescript
// Exemplo da estrutura final esperada do BoilerplateGame.tsx
export default function BoilerplateGame() {
  // State: apenas o necessário para iniciar (ex: gameStarted)
  const [isStarted, setIsStarted] = useState(false);
  
  // Refs para Three.js
  const containerRef = useRef(null);
  
  // Init
  useEffect(() => {
    // 1. Setup Scene, Camera, Renderer
    // 2. Load GLB
    // 3. Add Lights
    // 4. Animation Loop (Renderer.render apenas, talvez uma rotação lenta do avião)
    // 5. Cleanup
  }, [isStarted]);

  return (
    <div>
      {/* Canvas Container */}
      {/* Start Screen Overlay */}
    </div>
  )
}
```

## 🚀 Próximos Passos (Para Você Aprovar)
1.  Posso executar a criação do arquivo `BoilerplateGame.tsx` agora?
2.  Em seguida, adicionarei ao `index.tsx`.
