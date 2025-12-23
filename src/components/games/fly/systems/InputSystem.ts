// src/systems/InputSystem.ts
export interface GameKeys {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  space: boolean;
  f: boolean;
  c: boolean;
  z: boolean;
  p: boolean;
  [key: string]: boolean;
}

export interface GameState {
  gameActive: boolean;
  isPaused: boolean;
  controlsLocked: boolean;
  isPointerLocked: boolean;
  isStartingCinematic: boolean;
  cinematicStartTime: number;

  paperIntegrity: number;
  score: number;
  speed: number;
  rotationZ: number;
  rotationX: number;
  verticalVelocity: number;

  isRolling: boolean;
  rollProgress: number;
  rollDirection: number;

  isTurbo: boolean;
  turboTimer: number;
  hasUsedTurbo: boolean;

  isCinematic: boolean;
  loopProgress: number;
  preLoopY: number;

  lastShotTime: number;
  virtualMouseX: number;
  virtualMouseY: number;
  mouseSensitivity: number;

  keys: GameKeys;
}

export const setupInputSystem = (gameState: GameState, containerRef: React.RefObject<HTMLDivElement | null>) => {
  const keys = gameState.keys;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " ") e.preventDefault();
    const key = e.key.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(keys, key)) keys[key] = true;
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

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(keys, key)) keys[key] = false;
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

  const handleMouseMove = (e: MouseEvent) => {
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
      // Use offsetX/offsetY which are relative to the element, not viewport
      // This works correctly regardless of page scroll
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = e.offsetX;
      const offsetY = e.offsetY;
      
      // Normalize to -1 to 1 range using container dimensions
      gameState.virtualMouseX = (offsetX / rect.width) * 2 - 1;
      gameState.virtualMouseY = -(offsetY / rect.height) * 2 + 1;
      
      // DEBUG: Log to verify calculation (10% of the time)
      if (Math.random() < 0.1) {
        console.log('🎮 Mouse Debug:', {
          offsetX,
          offsetY,
          rectWidth: rect.width,
          rectHeight: rect.height,
          virtualX: gameState.virtualMouseX.toFixed(2),
          virtualY: gameState.virtualMouseY.toFixed(2),
          isInBounds: offsetX >= 0 && offsetX <= rect.width && offsetY >= 0 && offsetY <= rect.height
        });
      }
    }
  };

  return {
    attach() {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      
      // Attach mouse listener to container, not window, for accurate coordinates
      if (containerRef.current) {
        containerRef.current.addEventListener("mousemove", handleMouseMove as any);
      }
    },
    detach() {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove as any);
      }
    },
  };
};
