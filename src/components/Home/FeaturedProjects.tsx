import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import MagneticButton from "@/components/ui/MagneticButton";
import { TextMotion } from "@/components/ui/TextMotion";
import { useEffect, useRef } from "react";
import { FaRobot, FaGlobe, FaBook, FaGamepad, FaChalkboardTeacher, FaRocket } from "react-icons/fa";
import { getCategoryGradient } from "@/lib/colors";

interface Category {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface FeaturedProjectsProps {
  categories: Category[];
}

// Icon mapping
const ICON_MAP: Record<string, any> = {
  FaRobot,
  FaGlobe,
  FaGamepad,
  FaBook,
  FaChalkboardTeacher,
  FaRocket,
};

export const FeaturedProjects = ({ categories }: FeaturedProjectsProps) => {
  const { t } = useLanguage();
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    import("vanilla-tilt").then((VanillaTilt) => {
      tiltRefs.current.forEach((ref) => {
        if (ref) {
          VanillaTilt.default.init(ref, {
            max: 5,
            speed: 400,
            glare: true,
            "max-glare": 0.1,
            scale: 1.02,
          });
        }
      });
    });

    return () => {
      tiltRefs.current.forEach((ref) => {
        if (ref && (ref as any).vanillaTilt) {
          (ref as any).vanillaTilt.destroy();
        }
      });
    };
  }, [categories]);

  return (
    <div className="relative w-full h-full min-h-screen">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          {/* Badge: Catálogo */}
          <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span className="text-sm font-medium text-white/80 tracking-wide">
              Catálogo de Soluções
            </span>
          </div>

          {/* Title */}
          <h2
            className="text-4xl md:text-5xl font-semibold text-white mb-6"
            style={{
              fontFamily: "Noto Serif Variable, serif",
              lineHeight: "1.3",
            }}
          >
            <TextMotion trigger={true} stagger={0.05}>
              O Que Você Procura?
            </TextMotion>
          </h2>

          {/* Description */}
          <p className="text-xl text-white/60 max-w-3xl mx-auto mb-10">
            De boilerplates de IA a mentorias de carreira, encontre a ferramenta certa para o seu próximo nível.
          </p>
        </div>

        {/* CATEGORY CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 px-4">
          {categories.map((category, index) => {
            const Icon = ICON_MAP[category.icon] || FaGlobe;
            const gradient = getCategoryGradient(category.id);

            return (
              <Link
                key={category.id}
                href={`/catalogo?category=${category.id}`}
                onClick={() =>
                  trackEvent(
                    "click",
                    "Category Card",
                    `Category ${category.id} - Home`
                  )
                }
                className="group relative block h-full flex flex-col"
              >
                <div
                  ref={(el) => {
                    if (el) {
                      tiltRefs.current[index] = el;
                    }
                  }}
                  className="aspect-[4/3] rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Dynamic Background Gradient based on Category */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <span className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-bold border border-white/20">
                      Ver Categoria
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="text-6xl text-white/20 group-hover:text-white/40 transition-colors duration-500 transform group-hover:scale-110 z-10">
                    <Icon />
                  </div>

                  {/* Category Label Badge */}
                  <span className="absolute top-4 left-4 bg-white/10 text-white/80 text-xs font-bold px-3 py-1 rounded-full border border-white/10 z-20 backdrop-blur-sm">
                    {category.label}
                  </span>
                </div>

                {/* Category Info */}
                <div className="mt-6 space-y-3 flex-1">
                  <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-1">
                    {category.label}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <MagneticButton>
            <Link
              href="/catalogo"
              onClick={() =>
                trackEvent("click", "CTA", "View All Items - Home")
              }
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 font-medium py-4 px-8 rounded-full transition-all duration-300"
            >
              Ver Catálogo Completo
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </MagneticButton>
        </div>
      </div>
    </div>
  );
};
