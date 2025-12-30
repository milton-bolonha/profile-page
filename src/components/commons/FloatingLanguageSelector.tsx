"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { FaGlobe, FaChevronUp } from 'react-icons/fa';

export const FloatingLanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleOpen = () => setIsOpen(!isOpen);

  const languages = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  return (
    <div className="fixed bottom-6 right-24 z-50 flex flex-col items-center gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-3 mb-2"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as 'pt' | 'en');
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 w-full min-w-[140px]
                  ${language === lang.code 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black/80 text-white border-white/20 hover:bg-white/10'
                  }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        className="group relative w-12 h-12 focus:outline-none focus:ring-0 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 blur-lg group-hover:bg-white/30 transition-all duration-500" />
        
        {/* Button content */}
        <div className="relative w-12 h-12 rounded-full border-2 border-white/20 group-hover:border-white bg-black/50 backdrop-blur-sm flex items-center justify-center transition-colors duration-300">
          <FaGlobe className={`text-xl text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </motion.button>
    </div>
  );
};
