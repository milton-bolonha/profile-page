import { useLanguage } from '@/contexts/LanguageContext';
import technologiesData from '../../../content/data/technologies.json';

export const TechStack = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/20 to-transparent dark:via-blue-900/10"></div>
      
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-5 md:mb-6">
            {technologiesData.titleEmoji} {t('home.techStack.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2 sm:px-0">
            {t('home.techStack.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {technologiesData.technologies.map((tech, index) => (
            <div
              key={tech.id}
              className="group relative px-3 sm:px-4 py-4 sm:py-5 rounded-xl text-center font-semibold text-xs xs:text-sm sm:text-base bg-white dark:bg-white text-gray-900 dark:text-gray-900 hover:shadow-2xl hover:-translate-y-3 hover:scale-105 transition-all duration-500 cursor-default overflow-hidden shadow-lg animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                opacity: 0
              }}
            >
              {/* Efeito de brilho sutil no hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:via-blue-50/30 group-hover:to-purple-50/50 transition-all duration-500 rounded-xl pointer-events-none"></div>
              
              {/* Borda sutil que aparece no hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-300 transition-all duration-500 pointer-events-none"></div>
              
              {/* Conteúdo */}
              <span className="relative z-10 block transform group-hover:scale-105 transition-transform duration-300">
                {t(tech.nameKey)}
              </span>
              
              {/* Efeito de brilho animado no canto */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:to-purple-400/10 rounded-full blur-2xl transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

