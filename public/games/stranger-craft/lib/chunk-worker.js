// chunk-worker.js - Web Worker para geração de chunks (Restaurado do Backup + Fix LCG)

var CHUNK_SIZE, CHUNK_HEIGHT, WATER_LEVEL, BLOCKS, BIOMES, gameState, noise;

// --- Random Seed (EXATAMENTE COMO NO BACKUP) ---
function randomSeed(s) {
    return function() {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
}

// --- Noise System (Copiado do Backup + LCG) ---
function initNoise(rng) {
    const p = new Uint8Array(512);
    const perm = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    
    // Shuffle using the provided RNG
    for (let i = perm.length - 1; i > 0; i--) { 
        const j = Math.floor(rng() * (i + 1)); 
        [perm[i], perm[j]] = [perm[j], perm[i]]; 
    }
    
    for(let i=0; i<256; i++) p[256+i] = p[i] = perm[i];
    
    const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (t, a, b) => a + t * (b - a);
    const grad = (hash, x, y, z) => {
        const h = hash & 15;
        const u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    };
    
    return (x, y, z) => {
        const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
        x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
        const u = fade(x), v = fade(y), w = fade(z);
        const A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z, B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;
        return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], x-1, y, z)), lerp(u, grad(p[AB], x, y-1, z), grad(p[BB], x-1, y-1, z))), lerp(v, lerp(u, grad(p[AA+1], x, y, z-1), grad(p[BA+1], x-1, y, z-1)), lerp(u, grad(p[AB+1], x, y-1, z-1), grad(p[BB+1], x-1, y-1, z-1))));
    };
}

// --- Terrain Helpers (Copiado do Backup) ---

function getLayeredNoise(x, z, octaves, persistence, scale) {
    let total = 0, frequency = scale, amplitude = 1, maxValue = 0; 
    for(let i=0; i<octaves; i++) {
        // noise é uma variável global do worker
        total += noise(x * frequency, 0, z * frequency) * amplitude;
        maxValue += amplitude; amplitude *= persistence; frequency *= 2;
    }
    return total / maxValue;
}

function getTerrainHeight(gx, gz) {
    const biome = BIOMES[gameState.dimension];
    let n = getLayeredNoise(gx, gz, 3, 0.5, 0.015); 
    n = (n + 1) / 2; 
    if (gameState.dimension === 'NORMAL') n = Math.pow(n, 2.0); else n = Math.pow(n, 1.5); 
    const h = Math.floor(biome.baseHeight + n * biome.roughness);
    return { height: h, biome: biome };
}

function getCaveDensity(x, y, z) { return noise(x * 0.08, y * 0.12, z * 0.08); }

function getCityInfo(cx, cz) {
    const gridX = Math.floor(cx / 32);
    const gridZ = Math.floor(cz / 32);
    const gridSeed = Math.abs(Math.sin(gridX * 12.98 + gridZ * 78.23) * 43758.54);
    
    if ((gridSeed - Math.floor(gridSeed)) > 0.3) {
        const offsetX = Math.floor((gridSeed * 100) % 16);
        const offsetZ = Math.floor((gridSeed * 200) % 16);
        return {
            exists: true,
            worldX: (gridX * 32 + offsetX) * CHUNK_SIZE,
            worldZ: (gridZ * 32 + offsetZ) * CHUNK_SIZE,
            radius: 120
        };
    }
    return { exists: false };
}

