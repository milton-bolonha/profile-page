// Physics update loop for player movement and collision
import * as THREE from "three";
import { GameState } from "./InputSystem";
import { RefObject } from "react";

export const setupPhysicsSystem = (gameState: GameState, playerRef: RefObject<THREE.Group | null>, scene: THREE.Scene) => {
  return {
    update() {
      const player = playerRef.current;
      if (!gameState.gameActive || !player || gameState.isPaused) return;
      if (gameState.controlsLocked && !gameState.isStartingCinematic) return;

      // Speed control
      if (gameState.keys.w)
        gameState.speed = Math.min(gameState.speed + 0.01, 0.5);
      else gameState.speed = Math.max(gameState.speed - 0.005, 0);

      // Position updates
      if (gameState.keys.a) player.position.x -= gameState.speed * 0.5;
      if (gameState.keys.d) player.position.x += gameState.speed * 0.5;
      if (gameState.keys.w) player.position.y += 0.02;
      if (gameState.keys.s) player.position.y -= 0.02;

      // Forward momentum
      player.position.z -= gameState.speed * 0.1;

      // Rotation from keys/mouse
      let targetRotZ = gameState.keys.a ? 0.8 : gameState.keys.d ? -0.8 : 0;
      let targetPitch = -0.05;
      if (gameState.keys.w) targetPitch = -0.5;
      if (gameState.keys.s) targetPitch = 0.5;

      targetRotZ += -gameState.virtualMouseX * 0.8;
      targetPitch += gameState.virtualMouseY * 0.8;

      gameState.rotationZ = THREE.MathUtils.lerp(
        gameState.rotationZ,
        targetRotZ,
        0.1
      );
      gameState.rotationX = THREE.MathUtils.lerp(
        gameState.rotationX,
        targetPitch,
        0.1
      );
      
      // Vertical movement from mouse
      player.position.y += gameState.virtualMouseY * 0.3; // Add Mouse Y control


      player.rotation.z = gameState.rotationZ;
      player.rotation.x = gameState.rotationX;
      player.rotation.y = -gameState.rotationZ * 0.3;

      // Boundaries
      if (player.position.y > 30) player.position.y = 30;
      if (player.position.y < -20) player.position.y = -20;
      if (player.position.x < -40) player.position.x = -40;
      if (player.position.x > 40) player.position.x = 40;

      // Energy drain
      gameState.paperIntegrity -= gameState.isTurbo ? 0.1 : 0.025;
    },
  };
};
