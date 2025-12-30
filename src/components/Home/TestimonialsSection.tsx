"use client";

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
    type: "tweet",
    author: {
      name: "Sarah Jenkins",
      handle: "@sarahj_tech",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    content: "Just checked out @miltonbolonha's new profile page and I'm blown away! The voxel animations in the About section are next level. 🤯 #webdev #threejs",
    date: "2h ago",
    stats: { likes: 124, shares: 18 }
  },
  {
    id: "2",
    type: "card",
    author: {
      name: "Roberta Silva",
      role: "CEO na TechStart",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    content: "Trabalhar com o Milton foi uma experiência transformadora para nossa equipe. Sua capacidade de mentorar e elevar o nível técnico do time é impressionante.",
    stats: { likes: 856 }
  },
  {
    id: "3",
    type: "video",
    author: {
      name: "DevDaily Channel",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    content: "Reviewing the Best Portfolios of 2024 - You need to see this one!",
    image: "/img/fly-1-a.jpg", // Using existing placeholder
    stats: { likes: 2400, comments: 142 }
  },
  {
    id: "4",
    type: "comment",
    author: {
      name: "Carlos Mendes",
      role: "Senior Frontend dev",
      avatar: "https://randomuser.me/api/portraits/men/86.jpg"
    },
    content: "A arquitetura que você implementou no nosso último projeto salvou meses de refatoração futura. Código limpo e escalável de verdade. 👏",
    date: "1d ago",
    stats: { likes: 45 }
  },
  {
    id: "5",
    type: "tweet",
    author: {
      name: "Alex Chen",
      handle: "@alexc_dev",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg"
    },
    content: "Waiting for the course drop! The mentorship session yesterday clarified so many React patterns I was struggling with.",
    date: "4h ago",
    stats: { likes: 89, shares: 5 }
  },
  {
    id: "6",
    type: "card",
    author: {
      name: "Mariana Costa",
      role: "Product Manager",
      avatar: "https://randomuser.me/api/portraits/women/90.jpg"
    },
    content: "Entrega impecável e sempre um passo à frente nas sugestões de UX. O Milton não apenas coda, ele entende o produto.",
    stats: { likes: 320 }
  },
  {
    id: "7",
    type: "tweet",
    author: {
      name: "Lucas Oliveira",
      handle: "@lucas_game",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    content: "Simplesmente incrível a demo do jogo no browser! 🔥 A performance tá absurda.",
    image: "/img/fly-2-a.jpg", // Using existing placeholder
    date: "12h ago",
    stats: { likes: 210, shares: 42 }
  },
  {
    id: "8",
    type: "comment",
    author: {
      name: "Patricia Wu",
      role: "CTO @ Inova",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    content: "Contratar o Milton para a consultoria de performance foi o melhor investimento do trimestre. Reduzimos o LCP em 70%.",
    stats: { likes: 156 }
  }
];

const TestimonialCard = ({ item }: { item: Testimonial }) => {
  return (
    <div className="mb-6 break-inside-avoid shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
      <div className={`
        relative overflow-hidden rounded-2xl border border-white/10
        ${item.type === 'tweet' ? 'bg-[#000000]/60 backdrop-blur-md' : 
          item.type === 'video' ? 'bg-zinc-900' : 
          'bg-white/5 backdrop-blur-md'}
        p-6
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
              {item.author.handle && <span>{item.author.handle}</span>}
              {item.author.role && <span>{item.author.role}</span>}
              {item.date && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{item.date}</span>
                </>
              )}
            </div>
          </div>
          <div className="text-white/20">
            {item.type === 'tweet' && <FaTwitter />}
            {item.type === 'video' && <FaYoutube />}
            {(item.type === 'card' || item.type === 'comment') && <FaQuoteLeft className="w-3 h-3" />}
          </div>
        </div>

        {/* Content */}
        <p className="text-white/80 text-sm leading-relaxed mb-4">
          {item.content}
        </p>

        {/* Media (Image/Video) */}
        {item.image && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 group cursor-pointer border border-white/5">
            <OptimizedImage src={item.image} alt="Content media" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                  <FaPlay className="ml-1 text-white" size={14} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats / Footer */}
        {item.stats && (
          <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-xs text-white/40">
            <div className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer">
              <span>❤️</span>
              <span>{item.stats.likes}</span>
            </div>
            {item.stats.comments !== undefined && (
              <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer">
                <span>💬</span>
                <span>{item.stats.comments}</span>
              </div>
            )}
            {item.stats.shares !== undefined && (
              <div className="flex items-center gap-1.5 hover:text-green-400 transition-colors cursor-pointer">
                <span>🔄</span>
                <span>{item.stats.shares}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const TestimonialsSection = () => {
  return (
    <div className="relative w-full z-10">
      <div className="max-w-7xl mx-auto px-6">
        
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
