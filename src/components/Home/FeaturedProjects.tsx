import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import MagneticButton from "@/components/ui/MagneticButton";
import { TextMotion } from "@/components/ui/TextMotion";
import { useEffect, useRef } from "react";
import featuredProjectsData from "../../../content/home/featuredProjects.json";

export const FeaturedProjects = () => {
  const { t } = useLanguage();
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Importar vanilla-tilt dinamicamente
    import("vanilla-tilt").then((VanillaTilt) => {
      tiltRefs.current.forEach((ref) => {
        if (ref) {
          VanillaTilt.default.init(ref, {
            max: 5, // Tilt muito sutil
            speed: 400,
            glare: true,
            "max-glare": 0.1, // Glare bem discreto
            scale: 1.02, // Scale mínimo
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
  }, []);

  return (
    <section id="projects" className="relative bg-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span className="text-sm font-medium text-white/80 tracking-wide">
              Portfólio
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl font-semibold text-white mb-6"
            style={{
              fontFamily: "Noto Serif Variable, serif",
              lineHeight: "1.3",
            }}
          >
            {featuredProjectsData.titleEmoji}{" "}
            <TextMotion trigger={true} stagger={0.05}>
              {t("home.projects.title")}
            </TextMotion>
          </h2>
          <p className="text-xl text-white/60">{t("home.projects.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredProjectsData.projects.map((project, index) => (
            <Link
              key={project.id}
              href={project.link}
              onClick={() =>
                trackEvent(
                  "click",
                  "Project Card",
                  `Project ${project.id} - Home`
                )
              }
              className="group relative block"
            >
              {/* Card with Tilt Effect */}
              <div
                ref={(el) => {
                  if (el) {
                    tiltRefs.current[index] = el;
                  }
                }}
                className="aspect-[4/3] rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 flex items-center justify-center relative overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number */}
                <span className="text-8xl font-light text-white/10 group-hover:text-white/20 transition-colors duration-500 relative z-10">
                  {project.id.toString().padStart(2, "0")}
                </span>

                {/* Featured Badge */}
                {project.featured && (
                  <span className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20 z-20">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="mt-6 space-y-3">
                <h3 className="text-2xl text-white group-hover:text-white/80 transition-colors">
                  {t(project.titleKey)} {project.id}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {t(project.descriptionKey)}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.techs.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="text-xs text-white/50">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <MagneticButton>
            <Link
              href="/projetos"
              onClick={() =>
                trackEvent("click", "CTA", "View All Projects - Home")
              }
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 font-medium py-4 px-8 rounded-full transition-all duration-300"
            >
              {t("home.projects.viewAll")}
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
    </section>
  );
};
