"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'hero', label: 'Início' },
  { id: 'about', label: 'Sobre' },
  { id: 'services', label: 'Serviços' },
  { id: 'projects', label: 'Projetos' },
  { id: 'tech', label: 'Stack' },
  { id: 'timeline', label: 'História' },
  { id: 'stats', label: 'Números' },
  { id: 'faq', label: 'FAQ' },
  { id: 'cta', label: 'Contato' },
];

export const SectionNavigator = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-4">
      {/* Section markers */}
      <div className="flex flex-col gap-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-3 w-12">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group relative flex items-center justify-center cursor-pointer"
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-white scale-150'
                  : 'bg-white/30 hover:bg-white/60'
              }`}
            />
            
            <span className="absolute right-full mr-3 px-3 py-1 bg-black/90 border border-white/20 rounded-full text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {section.label}
            </span>
          </button>
        ))}
      </div>

      {/* Scroll to top - SAME WIDTH */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={scrollToTop}
          className="group relative bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-3 w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-all"
          title="Scroll to top"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          
          <span className="absolute right-full mr-3 px-3 py-1 bg-black/90 border border-white/20 rounded-full text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Scroll to top
          </span>
        </motion.button>
      )}
    </div>
  );
};
