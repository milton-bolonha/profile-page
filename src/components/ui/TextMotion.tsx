"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TextMotionProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  trigger?: boolean;
}

export const TextMotion: React.FC<TextMotionProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.8,
  stagger = 0.1,
  trigger = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!trigger) return;

    // Use Intersection Observer para animar apenas quando entra na viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay * 1000);
            observer.disconnect(); // Anima apenas uma vez
          }
        });
      },
      {
        threshold: 0.1, // Trigger quando 10% está visível
        rootMargin: "-50px", // Trigger um pouco antes
      }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, [trigger, delay]);

  const words = children.split(" ");

  return (
    <span
      ref={textRef}
      className={cn("inline-block overflow-hidden", className)}
    >
      {words.map((word, index) => (
        <span
          key={index}
          className={cn(
            "inline-block transition-all duration-700 ease-out",
            isVisible
              ? "transform translate-y-0 opacity-100"
              : "transform translate-y-full opacity-0"
          )}
          style={{
            transitionDelay: `${delay + index * stagger}s`,
          }}
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
};

export default TextMotion;
