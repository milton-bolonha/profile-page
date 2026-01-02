import { useState, useEffect } from "react";
import { OptimizedImage } from "@/components/commons/OptimizedImage";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import MagneticButton from "@/components/ui/MagneticButton";
import { SplitText } from "@/components/ui/SplitText";
import { FaInfoCircle } from "react-icons/fa";

import heroPT from "../../../content/home/hero.json";
import heroEN from "../../../content/home/hero.en.json";

export const Inicio = () => {
  const { language } = useLanguage();
  const content = language === 'pt' ? heroPT.hero : heroEN.hero;
  
  const [enable3D, setEnable3D] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEnable3D(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative bg-black min-h-screen w-full flex items-center">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:linear-gradient(to_right,black_0%,black_40%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-20 items-center">
          
          <div className="space-y-10 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#1db954] shadow-[0_0_10px_rgba(29,185,84,0.5)]" />
              <span className="text-sm font-medium text-white/80 tracking-wide uppercase">
                {content.badge}
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95] font-semibold" style={{ fontFamily: 'Noto Serif Variable, serif' }}>
                <SplitText text={content.title} delay={0.2} stagger={0.05} />
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-normal max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {content.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <MagneticButton>
                <Link
                  href="/contato"
                  onClick={() => trackEvent("click", "CTA", "Lets Talk - Hero")}
                  className="group relative inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 font-medium py-4 px-8 rounded-full transition-all duration-300"
                >
                  <span className="relative z-10">{content.cta.primary}</span>
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
                  {content.cta.secondary}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </MagneticButton>
            </div>

            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8 border-t border-white/10">
              {content.stats && content.stats.map((stat: any, index: number) => (
                <div key={index} className="relative group/stat">
                   <div className="flex items-center gap-2">
                      <div className="text-3xl font-medium text-white">{stat.value}</div>
                      
                      {/* Info Button */}
                      {(stat.info) && (
                         <button 
                         className="text-white/30 hover:text-white transition-colors focus:outline-none"
                         onMouseEnter={() => setActiveTooltip(index)}
                         onMouseLeave={() => setActiveTooltip(null)}
                         onClick={() => setActiveTooltip(activeTooltip === index ? null : index)}
                         aria-label={`Info about ${stat.label}`}
                         >
                            <FaInfoCircle size={14} />
                         </button>
                      )}
                   </div>
                   <div className="text-sm text-white/50">{stat.label}</div>

                   {/* Tooltip / Popover - FIXED STYLE */}
                   {(stat.info) && (
                     <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[200px] px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-sm text-white transform transition-all duration-200 pointer-events-none z-20 shadow-lg ${activeTooltip === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                        <span className="text-white/80">{stat.info}</span>
                        {/* Seta do tooltip */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-white/20" />
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative group w-full max-w-md">
              <div className="absolute -inset-4" />
              
              <div className="relative aspect-[3/4]">
                <div className="absolute inset-0" />
                <OptimizedImage
                  src={content.photo.url}
                  alt={content.photo.alt}
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
