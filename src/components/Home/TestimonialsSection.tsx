import React from "react";
import { FaTwitter, FaLinkedin, FaYoutube, FaQuoteLeft, FaPlay } from "react-icons/fa";
import { OptimizedImage } from "@/components/commons/OptimizedImage";

interface Testimonial {
  id: string;
  type: 'tweet' | 'comment' | 'video' | 'card';
  author: {
    name: string;
    handle?: string;
    avatar: string;
    role?: string;
  };
  content: string;
  date?: string;
  image?: string;
  stats?: {
    likes: number;
    shares?: number;
    comments?: number;
  };
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    type: "card",
    author: {
      name: "Federico H.",
      role: "Milão, Itália",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    content: "Esse cara é um rockstar do código. Eu recomendo! :) Também é uma pessoa muito descontraída e comunicativa. Com certeza voltaremos a trabalhar com ele. CINCO ESTRELAS!",
    stats: { likes: 124 }
  },
  {
    id: "2",
    type: "card",
    author: {
      name: "Renato Q.",
      role: "Lisboa, Portugal",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    content: "O mercado está inundado de desenvolvedores de baixa experiência, mas Milton está claramente em um nível diferente, GOAT!",
    stats: { likes: 89 }
  },
  {
    id: "3",
    type: "card",
    author: {
      name: "Ryan M.",
      role: "Denver, EUA",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    content: "Milton é um desenvolvedor muito talentoso. Contratei-o há vários anos e conheço-o bem. As habilidades de Milton são muito altas. Eu recomendo a ele.",
    stats: { likes: 56 }
  },
  {
    id: "4",
    type: "card",
    author: {
      name: "Jordane P.",
      role: "França",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    content: "Ótimo.! Boa comunicação e trabalho rápido. Eu recomendo.",
    stats: { likes: 34 }
  },
  {
    id: "5",
    type: "card",
    author: {
      name: "Nathan P.",
      role: "Richmond, EUA",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    content: "Milton nos ajudou a otimizar nosso site Gatsby e resolver nossos problemas de “build”. Ótimo trabalho!",
    stats: { likes: 78 }
  },
  {
    id: "6",
    type: "card",
    author: {
      name: "Gustavo P.",
      role: "São Paulo, BR",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg"
    },
    content: "Milton é um excelente profissional e definitivamente um especialista em Gatsby. Ele possui boa qualidade de código e atenção aos prazos.",
    stats: { likes: 45 }
  },
  {
    id: "7",
    type: "card",
    author: {
      name: "Emily W.",
      role: "Hollywood, USA",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    content: "Desenvolvimento sólido. Obrigado!",
    stats: { likes: 23 }
  },
  {
    id: "8",
    type: "card",
    author: {
      name: "Ken Miller",
      role: "Denver, EUA",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg"
    },
    content: "Milton é um ótimo designer e desenvolvedor. Ele é extremamente talentoso em WordPress, Git e Gatsby. Eu recomendo muito o Milton.",
    stats: { likes: 67 }
  },
  {
    id: "9",
    type: "card",
    author: {
      name: "Gustavo O.",
      role: "Brasília, BR",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    content: "Desenvolvedor muito bom para trabalhar. Rápido, eficiente e conhecedor. Certamente recomendo e quero trabalhar novamente com ele.",
    stats: { likes: 92 }
  }
];

const TestimonialCard = ({ item }: { item: Testimonial }) => {
  return (
    <div className="mb-6 break-inside-avoid shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
      <div className={`
        relative overflow-hidden rounded-2xl border border-white/10
        bg-white/5 backdrop-blur-md p-6
      `}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
            <OptimizedImage
              src={item.author.avatar}
              alt={item.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white/90 text-sm truncate">{item.author.name}</h4>
            <div className="flex items-center gap-2 text-xs text-white/50">
              {item.author.role && <span>{item.author.role}</span>}
            </div>
          </div>
          <div className="text-white/20">
            <FaQuoteLeft className="w-3 h-3" />
          </div>
        </div>

        {/* Content */}
        <p className="text-white/80 text-sm leading-relaxed mb-4">
          {item.content}
        </p>

        {/* Stats / Footer */}
        {item.stats && (
          <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-xs text-white/40">
            <div className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer">
              <span>❤️</span>
              <span>{item.stats.likes}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TestimonialsSection = () => {
  return (
    <div className="relative bg-black w-full z-10">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:linear-gradient(to_right,black_0%,black_40%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span className="text-sm font-medium text-white/80 tracking-wide uppercase">
              Community & Feedback
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6" style={{ fontFamily: 'Noto Serif Variable, serif' }}>
            O que dizem por aí
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Feedback real de clientes, alunos e parceiros de comunidade.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default TestimonialsSection;
