// Physics update loop for player movement and collision
import * as THREE from "three";
import { GameState } from "./InputSystem";
import { RefObject } from "react";

export const setupPhysicsSystem = (gameState: GameState, playerRef: RefObject<THREE.Group | null>, scene: THREE.Scene) => {
  return {
    update() {
      const player = playerRef.current;
      if (!gameState.gameActive || !player || gameState.isPaused || gameState.isDebugPaused) return;

      // Mouse Follow Logic (Primary)
      
      // Horizontal Clamp (Stricter Limit per user request)
      const maxX = 30; 
      const rawTargetX = gameState.virtualMouseX * maxX;
      
      // Vertical Movement (Restored - "Always above invisible floor")
      // Map virtualMouseY (-1 to 1) to height range (reduced from 12.0 to 8.0 for better camera framing)
      const minY = 1.0; 
      const maxY = 8.0;
      const heightRange = maxY - minY;
      const normalizedY = (Math.max(-1, Math.min(1, gameState.virtualMouseY)) + 1) / 2;
      const rawTargetY = minY + normalizedY * heightRange;

      // Corridor center bias - gently pull airplane towards center path
      const corridorCenterX = 0;  // Corridor center is at X=0
      const corridorCenterY = 4.5;  // Updated to match new spawn height
      const biasFactor = 0.1;  // 10% bias towards center

      // Apply bias towards corridor center
      const biasedTargetX = rawTargetX * (1 - biasFactor) + corridorCenterX * biasFactor;
      const biasedTargetY = rawTargetY * (1 - biasFactor) + corridorCenterY * biasFactor;

      // Smooth Position Lerp
      player.position.x = THREE.MathUtils.lerp(player.position.x, biasedTargetX, 0.1);
      player.position.y = THREE.MathUtils.lerp(player.position.y, biasedTargetY, 0.1);
      
      // Forward Speed (Base + Turbo)
      player.position.z -= gameState.speed * 1.5;

      // Disable WASD Position overrides if we are using mouse, 
      // or keep them as small nudges? User implies mouse control is key.
      // Keeping WASD as modifiers/legacy if wanted, but Mouse should dominate.
      
      // Rotation (Banking)
      const targetRotZ = -gameState.virtualMouseX * 1.2; // Bank into turn
      const targetPitch = gameState.virtualMouseY * 0.5; // Pitch up/down

      gameState.rotationZ = THREE.MathUtils.lerp(gameState.rotationZ, targetRotZ, 0.1);
      gameState.rotationX = THREE.MathUtils.lerp(gameState.rotationX, targetPitch, 0.1);

      player.rotation.z = gameState.rotationZ;
      player.rotation.x = gameState.rotationX;
      player.rotation.y = -gameState.rotationZ * 0.2; // Yaw into turn

      // Hard Boundaries (Safety)
      if (player.position.y > 20) player.position.y = 20;
      if (player.position.y < 0.5) player.position.y = 0.5;

      // Energy drain
      gameState.paperIntegrity -= gameState.isTurbo ? 0.1 : 0.025;
    },
  };
};
