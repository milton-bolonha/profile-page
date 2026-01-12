// validation.js - Validação de estado e dados
import { Logger } from './debug.js';

export function validateConfig(config, name) {
    if (!config) {
        Logger.error(`Configuration ${name} is null or undefined`);
        return false;
    }
    if (Object.keys(config).length === 0) {
        Logger.warn(`Configuration ${name} is empty`);
        return false;
    }
    return true;
}

export function validatePosition(x, y, z, chunks, getBlock) {
    // Validar se o chunk onde o jogador está existe
    // Nota: getBlock já lida internamente com chunks ausentes, mas aqui queremos saber explicitamente
    // Precisaria passar CHUNK_SIZE/HEIGHT, mas vamos assumir que getBlock cuida disso por enquanto
    
    // Verificar se a posição não é muito baixa (void check)
    if (y < -10) {
        Logger.warn(`Invalid position: Y=${y} is too low`);
        return false;
    }

    return true;
}

export function validateInitialization(state) {
    const errors = [];
    
    if (!state.physicsWorld) errors.push("Physics world not initialized");
    if (!state.playerBody) errors.push("Player body not initialized");
    if (!state.chunks || Object.keys(state.chunks).length === 0) errors.push("No initial chunks loaded");
    
    if (errors.length > 0) {
        Logger.error("Initialization validation failed", errors);
        return { valid: false, errors };
    }
    
    return { valid: true };
}
