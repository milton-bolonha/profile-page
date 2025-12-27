# 🐝 The Bee Boilerplate: Relatório & Guia de Aprendizagem

Este documento serve como log de troubleshooting, mapa de aprendizado e guia para o desenvolvimento do curso baseado no boilerplate.

## 🛠️ Troubleshooting Log

### 1. Configuração Inicial
- **Problema**: `space_plane.glb` não encontrado (Erro 404).
- **Solução**: Substituído por `bee.glb` existente.
- **Aprendizado**: Sempre verificar a existência de assets antes do carregamento. Implementar fallbacks visuais (`onError`).

### 2. Ajustes Visuais (Atual)
- **Ação**: Redução de escala da abelha e remoção de fundo/chão.
- **Objetivo**: Criar um elemento 3D flutuante limpo (overlay) sobre o site.

---

## 🗺️ Mapa de Aprendizagem & Guia de Desenvolvimento

### Fase 1: O Básico (Setup)
*   Como configurar uma cena Three.js no React (Scene, Camera, Renderer).
*   Carregamento de Modelos 3D (.glb/.gltf) com `GLTFLoader`.
*   Iluminação básica (Ambient + Directional).
*   Loop de Renderização (`requestAnimationFrame`).

### Fase 2: O Que Adicionar (Customização)
*   **Controles**: Adicionar `OrbitControls` para inspeção.
*   **Animação**: Como acessar e tocar clipes de animação do GLB (`AnimationMixer`).
*   **Interatividade**: Raycasting (clicar na abelha).
*   **Efeitos**: Adicionar pós-processamento (Bloom/Glow).

### Fase 3: Tópicos para Curso (Syllabus)
1.  **"Hello World 3D"**: Do zero ao primeiro cubo girando.
2.  **Importando Assets**: Trazendo modelos do Blender para a Web.
3.  **Luz e Sombra**: Como fazer o modelo parecer "real".
4.  **Otimização**: Boas práticas para rodar liso em qualquer dispositivo.
5.  **Boilerplate como Ferramenta**: Como usar este template para prototipar ideias rapidamente.

---

## 📝 Notas de Desenvolvimento
*   Manter o boilerplate independente (sem deps do jogo principal).
*   Focar em código legível para iniciantes.
