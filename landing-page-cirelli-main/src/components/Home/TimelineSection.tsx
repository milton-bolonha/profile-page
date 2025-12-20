import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import timelineData from '../../../content/data/timeline.json';

export const TimelineSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {timelineData.titleEmoji} {t('home.timeline.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-2 sm:px-0">
            {t('home.timeline.subtitle')}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-8 sm:mb-10 md:mb-12">
          {timelineData.timeline.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start"
            >
              <div className="flex-shrink-0 w-full sm:w-24 pt-1">
                <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 sm:px-3 py-1 rounded-full inline-block">
                  {t(item.dateKey)}
                </span>
              </div>
              <div className="flex-1 pb-2 border-l-2 sm:border-l-2 border-blue-200 dark:border-blue-800 pl-4 sm:pl-6 relative w-full">
                <div className="absolute -left-1.5 sm:-left-2 top-2 w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 dark:bg-blue-400 rounded-full border-2 sm:border-4 border-white dark:border-gray-900"></div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  {t(item.titleKey)}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:gap-3 font-semibold text-base sm:text-lg transition-all duration-200"
          >
            {t('home.timeline.viewAll')}
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

