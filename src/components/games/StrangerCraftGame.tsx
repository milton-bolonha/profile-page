import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import RAPIER from "@dimforge/rapier3d-compat";

// Library Imports
import { randomSeed, createTextureAtlas, getFaceUVs } from "./stranger-craft/lib/utils";
import { createNoiseFunction, getLayeredNoise, getCaveDensity } from "./stranger-craft/lib/noise";
import {
    getTerrainHeight, getCityInfo, getBlock, isSolid, setBlock, markChunkDirty, checkBlockPhysics,
    generateChunkAsync, cleanupWorkers
} from "./stranger-craft/lib/terrain";
import { Entity, Zombie, MutantZombie, Builder } from "./stranger-craft/lib/entities";
import { Skeleton, Loot, Projectile } from "./stranger-craft/lib/new-entities";
import { SaveLoadSystem } from "./stranger-craft/lib/save-load";
import { initPhysics } from "./stranger-craft/lib/physics";
import { Logger } from "./stranger-craft/lib/debug";
import { validateConfig, validateInitialization } from "./stranger-craft/lib/validation";
import { buildChunk, disposeChunk } from "./stranger-craft/lib/rendering";
import { getHotbarBlocks, updateEnvironment } from "./stranger-craft/lib/ui";
import { createBlueprints } from "./stranger-craft/lib/blueprints";
import { InstancedParticleSystem } from "./stranger-craft/lib/particles";

