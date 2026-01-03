import { useLanguage } from '@/contexts/LanguageContext';
import statsData from '../../../content/home/stats.json';

export const StatsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          {t('home.stats.title')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.statsSection.items.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">
                {stat.label}
              </div>
              {(stat.sublabel || stat.info) && (
                <div className="text-sm text-gray-500 mt-1">
                  {stat.sublabel || stat.info}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

