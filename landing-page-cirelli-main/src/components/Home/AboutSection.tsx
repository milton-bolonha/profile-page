import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { trackEvent } from '@/lib/analytics';
import aboutData from '../../../content/data/about.json';

export const AboutSection = () => {
  const { t } = useLanguage();
  const { photo, link } = aboutData.about;

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <Image
              src={photo.url}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-none"
            />
          </div>
          <div className="w-full md:w-2/3 text-center md:text-left">
            <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t('home.about.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
              {t('home.about.description')}
            </p>
            <Link
              href={link}
              onClick={() => trackEvent('click', 'CTA', 'About - Home')}
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:gap-3 font-semibold text-base sm:text-lg transition-all duration-200"
            >
              {t('home.about.cta')}
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

