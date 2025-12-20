import React, { useState } from "react";
import { PageSection } from "./PageSection";

const faqData = [
  {
    question: "Como funciona a mentoria I/O?",
    answer:
      "Nossa mentoria é individual e personalizada. Durante 6 semanas, você terá sessões semanais com nossos mentores especializados, receberá material didático exclusivo e terá acesso à nossa IA @goshDev para suporte contínuo.",
  },
  {
    question: "Qual é o investimento para a mentoria?",
    answer:
      "Oferecemos um investimento acessível comparado aos cursos massivos do mercado. Entre em contato conosco via WhatsApp para conhecer nossos planos e condições especiais.",
  },
  {
    question: "A mentoria é adequada para iniciantes?",
    answer:
      "Sim! Nossa metodologia é inclusiva e adaptada para diferentes níveis. Seja você iniciante ou já tenha alguma experiência, nossos mentores vão personalizar o conteúdo para suas necessidades específicas.",
  },
  {
    question: "Que tecnologias vocês ensinam?",
    answer:
      "Focamos nas tecnologias mais demandadas do mercado internacional: desenvolvimento web moderno, frameworks atuais, metodologias ágeis e ferramentas de produtividade. Sempre com foco em resultados práticos.",
  },
  {
    question: "Como posso me inscrever?",
    answer:
      "É simples! Clique no botão 'Fale Com Um/a Mentor/a' ou entre em contato via WhatsApp (12 98106-2959). Vamos agendar uma conversa inicial gratuita para entender suas necessidades.",
  },
  {
    question: "Vocês oferecem garantia de resultados?",
    answer:
      "Oferecemos acompanhamento individual e metodologia comprovada. Nossos mentorados já faturaram mais de R$424mil. Cada mentoria é feita sob medida para maximizar suas chances de sucesso.",
  },
  {
    question: "Qual é a duração total do programa?",
    answer:
      "O programa completo tem duração de 6 semanas, com sessões semanais de acompanhamento. Além disso, você terá acesso contínuo aos materiais e à nossa IA @goshDev.",
  },
  {
    question: "Posso fazer a mentoria mesmo morando fora do Brasil?",
    answer:
      "Sim! Nossa mentoria é 100% online e especializada em carreira internacional. Nossos mentores têm experiência no mercado global e podem te ajudar a conquistar oportunidades no exterior.",
  },
  {
    question: "O que é a @goshDev?",
    answer:
      "A @goshDev é nossa Inteligência Artificial exclusiva, criada em 2025. Ela oferece suporte ilimitado para dúvidas técnicas e de carreira, funcionando como um assistente virtual personalizado para nossos mentorados.",
  },
  {
    question: "Vocês trabalham com freelancers e startups?",
    answer:
      "Sim! Somos especializados em freelancer e startup. Nossa metodologia 'Projeto Você StartUP' e 'Trilha Ignição' são específicas para quem quer empreender ou trabalhar como freelancer no mercado internacional.",
  },
];

export const FAQSection = () => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <PageSection
      id="faq"
      title="Perguntas Frequentes"
      titleSize="text-4xl md:text-6xl"
      subtitle="Tire suas dúvidas sobre nossas mentorias e descubra como podemos<br />te ajudar a transformar sua carreira"
      bgImage=""
      vPadding="py-20"
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="bg-card/90 dark:bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-border/50"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50 transition-colors text-left"
            >
              <h3 className="text-lg font-semibold text-foreground pr-4">
                {faq.question}
              </h3>
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center transition-transform duration-300">
                <svg
                  className={`w-4 h-4 text-primary transition-transform duration-300 ${
                    openItems[index] ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
            {openItems[index] && (
              <div className="px-6 pb-6">
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-card/90 dark:bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-2xl mx-auto border border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-muted-foreground mb-6">
            Nossa equipe está pronta para esclarecer qualquer questão e te
            ajudar a dar o próximo passo na sua carreira.
          </p>
          <a
            href="https://wa.me/5512981062959"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md px-8 py-2 text-md font-semibold transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Fale Com Um/a Mentor/a
          </a>
        </div>
      </div>
    </PageSection>
  );
};
