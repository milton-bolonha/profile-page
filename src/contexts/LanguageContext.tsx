import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Importar as traduções
import ptTranslations from '../../public/locales/pt/common.json';
import enTranslations from '../../public/locales/en/common.json';

const translations = {
  pt: ptTranslations,
  en: enTranslations,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('pt'); // Default to PT based on user preference usually, but 'en' was default in old code. Let's keep 'pt' as default or 'en'? Old code had 'en'. I will switch to 'pt' if that's the primary audience, but strictly let's keep 'en' to match old behavior or check logic.
  // Actually, allow logic to decide.

  useEffect(() => {
    // Carregar idioma do localStorage apenas no cliente
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage);
      } else {
         // Default fallback could be pt since the content is now heavily PT focused in json?
         // Let's stick to safe default 'pt' for now as the user writes in Portuguese.
         setLanguageState('pt'); 
      }
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string): any => {
    if (!key || typeof key !== 'string') return key || '';
    
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Retorna a chave se não encontrar a tradução
      }
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
