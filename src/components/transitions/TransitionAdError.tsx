import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { FaForward } from 'react-icons/fa';
import { SquareAd } from '../commons/SquareAd';
import { SceneDebugger } from '../commons/SceneDebugger';

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

    const [cameraParams, setCameraParams] = useState({
        fov: 45,
        isFree: false
    });

    const [lightParams, setLightParams] = useState({
        ambientIntensity: 3.5,
        dirIntensity: 2.0,
        pointIntensity: 2.0,
        warmIntensity: 2.0
    });

    const [materialParams, setMaterialParams] = useState({
        metalness: 0.0,
        roughness: 0.5,
        opacity: 0.8,
        emissiveIntensity: 1.0,
        wireframe: false
    });

    const [meshParams, setMeshParams] = useState({
        rotationY: 0, // Reset to 0 as requested ("backwards" issue)
        positionX: 0,
        positionY: 0,
        positionZ: 0
    });

    // Animation Refs
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const lightsRef = useRef<any>({});
    const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const isIdleRef = useRef(false);

    // Update Refs when State Changes
    useEffect(() => {
        if (cameraRef.current) {
            cameraRef.current.fov = cameraParams.fov;
            cameraRef.current.updateProjectionMatrix();
        }
        if (controlsRef.current) {
            controlsRef.current.enabled = cameraParams.isFree;
        }

        // Update Lights
        if (lightsRef.current.ambient) lightsRef.current.ambient.intensity = lightParams.ambientIntensity;
        if (lightsRef.current.dir) lightsRef.current.dir.intensity = lightParams.dirIntensity;
        if (lightsRef.current.point) lightsRef.current.point.intensity = lightParams.pointIntensity;
        if (lightsRef.current.warm) lightsRef.current.warm.intensity = lightParams.warmIntensity;

        // Update Material
        if (materialRef.current) {
            materialRef.current.metalness = materialParams.metalness;
            materialRef.current.roughness = materialParams.roughness;
            materialRef.current.transparent = true;
            materialRef.current.opacity = materialParams.opacity;
            materialRef.current.emissiveIntensity = materialParams.emissiveIntensity;
            materialRef.current.wireframe = materialParams.wireframe;
            materialRef.current.needsUpdate = true;
        }

        // Update Mesh
        if (modelRef.current) {
            modelRef.current.rotation.y = meshParams.rotationY;
            // Apply RELATIVE changes if we want, but for now absolute is fine OR we need to remember the center.
            // The loading logic sets initial position. Let's assume these assume 0 offsets from that calculated center? 
            // Or better, we apply these AS offsets or absolute values. 
            // Given the complexity of "centering", let's apply these as modifiers to the base position IF we stored it.
            // Simplified: Just applying them directly might jump the model. 
            // A safer bet is adding a "DebugGroup" wrapper or just modifying the Group's position.
            // Let's modify the group position relative to 0 since we centered it inside the Group.
            // Actually, the previous logic: "model.position.x = -center.x". So the MODEL is centered at 0,0,0 relative to its parent.
            // So modifying `modelGroup.position` is the way to go.
            // Wait, `modelGroup` is created in useEffect locally. We need a ref to it.
        }

    }, [cameraParams, lightParams, materialParams, meshParams]);

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

        if (cameraRef.current && !cameraParams.isFree) {
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
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        canvasRef.current.innerHTML = '';
        canvasRef.current.appendChild(renderer.domElement);

        // ORBIT CONTROLS
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enabled = false; // Disabled by default
        controls.enableDamping = true;
        controlsRef.current = controls;

        const transitionParams = {
            initialized: false,
            entryX: 0,
            camHeight: 5,
            lookTarget: new THREE.Vector3(0, 0, 0)
        };

        // --- LIGHTS ---
        const dirLight = new THREE.DirectionalLight(0xffffff, lightParams.dirIntensity);
        dirLight.position.set(0, 20, 50); // Moved light higher and further back (behind camera)
        dirLight.castShadow = true;
        dirLight.shadow.bias = -0.0001;
        scene.add(dirLight);
        lightsRef.current.dir = dirLight;

        const ambientLight = new THREE.AmbientLight(0xffffff, lightParams.ambientIntensity);
        scene.add(ambientLight);
        lightsRef.current.ambient = ambientLight;

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2.0);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        const pointLight = new THREE.PointLight(0xffffff, lightParams.pointIntensity);
        pointLight.position.set(0, 5, 10); // Moved point light slightly further back too
        scene.add(pointLight);
        lightsRef.current.point = pointLight;

        const warmLight = new THREE.PointLight(0xffaa00, lightParams.warmIntensity, 50);
        warmLight.position.set(0, 10, 10); // Adjust warm light position
        scene.add(warmLight);
        lightsRef.current.warm = warmLight;


        const loader = new GLTFLoader();
        const modelGroup = new THREE.Group();
        scene.add(modelGroup);
        modelRef.current = modelGroup;

        let mixer: THREE.AnimationMixer;

        loader.load(
            '/games/exp/i_am_error.glb',
            (gltf) => {
                const model = gltf.scene;

                // --- MATERIAL OVERRIDE ---
                model.traverse((node) => {
                    if ((node as THREE.Mesh).isMesh) {
                        const mesh = node as THREE.Mesh;
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;

                        // Capture First Material for Debugging
                        if (mesh.material && !materialRef.current) {
                            materialRef.current = mesh.material as THREE.MeshStandardMaterial;
                            setMaterialParams(prev => ({
                                ...prev,
                                metalness: materialRef.current?.metalness || 0,
                                roughness: materialRef.current?.roughness || 0.5,
                            }));
                        }

                        if (mesh.material) {
                            const mat = mesh.material as THREE.MeshStandardMaterial;
                            mat.side = THREE.DoubleSide;
                            mat.metalness = 0.0;
                            mat.roughness = 0.5;
                            mat.flatShading = false;
                            mat.transparent = true; // FORCE TRANSPARENCY
                            mat.opacity = 0.8;
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

                // INITIAL ROTATION from State
                modelGroup.rotation.y = meshParams.rotationY;

                modelGroup.add(model);
                setIsLoaded(true);

                // Movement Logic
                const tl = gsap.timeline();
                const roomScale = Math.max(size.x, size.z);

                // ADJUSTED CAMERA PARAMS
                const camHeight = size.y * 0.8; // Medium-High (was 0.55)
                const roomDepth = -roomScale * 0.8;
                const lookTarget = new THREE.Vector3(-roomScale * 0.0, size.y * 0.4, roomDepth * 0.1); // Look more at center/slightly down
                const startX = -roomScale * 0.5;
                const startZ = roomScale * 0.85; // Further back start
                const entryX = roomScale * 0.0; // Centered X
                const entryZ = roomScale * 0.75; // Further back end (was 0.5)

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
                        onUpdate: () => {
                            if (!cameraParams.isFree) camera.lookAt(lookTarget)
                        },
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
                        onUpdate: () => {
                            if (!cameraParams.isFree) camera.lookAt(lookTarget)
                        },
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

            if (controlsRef.current && controlsRef.current.enabled) {
                controlsRef.current.update();
            } else if (isIdleRef.current && !isExiting && transitionParams.initialized) {
                const { entryX, camHeight, lookTarget } = transitionParams;
                // Reduce influence if free cam was used? No, simplistic check.
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
            controls.dispose();
        };
    }, [direction]); // Note: This resets debugger state on re-mount if dependencies change too often

    const slideInClass = direction === 'left' ? 'animate-in slide-in-from-right' : 'animate-in slide-in-from-left';
    const slideOutClass = direction === 'left' ? 'animate-out slide-out-to-left' : 'animate-out slide-out-to-right';

    return (
        <>
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
                    <div className="pointer-events-auto">
                        <SquareAd />
                    </div>
                </div>

                <div className="absolute top-8 left-8 bg-black/50 backdrop-blur px-3 py-1 rounded text-red-500/70 text-xs font-bold uppercase tracking-widest border border-red-500/10 select-none z-20">
                    System Error - Debug Mode Active
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

            </div>

            {/* SCENE DEBUGGER HUD */}
            <SceneDebugger
                initialValues={{
                    camera: cameraParams,
                    lights: lightParams,
                    material: materialParams,
                    mesh: meshParams
                }}
                onUpdateCamera={setCameraParams}
                onUpdateLights={setLightParams}
                onUpdateMaterial={setMaterialParams}
                onUpdateMesh={setMeshParams}
            />
        </>
    );
};

export default TransitionAdError;
