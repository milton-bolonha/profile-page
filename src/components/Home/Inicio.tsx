import { useState, useEffect } from "react";
import { OptimizedImage } from "@/components/commons/OptimizedImage";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import MagneticButton from "@/components/ui/MagneticButton";
import { SplitText } from "@/components/ui/SplitText";
import heroData from "../../../content/home/hero.json";

export const Inicio = () => {
  const { t } = useLanguage();
  const { badge, photo } = heroData.hero;
  const [enable3D, setEnable3D] = useState(false);

  useEffect(() => {
    // Delay 3D loading to prioritized H1 animation (approx 2.5s)
    const timer = setTimeout(() => {
      setEnable3D(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative bg-black min-h-screen w-full flex items-center">
      {/* Background Ambience */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-white/3 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-white/3 rounded-full blur-[120px]" />
      </div> */}

      {/* Grid Pattern Sutil */}
      {/* Grid Pattern Sutil (Left Side Only) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:linear-gradient(to_right,black_0%,black_40%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-20 items-center">
          
          {/* Left: Content */}
          <div className="space-y-10 text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#1db954] shadow-[0_0_10px_rgba(29,185,84,0.5)]" />
              {badge.icon && <span className="text-xl">{badge.icon}</span>}
              <span className="text-sm font-medium text-white/80 tracking-wide">
                {t(badge.textKey)}
              </span>
            </div>

            {/* Title - Split Text Animation */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95] font-semibold" style={{ fontFamily: 'Noto Serif Variable, serif' }}>
                <SplitText text={t("home.titleBold")} delay={0.2} stagger={0.05} />
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t("home.subtitle")}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <MagneticButton>
                <Link
                  href="/contato"
                  onClick={() => trackEvent("click", "CTA", "Lets Talk - Hero")}
                  className="group relative inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 font-medium py-4 px-8 rounded-full transition-all duration-300"
                >
                  <span className="relative z-10">{t("cta.letsTalk")}</span>
                  <svg className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link
                  href="/projetos"
                  onClick={() => trackEvent("click", "CTA", "View Projects - Hero")}
                  className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 font-medium py-4 px-8 rounded-full border border-white/10 transition-all duration-300"
                >
                  {t("cta.viewProjects")}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </MagneticButton>
            </div>

            {/* Stats - Minimalista */}
            <div className="flex gap-12 justify-center lg:justify-start pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-medium text-white">10+</div>
                <div className="text-sm text-white/50">Anos</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-white">100+</div>
                <div className="text-sm text-white/50">Projetos</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-white">50+</div>
                <div className="text-sm text-white/50">Clientes</div>
              </div>
            </div>
          </div>

          {/* Right: Image - SEM BOLA, retangular elegante */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative group w-full max-w-md">
              {/* Glow effect */}
              {/* <div className="absolute -inset-4 bg-white/5 rounded-2xl blur-3xl group-hover:bg-white/10 transition-all duration-500" /> */}
              <div className="absolute -inset-4" />
              
              {/* Image container - RETANGULAR */}
              <div className="relative aspect-[3/4]">
                <div className="absolute inset-0" />
                <OptimizedImage
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  priority
                  cubeFrame={true}
                  shouldLoad={enable3D}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
