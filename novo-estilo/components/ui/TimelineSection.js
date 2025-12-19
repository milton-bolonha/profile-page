import { useState, useEffect } from "react";

import PageSection from "./PageSection";

const timelineData = [
  {
    year: "1998",
    title: "O Início da Jornada",
    description:
      "Nosso CEO Milton Bolonha com 11 anos, por meio de engenharia reversa, faz um site em HTML, CSS e JS dedicado ao anti-herói de anime Vegetta.",
    icon: "🚀",
  },
  {
    year: "1999",
    title: "Tratado de Bologna",
    description:
      "O então Presidente FHC firma o Tratado de Bologna, logo antes de uma nova revolução industrial.",
    icon: "📜",
  },
  {
    year: "2005",
    title: "Era da Internet",
    description:
      "A era da internet revoluciona tudo. Na época nosso CEO já trabalhava há 2 anos com tecnologia.",
    icon: "🌐",
  },
  {
    year: "2007-2009",
    title: "Serviços Filantrópicos",
    description:
      "Milton Bolonha prestou serviços filantrópicos de tempo integral, atuando com ensino e humanitários no nordeste brasileiro, passando pelas cidades da Paraíba: Patos, Campina Grande, Lucena e João Pessoa.",
    icon: "🤝",
  },
  {
    year: "2010-2018",
    title: "Revoluções Tecnológicas",
    description:
      "Diversas revoluções, a maior delas foi que as tecnologias web se tornaram primordiais e ao mesmo tempo fáceis de aprender. A máxima prevalece 'A Web Venceu!'",
    icon: "⚡",
  },
  {
    year: "2018",
    title: "Mercado Internacional",
    description:
      "Nosso CEO inicia a sua jornada de sucesso no mercado internacional. E começa a escrever o seu primeiro livro técnico, além do seu livro lúdico-pedagógico.",
    icon: "🌍",
  },
  {
    year: "2019",
    title: "O Aluno Zero",
    description:
      "O aluno zero pede para nosso CEO ensinar programação, pois há muito tenta aprender e não consegue entender. Lançado primeiro MVP e começamos a participar de eventos e feiras de startup.",
    icon: "👨‍🎓",
  },
  {
    year: "2019/2020",
    title: "Validação e MVP",
    description:
      "• Duas pesquisas de mercado\n• Validação na Techstarts Startup Weekend\n• 1º MVP\n• Criação do primeiro pré-moldado para uso comercial dos mentorados\n• Início das atividades remuneradas\n• Lançamento do segundo livro",
    icon: "✅",
  },
  {
    year: "2021-2024",
    title: "Expansão e Sucesso",
    description:
      "• Expansão das tecnologias\n• Marca de 70k USD em ganhos\n• Consultoria para a HapVida\n• Participação na 100 Open Startups (Nível 3: Startup sendo recomendada para Rede de Investidores)",
    icon: "📈",
  },
  {
    year: "2021-2024",
    title: "Reconhecimento",
    description:
      "• Destaque na AC Boost 2022 (avaliados por comissão da Associação Comercial de São Paulo)\n• Parceria com Descola (Cubo Itaú)\n• Participação e treinamento Anjos do Brasil\n• Lançamento do terceiro livro",
    icon: "🏆",
  },
  {
    year: "2025",
    title: "Futuro Presente",
    description:
      "• Criada as mentorias 'Trilha Ignição', 'Projeto Você StartUP' e scripts para mentoria semanal\n• Nasce a nossa Inteligência Artificial, seu nome é @goshDev\n• Nova identidade para os materiais didáticos da mentoria\n• Início da fase de expansão dos mentores",
    icon: "🤖",
  },
];

export default function TimelineSection() {
  const [showAll, setShowAll] = useState(false);
  const initialItemsCount = 4;

  const visibleItems = showAll
    ? timelineData
    : timelineData.slice(0, initialItemsCount);

  return (
    <PageSection
      id="historia"
      title="Nossa História"
      titleSize="text-4xl md:text-6xl"
      subtitle="Uma jornada de mais de duas décadas transformando vidas através da<br />tecnologia e mentoria"
      bgImage="images/bg-1.jpg"
      backgroundSize="contain"
      vPadding="py-20 bg-no-repeat bg-center"
    >
      <div className="relative">
        {/* Linha vertical central */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>

        <div className="space-y-12">
          {visibleItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Conteúdo do card */}
              <div className={`w-5/12 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{item.icon}</span>
                    <div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {item.year}
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </div>
                </div>
              </div>

              {/* Ponto central */}
              <div className="w-2/12 flex justify-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Espaço vazio para alternar  */}
              <div className="w-5/12"></div>
            </div>
          ))}
        </div>

        {/* Botão "Ler mais" / "Ler menos" */}
        {timelineData.length > initialItemsCount && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="relative z-50 cursor-pointer inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {showAll
                ? "Ver menos"
                : `Ver mais ${timelineData.length - initialItemsCount} eventos`}
              <span className="ml-2">{showAll ? "↑" : "↓"}</span>
            </button>
          </div>
        )}
      </div>
    </PageSection>
  );
}
