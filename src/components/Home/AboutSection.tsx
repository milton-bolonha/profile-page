import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { OptimizedImage } from '@/components/commons/OptimizedImage';
import { trackEvent } from '@/lib/analytics';
import { TextMotion } from '@/components/ui/TextMotion';
import aboutData from '../../../content/home/about.json';
import { GridBackground } from "@/components/commons/GridBackground";

export const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <div className="relative w-full h-full min-h-screen flex items-center">
      <GridBackground inverted={true} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left: Image */}
          <div className="order-2 lg:order-1">
            <div className="relative max-w-sm mx-auto lg:mx-0">
              <div className="relative aspect-[3/4] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-black md:rounded-2xl">
                <OptimizedImage
                  src={aboutData.about.photo.url}
                  alt={aboutData.about.photo.alt}
                  fill
                  className="object-contain"
                  cubeFrame={true}
                  enableFlip={true}
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
    </div>
  );
};