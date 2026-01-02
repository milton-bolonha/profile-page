"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  ScrollText,
  Globe,
  Plane,
  Bot
} from "lucide-react";


interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  detailedContent?: {
    achievements: string[];
    technologies?: string[];
    impact?: string;
  };
}

const timelineData: TimelineItem[] = [
  {
    year: "1998",
    title: "O Início da Jornada",
    description: "Com 11 anos, engenharia reversa de um site em HTML, CSS e JS dedicado ao anime Vegeta.",
    icon: Rocket,
    category: "Origem",
    detailedContent: {
      achievements: ["Primeiro contato com programação", "Engenharia reversa autodidata"],
      technologies: ["HTML", "CSS", "JavaScript"],
      impact: "Descoberta da paixão pela tecnologia",
    },
  },
  {
    year: "1999",
    title: "Tratado de Bologna",
    description: "Assinatura do Tratado de Bologna pelo Presidente FHC, marcando o início de uma nova revolução industrial.",
    icon: ScrollText,
    category: "Origem",
    detailedContent: {
      achievements: ["Contexto histórico brasileiro"],
      impact: "Mudanças educacionais que influenciaram a formação",
    },
  },
  {
    year: "2005",
    title: "Era da Internet",
    description: "A revolução da internet transforma tudo. Aos 18 anos, já trabalhava com tecnologia há 2 anos.",
    icon: Globe,
    category: "Carreira",
    detailedContent: {
      achievements: ["Experiência prática em tecnologia", "Acompanhamento da revolução digital"],
      technologies: ["Tecnologias web emergentes"],
      impact: "Base sólida para carreira profissional",
    },
  },
  {
    year: "2018",
    title: "Mercado Internacional",
    description: "Início da jornada no mercado internacional. Lançamento do primeiro livro técnico.",
    icon: Plane,
    category: "Carreira",
    detailedContent: {
      achievements: ["Expansão internacional", "Publicação de livro técnico"],
      impact: "Reconhecimento internacional"
    }
  },
  {
    year: "2025",
    title: "Futuro Presente",
    description: "Mentorias 'Trilha Ignição', IA @goshDev e expansão da rede de mentores.",
    icon: Bot,
    category: "Futuro",
    detailedContent: {
      achievements: ["Programa de mentorias", "Desenvolvimento de IA"],
      technologies: ["Inteligência Artificial", "Machine Learning"],
      impact: "Futuro da educação tecnológica"
    }
  }
];

import { TextMotion } from '@/components/ui/TextMotion';

export default function NewTimelineSection() {
  const [selectedYear, setSelectedYear] = useState<string>("1998");
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const yearNavRef = useRef<HTMLDivElement>(null);
  const selectedItem = timelineData.find((item) => item.year === selectedYear) || timelineData[0];

  const years = timelineData.map(t => t.year);
  const uniqueYears = Array.from(new Set(years));
  const currentIndex = uniqueYears.indexOf(selectedYear);

  useEffect(() => {
    if (!yearNavRef.current || !sectionRef.current) return;

    let wheelTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      if (!isScrollLocked) return;

      const currentIdx = uniqueYears.indexOf(selectedYear);
      const isAtFirstYear = currentIdx === 0;
      const isAtLastYear = currentIdx === uniqueYears.length - 1;
      const scrollingUp = e.deltaY < 0;
      const scrollingDown = e.deltaY > 0;

      // Allow natural scroll at boundaries
      if ((isAtFirstYear && scrollingUp) || (isAtLastYear && scrollingDown)) {
        setIsScrollLocked(false);
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Debounce wheel events
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (scrollingDown && currentIdx < uniqueYears.length - 1) {
          setSelectedYear(uniqueYears[currentIdx + 1]);
        } else if (scrollingUp && currentIdx > 0) {
          setSelectedYear(uniqueYears[currentIdx - 1]);
        }
      }, 50);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setIsScrollLocked(true);
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.3) {
            setIsScrollLocked(false);
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    const yearNav = yearNavRef.current;
    observer.observe(yearNav);

    // Add to window to bypass ScrollContainer
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', handleWheel, { capture: true });
      clearTimeout(wheelTimeout);
    };
  }, [selectedYear, uniqueYears, isScrollLocked]);

  const skipToPrevSection = () => {
    setIsScrollLocked(false);
    const techSection = document.getElementById('tecnologias'); // Verify this ID reference
    if (techSection) {
      window.scrollTo({ top: techSection.offsetTop, behavior: 'smooth' });
    }
  };

  const skipToNextSection = () => {
    setIsScrollLocked(false);
    const demoSection = document.getElementById('showcase-demo'); // Verify this ID reference
    if (demoSection) {
      window.scrollTo({ top: demoSection.offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <div ref={sectionRef} className="w-full h-full flex flex-col justify-center relative overflow-hidden min-h-screen">


      {/* Skip buttons when locked */}
      <AnimatePresence>
        {isScrollLocked && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-24 left-6 z-50 flex flex-col gap-2"
          >
            <button
              onClick={skipToPrevSection}
              className="bg-black/70 backdrop-blur-md border border-white/20 rounded-full p-2 hover:bg-white/10 transition-all"
              title="Seção anterior"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={skipToNextSection}
              className="bg-black/70 backdrop-blur-md border border-white/20 rounded-full p-2 hover:bg-white/10 transition-all"
              title="Próxima seção"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 z-10 pb-24">
        <div className="mb-8 text-center">
          <h2 className="text-4xl md:text-6xl font-semibold mb-4 text-white" style={{ fontFamily: 'Noto Serif Variable, serif', lineHeight: '1.3' }}>
            <TextMotion trigger={true} stagger={0.05}>
              Nossa História
            </TextMotion>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uma jornada de inovação e aprendizado contínuo.
          </p>
        </div>

        <div ref={yearNavRef} className="mb-2 relative px-4 md:px-6 timeline-year-nav">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/20 -translate-y-1/2" />

          <div className="relative flex justify-between items-center w-full overflow-x-auto pb-8 scrollbar-hide md:overflow-visible">
            {uniqueYears.map((year, i) => {
              const isActive = year === selectedYear;
              return (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`relative flex flex-col items-center gap-4 transition-all duration-300 min-w-[80px] group`}
                >
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 border border-white/40 ${isActive ? 'bg-white scale-150' : 'bg-transparent hover:bg-white/20'}`} />

                  <span className={`text-sm font-mono tracking-wider transition-all duration-300 ${isActive ? 'text-white opacity-100 font-bold' : 'text-muted-foreground opacity-50 group-hover:opacity-80'}`}>
                    {year}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute top-3 w-px h-8 bg-gradient-to-b from-white to-transparent"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedItem.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono uppercase tracking-widest text-white/80 border border-white/10">
                  {selectedItem.category}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <h3 className="text-2xl md:text-4xl font-display font-medium text-white leading-tight">
                {selectedItem.title}
              </h3>

              <p className="text-xl text-muted-foreground leading-relaxed">
                {selectedItem.description}
              </p>

              {selectedItem.detailedContent && (
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedItem.detailedContent.achievements.map((achievement, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-white/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      {achievement}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse" />
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedItem.year + "-icon"}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-3xl backdrop-blur-md flex items-center justify-center shadow-2xl"
              >
                <selectedItem.icon size={80} strokeWidth={1} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
