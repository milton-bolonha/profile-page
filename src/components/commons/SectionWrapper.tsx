"use client";

import { ReactNode, useEffect, useRef } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  bgImage?: string;
  vPadding?: string;
  fullHeight?: boolean;
  isActive?: boolean;
}

export const SectionWrapper = ({
  children,
  className = "",
  id,
  bgImage,
  vPadding = "py-4",
  fullHeight = false,
  isActive = true,
}: SectionWrapperProps) => {
  const sectionRef = useRef<HTMLElement>(null);


  const sectionClasses = `
    w-full
    ${vPadding}
    ${bgImage ? `bg-cover bg-center bg-no-repeat` : ""}
    ${className}
    transition-opacity duration-500 ease-in-out
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
    <div className="">
      <style jsx global>{`
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.36);
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
