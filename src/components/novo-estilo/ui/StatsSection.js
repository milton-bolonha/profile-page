import React from "react";
import PageSection from "./PageSection";

const stats = [
  {
    number: "47",
    label: "Mentorados",
    description: "Profissionais transformados",
  },
  {
    number: "465",
    label: "Sessões",
    description: "Horas de mentoria realizadas",
  },
  {
    number: "R$424mil",
    label: "Mentorados Já Faturaram",
    description: "Resultados comprovados",
  },
  {
    number: "2",
    label: "Mentores",
    description: "Especialistas experientes",
  },
];

export default function StatsSection() {
  return (
    <PageSection
      id="estatisticas"
      title="Nossos Números"
      titleSize="text-4xl md:text-6xl"
      subtitle="Nos últimos anos, ajudei profissionais e equipes a destravarem suas<br />carreiras e projetos com clareza, visão de mercado e ação<br />coordenada. Cada mentoria é feita sob medida, não é o mesmo remédio<br />para todo paciente, pois ninguém cresce de verdade com receita pronta."
      bgImage="images/bg-1.jpg"
      vPadding="py-20"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {stat.number}
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {stat.label}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.description}
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  );
}
