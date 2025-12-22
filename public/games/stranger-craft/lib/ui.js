// ui.js - Interface do usuário
import * as THREE from 'three';

export function updateHotbar(interactionMode, selectedBlock, selectedBlueprintIndex, BLOCKS, BLOCK_PROPS, BLUEPRINTS, gameState, hotbarEl) {
    hotbarEl.innerHTML = '';
    
    if (interactionMode === 'BLOCK') {
        let pBlocks = gameState.dimension === 'NORMAL' ? [1, 2, 3, 7, 16, 17, 18, 10, 8] : [11, 12, 13, 11, 12, 13, 10, 14, 8];
        pBlocks.forEach((t, i) => {
            const d = document.createElement('div');
            d.className = 'slot' + (t === selectedBlock ? ' active' : '');
            const props = BLOCK_PROPS[t];
            if(props && props.color) d.style.backgroundColor = '#' + props.color.toString(16).padStart(6,'0');
            else d.style.backgroundColor = '#000';
            if(t===BLOCKS.GLASS || t===BLOCKS.CORRUPTED_WATER || t===BLOCKS.WATER) d.style.opacity = 0.5;
            hotbarEl.appendChild(d);
        });
        document.getElementById('block-info').innerText = "Bloco: " + BLOCK_PROPS[selectedBlock].name;
    } else {
        BLUEPRINTS.forEach((bp, i) => {
            const d = document.createElement('div');
            d.className = 'slot blueprint' + (i === selectedBlueprintIndex ? ' active' : '');
            d.innerText = bp.icon;
            hotbarEl.appendChild(d);
        });
        document.getElementById('block-info').innerText = "Projeto: " + BLUEPRINTS[selectedBlueprintIndex].name;
    }
}

export function updatePlayerUI(playerStats, gameState) {
    document.getElementById('health-fill').style.width = playerStats.health + '%';
    document.getElementById('oxygen-fill').style.width = playerStats.oxygen + '%';
    document.getElementById('stamina-fill').style.width = playerStats.stamina + '%';
    document.getElementById('oxygen-bar').style.opacity = playerStats.oxygen < 100 ? 1 : 0;
    const totalMinutes = Math.floor(gameState.time * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    document.getElementById('time-display').innerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function updateEnvironment(dt, gameState, scene, ambientLight) {
    if(gameState.dimension === 'NORMAL') {
        gameState.time += dt / gameState.dayDuration;
        if(gameState.time > 1.0) gameState.time -= 1.0;
    } else {
        gameState.lightningTimer -= dt;
        if (gameState.lightningTimer <= 0) {
            if (Math.random() < 0.1) {
                scene.background.setHex(0x550055);
                setTimeout(() => { if(gameState.dimension === 'UPSIDE_DOWN') scene.background.setHex(0x1a0505); }, 100);
            }
            gameState.lightningTimer = Math.random() * 5 + 2;
        }
    }

    const time = gameState.time;
    let skyColor = new THREE.Color();
    let fogColor = new THREE.Color();
    let fogDensity = 60;

    if (gameState.dimension === 'UPSIDE_DOWN') {
        skyColor.setHex(0x1a0505);
        fogColor.setHex(0x2a0000);
        fogDensity = 30;
        ambientLight.intensity = 0.3;
        if(scene.background.getHex() !== skyColor.getHex()) scene.background = skyColor;
    } else {
        if (time < 0.25 || time >= 0.75) skyColor.setHex(0x050510);
        else skyColor.setHex(0x87CEEB);
        if (time >= 0.2 && time < 0.25) skyColor.lerpColors(new THREE.Color(0x050510), new THREE.Color(0x87CEEB), (time - 0.2) / 0.05);
        if (time >= 0.7 && time < 0.75) skyColor.lerpColors(new THREE.Color(0x87CEEB), new THREE.Color(0x050510), (time - 0.7) / 0.05);
        fogColor.copy(skyColor);
        ambientLight.intensity = 0.8;
        if(scene.background.getHex() !== skyColor.getHex()) scene.background = skyColor;
    }
    scene.fog.color = fogColor;
    scene.fog.far = fogDensity;
}
