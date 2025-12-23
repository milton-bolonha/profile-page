// src/utils/shooting.js
import * as THREE from "three";

export const fireWeapon = (
  player,
  projectiles,
  scene,
  lastShotTime,
  gameActive,
  controlsLocked,
  isPaused
) => {
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

export const updateProjectiles = (
  projectiles,
  spaceObstacles,
  scene,
  score,
  showFloatingScore
) => {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.mesh.position.z -= 6.0;
    p.life--;

    for (let j = spaceObstacles.length - 1; j >= 0; j--) {
      const obs = spaceObstacles[j];
      const hitDist = obs.size + 1.5;

      if (p.mesh.position.distanceTo(obs.mesh.position) < hitDist) {
        showFloatingScore(500, "hit");

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
        break;
      }
    }
    if (p.life <= 0) {
      scene.remove(p.mesh);
      projectiles.splice(i, 1);
    }
  }
};
