import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SimpleNoise } from "../lib/SimpleNoise";
import { setCursor, showFloatingScore } from "../utils/helpers";
import {
  createEngineParticles,
  updateEngineParticles,
  spawnConfetti,
  updateConfetti,
} from "../utils/particles";
import {
  initSpaceLevel,
  spawnPlanetaryBodies,
  spawnSpaceDebris,
  updateSpaceLevel,
} from "../utils/scene";
import {
  initTurboEffects,
  toggleTurboVisuals,
  updateTurboVisuals,
} from "../utils/turbo";
import { setupPhysicsSystem } from "../systems/PhysicsSystem";
import { setupCameraSystem } from "../systems/CameraSystem";
import { setupUISystem } from "../systems/UISystem";
import { setupInputSystem } from "../systems/InputSystem";

const NeonFlightGame = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const playerRef = useRef(null);

  const uiRefs = useRef({
    introScreen: null,
    pauseScreen: null,
    hud: null,
    turboStatus: null,
    speedBox: null,
    scoreBox: null,
    energyFill: null,
    loadingMsg: null,
    countdown: null,
    turboHint: null,
    thankYouScreen: null,
    menuBtn: null,
  });

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // --- GAME STATE ---
    const gameState = {
      gameActive: false,
      isPaused: false,
      controlsLocked: false,
      isPointerLocked: false,
      isStartingCinematic: false,
      cinematicStartTime: 0,

      paperIntegrity: 100,
      score: 0,
      speed: 0,
      rotationZ: 0,
      rotationX: 0,
      verticalVelocity: 0,

      isRolling: false,
      rollProgress: 0,
      rollDirection: 1,

      isTurbo: false,
      turboTimer: 0,
      hasUsedTurbo: false,

      isCinematic: false,
      loopProgress: 0,
      preLoopY: 0,

      lastShotTime: 0,
      virtualMouseX: 0,
      virtualMouseY: 0,
      mouseSensitivity: 0.002,

      keys: {
        w: false,
        a: false,
        s: false,
        d: false,
        space: false,
        f: false,
        c: false,
        z: false,
        p: false,
      },
    };

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.005);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 2.5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    canvasRef.current.appendChild(renderer.domElement);

    // Lights
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.1);
    sunLight.position.set(100, 50, -100);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xcceeff, 0.3);
    fillLight.position.set(-100, 30, -50);
    scene.add(fillLight);

    const bottomLight = new THREE.DirectionalLight(0x8888ff, 0.15);
    bottomLight.position.set(0, -50, 0);
    scene.add(bottomLight);

    const topLight = new THREE.DirectionalLight(0x8888ff, 0.15);
    topLight.position.set(0, 50, 0);
    scene.add(topLight);

    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.6);
    scene.add(ambientLight);

    const simpleNoise = new SimpleNoise();

    // --- ASSETS ---
    let loadedGLB = null;
    let isModelLoading = true;

    const loader = new GLTFLoader();
    uiRefs.current.loadingMsg &&
      (uiRefs.current.loadingMsg.style.display = "block");
    loader.load(
      "https://raw.githubusercontent.com/Domenicobrz/R3F-takes-flight/episode_1/public/assets/models/airplane.glb",
      (gltf) => {
        loadedGLB = gltf.scene;
        loadedGLB.scale.set(0.4, 0.4, 0.4);
        loadedGLB.rotation.y = Math.PI;
        loadedGLB.traverse((o) => {
          if (o.isMesh) {
            o.material = new THREE.MeshStandardMaterial({
              color: 0xeeeeee,
              roughness: 0.3,
              metalness: 0.8,
            });
          }
        });
        isModelLoading = false;
        uiRefs.current.loadingMsg &&
          (uiRefs.current.loadingMsg.style.display = "none");
      }
    );

    // --- GAME VARIABLES ---
    let spaceGroup;
    let turboGroup;
    let speedEffectGroup;
    let turboTubes = [];
    let tunnelSegments = [];
    let wormholeParticles;
    let planetaryBodies = [];
    let spaceObstacles = [];
    let projectiles = [];
    let spaceDebris = [];
    let engineParticles = null;
    let confettiParticles = [];
    const trails = [];
    const trailLength = 60;
    let starsSystem;

    // --- SYSTEMS ---
    const physicsSystem = setupPhysicsSystem(gameState, playerRef, scene);
    const cameraSystem = setupCameraSystem(gameState, playerRef, camera);
    const uiSystem = setupUISystem(gameState, uiRefs);
    const inputSystem = setupInputSystem(gameState);

    // --- PARTICLE WRAPPER FUNCTIONS ---
    const spawnConfettiWrapper = (pos, count) => {
      spawnConfetti(pos, count, confettiParticles, scene);
    };

    const updateConfettiWrapper = () => {
      updateConfetti(confettiParticles, scene);
    };

    const updateEngineParticlesWrapper = () => {
      updateEngineParticles(engineParticles, gameState.isTurbo);
    };

    // --- GAMEPLAY FUNCTIONS ---
    const fireWeapon = () => {
      if (
        !gameState.gameActive ||
        gameState.controlsLocked ||
        gameState.isPaused
      )
        return;
      const now = Date.now();
      if (now - gameState.lastShotTime < 200) return;
      gameState.lastShotTime = now;

      const geo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const bullet = new THREE.Mesh(geo, mat);
      bullet.position.copy(playerRef.current.position);
      bullet.position.y += 0.3;
      bullet.rotation.x = Math.PI / 2;

      const glowGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 8);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      bullet.add(glow);

      scene.add(bullet);
      projectiles.push({ mesh: bullet, life: 80 });
    };

    const spawnSpaceObstacle = () => {
      if (Math.random() > 0.015) return;
      const size = 2 + Math.random() * 1.5;
      const geo = new THREE.BoxGeometry(size, size, size);
      const edges = new THREE.EdgesGeometry(geo);
      const mat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2,
      });
      const mesh = new THREE.LineSegments(edges, mat);

      const solidMat = new THREE.MeshBasicMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const solidBox = new THREE.Mesh(geo, solidMat);
      mesh.add(solidBox);

      const angle = Math.random() * Math.PI * 2;
      const rad = 8 + Math.random() * 15;
      mesh.position.set(Math.cos(angle) * rad, Math.sin(angle) * rad, -300);
      mesh.rotation.set(Math.random(), Math.random(), Math.random());

      scene.add(mesh);
      spaceObstacles.push({
        mesh,
        rotVel: {
          x: Math.random() * 0.03,
          y: Math.random() * 0.03,
          z: Math.random() * 0.03,
        },
        size,
      });
    };

    const updateProjectiles = () => {
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.mesh.position.z -= 6.0;
        p.life--;

        for (let j = spaceObstacles.length - 1; j >= 0; j--) {
          const obs = spaceObstacles[j];
          if (p.mesh.position.distanceTo(obs.mesh.position) < obs.size + 1.5) {
            spawnConfettiWrapper(obs.mesh.position, 15);
            const flashGeo = new THREE.SphereGeometry(obs.size * 1.5, 16, 16);
            const flashMat = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.8,
            });
            const flash = new THREE.Mesh(flashGeo, flashMat);
            flash.position.copy(obs.mesh.position);
            scene.add(flash);

            let flashLife = 10;
            const animateFlash = () => {
              flashLife--;
              flash.scale.multiplyScalar(1.1);
              flash.material.opacity -= 0.08;
              if (flashLife > 0) requestAnimationFrame(animateFlash);
              else {
                scene.remove(flash);
                flash.geometry.dispose();
                flash.material.dispose();
              }
            };
            animateFlash();

            scene.remove(obs.mesh);
            spaceObstacles.splice(j, 1);
            scene.remove(p.mesh);
            projectiles.splice(i, 1);
            gameState.score += 500;
            showFloatingScore(500, "hit");
            break;
          }
        }
        if (p.life <= 0) {
          scene.remove(p.mesh);
          projectiles.splice(i, 1);
        }
      }
    };

    const updateSpaceObstacles = (moveSpeed) => {
      for (let i = spaceObstacles.length - 1; i >= 0; i--) {
        const obs = spaceObstacles[i];
        obs.mesh.rotation.x += obs.rotVel.x;
        obs.mesh.rotation.y += obs.rotVel.y;
        obs.mesh.rotation.z += obs.rotVel.z;
        obs.mesh.position.z += moveSpeed * 1.5;

        if (obs.mesh.position.z > 20) {
          scene.remove(obs.mesh);
          spaceObstacles.splice(i, 1);
          continue;
        }

        if (
          obs.mesh.position.distanceTo(playerRef.current.position) <
          obs.size + 1.5
        ) {
          if (!gameState.isCinematic && !gameState.isRolling) {
            gameState.paperIntegrity -= 15;
            spawnConfettiWrapper(obs.mesh.position, 8);
            scene.remove(obs.mesh);
            spaceObstacles.splice(i, 1);
            gameState.verticalVelocity += 0.2;
          }
        }
      }
    };

    const createPlayerMesh = () => {
      if (playerRef.current) scene.remove(playerRef.current);
      playerRef.current = new THREE.Group();
      playerRef.current.position.set(0, 5, 0);
      if (loadedGLB) {
        const model = loadedGLB.clone();
        playerRef.current.add(model);
      } else {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 2),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        playerRef.current.add(box);
      }
      engineParticles = createEngineParticles();
      playerRef.current.add(engineParticles);

      const tGeo = new THREE.BufferGeometry();
      tGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(trailLength * 6), 3)
      );
      const tMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const tMeshL = new THREE.Mesh(tGeo.clone(), tMat);
      const tMeshR = new THREE.Mesh(tGeo.clone(), tMat);
      scene.add(tMeshL);
      scene.add(tMeshR);
      const tipL = new THREE.Object3D();
      tipL.position.set(-1.6, 0.4, 0);
      playerRef.current.add(tipL);
      const tipR = new THREE.Object3D();
      tipR.position.set(1.6, 0.4, 0);
      playerRef.current.add(tipR);
      trails.length = 0;
      trails.push({ mesh: tMeshL, target: tipL, points: [], width: 0.1 });
      trails.push({ mesh: tMeshR, target: tipR, points: [], width: 0.1 });
      scene.add(playerRef.current);
    };

    const resetPhysics = () => {
      gameState.speed = 0;
      gameState.rotationZ = 0;
      gameState.rotationX = -0.05;
      gameState.isRolling = false;
      gameState.isTurbo = false;
      gameState.turboTimer = 0;
      gameState.hasUsedTurbo = false;
      gameState.isCinematic = false;
      gameState.loopProgress = 0;
      gameState.paperIntegrity = 100;
      gameState.score = 0;
      if (playerRef.current) playerRef.current.position.set(0, 3.5, 0);
      uiSystem.updateTurboStatus(true);
      projectiles.forEach((p) => scene.remove(p.mesh));
      projectiles.length = 0;
      spaceObstacles.forEach((o) => scene.remove(o.mesh));
      spaceObstacles.length = 0;
    };

    const startGame = () => {
      if (isModelLoading) {
        alert("Aguarde o modelo carregar!");
        return;
      }
      uiSystem.hideIntro();
      resetPhysics();
      createPlayerMesh();
      const debrisColors = [0x555555, 0x888888, 0xaaaaaa, 0x333333];
      const levelData = initSpaceLevel(
        scene,
        spaceGroup,
        starsSystem,
        tunnelSegments,
        wormholeParticles,
        planetaryBodies,
        spaceDebris,
        debrisColors,
        spawnSpaceDebris
      );
      spaceGroup = levelData.spaceGroup;
      starsSystem = levelData.starsSystem;
      // Do not reassign arrays that we passed by reference, just ensure we use them
      // tunnelSegments, wormholeParticles, planetaryBodies, spaceDebris are already updated in place or returned
      wormholeParticles = levelData.wormholeParticles;
      
      const turboData = initTurboEffects(
        scene,
        turboGroup,
        speedEffectGroup,
        turboTubes,
        simpleNoise
      );
      turboGroup = turboData.turboGroup;
      turboTubes = turboData.turboTubes;
      speedEffectGroup = turboData.speedEffectGroup;

      setCursor("none");
      canvasRef.current.requestPointerLock();
      gameState.virtualMouseX = 0;
      gameState.virtualMouseY = 0;

      gameState.gameActive = true;
      gameState.controlsLocked = true;
      startCountdown();
    };

    const startCountdown = () => {
      uiSystem.showCountdown();
      gameState.isStartingCinematic = true;
      gameState.cinematicStartTime = Date.now();
      let count = 3;
      const step = () => {
        if (count > 0) {
          uiSystem.setCountdownNumber(count);
          count--;
          setTimeout(count === 0 ? go : step, 1000);
        }
      };
      const go = () => {
        uiSystem.hideCountdown();
        gameState.speed = 1.65;
        gameState.isStartingCinematic = false;
        gameState.controlsLocked = false;
      };
      step();
    };

    const endGame = () => {
      gameState.gameActive = false;
      setCursor("default");
      uiSystem.showGameOver();
      setTimeout(() => resetToMenu(), 4000);
    };

    const togglePause = () => {
      if (!gameState.gameActive || gameState.controlsLocked) return;
      gameState.isPaused = !gameState.isPaused;
      setCursor(gameState.isPaused ? "default" : "none");
      gameState.isPaused ? uiSystem.showPause() : uiSystem.hidePause();
    };

    const resumeGame = () => {
      if (!gameState.isPaused) return;
      gameState.isPaused = false;
      setCursor("none");
      uiSystem.hidePause();
    };

    const resetToMenu = () => {
      document.exitPointerLock();
      gameState.gameActive = false;
      gameState.isPaused = false;
      setCursor("default");
      uiSystem.hideGameOver();
      uiSystem.hidePause();
      uiSystem.showIntro();
    };

    // --- UPDATE LOOP ---
    const updateTrails = () => {
      if (!playerRef.current || !gameState.gameActive) return;
      trails.forEach((t) => {
        const pos = new THREE.Vector3();
        t.target.getWorldPosition(pos);
        t.points.unshift(pos.clone());
        if (t.points.length > trailLength) t.points.pop();
        const posAttr = t.mesh.geometry.attributes.position;
        for (let i = 0; i < t.points.length - 1; i++) {
          const p = t.points[i];
          const w = t.width * (1.0 - i / trailLength);
          posAttr.setXYZ(i * 2, p.x, p.y + w, p.z);
          posAttr.setXYZ(i * 2 + 1, p.x, p.y - w, p.z);
        }
        const lastP = t.points[t.points.length - 1] || pos;
        for (let i = t.points.length * 2; i < posAttr.count; i++)
          posAttr.setXYZ(i, lastP.x, lastP.y, lastP.z);
        posAttr.needsUpdate = true;
      });
    };

    const updateGameLogic = () => {
      if (!gameState.gameActive || !playerRef.current || gameState.isPaused)
        return;
      if (gameState.controlsLocked && !gameState.isStartingCinematic) return;
      updateSpaceLevel(
        spaceGroup,
        gameState.speed,
        starsSystem,
        wormholeParticles,
        planetaryBodies,
        spaceDebris
      );
      spawnSpaceObstacle();
      updateSpaceObstacles(gameState.speed);
      updateProjectiles();
      if (gameState.isTurbo)
        updateTurboVisuals(turboGroup, turboTubes, speedEffectGroup);
      updateEngineParticlesWrapper();
      updateConfettiWrapper();

      gameState.paperIntegrity -= gameState.isTurbo ? 0.1 : 0.025;
      if (gameState.paperIntegrity <= 0) endGame();

      // Turbo
      if (
        gameState.keys.space &&
        !gameState.hasUsedTurbo &&
        !gameState.isTurbo &&
        !gameState.isRolling &&
        !gameState.isCinematic
      ) {
        gameState.isTurbo = true;
        gameState.turboTimer = 100;
        toggleTurboVisuals(turboGroup, speedEffectGroup, true);
      }

      if (gameState.isTurbo) {
        gameState.turboTimer--;
        gameState.speed = THREE.MathUtils.lerp(gameState.speed, 3.0, 0.1);
        camera.position.x += (Math.random() - 0.5) * 0.1;
        camera.position.y += (Math.random() - 0.5) * 0.1;
        gameState.score += 5;
        if (gameState.turboTimer <= 0) {
          gameState.isTurbo = false;
          gameState.hasUsedTurbo = false;
          toggleTurboVisuals(turboGroup, speedEffectGroup, false);
          uiSystem.updateTurboStatus(false);
        }
      } else {
        gameState.speed = THREE.MathUtils.lerp(gameState.speed, 1.1, 0.05);
        gameState.score += 1;
      }



      // Input Handlers
      if (gameState.keys.z) fireWeapon();
      
      // Toggle Pause (Debounced in logic or handled via event? Better event, but let's check)
      // Actually pause is best handled by event listener directly or single press check
      // For now, let's stick to the event listener approach for P, assuming InputSystem handles it?
      // Wait, InputSystem just sets keys.p = true. We need to toggle.
      // Ideally togglePause is better on 'keydown' event directly separate from continuous keys.
      // But let's leave P logic for now as it was handled via window.togglePause, 
      // we just need to make sure 'P' key triggers it if not handled by window listener.
      
      // Maneuvers
      if (gameState.keys.f && !gameState.isRolling && !gameState.isTurbo) {
        gameState.isRolling = true;
        gameState.rollProgress = 0;
        gameState.rollDirection = gameState.keys.a ? 1 : -1;
      }
      if (
        gameState.keys.c &&
        !gameState.isCinematic &&
        !gameState.isTurbo &&
        !gameState.isRolling
      ) {
        gameState.isCinematic = true;
        gameState.loopProgress = 0;
        gameState.preLoopY = playerRef.current.position.y;
      }

      if (gameState.isCinematic) {
        gameState.loopProgress += 0.05;
        const R = 15;
        playerRef.current.position.y =
          gameState.preLoopY + R * (1 - Math.cos(gameState.loopProgress));
        const energyFactor =
          0.2 + 0.8 * ((1 + Math.cos(gameState.loopProgress)) / 2);
        playerRef.current.position.z -= 0.6 * energyFactor;
        gameState.rotationX = gameState.loopProgress;
        playerRef.current.rotation.x = gameState.rotationX;
        playerRef.current.rotation.z = THREE.MathUtils.lerp(
          playerRef.current.rotation.z,
          0,
          0.1
        );
        if (gameState.loopProgress >= Math.PI * 2) {
          gameState.isCinematic = false;
          gameState.rotationX = -0.05;
          playerRef.current.rotation.x = gameState.rotationX;
          gameState.score += 800;
          spawnConfettiWrapper(playerRef.current.position, 20);
        }
      } else {
        if (gameState.isRolling) {
          gameState.rollProgress += 0.15;
          if (gameState.rollProgress >= Math.PI * 2) {
            gameState.isRolling = false;
            gameState.rollProgress = 0;
          }
          // Apply roll to rotation
          if (playerRef.current) {
            playerRef.current.rotation.z =
              gameState.rollDirection * gameState.rollProgress;
          }
        }
        physicsSystem.update();
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      updateGameLogic();
      cameraSystem.update();
      updateTrails();
      uiSystem.updateHUD(
        gameState.speed,
        gameState.score,
        gameState.paperIntegrity
      );
      renderer.render(scene, camera);
    };

    animate();

    // --- INPUT & EVENTS ---
    inputSystem.attach();

    const handlePointerDown = (e) => {
      if (
        gameState.gameActive &&
        !gameState.isPaused &&
        e.target.tagName === "CANVAS"
      ) {
        fireWeapon();
      }
    };
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const handlePointerLockChange = () => {
      gameState.isPointerLocked =
        document.pointerLockElement === canvasRef.current;
    };

    const handleKeyDownGlobal = (e) => {
      if (e.key.toLowerCase() === "p" || e.key === "Escape") togglePause();
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDownGlobal);
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    window.startNeonGame = startGame;
    window.togglePause = togglePause;
    window.resetToMenu = resetToMenu;
    window.resumeGame = resumeGame;

    return () => {
      inputSystem.detach();
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDownGlobal);
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange
      );
      if (
        canvasRef.current &&
        renderer.domElement.parentNode === canvasRef.current
      ) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) o.material.dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden font-sans select-none"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600&display=swap');
        .minimal-btn { padding: 15px 40px; font-size: 0.9rem; font-weight: 600; letter-spacing: 2px; background: transparent; color: white; border: 1px solid rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; font-family: 'Montserrat', sans-serif; }
        .minimal-btn:hover { background: white; color: black; border-color: white; }
        .intro-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 50; transition: opacity 0.8s ease; }
        .turbo-ready { color: #4CAF50; border: 1px solid #4CAF50; padding: 4px 10px; font-size: 0.7rem; letter-spacing: 2px; }
        .turbo-used { color: #F44336; border: 1px solid #F44336; padding: 4px 10px; font-size: 0.7rem; letter-spacing: 2px; }
      `}</style>

      <div ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      <div
        ref={(el) => (uiRefs.current.introScreen = el)}
        className="intro-overlay"
      >
        <h1 className="text-5xl md:text-7xl text-white font-light tracking-[0.2em] mb-4 text-center font-['Montserrat']">
          MVP 0.2
        </h1>
        <p className="text-gray-400 text-xs tracking-[0.5em] mb-12 uppercase font-['Montserrat']">
          Full Flight System
        </p>
        <button className="minimal-btn" onClick={() => window.startNeonGame()}>
          Start Flight
        </button>
        <p
          ref={(el) => (uiRefs.current.loadingMsg = el)}
          className="text-gray-500 mt-6 text-xs animate-pulse font-mono"
        >
          Loading Assets...
        </p>
      </div>

      <div
        ref={(el) => (uiRefs.current.thankYouScreen = el)}
        className="intro-overlay"
        style={{ display: "none", opacity: 0 }}
      >
        <h1 className="text-4xl text-white font-light tracking-widest mb-2">
          OBRIGADO POR JOGAR
        </h1>
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          Reiniciando sistema...
        </p>
      </div>

      <div
        ref={(el) => (uiRefs.current.pauseScreen = el)}
        className="intro-overlay"
        style={{ display: "none" }}
      >
        <h1 className="text-5xl text-white font-light tracking-widest mb-8">
          PAUSED
        </h1>
        <div className="flex flex-col gap-4">
          <button className="minimal-btn" onClick={() => window.resumeGame()}>
            RESUME
          </button>
          <button className="minimal-btn" onClick={() => window.resetToMenu()}>
            QUIT TO MENU
          </button>
        </div>
      </div>

      <div
        ref={(el) => (uiRefs.current.hud = el)}
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 transition-opacity duration-1000"
      >
        <button
          ref={(el) => (uiRefs.current.menuBtn = el)}
          className="absolute top-6 left-6 text-white text-2xl bg-transparent border-none cursor-pointer pointer-events-auto opacity-70 hover:opacity-100"
          onClick={() => window.togglePause()}
        >
          ☰
        </button>
        <div className="absolute top-6 right-6 flex flex-col items-end">
          <div
            className="text-2xl font-light text-white"
            ref={(el) => (uiRefs.current.speedBox = el)}
          >
            0.0
          </div>
          <div className="text-[10px] tracking-widest text-gray-400 mb-2 uppercase">
            SPEED
          </div>
          <div
            ref={(el) => (uiRefs.current.scoreBox = el)}
            className="text-xl font-bold mb-4 text-yellow-400"
          >
            0
          </div>
          <div
            ref={(el) => (uiRefs.current.turboStatus = el)}
            className="turbo-ready"
          >
            READY
          </div>
          <div className="w-32 h-1 bg-gray-800 mt-3 rounded-full overflow-hidden">
            <div
              ref={(el) => (uiRefs.current.energyFill = el)}
              className="h-full bg-white w-full transition-all duration-300"
            ></div>
          </div>
        </div>
      </div>

      <div
        ref={(el) => (uiRefs.current.countdown = el)}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[150] opacity-0 text-white text-8xl font-['Montserrat'] font-thin"
      >
        3
      </div>

      <div
        ref={(el) => (uiRefs.current.turboHint = el)}
        className="absolute bottom-10 w-full text-center text-white/20 text-[10px] tracking-[0.3em] pointer-events-none z-10 transition-opacity duration-500 font-['Montserrat']"
      >
        MOUSE/WASD TO FLY • SPACE TO BOOST • F TO SPIN • C TO LOOP • P TO PAUSE
      </div>
    </div>
  );
};

export default NeonFlightGame;
