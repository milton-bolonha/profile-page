// src/utils/obstacles.js
import * as THREE from "three";

export const spawnSpaceObstacle = (spaceObstacles, scene) => {
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

export const updateSpaceObstacles = (
  spaceObstacles,
  player,
  paperIntegrity,
  verticalVelocity,
  isCinematic,
  isRolling,
  spawnConfetti,
  scene,
  moveSpeed
) => {
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
        spawnConfetti(obs.mesh.position, 8, [], scene); // Note: confettiParticles not passed, adjust
        scene.remove(obs.mesh);
        spaceObstacles.splice(i, 1);
        verticalVelocity += 0.2;
      }
    }
  }
};
