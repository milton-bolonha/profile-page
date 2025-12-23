import { useRef } from "react";

export const useGameScene = () => {
  const projectilesRef = useRef([]);
  const spaceObstaclesRef = useRef([]);
  const confettiParticlesRef = useRef([]);
  const engineParticlesRef = useRef(null);
  const trailsRef = useRef([]);
  const debrisColorsRef = useRef([0x555555, 0x888888, 0xaaaaaa, 0x333333]);

  return {
    projectilesRef,
    spaceObstaclesRef,
    confettiParticlesRef,
    engineParticlesRef,
    trailsRef,
    debrisColorsRef,
  };
};
