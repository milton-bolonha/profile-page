// src/systems/CameraSystem.ts
import * as THREE from "three";
import { GameState } from "./InputSystem";
import { RefObject } from "react";

// Camera offsets that can be adjusted via debug controls
export const cameraOffsets = {
  x: 0,
  y: 3.0,  // Optimal value found through testing
  z: 9.0,  // Better field of view
  manualControl: false // When true, ignore automatic camera movement
};

// Camera follow system
export const setupCameraSystem = (gameState: GameState, playerRef: RefObject<THREE.Group | null>, camera: THREE.PerspectiveCamera) => {
  return {
    update() {
      const player = playerRef.current;
      if (!player) return;

      // If manual control is enabled, don't update camera automatically
      if (cameraOffsets.manualControl) {
        camera.position.set(
          player.position.x + cameraOffsets.x,
          player.position.y + cameraOffsets.y,
          player.position.z + cameraOffsets.z
        );
        camera.lookAt(player.position);
        return;
      }

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
        // Normal gameplay - smooth camera follow with deadzone
        // Exception: During turbo, use faster lerp for responsiveness
        if (gameState.isTurbo) {
          // Faster smooth follow during turbo (not instant)
          const targetCamX = player.position.x + cameraOffsets.x;
          const targetCamY = player.position.y + cameraOffsets.y;
          const targetCamZ = player.position.z + cameraOffsets.z;
          
          // Fast lerp (0.3 = very responsive but still smooth)
          camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.3);
          camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.3);
          camera.position.z = targetCamZ;  // Z instant for forward movement
          
          // Apply shake effect
          camera.position.x += (Math.random() - 0.5) * 0.1;
          camera.position.y += (Math.random() - 0.5) * 0.1;
          camera.lookAt(player.position);
        } else {
          // Smooth follow for normal gameplay
          const deadzone = {
            x: 5.0,  // Airplane can move ±5 units before camera reacts strongly
            y: 2.0,  // Airplane can move ±2 units vertically
          };

          const targetCamX = player.position.x + cameraOffsets.x;
          const targetCamY = player.position.y + cameraOffsets.y;
          const targetCamZ = player.position.z + cameraOffsets.z;

          // Calculate delta from current camera position
          const deltaX = targetCamX - camera.position.x;
          const deltaY = targetCamY - camera.position.y;

          // Apply deadzone - only move camera significantly if airplane far from center
          const smoothFactorX = Math.abs(deltaX) > deadzone.x ? 0.08 : 0.02;
          const smoothFactorY = Math.abs(deltaY) > deadzone.y ? 0.08 : 0.02;

          // Smooth lerp (0.08 = responsive, 0.02 = very smooth for small movements)
          camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, smoothFactorX);
          camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, smoothFactorY);
          camera.position.z = targetCamZ;  // Z follows instantly (forward movement)

          // Look slightly ahead of airplane for better feel
          const lookAheadZ = player.position.z - 10;
          camera.lookAt(player.position.x, player.position.y, lookAheadZ);
        }
      }
    },
  };
};
