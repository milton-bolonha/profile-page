import React, { useState, useEffect } from "react";
import { FaGamepad, FaCode, FaChalkboardTeacher, FaExpand, FaBriefcase } from "react-icons/fa";
import { Inicio } from "@/components/Home/Inicio";
import { AboutSection } from "@/components/Home/AboutSection";
import { FeaturedProjects } from "@/components/Home/FeaturedProjects";
import { TechStack } from "@/components/Home/TechStack";
import NewTimelineSection from "@/components/Home/NewTimelineSection";
import { NewStatsSection } from "@/components/Home/NewStatsSection";
import { FAQSection } from "@/components/Home/FAQSection";
import { CTASection } from "@/components/Home/CTASection";
import ContactSection from "@/components/Home/ContactSection";
import ExperienceShowcase from "@/components/Home/ExperienceShowcase";
import TestimonialsSection from "@/components/Home/TestimonialsSection";
import { AboutMe as TAboutMe } from "@/types/Home";
import { GetStaticProps } from "next";
import { getSortedPostsData, PostData } from "@/lib/posts";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBusinessSettings, getGeneralSettings, getNavigatorSettings, getThemeSettings, getCategoriesSettings } from "@/lib/settings";
import dynamic from "next/dynamic";
import { GridBackground } from "@/components/commons/GridBackground";

const NeonFlightGame = dynamic(
  () => import("@/components/games/fly/components/NeonFlightGame"),
  { ssr: false }
);

import { ClientOnly } from "@/components/commons/ClientOnly";
import Seo from "@/components/commons/Seo";
import FloatingNavigator from "@/components/commons/FloatingNavigator";
import TransitionAd from "@/components/transitions/TransitionAd";
import { TransitionAdStandalone } from "@/components/transitions/TransitionAdStandalone";
import {
  ScrollContainer,
  SectionWrapper,
} from "@/components/commons/SectionWrapper";
import { SlideshowLayout } from "@/components/layouts/SlideshowLayout";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import homeData from "../../public/home.json";

import { PollSection } from "@/components/Home/PollSection";
import { BottomAdBanner } from "@/components/commons/BottomAdBanner";
import { ImmersiveModal } from "@/components/commons/ImmersiveModal";
import { DebugControls } from "@/components/commons/DebugControls";
import TransitionAdError from "@/components/transitions/TransitionAdError";

interface HomeProps {
  home: {
    aboutMe: TAboutMe;
  };
  allPostsData: PostData[];
  businessSettings: any;
  generalSettings: any;
  navigatorSettings: any;
  themeSettings: any;
  categoriesSettings: any;
}

