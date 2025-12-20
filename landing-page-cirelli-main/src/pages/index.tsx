import { Inicio } from '@/components/Home/Inicio';
import { ServicesSection } from '@/components/Home/ServicesSection';
import { FeaturedProjects } from '@/components/Home/FeaturedProjects';
import { TechStack } from '@/components/Home/TechStack';
import { TimelineSection } from '@/components/Home/TimelineSection';
import { CTASection } from '@/components/Home/CTASection';
import { Project, AboutMe as TAboutMe } from '@/types/Home';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getSortedPostsData, PostData } from '@/lib/posts';
import { useUser } from "@clerk/nextjs";
import { useLanguage } from '@/contexts/LanguageContext';
import { getBusinessSettings, getGeneralSettings } from '@/lib/settings';

import homeData from '../../public/home.json';

interface HomeProps {
  home: {
    aboutMe: TAboutMe;
  };
  allPostsData: Array<{
    slug: string;
    title: string;
    date: string;
    author: string;
    public: boolean;
  }>;
  businessSettings: any;
  generalSettings: any;
}

const Home = ({ home, allPostsData, businessSettings, generalSettings }: HomeProps) => {
  const { aboutMe } = home || { aboutMe: {} as TAboutMe };
  const { t, language } = useLanguage();
  const { isSignedIn } = useUser(); // Usar o hook useUser

  const metaTitle = language === 'pt'
    ? 'Guilherme Cirelli — Desenvolvedor Full Stack | Next.js, React, Node.js'
    : 'Guilherme Cirelli — Full Stack Developer | Next.js, React, Node.js';

  const metaDescription = language === 'pt'
    ? 'Desenvolvedor Full Stack especializado em Next.js, React e Node.js. Criação de aplicações web modernas, responsivas e escaláveis. Veja meu portfólio e entre em contato.'
    : 'Full Stack Developer specialized in Next.js, React, and Node.js. Building modern, responsive, and scalable web applications. Explore my portfolio and get in touch.';

  const metaKeywords = language === 'pt'
    ? 'desenvolvedor full stack, next.js, react, node.js, typescript, desenvolvimento web'
    : 'full stack developer, next.js, react, node.js, typescript, web development';

  const ogImageAlt = language === 'pt'
    ? 'Portfolio Guilherme Cirelli - Desenvolvedor Full Stack'
    : 'Guilherme Cirelli Portfolio - Full Stack Developer';

  const structuredDataJobTitle = language === 'pt' ? 'Desenvolvedor Full Stack' : 'Full Stack Developer';
  const structuredDataWebsiteDescription = language === 'pt'
    ? 'Portfólio profissional de Guilherme Cirelli, desenvolvedor Full Stack especializado em Next.js, React e Node.js'
    : 'Professional portfolio of Guilherme Cirelli, Full Stack developer specialized in Next.js, React and Node.js';
  const structuredDataLanguage = language === 'pt' ? 'pt-BR' : 'en-US';

  return (
    <>
      <Head>
        {/* SEO básico */}
        <title>{metaTitle}</title>
        <meta
          name="description"
          content={metaDescription}
        />
        <meta name="keywords" content={metaKeywords} />
        <link rel="canonical" href={generalSettings.siteUrl} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={generalSettings.siteUrl} />
        <meta property="og:image" content={`${generalSettings.siteUrl}/img/og-image.jpg`} />
        <meta property="og:image:alt" content={ogImageAlt} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={`${generalSettings.siteUrl}/img/twitter-image.jpg`} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "name": "Guilherme Cirelli",
                  "jobTitle": structuredDataJobTitle,
                  "url": generalSettings.siteUrl,
                  "image": `${generalSettings.siteUrl}/img/perfil.jpeg`,
                  "sameAs": [
                    "https://github.com/seu-github",
                    "https://linkedin.com/in/seu-linkedin"
                  ],
                  "knowsAbout": [
                    "Next.js",
                    "React",
                    "Node.js",
                    "TypeScript",
                    language === 'pt' ? 'Desenvolvimento Web Full Stack' : 'Full Stack Web Development'
                  ]
                },
                {
                  "@type": "WebSite",
                  "name": "Portfolio Guilherme Cirelli",
                  "url": generalSettings.siteUrl,
                  "description": structuredDataWebsiteDescription,
                  "inLanguage": structuredDataLanguage
                }
              ]
            })
          }}
        />
      </Head>
      <div className="w-full">
        {/* Hero Section */}
        <Inicio />

        {/* Tech Stack */}
        <TechStack />

        {/* Featured Projects */}
        <FeaturedProjects />

        {/* Services Section */}
        <ServicesSection />

        {/* Timeline Section */}
        <TimelineSection />

        {/* CTA Final */}
        <CTASection />
      </div>
    </>
  );
};

const loadHome = async () => {
  return homeData;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const home = await loadHome();
  const allPostsData = getSortedPostsData(); // Buscar dados dos posts
  const businessSettings = getBusinessSettings();
  const generalSettings = getGeneralSettings();

  return {
    props: { 
      home,
      allPostsData,
      businessSettings,
      generalSettings,
    },
  };
};

export default Home;
