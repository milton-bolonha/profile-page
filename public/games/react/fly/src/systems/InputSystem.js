import * as THREE from "three";

// Input handling system
export const setupInputSystem = (gameState) => {
  const keys = gameState.keys;

  const handleKeyDown = (e) => {
    if (e.key === " ") e.preventDefault();
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
    if (e.key === " ") keys.space = true;
    if (e.key === "ArrowUp") keys.s = true;
    if (e.key === "ArrowDown") keys.w = true;
    if (e.key === "ArrowLeft") keys.a = true;
    if (e.key === "ArrowRight") keys.d = true;
    // New keys
    if (key === "z") keys.z = true;
    if (key === "f") keys.f = true;
    if (key === "c") keys.c = true;
    if (key === "p") keys.p = true;
  };

  const handleKeyUp = (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
    if (e.key === " ") keys.space = false;
    if (e.key === "ArrowUp") keys.s = false;
    if (e.key === "ArrowDown") keys.w = false;
    if (e.key === "ArrowLeft") keys.a = false;
    if (e.key === "ArrowRight") keys.d = false;
    // New keys
    if (key === "z") keys.z = false;
    if (key === "f") keys.f = false;
    if (key === "c") keys.c = false;
    if (key === "p") keys.p = false;
  };

  const handleMouseMove = (e) => {
    if (!gameState.gameActive || gameState.isPaused) return;
    if (gameState.isPointerLocked) {
      gameState.virtualMouseX += e.movementX * gameState.mouseSensitivity;
      gameState.virtualMouseY += e.movementY * gameState.mouseSensitivity;
      gameState.virtualMouseX = Math.max(
        -1,
        Math.min(1, gameState.virtualMouseX)
      );
      gameState.virtualMouseY = Math.max(
        -1,
        Math.min(1, gameState.virtualMouseY)
      );
    } else {
      gameState.virtualMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      gameState.virtualMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }
  };

  return {
    attach() {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      window.addEventListener("mousemove", handleMouseMove);
    },
    detach() {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
    },
  };
};
