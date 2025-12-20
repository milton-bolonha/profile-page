"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useLenis } from "@/lib/scroll";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  bgImage?: string;
  vPadding?: string;
  fullHeight?: boolean;
}

export const SectionWrapper = ({
  children,
  className = "",
  id,
  bgImage,
  vPadding = "py-20",
  fullHeight = false,
}: SectionWrapperProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { lenis } = useLenis();

  useEffect(() => {
    if (!lenis || !sectionRef.current) return;

    // Configurar snap points para seções
    const element = sectionRef.current;
    const rect = element.getBoundingClientRect();

    // Adicionar classe para snap
    element.style.scrollSnapAlign = "start";

    return () => {
      element.style.scrollSnapAlign = "";
    };
  }, [lenis]);

  const sectionClasses = `
    w-full
    ${vPadding}
    min-h-screen flex flex-col justify-center
    ${bgImage ? `bg-cover bg-center bg-no-repeat` : ""}
    ${className}
  `.trim();

  const style = bgImage ? { backgroundImage: `url(${bgImage})` } : {};

  return (
    <section ref={sectionRef} id={id} className={sectionClasses} style={style}>
      {children}
    </section>
  );
};

// Componente para container principal com scroll snap
export const ScrollContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="scroll-smooth">
      <style jsx global>{`
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
      {children}
    </div>
  );
};
