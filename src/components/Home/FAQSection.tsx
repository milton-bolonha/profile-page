import React, { useState } from "react";
import { TextMotion } from '@/components/ui/TextMotion';

const faqData = [
  {
    question: "Como funciona a mentoria I/O?",
    answer: "Nossa mentoria é individual e personalizada. Durante 6 semanas, você terá sessões semanais com nossos mentores especializados, receberá material didático exclusivo e terá acesso à nossa IA @goshDev para suporte contínuo.",
  },
  {
    question: "Qual é o investimento para a mentoria?",
    answer: "Oferecemos um investimento acessível comparado aos cursos massivos do mercado. Entre em contato conosco via WhatsApp para conhecer nossos planos e condições especiais.",
  },
  {
    question: "A mentoria é adequada para iniciantes?",
    answer: "Sim! Nossa metodologia é inclusiva e adaptada para diferentes níveis. Seja você iniciante ou já tenha alguma experiência, nossos mentores vão personalizar o conteúdo para suas necessidades específicas.",
  },
  {
    question: "Que tecnologias vocês ensinam?",
    answer: "Focamos nas tecnologias mais demandadas do mercado internacional: desenvolvimento web moderno, frameworks atuais, metodologias ágeis e ferramentas de produtividade. Sempre com foco em resultados práticos.",
  },
  {
    question: "Como posso me inscrever?",
    answer: "É simples! Clique no botão 'Fale Com Um/a Mentor/a' ou entre em contato via WhatsApp (12 98106-2959). Vamos agendar uma conversa inicial gratuita para entender suas necessidades.",
  },
];

interface FAQItemProps {
  faq: { question: string; answer: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem = ({ faq, index, isOpen, onToggle }: FAQItemProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className="relative border border-white/10 rounded-2xl overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%), linear-gradient(135deg, black 0%, #1a1a1a 100%)`,
      }}
    >
      {/* Radial gradient bottom-right */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-gray-800/20 to-transparent pointer-events-none" />

      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left group relative z-10 cursor-pointer"
      >
        <h3 className="text-white pr-8 group-hover:text-white/80 transition-colors text-left font-medium" style={{ fontSize: '18px' }}>
          {faq.question}
        </h3>
        <svg
          className={`w-5 h-5 text-white/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-white/10 relative z-10">
          <p className="text-white/60 leading-relaxed pt-4">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
};

export const FAQSection = () => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl w-full mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span className="text-sm font-medium text-white/80 tracking-wide">FAQ</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6" style={{ fontFamily: 'Noto Serif Variable, serif', lineHeight: '1.3' }}>
            <TextMotion trigger={true} stagger={0.05}>
              Perguntas Frequentes
            </TextMotion>
          </h2>
          <p className="text-xl text-white/60">
            Tire suas dúvidas sobre nossas mentorias
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openItems[index]}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-2xl text-white mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-white/60 mb-6">
              Nossa equipe está pronta para esclarecer qualquer questão
            </p>
            <a
              href="https://wa.me/5512981062959"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 font-medium py-3 px-8 rounded-full transition-all duration-300"
            >
              Fale Com Um/a Mentor/a
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
