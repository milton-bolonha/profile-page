import React, { useEffect, useRef, useState } from "react";
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
import { fireWeapon, updateProjectiles } from "../utils/shooting";
import { spawnSpaceObstacle, updateSpaceObstacles } from "../utils/obstacles";
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

// --- NEON FLIGHT GAME COMPONENT ---
const NeonFlightGame = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Referências UI
  const uiRefs = useRef({
    introScreen: null,
    gameOverScreen: null,
    pauseScreen: null,
    hud: null,
    turboStatus: null,
    speedBox: null,
    scoreBox: null,
    energyFill: null,
    loadingMsg: null,
    countdown: null,
    turboHint: null,
    finalScore: null,
    menuBtn: null,
    thankYouScreen: null,
  });

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // --- GAME STATE ---
    let gameActive = false;
    let isPaused = false;
    let controlsLocked = false;
    let paperIntegrity = 100;
    let score = 0;
    let player;

    let speed = 0,
      verticalVelocity = 0,
      rotationZ = 0,
      rotationX = 0;
    let isRolling = false,
      rollProgress = 0,
      rollDirection = 1;
    let isTurbo = false,
      turboTimer = 0,
      hasUsedTurbo = false;
    let isCinematic = false,
      loopProgress = 0,
      preLoopY = 0;
    let lastShotTime = 0;

    let isStartingCinematic = false;
    let cinematicStartTime = 0;
    const cinematicDuration = 2000;

    // Mouse Controls

    // Assets
    let loadedGLB = null;
    let isModelLoading = true;

    // Scene Groups
    let spaceGroup;
    let turboGroup;
    let speedEffectGroup;

    // Arrays para Update
    let turboTubes = [];
    let tunnelSegments = [];
    let wormholeParticles;
    let planetaryBodies = [];
    let spaceObstacles = []; // Obstáculos (Caixas)
    let projectiles = []; // Tiros
    let spaceDebris = [];
    let engineParticles;
    const trails = [];
    const trailLength = 60;
    const confettiParticles = [];

    const keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      space: false,
      f: false,
      c: false,
    };
    const currentStats = { speed: 1.1, liftMod: 1.2, turnSpeed: 0.8 };
    const debrisColors = [0x555555, 0x888888, 0xaaaaaa, 0x333333];

    let animationId;
    let starsSystem;

    // Pointer Lock variables
    let isPointerLocked = false;
    let virtualMouseX = 0;
    let virtualMouseY = 0;
    const mouseSensitivity = 0.002;

    // --- THREE JS SETUP ---
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

    // --- ILUMINAÇÃO ---
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

    // HELPERS
    const simpleNoise = new SimpleNoise();

    // --- HELPER UI ---

    // --- ASSETS LOAD ---
    const loadGLBModel = () => {
      const loader = new GLTFLoader();
      if (uiRefs.current.loadingMsg)
        uiRefs.current.loadingMsg.style.display = "block";
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
          if (uiRefs.current.loadingMsg)
            uiRefs.current.loadingMsg.style.display = "none";
        }
      );
    };
    loadGLBModel();

    // --- PARTICLE SYSTEMS ---

    // --- SHOOTING & OBSTACLES ---
    const fireWeapon = () => {
      if (!gameActive || controlsLocked || isPaused) return;
      const now = Date.now();
      if (now - lastShotTime < 200) return;
      lastShotTime = now;

      const geo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const bullet = new THREE.Mesh(geo, mat);
      bullet.position.copy(player.position);
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
        mesh: mesh,
        rotVel: {
          x: Math.random() * 0.03,
          y: Math.random() * 0.03,
          z: Math.random() * 0.03,
        },
        size: size,
      });
    };

    const updateProjectiles = () => {
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.mesh.position.z -= 6.0;
        p.life--;

        for (let j = spaceObstacles.length - 1; j >= 0; j--) {
          const obs = spaceObstacles[j];
          const hitDist = obs.size + 1.5;

          if (p.mesh.position.distanceTo(obs.mesh.position) < hitDist) {
            spawnConfetti(obs.mesh.position, 15);

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
            score += 500;
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

        const collisionDist = obs.size + 1.5;
        if (obs.mesh.position.distanceTo(player.position) < collisionDist) {
          if (!isCinematic && !isRolling) {
            paperIntegrity -= 15;
            spawnConfetti(obs.mesh.position, 8);
            scene.remove(obs.mesh);
            spaceObstacles.splice(i, 1);
            verticalVelocity += 0.2;
          }
        }
      }
    };

    // --- SCENE GENERATION ---
    const initSpaceLevel = () => {
      if (spaceGroup) {
        scene.remove(spaceGroup);
      }
      spaceGroup = new THREE.Group();
      scene.add(spaceGroup);

      const starGeo = new THREE.BufferGeometry();
      const starCount = 3000;
      const starPos = new Float32Array(starCount * 3);
      const starCols = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const r = 300 + Math.random() * 600;
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPos[i * 3 + 2] = r * Math.cos(phi);
        const br = 0.5 + Math.random() * 0.5;
        starCols[i * 3] = br;
        starCols[i * 3 + 1] = br;
        starCols[i * 3 + 2] = br;
      }
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      starGeo.setAttribute("color", new THREE.BufferAttribute(starCols, 3));
      const starMat = new THREE.PointsMaterial({
        vertexColors: true,
        size: 1.0,
        transparent: true,
      });
      starsSystem = new THREE.Points(starGeo, starMat);
      spaceGroup.add(starsSystem);

      tunnelSegments = [];
      const cylinderGeo = new THREE.CylinderGeometry(45, 45, 120, 16, 1, true);
      const edges = new THREE.EdgesGeometry(cylinderGeo);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x444444,
        linewidth: 1,
        transparent: true,
        opacity: 0.15,
      });
      for (let i = 0; i < 6; i++) {
        const segment = new THREE.LineSegments(edges, lineMat);
        segment.rotation.x = -Math.PI / 2;
        segment.position.z = -i * 120;
        spaceGroup.add(segment);
        tunnelSegments.push(segment);
      }

      const partGeo = new THREE.BufferGeometry();
      const partCount = 400;
      const pPos = new Float32Array(partCount * 3);
      const pCol = new Float32Array(partCount * 3);
      const col = new THREE.Color();
      for (let i = 0; i < partCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = 32 + Math.random() * 20;
        pPos[i * 3] = Math.cos(angle) * r;
        pPos[i * 3 + 1] = Math.sin(angle) * r;
        pPos[i * 3 + 2] = Math.random() * -600;
        col.setHSL(0.6, 0.0, 0.5 + Math.random() * 0.5);
        pCol[i * 3] = col.r;
        pCol[i * 3 + 1] = col.g;
        pCol[i * 3 + 2] = col.b;
      }
      partGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      partGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
      const partMat = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
      });
      wormholeParticles = new THREE.Points(partGeo, partMat);
      spaceGroup.add(wormholeParticles);

      spawnPlanetaryBodies();
      spaceDebris = [];
      for (let i = 0; i < 30; i++) spawnSpaceDebris(-i * 30);
    };

    const spawnPlanetaryBodies = () => {
      planetaryBodies = [];
      const planet1 = new THREE.Mesh(
        new THREE.SphereGeometry(40, 32, 32),
        new THREE.MeshStandardMaterial({
          color: 0x222222,
          roughness: 0.2,
          metalness: 0.5,
        })
      );
      planet1.position.set(-120, -50, -600);
      const ringGeo = new THREE.RingGeometry(50, 60, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x666666,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.2;
      planet1.add(ring);
      spaceGroup.add(planet1);
      planetaryBodies.push({
        mesh: planet1,
        speed: 0.3,
        resetZ: -800,
        rangeX: 200,
        rangeY: 100,
      });
    };

    const spawnSpaceDebris = (zPos) => {
      if (!spaceGroup) return;
      const colorHex =
        debrisColors[Math.floor(Math.random() * debrisColors.length)];
      const debrisGeo = new THREE.TetrahedronGeometry(
        Math.random() * 2 + 0.5,
        0
      );
      const debrisMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.5,
        metalness: 0.5,
      });
      const mesh = new THREE.Mesh(debrisGeo, debrisMat);
      mesh.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 80,
        zPos
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      spaceGroup.add(mesh);
      spaceDebris.push({
        mesh: mesh,
        rotVel: { x: Math.random() * 0.05, y: Math.random() * 0.05 },
      });
    };

    const updateSpaceLevel = (gameSpeed) => {
      if (!spaceGroup) return;
      const moveZ = gameSpeed * 2.0;

      tunnelSegments.forEach((seg) => {
        seg.position.z += moveZ;
        if (seg.position.z > 50) seg.position.z -= 720;
      });

      const positions = wormholeParticles.geometry.attributes.position.array;
      for (let i = 2; i < positions.length; i += 3) {
        positions[i] += moveZ * 2.5;
        if (positions[i] > 20) positions[i] -= 600;
      }
      wormholeParticles.geometry.attributes.position.needsUpdate = true;
      wormholeParticles.rotation.z -= 0.001;

      planetaryBodies.forEach((body) => {
        body.mesh.position.z += moveZ * body.speed;
        body.mesh.rotation.y += 0.001;
        if (body.mesh.position.z > 100) {
          body.mesh.position.z = body.resetZ;
          body.mesh.position.x = (Math.random() - 0.5) * body.rangeX * 2;
          body.mesh.position.y = (Math.random() - 0.5) * body.rangeY * 2;
        }
      });

      for (let i = spaceDebris.length - 1; i >= 0; i--) {
        const debris = spaceDebris[i];
        debris.mesh.position.z += moveZ * 3.0;
        debris.mesh.rotation.x += debris.rotVel.x;
        debris.mesh.rotation.y += debris.rotVel.y;
        if (debris.mesh.position.z > 20) {
          debris.mesh.position.z = -400 - Math.random() * 200;
          debris.mesh.position.x = (Math.random() - 0.5) * 100;
          debris.mesh.position.y = (Math.random() - 0.5) * 80;
        }
      }
      if (starsSystem) starsSystem.rotation.z += 0.0002;
    };

    // --- TURBO EFFECTS (NO-NAN FIX) ---
    const initTurboEffects = () => {
      turboGroup = new THREE.Group();
      scene.add(turboGroup);

      const radius = 25;
      const tubeLength = 200;
      const radialSegments = 64;
      const heightSegments = 200;
      const numPoints = radialSegments * (heightSegments + 1);
      const positions = new Float32Array(numPoints * 3);
      const colors = new Float32Array(numPoints * 3);
      const color = new THREE.Color();
      let idx = 0;

      for (let y = 0; y <= heightSegments; y++) {
        const v = y / heightSegments;
        const cy = (v - 0.5) * tubeLength;
        for (let x = 0; x < radialSegments; x++) {
          if (idx >= numPoints) break;
          const u = x / radialSegments;
          const theta = u * Math.PI * 2;
          const px = radius * Math.sin(theta);
          const pz = radius * Math.cos(theta);

          let noiseVal = 0;
          if (simpleNoise)
            noiseVal = simpleNoise.noise3D(px * 0.1, pz * 0.1, cy * 0.1);

          const fx = isNaN(px + noiseVal * 5) ? px : px + noiseVal * 5;
          const fy = isNaN(pz + noiseVal * 5) ? pz : pz + noiseVal * 5;
          const fz = isNaN(cy) ? 0 : cy;

          positions[idx * 3] = fx;
          positions[idx * 3 + 1] = fy;
          positions[idx * 3 + 2] = fz;

          color.setHSL(0.5 + Math.random() * 0.1, 0.8, 0.5);
          colors[idx * 3] = color.r;
          colors[idx * 3 + 1] = color.g;
          colors[idx * 3 + 2] = color.b;
          idx++;
        }
      }

      const mat = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const tubeA = new THREE.Points(geo.clone(), mat);
      const tubeB = new THREE.Points(geo.clone(), mat);
      tubeA.position.z = -tubeLength / 2;
      tubeB.position.z = -tubeLength * 1.5;

      turboGroup.add(tubeA);
      turboGroup.add(tubeB);
      turboTubes = [tubeA, tubeB];
      turboGroup.visible = false;

      // Speed Lines
      speedEffectGroup = new THREE.Group();
      scene.add(speedEffectGroup);
      const lineGeo = new THREE.BufferGeometry();
      const linePos = [];
      for (let i = 0; i < 300; i++) {
        const x = (Math.random() - 0.5) * 150;
        const y = (Math.random() - 0.5) * 100;
        const z = Math.random() * -200;
        linePos.push(x, y, z);
        linePos.push(x, y, z - 20);
      }
      lineGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePos, 3)
      );
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      speedEffectGroup.add(lines);
      speedEffectGroup.visible = false;
      speedEffectGroup.userData = { lines: lines };
    };

    const toggleTurboVisuals = (active) => {
      if (!turboGroup) initTurboEffects();
      if (turboGroup) turboGroup.visible = active;
      if (speedEffectGroup) speedEffectGroup.visible = active;
    };

    const updateTurboVisuals = () => {
      if (!turboGroup || !turboGroup.visible) return;
      turboTubes.forEach((tube) => {
        tube.rotation.z -= 0.05;
        tube.position.z += 4.0;
        if (tube.position.z > 50) tube.position.z -= 400;
      });
      if (speedEffectGroup) {
        const lines = speedEffectGroup.userData.lines;
        lines.position.z += 5.0;
        if (lines.position.z > 100) lines.position.z = 0;
      }
    };

    // --- GAMEPLAY LOGIC ---
    const resetPhysics = () => {
      speed = 0;
      verticalVelocity = 0;
      rotationZ = 0;
      rotationX = -0.05;
      isRolling = false;
      isTurbo = false;
      turboTimer = 0;
      hasUsedTurbo = false;
      isCinematic = false;
      loopProgress = 0;
      paperIntegrity = 100;
      score = 0;
      if (player) {
        player.position.set(0, 3.5, 0);
        player.rotation.set(0, 0, 0);
      }
      toggleTurboVisuals(false);
      updateTurboUI();
      projectiles.forEach((p) => scene.remove(p.mesh));
      projectiles.length = 0;
      spaceObstacles.forEach((o) => scene.remove(o.mesh));
      spaceObstacles.length = 0;
    };

    const createPlayerMesh = () => {
      if (player) scene.remove(player);
      player = new THREE.Group();
      player.position.set(0, 5, 0);
      if (loadedGLB) {
        const model = loadedGLB.clone();
        player.add(model);
      } else {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 2),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        player.add(box);
      }
      player.add(createEngineParticles());

      // Trails
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
      player.add(tipL);
      const tipR = new THREE.Object3D();
      tipR.position.set(1.6, 0.4, 0);
      player.add(tipR);
      trails.length = 0;
      trails.push({ mesh: tMeshL, target: tipL, points: [], width: 0.1 });
      trails.push({ mesh: tMeshR, target: tipR, points: [], width: 0.1 });
      scene.add(player);
    };

    const startGame = () => {
      if (isModelLoading) {
        alert("Aguarde o modelo carregar!");
        return;
      }
      if (uiRefs.current.introScreen)
        uiRefs.current.introScreen.style.opacity = "0";
      if (uiRefs.current.introScreen)
        uiRefs.current.introScreen.style.pointerEvents = "none";
      if (uiRefs.current.hud) uiRefs.current.hud.style.opacity = "1";

      resetPhysics();
      createPlayerMesh();
      initSpaceLevel();
      initTurboEffects();
      setCursor("none"); // Esconde o mouse ao iniciar
      canvasRef.current.requestPointerLock();
      virtualMouseX = 0;
      virtualMouseY = 0;

      gameActive = true;
      controlsLocked = true;
      startCountdown();
    };

    const startCountdown = () => {
      const overlay = uiRefs.current.countdown;
      if (!overlay) return;
      overlay.style.opacity = "1";
      isStartingCinematic = true;
      cinematicStartTime = Date.now();
      let count = 3;
      const step = () => {
        if (count > 0) {
          overlay.innerText = count.toString();
          overlay.style.transform = "scale(1.2)";
          setTimeout(() => (overlay.style.transform = "scale(1.0)"), 100);
          count--;
          setTimeout(count === 0 ? go : step, 1000);
        }
      };
      const go = () => {
        overlay.innerText = "";
        overlay.style.opacity = "0";
        speed = currentStats.speed * 1.5;
        isStartingCinematic = false;
        controlsLocked = false;
      };
      step();
    };

    const updateTurboUI = () => {
      if (!uiRefs.current.turboStatus) return;
      const el = uiRefs.current.turboStatus;
      el.innerText = "TURBO READY";
      el.className = "turbo-ready";
    };

    const endGame = () => {
      gameActive = false;
      toggleTurboVisuals(false);
      setCursor("default"); // Mostra mouse
      if (uiRefs.current.thankYouScreen) {
        uiRefs.current.thankYouScreen.style.display = "flex";
        uiRefs.current.thankYouScreen.style.opacity = "1";
      }
      setTimeout(() => {
        resetToMenu();
      }, 4000);
    };

    const togglePause = () => {
      if (!gameActive || controlsLocked) return;
      isPaused = !isPaused;
      setCursor(isPaused ? "default" : "none"); // Mouse aparece no pause
      if (uiRefs.current.pauseScreen) {
        uiRefs.current.pauseScreen.style.display = isPaused ? "flex" : "none";
      }
    };

    const resumeGame = () => {
      if (!isPaused) return;
      isPaused = false;
      setCursor("none"); // Esconde mouse ao voltar
      if (uiRefs.current.pauseScreen)
        uiRefs.current.pauseScreen.style.display = "none";
    };

    const resetToMenu = () => {
      document.exitPointerLock();
      gameActive = false;
      isPaused = false;
      setCursor("default");
      if (uiRefs.current.thankYouScreen) {
        uiRefs.current.thankYouScreen.style.opacity = "0";
        uiRefs.current.thankYouScreen.style.display = "none";
      }
      if (uiRefs.current.pauseScreen)
        uiRefs.current.pauseScreen.style.display = "none";
      if (uiRefs.current.introScreen) {
        uiRefs.current.introScreen.style.opacity = "1";
        uiRefs.current.introScreen.style.pointerEvents = "auto";
      }
      if (uiRefs.current.hud) uiRefs.current.hud.style.opacity = "0";
    };

    // --- UPDATE LOOP ---
    const updatePhysics = () => {
      if (!gameActive || !player || isPaused) return;
      if (controlsLocked && !isStartingCinematic) return;

      updateSpaceLevel(speed);
      spawnSpaceObstacle();
      updateSpaceObstacles(speed);
      updateProjectiles();
      if (isTurbo) updateTurboVisuals();
      updateEngineParticles();
      updateConfetti();

      // Energy drain (Menos agressivo)
      paperIntegrity -= isTurbo ? 0.1 : 0.025;
      if (paperIntegrity <= 0) endGame();

      // Turbo Input
      if (
        keys.space &&
        !hasUsedTurbo &&
        !isTurbo &&
        !isRolling &&
        !isCinematic
      ) {
        isTurbo = true;
        turboTimer = 100;
        toggleTurboVisuals(true);
        if (uiRefs.current.turboHint)
          uiRefs.current.turboHint.style.opacity = "0";
      }

      if (isTurbo) {
        turboTimer--;
        speed = THREE.MathUtils.lerp(speed, 3.0, 0.1);
        camera.position.x += (Math.random() - 0.5) * 0.1;
        camera.position.y += (Math.random() - 0.5) * 0.1;
        score += 5;
        if (turboTimer <= 0) {
          isTurbo = false;
          hasUsedTurbo = false;
          toggleTurboVisuals(false);
          updateTurboUI();
        }
      } else {
        speed = THREE.MathUtils.lerp(speed, currentStats.speed, 0.05);
        score += 1;
      }

      // Maneuvers
      if (keys.f && !isRolling && !isTurbo) {
        isRolling = true;
        rollProgress = 0;
        // SPIN FIX: Spin to left if A is pressed, Right if D, else random
        rollDirection = keys.a ? 1 : -1;
      }
      if (keys.c && !isCinematic && !isTurbo && !isRolling) {
        isCinematic = true;
        loopProgress = 0;
        preLoopY = player.position.y;
      }

      if (isCinematic) {
        // CINEMATIC LOOP
        loopProgress += 0.05;
        const R = 15;
        player.position.y = preLoopY + R * (1 - Math.cos(loopProgress));

        const energyFactor = 0.2 + 0.8 * ((1 + Math.cos(loopProgress)) / 2);
        player.position.z -= 0.6 * energyFactor;

        rotationX = loopProgress;
        player.rotation.x = rotationX;
        player.rotation.z = THREE.MathUtils.lerp(player.rotation.z, 0, 0.1);

        if (loopProgress >= Math.PI * 2) {
          isCinematic = false;
          rotationX = -0.05;
          player.rotation.x = rotationX;
          score += 800;
          spawnConfetti(player.position, 20);
        }
      } else {
        if (isRolling) {
          rollProgress += 0.15;
          if (rollProgress >= Math.PI * 2) {
            isRolling = false;
            rollProgress = 0;
          }
        }

        // Control Mix
        let targetRotZ = keys.a ? 0.8 : keys.d ? -0.8 : 0;
        let targetPitch = -0.05;
        if (keys.w) targetPitch = -0.5;
        if (keys.s) targetPitch = 0.5;

        targetRotZ += -virtualMouseX * 0.8;
        targetPitch += virtualMouseY * 0.8;

        rotationZ = THREE.MathUtils.lerp(rotationZ, targetRotZ, 0.1);
        rotationX = THREE.MathUtils.lerp(rotationX, targetPitch, 0.1);

        // Rotation
        player.rotation.z = isRolling
          ? rotationZ + rollProgress * rollDirection
          : rotationZ;
        player.rotation.x = rotationX;
        player.rotation.y = -rotationZ * 0.3;

        verticalVelocity = rotationX * 0.2;
        player.position.y += verticalVelocity;

        // Boundaries
        if (player.position.y > 30) player.position.y = 30;
        if (player.position.y < -20) player.position.y = -20;

        player.position.x -= rotationZ * 0.5;
        if (player.position.x < -40) player.position.x = -40;
        if (player.position.x > 40) player.position.x = 40;
      }
    };

    const updateCamera = () => {
      if (!player) return;

      if (isStartingCinematic) {
        const now = Date.now();
        const progress = Math.min(
          (now - cinematicStartTime) / cinematicDuration,
          1.0
        );
        const t =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        const radius = 10;
        const angle = Math.PI * (1 - t);
        const camX = player.position.x + radius * Math.sin(angle);
        const camZ = player.position.z + radius * Math.cos(angle);
        const startHeight = player.position.y + 6.0;
        const endHeight = player.position.y + 1.2;
        const camY = THREE.MathUtils.lerp(startHeight, endHeight, t);
        camera.position.set(camX, camY, camZ);
        camera.lookAt(player.position);
      } else if (isCinematic) {
        const loopPhase = loopProgress;
        const baseDist = 15;
        const heightOffset = 5 + Math.sin(loopPhase) * 3;

        const targetCamZ =
          player.position.z + baseDist * Math.cos(loopPhase * 0.5);
        const targetCamY = player.position.y + heightOffset;
        const targetCamX = player.position.x + Math.sin(loopPhase * 0.3) * 5;

        camera.position.z = THREE.MathUtils.lerp(
          camera.position.z,
          targetCamZ,
          0.08
        );
        camera.position.y = THREE.MathUtils.lerp(
          camera.position.y,
          targetCamY,
          0.08
        );
        camera.position.x = THREE.MathUtils.lerp(
          camera.position.x,
          targetCamX,
          0.08
        );
        camera.lookAt(player.position);
      } else {
        const targetZ = player.position.z + (isTurbo ? 8 : 6);
        const targetY = player.position.y + 2;
        camera.position.z = THREE.MathUtils.lerp(
          camera.position.z,
          targetZ,
          0.1
        );
        camera.position.y = THREE.MathUtils.lerp(
          camera.position.y,
          targetY,
          0.1
        );
        camera.position.x = THREE.MathUtils.lerp(
          camera.position.x,
          player.position.x * 0.5,
          0.1
        );
        camera.lookAt(
          player.position.x,
          player.position.y,
          player.position.z - 20
        );
      }
    };

    const updateTrails = () => {
      if (!player) return;
      trails.forEach((t) => {
        if (!gameActive) return;
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

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (gameActive) {
        updatePhysics();
        updateCamera();
        updateTrails();

        // HUD Updates
        if (uiRefs.current.speedBox)
          uiRefs.current.speedBox.innerText = (speed * 10).toFixed(1);
        if (uiRefs.current.scoreBox)
          uiRefs.current.scoreBox.innerText = score.toString();
        if (uiRefs.current.energyFill)
          uiRefs.current.energyFill.style.width =
            Math.max(0, paperIntegrity) + "%";
      }
      renderer.render(scene, camera);
    };
    animate();

    // EVENTS
    const handleKeyDown = (e) => {
      if (e.key === " ") e.preventDefault();
      if (keys.hasOwnProperty(e.key.toLowerCase()))
        keys[e.key.toLowerCase()] = true;
      if (e.key === " ") keys.space = true;
      if (e.key === "ArrowUp") keys.s = true;
      if (e.key === "ArrowDown") keys.w = true;
      if (e.key === "ArrowLeft") keys.a = true;
      if (e.key === "ArrowRight") keys.d = true;
      if (e.key === "Escape" || e.key.toLowerCase() === "p") togglePause();
      if (e.key.toLowerCase() === "z") fireWeapon();
    };
    const handleKeyUp = (e) => {
      if (keys.hasOwnProperty(e.key.toLowerCase()))
        keys[e.key.toLowerCase()] = false;
      if (e.key === " ") keys.space = false;
      if (e.key === "ArrowUp") keys.s = false;
      if (e.key === "ArrowDown") keys.w = false;
      if (e.key === "ArrowLeft") keys.a = false;
      if (e.key === "ArrowRight") keys.d = false;
    };
    const handleMouseMove = (e) => {
      if (!gameActive || isPaused) return;
      if (isPointerLocked) {
        virtualMouseX += e.movementX * mouseSensitivity;
        virtualMouseY += e.movementY * mouseSensitivity;
        virtualMouseX = Math.max(-1, Math.min(1, virtualMouseX));
        virtualMouseY = Math.max(-1, Math.min(1, virtualMouseY));
      } else {
        virtualMouseX = (e.clientX / window.innerWidth) * 2 - 1;
        virtualMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      }
    };
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const handlePointerDown = (e) => {
      if (gameActive && !isPaused && e.target.tagName === "CANVAS") {
        fireWeapon();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointerdown", handlePointerDown);

    const handlePointerLockChange = () => {
      isPointerLocked = document.pointerLockElement === canvasRef.current;
    };
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    window.startNeonGame = startGame;
    window.togglePause = togglePause;
    window.resetToMenu = resetToMenu;
    window.resumeGame = resumeGame;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange
      );
      cancelAnimationFrame(animationId);
      if (canvasRef.current) canvasRef.current.removeChild(renderer.domElement);
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
      {/* STYLES - MINIMALISTA */}
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;600&display=swap');
                .minimal-btn { padding: 15px 40px; font-size: 0.9rem; font-weight: 600; letter-spacing: 2px; background: transparent; color: white; border: 1px solid rgba(255,255,255,0.5); cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; font-family: 'Montserrat', sans-serif; }
                .minimal-btn:hover { background: white; color: black; border-color: white; }
                .intro-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 50; transition: opacity 0.8s ease; }
                .hud-info { font-family: 'Montserrat', sans-serif; color: white; text-transform: uppercase; }
                .turbo-ready { color: #4CAF50; border: 1px solid #4CAF50; padding: 4px 10px; font-size: 0.7rem; letter-spacing: 2px; }
                .turbo-used { color: #F44336; border: 1px solid #F44336; padding: 4px 10px; font-size: 0.7rem; letter-spacing: 2px; }
            `}</style>

      <div ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* INTRO SCREEN */}
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

      {/* THANK YOU SCREEN */}
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

      {/* PAUSE SCREEN */}
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

      {/* HUD */}
      <div
        ref={(el) => (uiRefs.current.hud = el)}
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 transition-opacity duration-1000"
      >
        {/* Top Left Menu Button */}
        <button
          ref={(el) => (uiRefs.current.menuBtn = el)}
          className="absolute top-6 left-6 text-white text-2xl bg-transparent border-none cursor-pointer pointer-events-auto opacity-70 hover:opacity-100"
          onClick={() => window.togglePause()}
        >
          ☰
        </button>

        {/* Top Right Info */}
        <div className="absolute top-6 right-6 flex flex-col items-end">
          <div
            className="hud-info text-2xl font-light"
            ref={(el) => (uiRefs.current.speedBox = el)}
          >
            0.0
          </div>
          <div className="hud-info text-[10px] tracking-widest text-gray-400 mb-2">
            SPEED
          </div>
          <div
            ref={(el) => (uiRefs.current.scoreBox = el)}
            className="hud-info text-xl font-bold mb-4 text-yellow-400"
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

      {/* COUNTDOWN */}
      <div
        ref={(el) => (uiRefs.current.countdown = el)}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[150] opacity-0 text-white text-8xl font-['Montserrat'] font-thin"
      >
        3
      </div>

      {/* CONTROLS HINT */}
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
