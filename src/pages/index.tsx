import React, { useState, useEffect } from "react";
import { FaGamepad, FaCode, FaChalkboardTeacher, FaExpand } from "react-icons/fa";
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
import { AboutMe as TAboutMe } from "@/types/Home";
import { GetStaticProps } from "next";
import { getSortedPostsData } from "@/lib/posts";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBusinessSettings, getGeneralSettings } from "@/lib/settings";
import NeonFlightGame from "@/components/games/fly/components/NeonFlightGame";
import { ClientOnly } from "@/components/commons/ClientOnly";
import MagneticButton from "@/components/ui/MagneticButton";
import Seo from "@/components/commons/Seo";
// import FloatingBadge from "@/components/Home/FloatingBadge";
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

  // Game & Slideshow Logic
  const [activeTab, setActiveTab] = useState<'game' | 'web' | 'mentor'>('game');
  const [isGameActive, setIsGameActive] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const slides = [
    { bg: "/img/fly-1-a.jpg", fg: "/img/fly-1-b.jpg" },
    { bg: "/img/fly-2-a.jpg", fg: "/img/fly-2-b.jpg" },
    { bg: "/img/fly-3-a.jpg", fg: "/img/fly-3-b.jpg" },
  ];

  // Handle Page Visibility to prevent animation stacking
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === 'visible');
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Slideshow Interval (Pauses if game active or page hidden or tab not game)
  useEffect(() => {
    if (isGameActive || !isPageVisible || activeTab !== 'game') return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isGameActive, isPageVisible, activeTab]);

  const tabs = [
    { id: 'game', label: 'Game Dev', icon: FaGamepad },
    { id: 'web', label: 'Web Dev', icon: FaCode },
    { id: 'mentor', label: 'Mentor', icon: FaChalkboardTeacher },
  ];

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

  {/* Neon Flight Game */}


          {/* Experience / Showcase Section */}
          <SectionWrapper id="o-que-faco" vPadding="pb-14 pt-48" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
             
             {/* HEADER & TABS CONTAINER */}
             <div className="relative z-30 max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6">
                  <span className="text-sm font-medium text-white/80 tracking-wide uppercase">
                    Experiência Imersiva
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl text-white font-semibold mb-4" style={{ fontFamily: 'Noto Serif Variable, serif' }}>
                  Escolha sua Dimensão
                </h2>
                
                {/* Paragraph */}
                <p className="text-lg text-white/60 font-normal max-w-2xl mx-auto leading-relaxed mb-10">
                  Explore minhas diferentes facetas profissionais. De mundos virtuais a aplicações web robustas e mentoria especializada.
                </p>

                {/* Tabs / Selectors */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id as 'game' | 'web' | 'mentor');
                            setIsGameActive(false); 
                        }}
                        className={`
                            px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-3 cursor-pointer border
                            ${activeTab === tab.id 
                            ? 'bg-white text-black border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                            : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30'}
                        `}
                        >
                        <Icon className="text-lg" />
                        <span className="tracking-wide uppercase text-sm font-semibold pt-[2px]">{tab.label}</span>
                        </button>
                    )
                  })}
                </div>
             </div>

             {/* CONTENT AREA */}
             <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-[600px] -mt-[100px]">
                
                {/* GAME DEV CONTENT */}
                {activeTab === 'game' && (
                  <div className="w-full h-full absolute inset-0">
                    {!isGameActive ? (
                        /* Full Width Container - No Border, No Rounding */
                        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                            {/* SLIDESHOW LAYER */}
                            {slides.map((slide, index) => (
                                <div 
                                key={index} 
                                className={`absolute w-full h-full transition-opacity duration-[2000ms] ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                                style={{ pointerEvents: 'none' }}
                                >
                                    {/* Background Image (Blurred & Darkened) */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
                                        style={{ 
                                            backgroundImage: `url(${slide.bg})`, 
                                            filter: 'brightness(0.3) blur(8px)',
                                        }}
                                    />
                                    
                                    {/* Central Box Image (Sharp & Glowing) */}
                                    <div className="absolute inset-20 flex items-center justify-center">
                                        {/* Reduced Height for Central Image as requested */}
                                        <div className="w-[85%] h-[200px] relative border border-white/10 shadow-[0_0_50px_rgba(0,255,255,0.15)] overflow-hidden rounded-xl">
                                            <div 
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{ 
                                                    backgroundImage: `url(${slide.fg})`,
                                                    transition: 'transform 6s ease-out',
                                                    transform: currentSlide === index ? 'scale(1.05)' : 'scale(1.0)' 
                                                }}
                                            ></div>
                                            {/* Vignette */}
                                            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 opacity-60"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* CONTENT LAYER */}
                            <div className="relative z-20 mt-32 md:mt-48 flex flex-col sm:flex-row gap-6">
                                <MagneticButton
                                    onClick={() => setIsGameActive(true)}
                                    className="group relative inline-flex items-center gap-3 bg-white text-black hover:bg-white/90 font-medium py-4 px-8 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] cursor-pointer"
                                >
                                    <span className="relative z-10 tracking-widest text-sm font-bold">PREVIEW MISSION</span>
                                    <svg className="w-4 h-4 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </MagneticButton>

                                <MagneticButton
                                    onClick={() => window.open('/games/airplane', '_blank')}
                                    className="inline-flex items-center  gap-3 bg-black/10 backdrop-blur-md text-white font-medium py-4 px-8 rounded-full border border-white transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                                >
                                    <span className="tracking-widest text-sm font-bold">PLAY FULLSCREEN</span>
                                    <FaExpand className="w-4 h-4 text-white" />
                                </MagneticButton>
                            </div>
                        </div>
                    ) : (
                        <NeonFlightGame onExit={() => setIsGameActive(false)} />
                    )}
                  </div>
                )}

                {/* WEB DEV PLACEHOLDER */}
                {activeTab === 'web' && (
                  <div className="w-full h-full flex items-center justify-center p-8 min-h-[500px]">
                     <div className="text-center p-12 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm max-w-2xl w-full">
                        <FaCode className="text-6xl mb-6 mx-auto opacity-50 block" />
                        <h3 className="text-3xl font-bold text-white mb-4">Web Development Mastery</h3>
                        <p className="text-white/60">Em breve: Showcase de aplicações Next.js, Dashboards SaaS e Arquitetura Escalável.</p>
                     </div>
                  </div>
                )}

                {/* MENTOR PLACEHOLDER */}
                {activeTab === 'mentor' && (
                  <div className="w-full h-full flex items-center justify-center p-8 min-h-[500px]">
                     <div className="text-center p-12 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm max-w-2xl w-full">
                        <FaChalkboardTeacher className="text-6xl mb-6 mx-auto opacity-50 block" />
                        <h3 className="text-3xl font-bold text-white mb-4">Mentoria Tech & Carreira</h3>
                        <p className="text-white/60">Em breve: Detalhes sobre programas de mentoria, code reviews e workshops.</p>
                     </div>
                  </div>
                )}

             </div>

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