function generateChunk(cx, cz) {
    const data = new Array(CHUNK_SIZE).fill(0).map(() => new Array(CHUNK_HEIGHT).fill(0).map(() => new Array(CHUNK_SIZE).fill(0)));
    const biome = BIOMES[gameState.dimension];
    const city = getCityInfo(cx, cz); 

    for(let x=0; x<CHUNK_SIZE; x++) {
        for(let z=0; z<CHUNK_SIZE; z++) {
            const wx = cx * CHUNK_SIZE + x;
            const wz = cz * CHUNK_SIZE + z;
            
            let terrain = getTerrainHeight(wx, wz);
            let h = terrain.height;
            let isCityBlock = false;
            let cityH = 15; 

            if (city.exists && gameState.dimension === 'NORMAL') {
                const dist = Math.sqrt(Math.pow(wx - city.worldX, 2) + Math.pow(wz - city.worldZ, 2));
                
                if (dist < city.radius) {
                    const edge = 30;
                    const blend = Math.max(0, Math.min(1, (dist - (city.radius - edge)) / edge));
                    h = Math.floor(cityH * (1 - blend) + h * blend);

                    if (blend < 0.1) { 
                        isCityBlock = true;
                        const isCenter = dist < 40;
                        const isRes = dist >= 40 && dist < 100;
                        
                        const bx = Math.abs(wx % 16);
                        const bz = Math.abs(wz % 16);
                        const roadW = isCenter ? 3 : 2;
                        const isRoad = (bx < roadW || bz < roadW);

                        for(let y=0; y<=h; y++) {
                            if(y===0) data[x][y][z] = BLOCKS.BEDROCK;
                            else if(y<h) data[x][y][z] = BLOCKS.STONE;
                            else {
                                if(isRoad) data[x][y][z] = BLOCKS.ASPHALT;
                                else data[x][y][z] = BLOCKS.CONCRETE;
                            }
                        }

                        if (!isRoad) {
                            const lotX = Math.floor(wx/16);
                            const lotZ = Math.floor(wz/16);
                            const seed = Math.abs(Math.sin(lotX * 12.3 + lotZ * 45.6) * 1000);
                            
                            let bH = 0;
                            let bMat = BLOCKS.CONCRETE;

                            if (isCenter) {
                                bH = 15 + Math.floor(seed % 25); 
                                bMat = (seed % 2 > 1) ? BLOCKS.CONCRETE : BLOCKS.OFFICE;
                            } else if (isRes) {
                                bH = 4 + Math.floor(seed % 6);
                                bMat = BLOCKS.BRICKS;
                            } else {
                                bH = 5 + Math.floor(seed % 6);
                                bMat = BLOCKS.OBSIDIAN; 
                            }

                            const minW = roadW, maxW = 15 - roadW;
                            for(let y=h+1; y<=h+bH; y++) {
                                if(y >= CHUNK_HEIGHT) break;
                                const isWall = (bx === minW || bx === maxW || bz === minW || bz === maxW);
                                const relY = y - h;
                                const isFloor = (isCenter && relY % 5 === 0) || (y === h+bH);
                                
                                if (isWall || isFloor) {
                                    if (relY < 3 && isWall && (bx === 8 || bz === 8)) {
                                        data[x][y][z] = BLOCKS.AIR;
                                    } else {
                                        data[x][y][z] = bMat;
                                    }
                                } else {
                                    data[x][y][z] = BLOCKS.AIR;
                                }
                            }
                            if(!isCenter && !isRes && (seed%10>8)) {
                                if(h+bH+1 < CHUNK_HEIGHT) data[x][h+bH+1][z] = BLOCKS.LAMP;
                            }
                        }
                        
                        if(isRoad && isCenter && bx===0 && bz===0) {
                            if(h+3 < CHUNK_HEIGHT) {
                                data[x][h+1][z] = BLOCKS.CONCRETE;
                                data[x][h+2][z] = BLOCKS.CONCRETE;
                                data[x][h+3][z] = BLOCKS.LAMP;
                            }
                        }
                    }
                }
            }

            if (!isCityBlock) {
                for(let y=0; y<CHUNK_HEIGHT; y++) {
                    if (y === 0) { data[x][y][z] = BLOCKS.BEDROCK; continue; }
                    let block = BLOCKS.AIR;
                    if (y > h) { if (y <= WATER_LEVEL) block = biome.water; } 
                    else if (y === h) { block = (y <= WATER_LEVEL + 1) ? BLOCKS.SAND : biome.blockTop; } 
                    else if (y > h - 4) { block = biome.blockSoil; } 
                    else { block = biome.blockStone; }

                    if (block !== BLOCKS.AIR && block !== biome.water && y > 1) {
                        const surfaceDepth = h - y;
                        if (surfaceDepth > 4) { 
                            if (getCaveDensity(wx, y, wz) > biome.caveThreshold) block = BLOCKS.AIR;
                        }
                    }
                    data[x][y][z] = block;
                }
                // Usar noise para gerar árvores de forma determinística
                const treeNoise = (noise(wx * 0.1, 0, wz * 0.1) + 1) / 2;
                if(data[x][h][z] === biome.blockTop && h > WATER_LEVEL && treeNoise < biome.treeChance) {
                     const th = h + 1;
                     for(let i=0; i<4; i++) if(th+i < CHUNK_HEIGHT) data[x][th+i][z] = (gameState.dimension==='NORMAL' ? BLOCKS.LOG : BLOCKS.CORRUPTED_LOG);
                     const leafType = (gameState.dimension==='NORMAL' ? BLOCKS.LEAVES : BLOCKS.AIR);
                     if (gameState.dimension === 'NORMAL' && th+3 < CHUNK_HEIGHT) {
                         data[x][th+3][z] = leafType;
                         if(x>0) data[x-1][th+2][z] = leafType; if(x<CHUNK_SIZE-1) data[x+1][th+2][z] = leafType;
                         if(z>0) data[x][th+2][z-1] = leafType; if(z<CHUNK_SIZE-1) data[x][th+2][z+1] = leafType;
                     }
                }
            }
        }
    }
    return data;
}

// --- Worker Message Handler ---
self.onmessage = function(e) {
    const msg = e.data;
    if (msg.type === 'GENERATE_CHUNK') {
        const d = msg.data;
        // Configurar variáveis globais do worker
        CHUNK_SIZE = d.CHUNK_SIZE;
        CHUNK_HEIGHT = d.CHUNK_HEIGHT;
        WATER_LEVEL = d.WATER_LEVEL;
        BLOCKS = d.BLOCKS;
        BIOMES = d.BIOMES;
        gameState = d.gameState;
        
        // Inicializar Noise com a seed recebida
        // IMPORTANTE: Sempre reinicializar para garantir que a seed está correta
        const rng = randomSeed(d.noiseSeed);
        noise = initNoise(rng);

        try {
            const chunkData = generateChunk(d.cx, d.cz);
            self.postMessage({
                type: 'CHUNK_GENERATED',
                data: { cx: d.cx, cz: d.cz, chunkData: chunkData }
            });
        } catch (err) {
            self.postMessage({
                type: 'ERROR',
                data: { cx: d.cx, cz: d.cz, error: err.message }
            });
        }
    }
};
