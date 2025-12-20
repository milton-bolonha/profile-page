import { useEffect, useRef } from "react";

// Dynamic import para evitar problemas de SSR
let Lenis: any = null;

export const useLenis = () => {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    const initLenis = async () => {
      if (typeof window === "undefined") return;

      // Import dinâmico
      const { default: LenisLib } = await import("lenis");
      Lenis = LenisLib;

      // Inicializar Lenis
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      // Função de animação
      const raf = (time: number) => {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);

      // Cleanup
      return () => {
        lenisRef.current?.destroy();
      };
    };

    initLenis();
  }, []);

  const scrollToSection = (
    target: string | HTMLElement,
    offset: number = 0
  ) => {
    if (!lenisRef.current) return;

    lenisRef.current.scrollTo(target, {
      offset,
      duration: 1.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    });
  };

  return { lenis: lenisRef.current, scrollToSection };
};

// Hook para detectar seção ativa durante scroll
export const useActiveSection = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds]);

  return activeSection;
};

// Hook para rolagem suave entre seções
export const useSectionNavigation = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Ajuste para header fixo
      const targetPosition = element.offsetTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  return { scrollToSection };
};
