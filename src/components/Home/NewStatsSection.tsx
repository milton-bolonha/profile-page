import React, { useState } from "react";
import { NumberCounter } from "@/components/ui/NumberCounter";
import { TextMotion } from "@/components/ui/TextMotion";
import { useLanguage } from "@/contexts/LanguageContext";
import { FaInfoCircle } from "react-icons/fa";

import statsPT from "../../../content/home/stats.json";
import statsEN from "../../../content/home/stats.en.json";

export const NewStatsSection = () => {
  const { language } = useLanguage();
  const content = language === 'pt' ? statsPT.statsSection : statsEN.statsSection;
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const extractNumber = (val: string) => {
    const match = val.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 lg:mb-20">
          <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span className="text-sm font-medium text-white/80 tracking-wide">{content.title}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6" style={{ fontFamily: 'Noto Serif Variable, serif', lineHeight: '1.3' }}>
            <TextMotion trigger={true} stagger={0.05}>
              {content.subtitle}
            </TextMotion>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.items.map((stat: any, index: number) => (
            <div
              key={index}
              className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500"
            >
              <div className="relative flex items-center gap-2 mb-3">
                <div className="text-4xl md:text-4xl font-semibold text-white tracking-tight">
                  {/^\d+$/.test(stat.value) || /^\d+\+$/.test(stat.value) ? (
                    <NumberCounter
                      end={extractNumber(stat.value)}
                      prefix={stat.value.includes('$') ? '$' : undefined}
                      suffix={stat.value.includes('+') ? '+' : (stat.value.includes('k') ? 'k' : undefined)}
                      duration={2.5}
                      className="font-bold"
                    />
                  ) : (
                    <span>{stat.value}</span>
                  )}
                </div>

                {(stat.info || stat.sublabel) && (
                  <button
                    className="text-white/20 hover:text-white transition-colors focus:outline-none"
                    onMouseEnter={() => setActiveTooltip(index)}
                    onMouseLeave={() => setActiveTooltip(null)}
                    onClick={() => setActiveTooltip(activeTooltip === index ? null : index)}
                  >
                    <FaInfoCircle size={14} />
                  </button>
                )}

                {(stat.info || stat.sublabel) && (
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[180px] px-3 py-2 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg text-xs text-white transform transition-all duration-200 pointer-events-none z-30 shadow-xl ${activeTooltip === index ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}>
                    <div className="text-white/70">- {stat.info || stat.sublabel}</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-black/90" />
                  </div>
                )}
              </div>

              <div className="text-lg text-white/90 text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
