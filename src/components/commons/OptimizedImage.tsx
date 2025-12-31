import React from 'react';
import Image, { ImageProps } from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  fallback?: string;
  cubeFrame?: boolean;
  enableFlip?: boolean;
  shouldLoad?: boolean;
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
  shouldLoad, // Destructured here to remove from ...props
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
  // Lazy load state
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Simple Intersection Observer to detect visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Once visible, keep loaded
        }
      },
      { threshold: 0.1 } // Load when 10% visible
    );
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Initialize framer-blocks when cubeFrame is enabled AND explicitly triggered (or default true implies load-on-view)
  // We add 'shouldLoad' to props to allow external delays (like for H1 animation)
  const shouldLoadVal = shouldLoad !== undefined ? shouldLoad : true;

  // Estado para controlar o indicador de "Carregando 3D"
  const [is3DReady, setIs3DReady] = useState(false);

  useEffect(() => {
    // Se não for frame 3D, já está pronto
    if (!cubeFrame) {
      setIs3DReady(true);
      return;
    }
    
    if (!containerRef.current || loading || error || !isInView || !shouldLoadVal) return;
    
    let cleanup: (() => void) | undefined;

    const initVoxels = async () => {
      try {
        const { initFramerBlocks } = await import('@/lib/framer-blocks');
        const result = await initFramerBlocks(containerRef.current!, imgSrc, {
          resolution: 128,
          size: 180,
          layeredDelay: true,
          voxelizeImage: false 
        }) as any;
        
        rendererRef.current = result.renderer;
        cleanup = result.cleanup as () => void;
        
        // Simular um tempo mínimo para garantir que o canvas foi injetado e está visível
        setTimeout(() => setIs3DReady(true), 500);
        
      } catch (err) {
        console.error('[OptimizedImage] Failed to initialize framer-blocks:', err);
        // Em caso de erro, mostramos a imagem fallback
        setIs3DReady(true);
      }
    };

    const timer = setTimeout(() => {
        initVoxels();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cleanup) cleanup();
      rendererRef.current = null;
      setIs3DReady(false); // Resetar ao desmontar
    };
  }, [cubeFrame, imgSrc, loading, error, isInView, shouldLoadVal]);

  // Funções de controle do 3D
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

  // Renderização Composta
  return (
    <div 
      className={`relative w-full h-full ${loading ? 'animate-pulse bg-gray-200 dark:bg-gray-700' : ''}`}
      style={{ width: '100%', height: '100%' }}
    >
      {/* 1. Imagem Base de Fallback - Reduzida para 75% para casar com o 3D */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
         <div className={`relative ${cubeFrame ? 'w-[75%] h-[75%]' : 'w-full h-full'}`}>
            <Image
              src={error ? fallback : imgSrc}
              alt={alt}
              fill
              className={`${className} object-contain`}
              loading={priority ? undefined : 'lazy'}
              priority={priority}
              {...props}
            />
            {/* Overlay Estático "Sinta-se Bem-Vind@!" - Transição Suave */}
            {(() => {
                const shouldShowLoader = cubeFrame && !is3DReady && isInView && shouldLoadVal && !loading;
                // Visible if NOT loading, NOT ready, and Loader is NOT showing
                const isWelcomeVisible = cubeFrame && !loading && !shouldShowLoader && !is3DReady;
                
                return cubeFrame && !loading && (
                   <div className={`absolute inset-0 flex justify-center items-center z-10 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isWelcomeVisible ? 'opacity-100 scale-110' : 'opacity-0 scale-0'}`}>
                      <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 flex items-center justify-center shadow-2xl">
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Sinta-se Bem-Vind@!</span>
                      </div>
                   </div>
                );
            })()}
         </div>
      </div>

      {/* Indicador de Carregamento 3D */}
      {(() => {
          const shouldShowLoader = cubeFrame && !is3DReady && isInView && shouldLoadVal && !loading;
          return shouldShowLoader && (
             <div className="absolute inset-0 flex justify-center items-center z-20 pointer-events-none animate-in fade-in zoom-in duration-300">
                <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 flex items-center gap-3 shadow-2xl transform scale-110">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Carregando Experiência 3D...</span>
                </div>
             </div>
          );
      })()}

      {/* 2. Camada 3D */}
      {cubeFrame && (
        <>
          <div 
            ref={containerRef}
            className={`absolute inset-0 w-full h-full z-10 ${className} transition-opacity duration-1000 ${is3DReady ? 'opacity-100' : 'opacity-0'}`}
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* Control Buttons - Only show if enableFlip is true */}
          {enableFlip && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-3">
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
        </>
      )}
    </div>
  );
};
