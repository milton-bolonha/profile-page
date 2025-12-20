import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { trackEvent } from '@/lib/analytics';
import featuredProjectsData from '../../../content/data/featuredProjects.json';

export const FeaturedProjects = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {featuredProjectsData.titleEmoji} {t('home.projects.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 px-2 sm:px-0">
            {t('home.projects.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          {featuredProjectsData.projects.map((project) => (
            <Link
              key={project.id}
              href={project.link}
              onClick={() => trackEvent('click', 'Project Card', `Project ${project.id} - Home`)}
              className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                {project.thumbnail ? (
                  <Image
                    src={project.thumbnail}
                    alt={project.title || `Project ${project.id}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-4xl sm:text-5xl md:text-6xl font-bold opacity-20">
                      {project.id}
                    </span>
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full z-10">
                    ⭐ {t('projects.featuredBadge')}
                  </span>
                )}
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title || `${t(project.titleKey)} ${project.id}`}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                  {t(project.descriptionKey)}
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.techs.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/projetos"
            onClick={() => trackEvent('click', 'CTA', 'View All Projects - Home')}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            {t('home.projects.viewAll')} →
          </Link>
        </div>
      </div>
    </section>
  );
};

