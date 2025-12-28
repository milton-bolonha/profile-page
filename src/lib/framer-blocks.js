/**
 * Framer-Blocks Library
 * 
 * Creates interactive 3D voxel meshes from images using Three.js
 * Adapted from blocks.html with 128 resolution and frame mode optimization
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class VoxelImageRenderer {
  constructor(container, options = {}) {
    this.container = container;
    this.baseResolution = options.resolution || 128;
    this.resX = 128;
    this.resY = 128;
    this.baseSize = options.size || 180;
    this.width = 135; // 3:4 aspect ratio (180 * 0.75)
    this.height = 180;
    this.borderThickness = 3; // Border thickness for cursor detection
    this.layeredDelay = options.layeredDelay !== undefined ? options.layeredDelay : false;
    this.voxelizeImage = options.voxelizeImage !== undefined ? options.voxelizeImage : false;
    this.fullVoxelMesh = null;
    this.isVoxelized = false;
    this.gravityEnabled = false;
    this.gravityTransition = 0; // 0 to 1 for smooth transition
    this.groundY = -this.height / 2 - 5; // Ground just below the image
    this.group = null;
    this.voxels = [];
    this.pixelData = null;
    this.cachedTexture = null;
    this.originalWidth = 0;
    this.originalHeight = 0;
    this.active = false;
    this.frameMode = true; // Frame mode enabled by default
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
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    
    // Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 5000);
    this.camera.position.set(0, 0, 250); // Close framing for normal view
    this.cameraBaseZ = 250; // Store base position
    this.cameraTargetZ = 250; // For smooth transitions
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);
    
    // Controls - DISABLED (image stays fixed)
    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.enabled = false; // Disable user control
    
    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(10, 20, 30);
    this.scene.add(dirLight);
    
    this.camLight = new THREE.PointLight(0xffffff, 150, 100);
    this.scene.add(this.camLight);
    
    // Probe (interactive cube) - More transparent
    const probeSize = 12.0;
    this.probeGroup = new THREE.Group();
    const probeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(probeSize, probeSize, probeSize),
      new THREE.MeshStandardMaterial({ 
        color: 0xff0022, 
        transparent: true, 
        opacity: 0.0, // Completely invisible - only see effect on voxels
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
        opacity: 0.0 // Completely invisible
      })
    );
    this.probeGroup.add(line);
    this.probeGroup.position.set(0, 0, 0); // Center position
    this.scene.add(this.probeGroup);
    
    this.probeSize = probeSize;
    this.probeInv = new THREE.Matrix4();
    
    // Handle window resize
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    
    // Mouse tracking for probe (2D only)
    this.mouse = { x: 0, y: 0 };
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.renderer.domElement.addEventListener('mousemove', this.handleMouseMove);
    
    // Default cursor
    this.renderer.domElement.style.cursor = 'default';
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
    // Convert to normalized device coordinates (-1 to +1)
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Check if mouse is in border area (for cursor pointer)
    // During voxelized mode, use interior voxels for detection
    if (this.isVoxelized && this.fullVoxelMesh) {
      // Use raycasting on interior voxels for precise cursor control
      const voxelRaycaster = new THREE.Raycaster();
      voxelRaycaster.setFromCamera(this.mouse, this.camera);
      const interiorVoxels = this.fullVoxelMesh
        .filter(v => !v.isEdge)
        .map(v => v.mesh);
      const intersects = voxelRaycaster.intersectObjects(interiorVoxels);
      
      if (intersects.length > 0) {
        this.renderer.domElement.style.cursor = 'default'; // Over image
      } else {
        this.renderer.domElement.style.cursor = 'pointer'; // Over border
      }
    } else {
      // Only show pointer if outside the center image area (90% of mesh)
      const imageWidthRatio = (this.width * 0.9) / this.baseSize;
      const imageHeightRatio = (this.height * 0.9) / this.baseSize;
      
      const absX = Math.abs(this.mouse.x);
      const absY = Math.abs(this.mouse.y);
      
      // Check if mouse is OUTSIDE the center image area
      const outsideImageX = absX > imageWidthRatio * 0.5;
      const outsideImageY = absY > imageHeightRatio * 0.5;
      
      if (outsideImageX || outsideImageY) {
        this.renderer.domElement.style.cursor = 'pointer';
      } else {
        this.renderer.domElement.style.cursor = 'default';
      }
    }
    
    // Use raycaster to position probe exactly where mouse is on the mesh plane
    if (!this.raycaster) {
      this.raycaster = new THREE.Raycaster();
    }
    
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Create an invisible plane at Z=0 (same as the mesh)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectPoint = new THREE.Vector3();
    
    // Get intersection point with the plane
    this.raycaster.ray.intersectPlane(plane, intersectPoint);
    
    if (intersectPoint) {
      // Position probe exactly where mouse is pointing on the mesh plane
      this.probeGroup.position.x = intersectPoint.x;
      this.probeGroup.position.y = intersectPoint.y;
      this.probeGroup.position.z = 0; // Same Z as mesh
    }
    
    // Subtle tilt effect based on mouse position
    this.tiltX = this.mouse.y * 0.08; // Increased tilt strength
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
          
          console.log(`[Framer-Blocks] Texture loaded: ${this.originalWidth}x${this.originalHeight}`);
          this.calculateResolution(this.baseResolution);
          this.process();
          this.active = true;
          resolve();
        },
        undefined,
        (err) => {
          console.error('[Framer-Blocks] Failed to load texture:', err);
          reject(err);
        }
      );
    });
  }

  calculateResolution(targetRes) {
    if (targetRes === 'original') {
      const maxDim = 256;
      const aspect = this.originalWidth / this.originalHeight;
      
      if (this.originalWidth > this.originalHeight) {
        this.resX = Math.min(this.originalWidth, maxDim);
        this.resY = Math.round(this.resX / aspect);
      } else {
        this.resY = Math.min(this.originalHeight, maxDim);
        this.resX = Math.round(this.resY * aspect);
      }
    } else {
      const aspect = this.originalWidth / this.originalHeight;
      
      if (aspect > 1) {
        this.resX = targetRes;
        this.resY = Math.round(targetRes / aspect);
      } else {
        this.resY = targetRes;
        this.resX = Math.round(targetRes * aspect);
      }
    }
    
    // Calculate frame dimensions preserving aspect ratio
    const aspect = this.resX / this.resY;
    if (aspect > 1) {
      this.width = this.baseSize;
      this.height = this.baseSize / aspect;
    } else {
      this.height = this.baseSize;
      this.width = this.baseSize * aspect;
    }
    
    console.log(`[Framer-Blocks] Resolution: ${this.resX}x${this.resY}`);
  }

  process() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = this.resX;
    canvas.height = this.resY;
    ctx.drawImage(this.cachedTexture.image, 0, 0, this.resX, this.resY);
    
    try {
      this.pixelData = ctx.getImageData(0, 0, this.resX, this.resY).data;
      console.log('[Framer-Blocks] Pixels extracted successfully');
    } catch(e) {
      console.error('[Framer-Blocks] Canvas tainted!', e);
      throw e;
    }
    
    if (this.frameMode) {
      this.buildFrame();
    } else {
      this.build();
    }
  }

  buildFrame() {
    if (this.group) this.scene.remove(this.group);
    
    this.group = new THREE.Group();
    this.voxels = [];

    // 1. CENTER: Flat image plane (high quality, lightweight)
    // Use fixed gap in pixels for uniform spacing on all sides
    const gapSize = 8; // pixels of gap between image and border
    const planeGeo = new THREE.PlaneGeometry(this.width - gapSize, this.height - gapSize);
    const planeMat = new THREE.MeshBasicMaterial({
      map: this.cachedTexture,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.position.z = 0.5; // Move forward to prevent Z-fighting
    this.group.add(planeMesh);

    // 2. BORDERS: Voxelized blocks (decorative effect) - HOLLOW
    const borderThickness = 3; // Number of blocks in border thickness
    const voxelSize = Math.min(this.width, this.height) / Math.max(this.resX, this.resY) * 0.95;

    console.log(`[Framer-Blocks] Creating hollow frame with ${borderThickness} blocks...`);

    // Helper: Get pixel color at position
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

    // Helper: Check if pixel is an edge
    const isEdge = (x, y) => {
      if (x === 0 || x === this.resX - 1 || y === 0 || y === this.resY - 1) {
        return true;
      }

      const current = getPixel(x, y);
      if (!current || current.a < 128) return false;

      const threshold = 30; // Original value - works best
      const neighbors = [
        getPixel(x - 1, y),
        getPixel(x + 1, y),
        getPixel(x, y - 1),
        getPixel(x, y + 1),
        // Add diagonal neighbors for better edge detection
        getPixel(x - 1, y - 1),
        getPixel(x + 1, y - 1),
        getPixel(x - 1, y + 1),
        getPixel(x + 1, y + 1)
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
        // Only borders (top, bottom, left, right)
        const isTopBorder = y < borderThickness;
        const isBottomBorder = y >= this.resY - borderThickness;
        const isLeftBorder = x < borderThickness;
        const isRightBorder = x >= this.resX - borderThickness;

        if (!(isTopBorder || isBottomBorder || isLeftBorder || isRightBorder)) {
          continue; // Skip center
        }

        // HOLLOW OPTIMIZATION: Only render edges within border area
        // Skip this check if we want guaranteed full border coverage
        const forceFullBorder = true; // Set to true to fill all border pixels
        if (!forceFullBorder && !isEdge(x, y)) {
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

        // Store voxel with layer info for delayed animation
        let layer = 0;
        let randomDelay = 0;
        if (this.layeredDelay) {
          // Determine layer based on distance from edge
          const distFromEdge = Math.min(
            x, this.resX - 1 - x,
            y, this.resY - 1 - y
          );
          layer = Math.min(distFromEdge, 2); // Max 3 layers (0, 1, 2)
          
          // Add random threshold for organic effect (±0.05 = ±5% variation)
          randomDelay = (Math.random() - 0.5) * 0.1;
        }
        
        // Mark as border voxel
        const isBorderVoxel = true;

        this.voxels.push({
          mesh: mesh,
          baseX: baseX,
          baseY: baseY,
          offsetX: 0,
          offsetY: 0,
          offsetZ: 0,
          velocityX: 0,
          velocityY: 0,
          velocityZ: 0,
          layer: layer,
          randomDelay: randomDelay,
          delayedRotation: 0,
          isBorderVoxel: isBorderVoxel,
          onGround: false
        });

        voxelCount++;
      }
    }

    this.scene.add(this.group);
    console.log(`[Framer-Blocks] Hollow frame complete! ${voxelCount} voxels`);
  }

  buildFullVoxelMesh() {
    // Create low-res voxel mesh of entire image (32x32)
    // Interior voxels will be invisible but used for cursor detection
    const voxelRes = 32;
    const voxelSize = Math.min(this.width, this.height) / voxelRes * 0.95;
    
    // Sample image at lower resolution
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = voxelRes;
    canvas.height = voxelRes;
    ctx.drawImage(this.cachedTexture.image, 0, 0, voxelRes, voxelRes);
    const voxelPixelData = ctx.getImageData(0, 0, voxelRes, voxelRes).data;
    
    this.fullVoxelMesh = [];
    
    for (let y = 0; y < voxelRes; y++) {
      for (let x = 0; x < voxelRes; x++) {
        const idx = (y * voxelRes + x) * 4;
        const a = voxelPixelData[idx + 3];
        
        if (a < 128) continue; // Skip transparent pixels
        
        const r = voxelPixelData[idx];
        const g = voxelPixelData[idx + 1];
        const b = voxelPixelData[idx + 2];
        
        // Determine if this is an edge or interior voxel
        const isEdge = (
          x < 3 || x >= voxelRes - 3 || 
          y < 3 || y >= voxelRes - 3
        );
        
        const color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
        const material = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.3,
          metalness: 0.1,
          emissive: color,
          emissiveIntensity: 0.03 // Reduced by 15% for less glow
        });
        
        const mesh = new THREE.Mesh(this.geometry, material);
        
        const stepX = this.width / voxelRes;
        const stepY = this.height / voxelRes;
        const baseX = x * stepX - this.width / 2 + stepX / 2;
        const baseY = (voxelRes - y - 1) * stepY - this.height / 2 + stepY / 2;
        
        mesh.position.set(baseX, baseY, 0.5); // Slightly in front
        mesh.scale.set(voxelSize, voxelSize, voxelSize);
        
        this.group.add(mesh);
        
        // Determine layer for delay - randomized instead of uniform
        let layer = 0;
        let randomDelay = 0;
        if (this.layeredDelay) {
          // Randomize layer assignment with weighted distribution
          const rand = Math.random();
          if (rand < 0.4) {
            layer = 0; // 40% in layer 0
          } else if (rand < 0.75) {
            layer = 1; // 35% in layer 1
          } else {
            layer = 2; // 25% in layer 2
          }
          
          // Add small random variation within layer
          randomDelay = (Math.random() - 0.5) * 0.05; // ±2.5% variation
        }
        
        this.fullVoxelMesh.push({
          mesh: mesh,
          baseX: baseX,
          baseY: baseY,
          layer: layer,
          randomDelay: randomDelay,
          delayedRotation: 0,
          isEdge: isEdge
        });
      }
    }
    
    console.log(`[Framer-Blocks] Full voxel mesh created! ${this.fullVoxelMesh.length} voxels (${this.fullVoxelMesh.filter(v => v.isEdge).length} visible)`);
  }

  build() {
    if (this.group) this.scene.remove(this.group);
    
    this.group = new THREE.Group();
    this.voxels = [];
    
    const count = this.resX * this.resY;
    const stepX = this.width / this.resX;
    const stepY = this.height / this.resY;
    const offX = this.width / 2;
    const offY = this.height / 2;
    const voxelSize = Math.min(stepX, stepY) * 0.95;

    console.log(`[Framer-Blocks] Creating 3D membrane with ${count} pixels...`);

    const depthLayers = 3;
    const layerSpacing = voxelSize * 1.0;

    let renderedCount = 0;

    for (let i = 0; i < count; i++) {
      const x = i % this.resX;
      const y = Math.floor(i / this.resX);
      
      const idx = i * 4;
      const r = this.pixelData[idx];
      const g = this.pixelData[idx+1];
      const b = this.pixelData[idx+2];
      const a = this.pixelData[idx+3];
      
      if (a < 10) continue;
      
      const isBorder = (x === 0 || x === this.resX - 1 || y === 0 || y === this.resY - 1);
      const layers = isBorder ? depthLayers : 1;
      
      for (let layer = 0; layer < layers; layer++) {
        const color = new THREE.Color(`rgb(${r}, ${g}, ${b})`);
        
        const darkenFactor = 1.0 - (layer * 0.15);
        color.multiplyScalar(darkenFactor);
        
        const material = new THREE.MeshStandardMaterial({
          color: color,
          roughness: 0.3,
          metalness: 0.1,
          emissive: color,
          emissiveIntensity: 0.05,
          transparent: a < 255,
          opacity: a / 255
        });
        
        const mesh = new THREE.Mesh(this.geometry, material);
        
        const baseX = x * stepX - offX + stepX/2;
        const baseY = (this.resY - y - 1) * stepY - offY + stepY/2;
        const baseZ = -layer * layerSpacing;
        
        mesh.position.set(baseX, baseY, baseZ);
        mesh.scale.set(voxelSize, voxelSize, voxelSize);
        
        this.group.add(mesh);
        
        if (layer === 0) {
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
        }

        renderedCount++;
      }
    }
    
    this.scene.add(this.group);
    console.log(`[Framer-Blocks] 3D membrane complete! ${renderedCount} voxels`);
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
      }

      // Gravity physics with layered delays and subtle bounce
      if (this.gravityEnabled && !voxel.onGround) {
        // Apply delay based on layer (much closer delays)
        const layerDelays = [0, 0.05, 0.08]; // Layer 0: instant, Layer 1: 5% delay, Layer 2: 8% delay
        const fallDelay = layerDelays[voxel.layer] || 0;
        const totalDelay = fallDelay + voxel.randomDelay;
        
        if (this.gravityTransition > totalDelay) {
          const effectiveProgress = Math.min(1, (this.gravityTransition - totalDelay) / (1 - totalDelay));
          
          // Smooth gravity ramp-up using ease-in curve
          const gravityStrength = effectiveProgress * effectiveProgress; // Quadratic ease-in
          
          voxel.velocityY -= 0.8 * gravityStrength; // Faster gravity (was 0.5)
          voxel.offsetY += voxel.velocityY;
          
          // Check ground collision - no bounce, just stop
          const voxelBottomY = voxel.baseY + voxel.offsetY;
          if (voxelBottomY <= this.groundY) {
            voxel.offsetY = this.groundY - voxel.baseY;
            voxel.velocityY = 0;
            voxel.onGround = true;
          }
        }
      }
      
      // Original probe physics (when gravity is off)
      if (!this.gravityEnabled) {
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

        // Physics: damping and spring
        voxel.velocityX *= 0.88;
        voxel.velocityY *= 0.88;
        voxel.velocityZ *= 0.88;
        voxel.velocityX -= voxel.offsetX * 0.18;
        voxel.velocityY -= voxel.offsetY * 0.18;
        voxel.velocityZ -= voxel.offsetZ * 0.18;
        voxel.offsetX += voxel.velocityX;
        voxel.offsetY += voxel.velocityY;
        voxel.offsetZ += voxel.velocityZ;
      }

      // Apply delayed rotation if layered delay is enabled
      if (this.layeredDelay && voxel.delayedRotation !== undefined) {
        const rotationDiff = voxel.delayedRotation - this.group.rotation.y;
        const rotatedPos = new THREE.Vector3(
          voxel.baseX + voxel.offsetX,
          voxel.baseY + voxel.offsetY,
          voxel.offsetZ
        );
        
        // Apply additional rotation based on delay
        const angle = rotationDiff;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const newX = rotatedPos.x * cos - rotatedPos.z * sin;
        const newZ = rotatedPos.x * sin + rotatedPos.z * cos;
        
        voxel.mesh.position.set(newX, rotatedPos.y, newZ);
        voxel.mesh.rotation.y = rotationDiff;
      } else {
        voxel.mesh.position.set(
          voxel.baseX + voxel.offsetX,
          voxel.baseY + voxel.offsetY,
          voxel.offsetZ
        );
      }
    }
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    this.camLight.position.copy(this.camera.position);
    
    // Probe auto-rotation (slower)
    this.probeGroup.rotation.y += 0.008;
    this.probeGroup.rotation.x += 0.005;
    this.probeGroup.updateMatrixWorld();
    this.probeInv.copy(this.probeGroup.matrixWorld).invert();
    
    // Smooth gravity transition
    if (this.gravityEnabled && this.gravityTransition < 1) {
      this.gravityTransition = Math.min(1, this.gravityTransition + 0.02);
    } else if (!this.gravityEnabled && this.gravityTransition > 0) {
      this.gravityTransition = Math.max(0, this.gravityTransition - 0.05);
    }
    
    // Handle 360° rotation animation
    if (this.isRotating && this.group) {
      this.rotationProgress += 0.02; // Animation speed
      
      // Zoom out camera during rotation
      this.cameraTargetZ = 300; // Zoom out to show full rotation (less distance)
      
      if (this.rotationProgress >= 1) {
        this.rotationProgress = 0;
        this.isRotating = false;
        this.group.rotation.y = 0; // Reset to original position
        this.group.rotation.x = 0; // Reset tilt
        this.cameraTargetZ = this.cameraBaseZ; // Zoom back in
        
        // Reset delayed rotations
        if (this.layeredDelay) {
          this.voxels.forEach(voxel => {
            voxel.delayedRotation = 0;
          });
        }
        
        // Reset voxelized image
        if (this.voxelizeImage) {
          // Restore image to full opacity
          if (this.group && this.group.children[0]) {
            const planeMesh = this.group.children[0];
            if (planeMesh.material) {
              planeMesh.material.opacity = 1.0;
              planeMesh.material.transparent = false;
            }
          }
          
          // Remove full voxel mesh and dispose materials to prevent memory leaks
          if (this.fullVoxelMesh) {
            this.fullVoxelMesh.forEach(voxel => {
              if (voxel.mesh.material) {
                voxel.mesh.material.dispose(); // Dispose material
              }
              if (voxel.mesh.geometry && voxel.mesh.geometry !== this.geometry) {
                voxel.mesh.geometry.dispose(); // Dispose geometry if unique
              }
              this.group.remove(voxel.mesh);
            });
            this.fullVoxelMesh = null;
            this.isVoxelized = false;
          }
        }
      } else {
        // Bounce easing (cartoonish)
        const t = this.rotationProgress;
        const bounce = t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 2) / 2; // Changed to 2 for smoother bounce
        
        // Full 360° rotation (2 * PI radians)
        const targetRotation = bounce * Math.PI * 2 * this.rotationDirection;
        this.group.rotation.y = targetRotation;
        
        // Layered delay animation for voxels
        if (this.layeredDelay) {
          this.voxels.forEach(voxel => {
            // Progressive delay: each layer delay decreases
            // Layer 0: 6%, Layer 1: 3%, Layer 2: 1.5%
            const layerDelays = [0.06, 0.03, 0.015];
            const layerDelay = layerDelays[voxel.layer] || 0;
            const totalDelay = layerDelay + voxel.randomDelay; // Add random threshold
            const delayedT = Math.max(0, Math.min(1, t - totalDelay));
            
            // Apply same bounce easing to delayed rotation
            const delayedBounce = delayedT < 0.5
              ? 4 * delayedT * delayedT * delayedT
              : 1 - Math.pow(-2 * delayedT + 2, 2) / 2; // Changed to 2 for smoother bounce
            
            voxel.delayedRotation = delayedBounce * Math.PI * 2 * this.rotationDirection;
          });
        }
        
        // Voxelize image animation
        if (this.voxelizeImage) {
          // Smoothly reduce image opacity to 85% during spin
          if (this.group && this.group.children[0]) {
            const planeMesh = this.group.children[0];
            if (planeMesh.material) {
              // Gradual transition: fade to 85% in first 20%, stay, fade back in last 20%
              let imageOpacity = 1.0;
              if (t < 0.2) {
                imageOpacity = 1.0 - (t / 0.2) * 0.15; // 1.0 -> 0.85
              } else if (t < 0.8) {
                imageOpacity = 0.85; // Stay at 85%
              } else {
                imageOpacity = 0.85 + ((t - 0.8) / 0.2) * 0.15; // 0.85 -> 1.0
              }
              planeMesh.material.opacity = imageOpacity;
              planeMesh.material.transparent = imageOpacity < 1.0;
            }
          }
          
          // Calculate fade for voxels
          // Fade in: 0.0 -> 0.3 (t: 0.0 -> 0.3)
          // Stay visible: 0.3 -> 0.7 (t: 0.3 -> 0.7)
          // Fade out: 0.7 -> 1.0 (t: 0.7 -> 1.0)
          let voxelOpacity = 0;
          if (t < 0.3) {
            // Fade in smoothly
            voxelOpacity = (t / 0.3) * 0.5; // 0 -> 0.5
          } else if (t < 0.7) {
            // Stay at 50% opacity
            voxelOpacity = 0.5;
          } else {
            // Fade out smoothly
            voxelOpacity = ((1.0 - t) / 0.3) * 0.5; // 0.5 -> 0
          }
          
          // Create or show full voxel mesh
          if (!this.isVoxelized && t > 0.1) {
            this.buildFullVoxelMesh();
            this.isVoxelized = true;
          }
          
          // Animate full voxel mesh with opacity
          if (this.fullVoxelMesh) {
            this.fullVoxelMesh.forEach(voxel => {
              // Set opacity based on voxel type
              if (voxel.mesh.material) {
                if (voxel.isEdge) {
                  // Edge voxels: animate opacity with glow
                  voxel.mesh.material.opacity = voxelOpacity;
                  voxel.mesh.material.transparent = true;
                  voxel.mesh.material.blending = THREE.AdditiveBlending;
                  voxel.mesh.material.depthWrite = false;
                } else {
                  // Interior voxels: always invisible but present for raycasting
                  voxel.mesh.material.opacity = 0;
                  voxel.mesh.material.transparent = true;
                  voxel.mesh.material.blending = THREE.NormalBlending;
                }
              }
              
              // Apply layered delay rotation to ALL voxels
              const layerDelays = [0.06, 0.03, 0.015];
              const layerDelay = layerDelays[voxel.layer] || 0;
              const totalDelay = layerDelay + voxel.randomDelay;
              const delayedT = Math.max(0, Math.min(1, t - totalDelay));
              
              const delayedBounce = delayedT < 0.5
                ? 4 * delayedT * delayedT * delayedT
                : 1 - Math.pow(-2 * delayedT + 2, 2) / 2; // Changed to 2 for smoother bounce
              
              voxel.delayedRotation = delayedBounce * Math.PI * 2 * this.rotationDirection;
            });
          }
        }
      }
    } else if (this.group) {
      // Apply subtle tilt effect when not rotating - smoother transition
      this.group.rotation.x += (this.tiltX - this.group.rotation.x) * 0.05; // Smoother
      this.group.rotation.y += (this.tiltY - this.group.rotation.y) * 0.05;
      this.cameraTargetZ = this.cameraBaseZ; // Ensure camera is at base position
    }
    
    // Smooth camera zoom transition
    this.camera.position.z += (this.cameraTargetZ - this.camera.position.z) * 0.08;
    
    this.update();
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.animate();
  }

  // Trigger 360° rotation
  rotate360() {
    if (this.isRotating) return; // Prevent multiple rotations at once
    
    this.isRotating = true;
    this.rotationProgress = 0;
    this.rotationDirection *= -1; // Alternate direction each time
  }

  toggleGravity() {
    this.gravityEnabled = !this.gravityEnabled;
    
    if (this.gravityEnabled) {
      // Start gravity transition and reset all voxel states
      this.gravityTransition = 0;
      this.voxels.forEach(voxel => {
        voxel.onGround = false;
        voxel.velocityY = 0;
      });
    } else {
      // Instant reset when disabling gravity
      this.voxels.forEach(voxel => {
        voxel.offsetY = 0;
        voxel.velocityY = 0;
        voxel.onGround = false;
      });
    }
    
    return this.gravityEnabled;
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
    
    console.log('[Framer-Blocks] Renderer destroyed');
  }
}

/**
 * Initialize the framer-blocks effect on a container
 * @param {HTMLElement} container - The container element
 * @param {string} imageUrl - URL of the image to voxelize
 * @param {Object} options - Configuration options
 * @returns {Promise<{renderer: VoxelImageRenderer, cleanup: Function}>} Renderer instance and cleanup function
 */
export async function initFramerBlocks(container, imageUrl, options = {}) {
  const renderer = new VoxelImageRenderer(container, options);
  
  try {
    await renderer.load(imageUrl);
    renderer.start();
    
    // Return renderer instance and cleanup function
    return {
      renderer: renderer,
      cleanup: () => renderer.destroy()
    };
  } catch (error) {
    console.error('[Framer-Blocks] Initialization failed:', error);
    renderer.destroy();
    throw error;
  }
}

export default initFramerBlocks;
