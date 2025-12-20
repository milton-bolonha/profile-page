import React, { useState, useEffect } from "react";
import { Inicio } from "@/components/Home/Inicio";
import { AboutSection } from "@/components/Home/AboutSection";
import { ServicesSection } from "@/components/Home/ServicesSection";
import { FeaturedProjects } from "@/components/Home/FeaturedProjects";
import { TechStack } from "@/components/Home/TechStack";
import { TimelineSection } from "@/components/Home/TimelineSection"; // Manter compatibilidade se necessário, mas vamos usar o NewTimeline
import NewTimelineSection from "@/components/Home/NewTimelineSection";
import { NewStatsSection } from "@/components/Home/NewStatsSection";
import { FAQSection } from "@/components/Home/FAQSection";
import { CTASection } from "@/components/Home/CTASection";
import { AboutMe as TAboutMe } from "@/types/Home";
import { GetStaticProps } from "next";
import { getSortedPostsData } from "@/lib/posts";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBusinessSettings, getGeneralSettings } from "@/lib/settings";
import { ClientOnly } from "@/components/commons/ClientOnly";
import Seo from "@/components/commons/Seo";
import FloatingBadge from "@/components/Home/FloatingBadge";
import {
  ScrollContainer,
  SectionWrapper,
} from "@/components/commons/SectionWrapper";

import homeData from "../../public/home.json";

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

const HomeContent = ({
  home,
  allPostsData,
  businessSettings,
  generalSettings,
}: HomeProps) => {
  const { t } = useLanguage();

  // Loading state for elegant entrance
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const seoData = {
    title:
      "Guilherme Cirelli — Desenvolvedor Full Stack | Next.js, React, Node.js",
    description:
      "Desenvolvedor Full Stack especializado em Next.js, React e Node.js. Criação de aplicações web modernas, responsivas e escaláveis. Veja meu portfolio e entre em contato.",
    siteUrl: generalSettings.siteUrl,
    slug: "/",
    author: "Guilherme Cirelli",
    keywords: [
      "desenvolvedor full stack",
      "next.js",
      "react",
      "node.js",
      "typescript",
      "desenvolvimento web",
    ],
    featuredImage: `${generalSettings.siteUrl}/img/og-image.jpg`,
    topology: "page" as const,
  };

  return (
    <>
      <Seo data={seoData} />
      <ScrollContainer>
        {/* Elegant loading overlay */}
        {!isLoaded && (
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60 text-sm">
                Carregando experiência premium...
              </p>
            </div>
          </div>
        )}

        <div
          className={`transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Hero Section */}
          <SectionWrapper id="inicio" vPadding="py-0" fullHeight>
            <Inicio />
          </SectionWrapper>

          {/* About Section */}
          <SectionWrapper id="sobre" vPadding="py-24 lg:py-32">
            <AboutSection />
          </SectionWrapper>

          {/* Services Section */}
          <SectionWrapper id="servicos" vPadding="py-24 lg:py-32">
            <ServicesSection />
          </SectionWrapper>

          {/* Featured Projects */}
          <SectionWrapper id="projetos" vPadding="py-24 lg:py-32">
            <FeaturedProjects />
          </SectionWrapper>

          {/* Tech Stack */}
          <SectionWrapper id="tecnologias" vPadding="py-24 lg:py-32">
            <TechStack />
          </SectionWrapper>

          {/* Timeline Section */}
          <SectionWrapper id="historia" vPadding="py-24 lg:py-32">
            <NewTimelineSection />
          </SectionWrapper>

          {/* New Stats Section */}
          <SectionWrapper id="stats" vPadding="py-24 lg:py-32">
            <NewStatsSection />
          </SectionWrapper>

          {/* FAQ Section */}
          <SectionWrapper id="faq" vPadding="py-24 lg:py-32">
            <FAQSection />
          </SectionWrapper>

          {/* CTA Final */}
          <SectionWrapper id="contato" vPadding="py-24 lg:py-32">
            <CTASection />
          </SectionWrapper>

          {/* Badge flutuante */}
          {/* <FloatingBadge />  */}
        </div>
      </ScrollContainer>
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
