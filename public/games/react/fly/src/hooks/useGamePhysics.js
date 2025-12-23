import { useRef, useState } from "react";

export const useGamePhysics = () => {
  const [gameState, setGameState] = useState({
    speed: 0,
    verticalVelocity: 0,
    rotationZ: 0,
    rotationX: -0.05,
    isRolling: false,
    rollProgress: 0,
    rollDirection: 1,
    isTurbo: false,
    turboTimer: 0,
    hasUsedTurbo: false,
    isCinematic: false,
    loopProgress: 0,
    preLoopY: 0,
  });

  const keysRef = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    f: false,
    c: false,
  });

  const statsRef = useRef({
    speed: 1.1,
    liftMod: 1.2,
    turnSpeed: 0.8,
  });

  return {
    gameState,
    setGameState,
    keysRef,
    statsRef,
  };
};
