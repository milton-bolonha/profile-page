import { Inicio } from '@/components/Home/Inicio';
import { AboutSection } from '@/components/Home/AboutSection';
import { ServicesSection } from '@/components/Home/ServicesSection';
import { FeaturedProjects } from '@/components/Home/FeaturedProjects';
import { TechStack } from '@/components/Home/TechStack';
import { TimelineSection } from '@/components/Home/TimelineSection'; // Manter compatibilidade se necessário, mas vamos usar o NewTimeline
import NewTimelineSection from '@/components/Home/NewTimelineSection';
import { NewStatsSection } from '@/components/Home/NewStatsSection';
import { FAQSection } from '@/components/Home/FAQSection';
import { CTASection } from '@/components/Home/CTASection';
import { AboutMe as TAboutMe } from '@/types/Home';
import { GetStaticProps } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBusinessSettings, getGeneralSettings } from '@/lib/settings';
import { ClientOnly } from '@/components/commons/ClientOnly';
import Seo from '@/components/commons/Seo';
import FloatingBadge from "@/components/Home/FloatingBadge";

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

const HomeContent = ({ home, allPostsData, businessSettings, generalSettings }: HomeProps) => {
  const { t } = useLanguage();

  const seoData = {
    title: "Guilherme Cirelli — Desenvolvedor Full Stack | Next.js, React, Node.js",
    description: "Desenvolvedor Full Stack especializado em Next.js, React e Node.js. Criação de aplicações web modernas, responsivas e escaláveis. Veja meu portfolio e entre em contato.",
    siteUrl: generalSettings.siteUrl,
    slug: "/",
    author: "Guilherme Cirelli",
    keywords: ["desenvolvedor full stack", "next.js", "react", "node.js", "typescript", "desenvolvimento web"],
    featuredImage: `${generalSettings.siteUrl}/img/og-image.jpg`,
    topology: 'page' as const
  };

  return (
    <>
      <Seo data={seoData} />
      <div className="w-full">
        {/* Hero Section */}
        <Inicio />

        {/* New Stats Section */}
        <NewStatsSection />

        {/* Services Section */}
        <ServicesSection />

        {/* About Section */}
        <AboutSection />

        {/* Featured Projects */}
        <FeaturedProjects />

        {/* Tech Stack */}
        <TechStack />

        {/* Timeline Section */}
        <NewTimelineSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Final */}
        <CTASection />

        {/* Badge flutuante */}
        <FloatingBadge />
      </div>
    </>
  );
};

const Home = (props: HomeProps) => {
  return (
    <ClientOnly>
      <HomeContent {...props} />
    </ClientOnly>
  );
};

const loadHome = async () => {
  return homeData;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const home = await loadHome();
  const allPostsData = getSortedPostsData();
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
