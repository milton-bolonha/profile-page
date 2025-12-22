// Sistema de Save/Load para Stranger Craft
// Salva apenas as modificações do mundo (delta) em localStorage

export class SaveLoadSystem {
  constructor() {
    this.worldChanges = {}; // { "x,y,z": blockType }
  }

  // Rastrear mudança de bloco
  trackChange(x, y, z, blockType) {
    const key = `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
    this.worldChanges[key] = blockType;
  }

  // Verificar se existe mudança salva
  getChange(x, y, z) {
    const key = `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
    return this.worldChanges.hasOwnProperty(key) ? this.worldChanges[key] : null;
  }

  // Salvar jogo
  saveGame(playerBody, gameState) {
    try {
      const saveData = {
        worldChanges: this.worldChanges,
        playerPosition: playerBody ? playerBody.translation() : { x: 0, y: 30, z: 0 },
        dimension: gameState.dimension,
        timestamp: Date.now(),
        version: "1.0"
      };
      
      localStorage.setItem("strangercraft_save", JSON.stringify(saveData));
      
      const count = Object.keys(this.worldChanges).length;
      console.log(`[SAVE] ${count} blocos modificados salvos`);
      
      return { success: true, count };
    } catch (e) {
      console.error("Erro ao salvar:", e);
      return { success: false, error: e.message };
    }
  }

  // Carregar jogo
  loadGame() {
    try {
      const saved = localStorage.getItem("strangercraft_save");
      if (!saved) {
        return { success: false, error: "Nenhum save encontrado" };
      }

      const saveData = JSON.parse(saved);
      
      // Limpar e restaurar worldChanges
      for (const key in this.worldChanges) delete this.worldChanges[key];
      Object.assign(this.worldChanges, saveData.worldChanges);
      
      const count = Object.keys(this.worldChanges).length;
      console.log(`[LOAD] ${count} blocos modificados carregados`);
      
      return { 
        success: true, 
        count,
        playerPosition: saveData.playerPosition,
        dimension: saveData.dimension
      };
    } catch (e) {
      console.error("Erro ao carregar:", e);
      return { success: false, error: e.message };
    }
  }

  // Limpar save
  clearSave() {
    localStorage.removeItem("strangercraft_save");
    for (const key in this.worldChanges) delete this.worldChanges[key];
  }
}
