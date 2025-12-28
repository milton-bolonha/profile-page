import React from 'react';
import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  fallback?: string;
  cubeFrame?: boolean;
  enableFlip?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  fallback = '/img/placeholder.svg',
  className = '',
  width,
  height,
  priority = false,
  cubeFrame = false,
  enableFlip = true,
  ...props
}: OptimizedImageProps) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(fallback);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src as string;
    img.onload = () => {
      setImgSrc(src as string);
      setLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
  }, [src]);

  // Initialize framer-blocks when cubeFrame is enabled
  useEffect(() => {
    if (!cubeFrame || !containerRef.current || loading || error) return;

    let cleanup: (() => void) | undefined;

    const initVoxels = async () => {
      try {
        const { initFramerBlocks } = await import('@/lib/framer-blocks');
        const result = await initFramerBlocks(containerRef.current!, imgSrc, {
          resolution: 128,
          size: 180,
          layeredDelay: true,
          voxelizeImage: false // Disabled for now
        }) as any;
        
        // Store renderer reference for rotation control
        rendererRef.current = result.renderer;
        cleanup = result.cleanup as () => void;
      } catch (err) {
        console.error('[OptimizedImage] Failed to initialize framer-blocks:', err);
      }
    };

    initVoxels();

    return () => {
      if (cleanup) cleanup();
      rendererRef.current = null;
    };
  }, [cubeFrame, imgSrc, loading, error]);

  const [isGravityOn, setIsGravityOn] = useState(false);

  const handleRotate = () => {
    if (rendererRef.current?.rotate360) {
      rendererRef.current.rotate360();
    }
  };

  const handleGravityToggle = () => {
    if (rendererRef.current?.toggleGravity) {
      const isEnabled = rendererRef.current.toggleGravity();
      setIsGravityOn(isEnabled);
    }
  };

  // Render voxel container when cubeFrame is enabled
  if (cubeFrame) {
    return (
      <div className="relative w-full h-full">
        <div 
          ref={containerRef}
          className={`relative w-full h-full ${className}`}
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Control Buttons - Only show if enableFlip is true */}
        {enableFlip && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-3">
            {/* Gravity Toggle Button */}
            <button
              onClick={handleGravityToggle}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-300 group cursor-pointer"
              aria-label="Toggle Gravity"
              title="Ligar/Desligar Gravidade"
            >
              <svg 
                className={`w-6 h-6 text-white transition-transform duration-500 ${isGravityOn ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </button>

            {/* Rotation Button */}
            <button
              onClick={handleRotate}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full p-3 transition-all duration-300 group cursor-pointer"
              aria-label="Rotate 360°"
              title="Girar 360°"
            >
              <svg 
                className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default image rendering
  return (
    <div 
      className={`relative w-full h-full ${loading ? 'animate-pulse bg-gray-200 dark:bg-gray-700' : ''}`}
      style={{ width: '100%', height: '100%' }}
    >
      <Image
        src={error ? fallback : imgSrc}
        alt={alt}
        fill
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        loading={priority ? undefined : 'lazy'}
        priority={priority}
        {...props}
      />
    </div>
  );
};
