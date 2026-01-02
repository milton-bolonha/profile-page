import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';

export const TransitionAdStandalone = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  
  // Animation Refs
  const mouseRef = useRef({ x: 0, y: 0 });
  const isIdleRef = useRef(false);

  // Mouse Move Handler
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
        // Calculate relative to container if possible, or window for parallax
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
             // Normalize -1 to 1 based on container
             mouseRef.current = {
                x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
                y: -((e.clientY - rect.top) / rect.height) * 2 + 1
             };
        }
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowSpinner(true), 500); 
    return () => clearTimeout(t);
  }, []);

  // Three.js SCENE
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace; 

    canvasRef.current.innerHTML = ''; 
    canvasRef.current.appendChild(renderer.domElement);

    // Light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(0, 10, 20); 
    dirLight.castShadow = true;
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    // Model
    const loader = new GLTFLoader();
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Animation Params
    const transitionParams = {
        initialized: false,
        entryX: 0,
        camHeight: 5,
        lookTarget: new THREE.Vector3(0, 0, 0)
    };

    loader.load(
      '/games/exp/low-poly_laboratory.glb', 
      (gltf) => {
        const model = gltf.scene;
        model.traverse((node: any) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        
        // Scale/Center
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        model.position.x = -center.x;
        model.position.z = -center.z;
        model.position.y = -box.min.y;
        
        modelGroup.add(model);
        setIsLoaded(true);

        // --- ANIMATION SETUP ---
        const roomScale = Math.max(size.x, size.z);
        const camHeight = size.y * 0.55; 
        const roomDepth = -roomScale * 0.8;
        
        const lookTarget = new THREE.Vector3(-roomScale * 0.15, camHeight * 0.8, roomDepth);
        const startX = -roomScale * 0.5; 
        const startZ = roomScale * 0.75; 
        const entryX = roomScale * 0.15; 
        const entryZ = roomScale * 0.25; 

        transitionParams.entryX = entryX;
        transitionParams.camHeight = camHeight;
        transitionParams.lookTarget = lookTarget;
        transitionParams.initialized = true;

        // Start Position (Idle state immediately for standalone)
        camera.position.set(entryX, camHeight, entryZ);
        camera.lookAt(lookTarget);
        
        // Slight entry move
        gsap.from(camera.position, {
            x: startX,
            z: startZ,
            duration: 4,
            ease: "power2.out",
            onUpdate: () => camera.lookAt(lookTarget),
            onComplete: () => { isIdleRef.current = true; }
        });

      },
      undefined,
      (error) => console.error(error)
    );

    // Loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      if (isIdleRef.current && transitionParams.initialized) {
          const { entryX, camHeight, lookTarget } = transitionParams;
          const influenceX = mouseRef.current.x * 0.3; // Parallax intensity
          
          const targetX = entryX + influenceX; 
          camera.position.x += (targetX - camera.position.x) * 0.05;
          camera.lookAt(lookTarget);
      }
      
      renderer.render(scene, camera);
    };
    animate();

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
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[500px] overflow-hidden rounded-2xl border border-white/10 my-24">
        <div ref={containerRef} className="absolute inset-0 bg-black">
             <div ref={canvasRef} className="absolute inset-0 w-full h-full" />
             
             {/* Overlay Info */}
             <div className="absolute bottom-6 left-8 pointer-events-none z-10">
                 <div className="bg-black/50 backdrop-blur px-3 py-1 rounded text-white/70 text-xs font-bold uppercase tracking-widest border border-white/10 inline-block mb-2">
                    Showcase
                 </div>
                 <h2 className="text-white text-2xl font-bold tracking-tight">3D Experiments</h2>
             </div>
             
             <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] z-10" />
        </div>

        {(!isLoaded && showSpinner) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
        )}
    </div>
  );
};
