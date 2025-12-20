import { useLanguage } from '@/contexts/LanguageContext';
import { TextMotion } from '@/components/ui/TextMotion';
import technologiesData from '../../../content/home/technologies.json';

export const TechStack = () => {
  const { t } = useLanguage();

  return (
    <section id="tech" className="relative bg-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full blur-[120px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
            <span className="text-sm font-medium text-white/80 tracking-wide">Stack</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6" style={{ fontFamily: 'Noto Serif Variable, serif', lineHeight: '1.3' }}>
            {technologiesData.titleEmoji}{' '}
            <TextMotion trigger={true} stagger={0.05}>
              {t('home.techStack.title')}
            </TextMotion>
          </h2>
          <p className="text-xl text-white/60 font-light max-w-2xl mx-auto">
            {t('home.techStack.subtitle')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {technologiesData.technologies.map((tech) => (
            <div
              key={tech.id}
              className="group px-6 py-3 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.05]"
            >
              <span className="text-sm text-white/70 group-hover:text-white font-light transition-colors duration-300">
                {t(tech.nameKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
