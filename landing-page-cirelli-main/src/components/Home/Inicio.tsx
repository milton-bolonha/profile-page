import { OptimizedImage } from '@/components/commons/OptimizedImage';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackEvent } from '@/lib/analytics';
import heroData from '../../../content/data/hero.json';

export const Inicio = () => {
  const { t } = useLanguage();
  const { badge, photo } = heroData.hero;

  return (
    <section className="flex py-6 xs:py-8 sm:py-10 md:py-12 lg:py-14 overflow-hidden lg:items-center lg:min-h-[85vh] xl:min-h-[90vh] bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 w-full">
        <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 py-4 xs:py-5 sm:py-6 md:py-8 lg:py-0">
          {/* Photo - First on mobile and desktop */}
          <div className="w-full flex justify-center mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:w-auto lg:order-2 lg:mb-0">
            <div className="relative w-[120px] h-[120px] xs:w-[140px] xs:h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] lg:w-[280px] lg:h-[280px] xl:w-[350px] xl:h-[350px] 2xl:w-[400px] 2xl:h-[400px]">
              <div className="w-full h-full relative">
                <OptimizedImage
                  src={photo.url}
                  alt={photo.alt}
                  width={180}
                  height={180}
                  className="rounded-full shadow-2xl ring-1 xs:ring-2 sm:ring-3 md:ring-4 lg:ring-6 xl:ring-8 ring-blue-100 dark:ring-blue-900 object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Content - Second on mobile */}
          <div className="flex-1 text-center lg:text-left lg:order-1 w-full">
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-gray-900 dark:text-white mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight">
              <span className="block text-gray-600 dark:text-gray-300 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium mb-0.5 xs:mb-1 sm:mb-1.5 md:mb-2">
                {t('home.title')}
              </span>
              <strong className="text-blue-600 dark:text-blue-400">
                {t('home.titleBold')}
              </strong>
            </h1>

            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 dark:text-gray-300 mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 px-2 xs:px-3 sm:px-0">
              {t('home.subtitle')}
            </p>

            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 justify-center lg:justify-start mb-4 xs:mb-5 sm:mb-6 md:mb-8 px-2 xs:px-3 sm:px-0">
              <Link
                href="/contato"
                onClick={() => trackEvent('click', 'CTA', 'Lets Talk - Hero')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 xs:py-3 sm:py-3.5 md:py-4 px-5 xs:px-6 sm:px-7 md:px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs xs:text-sm sm:text-base md:text-lg text-center w-full xs:w-auto"
              >
                {t('cta.letsTalk')} →
              </Link>
              <Link
                href="/projetos"
                onClick={() => trackEvent('click', 'CTA', 'View Projects - Hero')}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-2.5 xs:py-3 sm:py-3.5 md:py-4 px-5 xs:px-6 sm:px-7 md:px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-xs xs:text-sm sm:text-base md:text-lg text-center w-full xs:w-auto"
              >
                {t('cta.viewProjects')}
              </Link>
            </div>

            <div className="inline-flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 px-3 xs:px-4 sm:px-5 md:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              {badge.icon && <span className="text-lg xs:text-xl sm:text-2xl md:text-3xl">{badge.icon}</span>}
              <div className="text-left">
                <p className="text-[10px] xs:text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-100">
                  {t(badge.textKey)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
