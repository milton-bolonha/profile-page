import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { FaForward } from 'react-icons/fa';
import { SquareAd } from '../commons/SquareAd';

interface TransitionAdErrorProps {
    onComplete: () => void;
    direction?: 'left' | 'right';
}

const TransitionAdError: React.FC<TransitionAdErrorProps> = ({ onComplete, direction = 'left' }) => {
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

        if (cameraRef.current) {
            const currentPos = cameraRef.current.position;
            const exitXOffset = direction === 'left' ? 2 : -10;

            gsap.to(currentPos, {
                x: currentPos.x + exitXOffset,
                z: currentPos.z - 2,
                duration: 1.5,
                ease: "power2.in"
            });
        }

        setTimeout(() => {
            onComplete();
        }, 1500);
    };

    // Countdown Logic
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

        const transitionParams = {
            initialized: false,
            entryX: 0,
            camHeight: 5,
            lookTarget: new THREE.Vector3(0, 0, 0)
        };

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLight.position.set(0, 10, 20);
        dirLight.castShadow = true;
        dirLight.shadow.bias = -0.0001;
        scene.add(dirLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
        scene.add(ambientLight);

        const loader = new GLTFLoader();
        const modelGroup = new THREE.Group();
        scene.add(modelGroup);

        let mixer: THREE.AnimationMixer;

        loader.load(
            '/games/exp/i_am_error.glb', // UPDATED MODEL PATH
            (gltf) => {
                const model = gltf.scene;
                model.traverse((node) => {
                    if ((node as THREE.Mesh).isMesh) {
                        const mesh = node as THREE.Mesh;
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        if (mesh.material) {
                            const mat = mesh.material as THREE.MeshStandardMaterial;
                            mat.side = THREE.DoubleSide;
                            mat.metalness = 0.1;
                            mat.roughness = 0.8;
                            mat.flatShading = false;
                            mat.needsUpdate = true;
                        }
                    }
                });

                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                model.position.x = -center.x;
                model.position.z = -center.z;
                model.position.y = -box.min.y;

                modelGroup.add(model);
                setIsLoaded(true);

                // Movement Logic (Identical to Lab for now)
                const tl = gsap.timeline();
                const roomScale = Math.max(size.x, size.z);
                const camHeight = size.y * 0.55;
                const roomDepth = -roomScale * 0.8;
                const lookTarget = new THREE.Vector3(-roomScale * 0.15, camHeight * 0.8, roomDepth);
                const startX = -roomScale * 0.5;
                const startZ = roomScale * 0.75;
                const entryX = roomScale * 0.15;
                const entryZ = roomScale * 0.45;

                transitionParams.entryX = entryX;
                transitionParams.camHeight = camHeight;
                transitionParams.lookTarget = lookTarget;
                transitionParams.initialized = true;

                camera.position.set(0, 0, 0);
                cameraRef.current = camera;

                if (direction === 'left') {
                    camera.position.set(startX, camHeight, startZ);
                    camera.lookAt(lookTarget);
                    tl.to(camera.position, {
                        x: entryX,
                        z: entryZ,
                        duration: 5,
                        ease: "power2.out",
                        onUpdate: () => camera.lookAt(lookTarget),
                        onComplete: () => { isIdleRef.current = true; }
                    });
                } else {
                    const rightStartX = entryX + 2;
                    camera.position.set(rightStartX, camHeight, entryZ - 2);
                    camera.lookAt(lookTarget);
                    tl.to(camera.position, {
                        x: entryX,
                        z: entryZ,
                        duration: 5,
                        ease: "power2.out",
                        onUpdate: () => camera.lookAt(lookTarget),
                        onComplete: () => { isIdleRef.current = true; }
                    });
                }
            },
            undefined,
            (error) => console.error(error)
        );

        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            if (isIdleRef.current && !isExiting && transitionParams.initialized) {
                const { entryX, camHeight, lookTarget } = transitionParams;
                const influenceX = mouseRef.current.x * 0.2;
                const targetX = entryX + influenceX;
                const targetY = camHeight;
                camera.position.x += (targetX - camera.position.x) * 0.05;
                camera.position.y += (targetY - camera.position.y) * 0.05;
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
    }, [direction]);

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
            <div ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {(!isLoaded && showSpinner) && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black text-white">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs uppercase tracking-widest text-red-500">Loading Error...</span>
                    </div>
                </div>
            )}

            {/* Center Square Ad for Error Scene */}
            <div className="absolute inset-0 z-[120] flex items-center justify-center pointer-events-none">
                <SquareAd />
            </div>

            <div className="absolute top-8 left-8 bg-black/50 backdrop-blur px-3 py-1 rounded text-red-500/70 text-xs font-bold uppercase tracking-widest border border-red-500/10 select-none z-20">
                System Error
            </div>

            <div className="absolute bottom-12 right-12 z-20">
                {canSkip ? (
                    <button
                        onClick={handleExit}
                        className="group relative cursor-pointer flex items-center gap-3 pl-4 pr-2 py-2 bg-red-600 text-white font-bold rounded-full hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none shadow-[0_0_20px_rgba(255,0,0,0.4)]"
                    >
                        <span className="uppercase tracking-wider text-sm">Force Skip</span>
                        <div className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full group-hover:bg-red-800 transition-colors">
                            <FaForward className="w-3 h-3" />
                        </div>
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-white font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-red-500/30 text-red-400">
                        <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                        <span className="text-sm">Recovering {countdown}s</span>
                    </div>
                )}
            </div>

            <div className="absolute bottom-12 left-12 max-w-sm pointer-events-none z-20">
                <h2 className="text-red-500 text-3xl font-bold mb-1 drop-shadow-lg tracking-tighter">I AM ERROR</h2>
                <p className="text-red-400/60 text-sm font-mono tracking-wide">GLITCH • DATA • CORRUPTION</p>
            </div>

            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(50,0,0,0.6)_100%)] z-10" />
        </div>
    );
};

export default TransitionAdError;
