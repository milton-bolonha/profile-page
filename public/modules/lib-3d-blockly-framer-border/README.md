# 🎨 3D Blockly Framer Border

A lightweight Three.js library that creates stunning interactive 3D voxel frame effects for images. Transform any image into an interactive mesh with hollow border optimization, mouse interaction, and smooth animations.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- **Hollow Border Optimization** - Renders only edge voxels for maximum performance
- **Mouse Interaction** - Invisible probe follows cursor and interacts with voxels in real-time
- **Smooth Animations** - 360° rotation with cartoonish bounce easing
- **Raycasting** - Precise mouse-to-mesh alignment using Three.js raycaster
- **Physics Simulation** - Spring-damping system for realistic voxel movement
- **Responsive** - Automatically adapts to container size
- **Lightweight** - Minimal dependencies (only Three.js required)

## 📦 Installation

```bash
npm install 3d-blockly-framer-border
```

Or using yarn:

```bash
yarn add 3d-blockly-framer-border
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { init3DBlocklyFramer } from '3d-blockly-framer-border';

const container = document.getElementById('my-container');

const { renderer, cleanup } = await init3DBlocklyFramer(
  container,
  '/path/to/image.jpg',
  {
    resolution: 128,
    size: 180
  }
);

// Trigger 360° rotation
renderer.rotate360();

// Clean up when done
cleanup();
```

### HTML Example

```html
<!DOCTYPE html>
<html>
<head>
    <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
            }
        }
    </script>
</head>
<body>
    <div id="voxel-container" style="width: 400px; height: 533px;"></div>
    
    <script type="module">
        import { init3DBlocklyFramer } from './3d-blockly-framer.js';
        
        const { renderer } = await init3DBlocklyFramer(
            document.getElementById('voxel-container'),
            './image.jpg'
        );
    </script>
</body>
</html>
```

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `resolution` | number | 128 | Voxel grid resolution (higher = more detail, lower performance) |
| `size` | number | 180 | Base size of the mesh in Three.js units |

## 🎮 API Reference

### `init3DBlocklyFramer(container, imageUrl, options)`

Initializes the 3D voxel renderer.

**Parameters:**
- `container` (HTMLElement) - DOM element to render into
- `imageUrl` (string) - URL or path to the image
- `options` (object) - Configuration options

**Returns:**
```javascript
{
  renderer: VoxelImageRenderer,  // Renderer instance
  cleanup: () => void            // Cleanup function
}
```

### `renderer.rotate360()`

Triggers a 360° horizontal rotation animation with bounce easing.

### `cleanup()`

Destroys the renderer and cleans up all Three.js resources.

## 🎨 How It Works

1. **Image Loading** - Loads image via Three.js TextureLoader
2. **Pixel Extraction** - Samples image at specified resolution
3. **Edge Detection** - Identifies edges using color difference threshold
4. **Voxel Generation** - Creates 3D cubes only at detected edges (hollow optimization)
5. **Physics Simulation** - Applies spring-damping physics to voxels
6. **Mouse Interaction** - Raycasts mouse position to mesh plane for precise interaction

## 🔧 Advanced Usage

### Custom Container Styling

```css
#voxel-container {
    width: 100%;
    aspect-ratio: 3/4;
    border-radius: 20px;
    overflow: hidden;
}
```

### React Integration

```jsx
import { useEffect, useRef } from 'react';
import { init3DBlocklyFramer } from '3d-blockly-framer-border';

function VoxelImage({ src }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    let cleanup;

    const init = async () => {
      const result = await init3DBlocklyFramer(
        containerRef.current,
        src,
        { resolution: 128, size: 180 }
      );
      
      rendererRef.current = result.renderer;
      cleanup = result.cleanup;
    };

    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, [src]);

  const handleRotate = () => {
    if (rendererRef.current) {
      rendererRef.current.rotate360();
    }
  };

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', aspectRatio: '3/4' }} />
      <button onClick={handleRotate}>Rotate 360°</button>
    </div>
  );
}
```

## 📝 License

MIT © Milton Bolonha

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

**Milton Bolonha**
- Website: [miltonbolonha.com](https://miltonbolonha.com)
- GitHub: [@miltonbolonha](https://github.com/miltonbolonha)

## ⭐ Show your support

Give a ⭐️ if this project helped you!
