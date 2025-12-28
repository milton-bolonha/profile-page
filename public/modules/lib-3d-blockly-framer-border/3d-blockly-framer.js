/**
 * 3D Blockly Framer Border
 * 
 * A lightweight Three.js library that creates interactive 3D voxel frame effects for images.
 * Features hollow border optimization, mouse interaction, and smooth 360° rotation animations.
 * 
 * @version 1.0.0
 * @author Milton Bolonha
 * @license MIT
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class VoxelImageRenderer {
  constructor(container, options = {}) {
    this.container = container;
    this.baseResolution = options.resolution || 128;
    this.resX = 128;
    this.resY = 128;
    this.baseSize = options.size || 180;
    this.width = 135; // 3:4 aspect ratio
    this.height = 180;
    this.group = null;
    this.voxels = [];
    this.pixelData = null;
    this.cachedTexture = null;
    this.originalWidth = 0;
    this.originalHeight = 0;
    this.active = false;
    this.frameMode = true;
    this.animationId = null;
    this.isRotating = false;
    this.rotationProgress = 0;
    this.rotationDirection = 1;
    this.tiltX = 0;
    this.tiltY = 0;
    
    this.texLoader = new THREE.TextureLoader();
    this.texLoader.setCrossOrigin('anonymous');
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    
    this.initScene();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 5000);
    this.camera.position.set(0, 0, 250);
    this.cameraBaseZ = 250;
    this.cameraTargetZ = 250;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);
    
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enabled = false;
    
    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(10, 20, 30);
    this.scene.add(dirLight);
    
    this.camLight = new THREE.PointLight(0xffffff, 150, 100);
    this.scene.add(this.camLight);
    
    const probeSize = 12.0;
    this.probeGroup = new THREE.Group();
    const probeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(probeSize, probeSize, probeSize),
      new THREE.MeshStandardMaterial({ 
        color: 0xff0022, 
        transparent: true, 
        opacity: 0.0,
        emissive: 0xff0000,
        emissiveIntensity: 0.0
      })
    );
    this.probeGroup.add(probeMesh);
    const line = new THREE.LineSegments(
      new THREE.EdgesGeometry(probeMesh.geometry), 
      new THREE.LineBasicMaterial({ 
        color: 0xff3344,
        transparent: true,
        opacity: 0.0
      })
    );
    this.probeGroup.add(line);
    this.probeGroup.position.set(0, 0, 0);
    this.scene.add(this.probeGroup);
    
    this.probeSize = probeSize;
    this.probeInv = new THREE.Matrix4();
    
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    
    this.mouse = { x: 0, y: 0 };
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.renderer.domElement.addEventListener('mousemove', this.handleMouseMove);
  }

  handleResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  handleMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    if (!this.raycaster) {
      this.raycaster = new THREE.Raycaster();
    }
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectPoint = new THREE.Vector3();
    
    this.raycaster.ray.intersectPlane(plane, intersectPoint);
    
    if (intersectPoint) {
      this.probeGroup.position.x = intersectPoint.x;
      this.probeGroup.position.y = intersectPoint.y;
      this.probeGroup.position.z = 0;
    }
    
    this.tiltX = this.mouse.y * 0.08;
    this.tiltY = this.mouse.x * 0.08;
  }

  async load(imageUrl) {
    return new Promise((resolve, reject) => {
      this.texLoader.load(
        imageUrl,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          this.cachedTexture = texture;
          this.originalWidth = texture.image.width;
          this.originalHeight = texture.image.height;
          
          this.calculateResolution(this.baseResolution);
          this.process();
          this.active = true;
          resolve();
        },
        undefined,
        (err) => {
          console.error('[3D Blockly Framer] Failed to load texture:', err);
          reject(err);
        }
      );
    });
  }

  calculateResolution(targetRes) {
    const aspect = this.originalWidth / this.originalHeight;
    
    if (aspect > 1) {
      this.resX = targetRes;
      this.resY = Math.round(targetRes / aspect);
    } else {
      this.resY = targetRes;
      this.resX = Math.round(targetRes * aspect);
    }
    
    const meshAspect = this.resX / this.resY;
    if (meshAspect > 1) {
      this.width = this.baseSize;
      this.height = this.baseSize / meshAspect;
    } else {
      this.height = this.baseSize;
      this.width = this.baseSize * meshAspect;
    }
  }

  process() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = this.resX;
    canvas.height = this.resY;
    ctx.drawImage(this.cachedTexture.image, 0, 0, this.resX, this.resY);
    
    try {
      this.pixelData = ctx.getImageData(0, 0, this.resX, this.resY).data;
    } catch(e) {
      console.error('[3D Blockly Framer] Canvas tainted!', e);
      throw e;
    }
    
    this.buildFrame();
  }

  buildFrame() {
    if (this.group) this.scene.remove(this.group);
    
    this.group = new THREE.Group();
    this.voxels = [];

    const planeGeo = new THREE.PlaneGeometry(this.width * 0.9, this.height * 0.9);
    const planeMat = new THREE.MeshBasicMaterial({
      map: this.cachedTexture,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.position.z = 0.5;
    this.group.add(planeMesh);

    const borderThickness = 3;
    const voxelSize = Math.min(this.width, this.height) / Math.max(this.resX, this.resY) * 0.95;

    const getPixel = (x, y) => {
      if (x < 0 || x >= this.resX || y < 0 || y >= this.resY) return null;
      const idx = (y * this.resX + x) * 4;
      return {
        r: this.pixelData[idx],
        g: this.pixelData[idx + 1],
        b: this.pixelData[idx + 2],
        a: this.pixelData[idx + 3]
      };
    };

    const isEdge = (x, y) => {
      if (x === 0 || x === this.resX - 1 || y === 0 || y === this.resY - 1) {
        return true;
      }

      const current = getPixel(x, y);
      if (!current || current.a < 128) return false;

      const threshold = 30;
      const neighbors = [
        getPixel(x - 1, y),
        getPixel(x + 1, y),
        getPixel(x, y - 1),
        getPixel(x, y + 1)
      ];

      for (const neighbor of neighbors) {
        if (!neighbor || neighbor.a < 128) return true;
        const dr = Math.abs(current.r - neighbor.r);
        const dg = Math.abs(current.g - neighbor.g);
        const db = Math.abs(current.b - neighbor.b);
        if (dr + dg + db > threshold) return true;
      }
      return false;
    };

    let voxelCount = 0;
    for (let y = 0; y < this.resY; y++) {
      for (let x = 0; x < this.resX; x++) {
        const isTopBorder = y < borderThickness;
        const isBottomBorder = y >= this.resY - borderThickness;
        const isLeftBorder = x < borderThickness;
        const isRightBorder = x >= this.resX - borderThickness;

        if (!(isTopBorder || isBottomBorder || isLeftBorder || isRightBorder)) {
          continue;
        }

        if (!isEdge(x, y)) {
          continue;
        }

        const i = y * this.resX + x;
        const idx = i * 4;
        const r = this.pixelData[idx];
        const g = this.pixelData[idx + 1];
        const b = this.pixelData[idx + 2];

        const color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
        const material = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.3,
          metalness: 0.1,
          emissive: color,
          emissiveIntensity: 0.05
        });

        const mesh = new THREE.Mesh(this.geometry, material);

        const stepX = this.width / this.resX;
        const stepY = this.height / this.resY;
        const baseX = x * stepX - this.width / 2 + stepX / 2;
        const baseY = (this.resY - y - 1) * stepY - this.height / 2 + stepY / 2;

        mesh.position.set(baseX, baseY, 0);
        mesh.scale.set(voxelSize, voxelSize, voxelSize);

        this.group.add(mesh);

        this.voxels.push({
          mesh: mesh,
          baseX: baseX,
          baseY: baseY,
          offsetX: 0,
          offsetY: 0,
          offsetZ: 0,
          velocityX: 0,
          velocityY: 0,
          velocityZ: 0
        });

        voxelCount++;
      }
    }

    this.scene.add(this.group);
  }

  update() {
    if (!this.active || !this.group) return;
    
    const worldMatrix = this.group.matrixWorld;

    for (let i = 0; i < this.voxels.length; i++) {
      const voxel = this.voxels[i];
      
      const currentPos = new THREE.Vector3(
        voxel.baseX + voxel.offsetX,
        voxel.baseY + voxel.offsetY,
        voxel.offsetZ
      );
      const worldPos = currentPos.clone().applyMatrix4(worldMatrix);
      const posInProbe = worldPos.applyMatrix4(this.probeInv);

      const probeHalfSize = this.probeSize / 2;
      
      if (Math.abs(posInProbe.x) < probeHalfSize && 
          Math.abs(posInProbe.y) < probeHalfSize && 
          Math.abs(posInProbe.z) < probeHalfSize) {
        
        const dx = probeHalfSize - Math.abs(posInProbe.x);
        const dy = probeHalfSize - Math.abs(posInProbe.y);
        const dz = probeHalfSize - Math.abs(posInProbe.z);
        
        let pDir = new THREE.Vector3();
        let pen = 0;
        
        if (dx < dy && dx < dz) { 
          pDir.set(Math.sign(posInProbe.x), 0, 0); 
          pen = dx; 
        } else if (dy < dz) { 
          pDir.set(0, Math.sign(posInProbe.y), 0); 
          pen = dy; 
        } else { 
          pDir.set(0, 0, Math.sign(posInProbe.z)); 
          pen = dz; 
        }
        
        const pushWorld = pDir.transformDirection(this.probeGroup.matrixWorld);
        voxel.offsetX += pushWorld.x * pen;
        voxel.offsetY += pushWorld.y * pen;
        voxel.offsetZ += pushWorld.z * pen;
        voxel.velocityX += pushWorld.x * pen * 0.45;
        voxel.velocityY += pushWorld.y * pen * 0.45;
        voxel.velocityZ += pushWorld.z * pen * 0.45;
      }

      voxel.velocityX *= 0.88;
      voxel.velocityY *= 0.88;
      voxel.velocityZ *= 0.88;
      voxel.velocityX -= voxel.offsetX * 0.18;
      voxel.velocityY -= voxel.offsetY * 0.18;
      voxel.velocityZ -= voxel.offsetZ * 0.18;
      voxel.offsetX += voxel.velocityX;
      voxel.offsetY += voxel.velocityY;
      voxel.offsetZ += voxel.velocityZ;

      voxel.mesh.position.set(
        voxel.baseX + voxel.offsetX,
        voxel.baseY + voxel.offsetY,
        voxel.offsetZ
      );
    }
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    this.camLight.position.copy(this.camera.position);
    
    this.probeGroup.rotation.y += 0.008;
    this.probeGroup.rotation.x += 0.005;
    this.probeGroup.updateMatrixWorld();
    this.probeInv.copy(this.probeGroup.matrixWorld).invert();
    
    if (this.isRotating && this.group) {
      this.rotationProgress += 0.02;
      
      this.cameraTargetZ = 300;
      
      if (this.rotationProgress >= 1) {
        this.rotationProgress = 0;
        this.isRotating = false;
        this.group.rotation.y = 0;
        this.group.rotation.x = 0;
        this.cameraTargetZ = this.cameraBaseZ;
      } else {
        const t = this.rotationProgress;
        const bounce = t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        this.group.rotation.y = bounce * Math.PI * 2 * this.rotationDirection;
      }
    } else if (this.group) {
      this.group.rotation.x += (this.tiltX - this.group.rotation.x) * 0.05;
      this.group.rotation.y += (this.tiltY - this.group.rotation.y) * 0.05;
      this.cameraTargetZ = this.cameraBaseZ;
    }
    
    this.camera.position.z += (this.cameraTargetZ - this.camera.position.z) * 0.08;
    
    this.update();
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.animate();
  }

  rotate360() {
    if (this.isRotating) return;
    
    this.isRotating = true;
    this.rotationProgress = 0;
    this.rotationDirection *= -1;
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    window.removeEventListener('resize', this.handleResize);
    
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.removeEventListener('mousemove', this.handleMouseMove);
    }
    
    if (this.group) {
      this.scene.remove(this.group);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container.contains(this.renderer.domElement)) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
    
    if (this.orbit) {
      this.orbit.dispose();
    }
  }
}

export async function init3DBlocklyFramer(container, imageUrl, options = {}) {
  const renderer = new VoxelImageRenderer(container, options);
  
  try {
    await renderer.load(imageUrl);
    renderer.start();
    
    return {
      renderer: renderer,
      cleanup: () => renderer.destroy()
    };
  } catch (error) {
    console.error('[3D Blockly Framer] Initialization failed:', error);
    renderer.destroy();
    throw error;
  }
}

export default init3DBlocklyFramer;
