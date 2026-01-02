import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { FaForward } from 'react-icons/fa';

interface TransitionAdProps {
  onComplete: () => void;
  direction?: 'left' | 'right';
}

const TransitionAd: React.FC<TransitionAdProps> = ({ onComplete, direction = 'left' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  // Animation Refs
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isIdleRef = useRef(false);

  // Mouse Move Handler
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Delay Spinner to avoid flicker on fast loads
  useEffect(() => {
    const t = setTimeout(() => setShowSpinner(true), 500); // Only show if load takes > 500ms
    return () => clearTimeout(t);
  }, []);

  const handleExit = () => {
    setIsExiting(true);

    // Trigger Camera Exit Animation
    if (cameraRef.current) {
      const currentPos = cameraRef.current.position;

      // EXIT LOGIC
      // L->R: Finished at Center. Exit -> Go Right (+2) & Back
      // R->L: Finished at Center. Exit -> Go Left (Back to Start, -10?) & Back

      const exitXOffset = direction === 'left' ? 2 : -10; // -10 to go back to "Start" area roughly

      gsap.to(currentPos, {
        x: currentPos.x + exitXOffset,
        z: currentPos.z - 2, // Pull back/out
        duration: 1.5,
        ease: "power2.in"
      });
    }

    setTimeout(() => {
      onComplete();
    }, 1500); // Match duration
  };

  // Countdown Logic - Starts immediately on mount once loaded
  useEffect(() => {
    if (!isLoaded) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoaded]);

  // Three.js SCENE
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // --- SETUP ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    console.log('[TransitionDebug] Canvas Size:', width, height);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Dark Grey, not pitch black

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Output encoding adjustment for better colors
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    canvasRef.current.innerHTML = ''; // Clear existing
    canvasRef.current.appendChild(renderer.domElement);

    canvasRef.current.appendChild(renderer.domElement);

    // --- SHARED STATE FOR ANIMATION LOOP ---
    // Mutable object to share data between Loader and Animate Loop
    const transitionParams = {
      initialized: false,
      entryX: 0,
      camHeight: 5,
      lookTarget: new THREE.Vector3(0, 0, 0)
    };

    // -- OPTIMIZED LIGHTING --
    // Single Strong Directional Light from "Front" (Behind Camera start)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(0, 10, 20); // Front-Right-High
    dirLight.castShadow = true;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8); // Even Brighter (Was 1.2)
    scene.add(ambientLight);

    // --- MODEL ---
    const loader = new GLTFLoader();
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let mixer: THREE.AnimationMixer;

    loader.load(
      '/games/exp/low-poly_laboratory.glb',
      (gltf) => {
        const model = gltf.scene;
        model.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            const mesh = node as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // FIX: Ensure Visibility & Quality
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.side = THREE.DoubleSide;
              mat.metalness = 0.1;
              mat.roughness = 0.8;
              mat.flatShading = false;
              // mat.emissive = new THREE.Color(0x000000); // Leave original emissive
              mat.needsUpdate = true;
            }
          }
        });

        // Scale/Center Logic
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        console.log('[TransitionDebug] Model Bounds:', { min: box.min, max: box.max, size, center });

        model.position.x = -center.x;
        model.position.z = -center.z;
        model.position.y = -box.min.y; // Floor at 0

        modelGroup.add(model);
        setIsLoaded(true);

        // --- ANIMATION SEQUENCE (Horizontal Rail / Truck) ---
        const tl = gsap.timeline();

        const roomScale = Math.max(size.x, size.z);

        // "Horizontal Rail" -> Truck Right (Move along X axis).
        // "Scene walks Left to Right" -> Camera moves Left to Right? 
        // Or Camera moves Right to Left (Scene moves Left)? 
        // Usually "coming from left" means Camera moves Left -> Right.
        // User says: "Camera parallel to one side... curve... stops in middle".
        // Let's try a wide lateral sweep.

        const camHeight = size.y * 0.55;
        const roomDepth = -roomScale * 0.8; // Looking deep

        // Look slightly Left (-X) to give the requested angle
        const lookTarget = new THREE.Vector3(-roomScale * 0.15, camHeight * 0.8, roomDepth);

        // Start closer to center (Lateral follow)
        const startX = -roomScale * 0.5;
        const startZ = roomScale * 0.75;

        // Entry Target (Refined: Less extreme movement)
        const entryX = roomScale * 0.15;
        const entryZ = roomScale * 0.25;

        // Update Shared Params for Animate Loop
        transitionParams.entryX = entryX;
        transitionParams.camHeight = camHeight;
        transitionParams.lookTarget = lookTarget;
        transitionParams.initialized = true;

        // Kill any safe camera
        camera.position.set(0, 0, 0);
        cameraRef.current = camera; // Store for exit handler

        // --- ANIMATION PHASES ---
        // 1. ENTRY (Move to Center)
        // 2. IDLE (Mouse Parallax)
        // 3. EXIT (Handled in handleExit)

        if (direction === 'left') {
          // STATS -> ABOUT (Enter)
          camera.position.set(startX, camHeight, startZ);
          camera.lookAt(lookTarget);

          // Single Smooth Entry (Bezier-like)
          tl.to(camera.position, {
            x: entryX,
            z: entryZ,
            duration: 5, // Smooth arrival
            ease: "power2.out",
            onUpdate: () => camera.lookAt(lookTarget),
            onComplete: () => { isIdleRef.current = true; } // Enable Mouse Interaction
          });

        } else {
          // ABOUT -> STATS (Reverse logic - Move Right to Left)
          // Start at the exit point of the L->R direction (Right side)
          // L->R Exit was: entryX + 2. So we start there.
          const rightStartX = entryX + 2;

          camera.position.set(rightStartX, camHeight, entryZ - 2); // Start slightly back too, matching exit
          camera.lookAt(lookTarget);

          // Move In from Right to Center
          tl.to(camera.position, {
            x: entryX,
            z: entryZ,
            duration: 5,
            ease: "power2.out", // Decelerate into center
            onUpdate: () => camera.lookAt(lookTarget),
            onComplete: () => { isIdleRef.current = true; }
          });
        }


      },
      undefined,
      (error) => console.error(error)
    );

    // --- LOOP ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Interactive Idle (Parallax)
      if (isIdleRef.current && !isExiting && transitionParams.initialized) {
        const { entryX, camHeight, lookTarget } = transitionParams;

        // Ultra-Reduced Parallax
        const influenceX = mouseRef.current.x * 0.2; // Very subtle (Was 0.8)

        const targetX = entryX + influenceX;
        const targetY = camHeight; // Locked Y logic

        // Lerp for smoothness
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (targetY - camera.position.y) * 0.05;
        camera.lookAt(lookTarget);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Store refs for cleanup/access
    (canvasRef.current as any).__scene = scene;
    (canvasRef.current as any).__camera = camera;
    (canvasRef.current as any).__renderer = renderer;

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [direction]); // Re-run when direction changes

  // Dynamic Slide Classes
  const slideInClass = direction === 'left' ? 'animate-in slide-in-from-right' : 'animate-in slide-in-from-left';
  const slideOutClass = direction === 'left' ? 'animate-out slide-out-to-left' : 'animate-out slide-out-to-right';

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center ${isExiting
        ? `${slideOutClass} fade-out duration-[1500ms] fill-mode-forwards`
        : `${slideInClass} fade-in duration-700`
        }`}
    >

      {/* 3D Container */}
      <div ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Loading State - delayed to avoid flicker */}
      {(!isLoaded && showSpinner) && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs uppercase tracking-widest text-purple-400">Loading Experience...</span>
          </div>
        </div>
      )}

      {/* Ad Overlay UI */}
      <div className="absolute top-8 left-8 bg-black/50 backdrop-blur px-3 py-1 rounded text-white/70 text-xs font-bold uppercase tracking-widest border border-white/10 select-none z-20">
        Anúncio Publicitário
      </div>

      {/* Skip Button Area */}
      <div className="absolute bottom-12 right-12 z-20">
        {canSkip ? (
          <button
            onClick={handleExit}
            className="group relative cursor-pointer flex items-center gap-3 pl-4 pr-2 py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            <span className="uppercase tracking-wider text-sm">Pular Anúncio</span>
            <div className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full group-hover:bg-accent transition-colors">
              <FaForward className="w-3 h-3" />
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-white font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-sm">Pode pular em {countdown}s</span>
          </div>
        )}
      </div>

      {/* Fake Ad Content Info */}
      <div className="absolute bottom-12 left-12 max-w-sm pointer-events-none z-20">
        <h2 className="text-white text-3xl font-bold mb-1 drop-shadow-lg tracking-tighter">Secret Laboratory</h2>
        <p className="text-white/60 text-sm font-mono tracking-wide">EXPERIMENT • SCIENCE • DATA</p>
      </div>

      {/* Vignette Overlay for cinematic feel */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-10" />
    </div>
  );
};

export default TransitionAd;
