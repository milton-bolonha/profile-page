import React, { useState, useEffect } from "react";
import { FaGamepad, FaCode, FaChalkboardTeacher, FaExpand, FaBriefcase } from "react-icons/fa";
import { Inicio } from "@/components/Home/Inicio";
import { AboutSection } from "@/components/Home/AboutSection";
import { ServicesSection } from "@/components/Home/ServicesSection";
import { FeaturedProjects } from "@/components/Home/FeaturedProjects";
import { TechStack } from "@/components/Home/TechStack";
// import { TimelineSection } from "@/components/Home/TimelineSection"; // Manter compatibilidade se necessário, mas vamos usar o NewTimeline
import NewTimelineSection from "@/components/Home/NewTimelineSection";
import { NewStatsSection } from "@/components/Home/NewStatsSection";
import { FAQSection } from "@/components/Home/FAQSection";
import { CTASection } from "@/components/Home/CTASection";
import ContactSection from "@/components/Home/ContactSection";
import ExperienceShowcase from "@/components/Home/ExperienceShowcase";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import { AboutMe as TAboutMe } from "@/types/Home";
import { GetStaticProps } from "next";
import { getSortedPostsData } from "@/lib/posts";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBusinessSettings, getGeneralSettings, getNavigatorSettings, getThemeSettings } from "@/lib/settings";
import NeonFlightGame from "@/components/games/fly/components/NeonFlightGame";
import BoilerplateGame from "@/components/games/fly/components/BoilerplateGame";
import TheBeeBoilerplate from "@/components/games/TheBeeBoilerplate";
import { ClientOnly } from "@/components/commons/ClientOnly";
import MagneticButton from "@/components/ui/MagneticButton";
import Seo from "@/components/commons/Seo";
import FloatingNavigator from "@/components/commons/FloatingNavigator";
// import FloatingBadge from "@/components/Home/FloatingBadge";
import {
  ScrollContainer,
  SectionWrapper,
} from "@/components/commons/SectionWrapper";
import { SlideshowLayout } from "@/components/layouts/SlideshowLayout";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  navigatorSettings: any;
  themeSettings: any;
}

