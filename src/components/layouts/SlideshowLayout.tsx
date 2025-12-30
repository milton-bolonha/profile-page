"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SlideshowLayoutProps {
  children: React.ReactNode;
  mode: "vertical" | "horizontal";
  currentSlide: number;
  onSlideChange: (index: number) => void;
}

export function SlideshowLayout({
  children,
  mode,
  currentSlide,
  onSlideChange,
}: SlideshowLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const childrenArray = React.Children.toArray(children);
  const totalSlides = childrenArray.length;

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        onSlideChange(index);
      }
    },
    [onSlideChange, totalSlides]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Se estamos em modo vertical, não fazer nada (scroll nativo total)
      if (mode === "vertical") return;

      // Se já estamos processando uma transição, prevenir apenas se for horizontal
      if (isScrolling) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
           if (e.cancelable) e.preventDefault();
        }
        return;
      }

      // Lógica Simplificada:
      // 1. Scroll Vertical (deltaY) -> NUNCA interferimos. Deixa o navegador rolar o conteúdo.
      // 2. Scroll Horizontal (deltaX) -> Navegação de Slides (apenas se for intencional)

      // Se o movimento for predominantemente vertical, saímos e deixamos o navegador trabalhar
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        return; 
      }

      // Se o movimento for horizontal (trackpad swipe ou shift+wheel)
      const threshold = 50;
      if (Math.abs(e.deltaX) > threshold) {
        // Bloqueia o scroll horizontal nativo do navegador (voltar página, etc)
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();

        setIsScrolling(true);
        setTimeout(() => setIsScrolling(false), 800); // Cooldown

        if (e.deltaX > 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
    },
    [mode, currentSlide, goToSlide, isScrolling]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (mode === "vertical") return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        goToSlide(currentSlide + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        goToSlide(currentSlide - 1);
      }
    },
    [mode, currentSlide, goToSlide]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false }); // passive FALSE para permitir preventDefault
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  // If vertical, just render children in a normal flow
  if (mode === "vertical") {
    return <main className="flex flex-col min-h-screen">{children}</main>;
  }

  // If horizontal, render as a flexible row with transform
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <motion.div
        className="flex flex-row h-full w-full"
        animate={{ x: `-${currentSlide * 100}vw` }}
        transition={{ type: "tween", ease: [0.645, 0.045, 0.355, 1.000], duration: 0.8 }}
        style={{ width: `${totalSlides * 100}vw` }}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className="w-screen h-screen flex-shrink-0 overflow-y-auto overflow-x-hidden relative"
            style={{ 
               // Force each section to be full screen
               minWidth: '100vw',
               maxWidth: '100vw',
               paddingBottom: index > 0 ? '200px' : '0' // Espaço extra no bottom para não cobrir conteúdo
            }}
          >
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
