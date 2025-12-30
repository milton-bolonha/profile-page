import React from "react";
import { NumberCounter } from "@/components/ui/NumberCounter";
import { TextMotion } from "@/components/ui/TextMotion";

const stats = [
  {
    number: 47,
    label: "Mentorados",
    description: "Profissionais transformados",
  },
  {
    number: 465,
    label: "Sessões",
    description: "Horas de mentoria realizadas",
  },
  {
    number: 424,
    label: "Faturamento",
    description: "Resultados comprovados",
    prefix: "$",
    suffix: "k",
  },
  {
    number: 2,
    label: "Mentores",
    description: "Especialistas experientes",
  },
];

export const NewStatsSection = () => {
  return (
    <div className="relative bg-black w-full h-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span className="text-sm font-medium text-white/80 tracking-wide">Números</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6" style={{ fontFamily: 'Noto Serif Variable, serif', lineHeight: '1.3' }}>
            <TextMotion trigger={true} stagger={0.05}>
              Nossos Resultados
            </TextMotion>
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Nos últimos anos, ajudei profissionais e equipes a destravarem suas carreiras e projetos com clareza, visão de mercado e ação coordenada.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="text-5xl md:text-6xl font-light text-white mb-3">
                <NumberCounter 
                  end={stat.number} 
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={2.5}
                />
              </div>
              <div className="text-lg text-white/90 mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-white/50">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
