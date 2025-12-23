// src/utils/particles.js
import * as THREE from "three";

export const createEngineParticles = () => {
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
    positions[i * 3 + 2] = Math.random() * 2;
    sizes[i] = Math.random();
  }

  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.1,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
  });

  const engineParticles = new THREE.Points(particleGeo, particleMat);
  engineParticles.position.set(0, 0.5, 2);
  return engineParticles;
};

export const updateEngineParticles = (engineParticles, isTurbo) => {
  if (!engineParticles) return;
  const positions = engineParticles.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 2] += 0.3 + (isTurbo ? 0.5 : 0);
    if (positions[i + 2] > 5) {
      positions[i + 2] = 0;
      positions[i] = (Math.random() - 0.5) * 0.2;
      positions[i + 1] = (Math.random() - 0.5) * 0.2;
    }
  }
  engineParticles.geometry.attributes.position.needsUpdate = true;
};

export const spawnConfetti = (pos, count, confettiParticles, scene) => {
  const geo = new THREE.PlaneGeometry(0.1, 0.1);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
  });
  for (let i = 0; i < count; i++) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.position.x += (Math.random() - 0.5) * 2;
    mesh.position.y += (Math.random() - 0.5) * 2;
    mesh.position.z += (Math.random() - 0.5) * 2;
    const vel = new THREE.Vector3(
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.3
    );
    confettiParticles.push({ mesh, vel, life: 60 });
    scene.add(mesh);
  }
};

export const updateConfetti = (confettiParticles, scene) => {
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.mesh.position.add(p.vel);
    p.mesh.rotation.x += 0.1;
    p.life--;
    if (p.life <= 0) {
      scene.remove(p.mesh);
      confettiParticles.splice(i, 1);
    }
  }
};