const HomeContent = ({
  home,
  allPostsData,
  businessSettings,
  generalSettings,
  navigatorSettings,
  themeSettings
}: HomeProps) => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Detecção de Mobile para forçar layout vertical
  const isMobile = useMediaQuery("(max-width: 768px)");
  const themeLayout = themeSettings?.generalThemeSettings?.layoutMode || 'vertical';
  
  // Se for mobile, força vertical. Se não, respeita o tema.
  const layoutMode = isMobile ? 'vertical' : themeLayout;

  // Section IDs in order for slideshow mapping
  const sections = [
    'inicio',
    'stats',
    'o-que-faco',
    'sobre',
    'projetos',
    'tecnologias',
    'historia',
    'showcase-demo',
    'testimonials',
    'faq',
    'contato',
    'cta'
  ];
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const seoData = {
    title:
      "Milton Bolonha — Desenvolvedor Full Stack | Next.js, React, Node.js",
    description:
      "Desenvolvedor Full Stack especializado em Next.js, React e Node.js. Criação de aplicações web modernas, responsivas e escaláveis. Veja meu portfolio e entre em contato.",
    siteUrl: generalSettings.siteUrl,
    slug: "/",
    author: "Milton Bolonha",
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

        {/* Floating Navigator */}
        <FloatingNavigator 
          config={navigatorSettings} 
          mode={layoutMode}
          currentSlide={currentSlide}
          onNavigate={(index) => setCurrentSlide(index)}
          sections={sections}
        />
        
        <div
          className={`transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <SlideshowLayout
            mode={layoutMode}
            currentSlide={currentSlide}
            onSlideChange={setCurrentSlide}
          >
            {/* Hero Section */}
            <SectionWrapper id="inicio" vPadding="py-0" fullHeight>
              <Inicio />
            </SectionWrapper>

    {/* Neon Flight Game */}
    {/* <SectionWrapper id="game" vPadding="py-0" fullHeight>
         <ClientOnly>
           <NeonFlightGame />
         </ClientOnly>
       </SectionWrapper> */}
  
    {/* TEMPORARY: Boilerplate Game */}
    {/* <SectionWrapper id="boilerplate" vPadding="py-0" fullHeight>
      <ClientOnly>
        <BoilerplateGame />
      </ClientOnly>
    </SectionWrapper> */}
  
    {/* TEMPORARY: The Bee Boilerplate */}
    {/* <SectionWrapper id="bee-boilerplate" vPadding="py-0" fullHeight>
      <ClientOnly>
        <TheBeeBoilerplate />
      </ClientOnly>
    </SectionWrapper> */}
  
            {/* New Stats Section */}
            <SectionWrapper id="stats" vPadding="py-4">
              <NewStatsSection />
            </SectionWrapper>
  
    {/* Experience / Showcase Section */}
            <SectionWrapper id="o-que-faco" vPadding="py-4" className="relative flex flex-col items-center justify-center overflow-hidden w-full">
              <ClientOnly>
                <ExperienceShowcase
                  badge="+20 Anos de Experiência"
                  title="Transformando Sonhos em Realidade"
                  description="Explorei as minhas diferentes facetas profissionais ao longo de mais de 20 anos de carreira. Dos mundos dos jogos à aplicações web integrada com I.A. e mentoria especializada."
                  tabs={[
                    {
                      id: 'game',
                      label: '3D & Game Dev',
                      icon: FaGamepad,
                      content: {
                        type: 'slideshow',
                        slides: [
                          { bg: "/img/fly-1-a.jpg", fg: "/img/fly-1-b.jpg" },
                          { bg: "/img/fly-2-a.jpg", fg: "/img/fly-2-b.jpg" },
                          { bg: "/img/fly-3-a.jpg", fg: "/img/fly-3-b.jpg" },
                        ],
  
                        buttons: [
                          {
                            text: 'JOGAR DEMO',
                            variant: 'primary',
                            onClick: () => {
                              const gameSection = document.querySelector('[data-game-active]');
                              if (gameSection) {
                                gameSection.setAttribute('data-game-active', 'true');
                              }
                            },
                          },
                          {
                            text: 'VER TODOS JOGOS',
                            link: '/games/airplane',
                            variant: 'secondary',
                            icon: FaExpand,
                          },
                        ],
                      },
                    },
                    {
                      id: 'web',
                      label: 'Web Dev',
                      icon: FaCode,
                      content: {
                        type: 'placeholder',
                        placeholderIcon: FaCode,
                        placeholderTitle: 'Web Development Mastery',
                        placeholderDescription: 'Em breve: Showcase de aplicações Next.js, Dashboards SaaS e Arquitetura Escalável.',
                      },
                    },
                    {
                      id: 'mentor',
                      label: 'Mentor',
                      icon: FaChalkboardTeacher,
                      content: {
                        type: 'placeholder',
                        placeholderIcon: FaChalkboardTeacher,
                        placeholderTitle: 'Mentoria Tech & Carreira',
                        placeholderDescription: 'Em breve: Detalhes sobre programas de mentoria, code reviews e workshops.',
                      },
                    },
                  ]}
                  defaultTab="game"
                />
              </ClientOnly>
            </SectionWrapper>
  
          
  
            {/* About Section */}
            <SectionWrapper id="sobre" vPadding="py-4">
              <AboutSection />
            </SectionWrapper>
  
            {/* Services Section */}
            {/* <SectionWrapper id="servicos" vPadding="py-12 lg:py-20">
              <ServicesSection />
            </SectionWrapper> */}
  
            {/* Featured Projects */}
            <SectionWrapper id="projetos" vPadding="py-4">
              <FeaturedProjects />
            </SectionWrapper>
  
            {/* Tech Stack */}
            <SectionWrapper id="tecnologias" vPadding="py-4">
              <TechStack />
            </SectionWrapper>
  
            {/* Timeline Section */}
            <SectionWrapper id="historia" vPadding="py-4">
              <NewTimelineSection />
            </SectionWrapper>
    {/* Second Experience Showcase Instance - Demo */}
            <SectionWrapper id="showcase-demo" vPadding="py-4" className="relative flex flex-col items-center justify-center overflow-hidden">
              <ClientOnly>
                <ExperienceShowcase
                  badge="Demonstração de Reutilização"
                  title="Componente Totalmente Configurável"
                  description="Esta é uma segunda instância do mesmo componente, demonstrando sua total reutilização com conteúdo, imagens e configurações completamente diferentes."
                  tabs={[
                    {
                      id: 'portfolio',
                      label: 'Portfolio',
                      icon: FaBriefcase,
                      content: {
                        type: 'slideshow',
                        slides: [
                          { bg: "/img/fly-2-a.jpg", fg: "/img/fly-3-b.jpg" },
                          { bg: "/img/fly-3-a.jpg", fg: "/img/fly-1-b.jpg" },
                        ],
  
                        buttons: [
                          {
                            text: 'VER PROJETOS',
                            link: '/projetos',
                            variant: 'primary',
                          },
                        ],
                      },
                    },
                    {
                      id: 'blog',
                      label: 'Blog',
                      icon: FaCode,
                      content: {
                        type: 'placeholder',
                        placeholderIcon: FaCode,
                        placeholderTitle: 'Blog Técnico',
                        placeholderDescription: 'Artigos sobre desenvolvimento, arquitetura de software e boas práticas.',
                      },
                    },
                  ]}
                  defaultTab="portfolio"
                />
              </ClientOnly>
            </SectionWrapper>
            
            {/* Testimonials Section */}
            <SectionWrapper id="testimonials" vPadding="py-4">
               <TestimonialsSection />
            </SectionWrapper>
            {/* FAQ Section */}
            <SectionWrapper id="faq" vPadding="py-4">
              <FAQSection />
            </SectionWrapper>
  
            {/* Contact Section */}
            <SectionWrapper id="contato" vPadding="py-4">
              <ContactSection 
                contacts={[
                  {
                    name: "LinkedIn",
                    link: "https://www.linkedin.com/in/miltonbolonha/",
                  },
                  {
                    name: "GitHub",
                    link: "https://github.com/miltonbolonha",
                  },
                  {
                    name: "Email",
                    link: "contato@miltonbolonha.com.br",
                    isMail: true,
                  },
                  {
                    name: "Baixar Currículo",
                    link: "/files/Curriculo 02072025.pdf",
                    isDownload: true,
                  },
                ]}
                title="Entre em Contato"
                formTitle="Envie uma Mensagem"
              />
            </SectionWrapper>
  
            {/* CTA Final */}
            <SectionWrapper id="cta" vPadding="py-4">
              <CTASection />
            </SectionWrapper>
          </SlideshowLayout>
  
            {/* Badge flutuante */}
            {/* <FloatingBadge />  */}
          </div>
  
          {/* Floating Navigator 
          <FloatingNavigator /> Moved up */}
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
  const navigatorSettings = getNavigatorSettings();
  const themeSettings = getThemeSettings();

  return {
    props: {
      home,
      allPostsData,
      businessSettings,
      generalSettings,
      navigatorSettings,
      themeSettings,
    },
  };
};

export default Home;
