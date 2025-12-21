import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";
import { TextMotion } from "@/components/ui/TextMotion";
import { useEffect, useRef } from "react";
import servicesData from "../../../content/home/services.json";

export const ServicesSection = () => {
  const { t } = useLanguage();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Adicionar efeito de borda animada no hover
    cardRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.addEventListener("mouseenter", () => {
          ref.style.boxShadow = "0 0 30px rgba(255, 255, 255, 0.1)";
        });
        ref.addEventListener("mouseleave", () => {
          ref.style.boxShadow = "none";
        });
      }
    });
  }, []);

  return (
    <section id="services" className="relative bg-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span className="text-sm font-medium text-white/80 tracking-wide">
              Serviços
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl font-semibold text-white mb-6"
            style={{
              fontFamily: "Noto Serif Variable, serif",
              lineHeight: "1.3",
            }}
          >
            <TextMotion trigger={true} stagger={0.05}>
              {t("home.services.title")}
            </TextMotion>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            {t("home.services.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicesData.services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => {
                if (el) {
                  cardRefs.current[index] = el;
                }
              }}
              className="group relative p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.05]"
            >
              <div className="space-y-6">
                {service.icon && (
                  <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                )}

                <h3 className="text-2xl text-white">{t(service.titleKey)}</h3>

                <p className="text-white/60 leading-relaxed">
                  {t(service.descriptionKey)}
                </p>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  {service.techs.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="text-xs text-white/50">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <MagneticButton>
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium group transition-all duration-300"
            >
              <span className="relative">
                Ver todos os serviços
                <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
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
