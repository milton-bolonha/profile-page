// src/utils/turbo.ts
import * as THREE from "three";
import { SimpleNoise } from "../lib/SimpleNoise";

export const initTurboEffects = (
  scene: THREE.Scene,
  turboGroup: THREE.Group | undefined,
  speedEffectGroup: THREE.Group | undefined,
  turboTubes: THREE.Points[],
  simpleNoise: SimpleNoise
) => {
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

  return {
    turboGroup,
    turboTubes,
    speedEffectGroup,
  };
};

export const toggleTurboVisuals = (turboGroup: THREE.Group | undefined, speedEffectGroup: THREE.Group | undefined, active: boolean) => {
  if (!turboGroup) return;
  if (turboGroup) turboGroup.visible = active;
  if (speedEffectGroup) speedEffectGroup.visible = active;
};

export const updateTurboVisuals = (
  turboGroup: THREE.Group | undefined,
  turboTubes: THREE.Points[],
  speedEffectGroup: THREE.Group | undefined
) => {
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
