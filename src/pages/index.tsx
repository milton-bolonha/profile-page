import { GetStaticProps } from "next";
import Head from "next/head";
import { getSortedPostsData } from "@/lib/posts";
import { getBusinessSettings, getGeneralSettings } from "@/lib/settings";

import Layout from "@/components/novo-estilo/layout/Layout";
import PageSection from "@/components/novo-estilo/ui/PageSection";
import StoriesSection from "@/components/novo-estilo/ui/StoriesSection";
import TestimonialsSection from "@/components/novo-estilo/ui/TestimonialsSection";
import StatsSection from "@/components/novo-estilo/ui/StatsSection";
import TimelineSection from "@/components/novo-estilo/ui/TimelineSection";
import ComparisonSection from "@/components/novo-estilo/ui/ComparisonSection";
import ScheduleSection from "@/components/novo-estilo/ui/ScheduleSection";
import FAQSection from "@/components/novo-estilo/ui/FAQSection";
import FloatingBadge from "@/components/novo-estilo/ui/FloatingBadge";
import FeatureBox from "@/components/novo-estilo/ui/FeatureBox";
import { getFeaturedPosts, getAllPosts } from "@/lib/posts";
import { Inicio } from "@/components/Home/Inicio"; // Restaurar o hero antigo

interface HomeProps {
  home: any;
  featured: any;
  recent: any;
  businessSettings: any;
  generalSettings: any;
}

const Home = ({
  home,
  featured,
  recent,
  businessSettings,
  generalSettings,
}: HomeProps) => {
  return (
    <Layout>
      <Head>
        {/* SEO básico */}
        <title>
          Guilherme Cirelli — Mentor de Desenvolvedores | Next.js, React,
          Node.js
        </title>
        <meta
          name="description"
          content="Ajudo desenvolvedores a alavancarem suas carreiras com mentoria especializada em Next.js, React e Node.js."
        />
        <meta
          name="keywords"
          content="desenvolvedor full stack, next.js, react, node.js, typescript, desenvolvimento web"
        />
        <link rel="canonical" href={generalSettings.siteUrl} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Guilherme Cirelli — Desenvolvedor Full Stack"
        />
        <meta
          property="og:description"
          content="Desenvolvimento de aplicações web modernas com Next.js, React e Node.js. Veja meu portfolio de projetos."
        />
        <meta property="og:url" content={generalSettings.siteUrl} />
        <meta
          property="og:image"
          content={`${generalSettings.siteUrl}/img/og-image.jpg`}
        />
        <meta
          property="og:image:alt"
          content="Portfolio Guilherme Cirelli - Desenvolvedor Full Stack"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta
          name="twitter:title"
          content="Guilherme Cirelli — Desenvolvedor Full Stack"
        />
        <meta
          name="twitter:description"
          content="Desenvolvimento de aplicações web modernas com Next.js, React e Node.js. Veja meu portfolio de projetos."
        />
        <meta
          name="twitter:image"
          content={`${generalSettings.siteUrl}/img/twitter-image.jpg`}
        />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  name: "Guilherme Cirelli",
                  jobTitle: "Desenvolvedor Full Stack",
                  url: generalSettings.siteUrl,
                  image: `${generalSettings.siteUrl}/img/perfil.jpeg`,
                  sameAs: [
                    "https://github.com/seu-github",
                    "https://linkedin.com/in/seu-linkedin",
                  ],
                  knowsAbout: [
                    "Next.js",
                    "React",
                    "Node.js",
                    "TypeScript",
                    "Desenvolvimento Web Full Stack",
                  ],
                },
                {
                  "@type": "WebSite",
                  name: "Portfolio Guilherme Cirelli",
                  url: generalSettings.siteUrl,
                  description:
                    "Professional portfolio of Guilherme Cirelli, Full Stack developer specialized in Next.js, React and Node.js",
                  inLanguage: "en-US",
                },
              ],
            }),
          }}
        />
      </Head>

      {/* Hero Section antigo, a ser reestilizado */}
      <Inicio />

      {/* Seção de Estatísticas */}
      <StatsSection />

      {/* Seção Sobre */}
      <PageSection
        id="sobre"
        title="Sobre Mim"
        titleSize="text-4xl md:text-6xl"
        vPadding="py-20"
      >
        <div className="text-center">
          <p>Conteúdo sobre o mentor será adicionado aqui.</p>
        </div>
      </PageSection>

      {/* Seção de Projetos */}
      <PageSection
        id="projetos"
        title="Projetos em Destaque"
        titleSize="text-4xl md:text-6xl"
        vPadding="py-20"
      >
        <div className="text-center">
          <p>Os projetos em destaque serão adicionados aqui.</p>
        </div>
      </PageSection>

      {/* Seção de Timeline */}
      <TimelineSection />

      {/* Seção de Testemunhos */}
      <PageSection
        id="testemunhos"
        title="Testemunhos Reais"
        titleSize="text-4xl md:text-6xl"
        subtitle="O que meus mentorados estão dizendo."
        tagline="Feedback"
        isFullHeight
        vPadding="pt-60"
        bgImage="images/bg-1.jpg"
      >
        <TestimonialsSection />
      </PageSection>

      {/* Seção FAQ */}
      <FAQSection />

      {/* Seção de Contato */}
      <PageSection
        id="contato"
        title="Agende Sua Mentoria"
        titleSize="text-6xl relative -top-40 mt-44"
        tagline="Vamos conversar"
        isFullHeight
        vPadding="py-20 pt-30"
        bgImage="images/bg-2.jpg"
      >
        <div className="relative -top-20 mb-20 pb-40 mt-4">
          <div className="flex flex-col items-center justify-center relative -top-20">
            <h2
              className="Geologica text-6xl font-medium"
              style={{ color: "#c54dff" }}
            >
              Agende Já
            </h2>
            <ul
              className="Inter grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 mt-6  "
              style={{ color: "#F4F0FF", fontSize: "16px" }}
            >
              <li>Mentoria de carreira</li>
              <li>Revisão de código</li>
              <li>Preparação para entrevistas</li>
              <li>Desenvolvimento de projetos</li>
              <li>Acelere seu aprendizado</li>
              <li>Tire suas dúvidas</li>
            </ul>
            <a
              href="https://wa.me/5512981062959"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-md px-8 py-3 font-semibold cursor-pointer"
              style={{ backgroundColor: "#6949B1", color: "#FFFFFF" }}
            >
              Agende sua conversa
            </a>
          </div>
        </div>
      </PageSection>

      {/* Badge flutuante */}
      <FloatingBadge />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const home = {}; // homeData;
  const featured = getFeaturedPosts(3);
  const recent = getAllPosts().slice(0, 6);
  const allPostsData = getSortedPostsData(); // Buscar dados dos posts
  const businessSettings = getBusinessSettings();
  const generalSettings = getGeneralSettings();

  return {
    props: {
      home,
      featured,
      recent,
      allPostsData,
      businessSettings,
      generalSettings,
    },
  };
};

export default Home;
