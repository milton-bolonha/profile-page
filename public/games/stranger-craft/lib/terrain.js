// terrain.js - Geração de terreno e manipulação de blocos
import { getLayeredNoise, getCaveDensity } from './noise.js';
import { Logger } from './debug.js';

export function getTerrainHeight(gx, gz, noise, BIOMES, gameState) {
    const biome = BIOMES[gameState.dimension];
    let n = getLayeredNoise(noise, gx, gz, 3, 0.5, 0.015);
    n = (n + 1) / 2;
    if (gameState.dimension === 'NORMAL') n = Math.pow(n, 2.0);
    else n = Math.pow(n, 1.5);
    const h = Math.floor(biome.baseHeight + n * biome.roughness);
    return { height: h, biome: biome };
}

export function getCityInfo(cx, cz, CHUNK_SIZE) {
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

export function getBlock(x, y, z, chunks, CHUNK_SIZE, CHUNK_HEIGHT, BLOCKS) {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    
    if (iy < 0 || iy >= CHUNK_HEIGHT) return BLOCKS.AIR;
    
    const cx = Math.floor(ix / CHUNK_SIZE), cz = Math.floor(iz / CHUNK_SIZE);
    const chunk = chunks[`${cx},${cz}`];
    
    if (!chunk || !chunk.data) return BLOCKS.AIR;
    
    const lx = (ix % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = (iz % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
    
    if (!chunk.data[lx] || !chunk.data[lx][iy]) return BLOCKS.AIR;
    
    return chunk.data[lx][iy]?.[lz] ?? BLOCKS.AIR;
}

export function isSolid(x, y, z, chunks, CHUNK_SIZE, CHUNK_HEIGHT, BLOCKS) {
    const type = getBlock(x, y, z, chunks, CHUNK_SIZE, CHUNK_HEIGHT, BLOCKS);
    return type !== BLOCKS.AIR && type !== BLOCKS.WATER && type !== BLOCKS.LEAVES && type !== BLOCKS.CORRUPTED_WATER;
}

export function setBlock(x, y, z, type, chunks, CHUNK_SIZE, CHUNK_HEIGHT, markChunkDirty, checkBlockPhysics) {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    const cx = Math.floor(ix / CHUNK_SIZE), cz = Math.floor(iz / CHUNK_SIZE);
    if (iy < 0 || iy >= CHUNK_HEIGHT) return;
    const chunk = chunks[`${cx},${cz}`];
    if (chunk) {
        const lx = (ix % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
        const lz = (iz % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
        chunk.data[lx][iy][lz] = type;
        chunk.dirty = true;
        if (lx === 0) markChunkDirty(cx - 1, cz);
        if (lx === CHUNK_SIZE - 1) markChunkDirty(cx + 1, cz);
        if (lz === 0) markChunkDirty(cx, cz - 1);
        if (lz === CHUNK_SIZE - 1) markChunkDirty(cx, cz + 1);
        checkBlockPhysics(ix, iy + 1, iz);
    }
}

export function markChunkDirty(cx, cz, chunks) {
    const c = chunks[`${cx},${cz}`];
    if (c) c.dirty = true;
}

export function checkBlockPhysics(x, y, z, getBlock, setBlock, CHUNK_HEIGHT, BLOCKS, BLOCK_PROPS) {
    if (y >= CHUNK_HEIGHT || y < 0) return;
    const block = getBlock(x, y, z);
    if (BLOCK_PROPS[block] && BLOCK_PROPS[block].gravity) {
        const below = getBlock(x, y - 1, z);
        if (below === BLOCKS.AIR || below === BLOCKS.WATER || below === BLOCKS.CORRUPTED_WATER) {
            setBlock(x, y, z, BLOCKS.AIR);
            setBlock(x, y - 1, z, block);
            setTimeout(() => {
                checkBlockPhysics(x, y + 1, z, getBlock, setBlock, CHUNK_HEIGHT, BLOCKS, BLOCK_PROPS);
                checkBlockPhysics(x, y - 1, z, getBlock, setBlock, CHUNK_HEIGHT, BLOCKS, BLOCK_PROPS);
            }, 100);
        }
    }
}

// Sistema de Web Workers para geração de chunks
let chunkWorkers = [];
let nextWorkerId = 0;
const MAX_WORKERS = 4; // Número de workers simultâneos

function getNextWorker() {
    if (chunkWorkers.length < MAX_WORKERS) {
        const worker = new Worker(`./lib/chunk-worker.js?v=${Date.now()}`);
        chunkWorkers.push({ worker, busy: false, id: nextWorkerId++ });
        return chunkWorkers[chunkWorkers.length - 1];
    }

    // Encontrar worker disponível
    const availableWorker = chunkWorkers.find(w => !w.busy);
    if (availableWorker) return availableWorker;

    // Todos ocupados, retornar null
    return null;
}

export function generateChunkAsync(cx, cz, CHUNK_SIZE, CHUNK_HEIGHT, WATER_LEVEL, BLOCKS, BIOMES, gameState, noiseSeed, noiseFunction) {
    return new Promise((resolve, reject) => {
        const workerData = getNextWorker();

        if (!workerData) {
            // Fallback para geração síncrona se todos workers estiverem ocupados
            // Logger.warn('Todos workers ocupados, gerando chunk na main thread');
            try {
                // Usar a função noise passada (a mesma que o worker usaria)
                const chunkData = generateChunk(cx, cz, CHUNK_SIZE, CHUNK_HEIGHT, WATER_LEVEL, BLOCKS, BIOMES, gameState, noiseFunction, getTerrainHeight, getCityInfo, getCaveDensity);
                resolve(chunkData);
            } catch (err) {
                Logger.error(`Erro ao gerar chunk sincronamente ${cx},${cz}:`, err);
                reject(err);
            }
            return;
        }

        workerData.busy = true;
        
        // Timeout de segurança (10s)
        const timeout = setTimeout(() => {
            if(workerData.busy) {
                Logger.error(`Timeout gerando chunk ${cx},${cz}`);
                workerData.worker.removeEventListener('message', handleMessage);
                workerData.busy = false;
                reject(new Error('Timeout'));
            }
        }, 10000);

        const handleMessage = (e) => {
            const { type, data } = e.data;

            if (type === 'CHUNK_GENERATED') {
                if (data.cx === cx && data.cz === cz) {
                    clearTimeout(timeout);
                    workerData.worker.removeEventListener('message', handleMessage);
                    workerData.busy = false;
                    resolve(data.chunkData);
                }
            } else if (type === 'ERROR') {
                if (data.cx === cx && data.cz === cz) {
                    clearTimeout(timeout);
                    workerData.worker.removeEventListener('message', handleMessage);
                    workerData.busy = false;
                    Logger.error('Erro no worker:', data.error);
                    reject(new Error(data.error));
                }
            }
        };

        const handleError = (error) => {
            clearTimeout(timeout);
            workerData.worker.removeEventListener('message', handleMessage);
            workerData.worker.removeEventListener('error', handleError);
            workerData.busy = false;
            reject(error);
        };

        workerData.worker.addEventListener('message', handleMessage);
        workerData.worker.addEventListener('error', handleError);

        workerData.worker.postMessage({
            type: 'GENERATE_CHUNK',
            data: {
                cx, cz, CHUNK_SIZE, CHUNK_HEIGHT, WATER_LEVEL, BLOCKS, BIOMES, gameState, noiseSeed
            }
        });
    });
}

// Função síncrona mantida como fallback
export function generateChunk(cx, cz, CHUNK_SIZE, CHUNK_HEIGHT, WATER_LEVEL, BLOCKS, BIOMES, gameState, noise, getTerrainHeight, getCityInfo, getCaveDensity) {
    const data = new Array(CHUNK_SIZE).fill(0).map(() => new Array(CHUNK_HEIGHT).fill(0).map(() => new Array(CHUNK_SIZE).fill(0)));
    const biome = BIOMES[gameState.dimension];
    const city = getCityInfo(cx, cz, CHUNK_SIZE);

    for(let x = 0; x < CHUNK_SIZE; x++) {
        for(let z = 0; z < CHUNK_SIZE; z++) {
            const wx = cx * CHUNK_SIZE + x;
            const wz = cz * CHUNK_SIZE + z;

            let terrain = getTerrainHeight(wx, wz, noise, BIOMES, gameState);
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

                        for(let y = 0; y <= h; y++) {
                            if(y === 0) data[x][y][z] = BLOCKS.BEDROCK;
                            else if(y < h) data[x][y][z] = BLOCKS.STONE;
                            else {
                                if(isRoad) data[x][y][z] = BLOCKS.ASPHALT;
                                else data[x][y][z] = BLOCKS.CONCRETE;
                            }
                        }

                        if (!isRoad) {
                            const lotX = Math.floor(wx / 16);
                            const lotZ = Math.floor(wz / 16);
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
                            for(let y = h + 1; y <= h + bH; y++) {
                                if(y >= CHUNK_HEIGHT) break;
                                const isWall = (bx === minW || bx === maxW || bz === minW || bz === maxW);
                                const relY = y - h;
                                const isFloor = (isCenter && relY % 5 === 0) || (y === h + bH);

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
                            if(!isCenter && !isRes && (seed % 10 > 8)) {
                                if(h + bH + 1 < CHUNK_HEIGHT) data[x][h + bH + 1][z] = BLOCKS.LAMP;
                            }
                        }

                        if(isRoad && isCenter && bx === 0 && bz === 0) {
                            if(h + 3 < CHUNK_HEIGHT) {
                                data[x][h + 1][z] = BLOCKS.CONCRETE;
                                data[x][h + 2][z] = BLOCKS.CONCRETE;
                                data[x][h + 3][z] = BLOCKS.LAMP;
                            }
                        }
                    }
                }
            }

            if (!isCityBlock) {
                for(let y = 0; y < CHUNK_HEIGHT; y++) {
                    if (y === 0) { data[x][y][z] = BLOCKS.BEDROCK; continue; }
                    let block = BLOCKS.AIR;
                    if (y > h) { if (y <= WATER_LEVEL) block = biome.water; }
                    else if (y === h) { block = (y <= WATER_LEVEL + 1) ? BLOCKS.SAND : biome.blockTop; }
                    else if (y > h - 4) { block = biome.blockSoil; }
                    else { block = biome.blockStone; }

                    if (block !== BLOCKS.AIR && block !== biome.water && y > 1) {
                        const surfaceDepth = h - y;
                        if (surfaceDepth > 4) {
                            if (getCaveDensity(noise, wx, y, wz) > biome.caveThreshold) block = BLOCKS.AIR;
                        }
                    }
                    data[x][y][z] = block;
                }
                if(data[x][h][z] === biome.blockTop && h > WATER_LEVEL && Math.random() < biome.treeChance) {
                    const th = h + 1;
                    for(let i = 0; i < 4; i++) if(th + i < CHUNK_HEIGHT) data[x][th + i][z] = (gameState.dimension === 'NORMAL' ? BLOCKS.LOG : BLOCKS.CORRUPTED_LOG);
                    const leafType = (gameState.dimension === 'NORMAL' ? BLOCKS.LEAVES : BLOCKS.AIR);
                    if (gameState.dimension === 'NORMAL' && th + 3 < CHUNK_HEIGHT) {
                        data[x][th + 3][z] = leafType;
                        if(x > 0) data[x - 1][th + 2][z] = leafType;
                        if(x < CHUNK_SIZE - 1) data[x + 1][th + 2][z] = leafType;
                        if(z > 0) data[x][th + 2][z - 1] = leafType;
                        if(z < CHUNK_SIZE - 1) data[x][th + 2][z + 1] = leafType;
                    }
                }
            }
        }
    }
    return data;
}
