# Framer Blocks - 3D Voxel Image Renderer

**File Location:** `src/lib/framer-blocks.js`

A powerful Three.js-based library that transforms images into interactive 3D voxelized borders with physics, animations, and gravity effects.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Constructor & Options](#constructor--options)
- [Class Properties](#class-properties)
- [Public Methods](#public-methods)
- [Animation System](#animation-system)
- [Physics System](#physics-system)
- [Usage Examples](#usage-examples)
- [Technical Details](#technical-details)

---

## Overview

Framer Blocks creates stunning 3D voxelized borders around images with interactive physics, mouse hover effects, 360° rotation animations, and gravity simulation. The library uses a "frame mode" where the center displays a high-quality flat image surrounded by 3D voxel borders that respond to user interaction.

---

## Features

### 🎨 Visual Effects
- **Voxelized Borders**: 3D block-based frame around images
- **Layered Delay Animation**: Progressive delays across voxel layers for organic motion
- **360° Rotation**: Smooth flip animation with customizable direction
- **Gravity Physics**: Realistic falling animation with randomized layer delays

### 🖱️ Interactions
- **Mouse Hover**: Interactive probe that pushes voxels away
- **Cursor Detection**: Smart pointer detection over border vs. image area
- **Click to Rotate**: Trigger 360° rotation animation

### ⚡ Performance
- **Hollow Optimization**: Only renders edge voxels in border area
- **Efficient Rendering**: Flat image plane for center, voxels only for borders
- **Adaptive Resolution**: Automatic resolution calculation based on image aspect ratio

---

## Constructor & Options

### Initialization

```javascript
const renderer = new VoxelImageRenderer(container, imageSrc, options);
```

### Options Object

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `resolution` | Number/String | `64` | Voxel grid resolution. Use `'original'` for max quality (256px) |
| `size` | Number | `180` | Base size in pixels for the rendered scene |
| `frameMode` | Boolean | `true` | Enable frame mode (flat center + voxel borders) |
| `layeredDelay` | Boolean | `false` | Enable progressive delay animation across layers |
| `voxelizeImage` | Boolean | `false` | Replace center image with voxels during flip (experimental) |

---

## Class Properties

### Core Properties

```javascript
// Scene Setup
this.container          // DOM element container
this.scene             // THREE.Scene instance
this.camera            // THREE.PerspectiveCamera
this.renderer          // THREE.WebGLRenderer
this.group             // THREE.Group containing all voxels

// Dimensions (3:4 aspect ratio)
this.baseSize = 180    // Base size
this.width = 135       // Calculated width (3:4 ratio)
this.height = 180      // Calculated height
this.borderThickness = 3  // Border thickness in voxels

// Image Data
this.imageSrc          // Source image URL
this.cachedTexture     // THREE.Texture
this.pixelData         // Uint8ClampedArray of image pixels
this.resX, this.resY   // Resolution in X and Y

// Voxel Array
this.voxels = []       // Array of voxel objects
```

### Voxel Object Structure

Each voxel in `this.voxels` array contains:

```javascript
{
  mesh: THREE.Mesh,           // The 3D mesh
  baseX: Number,              // Original X position
  baseY: Number,              // Original Y position
  offsetX: Number,            // Current X offset
  offsetY: Number,            // Current Y offset
  offsetZ: Number,            // Current Z offset
  velocityX: Number,          // X velocity for physics
  velocityY: Number,          // Y velocity for physics
  velocityZ: Number,          // Z velocity for physics
  layer: Number,              // Layer index (0-2) for delays
  randomDelay: Number,        // Random delay variation (±2.5%)
  delayedRotation: Number,    // Current rotation for layered animation
  isBorderVoxel: Boolean,     // Whether this is a border voxel
  onGround: Boolean           // Whether voxel has landed (gravity)
}
```

### Animation Properties

```javascript
// Rotation Animation
this.isRotating = false        // Whether 360° rotation is active
this.rotationProgress = 0      // Progress from 0 to 1
this.rotationDirection = 1     // 1 or -1 for alternating direction

// Gravity System
this.gravityEnabled = false    // Whether gravity is active
this.gravityTransition = 0     // Smooth transition value (0-1)
this.groundY = -95            // Ground position (below image)

// Probe (Mouse Interaction)
this.probeGroup               // THREE.Group for invisible probe
this.probeSize = 25          // Size of interaction area
this.mouse = {x: 0, y: 0}    // Normalized mouse coordinates
```

---

## Public Methods

### Core Methods

#### `load()`
Loads the texture and initializes the renderer.

```javascript
await renderer.load();
```

**Returns:** Promise that resolves when texture is loaded

---

#### `rotate360()`
Triggers a 360° rotation animation.

```javascript
renderer.rotate360();
```

**Features:**
- Alternates direction on each call
- Prevents multiple simultaneous rotations
- Includes layered delay if enabled
- Smooth cubic easing curve

---

#### `toggleGravity()`
Toggles gravity physics on/off.

```javascript
const isEnabled = renderer.toggleGravity();
```

**Returns:** Boolean indicating new gravity state

**Behavior:**
- **ON**: Voxels fall with randomized layer delays
- **OFF**: Instant reset to original positions
- Gravity strength: 0.8 (faster fall)
- Layer delays: 0%, 5%, 8%

---

#### `destroy()`
Cleans up all resources and removes event listeners.

```javascript
renderer.destroy();
```

**Cleanup includes:**
- Cancels animation loop
- Removes event listeners
- Disposes geometries and materials
- Removes DOM elements

---

### Internal Methods

#### `buildFrame()`
Constructs the frame mode scene (flat center + voxel borders).

**Process:**
1. Creates flat image plane (92% of dimensions for uniform gap)
2. Detects edges using color difference threshold
3. Generates voxels only in border area (3 pixels thick)
4. Applies randomized layer assignment (40% layer 0, 35% layer 1, 25% layer 2)

---

#### `update()`
Physics update loop called every frame.

**Updates:**
- Gravity physics (when enabled)
- Probe interaction (mouse hover)
- Spring forces and damping
- Voxel positions and rotations

---

## Animation System

### 360° Rotation

**Easing:** Cubic ease-in-out for smooth motion

```javascript
const bounce = t < 0.5 
  ? 4 * t * t * t 
  : 1 - Math.pow(-2 * t + 2, 3) / 2;
```

**Speed:** 2% progress per frame (~2.5 seconds total)

### Layered Delay

When `layeredDelay: true`, voxels animate with progressive delays:

- **Layer 0** (40% of voxels): No delay
- **Layer 1** (35% of voxels): 5% delay
- **Layer 2** (25% of voxels): 8% delay
- **Random variation**: ±2.5% per voxel

**Layer Assignment:** Randomized distribution instead of distance-based for organic effect

---

## Physics System

### Probe Interaction (Mouse Hover)

**Behavior:**
- Invisible cube follows mouse position
- Pushes voxels away on collision
- Uses AABB collision detection
- Spring-based return to original position

**Constants:**
```javascript
probeSize = 25        // Interaction radius
pushForce = 0.45      // Push strength
damping = 0.88        // Velocity damping
springForce = 0.18    // Return spring strength
```

### Gravity Physics

**Activation:** Click gravity button (arrow down icon)

**Behavior:**
1. Smooth ramp-up using quadratic ease-in curve
2. Acceleration: 0.8 (faster than real gravity for effect)
3. Layer-based delays for cascading fall
4. No bounce - voxels stop on ground contact
5. Instant reset when disabled

**Ground Position:** 5 pixels below image bottom

---

## Usage Examples

### Basic Setup

```javascript
import { initFramerBlocks } from '@/lib/framer-blocks';

const container = document.getElementById('voxel-container');
const renderer = await initFramerBlocks(
  container,
  '/images/profile.jpg',
  {
    resolution: 128,
    size: 180,
    layeredDelay: true
  }
);
```

### React Integration

```tsx
import { useEffect, useRef } from 'react';
import { initFramerBlocks } from '@/lib/framer-blocks';

function VoxelImage({ src }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      if (containerRef.current) {
        rendererRef.current = await initFramerBlocks(
          containerRef.current,
          src,
          {
            resolution: 128,
            size: 180,
            layeredDelay: true
          }
        );
      }
    };
    
    init();
    
    return () => {
      rendererRef.current?.destroy();
    };
  }, [src]);

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <button onClick={() => rendererRef.current?.rotate360()}>
        Rotate 360°
      </button>
      <button onClick={() => rendererRef.current?.toggleGravity()}>
        Toggle Gravity
      </button>
    </div>
  );
}
```

---

## Technical Details

### Edge Detection Algorithm

**Method:** Color difference threshold with diagonal neighbor checking

```javascript
threshold = 30  // Color difference sensitivity
neighbors = 8   // Check all 8 directions (including diagonals)
```

**Process:**
1. Compare pixel with all 8 neighbors
2. Calculate RGB difference: `|r1-r2| + |g1-g2| + |b1-g2|`
3. Mark as edge if difference > threshold OR neighbor is transparent

### Border Optimization

**Force Full Border:** `forceFullBorder = true`
- Fills entire border area (3 pixels thick)
- Ensures no gaps in voxel coverage
- Overrides hollow optimization

### Resolution Calculation

**Automatic aspect ratio preservation:**

```javascript
if (aspect > 1) {
  resX = targetRes;
  resY = Math.round(targetRes / aspect);
} else {
  resY = targetRes;
  resX = Math.round(targetRes * aspect);
}
```

### Camera Setup

```javascript
camera = new THREE.PerspectiveCamera(
  50,                    // FOV
  aspect,                // Aspect ratio
  0.1,                   // Near plane
  1000                   // Far plane
);
camera.position.z = 200; // Distance from scene
```

### Lighting

- **Ambient Light:** 0.6 intensity (soft overall illumination)
- **Camera Light:** 0.4 intensity (follows camera for consistent highlights)

---

## Performance Considerations

### Optimization Strategies

1. **Hollow Border:** Only renders edge voxels, not interior
2. **Shared Geometry:** Single BoxGeometry reused for all voxels
3. **Flat Center:** High-quality image plane instead of voxels
4. **Efficient Updates:** Only updates active physics (gravity OR probe)
5. **Material Disposal:** Proper cleanup prevents memory leaks

### Typical Performance

- **Voxel Count:** ~200-400 voxels (depending on image)
- **Frame Rate:** 60 FPS on modern hardware
- **Memory:** ~5-10 MB per instance

---

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Requirements:**
- WebGL support
- ES6+ JavaScript
- Three.js r150+

---

## Credits

**Created by:** Milton Bolonha  
**Built with:** Three.js  
**Inspired by:** Voxel art and interactive 3D experiences

---

## License

Part of the profile-page project.

---

**🎉 Enjoy creating stunning 3D voxel experiences!**
