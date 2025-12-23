import * as THREE from "three";

// Camera follow system
export const setupCameraSystem = (gameState, playerRef, camera) => {
  return {
    update() {
      const player = playerRef.current;
      if (!player) return;

      if (gameState.isStartingCinematic) {
        const now = Date.now();
        const progress = Math.min(
          (now - gameState.cinematicStartTime) / 2000,
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
      } else if (gameState.isCinematic) {
        const loopPhase = gameState.loopProgress;
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
        const targetZ = player.position.z + (gameState.isTurbo ? 8 : 6);
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
    },
  };
};