const HomeContent = ({
  home,
  allPostsData,
  businessSettings,
  generalSettings,
  navigatorSettings,
  themeSettings,
  categoriesSettings
}: HomeProps) => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [adDirection, setAdDirection] = useState<'left' | 'right'>('left');
  const [adVariant, setAdVariant] = useState<'lab' | 'error'>('lab');

  const isMobile = useMediaQuery("(max-width: 768px)");
  const themeLayout = themeSettings?.generalThemeSettings?.layoutMode || 'vertical';
  const layoutMode = themeLayout;

  // SECTIONS (Slides)
  const sections = [
    'inicio',      // 0
    'o-que-faco',  // 1
    'sobre',       // 2
    'projetos',    // 3
    'historia',    // 4
    'faq',         // 5
    // 'poll' removed
    'contato',     // 6
    'cta'          // 7
  ];

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
      const loader = new GLTFLoader();
      loader.load('/games/exp/low-poly_laboratory.glb', () => { console.log('Ad Model Prefetched'); });
      loader.load('/games/exp/i_am_error.glb', () => { console.log('Ad Model Error Prefetched'); });
    });
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // AD TRANSITION LOGIC (Catcher)
  const handleSlideChange = (newIndex: number) => {
    const min = Math.min(currentSlide, newIndex);
    const max = Math.max(currentSlide, newIndex);

    const crossesGate1 = min <= 0 && max >= 1;
    const crossesGate2 = min <= 4 && max >= 5;

    const direction = newIndex > currentSlide ? 'left' : 'right';

    setCurrentSlide(newIndex);

    if (crossesGate1 || crossesGate2) {
      if (!showAd) {
        setAdDirection(direction);

        // Determine Variant - PRIORITY: LAB (Gate 1)
        if (crossesGate1) {
          setAdVariant('lab');
        } else if (crossesGate2) {
          setAdVariant('error');
        }

        setShowAd(true);
      }
    }
  };

  const seoData = {
    title: "Milton Bolonha — Desenvolvedor Full Stack | Next.js, React, Node.js",
    description: "Desenvolvedor Full Stack especializado em Next.js, React e Node.js. Criação de aplicações web modernas, responsivas e escaláveis.",
    siteUrl: generalSettings.siteUrl,
    slug: "/",
    author: "Milton Bolonha",
    keywords: ["desenvolvedor full stack", "next.js", "react", "node.js", "typescript", "desenvolvimento web"],
    featuredImage: `${generalSettings.siteUrl}/img/og-image.jpg`,
    topology: "page" as const,
  };

  return (
    <>
      <Seo data={seoData} />
      <DebugControls />
      <ImmersiveModal />
      <ScrollContainer>
        {!isLoaded && (
          <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60 text-sm">Carregando experiência premium...</p>
            </div>
          </div>
        )}

        {/* Floating Navigator - Hidden during Ad */}
        {!showAd && (
          <FloatingNavigator
            config={navigatorSettings}
            mode={layoutMode}
            currentSlide={currentSlide}
            onNavigate={(index) => handleSlideChange(index)}
            sections={sections}
            isMobile={isMobile}
          />
        )}

        {/* Full Screen Ad Overlay & Banner */}
        {showAd && (
          <>
            <BottomAdBanner />

            {adVariant === 'lab' ? (
              <>
                <TransitionAd
                  direction={adDirection}
                  onComplete={() => setShowAd(false)}
                />
                {/* Poll Overlay only for Lab */}
                <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none">
                  <div className="pointer-events-auto w-full max-w-4xl">
                    <PollSection />
                  </div>
                </div>
              </>
            ) : (
              <TransitionAdError
                direction={adDirection}
                onComplete={() => setShowAd(false)}
              />
            )}
          </>
        )}

        <div className={`transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
          <SlideshowLayout
            mode={layoutMode}
            currentSlide={currentSlide}
            onSlideChange={handleSlideChange}
            sections={sections}
          >
            {/* Slide 0: Hero */}
            <SectionWrapper id="inicio" vPadding="py-0" fullHeight>
              <Inicio />
            </SectionWrapper>

            {/* Slide 1: Showcase Merged */}
            <SectionWrapper
              id="o-que-faco"
              vPadding="pt-24 pb-0"
              className="relative flex flex-col w-full"
              background={<GridBackground />}
            >
              <div className="mb-24">
                <ClientOnly>
                  <ExperienceShowcase
                    badge="+20 Anos de Experiência"
                    title="O Que Faço?"
                    description="Explore as diferentes facetas da minha jornada profissional, desde o desenvolvimento de games imersivos até soluções web inteligentes e mentoria técnica."
                    tabs={[
                      {
                        id: 'web',
                        label: 'IA & Web Apps',
                        icon: FaCode,
                        content: {
                          type: 'slideshow',
                          manualSlideshow: true,
                          slides: [
                            { bg: "/img/thumb-insights-a.jpg", fg: "/img/thumb-insights-b.jpg" }, // Placeholder 1
                            { bg: "/img/thumb-blog-a.jpg", fg: "/img/thumb-blog-b.jpg" }, // Placeholder 2
                            { bg: "/img/thumb-wp-a.jpg", fg: "/img/thumb-wp-b.jpg" }, // Placeholder 3
                          ],
                          buttons: [
                            { text: 'AI Insights', variant: 'primary', link: '#' },
                            { text: 'AI AutoBlog', variant: 'secondary', link: '#' },
                            { text: 'WordPress Sites', variant: 'secondary', link: '#' },
                          ]
                        },
                      },
                      {
                        id: 'game',
                        label: '3D & Game Dev',
                        icon: FaGamepad,
                        content: {
                          type: 'slideshow',
                          manualSlideshow: true,
                          slides: [
                            { bg: "/img/fly-1-a.jpg", fg: "/img/fly-1-b.jpg" },      // Button 1 Hover: Neon Flight
                            { bg: "/img/thumb-stranger-b.jpg", fg: "/img/thumb-stranger-a.jpg" },       // Button 2 Hover: Stranger Craft
                            { bg: "/img/fly-3-a.jpg", fg: "/img/fly-3-b.jpg" },       // Button 3 Hover: Air Flight
                          ],
                          gameComponent: <NeonFlightGame onExit={() => { }} />,
                          buttons: [
                            { text: 'JOGAR DEMO', variant: 'primary', action: 'startGame' },
                            { text: 'Stranger Craft', link: '/games/stranger-craft', variant: 'secondary', icon: FaGamepad },
                            { text: 'Air Flight', link: '/games/airplane', variant: 'secondary', icon: FaGamepad },
                          ],
                        },
                      },
                      {
                        id: 'mentor',
                        label: 'Mentoria',
                        icon: FaChalkboardTeacher,
                        content: {
                          type: 'slideshow',
                          manualSlideshow: true,
                          slides: [
                            { bg: "/img/thumb-mentoria-1-b.jpg", fg: "/img/thumb-mentoria-1-a.jpg" }, // Placeholder 1
                            { bg: "/img/thumb-mentoria-2-b.jpg", fg: "/img/thumb-mentoria-2-a.jpg" }, // Placeholder 2
                          ],
                          buttons: [
                            { text: 'Ver Vídeo', variant: 'primary', link: '#' },
                            {
                              text: 'Falar com o Mentor',
                              variant: 'secondary',
                              link: `https://wa.me/5512981062959?text=${encodeURIComponent("Olá Milton! Vi seu portfólio e gostaria de saber mais sobre a mentoria.")}`,
                              icon: FaChalkboardTeacher
                            },
                          ]
                        },
                      },
                    ]}
                    defaultTab="web"
                  />
                </ClientOnly>
              </div>

              <div className="mb-24">
                <NewStatsSection />
              </div>

              <div className="mb-12">
                <TestimonialsSection />
              </div>
            </SectionWrapper>

            {/* Slide 2: About (Open to Work) - INVERTED GRID */}
            <SectionWrapper
              id="sobre"
              vPadding="pt-0 pb-0"
              background={<GridBackground inverted={true} />}
            >
              <AboutSection />
            </SectionWrapper>

            {/* Slide 3: Featured Projects (Catálogo) */}
            <SectionWrapper
              id="projetos"
              vPadding="pt-24 pb-0"
              background={<GridBackground />}
            >
              <FeaturedProjects categories={categoriesSettings.categories} />
            </SectionWrapper>

            {/* Slide 4: Timeline Section */}
            <SectionWrapper
              id="historia"
              vPadding="pt-12 pb-0"
              background={<GridBackground />}
            >
              <NewTimelineSection />
            </SectionWrapper>

            {/* Slide 5: FAQ Section */}
            <SectionWrapper
              id="faq"
              vPadding="pt-24 pb-0"
              background={<GridBackground />}
            >
              <FAQSection />
            </SectionWrapper>

            {/* Slide 7: Contact Section */}
            <SectionWrapper
              id="contato"
              vPadding="pt-0 pb-0"
              background={<GridBackground />}
            >
              <ContactSection
                contacts={[
                  { name: "LinkedIn", link: "https://www.linkedin.com/in/miltonbolonha/" },
                  { name: "GitHub", link: "https://github.com/miltonbolonha" },
                  { name: "Email", link: "contato@miltonbolonha.com.br", isMail: true },
                  { name: "Baixar Currículo", link: "/files/Curriculo 02072025.pdf", isDownload: true },
                ]}
                title="Entre em Contato"
                formTitle="Envie uma Mensagem"
              />
            </SectionWrapper>

            {/* Slide 8: CTA Final */}
            <SectionWrapper id="cta" vPadding="pt-12 pb-0">
              <CTASection />
            </SectionWrapper>
          </SlideshowLayout>
        </div>
      </ScrollContainer >
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
  const categoriesSettings = getCategoriesSettings();

  return {
    props: {
      home,
      allPostsData,
      businessSettings,
      generalSettings,
      navigatorSettings,
      themeSettings,
      categoriesSettings,
    },
  };
};

export default Home;
