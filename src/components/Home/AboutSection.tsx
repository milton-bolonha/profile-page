import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import { trackEvent } from '@/lib/analytics';
import { TextMotion } from '@/components/ui/TextMotion';
import aboutData from '../../../content/home/about.json';

export const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left: Image */}
          <div className="order-2 lg:order-1">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-3xl blur-2xl group-hover:bg-white/10 transition-all duration-500" />
              <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10">
                <Image
                  src={aboutData.about.photo.url}
                  alt={aboutData.about.photo.alt}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div>
              <div className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
                <span className="text-sm font-medium text-white/80 tracking-wide">Sobre Mim</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6 leading-tight" style={{ fontFamily: 'Noto Serif Variable, serif', lineHeight: '1.3' }}>
                <TextMotion trigger={true} stagger={0.05}>
                  {t('home.about.title')}
                </TextMotion>
              </h2>
            </div>
            
            <div className="space-y-4 text-lg text-white/70 font-light leading-relaxed">
              {t('home.about.description').split('\n').map((paragraph: string, idx: number) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <Link
              href="/sobre"
              onClick={() => trackEvent('click', 'CTA', 'Learn More - About')}
              className="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium group transition-all duration-300"
            >
              <span className="relative">
                Saiba mais
                <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
              </span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
