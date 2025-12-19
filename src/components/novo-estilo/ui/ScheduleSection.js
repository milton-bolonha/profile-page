import React, { useState } from "react";
import PageSection from "./PageSection";

const scheduleData = [
  {
    phase: 1,
    title: "Apresentação Inicial + Trilha Ignição",
    description: "Conhecer/Atualizar Mentorado",
    details:
      "Nesta primeira fase, vamos nos conhecer melhor e iniciar a Trilha Ignição, que é nosso método exclusivo de ignição da carreira. Vamos mapear suas habilidades atuais, identificar gaps e definir objetivos claros.",
    color: "from-purple-500 to-purple-600",
  },
  {
    phase: 2,
    title: "Trilha Ignição + Habilidades Técnicas",
    description: "Conhecer/Atualizar Mentorado",
    details:
      "Continuamos aprofundando a Trilha Ignição enquanto desenvolvemos suas habilidades técnicas essenciais. Foco em tecnologias demandadas pelo mercado internacional.",
    color: "from-blue-500 to-blue-600",
  },
  {
    phase: 3,
    title: "Parear Mercado + Treinamentos",
    description: "Atualizar Mentorado",
    details:
      "Agora vamos conectar você com o mercado. Identificamos oportunidades reais, clientes em potencial e começamos os treinamentos práticos para conquistar essas oportunidades.",
    color: "from-green-500 to-green-600",
  },
  {
    phase: 4,
    title: "Vitrine + Treinamentos",
    description: "Atualização e Posicionamento",
    details:
      "Criamos sua vitrine profissional online, otimizamos seu perfil e posicionamento no mercado. Treinamentos intensivos para apresentar seu trabalho de forma impactante.",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    phase: 5,
    title: "MVP + Treinamentos",
    description: "Posicionamento e MVP",
    details:
      "Desenvolvemos seu MVP (Minimum Viable Product) ou projeto piloto. Treinamentos específicos para executar projetos reais e demonstrar valor aos clientes.",
    color: "from-orange-500 to-orange-600",
  },
  {
    phase: 6,
    title: "Divulgação + Nova Tração",
    description: "Ampliação e Resultados",
    details:
      "Fase final: ampliamos sua rede de contatos, otimizamos processos e criamos estratégias para escalar seus resultados. Foco em resultados mensuráveis e sustentáveis.",
    color: "from-purple-500 to-purple-600",
  },
];

export default function ScheduleSection() {
  const [selectedWeek, setSelectedWeek] = useState(0);

  return (
    <PageSection
      id="cronograma"
      title="Cronograma Geral da Mentoria"
      titleSize="text-4xl md:text-6xl"
      subtitle="Um programa estruturado de 6 semanas para transformar sua carreira"
      bgImage="images/main-bg.jpg"
      vPadding="py-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu lateral */}
        <div className="lg:col-span-1">
          <div className="space-y-3">
            {scheduleData.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedWeek(index)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                  selectedWeek === index
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                }`}
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                      selectedWeek === index
                        ? "bg-white text-purple-600"
                        : `bg-gradient-to-r ${item.color} text-white`
                    }`}
                  >
                    {item.phase}
                  </div>
                  <span className="font-semibold">Fase {item.phase}</span>
                </div>
                <p className="text-sm opacity-90">{item.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo da fase selecionada */}
        <div className="lg:col-span-3">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 bg-gradient-to-r ${scheduleData[selectedWeek].color} shadow-lg`}
              >
                {scheduleData[selectedWeek].phase}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Fase {scheduleData[selectedWeek].phase}
                </h3>
                <p className="text-lg text-purple-600 dark:text-purple-400">
                  {scheduleData[selectedWeek].title}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Objetivo da Fase:
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {scheduleData[selectedWeek].description}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Detalhamento:
              </h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {scheduleData[selectedWeek].details}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${scheduleData[selectedWeek].color} mr-2`}
                ></div>
                <span>Fase {scheduleData[selectedWeek].phase} de 6</span>
              </div>

              <div className="flex space-x-2">
                {scheduleData.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === selectedWeek
                        ? "bg-purple-600"
                        : index < selectedWeek
                        ? "bg-purple-400"
                        : "bg-gray-300"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