export default function StrangerCraftGame({ onExit }: { onExit?: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    // React State for UI
    const [isStarted, setIsStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("Initializing...");
    const [uiState, setUiState] = useState({
        health: 100, oxygen: 100, stamina: 100,
        time: "12:00",
        dimension: "NORMAL",
        interactionMode: "BLOCK", // BLOCK or BLUEPRINT
        selectedBlock: 1, // ID
        selectedBlueprintIndex: 0,
        hotbar: [] as any[], // Items for display
        messages: "",
        showDamage: false,
        radarText: "Procurando sinal...",
        radarColor: "#ffff00",
        isFullscreen: false // New state
    });

    // Refs for Game Engine (Non-Reactive)
    const engineRef = useRef<{
        scene?: THREE.Scene;
        camera?: THREE.PerspectiveCamera;
        renderer?: THREE.WebGLRenderer;
        ambientLight?: THREE.AmbientLight; // Added
        controls?: PointerLockControls;
        physicsWorld?: any;
        playerBody?: any;
        playerCollider?: any;
        chunks: { [key: string]: any };
        entities: any[];
        particleSystem?: InstancedParticleSystem;
        gameState: any;
        playerStats: any;
        configs: any;
        requestID: number;
        saveLoadSystem?: SaveLoadSystem;
        selectedBlock?: number;
        selectedBlueprintIndex?: number;
        isSwitching?: boolean;
        cleanup?: () => void;
    }>({
        chunks: {},
        entities: [],
        gameState: {
            time: 0.5,
            dayDuration: 600,
            dimension: "NORMAL",
            lightningTimer: 0,
            spawnTimer: 0,
        },
        playerStats: {
            health: 100, maxHealth: 100,
            oxygen: 100, maxOxygen: 100,
            stamina: 100, maxStamina: 100,
        },
        configs: {},
        requestID: 0,
        selectedBlock: 1,
        selectedBlueprintIndex: 0
    });

    // --- INITIALIZATION ---
    useEffect(() => {
        if (!isStarted) return;

        const initGame = async () => {
            setIsLoading(true);
            setLoadingText("Carregando Configurações...");

            try {
                const [blocksConfig, biomesConfig, gameConfig, blueprintsConfig, inlineData] = await Promise.all([
                    fetch("/games/stranger-craft/config/blocks.json").then((r) => r.json()),
                    fetch("/games/stranger-craft/config/biomes.json").then((r) => r.json()),
                    fetch("/games/stranger-craft/config/game.json").then((r) => r.json()),
                    fetch("/games/stranger-craft/config/blueprints.json").then((r) => r.json()),
                    fetch("/games/stranger-craft/config/inline-data.json").then((r) => r.json()),
                ]);

                // Store configs
                const e = engineRef.current;
                e.configs = {
                    BLOCKS: blocksConfig.BLOCKS,
                    BLOCK_PROPS: blocksConfig.BLOCK_PROPS,
                    UV_MAP: blocksConfig.UV_MAP,
                    BIOMES: biomesConfig,
                    gameConfig,
                    blueprintsConfig,
                    inlineData
                };

                // Constants
                const { BLOCKS, BLOCK_PROPS, UV_MAP, BIOMES, gameConfig: gConfig } = e.configs;
                const { world, player } = gConfig;
                const { CHUNK_SIZE, CHUNK_HEIGHT, RENDER_DISTANCE, PHYSICS_DISTANCE, SPAWN_DISTANCE, DESPAWN_DISTANCE, WATER_LEVEL } = world;
                const { PLAYER_HALF_HEIGHT, PLAYER_RADIUS } = player;

                setLoadingText("Gerando Texturas...");
                // Three.js Setup
                const width = containerRef.current?.clientWidth || window.innerWidth;
                const height = containerRef.current?.clientHeight || window.innerHeight;

                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0x87ceeb);
                scene.fog = new THREE.Fog(0x87ceeb, 20, RENDER_DISTANCE * CHUNK_SIZE - 5);
                e.scene = scene;

                const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
                // Safe initial position to avoid black screen inside blocks
                camera.position.set(0, 80, 0);
                e.camera = camera;

                const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
                renderer.setSize(width, height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                renderer.shadowMap.enabled = false;
                if (canvasRef.current) {
                    canvasRef.current.innerHTML = ''; // Clear
                    canvasRef.current.appendChild(renderer.domElement);
                }
                e.renderer = renderer;

                const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
                scene.add(ambientLight);
                e.ambientLight = ambientLight;

                const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
                sunLight.position.set(50, 100, 50);
                scene.add(sunLight);

                e.particleSystem = new InstancedParticleSystem(scene, 10000);
                e.controls = new PointerLockControls(camera, renderer.domElement);
                e.saveLoadSystem = new SaveLoadSystem();

                // FORCE LOCK on start if in fullscreen
                if (document.fullscreenElement) {
                    e.controls.lock();
                    setUiState(s => ({ ...s, isFullscreen: true }));
                }

                // Textures
                const textureAtlas = await createTextureAtlas();
                const materialOpaque = new THREE.MeshBasicMaterial({ map: textureAtlas, vertexColors: true, side: THREE.DoubleSide });
                const materialTrans = new THREE.MeshBasicMaterial({ map: textureAtlas, transparent: true, opacity: 1.0, alphaTest: 0.1, side: THREE.DoubleSide, vertexColors: true });

                // RNG & Noise
                const SEED = Math.random() * 10000;
                const rng = randomSeed(SEED);
                const noise = createNoiseFunction(rng);

                // Blueprints
                const BLUEPRINTS = createBlueprints(BLOCKS);

                // Helper Wrappers
                const getFaceUVsWrapper = (type: number, faceName: string) => getFaceUVs(type, faceName, BLOCKS, UV_MAP);
                const getBlockWrapper = (x: number, y: number, z: number) => {
                    const saved = e.saveLoadSystem?.getChange(x, y, z);
                    if (saved !== null && saved !== undefined) return saved;
                    return getBlock(x, y, z, e.chunks, CHUNK_SIZE, CHUNK_HEIGHT, BLOCKS);
                };
                const isSolidWrapper = (x: number, y: number, z: number) => isSolid(x, y, z, e.chunks, CHUNK_SIZE, CHUNK_HEIGHT, BLOCKS);
                const markChunkDirtyWrapper = (cx: number, cz: number) => markChunkDirty(cx, cz, e.chunks);
                const setBlockWrapper = (x: number, y: number, z: number, type: number) => {
                    e.saveLoadSystem?.trackChange(x, y, z, type);
                    setBlock(x, y, z, type, e.chunks, CHUNK_SIZE, CHUNK_HEIGHT, markChunkDirtyWrapper, checkBlockPhysicsWrapper);
                };
                const checkBlockPhysicsWrapper = (x: number, y: number, z: number) => checkBlockPhysics(x, y, z, getBlockWrapper, setBlockWrapper, CHUNK_HEIGHT, BLOCKS, BLOCK_PROPS);
                const getTerrainHeightWrapper = (gx: number, gz: number) => getTerrainHeight(gx, gz, noise, BIOMES, e.gameState);
                const getCityInfoWrapper = (cx: number, cz: number) => getCityInfo(cx, cz, CHUNK_SIZE);
                const generateChunkWrapper = async (cx: number, cz: number) => await generateChunkAsync(cx, cz, CHUNK_SIZE, CHUNK_HEIGHT, WATER_LEVEL, BLOCKS, BIOMES, e.gameState, SEED, noise);

                setLoadingText("Inicializando Física...");
                const physicsData = await initPhysics(PLAYER_HALF_HEIGHT, PLAYER_RADIUS, getTerrainHeightWrapper);
                e.physicsWorld = physicsData.physicsWorld;
                e.playerBody = physicsData.playerBody;
                e.playerCollider = physicsData.playerCollider;

                // Add Builder NPC
                const h = getTerrainHeightWrapper(5, 5).height;
                e.entities.push(new Builder(15, h + 10, 15, scene, e.physicsWorld, BLOCKS, getTerrainHeightWrapper, setBlockWrapper, getCityInfoWrapper, CHUNK_SIZE, DESPAWN_DISTANCE));

                setLoadingText("Gerando Mundo...");
                await generateInitialChunks(scene, e.physicsWorld, e.playerBody.translation(), CHUNK_SIZE, RENDER_DISTANCE, generateChunkWrapper, e.chunks, markChunkDirtyWrapper);

                // Build Physics for Initial Chunks
                buildInitialPhysics(scene, e.physicsWorld, e.playerBody, e.chunks, CHUNK_SIZE, CHUNK_HEIGHT, PHYSICS_DISTANCE, BLOCKS, BLOCK_PROPS, materialOpaque, materialTrans, getFaceUVsWrapper, isSolidWrapper, getBlockWrapper);

                // Spawn adjustment
                const pPos = e.playerBody.translation();
                const groundH = getTerrainHeightWrapper(pPos.x, pPos.z).height;
                if (pPos.y < groundH + 2) {
                    e.playerBody.setTranslation({ x: pPos.x, y: groundH + 5, z: pPos.z }, true);
                }

                setIsLoading(false);
                setLoadingText("");

                // Setup Hotbar
                updateReactHotbar(e.gameState.dimension, e.gameState.interactionMode, e.configs);

                // Event Listeners (Keyboard)
                const keys: { [key: string]: boolean } = {};

                // --- HELPER FUNCTIONS (Moved up for const/arrow definitions) ---
                const buildChunkWrapper = (cx: number, cz: number) => {
                    buildChunk(cx, cz, e.chunks, scene, e.physicsWorld, e.playerBody, CHUNK_SIZE, CHUNK_HEIGHT, PHYSICS_DISTANCE, BLOCKS, BLOCK_PROPS, materialOpaque, materialTrans, getFaceUVsWrapper, isSolidWrapper, getBlockWrapper);
                };

                const takeDamage = (amount: number) => {
                    e.playerStats.health = Math.max(0, e.playerStats.health - amount);
                    setUiState(s => ({ ...s, health: e.playerStats.health, showDamage: true }));
                    setTimeout(() => setUiState(s => ({ ...s, showDamage: false })), 100);

                    if (e.playerStats.health <= 0) {
                        // Death / Reset Logix
                        if (e.gameState.dimension === "UPSIDE_DOWN") {
                            switchDimension();
                        } else {
                            const h = getTerrainHeightWrapper(0, 0).height;
                            e.playerBody.setTranslation({ x: 0, y: h + 10, z: 0 }, true);
                            e.playerBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
                            e.playerStats.health = 100;
                            e.playerStats.oxygen = 100;
                            e.playerStats.stamina = 100;
                            // Clear enemies
                            e.entities.forEach(ent => {
                                if (ent.remove) ent.remove();
                            });
                            e.entities = [];
                            // Add Builder back
                            e.entities.push(new Builder(10, h + 5, 10, scene, e.physicsWorld, BLOCKS, getTerrainHeightWrapper, setBlockWrapper, getCityInfoWrapper, CHUNK_SIZE, DESPAWN_DISTANCE));
                        }
                    }
                };

                const switchDimension = () => {
                    if (e.isSwitching) return;
                    e.isSwitching = true; // Lock physics loop
                    setUiState(s => ({ ...s, messages: "VIAJANDO..." }));

                    // Cleanup Chunks
                    for (const k in e.chunks) {
                        disposeChunk(e.chunks[k], e.scene, e.physicsWorld);
                        delete e.chunks[k];
                    }
                    // Clear Entities
                    e.entities.forEach((ent) => { if (ent.remove) ent.remove(); });
                    e.entities = [];

                    if (e.gameState.dimension === "NORMAL") {
                        e.gameState.dimension = "UPSIDE_DOWN";
                        e.scene!.fog = new THREE.Fog(0x2a0000, 10, 60); // Dark Red
                        e.scene!.background = new THREE.Color(0x1a0505);
                        setUiState(s => ({ ...s, dimension: "UPSIDE_DOWN", messages: "MUNDO INVERTIDO" }));
                    } else {
                        e.gameState.dimension = "NORMAL";
                        e.scene!.fog = new THREE.Fog(0x87ceeb, 20, RENDER_DISTANCE * CHUNK_SIZE - 5);
                        e.scene!.background = new THREE.Color(0x87ceeb);
                        setUiState(s => ({ ...s, dimension: "NORMAL", messages: "MUNDO SUPERIOR" }));
                    }

                    // Reset Player High to avoid falling immediately
                    const pos = e.playerBody.translation();
                    const safePos = { x: pos.x, y: 150, z: pos.z }; // High up
                    e.playerBody.setTranslation(safePos, true);
                    e.playerBody.setLinvel({ x: 0, y: 0, z: 0 }, true);

                    // Update Hotbar
                    updateReactHotbar(e.gameState.dimension, e.gameState.interactionMode, e.configs);

                    // Force regenerate near chunks
                    generateInitialChunks(scene, e.physicsWorld, safePos, CHUNK_SIZE, RENDER_DISTANCE, generateChunkWrapper, e.chunks, markChunkDirtyWrapper).then(() => {
                        const h = getTerrainHeightWrapper(safePos.x, safePos.z).height;
                        // Safe update in next frame tick logic if needed, but since we are paused, it's safer.
                        // HOWEVER, calling setTranslation here is still risky if loop is running. 
                        // But we set e.isSwitching = true.
                        // We will add check in renderLoop.

                        // Use a slight timeout to ensure we are not in a step
                        setTimeout(() => {
                            if (e.playerBody) {
                                e.playerBody.setTranslation({ x: safePos.x, y: h + 5, z: safePos.z }, true);
                                e.playerBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
                            }
                            e.isSwitching = false; // Unlock
                        }, 100);
                    });
                };

                const updatePlayer = (dt: number, keys: any) => {
                    if (!e.playerBody) return;
                    if (e.isSwitching) return; // Prevent player update during dimension switch
                    const velocity = e.playerBody.linvel();

                    // Fall Damage
                    const deltaY = velocity.y - (e.playerStats.lastVelocityY || 0);
                    if (deltaY > 35 && (e.playerStats.lastVelocityY || 0) < -25) {
                        takeDamage(Math.floor((deltaY - 35) / 2));
                    }
                    e.playerStats.lastVelocityY = velocity.y;

                    const pos = e.playerBody.translation();
                    const eyeY = pos.y + 0.6;

                    // Oxygen
                    const headBlock = getBlockWrapper(pos.x, eyeY, pos.z);
                    if (headBlock === BLOCKS.WATER || headBlock === BLOCKS.CORRUPTED_WATER) {
                        e.playerStats.oxygen = Math.max(0, e.playerStats.oxygen - 20 * dt);
                        if (e.playerStats.oxygen <= 0) takeDamage(10 * dt);
                    } else {
                        e.playerStats.oxygen = Math.min(100, e.playerStats.oxygen + 30 * dt);
                    }

                    // Stamina Regen
                    if (!keys["ShiftLeft"] && !keys["Space"]) {
                        e.playerStats.stamina = Math.min(100, e.playerStats.stamina + 10 * dt);
                    }

                    // Movement
                    if (e.controls && e.controls.isLocked) {
                        let speed = 8.0;
                        if (keys["ShiftLeft"] && e.playerStats.stamina > 0) {
                            speed = 13.0;
                            e.playerStats.stamina = Math.max(0, e.playerStats.stamina - 15 * dt);
                        }

                        // Direction Calculation: Horizontal ONLY (ignore Pitch)
                        // Robust "FPS Style" movement: W is always Horizon Forward
                        const frontVector = new THREE.Vector3();
                        e.camera!.getWorldDirection(frontVector);
                        frontVector.y = 0;
                        frontVector.normalize();

                        const rightVector = new THREE.Vector3();
                        rightVector.crossVectors(frontVector, e.camera!.up).normalize();

                        const moveDir = new THREE.Vector3();

                        if (keys["KeyW"]) moveDir.add(frontVector);
                        if (keys["KeyS"]) moveDir.sub(frontVector);
                        if (keys["KeyD"]) moveDir.add(rightVector);
                        if (keys["KeyA"]) moveDir.sub(rightVector);

                        if (moveDir.length() > 0) moveDir.normalize().multiplyScalar(speed);

                        e.playerBody.setLinvel({ x: moveDir.x, y: velocity.y, z: moveDir.z }, true);

                        if (keys["Space"]) {
                            const ray = new RAPIER.Ray({ x: pos.x, y: pos.y, z: pos.z }, { x: 0, y: -1, z: 0 });
                            // Cast ray excluding player
                            const hit = e.physicsWorld.castRay(ray, 1.05, true, undefined, undefined, undefined, e.playerBody);
                            if (hit && e.playerStats.stamina > 5) {
                                e.playerBody.setLinvel({ x: velocity.x, y: 12.0, z: velocity.z }, true);
                                e.playerStats.stamina -= 5;
                            }
                        }
                    } else {
                        // Dampen velocity check (Friction/Air Resistance)
                        // "Slider" feel requires preserving some momentum
                        const damp = Math.pow(0.001, dt); // Very strong friction for walking, but not instant
                        // actually, standard FPS instant stop is usually desired, but user asked for "sliding".
                        // Let's try a softer damp to allow micro-sliding.

                        // Use linear interpolation to 0
                        const d = 15.0 * dt;
                        let vx = velocity.x;
                        let vz = velocity.z;

                        if (vx > 0) vx = Math.max(0, vx - d);
                        else if (vx < 0) vx = Math.min(0, vx + d);

                        if (vz > 0) vz = Math.max(0, vz - d);
                        else if (vz < 0) vz = Math.min(0, vz + d);

                        e.playerBody.setLinvel({ x: vx, y: velocity.y, z: vz }, true);
                    }

                    // Sync Camera (with Y-Smoothing to hide physics micro-jitters)
                    const t = e.playerBody.translation();


                    // Void Check
                    if (t.y < -30) {
                        if (t.y < -50) {
                            if (e.gameState.dimension === 'NORMAL') {
                                switchDimension();
                            } else {
                                // Reset void in upside down -> death
                                takeDamage(100);
                            }
                        }
                    } else if (t.y > 120 && e.gameState.dimension === 'UPSIDE_DOWN') {
                        switchDimension();
                    }
                };

                const handleAction = (button: number) => {
                    // 0 = Break, 2 = Place
                    const camPos = e.camera!.position.clone();
                    const camDir = new THREE.Vector3(); e.camera!.getWorldDirection(camDir);

                    // Raycast with Interaction Groups:
                    // Ray is Group 1, Filters Group 1 (Terrain).
                    // Player is Group 2, so Ray will IGNORE Player.
                    // 0x00010001: Member 1 (High 16), Filter 1 (Low 16)
                    const hit = e.physicsWorld.castRay(new RAPIER.Ray(camPos, camDir), 6.0, true, 0x00010001);

                    // Safety check: Needs hit AND normal
                    if (hit && hit.normal) {
                        // FIX: Use camPos as origin since valid Ray started there
                        const hitPoint = camPos.clone().add(camDir.clone().multiplyScalar(hit.toi));
                        const n = hit.normal;
                        const target = hitPoint.clone().add(new THREE.Vector3(n.x, n.y, n.z).multiplyScalar(button === 2 ? 0.5 : -0.5));
                        const bx = Math.floor(target.x), by = Math.floor(target.y), bz = Math.floor(target.z);

                        console.log(`Click Action: ${button}, HitDist: ${hit.toi.toFixed(3)}, Block: ${bx},${by},${bz}`);

                        if (button === 0) {
                            setBlockWrapper(bx, by, bz, BLOCKS.AIR);
                        } else {
                            // Use synced ref value
                            const type = e.gameState.interactionMode === "BLOCK" ? (e.selectedBlock || 1) : BLOCKS.STONE;
                            if (type) setBlockWrapper(bx, by, bz, type);
                        }
                    } else {
                        console.log("Raycast Missed");
                    }
                };

                const handleInteract = () => {
                    // Placeholder
                };

                const handleToggleMode = (bps: any, blks: any, props: any) => {
                    const newMode = e.gameState.interactionMode === 'BLOCK' ? 'BLUEPRINT' : 'BLOCK';
                    e.gameState.interactionMode = newMode;
                    updateReactHotbar(e.gameState.dimension, newMode, e.configs);
                };

                const handleSelectSlot = (idx: number, bps: any, blks: any) => {
                    if (e.gameState.interactionMode === 'BLOCK') {
                        const hBlocks = getHotbarBlocks(e.gameState.dimension);
                        if (hBlocks[idx]) {
                            e.selectedBlock = hBlocks[idx]; // Sync Ref
                            setUiState(s => ({ ...s, selectedBlock: hBlocks[idx] }));
                        }
                    } else {
                        e.selectedBlueprintIndex = idx; // Sync Ref
                        setUiState(s => ({ ...s, selectedBlueprintIndex: idx }));
                    }
                };

                const handleKeyDown = (ev: KeyboardEvent) => {
                    keys[ev.code] = true;
                    if (ev.code === "KeyF") handleInteract();
                    if (ev.code === "KeyG") handleToggleMode(BLUEPRINTS, BLOCKS, BLOCK_PROPS);
                    if (ev.code.startsWith("Digit")) {
                        const idx = parseInt(ev.code.replace("Digit", "")) - 1;
                        if (idx >= 0 && idx < 9) handleSelectSlot(idx, BLUEPRINTS, BLOCKS);
                    }
                };

                const handleKeyUp = (ev: KeyboardEvent) => { keys[ev.code] = false; };

                const handleMouseClick = () => {
                    // Always try to lock if in fullscreen (check document directly to avoid stale state)
                    if (document.fullscreenElement && e.controls && !e.controls.isLocked) {
                        e.controls.lock();
                    }
                };

                const handleMouseDown = (ev: MouseEvent) => {
                    if (document.fullscreenElement && e.controls && !e.controls.isLocked) {
                        e.controls.lock();
                        return; // Don't fire action on the click that locks
                    }
                    if (!e.controls?.isLocked) return;
                    if (ev.button === 0) handleAction(0); // Left
                    if (ev.button === 2) handleAction(2); // Right
                };

                window.addEventListener("keydown", handleKeyDown);
                window.addEventListener("keyup", handleKeyUp);
                window.addEventListener("click", handleMouseClick);
                window.addEventListener("mousedown", handleMouseDown);

                const handleFullScreenChange = () => {
                    const isFull = !!document.fullscreenElement;
                    setUiState(s => ({ ...s, isFullscreen: isFull }));
                    if (isFull && e.controls && !e.controls.isLocked) {
                        e.controls.lock();
                    }
                };
                const onFullScreenChange = () => handleFullScreenChange();
                document.addEventListener("fullscreenchange", onFullScreenChange);
                // ...

                // WINDOW RESIZE FIX
                const onWindowResize = () => {
                    if (containerRef.current && e.camera && e.renderer) {
                        const w = containerRef.current.clientWidth || window.innerWidth;
                        const h = containerRef.current.clientHeight || window.innerHeight;
                        if (w > 0 && h > 0) {
                            e.camera.aspect = w / h;
                            e.camera.updateProjectionMatrix();
                            e.renderer.setSize(w, h);
                        }
                    }
                };
                window.addEventListener("resize", onWindowResize);

                // ...

                // --- GAME LOOP ---
                const clock = new THREE.Clock();
                let prevTime = performance.now();
                let accumulator = 0;
                const stepSize = 1 / 60; // Fixed 60Hz Physics

                const renderLoop = () => {
                    if (!isStarted) return; // Stop if stopped
                    const e = engineRef.current;
                    if (!e || !e.scene || !e.camera || !e.renderer) return;

                    const newTime = performance.now();
                    let frameDt = (newTime - prevTime) / 1000;
                    prevTime = newTime;
                    // Cap dt to avoid death spiral
                    if (frameDt > 0.1) frameDt = 0.1;

                    accumulator += frameDt;

                    if (e.isSwitching) {
                        // Skip physics loop completely if switching
                    } else if (e.physicsWorld && e.playerBody) {

                        // --- Fixed TimeStep Physics Loop ---
                        while (accumulator >= stepSize) {
                            try {
                                e.physicsWorld.timestep = stepSize;
                                e.physicsWorld.step();

                                // Update Game Logic (at 60Hz)
                                updatePlayer(stepSize, keys);

                                // Entities
                                e.entities.forEach(ent => ent.update(stepSize, e.playerBody.translation(), e.gameState, e.physicsWorld, takeDamage));

                                // Particles
                                if (e.particleSystem) e.particleSystem.update(stepSize, e.playerBody.translation(), e.gameState.dimension === 'UPSIDE_DOWN');

                                // Environment (Timer)
                                e.gameState.lightningTimer -= stepSize;
                                updateEnvironment(stepSize, e.gameState, scene, e.ambientLight!);

                                // World Gen (can run at fixed step for consistency)
                                updateWorld(stepSize, e.playerBody.translation(), CHUNK_SIZE, CHUNK_HEIGHT, RENDER_DISTANCE, PHYSICS_DISTANCE, scene, e.physicsWorld, e.chunks, generateChunkWrapper, markChunkDirtyWrapper, buildChunkWrapper);

                            } catch (err) {
                                console.error("Physics Crash:", err);
                                try { e.playerBody.setTranslation({ x: 0, y: 100, z: 0 }, true); e.playerBody.setLinvel({ x: 0, y: 0, z: 0 }, true); } catch (e2) { }
                            }
                            accumulator -= stepSize;
                        }

                        // --- Camera Smoothing (Interpolation) ---
                        // Runs every frame (e.g. 144Hz)
                        if (e.camera && e.playerBody) {
                            const t = e.playerBody.translation();
                            const targetPos = new THREE.Vector3(t.x, t.y + 0.6, t.z);

                            // High speed lerp (smoothing)
                            // 15 = fast but smooth. 10 = very smooth but draggy.
                            // We use a time-based factor to be framerate independent visual
                            const smoothFactor = 15.0;
                            const lerpAlpha = Math.min(1.0, smoothFactor * frameDt);

                            // Teleport if too far
                            if (e.camera.position.distanceTo(targetPos) > 4.0) {
                                e.camera.position.copy(targetPos);
                            } else {
                                e.camera.position.lerp(targetPos, lerpAlpha);
                            }
                        }
                    }

                    // Render
                    if (e.renderer && e.scene && e.camera) {
                        e.renderer.render(e.scene, e.camera);
                    }


                    // UI Updates (Throttle)
                    if (Math.random() < 0.1) {
                        setUiState(prev => ({
                            ...prev,
                            time: new Date(e.gameState.time * 1000).toISOString().substr(14, 5),
                        }));
                    }

                    e.requestID = requestAnimationFrame(renderLoop);
                };

                // Start Loop
                renderLoop();

                // Force resize on mount/start
                onWindowResize();

                e.cleanup = () => {
                    window.removeEventListener("keydown", handleKeyDown);
                    window.removeEventListener("keyup", handleKeyUp);
                    window.removeEventListener("click", handleMouseClick);
                    window.removeEventListener("mousedown", handleMouseDown);
                    document.removeEventListener("fullscreenchange", onFullScreenChange);
                    window.removeEventListener("resize", onWindowResize);

                    // CRITICAL: Unlock cursor and exit fullscreen to "kill" game feel
                    if (document.pointerLockElement) document.exitPointerLock();
                    if (e.controls) e.controls.unlock();
                };

            } catch (err) {
                console.error(err);
                setLoadingText("Erro no Carregamento.");
            }
        };

        if (isStarted) initGame();

        return () => {
            if (engineRef.current.requestID) cancelAnimationFrame(engineRef.current.requestID);
            cleanupWorkers();
            if (engineRef.current.cleanup) engineRef.current.cleanup();
        };
    }, [isStarted]);

    // UI Updates
    const updateReactHotbar = (dim: string, mode: string, configs: any) => {
        if (!configs.BLOCKS) return;
        let items = [];
        if (mode === 'BLOCK') {
            const blocks = getHotbarBlocks(dim);
            items = blocks.map(b => ({ type: 'block', id: b, color: configs.BLOCK_PROPS[b]?.color }));
        } else {
            // Blueprints
            items = [1, 2, 3].map(i => ({ type: 'bp', id: i, label: `Proj ${i}` }));
        }
        setUiState(s => ({ ...s, hotbar: items }));
    };

    // --- RENDER ---
    return (
        <div ref={containerRef} className="relative w-full h-full min-h-[600px] mt-[120px] bg-black overflow-hidden font-sans select-none">
            {/* Canvas */}
            <div ref={canvasRef} className="absolute inset-0" />

            {/* Loading */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
                    <div className="text-yellow-500 text-2xl font-bold animate-pulse">{loadingText}</div>
                </div>
            )}

            {/* Start Screen */}
            {!isStarted && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur z-40">
                    <h1 className="text-6xl text-cyan-400 font-bold mb-4 tracking-tighter drop-shadow-lg glitch-effect">STRANGER CRAFT</h1>
                    <p className="text-cyan-200/50 mb-8 tracking-widest uppercase text-sm">Dimensional Voxel Architect</p>
                    <button onClick={() => {
                        setIsStarted(true);
                        // Attempt fullscreen immediately
                        containerRef.current?.requestFullscreen().catch(err => console.log("Fullscreen request denied", err));
                    }} className="px-10 py-4 bg-cyan-600/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all font-bold tracking-widest">
                        ENTER SIMULATION
                    </button>
                    <p className="mt-4 text-xs text-white/30">Click to Start • F11 for Fullscreen if needed</p>
                </div>
            )}

            {/* In-Game UI - shown when started */}
            {isStarted && !isLoading && (
                <>
                    {/* HUD - Only if Fullscreen */}
                    {uiState.isFullscreen && (
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Crosshair */}
                            <div className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 border-2 border-white/50 rounded-full" />

                            {/* Stats */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 w-64">
                                <div className="h-4 bg-gray-900 border border-gray-700/50 relative overflow-hidden">
                                    <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${uiState.health}%` }} />
                                </div>
                                <div className="h-4 bg-gray-900 border border-gray-700/50 relative overflow-hidden">
                                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uiState.oxygen}%` }} />
                                </div>
                                <div className="h-2 bg-gray-900 border border-gray-700/50 relative overflow-hidden">
                                    <div className="h-full bg-yellow-500 transition-all duration-300" style={{ width: `${uiState.stamina}%` }} />
                                </div>
                            </div>

                            {/* Radar & Time */}
                            <div className="absolute top-4 right-4 text-right">
                                <div className="text-xs font-mono mb-1" style={{ color: uiState.radarColor }}>{uiState.radarText}</div>
                                <div className="text-4xl font-bold text-white/90 drop-shadow-md">{uiState.time}</div>
                            </div>

                            {/* Hotbar */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 backdrop-blur rounded-lg border border-white/10">
                                {uiState.hotbar.map((item, i) => (
                                    <div key={i} className={`w-12 h-12 border-2 flex items-center justify-center text-xs font-bold ${uiState.selectedBlock === item.id ? 'border-yellow-400 scale-110' : 'border-white/20'}`}
                                        style={{ backgroundColor: item.color ? `#${item.color.toString(16).padStart(6, '0')}` : '#333' }}>
                                        {item.type === 'bp' ? item.label : ''}
                                    </div>
                                ))}
                            </div>

                            {/* Damage Overlay */}
                            <div className={`absolute inset-0 bg-red-500/30 transition-opacity duration-300 ${uiState.showDamage ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                    )}

                    {/* Fullscreen Warning - Only if NOT Fullscreen and Started */}
                    {!uiState.isFullscreen && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50">
                            <h2 className="text-red-500 text-3xl font-bold mb-4">MODO TELA CHEIA NECESSÁRIO</h2>
                            <p className="text-white mb-6">Para jogar Stranger Craft, use o modo Tela Cheia.</p>
                            <button onClick={() => containerRef.current?.requestFullscreen()} className="px-8 py-3 bg-white text-black font-bold rounded hover:bg-gray-200">
                                Entrar em Tela Cheia
                            </button>
                            <button onClick={() => { setIsStarted(false); onExit?.(); }} className="mt-4 text-gray-400 underline text-sm">
                                Voltar ao Menu
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// Helper: Initial Chunk Generation
async function generateInitialChunks(scene: any, physicsWorld: any, pPos: any, CHUNK_SIZE: number, RENDER_DISTANCE: number, genChunk: any, chunks: any, markDirty: any) {
    const px = Math.floor(pPos.x / CHUNK_SIZE);
    const pz = Math.floor(pPos.z / CHUNK_SIZE);
    const radius = 2; // Initial area
    const promises = [];
    for (let x = -radius; x <= radius; x++) {
        for (let z = -radius; z <= radius; z++) {
            const cx = px + x, cz = pz + z;
            const key = `${cx},${cz}`;
            chunks[key] = { generating: true, dirty: false };
            promises.push(genChunk(cx, cz).then((d: any) => {
                chunks[key] = { data: d, dirty: true };
                markDirty(cx, cz);
            }));
        }
    }
    await Promise.all(promises);
}

function buildInitialPhysics(scene: any, physicsWorld: any, playerBody: any, chunks: any, CHUNK_SIZE: number, CHUNK_HEIGHT: number, PHYSICS_DISTANCE: number, BLOCKS: any, BLOCK_PROPS: any, matO: any, matT: any, getUVs: any, isSolid: any, getBlk: any) {
    for (const key in chunks) {
        if (chunks[key].dirty) {
            const [cx, cz] = key.split(",").map(Number);
            buildChunk(cx, cz, chunks, scene, physicsWorld, playerBody, CHUNK_SIZE, CHUNK_HEIGHT, PHYSICS_DISTANCE, BLOCKS, BLOCK_PROPS, matO, matT, getUVs, isSolid, getBlk);
        }
    }
}

// Missing Helper for updateWorld logic (simplified)
function updateWorld(dt: any, pos: any, CHUNK_SIZE: any, CHUNK_HEIGHT: any, RENDER_DISTANCE: any, PHYSICS_DISTANCE: any, scene: any, physicsWorld: any, chunks: any, genChunk: any, markDirty: any, buildChunkFn: any) {
    // Basic logic to generate pending chunks and clean up distant ones
    const px = Math.floor(pos.x / CHUNK_SIZE);
    const pz = Math.floor(pos.z / CHUNK_SIZE);

    // Simple radius check for generation
    for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
        for (let z = -RENDER_DISTANCE; z <= RENDER_DISTANCE; z++) {
            const cx = px + x, cz = pz + z;
            const key = `${cx},${cz}`;
            if (!chunks[key]) {
                chunks[key] = { generating: true };
                genChunk(cx, cz).then((d: any) => {
                    chunks[key] = { data: d, dirty: true };
                    markDirty(cx, cz);
                });
            }
        }
    }

    // Build some dirty chunks
    let built = 0;
    const sortedChunks = Object.keys(chunks).filter(k => chunks[k].dirty && !chunks[k].generating).sort((a, b) => {
        const [ax, az] = a.split(",").map(Number);
        const [bx, bz] = b.split(",").map(Number);
        const da = Math.abs(ax - px) + Math.abs(az - pz);
        const db = Math.abs(bx - px) + Math.abs(bz - pz);
        return da - db;
    });

    for (const k of sortedChunks) {
        const [cx, cz] = k.split(",").map(Number);
        buildChunkFn(cx, cz);
        built++;
        if (built >= 4) break;
    }

    // LOD Physics Update
    for (const key in chunks) {
        const chunk = chunks[key];
        const [cx, cz] = key.split(",").map(Number);
        if (chunk.rigidBody) {
            if (Math.abs(cx - px) > PHYSICS_DISTANCE || Math.abs(cz - pz) > PHYSICS_DISTANCE) {
                if (chunk.collider) physicsWorld.removeCollider(chunk.collider, false);
                physicsWorld.removeRigidBody(chunk.rigidBody);
                chunk.collider = null;
                chunk.rigidBody = null;
            }
        } else if (!chunk.rigidBody && chunk.data) {
            if (Math.abs(cx - px) <= PHYSICS_DISTANCE && Math.abs(cz - pz) <= PHYSICS_DISTANCE) {
                // Mark dirty to force physics rebuild (buildChunk handles render & physics)
                // Optimally we'd separate them, but marking dirty works.
                if (!chunk.dirty) {
                    chunk.dirty = true;
                }
            }
        }
    }
}
