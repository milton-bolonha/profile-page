import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import servicesData from '../../../content/data/services.json';

export const ServicesSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
      {/* Decoração de fundo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10"></div>
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {t('home.services.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2 sm:px-0">
            {t('home.services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {servicesData.services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-900 p-6 sm:p-7 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {service.icon && <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{service.icon}</div>}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                {t(service.titleKey)}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                {t(service.descriptionKey)}
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {service.techs.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 text-xs sm:text-sm rounded-full font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <Link
            href="/sobre"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            {t('home.services.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
};

