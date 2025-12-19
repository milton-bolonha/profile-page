import React, { useState } from "react";
import StoryCard from "./StoryCard";

export default function StoriesSection() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const stories = [
    {
      id: 1,
      image: "/images/cards-1.png",
      alt: "Story 1",
      title: "Trilha Ignição",
      subtitle: "Desenvolva suas habilidades de liderança",
      content:
        "Aprenda as melhores práticas de liderança com mentores experientes que já lideraram equipes de sucesso em empresas globais. Desenvolva habilidades de comunicação, tomada de decisão e gestão de pessoas.",
    },
    {
      id: 2,
      image: "/images/cards-2.png",
      alt: "Story 2",
      title: "Semana Revolucionária",
      subtitle: "Expanda seus horizontes profissionais",
      content:
        "Descubra como construir uma carreira internacional de sucesso. Nossos mentores compartilham insights sobre mercado global, networking internacional e oportunidades de trabalho no exterior.",
    },
    {
      id: 3,
      image: "/images/cards-3.png",
      alt: "Story 3",
      title: "Job Internacionao em 30 Dias",
      subtitle: "Transforme sua ideia em negócio",
      content:
        "Do conceito à execução, aprenda com empreendedores que já construíram empresas de sucesso. Desenvolva mindset empreendedor, validação de ideias e estratégias de crescimento.",
    },
    {
      id: 4,
      image: "/images/cards-4.png",
      alt: "Story 4",
      title: "Projeto Você StartUP",
      subtitle: "Mantenha-se atualizado com as tendências",
      content:
        "Explore as últimas tendências tecnológicas e como aplicá-las no seu trabalho. Desde IA até blockchain, nossos mentores te ajudam a navegar no mundo da tecnologia.",
    },
    {
      id: 5,
      image: "/images/cards-5.png",
      alt: "Story 5",
      title: "Especialista Mentor",
      subtitle: "Invista em seu crescimento pessoal",
      content:
        "Trabalhe suas soft skills, inteligência emocional e autoconhecimento. Nossos mentores te ajudam a desenvolver as competências essenciais para o sucesso profissional.",
    },
    {
      id: 6,
      image: "/images/cards-6.png",
      alt: "Story 6",
      title: "Bushido 3.0",
      subtitle: "Construa relacionamentos valiosos",
      content:
        "Aprenda a construir e manter uma rede de contatos estratégica. Descubra como fazer networking efetivo e criar relacionamentos profissionais duradouros.",
    },
  ];

  const handleCardClick = (story) => {
    // Se clicar no mesmo card selecionado, deseleciona
    if (selectedCardId === story.id) {
      setSelectedCardId(null);
      setSelectedCard(null);
      setIsModalOpen(false);
    } else {
      // Seleciona o novo card e abre modal
      setSelectedCardId(story.id);
      setSelectedCard(story);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
    setSelectedCardId(null);
  };

  return (
    <section className="py-26">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header com tagline e título */}
        <header className="text-center mb-20">
          {/* Tagline */}
          <div
            className="inline-flex items-center px-4 py-2 rounded-full border mb-4"
            style={{
              background:
                "linear-gradient(90deg, rgba(229, 156, 255, 0.24) 0%, rgba(186, 156, 255, 0.24) 50%, rgba(156, 178, 255, 0.24) 100%)",
              borderColor: "#BA9CFF",
            }}
          >
            <span className="text-sm font-medium" style={{ color: "#BA9CFF" }}>
              Impacto Global
            </span>
          </div>

          {/* Título */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 Geologica">
            As Melhores Mentorias
            <br />
            Com as Melhores Pessoas
          </h2>
        </header>

        {/* Grid de cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              image={story.image}
              alt={story.alt}
              isSelected={selectedCardId === story.id}
              onClick={() => handleCardClick(story)}
            />
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && selectedCard && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white/65 dark:bg-gray-800/65 backdrop-blur-sm rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Header do modal */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedCard.title}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {selectedCard.subtitle}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                    aria-label="Fechar modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Conteúdo do modal */}
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedCard.content}
                  </p>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      // Aqui você pode adicionar lógica para agendar mentoria
                      console.log("Agendar mentoria:", selectedCard.title);
                    }}
                    className="flex-1 border border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    Agendar Mentoria
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
