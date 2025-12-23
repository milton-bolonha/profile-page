// src/utils/scene.ts
import * as THREE from "three";

export interface PlanetaryBody {
  mesh: THREE.Object3D;
  speed: number;
  resetZ: number;
  rangeX: number;
  rangeY: number;
}

export interface SpaceDebris {
  mesh: THREE.Mesh;
  rotVel: { x: number; y: number };
}

export const initSpaceLevel = (
  scene: THREE.Scene,
  spaceGroup: THREE.Group | undefined,
  starsSystem: THREE.Points | undefined,
  tunnelSegments: THREE.LineSegments[],
  wormholeParticles: THREE.Points | undefined,
  planetaryBodies: PlanetaryBody[],
  spaceDebris: SpaceDebris[],
  debrisColors: number[],
  spawnSpaceDebrisFunc: (spaceGroup: THREE.Group, debrisColors: number[], spaceDebris: SpaceDebris[], zPos: number) => void
) => {
  if (spaceGroup) {
    scene.remove(spaceGroup);
  }
  spaceGroup = new THREE.Group();
  scene.add(spaceGroup);

  // Clear external arrays instead of reassigning
  planetaryBodies.length = 0;
  spaceDebris.length = 0;
  tunnelSegments.length = 0;

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

  spawnPlanetaryBodies(planetaryBodies, spaceGroup);
  
  for (let i = 0; i < 30; i++)
    spawnSpaceDebrisFunc(spaceGroup, debrisColors, spaceDebris, -i * 30);

  return {
    spaceGroup,
    starsSystem,
    tunnelSegments,
    wormholeParticles,
    planetaryBodies,
    spaceDebris,
  };
};

export const spawnPlanetaryBodies = (planetaryBodies: PlanetaryBody[], spaceGroup: THREE.Group) => {
  // planetaryBodies is now mutated in place, not reassigned
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

export const spawnSpaceDebris = (
  spaceGroup: THREE.Group,
  debrisColors: number[],
  spaceDebris: SpaceDebris[],
  zPos: number
) => {
  if (!spaceGroup) return;
  const colorHex =
    debrisColors[Math.floor(Math.random() * debrisColors.length)];
  const debrisGeo = new THREE.TetrahedronGeometry(Math.random() * 2 + 0.5, 0);
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

export const updateSpaceLevel = (
  spaceGroup: THREE.Group | undefined,
  moveZ: number,
  starsSystem: THREE.Points | undefined,
  wormholeParticles: THREE.Points | undefined,
  planetaryBodies: PlanetaryBody[],
  spaceDebris: SpaceDebris[]
) => {
  if (!spaceGroup || !wormholeParticles) return;

  const positions = wormholeParticles.geometry.attributes.position.array as Float32Array;
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
